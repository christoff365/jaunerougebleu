// MOTEUR DE TRADUCTION DU SITE (anglais, espagnol, arabe)
// Le dictionnaire (texte français exact → [anglais, espagnol, arabe]) est dans i18n-dico.js : ce gros fichier
// n'est chargé que si le visiteur choisit une autre langue que le français, pour alléger la page.
const TRAD = {};

// Remplacements dans les lignes de crédit des images (« Image : …, via …, domaine public »)
const TRAD_CREDITS = [
  ["Image :", ["Image:", "Imagen:", "الصورة:"]],
  ["notice Joconde", ["Joconde record", "ficha Joconde", "بطاقة جوكوند"]],
  ["fiche Europeana", ["Europeana record", "ficha de Europeana", "بطاقة يوروبيانا"]],
  ["photothèque du musée", ["museum photo library", "fototeca del museo", "مكتبة صور المتحف"]],
  [", image via ", [", image via ", ", imagen vía ", "، الصورة عبر "]],
  ["domaine public (Open Access)", ["public domain (Open Access)", "dominio público (Open Access)", "ملك عام (وصول مفتوح)"]],
  ["domaine public", ["public domain", "dominio público", "ملك عام"]],
  [" via ", [" via ", " vía ", " عبر "]],
  ["musée d’Orsay", ["Musée d’Orsay", "Museo de Orsay", "متحف أورسيه"]],
  ["musée d'Orsay", ["Musée d'Orsay", "Museo de Orsay", "متحف أورسيه"]],
  ["Musée d'Orsay", ["Musée d'Orsay", "Museo de Orsay", "متحف أورسيه"]],
  ["National Gallery, Londres", ["National Gallery, London", "National Gallery, Londres", "المعرض الوطني، لندن"]],
  ["palais Barberini", ["Palazzo Barberini", "Palacio Barberini", "قصر باربريني"]],
  ["La Haye", ["The Hague", "La Haya", "لاهاي"]],
  ["Fondation Hilma af Klint", ["Hilma af Klint Foundation", "Fundación Hilma af Klint", "مؤسسة هيلما أف كلينت"]],
  [", via", [", via", ", vía", "، عبر"]],
  [" ; photo : ", ["; photo: ", "; foto: ", "؛ تصوير: "]],
  ["licence CC", ["licence CC", "licencia CC", "ترخيص CC"]],
  ["Musée ethnologique de Berlin", ["Ethnological Museum, Berlin", "Museo Etnológico de Berlín", "المتحف الإثنولوجي في برلين"]],
  ["Musée du site de Jinsha", ["Jinsha Site Museum", "Museo del sitio de Jinsha", "متحف موقع جينشا"]],
  ["prêt de la Société royale des amis de l'art asiatique", ["on loan from the Royal Asian Art Society in the Netherlands", "préstamo de la Real Sociedad de Amigos del Arte Asiático", "إعارة من الجمعية الملكية لأصدقاء الفن الآسيوي"]],
  ["Galerie nationale de Finlande, musée Ateneum", ["Finnish National Gallery, Ateneum Art Museum", "Galería Nacional de Finlandia, Museo Ateneum", "المعرض الوطني الفنلندي، متحف أتينيوم"]],
  ["Galerie nationale slovaque", ["Slovak National Gallery", "Galería Nacional Eslovaca", "المعرض الوطني السلوفاكي"]],
  ["Musées de Lahti", ["Lahti Museums", "Museos de Lahti", "متاحف لاهتي"]],
  ["Musée de Kymenlaakso", ["Kymenlaakso Museum", "Museo de Kymenlaakso", "متحف كيمينلاكسو"]],
  ["Pays-Bas", ["Netherlands", "Países Bajos", "هولندا"]],
  ["Copenhague", ["Copenhagen", "Copenhague", "كوبنهاغن"]],
  ["libre de droits connus", ["no known rights restrictions", "sin restricciones de derechos conocidas", "بلا قيود حقوق معروفة"]],
  [" ; numérisation : ", ["; digitised by: ", "; digitalización: ", "؛ الرقمنة: "]],
  ["Bibliothèque nationale de Bulgarie", ["National Library of Bulgaria", "Biblioteca Nacional de Bulgaria", "المكتبة الوطنية البلغارية"]],
  ["Bibliothèque d'État de Bavière", ["Bavarian State Library", "Biblioteca Estatal de Baviera", "مكتبة ولاية بافاريا"]],
  ["Bibliothèque nationale de la Diète", ["National Diet Library", "Biblioteca Nacional de la Dieta", "مكتبة البرلمان الوطنية"]],
  ["Musée byzantin et chrétien d'Athènes", ["Byzantine and Christian Museum, Athens", "Museo Bizantino y Cristiano de Atenas", "المتحف البيزنطي والمسيحي في أثينا"]],
  ["Musée national d'art de Roumanie", ["National Museum of Art of Romania", "Museo Nacional de Arte de Rumanía", "المتحف الوطني للفنون في رومانيا"]],
  ["Musée Benaki", ["Benaki Museum", "Museo Benaki", "متحف بيناكي"]],
  ["Musée russe", ["Russian Museum", "Museo Ruso", "المتحف الروسي"]],
  ["Fondation Aikaterini Laskaridis", ["Aikaterini Laskaridis Foundation", "Fundación Aikaterini Laskaridis", "مؤسسة أيكاتريني لاسكاريدي"]],
  ["Galerie Tretiakov", ["Tretyakov Gallery", "Galería Tretiakov", "معرض تريتياكوف"]],
  ["Musée des collections impériales (Sannomaru Shōzōkan)", ["Museum of the Imperial Collections (Sannomaru Shōzōkan)", "Museo de las Colecciones Imperiales (Sannomaru Shōzōkan)", "متحف المجموعات الإمبراطورية (سانومارو شوزوكان)"]],
  ["Musée national de Tokyo", ["Tokyo National Museum", "Museo Nacional de Tokio", "متحف طوكيو الوطني"]],
  ["Wellcome Collection, Londres", ["Wellcome Collection, London", "Wellcome Collection, Londres", "مجموعة ويلكم، لندن"]],
  ["Musée national du palais, Taipei", ["National Palace Museum, Taipei", "Museo Nacional del Palacio, Taipéi", "متحف القصر الوطني، تايبيه"]],
  ["Badisches Landesmuseum, Karlsruhe", ["Badisches Landesmuseum, Karlsruhe", "Badisches Landesmuseum, Karlsruhe", "متحف ولاية بادن، كارلسروه"]],
  ["Musée national de Kyoto", ["Kyoto National Museum", "Museo Nacional de Kioto", "متحف كيوتو الوطني"]],
  ["Musée national de Nara", ["Nara National Museum", "Museo Nacional de Nara", "متحف نارا الوطني"]],
  ["Musée national de Kyushu", ["Kyushu National Museum", "Museo Nacional de Kyushu", "متحف كيوشو الوطني"]],
  ["licence KOGL type 1 (réutilisation libre avec mention de la source)", ["KOGL Type 1 licence (free reuse with attribution)", "licencia KOGL tipo 1 (reutilización libre citando la fuente)", "ترخيص KOGL من النوع 1 (إعادة استخدام حرة مع ذكر المصدر)"]],
  ["Musée national de Corée", ["National Museum of Korea", "Museo Nacional de Corea", "المتحف الوطني الكوري"]],
  ["Bibliothèque commémorative Mamma Haidara", ["Mamma Haidara Commemorative Library", "Biblioteca Conmemorativa Mamma Haidara", "مكتبة ماما حيدرة التذكارية"]],
  ["Bibliothèque nationale du Brésil", ["National Library of Brazil", "Biblioteca Nacional de Brasil", "المكتبة الوطنية البرازيلية"]],
  ["Bibliothèque nationale d'Afrique du Sud", ["National Library of South Africa", "Biblioteca Nacional de Sudáfrica", "المكتبة الوطنية لجنوب أفريقيا"]],
  ["Musée national de Varsovie", ["National Museum in Warsaw", "Museo Nacional de Varsovia", "المتحف الوطني في وارسو"]],
  ["Musée national, Onikan, Lagos", ["National Museum, Onikan, Lagos", "Museo Nacional, Onikan, Lagos", "المتحف الوطني، أونيكان، لاغوس"]]
];

