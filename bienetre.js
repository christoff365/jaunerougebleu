// BIEN-ÊTRE PAR L'ART : séances composées à la demande
// Le visiteur choisit une intention et une durée (2, 3, 5 ou 10 minutes, ou « à mon rythme »). Le site lui propose des œuvres
// apaisantes choisies d'après leurs couleurs réelles (calme, chaleur, contraste, éclat…) parmi une sélection réservée au bien-être
// (paysages, nature, lumière ; jamais d'œuvres funéraires, violentes ou de guerre), complétée par des œuvres trouvées en direct
// dans les catalogues des musées. Le guide change au fil de la séance ; il peut être lu à voix haute.
// Les consignes s'inspirent de pratiques reconnues (regard lent, ancrage par les sens « 5-4-3-2-1 », expiration allongée,
// questions de la méthode Visual Thinking Strategies, savourer, bienveillance envers soi) ; elles laissent toujours le choix
// (« si vous le souhaitez », yeux ouverts possibles, arrêt à tout moment). Textes proposés par Claude AI (Anthropic),
// sans valeur thérapeutique : ils ne remplacent pas un accompagnement médical ou psychologique.

// Chaque intention : titre, émoji, thème des œuvres cherchées en direct, respiration proposée (facultative),
// score de couleurs (v : valeurs calculées par analyserCouleurs), consignes (g) et petite suite proposée après la séance
const INTENTIONS = {
  stress: { t: 'Apaiser le stress', em: '🌊', theme: 'Paysages', souffle: true,
    // Couleurs calmes : peu de contraste, saturation modérée, teintes froides (vert, bleu)
    score: v => (0.35 - v.C) * 2 + (0.3 - Math.abs(v.S - 0.25)) + (v.note >= 4 && v.note <= 8 ? 0.35 : 0),
    g: ['Installez-vous comme vous le souhaitez. Vous pouvez garder les yeux ouverts et arrêter à tout moment.',
      'Posez le regard sur l\'œuvre, sans chercher à l\'analyser. Laissez-la simplement venir à vous.',
      'Si vous le souhaitez, allongez un peu l\'expiration : inspirez en comptant jusqu\'à quatre, expirez jusqu\'à six.',
      'Laissez vos yeux suivre lentement une ligne ou un contour de l\'œuvre.',
      'Remarquez la couleur la plus calme de l\'image. Laissez-la occuper votre attention.',
      'Relâchez, si c\'est possible, les épaules et la mâchoire. Remarquez ce qui a changé, même un tout petit peu.'],
    suite: 'Avant de reprendre vos activités, buvez un verre d\'eau ou marchez quelques minutes.' },
  anxiete: { t: 'Calmer l\'anxiété', em: '🍃', theme: 'Paysages', souffle: true,
    score: v => (0.35 - v.C) * 2 + (0.3 - Math.abs(v.S - 0.25)) + (0.3 - Math.abs(v.L - 0.55)),
    g: ['Vous êtes ici, maintenant. Gardez les yeux ouverts et sentez vos pieds posés au sol.',
      'Nommez, à voix basse ou dans votre tête, cinq choses que vous voyez dans l\'œuvre.',
      'Puis quatre couleurs différentes. Prenez votre temps.',
      'Trouvez trois formes : un rond, une ligne droite, une courbe…',
      'Écoutez deux sons autour de vous, puis revenez à l\'image.',
      'Choisissez un détail rassurant de l\'œuvre et gardez-le en mémoire, comme un point d\'appui.'],
    suite: 'Si l\'inquiétude revient, vous pouvez refaire cet exercice des sens (cinq choses vues, quatre couleurs…) où que vous soyez.' },
  tristesse: { t: 'Accompagner la tristesse', em: '🕯️', theme: 'Paysages', souffle: true,
    // Teintes chaudes et demi-teintes
    score: v => (v.note <= 2 || v.note === 11 ? 0.45 : 0) + (0.35 - Math.abs(v.L - 0.45)) + (0.3 - Math.abs(v.S - 0.35)),
    g: ['Accueillez ce que vous ressentez, sans le juger. Vous n\'avez rien à réussir : l\'œuvre est simplement là, avec vous.',
      'Cherchez dans l\'image un détail qui résonne avec votre état du moment.',
      'Respirez à votre rythme. Laissez l\'émotion être présente, comme une couleur parmi d\'autres.',
      'Trouvez maintenant une zone de lumière, même petite, dans l\'œuvre.',
      'Parlez-vous comme vous parleriez à une personne aimée qui traverse la même chose : avec douceur.',
      'Si vous le souhaitez, notez un mot qui décrit ce que vous ressentez à présent.'],
    suite: 'Pensez à une petite chose douce que vous pourriez vous offrir aujourd\'hui, ou à une personne à qui parler.' },
  deuil: { t: 'Traverser un deuil', em: '🌫️', theme: 'Paysages', souffle: false,
    score: v => (0.35 - Math.abs(v.L - 0.45)) + (0.3 - Math.abs(v.S - 0.3)) + (0.3 - v.C),
    g: ['Prenez place doucement. Il n\'y a pas de bonne façon de vivre une perte : tout ce que vous ressentez a sa place.',
      'Regardez l\'œuvre lentement. Laissez venir les souvenirs, ou le silence, sans les forcer.',
      'Cherchez dans l\'image quelque chose qui vous fait penser à la personne, à l\'être ou au lieu que vous avez perdu.',
      'Si une émotion monte, laissez-la passer, comme un nuage sur un paysage.',
      'Pensez à ce que cette relation vous a apporté et que vous gardez en vous.',
      'Avant de terminer, posez une main sur votre cœur ou sur votre bras, si cela vous fait du bien.'],
    suite: 'Le deuil prend du temps. Parler de la personne disparue avec un proche ou un groupe de soutien peut aider.' },
  colere: { t: 'Apaiser la colère', em: '🧊', theme: 'Paysages', souffle: true,
    // Teintes froides, peu saturées, peu contrastées
    score: v => (v.note >= 4 && v.note <= 8 ? 0.4 : 0) + (0.35 - v.S) + (0.3 - v.C),
    g: ['La colère est une émotion normale : elle signale souvent qu\'une chose importante a été touchée.',
      'Regardez l\'œuvre et remarquez où, dans votre corps, vous sentez la colère en ce moment.',
      'Choisissez dans l\'image la zone la plus calme et posez-y le regard.',
      'Si vous le souhaitez, desserrez les poings et la mâchoire, et expirez longuement.',
      'Observez l\'œuvre comme si vous preniez du recul : de loin, que devient la scène ?',
      'Quand ce sera le moment, demandez-vous ce dont vous avez besoin, plutôt que ce qui a provoqué la colère.'],
    suite: 'Avant d\'agir ou de répondre, laissez passer un peu de temps ; une marche aide souvent à relâcher la tension.' },
  solitude: { t: 'Rompre un peu la solitude', em: '🤝', theme: 'Paysages', souffle: false,
    // Couleurs chaudes et lumineuses
    score: v => (v.note <= 2 || v.note === 11 ? 0.4 : 0) + v.L * 0.6 + (0.3 - Math.abs(v.S - 0.4)),
    g: ['Quelqu\'un a créé cette œuvre pour qu\'elle soit vue, parfois il y a très longtemps. Aujourd\'hui, c\'est vous qui la regardez.',
      'Imaginez la personne qui l\'a créée : ses gestes, la lumière autour d\'elle, ce qu\'elle cherchait.',
      'Pensez à toutes les personnes qui ont regardé cette même œuvre avant vous, dans un musée ou dans un livre.',
      'Cherchez dans l\'image un signe de présence : une maison, un chemin, une lumière, un personnage.',
      'Pensez à une personne à qui vous aimeriez montrer cette œuvre.',
      'Si vous le pouvez, envoyez-lui un message aujourd\'hui, même très court.'],
    suite: 'Un message, un appel, une sortie dans un lieu où il y a du monde : choisissez un petit pas pour aujourd\'hui.' },
  sommeil: { t: 'Préparer le sommeil', em: '🌙', theme: 'Paysages', souffle: true,
    // Images sombres, douces, peu contrastées
    score: v => (0.5 - v.L) + (0.3 - v.S) + (0.3 - v.C),
    g: ['Baissez la luminosité de l\'écran si vous le pouvez, et installez-vous confortablement.',
      'Laissez votre regard se promener sur l\'œuvre, de plus en plus lentement.',
      'Si vous le souhaitez, expirez plus longuement que vous n\'inspirez.',
      'Remarquez les zones les plus sombres et les plus douces de l\'image.',
      'Laissez les pensées de la journée passer, sans les retenir, et revenez à l\'œuvre.',
      'Fermez les yeux si vous le souhaitez, et gardez l\'image en mémoire quelques instants.'],
    suite: 'Posez l\'écran maintenant si vous le pouvez, et gardez une lumière douce.' },
  concentration: { t: 'Retrouver la concentration', em: '🔷', theme: 'Nature morte', souffle: false,
    // Contraste moyen, couleurs sobres
    score: v => (0.12 - Math.abs(v.C - 0.22)) * 4 + (0.45 - v.S),
    g: ['Posez le regard au centre de la composition pendant quelques respirations.',
      'Comptez les principales formes que vous distinguez.',
      'Suivez le chemin que fait votre regard : où va-t-il, où revient-il ?',
      'Choisissez un seul détail et observez-le comme si vous deviez le redessiner de mémoire.',
      'Que se passe-t-il dans cette œuvre ? Qu\'est-ce qui, dans l\'image, vous fait dire cela ?',
      'Revenez à l\'ensemble de l\'œuvre. Remarquez comment les détails s\'organisent.'],
    suite: 'Reprenez une seule tâche à la fois, pendant quelques minutes, avant de faire une pause.' },
  creativite: { t: 'Stimuler la créativité', em: '✨', theme: 'Lumière & couleur', souffle: false,
    // Couleurs vives et contrastées
    score: v => v.S + v.C * 2,
    g: ['Regardez l\'œuvre comme si vous la découvriez pour la première fois.',
      'Que se passe-t-il dans cette image ? Qu\'est-ce qui vous fait dire cela ?',
      'Imaginez ce qui se passe juste en dehors du cadre.',
      'Inventez un autre titre pour cette œuvre.',
      'Si vous pouviez entrer dans l\'image, que feriez-vous en premier ?',
      'Notez une idée, une image ou un mot qui vous est venu pendant la séance.'],
    suite: 'Gardez votre idée quelque part : un carnet, une note, un dessin rapide.' },
  joie: { t: 'Accueillir un peu de joie', em: '☀️', theme: 'Lumière & couleur', souffle: false,
    // Images claires et colorées
    score: v => v.L + v.S,
    g: ['Laissez votre regard aller vers la couleur la plus vive de l\'œuvre.',
      'Cherchez un détail qui vous plaît ou qui vous fait sourire. Restez-y quelques instants : savourez-le.',
      'Imaginez la chaleur, la lumière ou les sons de la scène.',
      'Pensez à un moment agréable, même petit, que cette œuvre vous rappelle.',
      'Si aucune joie ne vient aujourd\'hui, ce n\'est pas grave : le simple fait de regarder compte aussi.',
      'Gardez avec vous une couleur ou un détail en terminant la séance.'],
    suite: 'Partagez cette œuvre ou ce moment avec quelqu\'un, si vous en avez envie.' },
  contempler: { t: 'Simplement contempler', em: '🌿', theme: 'Paysages', souffle: true,
    score: () => Math.random(),
    g: ['Regardez simplement l\'œuvre, sans but particulier.',
      'Remarquez ce que vous n\'aviez pas vu au premier regard.',
      'Que pouvez-vous trouver de plus, en regardant encore ?',
      'Écoutez les sons autour de vous tout en gardant les yeux sur l\'image.',
      'Laissez les pensées passer, et revenez doucement à l\'œuvre.',
      'Prenez un dernier moment pour la regarder dans son ensemble.'],
    suite: 'Vous pouvez revenir à cette œuvre quand vous le voulez : le regard s\'enrichit à chaque fois.' }
};
const FIN_SEANCE = 'Séance terminée. Prenez un instant avant de reprendre vos activités.';

