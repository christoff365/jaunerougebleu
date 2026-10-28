// DIAPORAMA DES EXPOSITIONS
// Le bouton « Diaporama » d'une exposition (spéciale ou créée avec le générateur) montre les œuvres en grand,
// l'une après l'autre, en plein écran, et lit leur commentaire à voix haute : pour un ordinateur, une tablette,
// un téléphone ou une télévision (navigateur de la télévision, écran partagé ou câble HDMI).
// À l'écran : l'œuvre seule, avec une petite légende (titre et crédit de l'image, exigé par les licences).
// On passe à l'œuvre suivante quand la lecture est finie ; voix coupée (ou navigateur sans synthèse vocale),
// chaque œuvre reste 30 secondes (15 à 90 s au choix). Sous-titres facultatifs pour lire ce qui est dit.
// Commandes : flèches ← → (ou glisser le doigt) pour changer d'œuvre, Espace ou OK pour la pause,
// Échap ou Retour pour quitter.
// Les œuvres sont lues dans la page au moment où on les montre : celles qui arrivent des musées pendant
// le diaporama y entrent aussi, celles dont l'image ne se charge pas en sortent.
// Ce fichier utilise des fonctions de index.html (grandeImage) et de i18n.js (t, langue, LANGUES) :
// il doit être chargé après eux.

const DUREES_DIAPO = [15, 30, 45, 60, 90];
const SYNTHESE = 'speechSynthesis' in window;
let diapo = null; // diaporama ouvert

function reglagesDiapo() {
  let r = {};
  try { r = JSON.parse(localStorage.getItem('jrb-diaporama')) || {}; } catch (e) {}
  return { duree: DUREES_DIAPO.includes(r.duree) ? r.duree : 30, boucle: !!r.boucle, voix: r.voix !== false, st: !!r.st };
}
function garderReglageDiapo(cle, val) { const r = reglagesDiapo(); r[cle] = val; try { localStorage.setItem('jrb-diaporama', JSON.stringify(r)); } catch (e) {} }
const voixActive = () => SYNTHESE && reglagesDiapo().voix;

// Copie d'un morceau de la page, remise en français : la traduction de la page la traduit ensuite dans la langue choisie
function copieFr(el) {
  const c = el.cloneNode(true);
  const a = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), b = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
  let n, m;
  while ((n = a.nextNode()) && (m = b.nextNode())) if (n.__fr && n.__tr === n.nodeValue) m.nodeValue = n.__fr;
  c.querySelectorAll('button,.acc-btn').forEach(x => x.remove());
  c.removeAttribute('id'); c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id'));
  return c;
}

// ---------- Lecture à voix haute
// Langue de lecture d'un texte de la page : celle qu'il indique (titres des musées étrangers), la langue choisie
// s'il a été traduit, sinon le français (les commentaires ne sont pas tous traduits : une voix arabe lirait mal du français)
const VOIX_LANGUES = { fr: 'fr-FR', en: 'en-GB', es: 'es-ES', ar: 'ar-SA', de: 'de-DE', it: 'it-IT', nl: 'nl-NL', pt: 'pt-PT', ja: 'ja-JP' };
function langueDe(el) {
  const l = el.closest('[lang]') && el.closest('[lang]').getAttribute('lang');
  if (l && l !== document.documentElement.lang) return VOIX_LANGUES[l.slice(0, 2)] || l;
  if (langue === 'fr') return LANGUES.fr;
  return copieFr(el).textContent.trim() === el.textContent.trim() ? LANGUES.fr : LANGUES[langue];
}
// Phrases courtes : certains navigateurs coupent une lecture trop longue
// (sans couper après une abréviation : « av. J.-C. », « vers 1500 apr. J.-C. »…), abréviations des dates lues en entier
const ABREGES_LUS = [[/\bav\. J\.-C\./g, 'avant Jésus-Christ'], [/\bapr\. J\.-C\./g, 'après Jésus-Christ'], [/\bJ\.-C\./g, 'Jésus-Christ']];
function phrases(texte, lang) {
  let x = String(texte).replace(/\s+/g, ' ');
  if (lang.startsWith('fr')) ABREGES_LUS.forEach(([re, mot]) => { x = x.replace(re, mot); });
  return x.split(/(?<=[.!?;])(?<!\b(?:av|apr|env|c|ca|St|Ste|M|Mme|Dr|no|vol|p)\.)\s+/).flatMap(p => p.length > 220 ? p.split(/(?<=,)\s+/) : [p])
    .map(p => p.trim()).filter(p => /[\p{L}\p{N}]/u.test(p)).map(p => ({ texte: p, lang }));
}
function voixPour(lang) {
  const v = SYNTHESE ? speechSynthesis.getVoices() : [];
  return v.find(x => x.lang.replace('_', '-') === lang) || v.find(x => x.lang.slice(0, 2) === lang.slice(0, 2)) || null;
}

