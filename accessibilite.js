// ACCESSIBILITÉ SUR TOUT LE SITE
// 1. Une fenêtre « Accessibilité » s'ouvre depuis chaque œuvre du site (expositions spéciales, générateur, bien-être,
//    page Accessibilité) : description audio, musique des couleurs, partition visuelle et vibrations (Android).
//    Les œuvres sans description écrite à la main reçoivent une description composée automatiquement à partir
//    des informations du musée et des couleurs réelles de l'image (c'est indiqué au visiteur).
// 2. Un menu « Affichage et lecture » (bouton Aa du menu) : texte plus grand, contraste élevé, animations réduites,
//    lecture de la page à voix haute. Les choix sont gardés dans le navigateur du visiteur.
// Ce fichier utilise des fonctions de index.html (esc, analyserCouleurs, programmerMusique, NOTES, peutVibrer…) :
// il doit être chargé après le script principal.

// ---------- Registre des œuvres : chaque bouton « Accessibilité » renvoie à une fiche de ce registre
const OEUVRES_ACCES = [];
function enregistrerOeuvre(o) { OEUVRES_ACCES.push(o); return OEUVRES_ACCES.length - 1; }
// Bouton à placer sous une œuvre ; o = {titre, artiste, date, lieu, musee, image, credit (HTML), description, analyse, art}
function boutonAcces(o, classe) {
  const n = enregistrerOeuvre(o);
  return `<button type="button" class="acc-btn${classe ? ' ' + classe : ''}" onclick="ouvrirAcces(${n},this)"><span aria-hidden="true">🔊 〰️</span> <span>Accessibilité</span></button>`;
}

// ---------- Textes composés : modèle français (clé de i18n.js) avec des emplacements {nom}
function modele(cle, vals) { return t(cle).replace(/\{(\w+)\}/g, (m, k) => (vals[k] == null ? '' : vals[k])); }

// Nom d'une couleur (r, g, b de 0 à 255) en français
function nomCouleur(rgb) {
  const [r, g, b] = rgb.map(x => x / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0; if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h * 60 + 360) % 360; }
  if (l < 0.13) return 'noir';
  if (l > 0.9 && s < 0.35) return 'blanc';
  if (s < 0.14) return l < 0.45 ? 'gris foncé' : 'gris clair';
  if (h >= 18 && h < 55 && l > 0.68 && s < 0.6) return 'beige';
  if (h >= 10 && h < 55 && l < 0.4) return 'brun';
  if (h < 12 || h >= 340) return l > 0.7 ? 'rose' : 'rouge';
  if (h < 40) return 'orange';
  if (h < 68) return l < 0.45 ? 'ocre' : 'jaune';
  if (h < 160) return 'vert';
  if (h < 195) return 'turquoise';
  if (h < 255) return 'bleu';
  if (h < 290) return 'violet';
  return 'rose';
}
function couleursDominantes(v) {
  const vus = [];
  (v.palette || []).forEach(c => { const n = nomCouleur(c.match(/\d+/g).map(Number)); if (!vus.includes(n)) vus.push(n); });
  return vus.slice(0, 3);
}
const virgule = () => (langue === 'ar' ? '، ' : ', ');
function liste(mots) { mots = mots.map(m => t(m)); return mots.length < 2 ? mots.join('') : mots.slice(0, -1).join(virgule()) + (langue === 'ar' ? ' و' : ' ' + t('et') + ' ') + mots[mots.length - 1]; }
// Informations de l'œuvre dans la langue choisie, quand une traduction existe (sinon telles quelles)
const enLangue = x => (x && typeof versLangue === 'function' ? versLangue(String(x)) : x);