let wb = { intention: null, duree: 180, choix: null, montrees: new Set(), pool: [], pret: null, voix: false, souffle: false, musique: false };
let tInt = null, tSec = 180, tRun = false, tDone = false, mB = 0, mA = 0, souffleInt = null;
function fmtT(s) { return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + s % 60; }

// ---------- Réserve d'œuvres réservée au bien-être
// Seules des œuvres apaisantes sont proposées : pas d'œuvres signalées comme sensibles, pas de thèmes funéraires, de mort,
// de guerre, de violence ou de jugement religieux (on cherche dans le titre et le commentaire), et seulement certaines
// expositions et certains thèmes de la collection (paysages, nature, lumière, vie quotidienne).
const EXPOS_BIEN_ETRE = ['Nature, art et bien-être', 'Le paysage à travers le temps et les cultures', 'La lumière comme langage universel', 'La couleur est relative'];
const THEMES_BIEN_ETRE = ['Paysages', 'Nature morte', 'Lumière & couleur', 'Vie quotidienne', 'Abstraction'];
const RISQUE_BIEN_ETRE = /\b(morts?|mourant\w*|mourir|funéraire\w*|funerar\w*|momie\w*|mumm\w*|tombe|tombeau\w*|tomb|sépult\w*|burial|guerres?|war|wars|bataille\w*|ronde de nuit|night watch|milice\w*|militia\w*|arme|armes|armé\w*|weapon\w*|soldat\w*|soldier\w*|battle\w*|combat\w*|massacre\w*|sang|blood\w*|monstre\w*|monster\w*|dévor\w*|devour\w*|martyr\w*|crucifi\w*|décapit\w*|behead\w*|enfer|hell|squelette\w*|skelet\w*|skull\w*|crâne\w*|naufrage\w*|shipwreck\w*|meurtre\w*|murder\w*|exécution\w*|execution\w*|supplice\w*|tortur\w*|cadavre\w*|corpse\w*|déluge|deluge|apocalyps\w*|violen\w*|viol|rape|chasse|hunt\w*|deuil|mourning|esclav\w*|slave\w*|incendie\w*|lamentation\w*|pietà|pieta|dead|death|dying|killing|slaughter\w*)\b/i;
function apaisante(f) {
  if (f.sensible) return false;
  const texte = [f.titre, f.analyse].filter(Boolean).join(' ').replace(/natures? mortes?|still[- ]life/gi, '');
  return !RISQUE_BIEN_ETRE.test(texte);
}
function ajouterAuPool(f) {
  if (!f.image || !apaisante(f) || wb.pool.some(p => p.image === f.image)) return null;
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
      (expos || []).filter(e => e.status === 'published' && EXPOS_BIEN_ETRE.includes(e.title)).forEach(e => e.works.forEach(w => ajouterAuPool({ titre: w.title, artiste: w.artist, date: w.period, lieu: w.country, musee: w.museum, image: w.image, credit: w.credit ? lienCredit(w.credit) : '', analyse: w.analysis, sensible: w.sensible, local: true })));
      (col || []).filter(w => (w.themes || []).some(x => THEMES_BIEN_ETRE.includes(x)) && !(w.themes || []).some(x => x === 'Mythologie' || x === 'Spiritualité'))
        .forEach(w => ajouterAuPool({ titre: w.title, artiste: w.artist, date: w.date, lieu: w.place, musee: w.museum, image: w.image, credit: w.credit ? lienCredit(w.credit) : '', sensible: w.sensible, local: true }));
      return Promise.all(wb.pool.map(analyserFiche));
    });
  return wb.pret;
}
// Œuvres des musées en direct, sur un thème apaisant (peintures, domaine public), filtrées comme les autres
function enrichirPool(cle) {
  if (typeof chercherDansLesMusees !== 'function') return Promise.resolve();
  const i = INTENTIONS[cle]; i.enrichi = i.enrichi || chercherDansLesMusees({ th: [i.theme], rg: [], ep: [], ty: ['Peinture'] }, 6)
    .then(r => Promise.all(r.oeuvres.slice(0, 18).map(w => { const f = ajouterAuPool({ titre: w.title, artiste: w.artist, date: w.date, lieu: w.place, musee: w.museum, image: w.image, credit: w.credit ? lienCredit(w.credit) : '', sensible: w.sensible, intention: cle }); return f ? analyserFiche(f) : null; })))
    .catch(() => {});
  return i.enrichi;
}