function lancerDiaporama(idZone, idTitre, idSous) {
  const zone = document.getElementById(idZone);
  if (!zone || diapo) return;
  if (![...zone.querySelectorAll('.wk-card:not(.wk-attente),.mini')].some(c => c.querySelector('img'))) return;
  const r = reglagesDiapo();
  const d = document.createElement('div');
  d.id = 'diapo'; d.className = 'diapo'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-label', 'Diaporama');
  d.innerHTML = `<div class="diapo-prog"><span id="diapo-barre"></span></div>
<div class="diapo-scene" id="diapo-scene"></div>
<p class="diapo-st" id="diapo-st" hidden></p>
<div class="diapo-cmd" id="diapo-cmd">
  <button type="button" id="diapo-prec" aria-label="Œuvre précédente"><span aria-hidden="true">⏮</span></button>
  <button type="button" id="diapo-pause" aria-label="Pause"><span aria-hidden="true">⏸</span></button>
  <button type="button" id="diapo-suiv" aria-label="Œuvre suivante"><span aria-hidden="true">⏭</span></button>
  <span class="diapo-num" id="diapo-num" aria-live="polite"></span>
  ${SYNTHESE ? '<button type="button" id="diapo-voix" aria-pressed="true"><span aria-hidden="true">🔊</span> <span>Voix</span></button>' : ''}
  <label class="diapo-reg"><input type="checkbox" id="diapo-soustitres"${r.st || !SYNTHESE ? ' checked' : ''}> <span>Sous-titres</span></label>
  <label class="diapo-reg" id="diapo-reg-duree"><span>Durée par œuvre</span> <select id="diapo-duree">${DUREES_DIAPO.map(s => `<option value="${s}"${s === r.duree ? ' selected' : ''}>${s} s</option>`).join('')}</select></label>
  <label class="diapo-reg"><input type="checkbox" id="diapo-boucle"${r.boucle ? ' checked' : ''}> <span>En boucle</span></label>
  <button type="button" id="diapo-quitter" class="diapo-quitter"><span aria-hidden="true">✕</span> <span>Quitter</span></button>
</div>`;
  document.body.appendChild(d);
  diapo = { zone, d, idTitre, idSous, carte: null, pause: false, fin: false, minuterie: null, debut: 0, reste: 0, minuterieEnCours: false,
    segs: [], iSeg: 0, jeton: 0, wakeLock: null, pleinEcran: false, retour: document.activeElement, masquer: null };
  document.documentElement.classList.add('diapo-ouvert');
  d.querySelector('#diapo-prec').onclick = () => changerDiapo(-1);
  d.querySelector('#diapo-suiv').onclick = () => changerDiapo(1);
  d.querySelector('#diapo-pause').onclick = basculerPauseDiapo;
  d.querySelector('#diapo-quitter').onclick = fermerDiaporama;
  if (SYNTHESE) d.querySelector('#diapo-voix').onclick = () => { garderReglageDiapo('voix', !reglagesDiapo().voix); majVoixDiapo(); diapo.minuterieEnCours = false; demarrerDiapo(); };
  d.querySelector('#diapo-soustitres').onchange = e => { garderReglageDiapo('st', e.target.checked); majSousTitre(); };
  d.querySelector('#diapo-duree').onchange = e => { garderReglageDiapo('duree', +e.target.value); diapo.minuterieEnCours = false; if (!voixActive()) demarrerDiapo(); };
  d.querySelector('#diapo-boucle').onchange = e => garderReglageDiapo('boucle', e.target.checked);
  // Toucher : glisser vers la gauche ou la droite change d'œuvre ; un toucher affiche les commandes
  let x0 = null, y0 = null;
  d.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; montrerCmdDiapo(); }, { passive: true });
  d.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > 2 * Math.abs(dy)) changerDiapo((dx < 0) === (document.body.dir !== 'rtl') ? 1 : -1);
  });
  d.addEventListener('mousemove', montrerCmdDiapo);
  document.addEventListener('keydown', toucheDiapo, true);
  document.addEventListener('visibilitychange', garderEcranAllume);
  document.addEventListener('fullscreenchange', sortiePleinEcran);
  if (d.requestFullscreen) d.requestFullscreen().then(() => { if (diapo) diapo.pleinEcran = true; }).catch(() => {});
  garderEcranAllume();
  majVoixDiapo();
  afficherDiapo(null);
  d.querySelector('#diapo-pause').focus({ preventScroll: true });
  montrerCmdDiapo();
}

