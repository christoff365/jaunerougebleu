// BIEN-ÊTRE PAR L'ART : séances composées à la demande
// Le visiteur choisit une intention et une durée courte (2, 3 ou 5 minutes). Le site lui propose des œuvres
// choisies d'après leurs couleurs réelles (calme, chaleur, contraste, éclat…) parmi toutes les œuvres du site
// (page Accessibilité, expositions spéciales, collection du générateur), complétées par des œuvres trouvées en direct
// dans les catalogues des musées. Le guide change au fil de la séance ; il peut être lu à voix haute.
// Les textes des guides sont des propositions générées par Claude AI (Anthropic), sans valeur thérapeutique.

const INTENTIONS = {
  stress: { t: 'Apaiser le stress', em: '🌊', theme: 'Paysages', souffle: true,
    // Couleurs calmes : peu de contraste, saturation modérée, teintes froides (vert, bleu)
    score: v => (0.35 - v.C) * 2 + (0.3 - Math.abs(v.S - 0.25)) + (v.note >= 4 && v.note <= 8 ? 0.35 : 0),
    g: ['Installez-vous confortablement. Posez le regard sur l\'œuvre, sans chercher à l\'analyser.',
      'Inspirez lentement par le nez en comptant jusqu\'à quatre, puis expirez en comptant jusqu\'à six.',
      'Laissez vos yeux suivre une ligne ou un contour de l\'œuvre, très lentement.',
      'Remarquez la couleur la plus calme de l\'image. Laissez-la occuper toute votre attention.',
      'Relâchez les épaules et la mâchoire. Continuez à respirer au rythme de l\'œuvre.'] },
  tristesse: { t: 'Traverser la tristesse', em: '🕯️', theme: 'Spiritualité', souffle: true,
    // Teintes chaudes et demi-teintes
    score: v => (v.note <= 2 || v.note === 11 ? 0.45 : 0) + (0.35 - Math.abs(v.L - 0.45)) + (0.3 - Math.abs(v.S - 0.35)),
    g: ['Accueillez ce que vous ressentez, sans le juger. L\'œuvre est là, avec vous.',
      'Cherchez dans l\'image un détail qui résonne avec votre état du moment.',
      'Respirez lentement. Laissez l\'émotion être présente, comme une couleur parmi d\'autres.',
      'Trouvez maintenant une zone de lumière, même petite, dans l\'œuvre.',
      'Pensez à un mot qui décrit ce que vous ressentez à présent. Vous pouvez le noter dans le journal.'] },
  concentration: { t: 'Améliorer la concentration', em: '🔷', theme: 'Nature morte', souffle: false,
    // Contraste moyen, couleurs sobres
    score: v => (0.12 - Math.abs(v.C - 0.22)) * 4 + (0.45 - v.S),
    g: ['Fixez le centre de la composition pendant quelques respirations.',
      'Comptez les principales formes que vous distinguez.',
      'Suivez le chemin que fait votre regard : où va-t-il, où revient-il ?',
      'Choisissez un seul détail et observez-le comme si vous deviez le redessiner de mémoire.',
      'Revenez à l\'ensemble de l\'œuvre. Remarquez comment les détails s\'organisent.'] },
  creativite: { t: 'Stimuler la créativité', em: '✨', theme: 'Mythologie', souffle: false,
    // Couleurs vives et contrastées
    score: v => v.S + v.C * 2,
    g: ['Regardez l\'œuvre comme si vous la découvriez pour la première fois.',
      'Imaginez ce qui se passe juste en dehors du cadre.',
      'Inventez un autre titre pour cette œuvre.',
      'Si vous pouviez entrer dans l\'image, que feriez-vous en premier ?',
      'Notez une idée, une image ou un mot qui vous est venu pendant la séance.'] },
  joie: { t: 'Retrouver de la joie', em: '☀️', theme: 'Lumière & couleur', souffle: false,
    // Images claires et colorées
    score: v => v.L + v.S,
    g: ['Laissez votre regard aller vers la couleur la plus vive de l\'œuvre.',
      'Cherchez un détail qui vous fait sourire ou qui vous plaît particulièrement.',
      'Respirez profondément et imaginez la chaleur ou la lumière de la scène.',
      'Pensez à un moment heureux que cette œuvre vous rappelle.',
      'Gardez cette sensation avec vous en terminant la séance.'] },
  contempler: { t: 'Simplement contempler', em: '🌿', theme: 'Paysages', souffle: true,
    score: () => Math.random(),
    g: ['Regardez simplement l\'œuvre, sans but particulier.',
      'Remarquez ce que vous n\'aviez pas vu au premier regard.',
      'Écoutez les sons autour de vous tout en gardant les yeux sur l\'image.',
      'Laissez les pensées passer, et revenez doucement à l\'œuvre.',
      'Prenez un dernier moment pour la regarder dans son ensemble.'] }
};
const FIN_SEANCE = 'Séance terminée. Prenez un instant avant de reprendre vos activités.';