// ---------------------------------------------------------------------------
// MOTEUR DE TRADUCTION
// Le site est écrit en français. Ce moteur remplace à l'affichage chaque texte connu par sa traduction,
// y compris les textes ajoutés plus tard par le code (minuteur, résultats du générateur, boutons…).
// ---------------------------------------------------------------------------
const LANGUES = { fr: 'fr-FR', en: 'en-GB', es: 'es-ES', ar: 'ar-SA' };
const RANG = { en: 0, es: 1, ar: 2 };
let langue = 'fr';
try { if (LANGUES[localStorage.getItem('jrb-langue')]) langue = localStorage.getItem('jrb-langue'); } catch (e) {}

// Dictionnaire des traductions (i18n-dico.js). Visiteur qui revient dans une autre langue : chargé tout de suite,
// avant les scripts suivants. Sinon : chargé au premier changement de langue, puis la page est traduite.
const SRC_DICO = document.currentScript && document.currentScript.src.replace('i18n.js', 'i18n-dico.js');
let dicoCharge = false;
if (langue !== 'fr' && SRC_DICO) { document.write('<script src="' + SRC_DICO + '"><\/script>'); dicoCharge = true; }
function chargerDico(suite) {
  if (dicoCharge || !SRC_DICO) { suite(); return; }
  const s = document.createElement('script'); s.src = SRC_DICO;
  s.onload = () => { dicoCharge = true; suite(); };
  s.onerror = suite;
  document.head.appendChild(s);
}