function fermerDiaporama() {
  if (!diapo) return;
  const { d, retour } = diapo;
  arreterDiapo();
  clearTimeout(diapo.masquer);
  if (diapo.wakeLock) diapo.wakeLock.release().catch(() => {});
  document.removeEventListener('keydown', toucheDiapo, true);
  document.removeEventListener('visibilitychange', garderEcranAllume);
  document.removeEventListener('fullscreenchange', sortiePleinEcran);
  diapo = null;
  if (document.fullscreenElement === d && document.exitFullscreen) document.exitFullscreen().catch(() => {});
  d.remove();
  document.documentElement.classList.remove('diapo-ouvert');
  if (retour && retour.focus) retour.focus({ preventScroll: true });
}
// Échap fait sortir du plein écran : on ferme alors le diaporama
function sortiePleinEcran() { if (diapo && diapo.pleinEcran && !document.fullscreenElement) fermerDiaporama(); }

// L'écran ne se met pas en veille pendant le diaporama (si le navigateur le permet)
function garderEcranAllume() {
  if (!diapo || document.visibilityState !== 'visible' || !navigator.wakeLock) return;
  navigator.wakeLock.request('screen').then(w => { if (diapo) diapo.wakeLock = w; else w.release(); }).catch(() => {});
}

// Les commandes disparaissent après quelques secondes sans mouvement, et reviennent au moindre geste
function montrerCmdDiapo() {
  if (!diapo) return;
  diapo.d.classList.remove('cmd-cachees');
  clearTimeout(diapo.masquer);
  diapo.masquer = setTimeout(() => { if (diapo && !diapo.pause && !diapo.d.querySelector('.diapo-cmd :focus-visible,select:focus')) diapo.d.classList.add('cmd-cachees'); }, 4000);
}

function toucheDiapo(e) {
  if (!diapo) return;
  const k = e.key, rtl = document.body.dir === 'rtl', dansReglage = e.target.closest && e.target.closest('select,input');
  montrerCmdDiapo();
  const suivant = rtl ? 'ArrowLeft' : 'ArrowRight', precedent = rtl ? 'ArrowRight' : 'ArrowLeft';
  let fait = true;
  if (k === suivant || k === 'MediaTrackNext' || k === 'MediaFastForward' || k === 'PageDown') changerDiapo(1);
  else if (k === precedent || k === 'MediaTrackPrevious' || k === 'MediaRewind' || k === 'PageUp') changerDiapo(-1);
  else if (k === 'MediaPlayPause' || k === 'MediaPlay' || k === 'MediaPause') basculerPauseDiapo();
  else if ((k === ' ' || k === 'Enter') && !dansReglage && !(e.target.closest && e.target.closest('button,a'))) basculerPauseDiapo();
  // Échap, ou la touche Retour des télécommandes (Samsung : 10009, LG : 461)
  else if (k === 'Escape' || k === 'GoBack' || k === 'BrowserBack' || e.keyCode === 10009 || e.keyCode === 461) fermerDiaporama();
  else fait = false;
  if (fait) { e.preventDefault(); e.stopPropagation(); }
}