// ---------- « Pourquoi cette œuvre ? » : une phrase qui explique le choix d'après les couleurs
function pourquoiOeuvre(f) {
  const v = f && f.v; if (!v) return '';
  const fam = v.familles ? Object.entries(v.familles).sort((a, b) => b[1] - a[1])[0] : null;
  const dom = fam && fam[1] > 0.25 ? { bleu: 'à dominante bleue', vert: 'à dominante verte', or: 'à dominante dorée', rouge: 'à dominante rouge', brun: 'aux tons bruns et ocre', violet: 'à dominante violette' }[fam[0]] : '';
  const morceaux = [v.S < 0.3 ? 'couleurs douces' : v.S < 0.5 ? 'couleurs modérées' : 'couleurs vives',
    v.C < 0.18 ? 'peu de contrastes' : v.C < 0.27 ? 'contrastes modérés' : 'forts contrastes',
    v.L < 0.38 ? 'tons sombres' : v.L < 0.6 ? 'demi-teintes' : 'tons clairs', dom].filter(Boolean);
  return `<span>Proposée pour ses couleurs :</span> ${morceaux.map(m => `<span>${m}</span>`).join(', ')}.`;
}

// ---------- Aide et soutien
function afficherAideWb(ouvrir) {
  const d = document.getElementById('wb-sos'); if (!d) return;
  d.open = ouvrir !== false; if (d.open) d.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
// Message de soutien sous l'échelle d'humeur (humeur très basse, ou humeur qui baisse après la séance)
function soutienWb(id, html) {
  const z = document.getElementById(id); if (!z) return;
  z.innerHTML = html; z.hidden = !html;
}
const MSG_TRES_MAL = '<p><span>Merci de l\'avoir indiqué. Si c\'est très difficile en ce moment, une séance peut aider un peu, mais elle ne suffit pas toujours : n\'hésitez pas à en parler à quelqu\'un.</span></p><button type="button" class="lien-btn" onclick="afficherAideWb()">Besoin d\'aide maintenant ?</button>';
const MSG_BAISSE = '<p><span>La séance a fait remonter des émotions : cela arrive, et ce n\'est pas un échec.</span> <span>Pour revenir doucement, posez les pieds au sol et nommez cinq choses que vous voyez autour de vous.</span></p><button type="button" class="lien-btn" onclick="afficherAideWb()">Besoin d\'aide maintenant ?</button>';
function moodFn(ph, v, btn) {
  const rid = ph === 'b' ? 'mb-row' : 'ma-row';
  document.querySelectorAll('#' + rid + ' .mbd').forEach(b => { b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); }); btn.classList.add('on'); btn.setAttribute('aria-pressed', 'true');
  if (ph === 'b') { mB = v; soutienWb('wb-soutien-b', v === 1 ? MSG_TRES_MAL : ''); return; }
  mA = v; document.getElementById('cv-b').textContent = mB || '—'; document.getElementById('cv-a').textContent = mA;
  const d = mA - mB;
  document.getElementById('cmp-msg').textContent = !mB ? '' : d > 0 ? 'Votre humeur s\'est améliorée après la séance' : d < 0 ? '' : 'Votre humeur est stable.';
  soutienWb('wb-soutien-a', v === 1 ? MSG_TRES_MAL : mB && d < 0 ? MSG_BAISSE : '');
  document.getElementById('cmp-box').style.display = 'block';
}