// Traduction d'un texte exact (sinon renvoie le texte tel quel)
function t(s) { return langue === 'fr' || !TRAD[s] ? s : TRAD[s][RANG[langue]]; }

// Dates et nombres : « vers 1830 », « 300 av. J.-C. », « 4 œuvres », « 10 min »
const DATES = [
  [/^vers /, ['c. ', 'h. ', 'حوالي ']],
  [/ av\. J\.-C\./g, [' BCE', ' a. C.', ' ق.م']],
  [/ apr\. J\.-C\./g, [' CE', ' d. C.', ' م']]
];
function traduireMorceau(m) {
  if (TRAD[m]) return TRAD[m][RANG[langue]];
  let r;
  if ((r = m.match(/^(\d+) œuvres?$/))) return r[1] + ' ' + t(+r[1] > 1 ? 'œuvres' : 'œuvre');
  if ((r = m.match(/^(\d+) œuvre\(s\)$/))) return r[1] + ' ' + t(+r[1] > 1 ? 'œuvres' : 'œuvre');
  if ((r = m.match(/^complétée en direct jusqu'à (\d+) pays$/))) return [['completed live up to ' + r[1] + ' countries'], ['completada en directo hasta ' + r[1] + ' países'], ['مُستكملة مباشرةً حتى ' + r[1] + ' بلدًا']][RANG[langue]][0];
  if ((r = m.match(/^(\d+) pays$/))) return r[1] + ' ' + [['country', 'countries'], ['país', 'países'], ['بلد', 'بلدان']][RANG[langue]][+r[1] > 1 ? 1 : 0];
  if ((r = m.match(/^(\d+) continents?$/))) return r[1] + ' ' + [['continent', 'continents'], ['continente', 'continentes'], ['قارة', 'قارات']][RANG[langue]][+r[1] > 1 ? 1 : 0];
  if ((r = m.match(/^(\d+) min$/))) return langue === 'ar' ? r[1] + ' دقيقة' : r[1] + ' min';
  if (/\d/.test(m) && /vers |J\.-C\./.test(m)) { let s = m; DATES.forEach(([re, tr]) => { s = s.replace(re, tr[RANG[langue]]); }); return s; }
  return null;
}
// Textes composés de morceaux séparés par « — », « · », « & » ou « , » (titres d'exposition, légendes…)
// Une phrase (texte non traduit dont un morceau dépasse dix mots) n'est pas découpée : sinon un mot isolé
// comme « et », entre deux virgules, serait traduit seul au milieu du français (« Gao, sur le Niger, و, au-delà »)
function traduireCompose(s) {
  const parts = s.split(/( — | · | & |, )/);
  if (parts.length < 3) { const m = traduireMorceau(s); return m === null ? null : m; }
  for (let i = 0; i < parts.length; i += 2) if (parts[i].split(' ').length > 10 && !TRAD[parts[i]]) return null;
  const out = []; let trouve = false;
  for (let i = 0; i < parts.length; i += 2) {
    let fait = false;
    for (let j = parts.length - 1; j >= i; j -= 2) { // on essaie d'abord le plus long assemblage connu
      const cand = parts.slice(i, j + 1).join('');
      if (cand === 'et') continue; // jamais seul : c'est un morceau de phrase, pas un libellé
      const tr = TRAD[cand] ? TRAD[cand][RANG[langue]] : (j === i ? traduireMorceau(cand) : null);
      if (tr !== null && tr !== undefined) { out.push(tr); trouve = true; if (j + 1 < parts.length) out.push(parts[j + 1]); i = j; fait = true; break; }
    }
    if (!fait) { out.push(parts[i]); if (i + 1 < parts.length) out.push(parts[i + 1]); }
  }
  return trouve ? out.join('') : null;
}
function versLangue(fr) {
  const cle = fr.trim(); if (!cle) return fr;
  if (langue === 'fr') return fr;
  const tr = TRAD[cle] ? TRAD[cle][RANG[langue]] : traduireCompose(cle);
  return tr === null ? fr : fr.replace(cle, tr);
}
function estConnu(s) { const k = s.trim(); return !!k && (!!TRAD[k] || (langue !== 'fr' && traduireCompose(k) !== null) || /^\d+ œuvre/.test(k)); }
function traduireCredit(s) {
  if (langue === 'fr') return s;
  let r = s; TRAD_CREDITS.forEach(([fr, tr]) => { r = r.split(fr).join(tr[RANG[langue]]); }); return r;
}

const ATTRIBUTS = ['alt', 'aria-label', 'placeholder'];
function traduireNoeud(n) {
  const v = n.nodeValue, dansCredit = n.parentElement && n.parentElement.closest('.img-credit,.big-art-credit');
  // Si le code a remplacé le texte depuis notre dernier passage, on repart de ce nouveau texte français
  if (n.__tr === undefined || v !== n.__tr) n.__fr = (dansCredit || TRAD[v.trim()] || estConnu(v)) ? v : null;
  if (!n.__fr) return;
  const cible = dansCredit ? traduireCredit(n.__fr) : versLangue(n.__fr);
  n.__tr = cible; if (v !== cible) n.nodeValue = cible;
}
function traduireAttributs(el) {
  el.__frA = el.__frA || {}; el.__trA = el.__trA || {};
  ATTRIBUTS.forEach(a => {
    if (!el.hasAttribute(a)) return;
    const v = el.getAttribute(a);
    if (el.__trA[a] === undefined || v !== el.__trA[a]) el.__frA[a] = v;
    const cible = versLangue(el.__frA[a]); el.__trA[a] = cible;
    if (v !== cible) el.setAttribute(a, cible);
  });
}
let enCours = false;
function traduirePage() {
  if (enCours) return; enCours = true;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => { const p = n.parentElement; return !p || p.closest('script,style') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } });
  let n; while ((n = w.nextNode())) traduireNoeud(n);
  document.querySelectorAll('[alt],[aria-label],[placeholder]').forEach(traduireAttributs);
  document.documentElement.lang = langue;
  document.body.dir = langue === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('.langs button').forEach(b => { b.classList.toggle('on', b.dataset.lang === langue); b.setAttribute('aria-pressed', b.dataset.lang === langue); });
  enCours = false;
}
// Traductions des commentaires des expositions spéciales (i18n-expositions.js, gros fichier) : chargées seulement
// quand le visiteur choisit une autre langue que le français, puis la page est traduite à nouveau
const SRC_TRAD_EXPOS = document.currentScript && document.currentScript.src.replace('i18n.js', 'i18n-expositions.js');
let tradExposDemandee = false;
function chargerTraductionsExpos() {
  if (tradExposDemandee || langue === 'fr' || !SRC_TRAD_EXPOS || !document.getElementById('pg-sp')) return;
  tradExposDemandee = true;
  const s = document.createElement('script'); s.src = SRC_TRAD_EXPOS;
  s.onload = () => traduirePage();
  s.onerror = () => { tradExposDemandee = false; };
  document.head.appendChild(s);
}
function changerLangue(l) {
  if (!LANGUES[l]) return;
  langue = l;
  try { localStorage.setItem('jrb-langue', l); } catch (e) {}
  const suite = () => { chargerTraductionsExpos(); traduirePage(); if (typeof apresChangementLangue === 'function') apresChangementLangue(); };
  if (l === 'fr') suite(); else chargerDico(suite);
}
// Tout texte ajouté ou modifié par le code est traduit au passage suivant
let attenteTrad = false;
new MutationObserver(() => {
  if (enCours || attenteTrad) return;
  attenteTrad = true;
  setTimeout(() => { attenteTrad = false; traduirePage(); }, 15); // court délai : fonctionne aussi dans un onglet en arrière-plan
}).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRIBUTS });
chargerTraductionsExpos();