// Description audio composée automatiquement (œuvres sans description écrite à la main)
function descriptionAuto(o, v) {
  const p = [];
  p.push(modele('« {titre} »', { titre: enLangue(o.titre) }) + [o.artiste, o.date].filter(Boolean).map(x => virgule() + enLangue(x)).join('') + '.');
  if (o.musee) p.push(modele('Conservée : {musee}.', { musee: enLangue(o.musee) }));
  if (v) {
    const c = couleursDominantes(v);
    if (c.length) p.push(modele('Couleurs dominantes : {couleurs}.', { couleurs: liste(c) }));
    p.push(t(v.lumiere === 'Sombre' ? 'L\'image est plutôt sombre' : v.lumiere === 'Lumineuse' ? 'L\'image est plutôt claire et lumineuse' : 'L\'image est en demi-teintes') +
      virgule() + t(v.S < 0.25 ? 'aux couleurs douces et peu saturées' : v.S < 0.45 ? 'aux couleurs modérément vives' : 'aux couleurs vives et intenses') +
      virgule() + t(v.C < 0.18 ? 'avec peu de contrastes.' : v.C < 0.27 ? 'avec des contrastes marqués.' : 'avec de forts contrastes entre zones claires et sombres.'));
  }
  // Les textes des expositions spéciales n'existent qu'en français : ils ne sont ajoutés que s'ils ont une traduction
  if (o.analyse && (langue === 'fr' || TRAD[o.analyse])) p.push(t(o.analyse));
  return p.join(' ');
}
// « Si cette œuvre était une musique » et rythme des vibrations, déduits des couleurs
function musiqueAuto(v) {
  return modele('Si cette œuvre était une musique, elle serait {mode}, au tempo {vitesse} ({tempo} BPM), avec une énergie {energie}.', {
    mode: t(v.mode === 'majeur' ? 'en mode majeur, plutôt lumineuse' : 'en mode mineur, plutôt grave'),
    vitesse: t(v.tempo < 80 ? 'lent' : v.tempo < 115 ? 'modéré' : 'rapide'), tempo: v.tempo,
    energie: t(v.energie === 'Douce' ? 'douce' : v.energie === 'Modérée' ? 'modérée' : 'forte')
  });
}
function rythmeAuto(v) {
  const temps = Math.round(60000 / v.tempo), impulsion = v.energie === 'Douce' ? 60 : v.energie === 'Modérée' ? 110 : 180;
  const motif = [];
  for (let i = 0; i < 8; i++) { const on = i % 4 === 0 ? Math.round(impulsion * 1.6) : impulsion; motif.push(on, Math.max(60, temps - on)); }
  motif[motif.length - 1] += v.L < 0.45 ? 1400 : 800; // une pause plus longue pour les œuvres sombres
  return motif;
}
function texteVibrationsAuto(v) {
  return modele('Environ {tempo} pulsations par minute, {force}, par séries de huit (la première de chaque groupe de quatre plus appuyée), puis une courte pause.', {
    tempo: v.tempo, force: t(v.energie === 'Douce' ? 'légères' : v.energie === 'Modérée' ? 'moyennes' : 'fortes')
  });
}

