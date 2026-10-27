// DIAPORAMA DES EXPOSITIONS
// Le bouton « Diaporama » d'une exposition (spéciale ou créée avec le générateur) affiche les œuvres en grand,
// l'une après l'autre, avec leur commentaire, en plein écran : pour un ordinateur, une tablette, un téléphone
// ou une télévision (navigateur de la télévision, écran partagé ou câble HDMI).
// Commandes : flèches ← → (ou glisser le doigt) pour changer d'œuvre, Espace ou OK pour la pause,
// ↑ ↓ pour faire défiler le commentaire, Échap ou Retour pour quitter.
// Les œuvres sont lues dans la page au moment où on les montre : celles qui arrivent des musées pendant
// le diaporama y entrent aussi, celles dont l'image ne se charge pas en sortent.
// Ce fichier utilise des fonctions de index.html (esc, grandeImage) et de i18n.js (t, langue) :
// il doit être chargé après eux.

const DUREES_DIAPO = [15, 30, 45, 60, 90];
let diapo = null; // diaporama ouvert : {zone, titre, carte, pause, minuterie, debut, reste, wakeLock, pleinEcran}

function reglagesDiapo() {
  let r = {};
  try { r = JSON.parse(localStorage.getItem('jrb-diaporama')) || {}; } catch (e) {}
  return { duree: DUREES_DIAPO.includes(r.duree) ? r.duree : 30, boucle: !!r.boucle };
}
function garderReglagesDiapo(r) { try { localStorage.setItem('jrb-diaporama', JSON.stringify(r)); } catch (e) {} }

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