// Œuvres de l'exposition affichée, dans l'ordre de la page
function cartesDiapo() {
  return [...diapo.zone.querySelectorAll('.wk-card:not(.wk-attente),.mini')].filter(c => c.querySelector('img'));
}

function changerDiapo(sens) {
  if (!diapo) return;
  const cartes = cartesDiapo();
  if (!cartes.length) { fermerDiaporama(); return; }
  let i = diapo.carte ? cartes.indexOf(diapo.carte) : -1;
  if (diapo.carte && i < 0) i = diapo.dernierIndex - (sens > 0 ? 1 : 0); // l'œuvre affichée a été retirée de la page
  i += sens;
  if (i < -1) i = cartes.length - 1; // depuis la page de titre, ← va à la dernière œuvre
  if (i >= cartes.length) {
    if (!reglagesDiapo().boucle) { afficherFinDiapo(); return; }
    i = -1;
  }
  if (diapo.fin) { diapo.pause = false; majBoutonPause(); }
  afficherDiapo(i < 0 ? null : cartes[i]);
}

function remplacerScene(nouv) {
  const scene = diapo.d.querySelector('#diapo-scene');
  scene.querySelectorAll('.diapo-diap').forEach(v => { v.classList.add('sortie'); setTimeout(() => v.remove(), 700); });
  // Textes restés en français sur la page arabe : chaque bloc prend le sens de lecture de sa propre langue
  nouv.querySelectorAll('h2,p,.diapo-leg').forEach(x => x.setAttribute('dir', 'auto'));
  scene.appendChild(nouv);
  requestAnimationFrame(() => requestAnimationFrame(() => nouv.classList.add('on')));
}