// ---------- Écran de choix
function initBienEtre() {
  const z = document.getElementById('wb-intentions');
  if (!z.children.length) z.innerHTML = Object.entries(INTENTIONS).map(([k, i]) =>
    `<div class="wb-card" role="button" tabindex="0" aria-pressed="false" data-i="${k}" onclick="choisirIntention('${k}',this)"><div class="wb-em" aria-hidden="true">${i.em}</div><div class="wb-t">${i.t}</div></div>`).join('');
  preparerPool(); afficherJournal();
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
  wb.duree = +el.dataset.d; // 0 : à mon rythme (pas de minuteur)
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
// Nombre de consignes selon la durée : moins de consignes pour les séances courtes, pour ne pas presser le regard
function consignes() {
  const g = INTENTIONS[wb.intention].g, n = !wb.duree || wb.duree >= 300 ? g.length : wb.duree >= 180 ? 5 : 4;
  return n >= g.length ? g : g.slice(0, n - 1).concat(g[g.length - 1]);
}
function afficherOeuvreWb(f) {
  const sv = document.getElementById('sv-img'); sv.src = f.image; sv.alt = f.titre + (f.artiste ? ', ' + f.artiste : '');
  document.getElementById('sv-cap').textContent = [f.titre, f.artiste, f.date, f.musee].filter(Boolean).join(' · ');
  document.getElementById('sv-credit').innerHTML = f.credit ? (/^Image/.test(f.credit) ? f.credit : 'Image : ' + f.credit) : '';
  document.getElementById('sv-acc').innerHTML = boutonAcces(f);
  const p = document.getElementById('sv-pourquoi'); p.innerHTML = pourquoiOeuvre(f); p.hidden = !p.innerHTML;
  document.getElementById('sv-musique-l').hidden = !f.v;
  if (wb.musique && tRun) { musiqueWb(false); musiqueWb(true); }
}
function startWb() {
  const k = wb.intention, f = wb.choix; if (!k || !f) return;
  const i = INTENTIONS[k], libre = !wb.duree;
  tSec = wb.duree; tRun = false; tDone = false; mB = 0; mA = 0; etapeWb = -1;
  document.getElementById('sv-h').textContent = i.t;
  afficherOeuvreWb(f);
  guideWb(0, true);
  document.getElementById('sv-souffle').hidden = true;
  document.getElementById('sv-souffle-l').hidden = !i.souffle;
  // Guidage vocal, respiration et musique sont cochés par défaut ; on peut les décocher à tout moment
  document.getElementById('sv-voix').checked = wb.voix = true;
  document.getElementById('sv-souffle-c').checked = wb.souffle = true;
  document.getElementById('sv-musique-c').checked = wb.musique = true;
  document.getElementById('t-ring').textContent = libre ? '∞' : fmtT(tSec);
  document.getElementById('t-ring').setAttribute('aria-label', libre ? 'À mon rythme, sans minuteur' : fmtT(tSec));
  document.getElementById('t-st').textContent = libre ? 'À mon rythme' : 'Prêt à démarrer';
  document.getElementById('t-btn').innerHTML = '<span aria-hidden="true">▶</span> Démarrer la séance';
  document.getElementById('t-btn').style.display = 'block';
  document.getElementById('t-suivant').hidden = true;
  document.getElementById('after-sec').style.display = 'none';
  document.getElementById('cmp-box').style.display = 'none';
  document.getElementById('jrnl').value = ''; document.getElementById('wb-emporte').value = '';
  document.getElementById('wb-enreg-msg').textContent = '';
  soutienWb('wb-soutien-b', ''); soutienWb('wb-soutien-a', '');
  document.getElementById('wb-suite').textContent = i.suite;
  document.querySelectorAll('#mb-row .mbd,#ma-row .mbd').forEach(b => { b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); });
  document.getElementById('wb-list').style.display = 'none';
  document.getElementById('wb-sess').style.display = 'block';
  // La séance commence en haut de l'écran, juste sous le menu : œuvre, guide et minuteur visibles sans défiler
  const w = document.querySelector('#wb-sess .sv-wrap'), nav = document.querySelector('nav');
  window.scrollTo(0, Math.max(0, w.getBoundingClientRect().top + window.scrollY - (nav ? nav.offsetHeight : 0) - 8)); document.getElementById('sv-h').tabIndex = -1; document.getElementById('sv-h').focus({ preventScroll: true });
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
  const g = consignes(); if (n === etapeWb && !force) return; etapeWb = n;
  const txt = n >= g.length ? FIN_SEANCE : g[n];
  document.getElementById('sv-g').innerHTML = `<span class="sv-etape">${n >= g.length ? '' : (n + 1) + ' / ' + g.length}</span> <span>${esc(txt)}</span>`;
  if (wb.voix && (tRun || n >= g.length) && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t(txt)); u.lang = LANGUES[langue]; window.speechSynthesis.speak(u);
  }
}
function voixWb(on) { wb.voix = on; if (on && tRun) guideWb(etapeWb, true); if (!on && 'speechSynthesis' in window) window.speechSynthesis.cancel(); }
// Respiration guidée, facultative (elle peut gêner certaines personnes : angoisse, asthme…) : 4 secondes d'inspiration, 6 d'expiration
function souffleChoisiWb(on) { wb.souffle = on; souffleWb(on && tRun); }
function souffleWb(on) {
  const z = document.getElementById('sv-souffle'), txt = document.getElementById('sv-souffle-txt');
  clearTimeout(souffleInt); souffleInt = null;
  if (!on || !wb.souffle || !INTENTIONS[wb.intention].souffle) { z.hidden = true; z.classList.remove('expire'); return; }
  z.hidden = false;
  const cycle = inspire => { z.classList.toggle('expire', !inspire); txt.textContent = inspire ? 'Inspirez' : 'Expirez'; souffleInt = setTimeout(() => cycle(!inspire), inspire ? 4000 : 6000); };
  cycle(true);
}
// Musique douce de fond : la musique des couleurs (version simple) de l'œuvre, jouée en boucle et moins fort
let musiqueWbEnCours = null;
function musiqueChoisieWb(on) { wb.musique = on; musiqueWb(on && tRun); }
function musiqueWb(on) {
  if (musiqueWbEnCours) { clearTimeout(musiqueWbEnCours.fin); if (typeof couperMusique === 'function') couperMusique(musiqueWbEnCours); musiqueWbEnCours = null; }
  if (!on || !wb.musique || !wb.choix || !wb.choix.v || typeof programmerMusique !== 'function') return;
  const m = programmerMusique(wb.choix.v); m.sortie.gain.value = 0.14;
  musiqueWbEnCours = { sortie: m.sortie, fin: setTimeout(() => { musiqueWbEnCours = null; musiqueWb(tRun); }, m.duree) };
}
function stopWb() {
  clearInterval(tInt); tInt = null; tRun = false; souffleWb(false); musiqueWb(false);
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (typeof fermerAcces === 'function' && document.getElementById('acc-modal') && !document.getElementById('acc-modal').hidden) fermerAcces();
  document.getElementById('wb-list').style.display = 'block'; document.getElementById('wb-sess').style.display = 'none';
  afficherJournal();
}
function finirSeanceWb() {
  clearInterval(tInt); tInt = null; tRun = false; tDone = true; souffleWb(false); musiqueWb(false); guideWb(consignes().length);
  document.getElementById('t-st').innerHTML = '<span aria-hidden="true">✓</span> Séance terminée';
  document.getElementById('t-btn').style.display = 'none'; document.getElementById('t-suivant').hidden = true;
  const fin = document.getElementById('after-sec'); fin.style.display = 'block';
  fin.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
}
// « À mon rythme » : le visiteur passe lui-même à la consigne suivante
function consigneSuivanteWb() {
  if (etapeWb + 1 >= consignes().length) finirSeanceWb(); else guideWb(etapeWb + 1);
}
function tickTimer() {
  if (tDone) return;
  const total = wb.duree, g = consignes();
  if (!total) { // à mon rythme : pas de minuteur
    tRun = true; souffleWb(true); musiqueWb(true); guideWb(Math.max(0, etapeWb), true);
    document.getElementById('t-btn').style.display = 'none'; document.getElementById('t-st').textContent = 'À mon rythme';
    const s = document.getElementById('t-suivant'); s.hidden = false; s.focus();
    return;
  }
  if (tRun) {
    clearInterval(tInt); tInt = null; tRun = false; souffleWb(false); musiqueWb(false);
    document.getElementById('t-btn').innerHTML = '<span aria-hidden="true">▶</span> Reprendre'; document.getElementById('t-st').textContent = 'En pause';
  } else {
    tRun = true; souffleWb(true); musiqueWb(true);
    document.getElementById('t-btn').innerHTML = '<span aria-hidden="true">⏸</span> Pause'; document.getElementById('t-st').textContent = 'Séance en cours…';
    guideWb(Math.min(g.length - 1, Math.floor((total - tSec) / (total / g.length))), true);
    tInt = setInterval(() => {
      if (tSec > 0) {
        tSec--; document.getElementById('t-ring').textContent = fmtT(tSec);
        guideWb(Math.min(g.length - 1, Math.floor((total - tSec) / (total / g.length)))); // le guide change à intervalles réguliers
      } else finirSeanceWb();
    }, 1000);
  }
}