// Œuvres de l'exposition affichée, dans l'ordre de la page
function cartesDiapo() {
  return [...diapo.zone.querySelectorAll('.wk-card:not(.wk-attente),.mini')].filter(c => c.querySelector('img'));
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
<div class="diapo-cmd" id="diapo-cmd">
  <button type="button" id="diapo-prec" aria-label="Œuvre précédente"><span aria-hidden="true">⏮</span></button>
  <button type="button" id="diapo-pause" aria-label="Pause"><span aria-hidden="true">⏸</span></button>
  <button type="button" id="diapo-suiv" aria-label="Œuvre suivante"><span aria-hidden="true">⏭</span></button>
  <span class="diapo-num" id="diapo-num" aria-live="polite"></span>
  <label class="diapo-reg"><span>Durée par œuvre</span> <select id="diapo-duree">${DUREES_DIAPO.map(s => `<option value="${s}"${s === r.duree ? ' selected' : ''}>${s} s</option>`).join('')}</select></label>
  <label class="diapo-reg"><input type="checkbox" id="diapo-boucle"${r.boucle ? ' checked' : ''}> <span>En boucle</span></label>
  <button type="button" id="diapo-quitter" class="diapo-quitter"><span aria-hidden="true">✕</span> <span>Quitter</span></button>
</div>`;
  document.body.appendChild(d);
  diapo = { zone, d, idTitre, idSous, carte: null, pause: false, minuterie: null, debut: 0, reste: 0, wakeLock: null, pleinEcran: false, retour: document.activeElement, masquer: null };
  document.documentElement.classList.add('diapo-ouvert');
  d.querySelector('#diapo-prec').onclick = () => changerDiapo(-1);
  d.querySelector('#diapo-suiv').onclick = () => changerDiapo(1);
  d.querySelector('#diapo-pause').onclick = basculerPauseDiapo;
  d.querySelector('#diapo-quitter').onclick = fermerDiaporama;
  d.querySelector('#diapo-duree').onchange = e => { const x = reglagesDiapo(); x.duree = +e.target.value; garderReglagesDiapo(x); if (!diapo.pause) programmerDiapo(x.duree * 1000); };
  d.querySelector('#diapo-boucle').onchange = e => { const x = reglagesDiapo(); x.boucle = e.target.checked; garderReglagesDiapo(x); };
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
  afficherDiapo(null);
  d.querySelector('#diapo-pause').focus({ preventScroll: true });
  montrerCmdDiapo();
}

function fermerDiaporama() {
  if (!diapo) return;
  const { d, retour } = diapo;
  clearTimeout(diapo.minuterie); clearTimeout(diapo.masquer); clearInterval(diapo.defile);
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
  else if ((k === 'ArrowDown' || k === 'ArrowUp') && !dansReglage) { const t = diapo.d.querySelector('.diapo-texte'); if (t) t.scrollBy({ top: (k === 'ArrowDown' ? 1 : -1) * t.clientHeight * 0.6, behavior: 'smooth' }); }
  // Échap, ou la touche Retour des télécommandes (Samsung : 10009, LG : 461)
  else if (k === 'Escape' || k === 'GoBack' || k === 'BrowserBack' || e.keyCode === 10009 || e.keyCode === 461) fermerDiaporama();
  else fait = false;
  if (fait) { e.preventDefault(); e.stopPropagation(); }
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
  afficherDiapo(i < 0 ? null : cartes[i]);
}

// Une diapositive : la page de titre de l'exposition (carte = null), puis chaque œuvre
function afficherDiapo(carte) {
  const scene = diapo.d.querySelector('#diapo-scene'), cartes = cartesDiapo();
  diapo.carte = carte; diapo.fin = false;
  if (carte) diapo.dernierIndex = cartes.indexOf(carte);
  const nouv = document.createElement('div');
  if (!carte) {
    nouv.className = 'diapo-diap diapo-titre';
    const h = document.getElementById(diapo.idTitre), s = document.getElementById(diapo.idSous);
    if (h) { const x = copieFr(h); nouv.appendChild(Object.assign(document.createElement('h2'), { className: 'diapo-h' })).append(...x.childNodes); }
    if (s && s.textContent.trim()) { const x = copieFr(s); nouv.appendChild(Object.assign(document.createElement('p'), { className: 'diapo-sous' })).append(...x.childNodes); }
    const intro = diapo.idSous === 'sp-sub' ? document.getElementById('sp-intro') : null;
    if (intro && intro.textContent.trim()) { const x = copieFr(intro); nouv.appendChild(Object.assign(document.createElement('p'), { className: 'diapo-intro' })).append(...x.childNodes); }
    document.getElementById('diapo-num').textContent = cartes.length + ' œuvres';
  } else {
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
      const b = document.createElement('button'); b.type = 'button'; b.textContent = 'Scène violente — afficher l\'image';
      b.onclick = () => { cadre.classList.add('vu'); b.remove(); floue.classList.add('vu'); const o = floue.querySelector('button'); if (o) o.remove(); };
      cadre.appendChild(b);
    }
    const texte = document.createElement('div'); texte.className = 'diapo-texte'; texte.tabIndex = 0;
    const titre = carte.querySelector('h3,.mini-info b');
    if (titre) { const x = copieFr(titre), h = document.createElement('h3'); h.className = 'diapo-t'; if (titre.lang) h.lang = titre.lang; h.append(...x.childNodes); texte.appendChild(h); }
    const infos = carte.classList.contains('mini') ? [...carte.querySelectorAll('.mini-info > span:not(.pastille-direct)')] : [carte.querySelector('.wk-top p')];
    infos.filter(Boolean).forEach(p => { const x = copieFr(p), q = document.createElement('p'); q.className = 'diapo-meta'; q.append(...x.childNodes); texte.appendChild(q); });
    const ana = carte.querySelector('.wk-ana');
    if (ana) { const x = copieFr(ana); x.className = 'diapo-ana'; texte.appendChild(x); }
    const cmp = carte.querySelector('.cmp-pt');
    if (cmp) { const x = copieFr(cmp); x.className = 'diapo-cmp'; texte.appendChild(x); }
    const credit = carte.querySelector('.img-credit');
    if (credit) { const x = copieFr(credit); x.className = 'img-credit diapo-credit'; texte.appendChild(x); }
    nouv.append(cadre, texte);
    document.getElementById('diapo-num').textContent = (cartes.indexOf(carte) + 1) + ' / ' + cartes.length;
    // L'œuvre suivante est préchargée pour un passage sans attente
    const suiv = cartes[cartes.indexOf(carte) + 1];
    if (suiv) { const p = suiv.querySelector('img'); if (p) new Image().src = grandeImage(p.currentSrc || p.src); }
  }
  // Textes restés en français sur la page arabe : chaque bloc prend le sens de lecture de sa propre langue
  nouv.querySelectorAll('h2,h3,p,.diapo-cmp,.diapo-credit').forEach(x => x.setAttribute('dir', 'auto'));
  scene.querySelectorAll('.diapo-diap').forEach(v => { v.classList.add('sortie'); setTimeout(() => v.remove(), 700); });
  scene.appendChild(nouv);
  requestAnimationFrame(() => requestAnimationFrame(() => nouv.classList.add('on')));
  programmerDiapo(reglagesDiapo().duree * 1000);
}

function afficherFinDiapo() {
  const scene = diapo.d.querySelector('#diapo-scene');
  clearTimeout(diapo.minuterie); clearInterval(diapo.defile);
  diapo.fin = true; diapo.carte = null; diapo.dernierIndex = cartesDiapo().length;
  scene.querySelectorAll('.diapo-diap').forEach(v => { v.classList.add('sortie'); setTimeout(() => v.remove(), 700); });
  const nouv = document.createElement('div'); nouv.className = 'diapo-diap diapo-titre';
  nouv.innerHTML = '<h2 class="diapo-h">Fin de l\'exposition</h2><p class="diapo-sous">Merci de votre visite</p>';
  scene.appendChild(nouv);
  requestAnimationFrame(() => requestAnimationFrame(() => nouv.classList.add('on')));
  diapo.d.querySelector('#diapo-barre').style.width = '100%';
  diapo.pause = true; majBoutonPause();
}

// Minuterie de la diapositive, avec la barre de progression et le défilement doux d'un long commentaire
function programmerDiapo(ms) {
  clearTimeout(diapo.minuterie); clearInterval(diapo.defile);
  const total = reglagesDiapo().duree * 1000;
  diapo.reste = ms; diapo.debut = Date.now();
  const barre = diapo.d.querySelector('#diapo-barre');
  const majBarre = () => { if (!diapo) return; const fait = total - diapo.reste + (diapo.pause ? 0 : Date.now() - diapo.debut); barre.style.width = Math.min(100, 100 * fait / total) + '%'; };
  majBarre();
  if (diapo.pause) return;
  diapo.minuterie = setTimeout(() => changerDiapo(1), ms);
  diapo.defile = setInterval(() => {
    majBarre();
    // Le commentaire trop long pour l'écran défile tout seul, de la 5e seconde à 4 secondes de la fin
    const t = diapo && diapo.d.querySelector('.diapo-diap.on:not(.sortie) .diapo-texte');
    if (!t || t.matches(':hover,:focus-within') || t.scrollHeight <= t.clientHeight + 4) return;
    const fait = total - diapo.reste + Date.now() - diapo.debut, f = Math.max(0, Math.min(1, (fait - 5000) / (total - 9000)));
    t.scrollTop = f * (t.scrollHeight - t.clientHeight);
  }, 100);
}

function basculerPauseDiapo() {
  if (!diapo) return;
  if (diapo.fin) { diapo.pause = false; majBoutonPause(); changerDiapo(1); return; } // après la fin : on recommence
  if (diapo.pause) { diapo.pause = false; programmerDiapo(diapo.reste); }
  else { diapo.pause = true; clearTimeout(diapo.minuterie); clearInterval(diapo.defile); diapo.reste -= Date.now() - diapo.debut; }
  majBoutonPause(); montrerCmdDiapo();
}
function majBoutonPause() {
  const b = diapo.d.querySelector('#diapo-pause');
  b.setAttribute('aria-label', diapo.pause ? 'Reprendre le diaporama' : 'Pause');
  b.firstElementChild.textContent = diapo.pause ? '▶' : '⏸';
  diapo.d.classList.toggle('en-pause', diapo.pause);
}