// Une diapositive : la page de titre de l'exposition (carte = null), puis chaque œuvre, seule à l'écran
function afficherDiapo(carte) {
  const cartes = cartesDiapo();
  diapo.carte = carte; diapo.fin = false; diapo.minuterieEnCours = false;
  const nouv = document.createElement('div');
  const segs = [];
  if (!carte) {
    nouv.className = 'diapo-diap diapo-titre';
    const h = document.getElementById(diapo.idTitre), s = document.getElementById(diapo.idSous);
    const intro = diapo.idSous === 'sp-sub' ? document.getElementById('sp-intro') : null;
    if (h) { nouv.appendChild(Object.assign(document.createElement('h2'), { className: 'diapo-h' })).append(...copieFr(h).childNodes); segs.push(...phrases(h.textContent + '.', langueDe(h))); }
    if (s && s.textContent.trim()) { nouv.appendChild(Object.assign(document.createElement('p'), { className: 'diapo-sous' })).append(...copieFr(s).childNodes); segs.push(...phrases(s.textContent + '.', langueDe(s))); }
    if (intro && intro.textContent.trim()) segs.push(...phrases(intro.textContent, langueDe(intro)));
    document.getElementById('diapo-num').textContent = cartes.length + ' œuvres';
  } else {
    diapo.dernierIndex = cartes.indexOf(carte);
    nouv.className = 'diapo-diap';
    const img = carte.querySelector('img'), floue = carte.querySelector('.sensible:not(.vu)');
    const cadre = document.createElement('div'); cadre.className = 'diapo-cadre' + (floue ? ' sensible' : '');
    const g = document.createElement('img');
    const petite = img.currentSrc || img.src;
    g.alt = img.__frA && img.__frA.alt || img.alt;
    g.onerror = () => { if (g.src !== petite) g.src = petite; else if (diapo && diapo.carte === carte) changerDiapo(1); };
    g.src = grandeImage(petite);
    cadre.appendChild(g);
    if (floue) {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = 'Image sensible — afficher l\'image';
      b.onclick = () => { cadre.classList.add('vu'); b.remove(); floue.classList.add('vu'); const o = floue.querySelector('button'); if (o) o.remove(); };
      cadre.appendChild(b);
    }
    // Petite légende : titre et crédit de l'image (les licences CC BY demandent de citer l'auteur et la licence)
    const leg = document.createElement('div'); leg.className = 'diapo-leg';
    const titre = carte.querySelector('h3,.mini-info b');
    if (titre) { const b = document.createElement('b'); if (titre.lang) b.lang = titre.lang; b.append(...copieFr(titre).childNodes); leg.appendChild(b); }
    const credit = carte.querySelector('.img-credit');
    if (credit) { const x = copieFr(credit); x.className = 'img-credit'; leg.appendChild(x); }
    nouv.append(cadre, leg);
    // Ce qui est lu : titre, informations (artiste, date, pays, musée), commentaire, point de comparaison
    if (titre) segs.push(...phrases(titre.textContent + '.', langueDe(titre)));
    const infos = carte.classList.contains('mini') ? [...carte.querySelectorAll('.mini-info > span:not(.pastille-direct)')] : [carte.querySelector('.wk-top p')];
    // Informations « artiste · date · pays · musée » : chaque morceau est lu dans sa langue (traduit ou non)
    infos.filter(Boolean).forEach(p => {
      const lus = p.textContent.split(' · '), fr = copieFr(p).textContent.split(' · '), l = langueDe(p);
      const parLangue = [];
      lus.forEach((m, i) => {
        const lm = langue === 'fr' || l !== LANGUES[langue] || lus.length !== fr.length ? l : (m.trim() === fr[i].trim() ? LANGUES.fr : LANGUES[langue]);
        const der = parLangue[parLangue.length - 1];
        if (der && der.lang === lm) der.texte += ', ' + m; else parLangue.push({ texte: m, lang: lm });
      });
      parLangue.forEach(x => segs.push(...phrases(x.texte + '.', x.lang)));
    });
    const ana = carte.querySelector('.wk-ana');
    if (ana) segs.push(...phrases(ana.textContent, langueDe(ana)));
    const cmp = carte.querySelector('.cmp-pt');
    if (cmp) {
      const l = cmp.querySelector('.cmp-l'), reste = cmp.textContent.slice(l ? l.textContent.length : 0);
      if (l) segs.push(...phrases(l.textContent + '.', langueDe(l)));
      // Langue du texte de comparaison seul (sans son intitulé, traduit, lui)
      const frCmp = copieFr(cmp), lFr = frCmp.querySelector('.cmp-l'); if (lFr) lFr.remove();
      segs.push(...phrases(reste, langue === 'fr' || frCmp.textContent.trim() !== reste.trim() ? langueDe(cmp) : LANGUES.fr));
    }
    document.getElementById('diapo-num').textContent = (cartes.indexOf(carte) + 1) + ' / ' + cartes.length;
    // L'œuvre suivante est préchargée pour un passage sans attente
    const suiv = cartes[cartes.indexOf(carte) + 1];
    if (suiv) { const p = suiv.querySelector('img'); if (p) new Image().src = grandeImage(p.currentSrc || p.src); }
  }
  remplacerScene(nouv);
  diapo.segs = segs; diapo.iSeg = 0;
  demarrerDiapo();
}