let wb = { intention: null, duree: 180, choix: null, montrees: new Set(), pool: [], pret: null, voix: false };
let tInt = null, tSec = 180, tRun = false, tDone = false, mB = 0, mA = 0, souffleInt = null;
function fmtT(s) { return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + s % 60; }

// ---------- Réserve d'œuvres : toutes celles du site, puis celles des musées en direct
function ajouterAuPool(f) {
  if (!f.image || f.sensible || wb.pool.some(p => p.image === f.image)) return null;
  f.v = undefined; wb.pool.push(f); return f;
}
// Couleurs de l'œuvre (une seule fois par image) ; null si le musée n'autorise pas l'analyse
function analyserFiche(f) {
  if (f.v !== undefined) return Promise.resolve(f.v);
  return new Promise(res => {
    const img = new Image();
    if (/^https?:/.test(f.image) && !f.image.startsWith(location.origin)) img.crossOrigin = 'anonymous';
    img.onload = () => { try { f.v = analyserCouleurs(img); } catch (e) { f.v = null; } res(f.v); };
    img.onerror = () => { f.v = null; f.casse = true; res(null); };
    img.src = f.image;
  });
}
function preparerPool() {
  if (wb.pret) return wb.pret;
  ART.forEach((a, i) => ajouterAuPool(Object.assign(ficheArt(i), { local: true })));
  wb.pret = Promise.all([chargerCollection().catch(() => []), new Promise(r => { // les expositions spéciales sont peut-être encore en chargement
    let n = 0; const attendre = () => (exposChargees || n++ > 40 ? r() : setTimeout(attendre, 100)); attendre(); })])
    .then(([col]) => {
      (expos || []).filter(e => e.status === 'published').forEach(e => e.works.forEach(w => ajouterAuPool({ titre: w.title, artiste: w.artist, date: w.period, lieu: w.country, musee: w.museum, image: w.image, credit: w.credit ? lienCredit(w.credit) : '', analyse: w.analysis, sensible: w.sensible, local: true })));
      (col || []).forEach(w => ajouterAuPool({ titre: w.title, artiste: w.artist, date: w.date, lieu: w.place, musee: w.museum, image: w.image, credit: w.credit ? lienCredit(w.credit) : '', sensible: w.sensible, local: true }));
      return Promise.all(wb.pool.map(analyserFiche));
    });
  return wb.pret;
}
// Œuvres des musées en direct, sur le thème de l'intention (peintures, domaine public)
function enrichirPool(cle) {
  if (typeof chercherDansLesMusees !== 'function') return Promise.resolve();
  const i = INTENTIONS[cle]; i.enrichi = i.enrichi || chercherDansLesMusees({ th: [i.theme], rg: [], ep: [], ty: ['Peinture'] }, 6)
    .then(r => Promise.all(r.oeuvres.slice(0, 18).map(w => { const f = ajouterAuPool({ titre: w.title, artiste: w.artist, date: w.date, lieu: w.place, musee: w.museum, image: w.image, credit: w.credit ? lienCredit(w.credit) : '', sensible: w.sensible, intention: cle }); return f ? analyserFiche(f) : null; })))
    .catch(() => {});
  return i.enrichi;
}