// ---------- Fenêtre « Accessibilité »
let accEtat = { o: null, v: null, parle: false, musique: null, anim: null, retour: null };
function creerFenetreAcces() {
  if (document.getElementById('acc-modal')) return;
  const d = document.createElement('div');
  d.id = 'acc-modal'; d.className = 'acc-modal'; d.hidden = true;
  d.innerHTML = `<div class="acc-fond" onclick="fermerAcces()"></div>
  <div class="acc-boite" role="dialog" aria-modal="true" aria-labelledby="am-titre">
    <div class="acc-entete"><div><p class="ey">Accessibilité</p><h2 id="am-titre" tabindex="-1"></h2><p class="am-meta" id="am-meta"></p></div>
      <button type="button" class="back-btn" onclick="fermerAcces()"><span aria-hidden="true">✕</span> Fermer</button></div>
    <div class="acc-corps">
      <div class="acc-image"><img id="am-img" class="zoom" tabindex="0" role="button" aria-haspopup="dialog" alt=""><small class="img-credit" id="am-credit"></small></div>
      <div class="acc-outils">
        <div class="info-box blue-box"><div class="box-lbl blue-lbl"><span aria-hidden="true">🔊</span> Description audio de l'œuvre</div>
          <p class="calc-note" id="am-desc-note"></p>
          <div class="box-text" id="am-desc"></div>
          <button type="button" class="btn-b" id="am-parler" onclick="accParler()"><span aria-hidden="true">▶</span> Écouter la description</button></div>
        <div class="info-box blue-box"><div class="box-lbl blue-lbl"><span aria-hidden="true">🎵</span> Musique des couleurs (synesthésie)</div>
          <button type="button" class="btn-b" id="am-musique" onclick="accMusique()"><span aria-hidden="true">▶</span> Écouter la musique des couleurs</button>
          <p class="music-etat" id="am-musique-etat" aria-live="polite"></p></div>
        <div class="info-box green-box"><div class="box-lbl green-lbl"><span aria-hidden="true">🎼</span> Partition visuelle — rythme de l'œuvre</div>
          <div class="palette" id="am-palette" aria-hidden="true"></div>
          <div class="mstats" id="am-stats"></div>
          <div class="box-text" id="am-musique-texte"></div>
          <div class="vibe-bars" id="am-barres" aria-hidden="true"></div>
          <div class="vibe-text" id="am-vibe-texte"></div>
          <button type="button" class="btn-g" id="am-partition" onclick="accPartition()"></button>
          <p class="vibe-note" id="am-vibe-note"></p></div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(d);
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); fermerAcces(); }
    if (e.key === 'Tab') { // le focus reste dans la fenêtre
      const f = [...d.querySelectorAll('button,a[href],[tabindex="-1"]')].filter(x => x.offsetParent !== null);
      if (!f.length) return; const premier = f[0], dernier = f[f.length - 1];
      if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
      else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
    }
  });
}
const LIB_PARTITION_ACC = () => '<span aria-hidden="true">▶</span> ' + (peutVibrer ? 'Lancer la partition et les vibrations' : 'Lancer la partition visuelle');
function ouvrirAcces(n, bouton) {
  creerFenetreAcces(); accStopTout();
  // Les autres sons du site s'arrêtent
  if (typeof stopSpeak === 'function') stopSpeak(); if (typeof stopVibe === 'function') stopVibe(); if (typeof stopMusique === 'function') stopMusique();
  const o = OEUVRES_ACCES[n]; if (!o) return;
  accEtat.o = o; accEtat.v = null; accEtat.retour = bouton || document.activeElement;
  const $ = id => document.getElementById(id);
  $('am-titre').textContent = o.titre || '';
  $('am-meta').textContent = [o.artiste, o.date, o.lieu, o.musee].filter(Boolean).join(' · ');
  $('am-credit').innerHTML = o.credit ? (/^Image/.test(o.credit) ? o.credit : 'Image : ' + o.credit) : '';
  $('am-desc').textContent = o.description || ''; $('am-desc-note').textContent = '';
  $('am-musique-etat').textContent = ''; $('am-palette').innerHTML = ''; $('am-stats').innerHTML = '';
  $('am-musique-texte').textContent = (o.art && o.art.deaf) || ''; $('am-vibe-texte').textContent = (o.art && o.art.vibe) || '';
  $('am-partition').innerHTML = LIB_PARTITION_ACC();
  $('am-vibe-note').textContent = peutVibrer ? 'Votre appareil peut vibrer : tenez-le en main et lancez la partition pour ressentir le rythme de l\'œuvre.'
    : 'Les vibrations ne fonctionnent que sur les téléphones Android. Sur cet appareil, la partition visuelle traduit le même rythme à l\'écran.';
  $('am-barres').innerHTML = new Array(10).fill(0).map(() => '<span style="height:50%;background:#1D9E75"></span>').join('');
  // Image : on demande l'autorisation d'analyser les couleurs (CORS) ; si le musée la refuse, l'image est montrée sans analyse
  const img = $('am-img'); img.alt = o.titre + (o.artiste ? ', ' + o.artiste : '');
  img.onload = () => accAnalyser(img, o);
  img.onerror = () => { if (img.crossOrigin) { img.removeAttribute('crossorigin'); img.src = o.image; } else accAnalyser(null, o); };
  if (/^https?:/.test(o.image) && !o.image.startsWith(location.origin)) img.crossOrigin = 'anonymous'; else img.removeAttribute('crossorigin');
  img.src = o.image;
  const m = $('acc-modal'); m.hidden = false; document.body.classList.add('acc-ouverte');
  setTimeout(() => $('am-titre').focus(), 30);
}
function accAnalyser(img, o) {
  if (accEtat.o !== o) return;
  let v = null; try { if (img && img.naturalWidth) v = analyserCouleurs(img); } catch (e) { v = null; }
  accEtat.v = v;
  const $ = id => document.getElementById(id);
  if (!o.description) { $('am-desc').textContent = descriptionAuto(o, v); $('am-desc-note').textContent = 'Description composée automatiquement à partir des informations du musée et des couleurs de l\'image : à compléter par une description écrite.'; }
  if (v) {
    $('am-palette').innerHTML = v.palette.map(c => `<span style="background:${c}"></span>`).join('');
    $('am-stats').innerHTML = `<div class="ms">Tempo <b>${v.tempo} BPM</b></div><div class="ms">Tonalité <b><span>${NOTES[v.note]}</span> <span>${v.mode}</span></b></div><div class="ms">Énergie <b>${v.energie}</b></div><div class="ms">Luminosité <b>${v.lumiere}</b></div>`;
    [...$('am-barres').children].forEach((b, i) => { b.style.height = v.barres[i] + '%'; });
    if (!(o.art && o.art.deaf)) $('am-musique-texte').textContent = musiqueAuto(v);
    if (!(o.art && o.art.vibe)) $('am-vibe-texte').textContent = texteVibrationsAuto(v);
  } else {
    $('am-musique-etat').textContent = 'L\'analyse des couleurs n\'a pas pu être faite pour cette image (le musée ne l\'autorise pas) : la musique n\'est pas disponible, la partition suit un rythme par défaut.';
    if (!(o.art && o.art.vibe)) $('am-vibe-texte').textContent = t('Rythme par défaut : environ 72 pulsations par minute, par séries de huit, puis une courte pause.');
  }
}
function accStopTout() {
  if (accEtat.parle && 'speechSynthesis' in window) window.speechSynthesis.cancel(); accEtat.parle = false;
  if (accEtat.musique) { clearTimeout(accEtat.musique.fin); couperMusique(accEtat.musique); accEtat.musique = null; }
  if (accEtat.anim) { cancelAnimationFrame(accEtat.anim); accEtat.anim = null; if (peutVibrer) navigator.vibrate(0); }
  const b1 = document.getElementById('am-parler'), b2 = document.getElementById('am-musique'), b3 = document.getElementById('am-partition');
  if (b1) b1.innerHTML = '<span aria-hidden="true">▶</span> Écouter la description';
  if (b2) b2.innerHTML = '<span aria-hidden="true">▶</span> Écouter la musique des couleurs';
  if (b3) b3.innerHTML = LIB_PARTITION_ACC();
  const barres = document.getElementById('am-barres');
  if (barres && accEtat.v) [...barres.children].forEach((b, i) => { b.style.height = accEtat.v.barres[i] + '%'; b.style.opacity = '1'; });
}
function fermerAcces() {
  accStopTout();
  const m = document.getElementById('acc-modal'); if (m) m.hidden = true;
  document.body.classList.remove('acc-ouverte');
  if (accEtat.retour && accEtat.retour.focus) accEtat.retour.focus();
}
function accParler() {
  if (accEtat.parle) { accStopTout(); return; }
  if (!('speechSynthesis' in window)) { alert(t('Synthèse vocale non supportée dans ce navigateur.')); return; }
  accStopTout();
  const texte = document.getElementById('am-desc').textContent; // déjà traduite à l'affichage si une traduction existe
  const u = new SpeechSynthesisUtterance(texte); u.lang = LANGUES[langue];
  u.onend = u.onerror = () => { accEtat.parle = false; const b = document.getElementById('am-parler'); if (b) b.innerHTML = '<span aria-hidden="true">▶</span> Écouter la description'; };
  accEtat.parle = true; document.getElementById('am-parler').innerHTML = '<span aria-hidden="true">⏹</span> Arrêter la lecture';
  window.speechSynthesis.speak(u);
}
function accMusique() {
  if (accEtat.musique) { accStopTout(); document.getElementById('am-musique-etat').textContent = ''; return; }
  const v = accEtat.v;
  if (!v) { document.getElementById('am-musique-etat').textContent = 'L\'analyse des couleurs n\'a pas pu être faite sur cet appareil.'; return; }
  accStopTout();
  const m = programmerMusique(v);
  accEtat.musique = { sortie: m.sortie, fin: setTimeout(() => { accStopTout(); document.getElementById('am-musique-etat').textContent = 'Musique terminée.'; }, m.duree) };
  document.getElementById('am-musique').innerHTML = '<span aria-hidden="true">⏹</span> Arrêter la musique';
  document.getElementById('am-musique-etat').innerHTML = `<span>Lecture en cours</span> · ${v.tempo} BPM · <span>${NOTES[v.note]}</span> <span>${v.mode}</span>`;
}
function accPartition() {
  if (accEtat.anim) { accStopTout(); return; }
  accStopTout();
  const o = accEtat.o, v = accEtat.v;
  const motif = (o.art && o.art.rythme) || (v ? rythmeAuto(v) : rythmeAuto({ tempo: 72, energie: 'Modérée', L: 0.5 }));
  const boucle = motif.reduce((a, b) => a + b, 0);
  if (peutVibrer) { const p = []; for (let x = 0; x < DUREE_PARTITION; x += boucle) p.push(...motif); navigator.vibrate(p); }
  const barres = [...document.getElementById('am-barres').children], base = v ? v.barres : barres.map(() => 60), debut = performance.now();
  document.getElementById('am-partition').innerHTML = '<span aria-hidden="true">⏹</span> Arrêter';
  const anim = maintenant => {
    const ecoule = maintenant - debut;
    if (ecoule > DUREE_PARTITION) { accStopTout(); return; }
    let x = ecoule % boucle, force = 0;
    for (let k = 0; k < motif.length; k++) { if (x < motif[k]) { force = k % 2 === 0 ? 1 : Math.max(0, 1 - x / 350); break; } x -= motif[k]; }
    barres.forEach((b, i) => { b.style.height = Math.max(8, base[i] * (0.35 + 0.65 * force)) + '%'; b.style.opacity = (0.45 + 0.55 * force).toFixed(2); });
    accEtat.anim = requestAnimationFrame(anim);
  };
  accEtat.anim = requestAnimationFrame(anim);
}

// ---------- Œuvres de la page Accessibilité : les 4 œuvres décrites à la main deviennent aussi des fiches du registre
function ficheArt(i) {
  const a = ART[i];
  const [artiste, lieu, date, musee] = a.meta.split(' · ');
  return { titre: a.name, artiste, lieu, date, musee, image: a.img, credit: a.credit, description: a.blind, art: { deaf: a.deaf, vibe: a.vibe, rythme: RYTHMES[i] } };
}

// ---------- Menu « Affichage et lecture », sur toutes les pages
const OPTIONS_AFFICHAGE = ['grand-texte', 'contraste', 'sans-animation'];
function appliquerOptions() {
  let o = {}; try { o = JSON.parse(localStorage.getItem('jrb-affichage') || '{}'); } catch (e) {}
  OPTIONS_AFFICHAGE.forEach(k => {
    document.documentElement.classList.toggle(k, !!o[k]);
    const b = document.querySelector(`[data-option="${k}"]`); if (b) b.setAttribute('aria-pressed', !!o[k]);
  });
}
function basculerOption(k) {
  let o = {}; try { o = JSON.parse(localStorage.getItem('jrb-affichage') || '{}'); } catch (e) {}
  o[k] = !document.documentElement.classList.contains(k);
  try { localStorage.setItem('jrb-affichage', JSON.stringify(o)); } catch (e) {}
  document.documentElement.classList.toggle(k, o[k]);
  const b = document.querySelector(`[data-option="${k}"]`); if (b) b.setAttribute('aria-pressed', o[k]);
}
let lecturePage = false;
function lirePage() {
  const b = document.getElementById('lire-page');
  if (lecturePage) { window.speechSynthesis.cancel(); lecturePage = false; b.innerHTML = '<span aria-hidden="true">🔊</span> Lire la page à voix haute'; return; }
  if (!('speechSynthesis' in window)) { alert(t('Synthèse vocale non supportée dans ce navigateur.')); return; }
  if (typeof stopSpeak === 'function') stopSpeak(); accStopTout();
  const page = document.querySelector('.pg.on') || document.querySelector('main');
  // On lit le texte visible, sans les crédits d'images ni les boutons
  const copie = page.cloneNode(true);
  copie.querySelectorAll('.img-credit,button,script,style,[aria-hidden="true"],.filigrane').forEach(x => x.remove());
  const texte = copie.innerText || copie.textContent;
  const morceaux = texte.replace(/\s*\n\s*/g, '. ').replace(/\.\s*\./g, '.').match(/[^.!?]{1,220}[.!?]?/g) || [];
  lecturePage = true; b.innerHTML = '<span aria-hidden="true">⏹</span> Arrêter la lecture';
  window.speechSynthesis.cancel();
  morceaux.forEach((m, i) => {
    const u = new SpeechSynthesisUtterance(m); u.lang = LANGUES[langue];
    if (i === morceaux.length - 1) u.onend = () => { lecturePage = false; b.innerHTML = '<span aria-hidden="true">🔊</span> Lire la page à voix haute'; };
    window.speechSynthesis.speak(u);
  });
}
function basculerMenuAffichage(e) {
  const m = document.getElementById('menu-affichage'), b = document.getElementById('btn-affichage');
  const ouvrir = m.hidden; m.hidden = !ouvrir; b.setAttribute('aria-expanded', ouvrir);
  if (ouvrir) m.querySelector('button').focus();
}
(function installerMenuAffichage() {
  const nav = document.querySelector('nav .langs'); if (!nav) return;
  const w = document.createElement('div'); w.className = 'affichage';
  w.innerHTML = `<button type="button" id="btn-affichage" class="btn-affichage" aria-expanded="false" aria-controls="menu-affichage" aria-label="Affichage et lecture" title="Affichage et lecture" onclick="basculerMenuAffichage()">Aa</button>
    <div class="menu-affichage" id="menu-affichage" hidden>
      <p class="ey">Affichage et lecture</p>
      <button type="button" data-option="grand-texte" aria-pressed="false" onclick="basculerOption('grand-texte')"><span aria-hidden="true">🔠</span> Texte plus grand</button>
      <button type="button" data-option="contraste" aria-pressed="false" onclick="basculerOption('contraste')"><span aria-hidden="true">◐</span> Contraste élevé</button>
      <button type="button" data-option="sans-animation" aria-pressed="false" onclick="basculerOption('sans-animation')"><span aria-hidden="true">⏸</span> Réduire les animations</button>
      <button type="button" id="lire-page" onclick="lirePage()"><span aria-hidden="true">🔊</span> Lire la page à voix haute</button>
    </div>`;
  nav.parentNode.insertBefore(w, nav);
  document.addEventListener('click', e => { const m = document.getElementById('menu-affichage'); if (m && !m.hidden && !w.contains(e.target)) { m.hidden = true; document.getElementById('btn-affichage').setAttribute('aria-expanded', 'false'); } });
  w.addEventListener('keydown', e => { if (e.key === 'Escape') { const m = document.getElementById('menu-affichage'); m.hidden = true; const b = document.getElementById('btn-affichage'); b.setAttribute('aria-expanded', 'false'); b.focus(); } });
  appliquerOptions();
})();

// ---------- Page Accessibilité : toutes les œuvres de la collection et des expositions, chacune avec sa fenêtre Accessibilité
function afficherAutresOeuvresAcces() {
  const zone = document.getElementById('acc-autres'); if (!zone || zone.dataset.fait) return;
  zone.dataset.fait = '1';
  Promise.all([chargerCollection().catch(() => []), Promise.resolve(expos)]).then(([col]) => {
    const fiches = [];
    (expos || []).filter(e => e.status === 'published').forEach(e => e.works.forEach(w => { if (w.image) fiches.push({ titre: w.title, artiste: w.artist, date: w.period, lieu: w.country, musee: w.museum, image: w.image, credit: w.credit ? lienCredit(w.credit) : '', analyse: w.analysis, sensible: w.sensible }); }));
    (col || []).forEach(w => { if (w.image) fiches.push({ titre: w.title, artiste: w.artist, date: w.date, lieu: w.place, musee: w.museum, image: w.image, credit: w.credit ? lienCredit(w.credit) : '', sensible: w.sensible }); });
    const vus = new Set(ART.map(a => a.img));
    zone.innerHTML = fiches.filter(f => !vus.has(f.image) && (vus.add(f.image), true)).map(f =>
      `<div class="mini acc-mini">${imageOeuvre(f.image, f.titre + (f.artiste ? ', ' + f.artiste : ''), '', f.sensible)}<div class="mini-info"><b>${esc(f.titre)}</b><span>${[f.artiste, f.date].filter(Boolean).map(esc).join(' · ')}</span>${boutonAcces(f)}</div></div>`).join('');
  });
}