function afficherFinDiapo() {
  arreterDiapo();
  diapo.fin = true; diapo.carte = null; diapo.dernierIndex = cartesDiapo().length;
  const nouv = document.createElement('div'); nouv.className = 'diapo-diap diapo-titre';
  nouv.innerHTML = '<h2 class="diapo-h">Fin de l\'exposition</h2><p class="diapo-sous">Merci de votre visite</p>';
  remplacerScene(nouv);
  diapo.d.querySelector('#diapo-barre').style.width = '100%';
  diapo.segs = []; majSousTitre();
  if (voixActive()) {
    const u = new SpeechSynthesisUtterance(t('Fin de l\'exposition') + '. ' + t('Merci de votre visite') + '.');
    u.lang = LANGUES[langue]; const v = voixPour(u.lang); if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  diapo.pause = true; majBoutonPause();
}

// ---------- Déroulement : lecture à voix haute, ou minuterie quand la voix est coupée
function arreterDiapo() {
  diapo.jeton++;
  clearTimeout(diapo.minuterie); clearTimeout(diapo.secours); clearInterval(diapo.defile);
  if (SYNTHESE) speechSynthesis.cancel();
}
// (Re)lance la diapositive affichée là où elle en était (à la phrase en cours, ou au temps restant)
function demarrerDiapo() {
  arreterDiapo();
  majSousTitre();
  if (diapo.pause || diapo.fin) { majBarre(); return; }
  if (voixActive() && diapo.segs.length) { parlerDiapo(); return; }
  if (!diapo.minuterieEnCours) { diapo.reste = reglagesDiapo().duree * 1000; diapo.minuterieEnCours = true; }
  diapo.debut = Date.now();
  diapo.minuterie = setTimeout(() => changerDiapo(1), diapo.reste);
  diapo.defile = setInterval(majBarre, 100);
}
function parlerDiapo() {
  const jeton = ++diapo.jeton;
  majBarre(); majSousTitre();
  if (diapo.iSeg >= diapo.segs.length) { diapo.minuterie = setTimeout(() => { if (diapo && diapo.jeton === jeton) changerDiapo(1); }, 2500); return; }
  const s = diapo.segs[diapo.iSeg];
  const u = new SpeechSynthesisUtterance(s.texte); u.lang = s.lang;
  const v = voixPour(s.lang); if (v) u.voice = v;
  u.rate = 0.95;
  const suite = () => { if (!diapo || diapo.jeton !== jeton) return; clearTimeout(diapo.secours); diapo.iSeg++; parlerDiapo(); };
  u.onend = suite;
  u.onerror = e => { if (e.error !== 'interrupted' && e.error !== 'canceled') suite(); };
  // Certains navigateurs (télévisions) ne signalent pas toujours la fin de la lecture : on continue quand même
  diapo.secours = setTimeout(suite, 4000 + s.texte.length * 120);
  speechSynthesis.speak(u);
}

function majBarre() {
  if (!diapo) return;
  let f;
  if (voixActive() && diapo.segs.length) f = diapo.iSeg / diapo.segs.length;
  else if (!diapo.minuterieEnCours) f = 0;
  else { const total = reglagesDiapo().duree * 1000; f = 1 - (diapo.reste - (diapo.pause ? 0 : Date.now() - diapo.debut)) / total; }
  diapo.d.querySelector('#diapo-barre').style.width = Math.max(0, Math.min(100, 100 * f)) + '%';
}
function majSousTitre() {
  if (!diapo) return;
  const st = diapo.d.querySelector('#diapo-st'), voix = voixActive();
  const s = voix ? diapo.segs[diapo.iSeg] : diapo.segs[0];
  st.hidden = !(diapo.d.querySelector('#diapo-soustitres').checked && s);
  if (st.hidden) return;
  // Avec la voix : la phrase en cours de lecture ; sans la voix : tout le texte de l'œuvre
  st.textContent = voix ? s.texte : diapo.segs.map(x => x.texte).join(' ');
  st.lang = s.lang.slice(0, 2); st.dir = 'auto';
}
function majVoixDiapo() {
  const b = diapo.d.querySelector('#diapo-voix'), on = voixActive();
  if (b) { b.setAttribute('aria-pressed', on); b.firstElementChild.textContent = on ? '🔊' : '🔇'; }
  diapo.d.querySelector('#diapo-reg-duree').hidden = on;
}

function basculerPauseDiapo() {
  if (!diapo) return;
  if (diapo.fin) { changerDiapo(1); return; } // après la fin : on recommence
  if (diapo.pause) { diapo.pause = false; demarrerDiapo(); }
  else {
    if (diapo.minuterieEnCours && !voixActive()) diapo.reste -= Date.now() - diapo.debut;
    diapo.pause = true; arreterDiapo(); majBarre();
  }
  majBoutonPause(); montrerCmdDiapo();
}
function majBoutonPause() {
  const b = diapo.d.querySelector('#diapo-pause');
  b.setAttribute('aria-label', diapo.pause ? 'Reprendre le diaporama' : 'Pause');
  b.firstElementChild.textContent = diapo.pause ? '▶' : '⏸';
  diapo.d.classList.toggle('en-pause', diapo.pause);
}