// ---------- Écran de choix
function initBienEtre() {
  const z = document.getElementById('wb-intentions');
  if (!z.children.length) z.innerHTML = Object.entries(INTENTIONS).map(([k, i]) =>
    `<div class="wb-card" role="button" tabindex="0" aria-pressed="false" data-i="${k}" onclick="choisirIntention('${k}',this)"><div class="wb-em" aria-hidden="true">${i.em}</div><div class="wb-t">${i.t}</div></div>`).join('');
  preparerPool();
}
function choisirIntention(k, el) {
  document.querySelectorAll('#wb-intentions .wb-card').forEach(c => { c.classList.toggle('on', c === el); c.setAttribute('aria-pressed', c === el); });
  wb.intention = k; wb.choix = null; wb.montrees = new Set();
  document.getElementById('wb-go').disabled = true;
  document.getElementById('wb-aide').textContent = 'Recherche des œuvres les plus adaptées…';
  preparerPool().then(() => { if (wb.intention === k) proposerOeuvres(); });
  enrichirPool(k).then(() => { // les œuvres des musées arrivent ensuite : on complète les propositions si besoin
    if (wb.intention === k && document.querySelectorAll('#wb-choix .wb-oeuvre').length < 6) proposerOeuvres();
  });
}
function choisirDuree(el) {
  document.querySelectorAll('#wb-durees .tag').forEach(x => { x.classList.toggle('on', x === el); x.setAttribute('aria-pressed', x === el); });
  wb.duree = +el.dataset.d;
}
// Six œuvres tirées parmi les mieux adaptées à l'intention, sans répéter celles déjà montrées
function classement(k) {
  const i = INTENTIONS[k];
  return wb.pool.filter(f => !f.casse && (!f.intention || f.intention === k))
    .map(f => ({ f, s: f.v ? i.score(f.v) + Math.random() * 0.1 : Math.random() * 0.4 }))
    .sort((a, b) => b.s - a.s).map(x => x.f);
}
function proposerOeuvres() {
  const k = wb.intention; if (!k) return;
  let liste = classement(k).filter(f => !wb.montrees.has(f.image));
  if (liste.length < 6) { wb.montrees = new Set(wb.choix ? [wb.choix.image] : []); liste = classement(k).filter(f => !wb.montrees.has(f.image)); }
  // les meilleures en premier, avec un peu de hasard pour varier d'une visite à l'autre
  const tete = liste.slice(0, 9).sort(() => Math.random() - 0.5).slice(0, 6);
  tete.forEach(f => wb.montrees.add(f.image));
  document.getElementById('wb-aide').textContent = 'Œuvres proposées d\'après leurs couleurs. Cliquez sur celle qui vous attire.';
  document.getElementById('wb-choix').innerHTML = tete.map(f => { const n = wb.pool.indexOf(f);
    return `<div class="wb-oeuvre" role="button" tabindex="0" aria-pressed="false" data-n="${n}" onclick="choisirOeuvreWb(${n},this)"><img src="${esc(f.image)}" alt="${esc(f.titre + (f.artiste ? ', ' + f.artiste : ''))}" loading="lazy" onerror="this.parentElement.remove()">${typeof boutonLoupe === 'function' ? boutonLoupe() : ''}<span>${esc(f.titre)}</span><small>${esc(f.artiste || '')}</small></div>`; }).join('');
  document.getElementById('wb-autres').hidden = false;
  wb.choix = null; document.getElementById('wb-go').disabled = true;
}
function choisirOeuvreWb(n, el) {
  document.querySelectorAll('#wb-choix .wb-oeuvre').forEach(c => { c.classList.toggle('on', c === el); c.setAttribute('aria-pressed', c === el); });
  wb.choix = wb.pool[n]; document.getElementById('wb-go').disabled = false;
}

