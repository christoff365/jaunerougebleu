// ORCHESTRE : deux autres façons de composer la musique des couleurs, avec de vrais instruments.
// « Symphonie » : une petite symphonie en forme sonate (introduction, deux thèmes, développement, réexposition, coda),
// dont l'orchestre est choisi par les couleurs de l'œuvre et les thèmes tirés de l'image.
// « Expérimentale » : l'image jouée comme une partition (à la manière du synthétiseur ANS de Mourzine et de l'UPIC de Xenakis),
// avec des nuages de notes, des motifs répétés qui se décalent (à la manière de Steve Reich) et des sons transformés (musique concrète).
// Les sons d'instruments viennent de « VS Chamber Orchestra: Community Edition » (Versilian Studios), dans le domaine public (CC0),
// réduits à quelques notes par instrument (dossier sons/orchestre/) : chaque note jouée est la plus proche, accordée à la bonne hauteur.
// Ce fichier utilise des fonctions et valeurs de index.html : audio, programmerMusique, MODES, DEMITONS, NOTES.

const ORCH_BASE = ((document.currentScript && document.currentScript.src) || location.href).replace(/[?#].*$/, '').replace(/[^/]*$/, '') + 'sons/orchestre/';
// Notes enregistrées de chaque instrument (numéros MIDI : 60 = do du milieu du piano) ; pour les timbales, hauteur mesurée de chaque fût
const ECHANTILLONS = {
  violons: [55, 59, 62, 66, 69, 72, 76, 79, 83, 86], altos: [48, 52, 55, 59, 62, 65, 69, 72, 76, 79, 83, 86],
  violoncelles: [36, 40, 43, 47, 50, 53, 57, 60, 64, 67, 71, 74, 77], contrebasse: [30, 34, 38, 42, 45, 49, 52, 56, 59],
  pizzicati: [55, 59, 62, 66, 69, 72, 76, 79, 83, 86], flute: [60, 64, 69, 72, 76, 81, 84, 88, 93, 96],
  hautbois: [58, 62, 65, 70, 74, 77, 82, 86, 89], clarinette: [50, 53, 58, 62, 65, 70, 74, 77, 82, 86],
  basson: [34, 37, 41, 45, 48, 55, 60, 63, 68, 72, 75], cor: [33, 36, 39, 43, 46, 50, 53, 57, 60, 74, 77],
  trompette: [53, 57, 60, 63, 67, 70, 74, 77, 81, 84], trombone: [34, 37, 41, 46, 50, 53, 60, 63],
  tuba: [29, 34, 39, 46, 50, 53, 58, 62], glockenspiel: [79, 84, 91, 96, 103, 108],
  marimba: [41, 48, 55, 59, 65, 72, 79, 83, 89, 96], piano: [33, 41, 49, 57, 65, 73, 81, 89],
  timbales: { 1: 41.4, 2: 46.8, 3: 49.5, 4: 52.4, 5: 54.5 }, gong: [0, 1], cymbale: [0, 1], cloches: [1, 2, 3, 4]
};
const PART_HABITUELLE = { rouge: 0.08, brun: 0.5, or: 0.13, vert: 0.08, bleu: 0.14, violet: 0.04 };
const PERCUSSIFS = new Set(['pizzicati', 'glockenspiel', 'marimba', 'piano', 'timbales', 'gong', 'cymbale', 'cloches']);
// Tessiture confortable de chaque instrument quand il joue une mélodie
const TESSITURES = { violons: [67, 88], flute: [72, 93], hautbois: [62, 84], clarinette: [55, 81], trompette: [60, 79], cor: [50, 72], violoncelles: [48, 69], altos: [57, 76], basson: [45, 64] };
// Couleur → soliste : bleu → violons, rouge → trompette, brun → cor, or → flûte, vert → clarinette, violet → hautbois
const SOLISTES = { bleu: ['violons', 'flute'], rouge: ['trompette', 'cor'], brun: ['cor', 'violoncelles'], or: ['flute', 'hautbois'], vert: ['clarinette', 'hautbois'], violet: ['hautbois', 'clarinette'] };

const tampons = {};
function chargerSon(inst, n) {
  const k = inst + '/' + n;
  if (!tampons[k]) tampons[k] = fetch(ORCH_BASE + k + '.mp3').then(r => { if (!r.ok) throw new Error(k); return r.arrayBuffer(); })
    .then(b => new Promise((ok, ko) => audio.decodeAudioData(b, ok, ko)))
    .catch(e => { delete tampons[k]; throw e; });
  return tampons[k];
}
// Charge les instruments demandés ; renvoie { instrument: [{n, buf}] } triés par hauteur
async function chargerInstruments(liste) {
  const sons = {};
  await Promise.all(liste.map(async inst => {
    const e = ECHANTILLONS[inst], notes = Array.isArray(e) ? e.map(n => [n, n]) : Object.entries(e).map(([f, n]) => [f, n]);
    sons[inst] = (await Promise.all(notes.map(async ([f, n]) => ({ n, buf: await chargerSon(inst, f) })))).sort((a, b) => a.n - b.n);
  }));
  return sons;
}

// Chaîne commune : instruments → bus → (sec + salle de concert) → compresseur → sortie (coupée par couperMusique) → analyseur
function preparerSortie(hasard, salle, mouille) {
  const sortie = audio.createGain(); sortie.gain.value = 0.9;
  const comp = audio.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.3;
  comp.connect(sortie); sortie.connect(audio.analyseur);
  const bus = audio.createGain(); bus.connect(comp);
  const rev = audio.createConvolver(), len = Math.floor(audio.sampleRate * salle), ir = audio.createBuffer(2, len, audio.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (hasard() * 2 - 1) * Math.pow(1 - i / len, 2.6) * (i < 400 ? i / 400 : 1); }
  rev.buffer = ir; const g = audio.createGain(); g.gain.value = mouille; bus.connect(rev); rev.connect(g); g.connect(comp);
  return { sortie, bus };
}
function hasardDe(v) {
  let g0 = (v.graine || (v.note * 7919 + Math.round(v.L * 1e4))) >>> 0;
  return () => { g0 = (g0 + 0x6D2B79F5) >>> 0; let t = g0; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

// Joue une note d'un instrument : échantillon le plus proche, accordé ; les notes longues enchaînent plusieurs échantillons en fondu
function noteOrch(o, inst, m, t, dur, vol, pan, opt = {}) {
  const l = o.sons[inst]; if (!l || !l.length || !(vol > 0)) return;
  const perc = PERCUSSIFS.has(inst);
  if (inst !== 'timbales' && inst !== 'gong' && inst !== 'cymbale' && inst !== 'cloches') {
    while (m < l[0].n - 4) m += 12; while (m > l[l.length - 1].n + 5) m -= 12;
  }
  let e = l[0]; for (const x of l) if (Math.abs(x.n - m) < Math.abs(e.n - m)) e = x;
  const vitesse = opt.vitesse || Math.pow(2, (m - e.n) / 12);
  let dest = o.bus;
  if (pan && audio.createStereoPanner) { const p = audio.createStereoPanner(); p.pan.value = Math.max(-0.9, Math.min(0.9, pan)); p.connect(o.bus); dest = p; }
  const att = opt.attaque != null ? opt.attaque : perc ? 0.003 : 0.07, rel = opt.relache || (perc ? 0.4 : 0.35);
  const longueur = e.buf.duration / vitesse; // durée utile de l'échantillon, une fois accordé
  const buf = opt.envers ? envers(e.buf) : e.buf;
  if (perc || dur <= longueur - 0.45) {
    const s = audio.createBufferSource(), g = audio.createGain(); s.buffer = buf; s.playbackRate.value = vitesse;
    const fin = perc ? Math.min(t + longueur, t + dur + rel) : t + dur;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + att);
    if (opt.crescendo) g.gain.linearRampToValueAtTime(vol * opt.crescendo, Math.max(t + att, fin - 0.05));
    if (!perc || opt.etouffe) { g.gain.setValueAtTime(vol * (opt.crescendo || 1), Math.max(t + att, fin)); g.gain.setTargetAtTime(0, Math.max(t + att, fin), rel / 3); }
    if (opt.envers) { g.gain.setValueAtTime(vol, Math.max(t + att, t + longueur - 0.12)); g.gain.linearRampToValueAtTime(0, t + longueur - 0.01); } // son à l'envers : pas d'arrêt net sur l'attaque
    s.connect(g); g.connect(dest); s.start(t); s.stop(Math.min(t + longueur, fin + rel + 0.1));
    return;
  }
  // Note tenue plus longue que l'enregistrement : morceaux successifs pris après l'attaque, en fondu enchaîné
  const saut = 0.6, fondu = 0.45; let debut = t, premier = true;
  while (debut < t + dur - 0.05) {
    const off = premier ? 0 : saut, utile = (e.buf.duration - off) / vitesse - 0.45;
    const fin = Math.min(t + dur, debut + utile), dernier = fin >= t + dur - 0.01;
    const s = audio.createBufferSource(), g = audio.createGain(); s.buffer = e.buf; s.playbackRate.value = vitesse;
    const a = premier ? att : fondu;
    g.gain.setValueAtTime(0, debut); g.gain.linearRampToValueAtTime(vol, debut + a); g.gain.setValueAtTime(vol, Math.max(debut + a, fin));
    if (dernier) g.gain.setTargetAtTime(0, fin, rel / 3); else g.gain.linearRampToValueAtTime(0, fin + fondu);
    s.connect(g); g.connect(dest); s.start(debut, off); s.stop(fin + (dernier ? rel + 0.1 : fondu + 0.05));
    if (dernier) break;
    debut = fin; premier = false;
  }
}
// Les cinq fûts couvrent fa 2 à fa# 3 : la note est ramenée dans cette étendue (le fût le plus proche est accordé par noteOrch)
const noteTimbale = m => { while (m > 56) m -= 12; while (m < 39) m += 12; return m; };
const tamponsEnvers = new WeakMap();
function envers(b) {
  if (tamponsEnvers.has(b)) return tamponsEnvers.get(b);
  const r = audio.createBuffer(b.numberOfChannels, b.length, b.sampleRate);
  for (let c = 0; c < b.numberOfChannels; c++) { const s = b.getChannelData(c), d = r.getChannelData(c); for (let i = 0; i < s.length; i++) d[i] = s[s.length - 1 - i]; }
  tamponsEnvers.set(b, r); return r;
}

// ---------- Harmonie
const MODES_MAJEURS = ['lydien', 'ionien', 'mixolydien'];
function tonalite(base, modeNom) { return { base, modeNom, gamme: MODES[modeNom] || MODES.ionien, majeur: MODES_MAJEURS.includes(modeNom) }; }
const mod7 = d => ((d % 7) + 7) % 7;
// Hauteur du degré d de la tonalité ; « sensible » : dans les modes mineurs, le 7e degré est haussé dans l'accord de dominante (cadence classique)
function hauteurDeg(ton, d, sensible) { let m = ton.base + ton.gamme[mod7(d)] + 12 * Math.floor(d / 7); if (sensible && mod7(d) === 6 && !ton.majeur && ton.gamme[6] === 10) m += 1; return m; }
function degreAuDessus(ton, cible) { let d = -21; while (hauteurDeg(ton, d) < cible) d++; return d; }
// Notes (classes de hauteur) de l'accord du degré deg : triade, ou septième
function classesAccord(ton, deg, septieme) {
  return [0, 2, 4].concat(septieme ? [6] : []).map(x => ((hauteurDeg(ton, deg + x, mod7(deg) === 4) % 12) + 12) % 12);
}
// Voix intérieures : chaque voix va vers la note de l'accord la plus proche (conduite des voix sans grands sauts)
function enchainer(prec, classes, bas, haut) {
  const voix = prec && prec.length ? prec.slice() : [bas + 4, bas + 8, bas + 12];
  const pris = new Set(), res = [];
  voix.forEach(v => {
    let best = null;
    for (let m = bas; m <= haut; m++) { const c = m % 12; if (!classes.includes(c)) continue; const cout = Math.abs(m - v) + (pris.has(c) ? 4 : 0); if (best == null || cout < best.c) best = { m, c: cout }; }
    if (best) { res.push(best.m); pris.add(best.m % 12); }
  });
  return res.sort((a, b) => a - b);
}
const plusProche = (m, classes) => { let b = m, e = 99; for (let x = m - 6; x <= m + 6; x++) if (classes.includes(((x % 12) + 12) % 12) && Math.abs(x - m) < e) { e = Math.abs(x - m); b = x; } return b; };

// ---------- Mélodie : une phrase de 4 mesures dont les notes-repères viennent de l'image (valeurs de 0 à 1)
const CELLULES_A = [[2, 2, 2, 2], [3, 1, 2, 2], [4, 2, 2], [2, 2, 4], [1, 1, 2, 2, 2], [6, 2], [2, 1, 1, 4], [3, 1, 3, 1]]; // en croches, 8 par mesure
const CELLULES_B = [[6, 2], [4, 4], [8], [3, 1, 4], [2, 2, 4], [4, 2, 2]];
function phrase(ton, accords, reperes, cellules, registre, cadence) {
  const [lo, hi] = registre, notes = []; let prec = null;
  accords.forEach((ac, b) => {
    const classes = classesAccord(ton, ac.deg, false), der = b === accords.length - 1;
    const cell = der ? (cadence === 'demi' ? [4, 4] : [8]) : cellules[b % cellules.length];
    const A = reperes[(2 * b) % reperes.length], B = reperes[(2 * b + 1) % reperes.length];
    const dA = lo + Math.round(A * (hi - lo)), dB = lo + Math.round(B * (hi - lo));
    let x = 0;
    cell.forEach((c, i) => {
      let d = Math.round(dA + (dB - dA) * (cell.length > 1 ? i / (cell.length - 1) : 0));
      let m = hauteurDeg(ton, d, mod7(ac.deg) === 4);
      if (x === 0 || x === 4 || der) m = plusProche(m, classes); // temps forts : une note de l'accord
      if (der && i === cell.length - 1 && cadence === 'parfaite') m = plusProche(m, [((ton.base % 12) + 12) % 12]); // finir sur la tonique
      if (prec != null) { while (m - prec > 9) m -= 12; while (prec - m > 9) m += 12; if (m === prec && cell.length > 2 && i > 0) m = hauteurDeg(ton, d + (dB >= dA ? 1 : -1)); }
      const bas = hauteurDeg(ton, lo), haut = hauteurDeg(ton, hi); while (m < bas) m += 12; while (m > haut + 2) m -= 12;
      notes.push({ t: b * 4 + x / 2, d: c / 2, m, accent: x === 0 });
      prec = m; x += c;
    });
  });
  return notes;
}

// ---------- Symphonie
async function composerSymphonie(v, o) {
  const hasard = o.hasard, choix = l => l[Math.floor(hasard() * l.length)];
  const fam = v.familles || { bleu: 1 };
  // Chaque famille est comparée à sa part habituelle dans les œuvres (le brun des vernis et des papiers anciens est partout) :
  // c'est la couleur la plus marquante, pas la plus étendue, qui choisit le soliste
  const ordre = Object.entries(fam).filter(x => x[1] > 0.04).sort((a, b) => b[1] / PART_HABITUELLE[b[0]] - a[1] / PART_HABITUELLE[a[0]]).map(x => x[0]);
  if (!ordre.length) ordre.push(v.L > 0.5 ? 'or' : 'bleu');
  // Les bruns se distinguent par leur clarté : bois sombres → violoncelles, bruns moyens → cor, beiges et papiers clairs → hautbois
  const soliste = f => f === 'brun' ? (v.L < 0.36 ? ['violoncelles', 'cor'] : v.L < 0.52 ? ['cor', 'basson'] : ['hautbois', 'clarinette']) : SOLISTES[f];
  const solA = soliste(ordre[0])[0];
  let solB = soliste(ordre[1] || (ordre[0] === 'or' ? 'bleu' : 'or'))[0]; if (solB === solA) solB = soliste(ordre[1] || 'or')[1];
  if (solB === solA) solB = solA === 'flute' ? 'hautbois' : 'flute';
  const cuivres = (fam.rouge || 0) + 0.25 * (fam.brun || 0) > 0.32 || v.energie === 'Forte' || v.C > 0.26;
  const dore = (fam.or || 0) > 0.18 && v.L > 0.45, harpe = v.L > 0.5;
  const tex = v.texture == null ? 0.05 : v.texture;
  const tempo = Math.max(66, Math.min(132, v.tempo)), noire = 60 / tempo, mes = noire * 4;
  const ton1 = tonalite(48 + DEMITONS[v.note] - (DEMITONS[v.note] > 6 ? 12 : 0), v.modeNom || (v.mode === 'majeur' ? 'ionien' : 'éolien'));
  // Second thème : à la dominante (modes majeurs) ou au relatif majeur (modes mineurs), comme dans une sonate classique
  let base2 = ton1.majeur ? ton1.base + 7 : ton1.base + ton1.gamme[2]; if (base2 > 59) base2 -= 12;
  const ton2 = tonalite(base2, 'ionien');
  const cols = v.colonnes.map(c => Math.max(0, Math.min(1, (c.l - 0.08) / 0.8)));
  const rangs = v.lignes.map(c => Math.max(0, Math.min(1, (c.l - 0.08) / 0.8)));
  const instruments = ['violons', 'altos', 'violoncelles', 'contrebasse', 'timbales', solA, solB, 'flute', 'clarinette', 'cor'];
  if (cuivres) instruments.push('trompette', 'trombone', 'tuba');
  if (tex > 0.07) instruments.push('pizzicati');
  if (harpe) instruments.push('piano');
  if (dore) instruments.push('glockenspiel');
  if (v.energie === 'Forte') instruments.push('cymbale');
  if (v.L < 0.4) instruments.push('basson');
  o.sons = await chargerInstruments([...new Set(instruments)]);
  if (o.annule()) return null;
  const debut = audio.currentTime + 0.15; let t = debut;
  // Accompagnement : selon la texture de l'œuvre, accords tenus (aplats), batteries de croches, ou arpèges et pizzicati (touches fines)
  const accomp = tex < 0.035 ? 'tenu' : tex < 0.06 ? choix(['tenu', 'arpege']) : tex < 0.09 ? choix(['arpege', 'battu']) : choix(['battu', 'pizz']);
  let voix = null;
  const mesure = (ton, deg, opts = {}) => {
    const sept = opts.septieme || (mod7(deg) === 4 && (v.couleurs || 2) >= 3);
    const classes = classesAccord(ton, deg, sept), nuance = opts.nuance || 0.6;
    voix = enchainer(voix, classes, 55, 74);
    const rac = hauteurDeg(ton, deg, false) % 12, basse = 36 + ((rac - 0 + 12) % 12) + (rac < 4 ? 12 : 0); // basse entre mi 2 et ré dièse 3
    const style = opts.accomp || accomp, dur = opts.duree || mes;
    // Basses : violoncelles et contrebasse à l'octave
    noteOrch(o, 'violoncelles', basse, t, dur, 0.5 * nuance, -0.25);
    noteOrch(o, 'contrebasse', basse - 12, t, dur, 0.42 * nuance, -0.2);
    if (opts.cuivres && cuivres) { noteOrch(o, 'tuba', basse - 12, t, dur, 0.35 * nuance, 0); voix.slice(0, 2).forEach((m, i) => noteOrch(o, i ? 'cor' : 'trombone', m - 12, t, dur * 0.95, 0.28 * nuance, 0.3)); }
    if (style === 'tenu' || dur !== mes) voix.forEach((m, i) => noteOrch(o, i < 2 ? 'altos' : 'violons', m, t, dur, 0.3 * nuance, i ? 0.35 : 0.15));
    else if (style === 'battu') for (let c = 0; c < 8; c++) voix.forEach((m, i) => noteOrch(o, i < 2 ? 'altos' : 'violons', m, t + c * noire / 2, noire / 2 * 0.85, (c % 2 ? 0.17 : 0.23) * nuance, i ? 0.35 : 0.15, { attaque: 0.02, relache: 0.08 }));
    else if (style === 'arpege') { const inst = harpe ? 'piano' : 'altos', mot = [0, 1, 2, 1, 2, 1, 0, 1]; for (let c = 0; c < 8; c++) noteOrch(o, inst, voix[Math.min(mot[c], voix.length - 1)], t + c * noire / 2, noire * (harpe ? 1.5 : 0.48), (harpe ? 0.32 : 0.22) * nuance, 0.3, { attaque: harpe ? 0.003 : 0.03 }); noteOrch(o, 'altos', voix[0], t, dur, 0.14 * nuance, 0.1); }
    else { for (let q = 0; q < 4; q++) { if (q % 2 === 0) noteOrch(o, 'pizzicati', basse + 12, t + q * noire, noire, 0.4 * nuance, -0.3); else voix.forEach(m => noteOrch(o, 'pizzicati', m, t + q * noire, noire, 0.25 * nuance, 0.3)); } }
    if (opts.timbales) timbale(deg === 0 ? ton.base : hauteurDeg(ton, 4), t, opts.timbales * nuance, opts.roulement ? dur : 0);
  };
  const timbale = (m, tt, vol, roulement) => {
    const cible = noteTimbale(m), coups = roulement ? Math.max(1, Math.floor(roulement / (noire / 4))) : 1;
    for (let i = 0; i < coups; i++) noteOrch(o, 'timbales', cible, tt + i * noire / 4, noire, vol * (roulement ? 0.35 + 0.65 * i / coups : 1), -0.1);
  };
  const chanter = (ton, notes, inst, nuance, double) => {
    const [lo, hi] = TESSITURES[inst] || [60, 84];
    notes.forEach(n => {
      let m = n.m; while (m < lo) m += 12; while (m > hi) m -= 12;
      const tt = t + n.t * noire, d = n.d * noire;
      noteOrch(o, inst, m, tt, d * 1.02, (n.accent ? 0.62 : 0.52) * nuance, inst === 'violons' ? -0.1 : 0.15, { attaque: d < noire * 0.6 ? 0.025 : 0.06 });
      if (double) { let m2 = m + (double === 'flute' || double === 'glockenspiel' ? 12 : -12); noteOrch(o, double, m2, tt, d, (double === 'glockenspiel' ? 0.18 : 0.3) * nuance, 0.25); }
    });
  };
  const registreDe = (ton, inst) => { const [lo, hi] = TESSITURES[inst] || [60, 84]; return [degreAuDessus(ton, lo + 2), degreAuDessus(ton, hi - 3)]; };
  const cellsA = [choix(CELLULES_A.filter(c => tex > 0.06 || c.length <= 4)), choix(CELLULES_A)];
  const cellsB = [choix(CELLULES_B), choix(CELLULES_B)];
  const prog = (P, cad) => P.slice(0, 3).map(deg => ({ deg })).concat([{ deg: cad === 'demi' ? 4 : 0 }]);
  const PROGS = [[0, 3, 4], [0, 5, 1], [0, 1, 4], [0, 5, 3], [0, 3, 1], [0, 4, 5]];
  const pA1 = choix(PROGS), pA2 = choix(PROGS);
  // Phrases du thème A (colonnes de l'image, de gauche à droite) et du thème B (lignes, de haut en bas)
  const accA1 = prog(pA1, 'demi'), accA2 = [{ deg: pA2[0] }, { deg: pA2[1] }, { deg: 4 }, { deg: 0 }];
  const themeA1 = phrase(ton1, accA1, cols.slice(0, 8), cellsA, registreDe(ton1, solA), 'demi');
  const themeA2 = phrase(ton1, accA2, cols.slice(8, 16), cellsA, registreDe(ton1, solA), 'parfaite');
  const pB = choix(PROGS);
  const accB1 = prog(pB, 'demi'), accB2 = [{ deg: 3 }, { deg: 1 }, { deg: 4 }, { deg: 0 }];
  const themeB = ton => [phrase(ton, accB1, rangs.slice(0, 8), cellsB, registreDe(ton, solB), 'demi'), phrase(ton, accB2, rangs.slice(0, 8).reverse(), cellsB, registreDe(ton, solB), 'parfaite')];
  const jouerPhrase = (ton, acc, notes, inst, nuance, opts = {}) => {
    const t0 = t; chanter(ton, notes, inst, nuance, opts.double);
    acc.forEach((a, i) => { mesure(ton, a.deg, Object.assign({ nuance }, opts, { timbales: opts.timbales && i === acc.length - 1 ? opts.timbales : 0 })); t += mes; });
    return t0;
  };
  const sections = [];
  // 1. Introduction : accord de tonique qui s'ouvre (roulement de timbales dans les œuvres sombres, arpège de harpe dans les claires)
  sections.push(['Introduction', t]);
  voix = null;
  if (v.L < 0.45) { mesure(ton1, 0, { nuance: 0.45, accomp: 'tenu', duree: mes * 2, timbales: 0.5, roulement: true }); t += mes * 2; }
  else { mesure(ton1, 0, { nuance: 0.45, accomp: harpe ? 'arpege' : 'tenu' }); t += mes; mesure(ton1, 4, { nuance: 0.5, accomp: harpe ? 'arpege' : 'tenu' }); t += mes; }
  // 2. Exposition : thème A (8 mesures), transition vers la nouvelle tonalité, thème B (8 mesures)
  sections.push(['Thème 1', t]);
  jouerPhrase(ton1, accA1, themeA1, solA, 0.7);
  jouerPhrase(ton1, accA2, themeA2, solA, 0.75, { timbales: 0.45 });
  sections.push(['Transition', t]);
  mesure(ton2, 1, { nuance: 0.6, accomp: 'battu' }); t += mes;
  mesure(ton2, 4, { nuance: 0.65, accomp: 'battu', septieme: true, timbales: 0.4 }); t += mes;
  sections.push(['Thème 2', t]);
  const [b1, b2] = themeB(ton2);
  jouerPhrase(ton2, accB1, b1, solB, 0.55, { accomp: accomp === 'battu' ? 'arpege' : accomp });
  jouerPhrase(ton2, accB2, b2, solB, 0.6, { accomp: accomp === 'battu' ? 'arpege' : accomp, double: solB === 'flute' ? null : (dore ? 'glockenspiel' : null) });
  // 3. Développement : le début du thème A passe d'instrument en instrument, sur des accords qui descendent par quintes, puis pédale de dominante
  sections.push(['Développement', t]);
  const motif = themeA1.filter(n => n.t < 2); const rel = motif.map(n => n.m - motif[0].m);
  const passeurs = [solA, solB, cuivres ? 'cor' : 'clarinette', 'violons'];
  const suite = [5, 1, 4, 0, 3, 6, 2, 5].slice(0, 6);
  suite.forEach((deg, i) => {
    const nuance = 0.55 + 0.35 * i / suite.length, inst = passeurs[i % passeurs.length], [lo, hi] = TESSITURES[inst] || [60, 84];
    let r = hauteurDeg(ton1, deg + 2); while (r < lo + 3) r += 12; while (r > hi - 7) r -= 12;
    [0, 2].forEach(dec => rel.forEach((x, k) => { const n = motif[k]; noteOrch(o, dec ? passeurs[(i + 1) % passeurs.length] : inst, plusProche(r + x, classesAccord(ton1, deg, false).concat(classesAccord(ton1, deg + 1, false))) - (dec ? 12 : 0), t + (n.t + dec) * noire, n.d * noire, 0.5 * nuance, dec ? 0.3 : -0.2); }));
    mesure(ton1, deg, { nuance, accomp: 'battu', cuivres: i >= 4 });
    t += mes;
  });
  mesure(ton1, 4, { nuance: 0.85, accomp: 'battu', septieme: true, timbales: 0.7, roulement: true, cuivres: true });
  if (v.energie === 'Forte') noteOrch(o, 'cymbale', 0, t, mes * 2, 0.35, 0, { vitesse: 1, attaque: 0.3 });
  t += mes;
  mesure(ton1, 4, { nuance: 0.95, accomp: 'battu', septieme: true, timbales: 0.85, roulement: true, cuivres: true }); t += mes;
  // 4. Réexposition : thème A à tout l'orchestre (mélodie doublée), puis thème B dans la tonalité principale
  sections.push(['Réexposition', t]);
  const doublure = solA === 'flute' ? 'violons' : 'flute';
  jouerPhrase(ton1, accA1, themeA1, solA, 0.85, { double: doublure, cuivres: true });
  jouerPhrase(ton1, accA2, themeA2, solA, 0.9, { double: doublure, cuivres: true, timbales: 0.6 });
  const [c1] = themeB(tonalite(ton1.base, ton1.modeNom));
  jouerPhrase(ton1, accB1, c1, solB, 0.7, { double: dore ? 'glockenspiel' : null });
  // 5. Coda : IV – V – I, accord final tenu, coup de timbale
  sections.push(['Coda', t]);
  mesure(ton1, 3, { nuance: 0.85, cuivres: true }); t += mes;
  mesure(ton1, 4, { nuance: 0.95, septieme: true, cuivres: true, timbales: 0.8, roulement: true }); t += mes;
  const fin = mes * 2;
  mesure(ton1, 0, { nuance: 1, accomp: 'tenu', duree: fin, cuivres: true });
  noteOrch(o, solA, plusProche(hauteurDeg(ton1, degreAuDessus(ton1, (TESSITURES[solA] || [60])[0] + 7)), [ton1.base % 12]), t, fin, 0.6, 0);
  noteOrch(o, 'flute', ton1.base + 36, t, fin, 0.3, 0.25);
  timbale(ton1.base, t, 1, 0); if (dore) noteOrch(o, 'glockenspiel', ton1.base + 48, t, 3, 0.3, 0.3);
  t += fin;
  return { fin: t + 2.5, sections: sections.map(([n, x]) => [n, x - debut]), orchestre: [...new Set(instruments)] };
}

// ---------- Expérimentale
async function composerExperimentale(v, o) {
  const hasard = o.hasard;
  const g = v.grille || [], C = 32, R = 16, D = 48; // 48 secondes de lecture de l'image
  const lum = g.map(c => c.l), moy = lum.reduce((a, b) => a + b, 0) / (lum.length || 1);
  const ec = Math.sqrt(lum.reduce((a, b) => a + (b - moy) * (b - moy), 0) / (lum.length || 1)) || 0.1;
  const tex = v.texture == null ? 0.05 : v.texture, sombre = v.L < 0.42;
  const ton = tonalite(48 + DEMITONS[v.note] - (DEMITONS[v.note] > 6 ? 12 : 0), v.modeNom || 'éolien');
  // Gamme de la lecture : pentatonique pour les images à peu de couleurs, mode complet sinon, ou chromatique (sons plus étranges) pour les œuvres très contrastées
  const gamme = v.C > 0.27 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : (v.couleurs || 2) <= 2 ? [0, 2, 4, 7, 9] : ton.gamme;
  const hauteurLigne = r => { const k = R - 1 - r; return ton.base + 12 + gamme[k % gamme.length] + 12 * Math.floor(k / gamme.length); };
  const inst = ['pizzicati', 'marimba', 'gong', 'cymbale', 'cloches', 'contrebasse', 'violoncelles', 'timbales', 'glockenspiel'];
  o.sons = await chargerInstruments(inst);
  if (o.annule()) return null;
  const t0 = audio.currentTime + 0.15;
  // 1. L'image lue de gauche à droite : chaque ligne est un son pur, d'autant plus fort que la zone est claire (synthétiseur ANS)
  const nappe = audio.createGain(); nappe.gain.setValueAtTime(0, t0); nappe.gain.linearRampToValueAtTime(1, t0 + 4);
  nappe.gain.setValueAtTime(1, t0 + D - 5); nappe.gain.linearRampToValueAtTime(0, t0 + D + 1.5);
  const filtre = audio.createBiquadFilter(); filtre.type = 'lowpass'; filtre.frequency.value = 2600; nappe.connect(filtre); filtre.connect(o.bus);
  for (let r = 0; r < R; r++) {
    const osc = audio.createOscillator(), gg = audio.createGain();
    osc.type = r < 4 ? 'sine' : 'triangle'; osc.frequency.value = 440 * Math.pow(2, (hauteurLigne(r) - 69) / 12); osc.detune.value = (hasard() - 0.5) * 12;
    const courbe = new Float32Array(C * 4);
    for (let i = 0; i < courbe.length; i++) {
      const x = i / 4, c0 = Math.floor(x), c1 = Math.min(C - 1, c0 + 1), f = x - c0;
      const a = (lum[r * C + c0] || 0) * (1 - f) + (lum[r * C + c1] || 0) * f;
      const z = Math.max(0, Math.min(1, (a - moy) / (2.2 * ec) + 0.45));
      courbe[i] = 0.028 * z * z * (r < 4 ? 0.7 : 1);
    }
    gg.gain.setValueAtTime(0, t0); gg.gain.setValueCurveAtTime(courbe, t0 + 0.01, D);
    let dest = nappe; if (audio.createStereoPanner) { const p = audio.createStereoPanner(); p.pan.value = (r % 2 ? 1 : -1) * (0.2 + 0.5 * hasard()); p.connect(nappe); dest = p; }
    osc.connect(gg); gg.connect(dest); osc.start(t0); osc.stop(t0 + D + 2);
  }
  // 2. Bourdons : gong et cymbale frottée, ralentis (plus graves et plus longs), sur une contrebasse tenue
  noteOrch(o, 'gong', 0, t0, 14, sombre ? 0.55 : 0.35, -0.3, { vitesse: 0.5 });
  noteOrch(o, 'contrebasse', ton.base - 12, t0 + 2, D - 8, sombre ? 0.4 : 0.25, -0.2, { attaque: 2 });
  noteOrch(o, 'violoncelles', ton.base + 7, t0 + 10, D - 18, 0.2, 0.2, { attaque: 3 });
  noteOrch(o, 'cymbale', 1, t0 + 18, 14, 0.4, 0.4, { vitesse: 0.75 });
  // 3. Nuage de notes : des pizzicati et des lames de marimba tombent là où l'image est vive ; plus la touche est fine, plus le nuage est dense
  const densite = 0.6 + Math.min(2.4, tex * 22);
  for (let c = 0; c < C; c++) {
    let poids = 0, lignes = [];
    for (let r = 0; r < R; r++) { const cel = g[r * C + c] || { l: moy, s: 0 }, w = Math.max(0, cel.s - 0.1) * (0.3 + cel.l); poids += w; lignes.push(w); }
    const n = Math.min(9, Math.round(poids / R * 14 * densite));
    for (let k = 0; k < n; k++) {
      let x = hasard() * poids, r = 0; while (r < R - 1 && x > lignes[r]) { x -= lignes[r]; r++; }
      const tt = t0 + (c + hasard()) * D / C, m = hauteurLigne(r) + (r > 10 ? 12 : 0);
      noteOrch(o, (g[r * C + c] || {}).l > 0.6 ? 'marimba' : 'pizzicati', m, tt, 1.2, 0.18 + 0.25 * hasard(), hasard() * 1.6 - 0.8);
    }
  }
  // 4. Motif répété qui se décale : la palette de l'œuvre devient un motif de 6 notes, joué par deux instruments à des vitesses légèrement différentes
  const pal = (v.palette || []).map(c => { const [r, gg, b] = c.match(/\d+/g).map(Number); return (Math.max(r, gg, b) + Math.min(r, gg, b)) / 510; });
  while (pal.length < 6) pal.push(((pal[pal.length - 1] || 0.5) * 0.7 + 0.25) % 1);
  const motif = pal.slice(0, 6).map(l => { const d = Math.round(l * 9); return ton.base + 24 + ton.gamme[d % 7] + 12 * Math.floor(d / 7) - 12; });
  const pas = Math.max(0.13, Math.min(0.24, 30 / Math.max(60, v.tempo))), debutM = t0 + 12, finM = t0 + 40;
  [[1, -0.6, 'marimba'], [1.025, 0.6, v.L > 0.55 ? 'glockenspiel' : 'marimba']].forEach(([vit, pan, ins], j) => {
    for (let i = 0, tt = debutM; tt < finM; i++, tt += pas / vit) {
      const env = Math.min(1, (tt - debutM) / 6, (finM - tt) / 5);
      noteOrch(o, ins, motif[i % motif.length] + (ins === 'glockenspiel' ? 12 : 0), tt, 0.5, (ins === 'glockenspiel' ? 0.14 : 0.3) * env * (0.5 + v.S), pan);
    }
  });
  // 5. Sons transformés : cloches jouées à l'envers qui montent vers le sommet, timbales aux endroits les plus sombres, gong final
  const sommet = t0 + 34;
  [1, 2, 3].forEach(i => noteOrch(o, 'cloches', i, sommet - 3 + i * 0.4, 3, 0.35, (i - 2) * 0.6, { envers: true, vitesse: 0.8 + 0.1 * i }));
  const sombres = Array.from({ length: C }, (_, c) => [c, Array.from({ length: R }, (_, r) => lum[r * C + c] || moy).reduce((a, b) => a + b, 0)]).sort((a, b) => a[1] - b[1]).slice(0, 3);
  sombres.forEach(([c]) => noteOrch(o, 'timbales', noteTimbale(ton.base), t0 + c * D / C, 2, 0.6, -0.1));
  noteOrch(o, 'gong', 0, t0 + D - 5, 7, 0.6, 0, { vitesse: 0.85 });
  return { fin: t0 + D + 5, sections: [['Lecture de l\'image', 0], ['Nuage de notes', 4], ['Motif qui se décale', 12], ['Sommet', 30], ['Résonance', D - 5]], orchestre: inst };
}

// ---------- Lancement : « simple » (synthétiseur, immédiat), « symphonie » ou « experimentale » (vrais instruments, chargés à la demande)
let styleMusique = 'symphonie';
try { styleMusique = localStorage.getItem('style-musique') || 'symphonie'; } catch (e) { }
function choisirStyleMusique(s) {
  styleMusique = s; try { localStorage.setItem('style-musique', s); } catch (e) { }
  document.querySelectorAll('.style-musique .tag').forEach(b => { const oui = b.dataset.style === s; b.classList.toggle('on', oui); b.setAttribute('aria-pressed', oui); });
}
const STYLES_MUSIQUE = [['symphonie', 'Symphonie'], ['experimentale', 'Expérimentale'], ['simple', 'Simple']];
function boutonsStyleMusique() {
  return `<div class="tags style-musique" role="group" aria-label="Style de musique">${STYLES_MUSIQUE.map(([k, l]) => `<button type="button" class="tag${k === styleMusique ? ' on' : ''}" aria-pressed="${k === styleMusique}" data-style="${k}" onclick="choisirStyleMusique(this.dataset.style)">${l}</button>`).join('')}</div>`;
}
document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('.style-musique-ici').forEach(z => { z.innerHTML = boutonsStyleMusique(); }));
const NOMS_INSTRUMENTS = { violons: 'violons', altos: 'altos', violoncelles: 'violoncelles', contrebasse: 'contrebasse', pizzicati: 'pizzicati', flute: 'flûte', hautbois: 'hautbois', clarinette: 'clarinette', basson: 'basson', cor: 'cor', trompette: 'trompette', trombone: 'trombone', tuba: 'tuba', glockenspiel: 'glockenspiel', marimba: 'marimba', piano: 'piano', timbales: 'timbales', gong: 'gong', cymbale: 'cymbale', cloches: 'cloches népalaises' };
// Texte affiché pendant la lecture : style, tonalité, partie en cours (mise à jour toutes les demi-secondes) et instruments ; renvoie l'identifiant du suivi
function suivreMusique(m, v, el) {
  if (!el) return null;
  const debut = Date.now(), nom = { symphonie: 'Symphonie', experimentale: 'Expérimentale', simple: 'Simple' }[m.style];
  const orch = m.orchestre ? `<br><span>Orchestre :</span> ${m.orchestre.map(i => `<span>${NOMS_INSTRUMENTS[i] || i}</span>`).join(', ')}` : '';
  const maj = () => {
    const x = (Date.now() - debut) / 1000; let partie = '';
    if (m.sections) m.sections.forEach(([n, a]) => { if (x >= a) partie = n; });
    el.innerHTML = `<span>Lecture en cours</span> · <span>${nom}</span> · ${v.tempo} BPM · <span>${NOTES[v.note]}</span> <span>${v.modeNom || v.mode}</span>${partie ? ` · <span>${partie}</span>` : ''}${m.repli ? ' · <span>sons d\'orchestre indisponibles : version simple</span>' : ''}${orch}`;
  };
  maj(); return m.sections ? setInterval(maj, 500) : null;
}
let numeroMusique = 0;
// Renvoie une promesse : { sortie, duree (ms), style, sections } ; null si une autre lecture a été demandée entre-temps
async function lancerMusique(v, style) {
  style = style || styleMusique;
  if (style === 'simple') return Object.assign(programmerMusique(v), { style });
  if (!audio) { audio = new (window.AudioContext || window.webkitAudioContext)(); audio.analyseur = audio.createAnalyser(); audio.analyseur.connect(audio.destination); }
  try { const r = audio.resume && audio.resume(); if (r && r.catch) r.catch(() => { }); } catch (e) { }
  const numero = ++numeroMusique, hasard = hasardDe(v);
  const { sortie, bus } = preparerSortie(hasard, style === 'symphonie' ? 2.4 : 3.6, style === 'symphonie' ? 0.32 : 0.45);
  const o = { bus, hasard, annule: () => numero !== numeroMusique };
  try {
    const r = await (style === 'symphonie' ? composerSymphonie(v, o) : composerExperimentale(v, o));
    if (!r) { sortie.disconnect(); return null; }
    return { sortie, duree: (r.fin - audio.currentTime) * 1000, style, sections: r.sections, orchestre: r.orchestre };
  } catch (e) {
    // Sons introuvables (hors ligne…) : la version simple est jouée à la place
    sortie.disconnect(); if (numero !== numeroMusique) return null;
    return Object.assign(programmerMusique(v), { style: 'simple', repli: true });
  }
}
function annulerChargementMusique() { numeroMusique++; }