// ---------- Journal privé : enregistré seulement si le visiteur le demande, et seulement dans ce navigateur (rien n'est envoyé)
const CLE_JOURNAL = 'jrb-bien-etre-journal';
function lireJournal() { try { return JSON.parse(localStorage.getItem(CLE_JOURNAL) || '[]'); } catch (e) { return []; } }
function enregistrerSeanceWb() {
  const f = wb.choix || {}, j = lireJournal();
  j.unshift({ date: new Date().toISOString(), intention: INTENTIONS[wb.intention].t, oeuvre: [f.titre, f.artiste].filter(Boolean).join(', '),
    avant: mB || null, apres: mA || null, note: document.getElementById('jrnl').value.trim(), emporte: document.getElementById('wb-emporte').value.trim() });
  const m = document.getElementById('wb-enreg-msg');
  try { localStorage.setItem(CLE_JOURNAL, JSON.stringify(j.slice(0, 200))); m.textContent = 'Séance enregistrée dans votre journal, sur cet appareil.'; afficherJournal(); }
  catch (e) { m.textContent = 'Impossible d\'enregistrer sur cet appareil (navigation privée ou stockage désactivé).'; }
}
const HUMEURS = ['', '😔', '😕', '😐', '🙂', '😊'];
function afficherJournal() {
  const z = document.getElementById('wb-journal-liste'), b = document.getElementById('wb-journal-n'); if (!z) return;
  const j = lireJournal(); if (b) b.textContent = j.length;
  z.innerHTML = j.length ? j.map(s => `<li><b>${esc(new Date(s.date).toLocaleDateString(typeof LANGUES !== 'undefined' ? LANGUES[langue] : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }))}</b> · <span>${esc(s.intention)}</span>${s.oeuvre ? ' · ' + esc(s.oeuvre) : ''}${s.avant || s.apres ? ` · <span aria-label="humeur avant et après">${HUMEURS[s.avant] || '—'} → ${HUMEURS[s.apres] || '—'}</span>` : ''}${s.note ? `<br><span class="wb-j-note">${esc(s.note)}</span>` : ''}${s.emporte ? `<br><span class="wb-j-note">↳ ${esc(s.emporte)}</span>` : ''}</li>`).join('')
    : '<li><span>Aucune séance enregistrée pour le moment.</span></li>';
}
function telechargerJournal() {
  const j = lireJournal(); if (!j.length) return;
  const txt = 'Journal de séances — Jaune-Rouge-Bleu (bien-être par l\'art)\n\n' + j.map(s => `${new Date(s.date).toLocaleString('fr-FR')} — ${s.intention}${s.oeuvre ? ' — ' + s.oeuvre : ''}\nHumeur : ${s.avant || '—'} → ${s.apres || '—'} (sur 5)${s.note ? '\nNotes : ' + s.note : ''}${s.emporte ? '\nCe que j\'emporte : ' + s.emporte : ''}`).join('\n\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' })); a.download = 'journal-bien-etre.txt';
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
function effacerJournal() {
  if (!confirm(t('Effacer définitivement toutes les séances enregistrées sur cet appareil ?'))) return;
  try { localStorage.removeItem(CLE_JOURNAL); } catch (e) { }
  afficherJournal();
}