// ---------- Séance
function afficherOeuvreWb(f) {
  const sv = document.getElementById('sv-img'); sv.src = f.image; sv.alt = f.titre + (f.artiste ? ', ' + f.artiste : '');
  document.getElementById('sv-cap').textContent = [f.titre, f.artiste, f.date, f.musee].filter(Boolean).join(' · ');
  document.getElementById('sv-credit').innerHTML = f.credit ? (/^Image/.test(f.credit) ? f.credit : 'Image : ' + f.credit) : '';
  document.getElementById('sv-acc').innerHTML = boutonAcces(f);
}
function startWb() {
  const k = wb.intention, f = wb.choix; if (!k || !f) return;
  const i = INTENTIONS[k];
  tSec = wb.duree; tRun = false; tDone = false; mB = 0; mA = 0;
  document.getElementById('sv-h').textContent = i.t;
  afficherOeuvreWb(f);
  guideWb(0, true);
  document.getElementById('sv-souffle').hidden = true;
  document.getElementById('t-ring').textContent = fmtT(tSec);
  document.getElementById('t-st').textContent = 'Prêt à démarrer';
  document.getElementById('t-btn').innerHTML = '<span aria-hidden="true">▶</span> Démarrer la séance';
  document.getElementById('t-btn').style.display = 'block';
  document.getElementById('after-sec').style.display = 'none';
  document.getElementById('cmp-box').style.display = 'none';
  document.getElementById('jrnl').value = '';
  document.querySelectorAll('#mb-row .mbd,#ma-row .mbd').forEach(b => { b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); });
  document.getElementById('wb-list').style.display = 'none';
  document.getElementById('wb-sess').style.display = 'block';
  window.scrollTo(0, 0); document.getElementById('sv-h').tabIndex = -1; document.getElementById('sv-h').focus({ preventScroll: true });
}
// Une autre œuvre adaptée à la même intention, sans interrompre le minuteur
function changerOeuvreWb() {
  const liste = classement(wb.intention).filter(f => f !== wb.choix).slice(0, 12);
  if (!liste.length) return;
  wb.choix = liste[Math.floor(Math.random() * liste.length)];
  afficherOeuvreWb(wb.choix);
}
let etapeWb = -1;
function guideWb(n, force) {
  const g = INTENTIONS[wb.intention].g; if (n === etapeWb && !force) return; etapeWb = n;
  const txt = n >= g.length ? FIN_SEANCE : g[n];
  document.getElementById('sv-g').innerHTML = `<span class="sv-etape">${n >= g.length ? '' : (n + 1) + ' / ' + g.length}</span> <span>${esc(txt)}</span>`;
  if (wb.voix && (tRun || n >= g.length) && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t(txt)); u.lang = LANGUES[langue]; window.speechSynthesis.speak(u);
  }
}
function voixWb(on) { wb.voix = on; if (on && tRun) guideWb(etapeWb, true); if (!on && 'speechSynthesis' in window) window.speechSynthesis.cancel(); }
// Respiration guidée : 4 secondes d'inspiration, 6 d'expiration
function souffleWb(on) {
  const z = document.getElementById('sv-souffle'), txt = document.getElementById('sv-souffle-txt');
  clearTimeout(souffleInt); souffleInt = null;
  if (!on || !INTENTIONS[wb.intention].souffle) { z.hidden = true; z.classList.remove('expire'); return; }
  z.hidden = false;
  const cycle = inspire => { z.classList.toggle('expire', !inspire); txt.textContent = inspire ? 'Inspirez' : 'Expirez'; souffleInt = setTimeout(() => cycle(!inspire), inspire ? 4000 : 6000); };
  cycle(true);
}
function stopWb() {
  clearInterval(tInt); tInt = null; tRun = false; souffleWb(false);
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (typeof fermerAcces === 'function' && document.getElementById('acc-modal') && !document.getElementById('acc-modal').hidden) fermerAcces();
  document.getElementById('wb-list').style.display = 'block'; document.getElementById('wb-sess').style.display = 'none';
}
function tickTimer() {
  if (tDone) return;
  const total = wb.duree, g = INTENTIONS[wb.intention].g;
  if (tRun) {
    clearInterval(tInt); tInt = null; tRun = false; souffleWb(false);
    document.getElementById('t-btn').innerHTML = '<span aria-hidden="true">▶</span> Reprendre'; document.getElementById('t-st').textContent = 'En pause';
  } else {
    tRun = true; souffleWb(true);
    document.getElementById('t-btn').innerHTML = '<span aria-hidden="true">⏸</span> Pause'; document.getElementById('t-st').textContent = 'Séance en cours…';
    guideWb(Math.min(g.length - 1, Math.floor((total - tSec) / (total / g.length))), true);
    tInt = setInterval(() => {
      if (tSec > 0) {
        tSec--; document.getElementById('t-ring').textContent = fmtT(tSec);
        guideWb(Math.min(g.length - 1, Math.floor((total - tSec) / (total / g.length)))); // le guide change à intervalles réguliers
      } else {
        clearInterval(tInt); tInt = null; tRun = false; tDone = true; souffleWb(false); guideWb(g.length);
        document.getElementById('t-st').innerHTML = '<span aria-hidden="true">✓</span> Séance terminée';
        document.getElementById('t-btn').style.display = 'none'; document.getElementById('after-sec').style.display = 'block';
      }
    }, 1000);
  }
}
