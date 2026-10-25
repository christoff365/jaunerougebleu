// MUSÉES EN DIRECT
// Le générateur d'exposition interroge ici, sans intervention humaine, les catalogues ouverts de musées du monde entier.
// Seules les œuvres du domaine public avec image sont retenues. Chaque œuvre est créditée avec un lien vers sa fiche au musée.
//
// Sources actives sans clé : 114 institutions du monde entier et le patrimoine mondial de l'UNESCO (via Wikidata et
// Wikimedia Commons, liste MUSEES_MONDE ci-dessous), Met (New York), Art Institute of Chicago, Cleveland Museum of Art,
// SMK (Copenhague), Minneapolis Institute of Art. Sources interrogées par le relais de l'association (dossier relais/),
// qui garde les clés hors du site : Europeana (milliers d'institutions européennes) et Smithsonian (Washington).
// Adresse du relais (sans « / » final) ; vide = ces deux sources sont ignorées.
const RELAIS = 'https://jaunerougebleu.loic-a-messian.workers.dev';

const DATES_EPOQUES = {
  'Antiquité': [-3500, 499], 'Moyen Âge': [500, 1399], 'Renaissance': [1400, 1599],
  'XVIIe–XVIIIe s.': [1600, 1799], 'XIXe siècle': [1800, 1899], 'Modernisme': [1900, 1969], 'Art contemporain': [1970, 2100]
};
const MOTS_THEMES = {
  'Portraits': 'portrait', 'Paysages': 'landscape', 'Abstraction': 'abstract', 'Spiritualité': 'religious',
  'Vie quotidienne': 'genre scene', 'Mythologie': 'mythology', 'Nature morte': 'still life', 'Lumière & couleur': 'light'
};
const MOTS_TYPES = {
  'Peinture': 'painting', 'Sculpture': 'sculpture', 'Architecture': 'architecture',
  'Dessins et estampes': 'print', 'Arts décoratifs': 'ceramic', 'Photographie': 'photograph',
  'Manuscrits et livres enluminés': 'illuminated manuscript', 'Icônes': 'icon'
};
// Reconnaissance de la région à partir du lieu ou de la culture indiqués par le musée
const MOTS_REGIONS = {
  'Europe': /\b(europe|european|france|french|italy|italian|ital|rome|roman|greece|greek|germany|german|netherland|dutch|flanders|flemish|belgi|england|english|britain|british|scotland|ireland|spain|spanish|portugal|austria|switzerland|denmark|danish|sweden|norway|finland|poland|russia|bohemia|hungary|byzantin|venice|paris|london|etruscan|celtic|europ)/i,
  "Asie de l'Est": /\b(china|chinese|japan|japanese|korea|korean|mongol|tibet|taiwan|edo|ming|qing|tang|song dynasty|joseon)/i,
  'Asie du Sud et du Sud-Est': /\b(india|indian|pakistan|nepal|sri lanka|bangladesh|cambodia|khmer|thailand|thai|vietnam|indonesia|java|burma|myanmar|laos|gandhara|mughal|kashmir)/i,
  'Moyen-Orient': /\b(iran|persia|persian|iraq|mesopotamia|assyria|babylon|syria|lebanon|levant|turkey|turkish|ottoman|anatolia|arabia|yemen|israel|palestin|jordan|islamic|sasanian|safavid|isfahan)/i,
  'Afrique': /\b(africa|african|egypt|egyptian|nigeria|benin|yoruba|mali|ghana|asante|congo|kongo|cameroon|ethiopia|kenya|sudan|nubia|morocco|tunisia|algeria|ivory coast|côte d'ivoire|baule|dogon|senegal|gabon|angola|zimbabwe|tanzania|madagascar)/i,
  'Amériques': /\b(united states|america|american|canada|mexico|mexican|maya|aztec|olmec|inca|peru|peruvian|guatemala|costa rica|panama|colombia|ecuador|bolivia|chile|argentina|brazil|caribbean|haiti|cuba|native american|navajo|tlingit|moche|nazca)/i,
  'Océanie': /\b(oceania|australia|aboriginal|new zealand|maori|papua|new guinea|polynesia|tahiti|hawai|samoa|fiji|tonga|melanesia|micronesia|vanuatu|solomon)/i
};
// Reconnaissance du type d'œuvre à partir de la classification du musée
const MOTS_TYPES_RECONNUS = [
  // Manuscrits et icônes d'abord : sinon ils seraient rangés dans « Dessins et estampes » ou « Peinture ».
  // Manuscrits : seulement les livres copiés et enluminés à la main (évangiles, psautiers, livres d'heures, Corans…),
  // pas les lettres ni les documents écrits à la main (voir PAS_UN_MANUSCRIT)
  ['Manuscrits et livres enluminés', /illuminat|enlumin|book of hours|livre d.heures|psalter|psautier|gospel|[ée]vang[ée]li(?!st)|bible|antiphon|gradual|graduel|missal|missel|breviar|bréviaire|lectionar|qur.?an|koran|coran|shahnam|codex|(leaf|folio|page) from (a|an|the)\b|manuscript (leaf|page|cutting|illumination)|miniature from/i],
  ['Icônes', /\bicons?\b|icône|iconostas|ikon/i],
  ['Architecture', /architect|building|column|capital|portal|doorway|facade|façade|period room|room from|ceiling|mihrab|temple|cathedral|church|chapel|basilica|abbey|monastery|cloister|castle|palace|relief from|fragment of a (wall|building)/i],
  ['Sculpture', /sculpt|statue|statuette|figure|figurine|bust|relief|carving|head of|torso|bronze|mask|stele/i],
  ['Photographie', /photograph|daguerreotype|albumen|gelatin silver/i],
  // Pastel : une peinture (les pastels de Degas sont parmi ses chefs-d'œuvre), même si les musées les rangent avec les dessins
  ['Peinture', /\bpastels?\b/i],
  ['Dessins et estampes', /print|drawing|watercolor|etching|engraving|woodcut|lithograph|kobberstik|tegning|grafik|book|manuscript|album leaf|folio/i],
  ['Arts décoratifs', /ceramic|porcelain|pottery|vessel|vase|bowl|jar|plate|cup|mirror|jade|textile|embroidery|tapestry|furniture|fitting|glass|metalwork|silver|jewel|costume|armor|arms|tsuba|coin|medal|lacquer|enamel/i],
  ['Peinture', /paint|canvas|oil|tempera|fresco|maleri|icon|panel|scroll|calligraph|emakimono|triptych/i]
];
// Titres évoquant une scène violente : image floutée jusqu'au clic (filtre imparfait, fondé sur le titre)
// (pas les nus : les musées les montrent sans précaution ; mots entiers seulement, « nu » floutait aussi « La Nuit étoilée »)
const MOTS_SENSIBLES = /\b(beheading|decapitat\w*|décapit\w*|executions?|massacres?|crucifixion|martyrdom|martyre|torture|corpses?|cadavres?|slaughter|murders?|meurtre|rape|suicide|severed)\b/i;

function anneeDe(texte) {
  if (typeof texte === 'number') return texte;
  const s = String(texte || '');
  const avant = /b\.?c\.?e?\b|av\. j/i.test(s);
  const m = s.match(/(-?\d{3,4})/);
  if (m) { const a = parseInt(m[1], 10); return avant && a > 0 ? -a : a; }
  // « 12th century », « XIIe siècle » : milieu du siècle
  const siecle = s.match(/(\d{1,2})(st|nd|rd|th|e)\b/i);
  if (siecle) { const a = (parseInt(siecle[1], 10) - 1) * 100 + 50; return avant ? -a : a; }
  return null;
}
function regionsDe(texte) {
  return Object.keys(MOTS_REGIONS).filter(r => MOTS_REGIONS[r].test(texte || ''));
}
// Lettres, correspondance, actes, reçus… : écrits à la main, mais pas des livres enluminés
const PAS_UN_MANUSCRIT = /\bletters?\b|lettre|correspondence|correspondance|autograph|deed|charter|receipt|reçu|certificate|diploma|document|petition|journal|diary|ledger|account book|notebook|manuscript (letter|note)/i;
// Type d'une œuvre d'après la classification du musée (et son titre, pour écarter les lettres des manuscrits)
function typeDe(texte, titre) {
  const tout = (texte || '') + ' ' + (titre || '');
  const t = MOTS_TYPES_RECONNUS.find(([type, re]) => type === 'Manuscrits et livres enluminés' ? re.test(tout) && !PAS_UN_MANUSCRIT.test(tout) : re.test(texte || ''));
  return t ? t[0] : 'Autre';
}
function epoqueDe(annee) {
  if (annee === null || annee === undefined) return null;
  return Object.keys(DATES_EPOQUES).find(e => annee >= DATES_EPOQUES[e][0] && annee <= DATES_EPOQUES[e][1]) || null;
}
function lireJSON(url, delai, options) {
  const ctrl = new AbortController();
  const minuteur = setTimeout(() => ctrl.abort(), delai || 9000);
  return fetch(url, Object.assign({ signal: ctrl.signal }, options)).then(r => { clearTimeout(minuteur); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
}
function hasard(n) { return Math.floor(Math.random() * n); }
function melange(l) { return l.slice().sort(() => Math.random() - 0.5); }
// Choix « Les plus célèbres » (par défaut) ou « Découvertes (moins connues) » du générateur
const celebres = c => c.notoriete !== 'decouvertes';
// Titres d'esquisses et d'études (anglais, français, danois, néerlandais, allemand ; comparés sans accents)
// et de dessins préparatoires (« Design for a Poster », « Projet pour un vase », « Entwurf »)
const ESQUISSE = /\b(study|studies|sketch|sketches|esquisse|esquisses|etude|etudes|croquis|skitse|studie|schets|skizze|entwurf|ontwerp|design for|designs for|projet pour|projet de)\b/;

// Mot ajouté à la recherche pour chaque région (les catalogues cherchent aussi dans la culture et le lieu d'origine)
// (un mot tiré au hasard à chaque recherche, pour varier les cultures représentées)
const MOTS_RECHERCHE_REGIONS = {
  'Europe': ['European', 'French', 'Italian', 'Dutch', 'German', 'Spanish'],
  "Asie de l'Est": ['Chinese', 'Japanese', 'Korean'],
  'Asie du Sud et du Sud-Est': ['Indian', 'Cambodian', 'Thai', 'Indonesian', 'Nepalese'],
  'Moyen-Orient': ['Islamic', 'Persian', 'Ottoman', 'Mesopotamian'],
  'Afrique': ['African', 'Egyptian', 'Yoruba', 'Kongo', 'Ethiopian'],
  'Amériques': ['Mexican', 'Peruvian', 'Maya', 'Native American', 'American'],
  'Océanie': ['Oceania', 'Papua', 'Maori', 'Polynesian']
};
function auHasard(liste) { return liste[hasard(liste.length)]; }
// Mots-clés de recherche à partir des choix du visiteur (criteres.region : la région traitée par cette recherche)
function motsCles(criteres) {
  const mots = [];
  if (criteres.mots) mots.push(criteres.mots); // mots-clés libres (recherche automatique des expositions spéciales)
  // Artiste et mouvement (générateur) : leur nom suffit, sans mot de région qui restreindrait trop la recherche
  if (criteres.artiste) mots.push(criteres.artiste);
  const mv = criteres.mouvement && mouvement(criteres.mouvement);
  if (mv) mots.push(criteres.motMouvement || mv.mots[0]);
  // Mot de la région : imposé (motRegion) ou tiré au hasard
  if (criteres.region && !criteres.artiste && !mv) mots.push(criteres.motRegion || auHasard(MOTS_RECHERCHE_REGIONS[criteres.region]));
  criteres.th.forEach(t => mots.push(MOTS_THEMES[t]));
  criteres.ty.forEach(t => mots.push(MOTS_TYPES[t]));
  return mots.filter(Boolean);
}

// Musées d'art du Smithsonian : code, nom affiché dans le crédit, région supposée quand la fiche n'indique aucun lieu
const MUSEES_SMITHSONIAN = {
  HMSG: ['Hirshhorn Museum and Sculpture Garden', 'American'],
  SAAM: ['Smithsonian American Art Museum', 'American'],
  NPG: ['National Portrait Gallery', 'American'],
  FSG: ["National Museum of Asian Art", ''],
  CHNDM: ['Cooper Hewitt, Smithsonian Design Museum', ''],
  NMAfA: ['National Museum of African Art', 'Africa'],
  NMAI: ['National Museum of the American Indian', 'Native American']
};

// Demande une page de résultats à une position tirée au hasard (pour varier les œuvres) ; si la recherche a moins de
// résultats que cette position, on redemande à une position qui existe, au lieu de revenir les mains vides
function pageAuHasard(url, max, liste, total) {
  return lireJSON(url(hasard(max))).then(r => {
    const l = liste(r) || [], t = total(r) || 0;
    return l.length || !t ? l : lireJSON(url(hasard(Math.min(t, max)))).then(r2 => liste(r2) || []);
  });
}

// ---------- Adaptateurs : chaque musée renvoie des œuvres au même format ----------
function oeuvre(o) {
  const annee = o.annee;
  const texteLieu = [o.lieu, o.culture].filter(Boolean).join(' ');
  return {
    title: o.titre, artist: o.artiste || '', date: o.date || (annee !== null ? String(annee) : ''), year: annee,
    place: o.lieu || o.culture || '', museum: o.musee, image: o.image,
    credit: o.credit || o.musee + ' (' + o.fiche + '), domaine public',
    // Région : d'abord le lieu et la culture ; le département du musée seulement en dernier recours
    regions: o.regions || (regionsDe(texteLieu).length ? regionsDe(texteLieu) : regionsDe(o.indiceRegion || '')), epoch: epoqueDe(annee), themes: [],
    types: [o.type || typeDe(o.classification, o.titre)], langue: o.langue || 'en', direct: true, pastille: o.pastille,
    sensible: MOTS_SENSIBLES.test(o.titre || ''),
    // Notoriété (nombre de Wikipédia qui ont un article sur l'œuvre, fiches Wikidata seulement) et identifiant Wikidata
    renom: o.renom || 0, qid: o.qid || null,
    // Indices du pays d'origine (lieu, culture, nationalité de l'artiste), pour la règle des pays des expositions spéciales
    // (séparés par « | » : le lieu est examiné en premier, puis la culture, puis la nationalité)
    origine: [o.lieu, o.culture, o.nationalite].filter(Boolean).join(' | ')
  };
}

// ---------- Institutions du monde entier, via Wikidata et Wikimedia Commons ----------
// Wikidata est la base de connaissances libre de la fondation Wikimédia : musées et bénévoles y décrivent les collections
// du monde entier. Les images viennent de Wikimedia Commons, qui n'accepte que des fichiers libres ; chaque image est créditée
// (auteur de la photo, licence, lien vers la page du fichier).
// Pays de chaque région (identifiants Wikidata), États historiques compris, pour reconnaître l'origine d'une œuvre
const PAYS_REGIONS = {
  "Asie de l'Est": 'Q148 Q17 Q884 Q423 Q865 Q711 Q8646 Q14773 Q8733 Q9903 Q28179 Q188712',
  'Asie du Sud et du Sud-Est': 'Q668 Q843 Q902 Q854 Q837 Q869 Q881 Q424 Q252 Q928 Q833 Q334 Q836 Q819 Q33296',
  'Moyen-Orient': 'Q794 Q796 Q43 Q858 Q822 Q801 Q810 Q851 Q878 Q846 Q817 Q219060 Q805 Q842 Q398 Q12560 Q5684',
  'Afrique': 'Q79 Q1033 Q114 Q1028 Q115 Q258 Q117 Q262 Q948 Q1009 Q954 Q916 Q974 Q963 Q1019 Q1030 Q1005 Q971 Q953 Q1008 Q1032 Q1011 Q1029 Q1037 Q1036 Q1041 Q1049 Q912 Q962 Q965 Q924 Q1016 Q11768',
  'Amériques': 'Q96 Q241 Q774 Q16 Q155 Q414 Q419 Q739 Q298 Q717 Q736 Q750 Q77 Q733 Q790 Q781 Q766 Q786 Q800 Q792 Q783 Q811 Q804 Q30',
  'Océanie': 'Q408 Q664 Q691 Q712 Q33788 Q30971',
  'Europe': 'Q142 Q38 Q183 Q145 Q55 Q31 Q29 Q45 Q40 Q39 Q34 Q20 Q35 Q33 Q36 Q159 Q41 Q213 Q28 Q27 Q161885 Q170072 Q34266 Q70972 Q12548 Q28513 Q172579 Q43287 Q174193 Q179876 Q11772 Q1747689 Q2277 Q12544 Q42585 Q153529 Q215530'
};
const REGION_DU_PAYS = {};
Object.keys(PAYS_REGIONS).forEach(r => PAYS_REGIONS[r].split(' ').forEach(q => { REGION_DU_PAYS[q] = r; }));
// Musées, par région : [identifiant Wikidata, nombre approximatif d'œuvres illustrées, collection locale ?, nom affiché]
// (cette liste alimente aussi la page « Musées » du site)
// (collection locale = 0 : collection venue du monde entier, la région de l'œuvre n'est alors déduite que de son origine)
const MUSEES_MONDE = {
  "Asie de l'Est": [
    ['Q653433', 305, 1, 'Musée national de Tokyo'],
    ['Q147286', 51, 1, 'Musée national de Kyoto'],
    ['Q147312', 20, 1, 'Musée national de Nara'],
    ['Q540668', 1337, 1, 'Musée national du Palais, Taipei'],
    ['Q2047427', 11016, 1, 'Musée du Palais (Cité interdite), Pékin'],
    ['Q1074318', 252, 1, 'Musée national de Chine, Pékin'],
    ['Q1051293', 697, 1, 'Musée de Shanghai'],
    ['Q494407', 40, 1, 'Musée national de Corée, Séoul'],
    ['Q390124', 10, 1, 'Musée national de Gyeongju'],
    ['Q487498', 14, 1, 'Leeum, Séoul'],
    ['Q1359908', 41, 1, 'Musée national d\'art moderne de Tokyo'],
    ['Q1233913', 62, 0, 'Musée Fuji de Tokyo'],
    ['Q843638', 11, 1, 'Musée MOA, Atami'],
    ['Q1075126', 267, 1, 'Freer Gallery of Art, Washington (arts d\'Asie)'],
    ['Q860994', 369, 1, 'Musée Guimet, Paris (arts d\'Asie)']
  ],
  'Asie du Sud et du Sud-Est': [
    ['Q1356138', 202, 1, 'Musée national, New Delhi'],
    ['Q1071500', 16, 1, 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya, Mumbai'],
    ['Q1364900', 150, 1, 'Indian Museum, Calcutta'],
    ['Q1864572', 99, 0, 'Musée Salar Jung, Hyderabad'],
    ['Q1356352', 40, 0, 'Victoria Memorial, Calcutta'],
    ['Q1467125', 195, 1, 'Musée national d\'Indonésie, Jakarta'],
    ['Q1255815', 12, 1, 'Musée national de Bangkok'],
    ['Q3654706', 11, 1, 'Musée national des beaux-arts du Vietnam, Hanoï'],
    ['Q860994', 369, 0, 'Musée Guimet, Paris']
  ],
  'Moyen-Orient': [
    ['Q46815', 233, 0, 'Musée d\'Israël, Jérusalem'],
    ['Q1267958', 83, 0, 'Musée d\'art de Tel Aviv'],
    ['Q3395851', 45, 1, 'Musée Sakıp Sabancı, Istanbul'],
    ['Q1662392', 66, 0, 'Musée Pera, Istanbul'],
    ['Q636978', 16, 1, 'Musées archéologiques d\'Istanbul'],
    ['Q170495', 9, 1, 'Palais de Topkapı, Istanbul'],
    ['Q287360', 124, 1, 'Musée Sursock, Beyrouth'],
    ['Q617254', 106, 1, 'Musée national de Damas'],
    ['Q521251', 10, 1, 'Musée national d\'Irak, Bagdad'],
    ['Q210610', 85, 1, 'Palais du Golestan, Téhéran'],
    ['Q1148353', 20, 1, 'Musée d\'art islamique, Doha'],
    ['Q3044751', 1327, 1, 'Musée du Louvre, Paris (antiquités orientales)'],
    ['Q3044748', 534, 1, 'Musée du Louvre, Paris (arts de l\'Islam)'],
    ['Q3176133', 21, 0, 'Louvre Abou Dabi'],
    ['Q391976', 257, 0, 'Chester Beatty, Dublin (arts de l\'Islam et d\'Asie)'],
    ['Q4690937', 27, 1, 'Musée Aga Khan, Toronto (arts de l\'Islam)']
  ],
  'Afrique': [
    ['Q201219', 86, 1, 'Musée égyptien du Caire'],
    ['Q2583681', 8, 1, 'Grand Musée égyptien, Gizeh'],
    ['Q1878362', 36, 1, 'Musée de Louxor'],
    ['Q2354677', 36, 1, 'Musée de Nubie, Assouan'],
    ['Q3044749', 1183, 1, 'Musée du Louvre, Paris (antiquités égyptiennes)'],
    ['Q2912600', 31, 0, 'Musée national des beaux-arts d\'Alger'],
    ['Q4115728', 17, 0, 'Musée Mahmoud Khalil, Le Caire'],
    ['Q1419469', 18, 1, 'Galerie nationale d\'Afrique du Sud, Le Cap'],
    ['Q6217142', 11, 1, 'Galerie d\'art de Johannesburg'],
    ['Q167863', 167, 0, 'Musée du quai Branly, Paris']
  ],
  'Amériques': [
    ['Q1138147', 171, 1, 'Museo Nacional de Arte, Mexico'],
    ['Q524249', 16, 1, 'Musée national d\'anthropologie, Mexico'],
    ['Q2097646', 198, 0, 'Museo Soumaya, Mexico'],
    ['Q1779837', 211, 1, 'Musée national des beaux-arts, La Havane'],
    ['Q3137182', 132, 0, 'Museo de Arte de Ponce, Porto Rico'],
    ['Q82941', 284, 0, 'Musée d\'art de São Paulo'],
    ['Q2095209', 643, 1, 'Pinacothèque de São Paulo'],
    ['Q1954370', 305, 1, 'Musée national des beaux-arts, Rio de Janeiro'],
    ['Q371803', 26, 1, 'Musée Paulista, São Paulo'],
    ['Q6033913', 51, 1, 'Musée d\'art de Lima'],
    ['Q1568821', 20, 1, 'Musée national d\'archéologie, d\'anthropologie et d\'histoire du Pérou, Lima'],
    ['Q775376', 38, 1, 'Musée national des beaux-arts, Santiago du Chili'],
    ['Q1068063', 434, 0, 'Musée des beaux-arts du Canada, Ottawa'],
    ['Q860812', 191, 0, 'Musée des beaux-arts de Montréal'],
    ['Q649250', 37, 0, 'Musée royal de l\'Ontario, Toronto'],
    ['Q2568412', 22, 1, 'Museo de América, Madrid']
  ],
  'Océanie': [
    ['Q1464509', 333, 0, 'National Gallery of Victoria, Melbourne'],
    ['Q705551', 285, 0, 'Art Gallery of New South Wales, Sydney'],
    ['Q795228', 104, 0, 'Galerie nationale d\'Australie, Canberra'],
    ['Q705557', 224, 0, 'Art Gallery of South Australia, Adélaïde'],
    ['Q7270900', 16, 0, 'Queensland Art Gallery, Brisbane'],
    ['Q915603', 162, 1, 'Te Papa Tongarewa, Wellington'],
    ['Q4819492', 489, 0, 'Auckland Art Gallery'],
    ['Q758657', 117, 1, 'Musée du mémorial de guerre d\'Auckland'],
    ['Q7424149', 347, 0, 'Sarjeant Gallery, Whanganui'],
    ['Q61797555', 143, 0, 'The Suter, Nelson'],
    ['Q5109058', 11, 0, 'Christchurch Art Gallery']
  ],
  'Europe': [
    ['Q190804', 6286, 1, 'Rijksmuseum, Amsterdam'],
    ['Q180788', 4090, 1, 'National Gallery, Londres'],
    ['Q6373', 885, 0, 'British Museum, Londres'],
    ['Q640447', 2014, 1, 'Musée Carnavalet, Paris (Paris Musées)'],
    ['Q820892', 8, 1, 'Petit Palais, Paris (Paris Musées)'],
    ['Q23402', 2194, 1, 'Musée d\'Orsay, Paris'],
    ['Q160112', 4066, 1, 'Musée du Prado, Madrid'],
    ['Q51252', 836, 1, 'Galerie des Offices, Florence'],
    ['Q95569', 3592, 1, 'Kunsthistorisches Museum, Vienne'],
    ['Q842858', 14008, 1, 'Nationalmuseum, Stockholm'],
    ['Q132783', 3797, 0, 'Musée de l\'Ermitage, Saint-Pétersbourg'],
    ['Q816669', 73, 1, 'Musée Benaki, Athènes'],
    ['Q668300', 1081, 0, 'Musée Rietberg, Zurich (arts du monde)'],
    ['Q731126', 810, 0, 'J. Paul Getty Museum, Los Angeles'],
    ['Q6352575', 32668, 1, 'Yale Center for British Art, New Haven'],
    ['Q1568434', 29011, 0, 'Yale University Art Gallery, New Haven'],
    ['Q210081', 661, 0, 'Walters Art Museum, Baltimore'],
    // France : départements du Louvre (Wikidata range les œuvres du Louvre par département) et musées de région
    ['Q3044768', 4802, 1, 'Musée du Louvre, Paris (peintures)'],
    ['Q3044772', 826, 1, 'Musée du Louvre, Paris (sculptures)'],
    ['Q3044747', 1264, 1, 'Musée du Louvre, Paris (antiquités grecques, étrusques et romaines)'],
    ['Q3044767', 722, 1, 'Musée du Louvre, Paris (objets d\'art)'],
    ['Q3044753', 286, 1, 'Musée du Louvre, Paris (arts graphiques)'],
    ['Q2946', 719, 1, 'Château de Versailles'],
    ['Q3329787', 932, 1, 'Musée de l\'Histoire de France, Versailles'],
    ['Q1236032', 718, 1, 'Musée Condé, Chantilly'],
    ['Q1376', 1291, 1, 'Musée Saint-Raymond, Toulouse (archéologie)'],
    ['Q2711480', 868, 1, 'Musée des Augustins, Toulouse'],
    ['Q2628596', 567, 1, 'Palais des Beaux-Arts de Lille'],
    ['Q3330225', 420, 1, 'Musée des Beaux-Arts de Reims'],
    ['Q3329260', 275, 1, 'Musée Magnin, Dijon'],
    ['Q1955739', 235, 1, 'Musée des Beaux-Arts de Dijon'],
    ['Q954222', 269, 1, 'Musée des Beaux-Arts de Bordeaux'],
    ['Q1535963', 264, 1, 'Musée des Beaux-Arts de Strasbourg'],
    ['Q845468', 195, 1, 'Musée d\'Art moderne et contemporain de Strasbourg'],
    ['Q1324926', 261, 1, 'Musée des Beaux-Arts et d\'Archéologie de Besançon'],
    ['Q1952944', 213, 1, 'Musée de Grenoble'],
    ['Q3086934', 190, 1, 'Musée des Beaux-Arts de Rouen'],
    ['Q3329624', 163, 1, 'Musée d\'Art et d\'Histoire de Saint-Brieuc']
  ]
};
// Classes Wikidata correspondant aux types d'œuvres du générateur
const CLASSES_TYPES = {
  'Peinture': 'Q3305213 Q22669850 Q12681 Q15727816 Q99516640 Q1190781 Q79218',
  'Sculpture': 'Q860861 Q179700 Q29527347 Q1066288 Q928357 Q245117 Q14562306 Q178743 Q161524 Q241045',
  'Dessins et estampes': 'Q11060274 Q75837457 Q18219090 Q93184 Q18887969 Q11835431 Q15123870 Q18218093 Q28913685 Q18761202 Q48498 Q8362',
  'Arts décoratifs': 'Q161439 Q28823 Q96952903 Q98276829 Q191851 Q60733799 Q17379525 Q153988 Q28966302 Q45621 Q1207302 Q1758043 Q57216 Q35197 Q368972 Q4390114 Q11631761',
  'Photographie': 'Q125191',
  'Manuscrits et livres enluminés': 'Q48498', // manuscrit enluminé (la classe « manuscrit » comprend aussi les lettres)
  'Icônes': 'Q132137'
};
// Monuments (et non sites naturels) : temples, mosquées, églises, palais, forts, tombeaux, sites archéologiques, centres historiques…
const CLASSES_ARCHITECTURE = 'Q44539 Q842402 Q5393308 Q199451 Q180987 Q12516 Q381885 Q162875 Q32815 Q16970 Q2977 Q56242215 Q120560 Q2031836 Q108325 Q44613 Q160742 ' +
  'Q16560 Q751876 Q23413 Q1785071 Q12518 Q41176 Q1497375 Q18247357 Q4989906 Q839954 Q15661340 Q109607 Q1081138 Q676050 Q15243209';
// Genres Wikidata correspondant aux thèmes
const GENRES_THEMES = {
  'Portraits': 'Q134307', 'Paysages': 'Q191163', 'Nature morte': 'Q170571', 'Spiritualité': 'Q2864737',
  'Vie quotidienne': 'Q1047337', 'Mythologie': 'Q3374376', 'Abstraction': 'Q128115'
};
// ---------- Mouvements, écoles et styles du monde (générateur et onglet « Mouvements ») ----------
// Les catalogues des musées décrivent rarement le mouvement d'une œuvre : la recherche se fait par mots-clés (en anglais,
// langue des catalogues : « mots ») et, dans Wikidata, par les mouvements (P135) et genres (P136) dont le libellé anglais est
// dans « wd ». « local » reconnaît les œuvres de collection.json (artiste ou titre). Artistes : exemples, morts depuis plus de 70 ans.
// [nom, région, lieu, époque, mots, wd, local, artistes, description]
const MOUVEMENTS = [
  ['Ukiyo-e', "Asie de l'Est", 'Japon', 'XVIIe–XIXe siècle', ['ukiyo-e'], ['ukiyo-e'], 'hokusai|hiroshige|utamaro', ['Katsushika Hokusai', 'Utagawa Hiroshige', 'Kitagawa Utamaro'],
    "« Images du monde flottant » : estampes gravées sur bois montrant acteurs, beautés, paysages et scènes de la vie d'Edo."],
  ['École Rinpa', "Asie de l'Est", 'Japon', 'XVIIe–XIXe siècle', ['Rinpa'], ['Rinpa school', 'Rinpa'], 'k[oō]rin|s[oō]tatsu|h[oō]itsu', ['Tawaraya Sōtatsu', 'Ogata Kōrin', 'Sakai Hōitsu'],
    "Paravents et peintures aux fonds d'or, aux fleurs et aux vagues simplifiées, aux couleurs franches."],
  ['École Kanō', "Asie de l'Est", 'Japon', 'XVe–XIXe siècle', ['Kano school'], ['Kanō school', 'Kano school'], '', ['Kanō Eitoku', "Kanō Tan'yū"],
    "Peintres officiels des shoguns pendant quatre siècles : grands paravents, tigres, dragons, pins et paysages à l'encre."],
  ['Paysage monumental des Song', "Asie de l'Est", 'Chine', 'Xe–XIIIe siècle', ['Song dynasty landscape'], [], 'guo xi', ['Fan Kuan', 'Guo Xi', 'Ma Yuan'],
    "Grands paysages de montagne à l'encre, où le regard voyage du premier plan jusqu'aux sommets dans la brume."],
  ['Peinture lettrée', "Asie de l'Est", 'Chine', 'XIe–XIXe siècle', ['literati'], ['literati painting'], '', ['Shen Zhou', 'Wen Zhengming', 'Dong Qichang'],
    "Peinture de lettrés, poètes et calligraphes, qui cherchent l'expression personnelle : paysages à l'encre, bambous, rochers."],
  ['École de Shanghai', "Asie de l'Est", 'Chine', 'XIXe–début du XXe siècle', ['Shanghai School'], ['Shanghai School'], '', ['Ren Bonian', 'Wu Changshuo'],
    "Peintres de la grande ville marchande, qui renouvellent fleurs, oiseaux et portraits par des couleurs vives et un trait libre."],
  ['Peinture de la dynastie Joseon', "Asie de l'Est", 'Corée', 'XIVe–XIXe siècle', ['Joseon'], [], '', ['Jeong Seon', 'Kim Hong-do', 'Sin Yun-bok'],
    "Paysages « vrais » de Corée, scènes de la vie quotidienne et peintures de lettrés de la dernière dynastie coréenne."],
  ['Peinture moghole', 'Asie du Sud et du Sud-Est', 'Inde', 'XVIe–XIXe siècle', ['Mughal'], ['Mughal painting'], '', ['Basawan', "Abu'l Hasan", 'Ustad Mansur'],
    "Miniatures de la cour des empereurs moghols, entre traditions persane et indienne : portraits, chroniques, animaux et plantes."],
  ['Peinture rajpoute et pahari', 'Asie du Sud et du Sud-Est', 'Inde', 'XVIIe–XIXe siècle', ['Rajput', 'Pahari'], ['Rajput painting', 'Pahari painting'], '', ['Nainsukh', 'Manaku'],
    "Miniatures des royaumes rajputs et des contreforts de l'Himalaya : amours de Krishna et Radha, modes musicaux, couleurs intenses."],
  ['École du Bengale', 'Asie du Sud et du Sud-Est', 'Inde', 'début du XXe siècle', ['Bengal School'], ['Bengal School of Art'], '', ['Abanindranath Tagore'],
    "Mouvement moderne qui renoue avec les traditions de l'Inde et de l'Asie face à l'enseignement académique britannique."],
  ["Art khmer d'Angkor", 'Asie du Sud et du Sud-Est', 'Cambodge', 'IXe–XIIIe siècle', ['Khmer'], [], '', [],
    "Sculptures de grès et de bronze des temples d'Angkor : divinités hindoues et bouddhiques au sourire paisible."],
  ['Miniature persane', 'Moyen-Orient', 'Iran', 'XIIIe–XVIIe siècle', ['Persian painting', 'Shahnama'], ['Persian miniature'], 'shahnam|tabriz', ['Kamal ud-Din Behzad', 'Sultan Muhammad', 'Reza Abbasi'],
    "Peintures de manuscrits aux couleurs précieuses et sans ombres : épopées du Livre des rois, poésie, scènes de cour."],
  ['Peinture ottomane', 'Moyen-Orient', 'Turquie', 'XVIe–XVIIIe siècle', ['Ottoman'], ['Ottoman miniature'], '', ['Nakkaş Osman', 'Levni'],
    "Chroniques illustrées des sultans, fêtes, cortèges et portraits, dans un style narratif précis."],
  ['Art mamelouk', 'Moyen-Orient', 'Égypte et Syrie', 'XIIIe–XVIe siècle', ['Mamluk'], [], '', [],
    "Lampes de mosquée en verre émaillé, métal incrusté d'argent et Corans enluminés du sultanat du Caire et de Damas."],
  ['Art amarnien', 'Afrique', 'Égypte', 'XIVe siècle av. J.-C.', ['Amarna'], ['Amarna art'], '', [],
    "Sous Akhenaton, l'art égyptien devient plus souple et plus intime : corps allongés, scènes de famille, rayons du soleil Aton."],
  ["Art d'Ifé", 'Afrique', 'Nigeria', 'XIIe–XVe siècle', ['Ife'], [], '', [],
    "Têtes en laiton et en terre cuite d'un naturalisme saisissant, réalisées dans la ville sacrée des Yoruba."],
  ['Art de cour du royaume du Bénin', 'Afrique', 'Nigeria', 'XVe–XIXe siècle', ['Benin Kingdom'], [], '', [],
    "Plaques et têtes en laiton du palais royal d'Edo, qui célèbrent les rois (oba) ; beaucoup ont été pillées en 1897."],
  ['Peinture chrétienne éthiopienne', 'Afrique', 'Éthiopie', 'XVe–XIXe siècle', ['Ethiopian'], [], 'ewostatewos', [],
    "Icônes, manuscrits et peintures murales aux grands yeux et aux couleurs vives, parents de l'art copte et byzantin."],
  ['Art maya classique', 'Amériques', 'Mexique et Guatemala', 'IIIe–IXe siècle', ['Maya'], [], '', [],
    "Stèles, vases peints et figurines qui racontent les rois, les dieux et le jeu de balle."],
  ['École de Cuzco', 'Amériques', 'Pérou', 'XVIe–XVIIIe siècle', ['Cuzco'], ['Cusco School'], '', ['Diego Quispe Tito', 'Marcos Zapata'],
    "Peintres andins qui transforment les modèles religieux européens : Vierges en robe triangulaire, brocarts d'or, flore locale."],
  ['Peinture de castas', 'Amériques', 'Mexique', 'XVIIIe siècle', ['casta painting'], ['casta painting'], '', ['Miguel Cabrera', 'José de Páez'],
    "Séries montrant les familles de la Nouvelle-Espagne classées selon leurs origines : un témoignage sur la hiérarchie coloniale."],
  ['Hudson River School', 'Amériques', 'États-Unis', '1825–1880', ['Hudson River School'], ['Hudson River School', 'Hudson River school'], '', ['Thomas Cole', 'Frederic Edwin Church', 'Albert Bierstadt', 'Asher Brown Durand', 'John Frederick Kensett', 'Sanford Robinson Gifford', 'George Inness', 'Martin Johnson Heade'],
    "Grands paysages américains, lumineux et grandioses, qui célèbrent une nature sauvage."],
  ['Sculpture maorie', 'Océanie', 'Nouvelle-Zélande', 'XVIIIe–XIXe siècle', ['Maori'], [], '', [],
    "Bois sculpté, jade et figures d'ancêtres, couverts de spirales et incrustés de nacre."],
  ['Art du Sepik', 'Océanie', 'Papouasie-Nouvelle-Guinée', 'XIXe–XXe siècle', ['Sepik'], [], '', [],
    "Masques, crochets et figures d'ancêtres peints, liés aux maisons cérémonielles et aux rites."],
  ['Art gothique', 'Europe', 'Europe', 'XIIe–XVe siècle', ['Gothic'], ['Gothic art', 'International Gothic'], 'licorne', ['Duccio|Duccio di Buoninsegna', 'Simone Martini', 'Giotto|Giotto di Bondone', 'Frères de Limbourg|Limbourg brothers', 'Claus Sluter', 'Ambrogio Lorenzetti', 'Pietro Lorenzetti', 'Cimabue', 'Gentile da Fabriano', 'Stefan Lochner'],
    "Vitraux, sculptures, tapisseries et retables aux fonds d'or, aux silhouettes élancées et aux couleurs précieuses."],
  ['Renaissance', 'Europe', 'Italie et Europe', 'XVe–XVIe siècle', ['Renaissance'], ['Renaissance', 'Italian Renaissance', 'Northern Renaissance', 'High Renaissance', 'Early Renaissance'], 'bruegel', ['Léonard de Vinci|Leonardo da Vinci', 'Raphaël|Raphael', 'Albrecht Dürer', 'Michel-Ange|Michel-Ange Buronarroti|Michelangelo', 'Sandro Botticelli', 'Titien|Titian', 'Jan van Eyck', 'Donatello', "Pieter Brueghel l'Ancien|Pieter Bruegel the Elder", 'Jérôme Bosch|Hieronymus Bosch', 'Hans Holbein le Jeune|Hans Holbein the Younger', 'Andrea Mantegna'],
    "Retour à l'Antiquité, invention de la perspective, étude du corps et de la nature."],
  ['Baroque', 'Europe', 'Europe et Amériques', 'XVIIe siècle', ['Baroque'], ['Baroque', 'Baroque painting'], 'caravage|rembrandt', ['Le Caravage|Caravaggio', 'Pierre Paul Rubens|Peter Paul Rubens', 'Rembrandt|Rembrandt van Rijn', 'Diego Vélasquez|Diego Velázquez', 'Johannes Vermeer', 'Le Bernin|Gian Lorenzo Bernini', 'Artemisia Gentileschi', 'Antoine van Dyck|Anthony van Dyck', 'Frans Hals'],
    "Mouvement, contrastes de lumière et émotion, des églises de Rome aux missions des Amériques."],
  ['Romantisme', 'Europe', 'Europe', 'fin du XVIIIe–XIXe siècle', ['Romanticism'], ['Romanticism'], 'turner', ['J.M.W. Turner|William Turner|J. M. W. Turner', 'Eugène Delacroix', 'Caspar David Friedrich', 'Théodore Géricault', 'Francisco de Goya', 'John Constable', 'Anne-Louis Girodet|Anne-Louis Girodet de Roucy-Trioson', 'Antoine-Jean Gros', 'Philipp Otto Runge', 'William Blake'],
    "Nature sublime, passions, histoire et rêve."],
  ['École de Barbizon', 'Europe', 'France', '1830–1875', ['Barbizon'], ['Barbizon school', 'Barbizon School'], 'corot|millet|daubigny|rousseau', ['Camille Corot|Jean-Baptiste-Camille Corot', 'Jean-François Millet', 'Théodore Rousseau', 'Charles-François Daubigny', 'Narcisse Díaz de la Peña|Narcisse Virgilio Díaz de la Peña', 'Constant Troyon', 'Jules Dupré', 'Charles Jacque'],
    "Dans la forêt de Fontainebleau, des peintres quittent l'atelier pour peindre sur le motif les arbres, le ciel et le travail des paysans."],
  ['Impressionnisme', 'Europe', 'France', '1860–1890', ['Impressionism'], ['Impressionism'], 'monet|renoir|degas|pissarro|sisley|morisot', ['Claude Monet', 'Berthe Morisot', 'Camille Pissarro', 'Pierre-Auguste Renoir', 'Edgar Degas', 'Édouard Manet', 'Alfred Sisley', 'Gustave Caillebotte', 'Mary Cassatt'],
    "Peindre en plein air la lumière changeante, par touches rapides."],
  ['Postimpressionnisme', 'Europe', 'Europe', '1885–1910', ['Post-Impressionism'], ['Post-Impressionism', 'Post-impressionism'], 'van gogh|gauguin|c[eé]zanne|seurat', ['Vincent van Gogh', 'Paul Gauguin', 'Paul Cézanne', 'Georges Seurat', 'Henri de Toulouse-Lautrec', 'Paul Signac'],
    "Après l'impressionnisme, chacun cherche sa voie : couleur expressive, formes construites, points de couleur."],
  ['Art nouveau', 'Europe', 'Europe', '1890–1910', ['Art Nouveau'], ['Art Nouveau'], '', ['Alfons Mucha|Alphonse Mucha', 'Gustav Klimt', 'Hector Guimard', 'Antoni Gaudí', 'Victor Horta', 'Émile Gallé', 'René Lalique', 'Louis Comfort Tiffany', 'Aubrey Beardsley', 'Otto Wagner'],
    "Lignes courbes inspirées des plantes, dans les affiches, les objets et l'architecture."],
  ['Expressionnisme', 'Europe', 'Europe du Nord', '1905–1930', ['Expressionism'], ['Expressionism'], '', ['Edvard Munch', 'Ernst Ludwig Kirchner', 'Egon Schiele', 'Franz Marc', 'August Macke', 'Paula Modersohn-Becker', 'Alexej von Jawlensky', 'James Ensor', 'Max Beckmann'],
    "Couleurs violentes et formes déformées pour exprimer l'angoisse et l'émotion."],
  ["Pionniers de l'abstraction", 'Europe', 'Europe', '1910–1940', ['abstract'], ['abstract art'], 'hilma af klint', ['Hilma af Klint', 'Vassily Kandinsky', 'Piet Mondrian'],
    "Premières peintures sans sujet reconnaissable : la couleur et la forme pour elles-mêmes."]
].map(([nom, region, lieu, epoque, mots, wd, local, artistes, texte]) => ({ nom, region, lieu, epoque, mots, wd, local, texte,
  // Un artiste peut avoir plusieurs écritures (« Michel-Ange|Michelangelo ») : la première est affichée, la dernière
  // (anglaise) sert aux recherches dans les catalogues, toutes servent à le reconnaître
  artistes: artistes.map(a => a.split('|')[0]), variantes: artistes.map(a => a.split('|')) }));
// Clé d'un nom d'artiste : son nom de famille, sans accents ni « l'Ancien », « the Younger »… (« Pieter Bruegel the Elder »,
// « Pieter Brueghel l'Ancien » → bruegel, brueghel ; « Dürer, Albrecht » → durer)
function cleNom(nom) {
  const mots = sansAccents(String(nom || '').split(/[(,;]/)[0]).split(/[\s'’]+/).filter(m => m && !/^(the|elder|younger|le|la|l|jeune|ancien|il|vecchio|giovane|brothers|freres|bruder)$/.test(m));
  return mots.pop() || '';
}
// Artistes de référence d'autres mouvements que ceux choisis (et qui ne sont pas aussi de référence pour eux) : leurs œuvres
// n'entrent pas dans l'exposition, même si Wikidata les rattache aussi au mouvement (Kandinsky, pionnier de l'abstraction,
// pour l'expressionnisme ; Gauguin, postimpressionniste, pour l'impressionnisme)
function maitresDAilleurs(noms) {
  const ici = new Set([].concat(...noms.map(n => [...clesMaitres(mouvement(n)).keys()])));
  return new Set([].concat(...MOUVEMENTS.filter(m => !noms.includes(m.nom)).map(m => [...clesMaitres(m).keys()])).filter(k => !ici.has(k)));
}
// Le mouvement a-t-il une liste d'artistes de référence assez longue pour que les autres n'aient qu'une petite place ?
function maitresConnus(mv) { return !!mv && mv.variantes.length >= 6; }
// Clés des artistes de référence d'un mouvement, chaque écriture renvoyant à la clé de la première
function clesMaitres(mv) {
  const alias = new Map();
  (mv ? mv.variantes : []).forEach(v => v.forEach(x => alias.set(cleNom(x), cleNom(v[0]))));
  return alias;
}
function mouvement(nom) { return MOUVEMENTS.find(m => m.nom === nom) || null; }
// Style architectural de Wikidata (P149) dont les monuments font partie du mouvement (avec tous ses sous-styles)
const STYLES_ARCHITECTURE = { 'Art gothique': 'Q176483' };
const ANONYME = 'Q4233718'; // « anonyme » dans Wikidata
// Mouvements d'abord de l'estampe : leurs estampes ne sont pas limitées à trois
const MOUVEMENTS_D_ESTAMPES = new Set(['Ukiyo-e', 'Expressionnisme']);
// Mouvements de peintres : si le visiteur n'a pas choisi de type, l'exposition ne montre que des peintures
// (pas les dessins, études, estampes ou éventails que les catalogues renvoient aussi pour ces artistes)
const MOUVEMENTS_DE_PEINTURE = new Set(['Impressionnisme', 'Postimpressionnisme', 'Romantisme', 'École de Barbizon', 'Hudson River School', 'École de Cuzco', 'Peinture de castas']);
// Une œuvre de collection.json appartient-elle à ce mouvement ? (d'après son artiste ou son titre)
function oeuvreDuMouvement(w, nom) {
  const m = mouvement(nom);
  return !!(m && m.local && new RegExp(m.local, 'i').test((w.artist || '') + ' ' + (w.title || '')));
}
// Clé qui repère une même œuvre venue de deux sources : titre et dernier mot du nom de l'artiste, sans accents
// (« La Grande Vague de Kanagawa » de « Hokusai » et de « Katsushika Hokusai »)
function cleOeuvre(w) {
  const mots = sansAccents(w.artist).split(/[^\p{L}]+/u).filter(Boolean);
  return sansAccents(w.title).replace(/[^\p{L}\d]+/gu, ' ').trim() + '|' + (mots[mots.length - 1] || '');
}
// Œuvres déjà retenues, pour écarter les doublons : même titre, et des noms d'artiste qui ont un mot en commun
// (« La Ronde de nuit » de « Rembrandt van Rijn » dans la collection du site et de « Rembrandt » dans Wikidata)
function registreOeuvres() {
  const parTitre = new Map();
  const titre = w => sansAccents(w.title).replace(/[^\p{L}\d]+/gu, ' ').trim();
  const mots = w => sansAccents(w.artist).split(/[^\p{L}]+/u).filter(m => m.length >= 4 && !PARTICULES_NOMS.test(m) && !PAS_DE_SA_MAIN.test(m));
  return {
    vue: w => (parTitre.get(titre(w)) || []).some(l => !l.length || !mots(w).length || mots(w).some(m => l.includes(m))),
    ajouter: w => { const t = titre(w); if (!parTitre.has(t)) parTitre.set(t, []); parTitre.get(t).push(mots(w)); }
  };
}
// Recherche par artiste : l'œuvre est-elle de cet artiste ? Tous les mots du nom tapé (sans accents) doivent être des mots
// du nom de l'artiste. Renvoie 0 (non), 2 (oui) ou 1 (peut-être) : 1 quand un nom d'un seul mot n'est que le prénom d'un
// autre artiste (« Rembrandt » dans « Rembrandt Peale » ou « Rembrandt Bugatti », mais pas dans « Rembrandt van Rijn ») ;
// ces œuvres ne sont gardées que si aucune œuvre de la recherche ne correspond mieux (voir chercherDansLesMusees).
// Les œuvres d'école, d'atelier, de suiveurs ou « d'après » l'artiste sont écartées (« Workshop of Rembrandt »), mais pas
// celles d'un graveur d'après un autre artiste quand c'est le graveur qui est cherché (« Jan Sadeler I; after Maerten de Vos »).
const PARTICULES_NOMS = /^(van|von|de|di|da|del|della|du|der|den|des|le|la|ter|ten|y|e)$/;
const PAS_DE_SA_MAIN = /^(school|workshop|studio|circle|follower|followers|manner|imitator|copy|after|skole|efter|kreds|vaerksted|ecole|atelier|entourage|suiveur|apres)$/;
function deLArtiste(w, nom) {
  const cherches = sansAccents(nom).split(/[^\p{L}]+/u).filter(x => x.length >= 3 && !PARTICULES_NOMS.test(x));
  if (!cherches.length) return 0;
  // Le nom de l'artiste peut réunir plusieurs personnes séparées par « ; » (graveur, éditeur…) : on garde celle qui correspond
  const partie = sansAccents(w.artist).split(';').map(p => p.split(/[^\p{L}]+/u).filter(Boolean)).find(m => cherches.every(x => m.includes(x)));
  if (!partie || partie.some(x => PAS_DE_SA_MAIN.test(x))) return 0;
  if (cherches.length > 1) return 2;
  // Nom d'un seul mot : dernier mot (sans « I », « II », « the Elder »…), ou suivi plus loin d'une particule
  // (« Rembrandt Harmensz. van Rijn », « Leonardo da Vinci »)
  const nom2 = partie.filter(x => !/^(i|ii|iii|iv|the|elder|younger|jr|sr|vieux|jeune)$/.test(x));
  return nom2.some((x, i) => x === cherches[0] && (i === nom2.length - 1 || nom2.slice(i + 1).some(y => PARTICULES_NOMS.test(y)))) ? 2 : 1;
}

const REGIONS_HORS_EUROPE = ["Asie de l'Est", 'Asie du Sud et du Sud-Est', 'Moyen-Orient', 'Afrique', 'Amériques', 'Océanie'];
const wd = liste => liste.map(q => 'wd:' + q).join(' ');
function bornesEpoques(ep) {
  if (!ep.length) return null;
  const d = ep.map(e => DATES_EPOQUES[e]);
  return [Math.min(...d.map(x => x[0])), Math.max(...d.map(x => x[1]))];
}
// Règles de Wikimedia pour les programmes qui interrogent ses services (https://wikitech.wikimedia.org/wiki/Robot_policy) :
// - se présenter : le navigateur ne peut pas changer son User-Agent, le site envoie donc l'en-tête Api-User-Agent ;
// - Wikidata (recherches SPARQL) : 5 recherches simultanées au plus par visiteur ; le site en envoie 3 au plus ;
// - Commons (API) : une demande à la fois ;
// - après un refus « 429 Trop de demandes », attendre avant de redemander : pendant la pause (une minute, ou la durée
//   indiquée par Wikimedia), les recherches concernées échouent aussitôt, et les autres catalogues continuent.
const API_USER_AGENT = 'jaunerougebleu.org (generateur d expositions ; https://jaunerougebleu.org)';
// File d'attente qui garde le résultat (ou l'erreur) de chaque tâche : au plus « max » tâches en même temps
function limiteur(max) {
  let actives = 0;
  const attente = [];
  const suivante = () => {
    if (actives >= max || !attente.length) return;
    actives++;
    const [tache, ok, ko] = attente.shift();
    Promise.resolve().then(tache).then(r => { actives--; ok(r); suivante(); }, e => { actives--; ko(e); suivante(); });
  };
  return tache => new Promise((ok, ko) => { attente.push([tache, ok, ko]); suivante(); });
}
const fileWikidata = limiteur(3), fileCommons = limiteur(1), pauseWikimedia = { wikidata: 0, commons: 0 };
function demandeWikimedia(service, file, url, delai, options) {
  return file(() => {
    if (Date.now() < pauseWikimedia[service]) throw new Error(service + ' en pause après un refus 429');
    const o = Object.assign({}, options);
    o.headers = Object.assign({ 'Api-User-Agent': API_USER_AGENT }, o.headers);
    const ctrl = new AbortController(), minuteur = setTimeout(() => ctrl.abort(), delai || 9000);
    return fetch(url, Object.assign(o, { signal: ctrl.signal })).then(r => {
      clearTimeout(minuteur);
      if (r.status === 429) pauseWikimedia[service] = Date.now() + 1000 * Math.min(600, parseInt(r.headers.get('Retry-After'), 10) || 60);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  });
}
function sparql(requete, delai) {
  // Envoi en POST : les requêtes longues dépasseraient la taille maximale d'une adresse
  return demandeWikimedia('wikidata', fileWikidata, 'https://query.wikidata.org/sparql?format=json', delai || 15000, {
    method: 'POST', body: new URLSearchParams({ query: requete })
  }).then(r => (r.results && r.results.bindings) || []);
}
const val = (b, k) => (b[k] ? b[k].value : '');
const qid = (b, k) => val(b, k).replace('http://www.wikidata.org/entity/', '');
function anneeWikidata(texte) { const m = String(texte || '').match(/^(-?\d+)/); return m ? parseInt(m[1], 10) : null; }
function majuscule(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function texteBrut(html) {
  const t = new DOMParser().parseFromString(html || '', 'text/html').body.textContent.replace(/\s+/g, ' ').trim();
  return t.length > 60 ? t.slice(0, 57) + '…' : t;
}
// Nom du fichier Commons à partir de l'adresse donnée par Wikidata
function fichierCommons(url) { return decodeURIComponent(String(url).split('Special:FilePath/')[1] || ''); }
// Vignette, auteur et licence de chaque image, en une seule demande à Wikimedia Commons.
// Wikimedia Commons ne sert plus, en lien direct, que des vignettes de tailles standard
// (20, 40, 60, 120, 250, 330, 500, 960, 1280, 1920, 3840 px de large) : toute autre taille est refusée
// (voir https://www.mediawiki.org/wiki/Common_thumbnail_sizes). Le site demande 500 px, et 1280 px pour la visionneuse.
function infosCommons(fichiers) {
  if (!fichiers.length) return Promise.resolve({});
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=extmetadata|url&iiurlwidth=500' +
    '&iiextmetadatafilter=LicenseShortName|Artist&titles=' + encodeURIComponent(fichiers.slice(0, 50).map(f => 'File:' + f).join('|'));
  return demandeWikimedia('commons', fileCommons, url).then(r => {
    const q = r.query || {}, origine = {};
    (q.normalized || []).forEach(n => { origine[n.to] = n.from; });
    const infos = {};
    Object.values(q.pages || {}).forEach(p => {
      const ii = p.imageinfo && p.imageinfo[0];
      if (!ii) return;
      const m = ii.extmetadata || {};
      infos[(origine[p.title] || p.title).replace(/^File:/, '')] = {
        image: ii.thumburl || ii.url, page: ii.descriptionurl,
        licence: m.LicenseShortName ? m.LicenseShortName.value : '', auteur: texteBrut(m.Artist ? m.Artist.value : '')
      };
    });
    return infos;
  }).catch(() => ({}));
}
function creditCommons(lieu, fichier, info) {
  const page = (info && info.page) || 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(fichier.replace(/ /g, '_'));
  if (!info) return lieu + ', via Wikimedia Commons (' + page + ')';
  const licence = /public domain|^pd|cc0/i.test(info.licence) ? 'domaine public' : info.licence;
  return lieu + ' ; ' + [info.auteur, licence].filter(Boolean).join(', ') + ', via Wikimedia Commons (' + page + ')';
}
// Domaine public selon la règle française (plus stricte que celle de Wikimedia Commons, qui suit le droit américain) :
// auteur mort depuis plus de 70 ans ; auteur inconnu ou anonyme : œuvre antérieure à 1900 (même règle pour les monuments)
function libreDeDroits(b, annee) {
  const limite = new Date().getFullYear() - 71;
  const deces = anneeWikidata(val(b, 'deces'));
  if (deces !== null) return deces <= limite;
  if (/^http:\/\/www\.wikidata\.org\/entity\/Q/.test(val(b, 'createur'))) return annee !== null && annee < 1850;
  return annee !== null && annee < 1900;
}
// Transforme les lignes Wikidata en œuvres (une par élément), en limitant le nombre d'œuvres par musée
function oeuvresWikidata(lignes, n, options) {
  // Une œuvre peut occuper plusieurs lignes (plusieurs classes, plusieurs créateurs) : on garde la première et on réunit les classes
  const vus = new Map(), classes = {};
  lignes.forEach(b => {
    const id = qid(b, 'i');
    (classes[id] = classes[id] || []).push(val(b, 'typeEn'));
    if (vus.has(id)) return;
    const titre = val(b, 'iLabel'), annee = anneeWikidata(val(b, 'date'));
    if (!titre || /^Q\d+$/.test(titre)) return;
    // Années 1 à 99 : presque toujours un siècle mal saisi (« 18 » pour XVIIIe siècle)
    if (annee > 0 && annee < 100) return;
    // Date impossible : plus d'un siècle avant la mort de l'auteur (« 1000 » pour une œuvre de Miguel Cabrera, mort en 1768)
    const deces = anneeWikidata(val(b, 'deces'));
    if (annee !== null && deces !== null && annee < deces - 100) return;
    if (!libreDeDroits(b, annee)) return;
    vus.set(id, b);
  });
  const parLieu = {}, choisies = [];
  const plafond = options.plafond || Math.max(2, Math.ceil(n / 3));
  // Les plus connues d'abord si demandé (options.garderOrdre), sinon au hasard
  const ordre = options.garderOrdre ? [...vus.values()].sort((a, b) => (Number(val(b, 'liens')) || 0) - (Number(val(a, 'liens')) || 0)) : [...vus.values()].sort(() => Math.random() - 0.5);
  for (const b of ordre) {
    const lieu = val(b, options.lieu);
    parLieu[lieu] = (parLieu[lieu] || 0) + 1;
    if (parLieu[lieu] > plafond) continue;
    choisies.push(b);
    if (choisies.length >= n) break;
  }
  const fichiers = choisies.map(b => fichierCommons(val(b, 'img')));
  return infosCommons(fichiers).then(infos => choisies.map((b, k) => {
    const info = infos[fichiers[k]];
    const regionOrigine = REGION_DU_PAYS[qid(b, 'origine')] || REGION_DU_PAYS[qid(b, 'nat')];
    const region = regionOrigine || options.region(b);
    const createur = val(b, 'createurLabel');
    const lieu = majuscule(val(b, options.lieu));
    return oeuvre({
      titre: majuscule(val(b, 'iLabel')), langue: (b.iLabel && b.iLabel['xml:lang']) || 'fr',
      // Créateur anonyme ou sans nom dans Wikidata : on n'affiche rien
      artiste: /^(Q\d+|https?:)/.test(createur) || qid(b, 'createur') === ANONYME ? '' : createur, annee: anneeWikidata(val(b, 'date')),
      date: (a => a === null ? '' : a < 0 ? (-a) + ' av. J.-C.' : String(a))(anneeWikidata(val(b, 'date'))),
      lieu: majuscule(val(b, 'origineLabel').replace(/^Q\d+$/, '')), musee: options.musee(lieu),
      image: info ? info.image : 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(fichiers[k]) + '?width=500',
      credit: creditCommons(options.musee(lieu), fichiers[k], info) + (options.notice ? ' ; ' + options.notice(b) : ''),
      regions: region ? [region] : [],
      type: options.type || (classes[qid(b, 'i')] || []).map(typeDe).find(t => t !== 'Autre') || 'Autre',
      pastille: options.pastille || 'Wikidata et Wikimedia Commons, en direct',
      renom: Number(val(b, 'liens')) || 0, qid: qid(b, 'i')
    });
  }));
}
// Choisit les musées à interroger : ceux de la région demandée, ou un échantillon du monde entier (surtout hors d'Europe)
function museesPour(region) {
  if (region) return MUSEES_MONDE[region];
  const melange = l => l.slice().sort(() => Math.random() - 0.5);
  return [].concat(...REGIONS_HORS_EUROPE.map(r => melange(MUSEES_MONDE[r]).slice(0, 3)), melange(MUSEES_MONDE.Europe).slice(0, 2));
}

// Wikidata : œuvres d'un artiste (nom ou nom alternatif, en français, anglais ou multilingue) ou d'un mouvement
// (mouvement P135 ou genre P136 dont le libellé anglais est dans la liste « wd » du mouvement).
// Les œuvres les plus connues d'abord : celles qui ont le plus d'articles dans les Wikipédia du monde (« sitelinks »),
// pour que La Ronde de nuit passe avant les centaines de gravures de Rembrandt ; un peu de hasard parmi elles.
// Période d'un mouvement, d'après son époque dans MOUVEMENTS (« 1860–1890 », « XIXe siècle », « XVIe–XIXe siècle »,
// « début du XXe siècle », « fin du XVIIIe–XIXe siècle », « XIVe siècle av. J.-C. »), élargie de 15 ans de chaque côté ;
// null si l'époque ne se lit pas
function periodeMouvement(mv) {
  const e = String(mv.epoque || ''), marge = 15;
  const annees = (e.match(/\d{4}/g) || []).map(Number);
  if (annees.length >= 2) return [annees[0] - marge, annees[annees.length - 1] + marge];
  const romain = r => { const v = { I: 1, V: 5, X: 10, L: 50, C: 100 }; let t = 0; for (let k = 0; k < r.length; k++) { const a = v[r[k]], b = v[r[k + 1]] || 0; t += a < b ? -a : a; } return t; };
  const siecles = [...e.matchAll(/\b([IVXLC]+)e\b/g)].map(m => romain(m[1]));
  if (!siecles.length) return null;
  const av = /av\. J\.-C\./.test(e);
  let debut = (siecles[0] - 1) * 100 + 1, fin = siecles[siecles.length - 1] * 100;
  // « début du » ou « fin du » devant un siècle : seulement le premier ou le dernier tiers de ce siècle
  const debutDu = e.match(/début du ([IVXLC]+)e/), finDu = e.match(/fin du ([IVXLC]+)e/);
  if (debutDu && romain(debutDu[1]) === siecles[siecles.length - 1]) fin = (siecles[siecles.length - 1] - 1) * 100 + 35;
  if (finDu && romain(finDu[1]) === siecles[0]) debut = (siecles[0] - 1) * 100 + 66;
  if (av) [debut, fin] = [-fin, -debut];
  return [debut - marge, fin + marge];
}
// Artistes d'un mouvement, d'après Wikidata (propriété « mouvement », P135), les plus connus d'abord : ceux du mouvement
// qui porte le libellé anglais de la liste MOUVEMENTS, ou de celui que partagent tous ses artistes de référence
// (plus sûr : un libellé peut différer, « Hudson River School » / « Hudson River school »). Gardés en mémoire pendant la visite.
const ARTISTES_MOUVEMENTS = {};
function artistesDuMouvement(mv) {
  if (ARTISTES_MOUVEMENTS[mv.nom]) return ARTISTES_MOUVEMENTS[mv.nom];
  const lit = (s, l) => JSON.stringify(s) + '@' + l;
  const refs = mv.variantes.slice(0, 3);
  const parLibelle = mv.wd.length ? `{ VALUES ?nomMv { ${mv.wd.map(x => lit(x, 'en')).join(' ')} } ?mv rdfs:label ?nomMv . }` : '';
  const parArtistes = refs.length >= 2 ? `{ SELECT ?mv WHERE { VALUES ?nom { ${[].concat(...[].concat(...refs).map(x => [lit(x, 'en'), lit(x, 'fr'), lit(x, 'mul')])).join(' ')} }
      ?ref rdfs:label ?nom ; wdt:P135 ?mv . } GROUP BY ?mv HAVING(COUNT(DISTINCT ?ref) >= ${refs.length}) }` : '';
  if (!parLibelle && !parArtistes) return Promise.resolve([]);
  // Ordre imposé : d'abord le mouvement, puis ses artistes, puis leur notoriété (sinon Wikidata peut commencer par
  // parcourir toutes les personnes et dépasser le délai : la liste revenait vide). Le filtre « personne » vient après le
  // mouvement : il écarte les œuvres rattachées au mouvement (« The Course of Empire »)
  const requete = `SELECT ?a ?aLabel ?liens ?mv WHERE {
    hint:Query hint:optimizer "None" .
    { SELECT DISTINCT ?mv WHERE { ${[parLibelle, parArtistes].filter(Boolean).join(' UNION ')} } }
    ?a wdt:P135 ?mv .
    ?a wdt:P31 wd:Q5 .
    ?a wikibase:sitelinks ?liens .
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr,mul". }
  } ORDER BY DESC(?liens) LIMIT 150`;
  // Les artistes de référence sont aussi retrouvés par leur nom, quel que soit le mouvement que Wikidata leur donne
  // (Michel-Ange, Botticelli, Titien sont rangés dans la « haute » ou la « première Renaissance », pas dans « Renaissance ») ;
  // pour chaque artiste, la personne de ce nom (ou la fratrie : les frères de Limbourg) la plus présente dans les Wikipédia (pas un homonyme)
  const requeteRefs = `SELECT ?nom ?a ?aLabel ?liens WHERE {
    hint:Query hint:optimizer "None" .
    VALUES ?nom { ${[].concat(...[].concat(...mv.variantes).map(x => [lit(x, 'en'), lit(x, 'fr'), lit(x, 'mul')])).join(' ')} }
    ?a rdfs:label ?nom . ?a wdt:P31 ?genre . FILTER(?genre IN (wd:Q5, wd:Q16979650)) ?a wikibase:sitelinks ?liens .
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr,mul". }
  }`;
  const deRef = mv.variantes.length ? sparql(requeteRefs, 10000).catch(() => []) : Promise.resolve([]);
  const p = ARTISTES_MOUVEMENTS[mv.nom] = Promise.all([sparql(requete, 10000), deRef]).then(([l, lr]) => {
    const vus = new Set(), artistes = [];
    const ajouter = a => { if (a.nom && !/^Q\d+$/.test(a.nom) && !vus.has(a.q)) { vus.add(a.q); artistes.push(a); } };
    mv.variantes.forEach(v => {
      const cles = new Set(v.map(x => sansAccents(x)));
      const choix = lr.filter(b => cles.has(sansAccents(val(b, 'nom')))).sort((x, y) => (Number(val(y, 'liens')) || 0) - (Number(val(x, 'liens')) || 0))[0];
      if (choix) ajouter({ q: qid(choix, 'a'), nom: val(choix, 'aLabel') });
    });
    l.forEach(b => ajouter({ q: qid(b, 'a'), nom: val(b, 'aLabel') }));
    // Identifiants Wikidata du mouvement (Q166713…), pour chercher ses œuvres sans dépendre de l'écriture de son nom
    // (« Post-impressionism » dans Wikidata, « Post-Impressionism » dans la liste MOUVEMENTS)
    const liste = artistes.slice(0, 40 + mv.variantes.length);
    liste.mvs = [...new Set(l.map(b => qid(b, 'mv')).filter(Boolean))];
    return liste;
  });
  p.catch(() => { delete ARTISTES_MOUVEMENTS[mv.nom]; }); // en cas d'échec, on réessaiera à la prochaine exposition
  return p;
}
// Noms d'artistes à chercher dans les catalogues pour un mouvement : ceux de la liste MOUVEMENTS, puis les plus connus de
// Wikidata, huit au plus ; liste vide pour les mouvements sans artistes connus (œuvres anonymes)
// (on n'attend Wikidata que 4 secondes : au-delà, les catalogues partent avec les artistes de la liste MOUVEMENTS)
function nomsArtistesMouvement(mv) {
  const attente = new Promise(ok => setTimeout(() => ok([]), 4000));
  return Promise.race([artistesDuMouvement(mv).catch(() => []), attente]).then(l => {
    const noms = [], vus = new Set();
    // (artistes de référence sous leur écriture anglaise, celle des catalogues ; un artiste n'est cherché qu'une fois)
    const alias = clesMaitres(mv);
    const ailleurs = maitresDAilleurs([mv.nom]);
    mv.variantes.map(v => v[v.length - 1]).concat(l.map(a => a.nom)).forEach(x => { const k = alias.get(cleNom(x)) || cleNom(x) || sansAccents(x); if (!vus.has(k) && !ailleurs.has(k)) { vus.add(k); noms.push(x); } });
    return noms.slice(0, 8);
  });
}
function chercherWikidataArtisteMouvement(c, n) {
  const mv = c.mouvement && mouvement(c.mouvement);
  if (!c.artiste && !(mv && (mv.wd.length || mv.artistes.length >= 2))) return Promise.resolve([]);
  const lit = (s, l) => JSON.stringify(s) + '@' + l;
  const d = bornesEpoques(c.ep || []);
  // Mouvement : deux fois plus d'œuvres, pour que chacun de ses grands maîtres ait ses chefs-d'œuvre
  // (les œuvres en trop sont écartées ensuite par la répartition entre artistes, voir chercherDansLesMusees)
  if (!c.artiste) n *= 2;
  // Œuvres qui répondent au filtre, illustrées, les plus connues d'abord (ou au hasard pour les découvertes)
  // c.joconde : seulement les œuvres des musées de France qui ont une notice Joconde (P347), pour la source Joconde
  const requeteDe = filtre => `SELECT ?i ?iLabel ?m ?mLabel ?date ?img ?jc ?liens ?typeEn ?createur ?createurLabel ?deces ?origine ?origineLabel ?nat WHERE {
    { SELECT DISTINCT ?i ?createur ?img ?date ?jc ?liens WHERE {
        hint:Query hint:optimizer "None" .
        ${filtre}
        ${c.joconde ? '?i wdt:P347 ?jc .' : ''}
        ?i wdt:P18 ?img . OPTIONAL { ?i wdt:P571 ?date }
        ${d ? `FILTER(!BOUND(?date) || (YEAR(?date) >= ${d[0]} && YEAR(?date) <= ${d[1]}))` : ''}
        ?i wikibase:sitelinks ?liens .
      } ORDER BY ${celebres(c) ? 'DESC(?liens)' : `MD5(CONCAT(STR(?i), "${Math.random().toString(36).slice(2, 8)}"))`} LIMIT ${n * 3} }
    OPTIONAL { ?i wdt:P195 ?m }
    OPTIONAL { ?i wdt:P31 ?type . ?type rdfs:label ?typeEn FILTER(LANG(?typeEn) = "en") }
    OPTIONAL { ?i wdt:P495 ?origine }
    OPTIONAL { ?createur wdt:P27 ?nat } OPTIONAL { ?createur wdt:P570 ?deces }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en,mul". }
  }`;
  // Plusieurs filtres : une requête chacun, en parallèle (plus légères qu'une seule requête qui les réunit, qui dépassait
  // souvent le délai quand Wikidata est chargé) ; les réponses reçues sont réunies, la source n'est en panne que si toutes échouent
  // Un filtre peut avoir une version de secours, plus légère, essayée si la première ne répond pas ([filtre, secours])
  const essai = f => Array.isArray(f) ? sparql(requeteDe(f[0]), 15000).catch(() => sparql(requeteDe(f[1]), 12000)) : sparql(requeteDe(f), 20000);
  const oeuvresDe = (...filtres) => Promise.all(filtres.map(f => essai(f).then(l => ({ l }), e => ({ e }))))
    .then(rs => { if (rs.every(r => r.e)) throw rs[0].e; return [].concat(...rs.filter(r => r.l).map(r => r.l)); })
    .then(lignes => oeuvresWikidata(lignes, n, Object.assign({
    // Œuvres célèbres : les plus connues gardent leur rang, et un même musée (Orsay…) peut en fournir la moitié
    lieu: 'mLabel', musee: nom => (nom && !/^(Q\d+|https?:)/i.test(nom) ? nom : 'Wikidata'), region: () => (mv ? mv.region : null),
    garderOrdre: celebres(c), plafond: celebres(c) ? Math.ceil(n / 2) : 0
  }, c.joconde ? {
    musee: nom => (nom && !/^(Q\d+|https?:)/i.test(nom) ? nom : 'Musée de France'), pastille: 'Notice Joconde des musées de France, en direct',
    notice: b => 'notice Joconde (https://pop.culture.gouv.fr/notice/joconde/' + encodeURIComponent(val(b, 'jc')) + ')'
  } : {})));
  if (c.artiste) {
    // Le nom tapé, et la même chose avec des majuscules aux initiales (« hokusai » → « Hokusai »)
    const noms = [...new Set([c.artiste.trim(), c.artiste.trim().replace(/(^|[\s-])(\p{L})/gu, (x, a, b) => a + b.toUpperCase())])];
    return oeuvresDe(`VALUES ?nom { ${[].concat(...noms.map(x => ['fr', 'en', 'mul'].map(l => lit(x, l)))).join(' ')} }
      ?createur rdfs:label|skos:altLabel ?nom . ?i wdt:P170 ?createur .`);
  }
  // Mouvement : les œuvres rattachées au mouvement (qui ont un artiste : pas un musée ou un bâtiment ; datées de sa période :
  // pas « Pluie, Vapeur et Vitesse » de Turner, 1844, présenté comme précurseur de l'impressionnisme), et surtout les œuvres de ses artistes datées de sa période
  // (un artiste n'appartient pas à un mouvement toute sa vie)
  const periode = periodeMouvement(mv);
  return artistesDuMouvement(mv).catch(() => []).then(artistes => {
    const branches = [], mvs = (artistes.mvs || []).map(q => 'wd:' + q);
    // Le mouvement : par son identifiant s'il est connu, sinon par son libellé anglais
    const leMouvement = mvs.length ? `VALUES ?mv { ${mvs.join(' ')} }` : `VALUES ?nomMv { ${mv.wd.map(x => lit(x, 'en')).join(' ')} } ?mv rdfs:label ?nomMv .`;
    if (mv.wd.length || mvs.length) branches.push(`{ ${leMouvement} ?i wdt:P135|wdt:P136 ?mv ; wdt:P170|wdt:P84 ?createur .
        ${periode ? `OPTIONAL { ?i wdt:P571 ?dateM } FILTER(!BOUND(?dateM) || (YEAR(?dateM) >= ${periode[0]} && YEAR(?dateM) <= ${periode[1]}))` : ''} }`);
    // Une œuvre de ces artistes rattachée à un autre mouvement est écartée (« Le Christ jaune » de Gauguin, synthétisme ;
    // « La Femme au chapeau » de Matisse, fauvisme)
    const autreMouvement = mvs.length ? `OPTIONAL { ?i wdt:P135 ?mvOeuvre } FILTER(!BOUND(?mvOeuvre) || ?mvOeuvre IN (${mvs.join(', ')}))`
      : mv.wd.length ? `OPTIONAL { ?i wdt:P135 ?mvOeuvre }
        FILTER(!BOUND(?mvOeuvre) || EXISTS { VALUES ?nomMvO { ${mv.wd.map(x => lit(x, 'en')).join(' ')} } ?mvOeuvre rdfs:label ?nomMvO })` : '';
    // (créateur, ou architecte pour un bâtiment : la Sagrada Família de Gaudí, l'hôtel Tassel de Horta ; la date de mort de
    // l'un ou de l'autre, qui dit si l'œuvre est du domaine public, est lue dans requeteDe pour le ?createur trouvé : chaque
    // filtre doit donc lier ?createur, sinon Wikidata parcourt les dates de mort de toutes les personnes)
    // Deux requêtes : les artistes de la liste MOUVEMENTS (les grands maîtres, dont viennent les chefs-d'œuvre), puis douze
    // autres parmi les plus connus. Si Wikidata est trop chargé pour répondre à la première, elle est refaite avec les seules
    // œuvres présentes dans au moins cinq Wikipédia (les plus célèbres)
    const alias = clesMaitres(mv), deReference = a => alias.has(cleNom(a.nom));
    const parArtistes = (liste, filtre, extra) => `{ VALUES ?createur { ${liste.map(a => 'wd:' + a.q).join(' ')} } ?i wdt:P170|wdt:P84 ?createur ; wdt:P571 ?dateA .
        ${periode ? `FILTER(YEAR(?dateA) >= ${periode[0]} && YEAR(?dateA) <= ${periode[1]})` : ''} ${filtre} ${extra || ''} }`;
    const ailleurs = maitresDAilleurs([mv.nom]);
    const maitres = artistes.filter(deReference), autres = artistes.filter(a => !deReference(a) && !ailleurs.has(cleNom(a.nom))).slice(0, maitresConnus(mv) ? 8 : 12);
    // (pour les grands maîtres, pas de filtre « autre mouvement » : Wikidata range souvent leurs chefs-d'œuvre dans un
    // sous-mouvement, « haute Renaissance » pour L'École d'Athènes, « première Renaissance » pour La Naissance de Vénus)
    if (maitres.length) branches.push([parArtistes(maitres, ''), parArtistes(maitres, '', '?i wikibase:sitelinks ?l5 . FILTER(?l5 >= 5)')]);
    // (œuvres des autres artistes : leur place est limitée ensuite, seules les plus connues sont demandées)
    if (autres.length) branches.push(parArtistes(autres, autreMouvement, celebres(c) ? '?i wikibase:sitelinks ?l3 . FILTER(?l3 >= 3)' : ''));
    // Style architectural (P149 : « gothique classique » pour Chartres, « gothique rayonnant » pour la Sainte-Chapelle, tous
    // sous-styles de l'architecture gothique) : les monuments du mouvement, souvent sans architecte connu, datés de sa
    // période (pas le néo-gothique du XIXe siècle) et présents dans au moins quinze Wikipédia
    const style = STYLES_ARCHITECTURE[mv.nom];
    // (sans architecte connu, le monument est attribué à « anonyme », Q4233718, pour que ?createur soit toujours lié)
    if (style && periode) branches.push(`{ { SELECT DISTINCT ?st WHERE { ?st wdt:P279* wd:${style} } } ?i wdt:P149 ?st ; wdt:P571 ?dateS .
        FILTER(YEAR(?dateS) >= ${periode[0]} && YEAR(?dateS) <= ${periode[1]}) ?i wikibase:sitelinks ?ls . FILTER(?ls >= 15)
        OPTIONAL { ?i wdt:P84 ?architecte } BIND(COALESCE(?architecte, wd:${ANONYME}) AS ?createur) }`);
    return branches.length ? oeuvresDe(...branches) : [];
  });
}

// Images de l'Art Institute of Chicago : depuis 2026, leur serveur (www.artic.edu, protégé par Cloudflare) les refuse
// aux autres sites (vérification anti-robots, voir https://github.com/art-institute-of-chicago/api-data/issues/9), alors
// que son catalogue (api.artic.edu) répond. On essaie une seule image (La Grande Jatte de Seurat) une fois par visite ;
// si elle ne se charge pas, l'image de chaque œuvre est prise sur Wikimedia Commons, où beaucoup d'œuvres de Chicago du
// domaine public sont copiées (reliées dans Wikidata par leur numéro Chicago, propriété P4610) ; les autres sont écartées.
let imagesAicOk = null;
function imagesAIC() {
  if (!imagesAicOk) imagesAicOk = new Promise(ok => {
    const img = new Image(), fin = r => { clearTimeout(t); ok(r); }, t = setTimeout(() => fin(false), 8000);
    img.onload = () => fin(img.naturalWidth > 0); img.onerror = () => fin(false);
    img.src = 'https://www.artic.edu/iiif/2/2d484387-2509-5e8e-2c43-22f9981972eb/full/200,/0/default.jpg';
  });
  return imagesAicOk;
}
// Œuvres de Chicago (objets de l'API) → œuvres du site, avec l'image de Chicago ou, si elle est bloquée, celle de Commons
function oeuvresAIC(liste, n, largeur) {
  liste = liste.filter(o => o && o.image_id);
  const fiche = o => 'https://www.artic.edu/artworks/' + o.id;
  const fabriquer = (o, image, credit) => oeuvre({
    titre: o.title, artiste: (o.artist_display || '').split('\n')[0], date: o.date_display, annee: o.date_start,
    lieu: o.place_of_origin, nationalite: o.artist_display, musee: ADAPTATEURS.aic.nom, image, credit,
    fiche: fiche(o), classification: [o.artwork_type_title, o.classification_title].join(' ')
  });
  return imagesAIC().then(ok => {
    if (ok) return liste.slice(0, n).map(o => fabriquer(o, 'https://www.artic.edu/iiif/2/' + o.image_id + '/full/' + largeur + ',/0/default.jpg'));
    if (!liste.length) return [];
    return sparql(`SELECT ?id ?img WHERE { VALUES ?id { ${liste.map(o => JSON.stringify(String(o.id))).join(' ')} } ?i wdt:P4610 ?id ; wdt:P18 ?img . }`, 10000)
      .then(lignes => {
        const fichiers = {};
        lignes.forEach(b => { if (!fichiers[val(b, 'id')]) fichiers[val(b, 'id')] = fichierCommons(val(b, 'img')); });
        const gardees = liste.filter(o => fichiers[o.id]).slice(0, n);
        return infosCommons(gardees.map(o => fichiers[o.id])).then(infos => gardees.map(o => {
          const f = fichiers[o.id], info = infos[f] || {};
          const page = info.page || 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(f.replace(/ /g, '_'));
          return fabriquer(o, info.image || 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(f) + '?width=500',
            ADAPTATEURS.aic.nom + ' (' + fiche(o) + '), domaine public ; image via Wikimedia Commons (' + page + ')' + (info.licence ? ', ' + info.licence : ''));
        }));
      });
  });
}

// Départements des grands musées interrogés directement, proposés avant l'exposition d'un seul musée (page « Musées ») :
// [identifiant ou nom du département dans le catalogue du musée, libellé]. Archives, bibliothèques et art contemporain
// (protégé par le droit d'auteur) sont laissés de côté.
const DEPARTEMENTS = {
  met: [[11, 'Peintures européennes'], [12, 'Sculpture et arts décoratifs européens'], [9, 'Dessins et estampes'], [19, 'Photographies'],
    [10, 'Art égyptien'], [13, 'Art grec et romain'], [3, 'Art du Proche-Orient ancien'], [14, 'Arts de l\'Islam'], [6, 'Arts d\'Asie'],
    [5, 'Arts d\'Afrique, d\'Océanie et des Amériques'], [17, 'Art médiéval'], [7, 'The Cloisters (art médiéval)'], [1, 'Arts décoratifs américains'],
    [4, 'Armes et armures'], [18, 'Instruments de musique'], [8, 'Mode et costume'], [15, 'Collection Robert Lehman'], [21, 'Art moderne']],
  aic: [['PC-10', 'Peinture et sculpture d\'Europe'], ['PC-9', 'Arts décoratifs d\'Europe'], ['PC-13', 'Estampes et dessins'], ['PC-12', 'Photographie'],
    ['PC-4', 'Arts de la Grèce, de Rome et de Byzance'], ['PC-7', 'Arts d\'Asie'], ['PC-1', 'Arts d\'Afrique'], ['PC-3', 'Arts des Amériques'],
    ['PC-14', 'Textiles'], ['PC-5', 'Architecture et design'], ['PC-11', 'Art moderne']],
  cleveland: [['European Painting and Sculpture', 'Peinture et sculpture européennes'], ['Modern European Painting and Sculpture', 'Peinture et sculpture européennes modernes'],
    ['American Painting and Sculpture', 'Peinture et sculpture américaines'], ['Medieval Art', 'Art médiéval'], ['Greek and Roman Art', 'Art grec et romain'],
    ['Egyptian and Ancient Near Eastern Art', 'Art égyptien et du Proche-Orient ancien'], ['Islamic Art', 'Arts de l\'Islam'], ['Chinese Art', 'Art chinois'],
    ['Japanese Art', 'Art japonais'], ['Korean Art', 'Art coréen'], ['Indian and Southeast Asian Art', 'Art de l\'Inde et de l\'Asie du Sud-Est'],
    ['African Art', 'Art africain'], ['Art of the Americas', 'Art des Amériques'], ['Decorative Art and Design', 'Arts décoratifs et design'],
    ['Textiles', 'Textiles'], ['Drawings', 'Dessins'], ['Prints', 'Estampes']]
};

// Exposition d'un seul musée (page « Musées ») : ses œuvres illustrées et datées, les plus connues d'abord
// (celles qui ont le plus d'articles dans les Wikipédia du monde), sans plafond par lieu puisqu'elles viennent toutes du même musée
function chercherWikidataMusee(c, n) {
  const types = [].concat(...c.ty.map(t => (CLASSES_TYPES[t] || '').split(' ').filter(Boolean)));
  const regionMusee = {};
  Object.keys(MUSEES_MONDE).forEach(r => MUSEES_MONDE[r].forEach(m => { if (!regionMusee[m[0]]) regionMusee[m[0]] = r; }));
  const requete = `SELECT ?i ?iLabel ?m ?mLabel ?date ?img ?typeEn ?createur ?createurLabel ?deces ?origine ?origineLabel ?nat WHERE {
    { SELECT ?i ?img ?date WHERE {
        hint:Query hint:optimizer "None" .
        ?i wdt:P195 wd:${c.musee} ; wdt:P18 ?img ; wdt:P571 ?date ; wikibase:sitelinks ?liens .
        ${types.length ? `?i wdt:P31 ?t . FILTER(?t IN (${types.map(q => 'wd:' + q).join(', ')}))` : ''}
      } ORDER BY ${celebres(c) ? 'DESC(?liens)' : `MD5(CONCAT(STR(?i), "${Math.random().toString(36).slice(2, 8)}"))`} LIMIT ${n * 2} }
    BIND(wd:${c.musee} AS ?m)
    OPTIONAL { ?i wdt:P31 ?type . ?type rdfs:label ?typeEn FILTER(LANG(?typeEn) = "en") }
    OPTIONAL { ?i wdt:P495 ?origine }
    OPTIONAL { ?i wdt:P170 ?createur . OPTIONAL { ?createur wdt:P27 ?nat } OPTIONAL { ?createur wdt:P570 ?deces } }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en,mul". }
  }`;
  return (c.ty.length && !types.length ? Promise.resolve([]) : sparql(requete, 20000)).then(lignes => oeuvresWikidata(lignes, n, {
    lieu: 'mLabel', musee: nom => nom, region: () => regionMusee[c.musee] || null, plafond: n
  }));
}

const ADAPTATEURS = {
  wikidata: {
    nom: 'Musées du monde entier (Wikidata et Wikimedia Commons)',
    poids: 2,
    chercher(c, n) {
      if (c.musee) return chercherWikidataMusee(c, n);
      if (c.artiste || c.mouvement) return chercherWikidataArtisteMouvement(c, n);
      const regionMusee = {};
      Object.keys(MUSEES_MONDE).forEach(r => MUSEES_MONDE[r].forEach(m => { if (m[2] && !regionMusee[m[0]]) regionMusee[m[0]] = r; }));
      const types = [].concat(...c.ty.map(t => (CLASSES_TYPES[t] || '').split(' ').filter(Boolean)));
      const genres = [].concat(...c.th.map(t => (GENRES_THEMES[t] || '').split(' ').filter(Boolean)));
      // Seuls l'architecture ou des thèmes sans équivalent : rien à chercher ici
      if ((c.ty.length && !types.length) || (c.th.length && !genres.length)) return Promise.resolve([]);
      const d = bornesEpoques(c.ep), filtre = d || types.length || genres.length;
      // Une sous-recherche par musée (dix au plus, tirés au hasard), chacune commençant à un endroit tiré au hasard du catalogue
      // Les très grands catalogues (surtout des peintures, dessins et estampes) sont trop lents à parcourir pour un autre type
      // ou un thème précis : on ne les interroge alors que pour la peinture et les dessins
      // (le Musée national de Chine décrit des milliers d'objets sans image : aussi lent qu'un très grand catalogue)
      const grandOk = m => (m[1] <= 3000 && m[0] !== 'Q1074318') || (!genres.length && (!types.length || c.ty.some(t => t === 'Peinture' || t === 'Dessins et estampes')));
      const musees = [...new Map(museesPour(c.region).map(m => [m[0], m])).values()].filter(grandOk).sort(() => Math.random() - 0.5).slice(0, 10);
      if (!musees.length) return Promise.resolve([]);
      const k = Math.max(4, Math.ceil(n * 3 / musees.length));
      const sousRecherche = m => `{ SELECT ?i ?m ?img ?date WHERE {
          VALUES ?m { wd:${m[0]} } ?i wdt:P195 ?m ; wdt:P18 ?img ; wdt:P571 ?date .
          ${d ? `FILTER(YEAR(?date) >= ${d[0]} && YEAR(?date) <= ${d[1]})` : ''}
          ${types.length ? `?i wdt:P31 ?t . FILTER(?t IN (${types.map(q => 'wd:' + q).join(', ')}))` : ''}
          ${genres.length ? `?i wdt:P136 ?g . FILTER(?g IN (${genres.map(q => 'wd:' + q).join(', ')}))` : ''}
          ${celebres(c) ? '?i wikibase:sitelinks ?liens .' : ''}
        } ${celebres(c) ? `ORDER BY DESC(?liens) LIMIT ${k}` /* œuvres célèbres : les plus présentes dans les Wikipédia du monde */
          : `LIMIT ${k} OFFSET ${types.length || genres.length ? 0 : hasard(Math.max(1, (filtre ? Math.min(Math.floor(m[1] / 8), 60) : m[1]) - k))}`} }`;
      // Ordre imposé : d'abord les œuvres de chaque musée, puis les filtres (sinon la recherche peut être très lente)
      const requete = groupe => `SELECT ?i ?iLabel ?m ?mLabel ?date ?img ?typeEn ?createur ?createurLabel ?deces ?origine ?origineLabel ?nat WHERE {
        hint:Query hint:optimizer "None" .
        ${groupe.map(sousRecherche).join(' UNION ')}
        OPTIONAL { ?i wdt:P31 ?type . ?type rdfs:label ?typeEn FILTER(LANG(?typeEn) = "en") }
        OPTIONAL { ?i wdt:P495 ?origine }
        OPTIONAL { ?i wdt:P170 ?createur . OPTIONAL { ?createur wdt:P27 ?nat } OPTIONAL { ?createur wdt:P570 ?deces } }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en,mul". }
      }`;
      // Trois recherches en parallèle : un musée lent ne fait perdre que son propre groupe, pas toute la recherche
      const groupes = [0, 1, 2].map(g => musees.filter((m, i) => i % 3 === g)).filter(l => l.length);
      let panne = null;
      return Promise.all(groupes.map(g => sparql(requete(g), 12000).catch(e => { panne = e; return null; }))).then(listes => {
        if (listes.every(l => l === null)) throw panne || new Error('Wikidata indisponible');
        return [].concat(...listes.filter(Boolean));
      }).then(lignes => oeuvresWikidata(lignes, n, {
        lieu: 'mLabel', musee: nom => nom, region: b => regionMusee[qid(b, 'm')]
      }));
    }
  },
  joconde: {
    nom: 'Musées de France (base Joconde)',
    chercher(c, n) {
      if (c.artiste) return Promise.resolve([]); // couvert par la source Wikidata
      // Mouvement : œuvres de ses artistes conservées dans les musées de France (Orsay, Marmottan, musées de région…)
      if (c.mouvement) return (mouvement(c.mouvement) || {}).region === 'Europe' ? chercherWikidataArtisteMouvement(Object.assign({}, c, { joconde: true }), n) : Promise.resolve([]);
      // Hors d'Europe, la recherche (œuvres des musées de France venues d'Amérique, d'Asie…) prend 30 à 70 secondes à Wikidata
      // pour presque rien trouver, et épuise le quota de calcul du visiteur (les autres recherches Wikidata échouaient ensuite) :
      // ces œuvres viennent des autres sources (Wikidata, musées du monde entier)
      if (c.region && c.region !== 'Europe') return Promise.resolve([]);
      // Œuvres des musées de France reliées dans Wikidata à leur notice Joconde (P347) et illustrées sur Wikimedia Commons.
      // Joconde ne publie pas d'images réutilisables en données ouvertes : l'image vient de Commons, la notice de POP.
      const types = [].concat(...c.ty.map(t => (CLASSES_TYPES[t] || '').split(' ').filter(Boolean)));
      const genres = [].concat(...c.th.map(t => (GENRES_THEMES[t] || '').split(' ').filter(Boolean)));
      if ((c.ty.length && !types.length) || (c.th.length && !genres.length)) return Promise.resolve([]);
      const d = bornesEpoques(c.ep);
      const filtre = d || types.length || genres.length, k = n * 3;
      const requete = decalage => `SELECT ?i ?iLabel ?m ?mLabel ?date ?img ?jc ?typeEn ?createur ?createurLabel ?deces ?origine ?origineLabel ?nat WHERE {
        hint:Query hint:optimizer "None" .
        { SELECT ?i ?img ?date ?jc WHERE {
            ?i wdt:P347 ?jc ; wdt:P18 ?img ; wdt:P571 ?date .
            ${d ? `FILTER(YEAR(?date) >= ${d[0]} && YEAR(?date) <= ${d[1]})` : ''}
            ${types.length ? `?i wdt:P31 ?t . FILTER(?t IN (${types.map(q => 'wd:' + q).join(', ')}))` : ''}
            ${genres.length ? `?i wdt:P136 ?g . FILTER(?g IN (${genres.map(q => 'wd:' + q).join(', ')}))` : ''}
          } LIMIT ${k} OFFSET ${decalage} }
        OPTIONAL { ?i wdt:P195 ?m }
        OPTIONAL { ?i wdt:P31 ?type . ?type rdfs:label ?typeEn FILTER(LANG(?typeEn) = "en") }
        OPTIONAL { ?i wdt:P495 ?origine }
        OPTIONAL { ?i wdt:P170 ?createur . OPTIONAL { ?createur wdt:P27 ?nat } OPTIONAL { ?createur wdt:P570 ?deces } }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en,mul". }
      }`;
      // Départ tiré au hasard pour varier les œuvres ; si la recherche filtrée a moins de résultats, on reprend au début.
      // Au-delà de quelques milliers, Wikidata doit parcourir toutes les notices avant de répondre (24 s pour rien à 20 000)
      const decalage = hasard(filtre ? 200 : 2000);
      return sparql(requete(decalage), 12000).then(l => l.length || !decalage ? l : sparql(requete(0), 12000)).then(lignes => oeuvresWikidata(lignes, n, {
        lieu: 'mLabel', musee: nom => (nom && !/^Q\d+$/.test(nom) ? nom : 'Musée de France'),
        // Sans pays d'origine connu : œuvre supposée européenne (l'essentiel des collections des musées de France)
        region: () => 'Europe', pastille: 'Notice Joconde des musées de France, en direct',
        notice: b => 'notice Joconde (https://pop.culture.gouv.fr/notice/joconde/' + encodeURIComponent(val(b, 'jc')) + ')'
      }));
    }
  },
  patrimoine: {
    nom: 'Patrimoine mondial de l\'UNESCO (Wikidata et Wikimedia Commons)',
    poids: 2,
    chercher(c, n) {
      if (c.artiste || c.mouvement) return Promise.resolve([]);
      // Architecture : monuments inscrits au patrimoine mondial, photographiés sur place
      if ((c.ty.length && !c.ty.includes('Architecture')) || (!c.ty.length && c.th.length)) return Promise.resolve([]);
      const regions = c.region ? [c.region] : REGIONS_HORS_EUROPE.concat('Europe');
      const pays = [].concat(...regions.map(r => PAYS_REGIONS[r].split(' ')));
      const d = bornesEpoques(c.ep), graine = Math.random().toString(36).slice(2, 8);
      // Ordre imposé : d'abord les quelque 2 000 éléments du patrimoine mondial, puis les filtres (sinon la recherche est très lente)
      const liste = l => l.map(q => 'wd:' + q).join(', ');
      const requete = `SELECT ?i ?iLabel ?pays ?paysLabel ?date ?img WHERE {
        hint:Query hint:optimizer "None" .
        ?i wdt:P1435 wd:Q9259 . ?i wdt:P17 ?pays . FILTER(?pays IN (${liste(pays)}))
        ?i wdt:P31 ?cl . FILTER(?cl IN (${liste(CLASSES_ARCHITECTURE.split(' '))}))
        ?i wdt:P18 ?img . ?i wdt:P571 ?date .
        ${d ? `FILTER(YEAR(?date) >= ${d[0]} && YEAR(?date) <= ${d[1]})` : ''}
        BIND(MD5(CONCAT(STR(?i), "${graine}")) AS ?h)
        ${celebres(c) ? '?i wikibase:sitelinks ?liens .' : ''}
        SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en,mul". }
      } ORDER BY ${celebres(c) ? 'DESC(?liens)' : '?h'} LIMIT ${n * 4}`;
      return sparql(requete).then(lignes => oeuvresWikidata(lignes.map(b => Object.assign({ origine: b.pays, origineLabel: b.paysLabel }, b)), n, {
        lieu: 'paysLabel', type: 'Architecture', musee: p => 'Patrimoine mondial de l\'UNESCO, ' + p, region: () => null
      }));
    }
  },
  met: {
    nom: 'The Metropolitan Museum of Art, New York',
    chercher(c, n) {
      const q = motsCles(c).join(' ') || 'art';
      let url = 'https://collectionapi.metmuseum.org/public/collection/v1.1/search?hasImages=true' + (c.artiste ? '&artistOrCulture=true' : '') + '&limit=60&offset=0&q=' + encodeURIComponent(q) +
        (c.departement ? '&departmentId=' + c.departement : '');
      if (c.ep.length) { const d = c.ep.map(e => DATES_EPOQUES[e]); url += '&dateBegin=' + Math.min(...d.map(x => x[0])) + '&dateEnd=' + Math.max(...d.map(x => x[1])); }
      // Œuvres célèbres : d'abord les « œuvres phares » (highlights) du Met, puis les autres si elles ne suffisent pas
      // (pas pour un artiste tapé ou un mouvement : la recherche par mots-clés est déjà ciblée, et les œuvres phares qui
      // contiennent le mot quelque part dans leur fiche sont souvent hors sujet ; mais oui pour chaque artiste d'un mouvement,
      // pour montrer ses chefs-d'œuvre plutôt que ses études et ses éventails)
      const phares = celebres(c) && (!c.artiste || c.mvArtiste) && !c.mouvement ? lireJSON(url.replace('&limit=60', '&limit=100') + '&isHighlight=true').then(r => r.objectIDs || []).catch(() => []) : Promise.resolve([]);
      return phares.then(p => p.length >= n * 2 ? melange(p) : lireJSON(url).then(
        r => melange(p).concat(melange((r.objectIDs || []).filter(i => !p.includes(i)))),
        e => { if (p.length) return melange(p); throw e; })).then(liste => {
        const ids = liste.slice(0, n * 2);
        return Promise.all(ids.map(id => lireJSON('https://collectionapi.metmuseum.org/public/collection/v1/objects/' + id, 8000).catch(() => null)));
      }).then(liste => liste.filter(o => o && o.isPublicDomain && o.primaryImageSmall).slice(0, n).map(o => oeuvre({
        titre: o.title, artiste: o.artistDisplayName, date: o.objectDate, annee: o.objectBeginDate,
        lieu: [o.city, o.country].filter(Boolean).join(', '), culture: o.culture, nationalite: o.artistNationality, indiceRegion: o.department,
        musee: this.nom, image: o.primaryImageSmall, fiche: o.objectURL,
        classification: [o.classification, o.objectName, o.department].join(' ')
      })));
    }
  },
  aic: {
    nom: 'Art Institute of Chicago',
    chercher(c, n) {
      const filtres = [{ term: { is_public_domain: true } }, { exists: { field: 'image_id' } }].concat(c.departement ? [{ term: { department_id: c.departement } }] : []);
      if (c.ep.length) { const d = c.ep.map(e => DATES_EPOQUES[e]); filtres.push({ range: { date_start: { gte: Math.min(...d.map(x => x[0])), lte: Math.max(...d.map(x => x[1])) } } }); }
      // Trois fois plus de fiches que nécessaire si les images de Chicago sont bloquées : seules celles copiées sur Commons servent
      // Œuvres célèbres : celles que Chicago met en avant (is_boosted) ; s'il y en a trop peu, la recherche est refaite sans ce filtre
      return imagesAIC().then(ok => {
        const requete = phares => {
          const r = { query: { bool: { must: phares ? filtres.concat({ term: { is_boosted: true } }) : filtres } }, fields: 'id,title,artist_display,date_display,date_start,place_of_origin,artwork_type_title,classification_title,image_id', limit: ok ? n : n * 3, page: c.premiere || phares ? 1 : 1 + hasard(5) };
          const q = motsCles(c).join(' ');
          if (q) r.q = q;
          return lireJSON('https://api.artic.edu/api/v1/artworks/search?params=' + encodeURIComponent(JSON.stringify(r))).then(x => x.data || []);
        };
        return celebres(c) ? requete(true).then(l => l.length >= n / 2 ? l : requete(false).then(l2 => l.concat(l2.filter(o => !l.some(x => x.id === o.id))))) : requete(false);
      }).then(l => oeuvresAIC(l, n, 400));
    }
  },
  cleveland: {
    nom: 'Cleveland Museum of Art',
    chercher(c, n) {
      // Sans mot-clé (exposition du musée), le tirage se fait dans tout le catalogue : ses premières fiches sont ses chefs-d'œuvre
      const sansMot = !motsCles(c).length;
      const adresse = phares => {
        let url = 'https://openaccess-api.clevelandart.org/api/artworks/?cc0=1&has_image=1&limit=' + n + '&skip=' + (c.premiere || phares ? 0 : hasard(sansMot && !celebres(c) ? 3000 : 40)) + (phares ? '&highlight=1' : '') +
          (c.departement ? '&department=' + encodeURIComponent(c.departement) : '');
        const q = motsCles(c).join(' ');
        if (q) url += '&q=' + encodeURIComponent(q);
        if (c.ep.length) { const d = c.ep.map(e => DATES_EPOQUES[e]); url += '&created_after=' + Math.min(...d.map(x => x[0])) + '&created_before=' + Math.max(...d.map(x => x[1])); }
        return url;
      };
      // Œuvres célèbres : les chefs-d'œuvre signalés par le musée (highlight), complétés par les autres s'il y en a trop peu
      const donnees = celebres(c) ? lireJSON(adresse(true)).then(r => (r.data || []).length >= n / 2 ? r : lireJSON(adresse(false)).then(r2 => ({ data: (r.data || []).concat((r2.data || []).filter(o => !(r.data || []).some(x => x.id === o.id))) })))
        : lireJSON(adresse(false));
      return donnees.then(r => (r.data || []).filter(o => o.images && o.images.web).map(o => oeuvre({
        titre: o.title, artiste: o.creators && o.creators[0] ? o.creators[0].description.split('(')[0].trim() : '', date: o.creation_date,
        annee: o.creation_date_earliest, culture: (o.culture || []).join(', '), indiceRegion: o.department,
        nationalite: o.creators && o.creators[0] ? o.creators[0].description : '',
        musee: this.nom, image: o.images.web.url, fiche: o.url, classification: [o.type, o.department].join(' ')
      })));
    }
  },
  smk: {
    nom: 'SMK – Statens Museum for Kunst, Copenhague',
    chercher(c, n) {
      const q = motsCles(c).join(' ') || '*';
      const url = 'https://api.smk.dk/api/v1/art/search/?keys=' + encodeURIComponent(q) + '&offset=' + (c.premiere ? 0 : hasard(30)) + '&rows=' + (n * 2) + '&filters=%5Bpublic_domain:true%5D,%5Bhas_image:true%5D&lang=en';
      return lireJSON(url).then(r => (r.items || []).filter(o => o.image_thumbnail).slice(0, n).map(o => {
        const titres = o.titles || [], en = titres.find(t => /engelsk|english/i.test(t.language || ''));
        const pd = (o.production_date && o.production_date[0]) || {};
        const artiste = o.production && o.production[0] ? o.production[0].creator : '';
        return oeuvre({
          titre: (en || titres[0] || {}).title || 'Sans titre', langue: en ? 'en' : 'da', artiste, date: pd.period,
          annee: anneeDe(pd.start), lieu: (o.production && o.production[0] && o.production[0].creator_nationality) || 'Europe', indiceRegion: 'Europe',
          musee: this.nom, image: o.image_thumbnail, fiche: 'https://open.smk.dk/artwork/image/' + encodeURIComponent(o.object_number),
          classification: (o.object_names || []).map(x => x.name).join(' ')
        });
      }));
    }
  },
  mia: {
    nom: 'Minneapolis Institute of Art',
    chercher(c, n) {
      const q = motsCles(c).join(' ') || 'art';
      return lireJSON('https://search.artsmia.org/' + encodeURIComponent(q) + '?size=' + (n * 4)).then(r => ((r.hits && r.hits.hits) || []).map(h => h._source)
        .filter(o => o && /public domain/i.test(o.rights_type || '') && o.image === 'valid').sort(() => Math.random() - 0.5).slice(0, n).map(o => oeuvre({
          titre: o.title, artiste: (o.artist || '').replace(/^Artist: /, ''), date: o.dated, annee: anneeDe(o.dated),
          lieu: [o.country, o.continent].filter(Boolean).join(', '), culture: o.culture, musee: this.nom,
          image: 'https://1.api.artsmia.org/' + o.id + '.jpg', fiche: 'https://collections.artsmia.org/art/' + o.id,
          classification: [o.classification, o.object_name, o.medium].join(' ')
        })));
    }
  },
  europeana: {
    nom: 'Europeana',
    actif: () => !!RELAIS,
    chercher(c, n) {
      // Toutes les institutions d'Europeana sont européennes : pour l'Europe, pas de mot de région (« French », « Dutch »…),
      // que les fiches, rédigées dans la langue de chaque musée, contiennent rarement. Hors d'Europe, le mot reste
      // (« Japanese »…) et l'œuvre est rangée dans la région demandée, car le pays indiqué est celui du musée.
      const q = motsCles(Object.assign({}, c, { region: c.region === 'Europe' ? null : c.region })).join(' ') || 'art';
      // Collection thématique « Art » d'Europeana (sinon on reçoit surtout des objets d'ethnographie ou d'archives),
      // œuvres datées seulement, dans les bornes des époques choisies
      const d = bornesEpoques(c.ep);
      const annees = encodeURIComponent('YEAR:[' + (d ? Math.max(d[0], 1) : 1) + ' TO ' + (d ? d[1] : 2100) + ']');
      // Artiste d'un mouvement de peintres : ses seules peintures (« what » : type de l'objet, dans les langues des musées),
      // sinon Europeana renvoie surtout ses gravures et ses dessins
      const peintures = c.mvArtiste && MOUVEMENTS_DE_PEINTURE.has(c.mvArtiste);
      const quoi = peintures ? '&qf=' + encodeURIComponent('what:(painting OR paintings OR peinture OR Gemälde OR schilderij OR maalaus OR målning OR maleri OR pintura OR dipinto)') : '';
      const url = debut => RELAIS + '/europeana?query=' + encodeURIComponent(q) + '&theme=art&qf=' + annees + quoi +
        '&reusability=open&qf=TYPE:IMAGE&qf=RIGHTS:*publicdomain*&media=true&thumbnail=true&rows=' + (n * 3) + '&start=' + (1 + debut) + '&profile=rich';
      // Champs en anglais d'Europeana (type, concepts, description : « painting », « oil on canvas », « drawing »…)
      const enAnglais = o => [o.dcTypeLangAware, o.edmConceptPrefLabelLangAware, o.dcDescriptionLangAware].map(x => (x && x.en) || []).flat().join(' ');
      // Année : champ « year », sinon la période indiquée (« 1840/1850 »)
      const anneeEu = o => anneeDe((o.year || [''])[0]) ?? anneeDe(((o.edmTimespanLabel || [])[0] || {}).def || '');
      // Trois fois plus de fiches que nécessaire, pour en garder au plus un tiers par institution
      const parMusee = {}, plafond = Math.max(2, Math.ceil(n / 3));
      // Recherche d'un artiste : depuis le début (il a souvent peu de fiches, un départ au hasard les manquerait)
      return pageAuHasard(url, c.artiste ? 1 : 50, r => r.items, r => r.totalResults).then(items => items.filter(o => (o.edmIsShownBy || o.edmPreview) && anneeEu(o) !== null)
        .sort(() => Math.random() - 0.5).filter(o => { const m = (o.dataProvider || [''])[0]; parMusee[m] = (parMusee[m] || 0) + 1; return parMusee[m] <= plafond; })
        .slice(0, n).map(o => oeuvre({
          titre: (o.title || ['Sans titre'])[0], langue: o.language && o.language[0] ? o.language[0] : 'en',
          // dcCreator mêle souvent noms et adresses de notices d'autorité (viaf.org…) : on garde le premier nom
          // (sinon le nom de l'« agent » lié à la fiche : « Delacroix, Eugène » au Rijksmuseum)
          artiste: [].concat(o.dcCreator || []).find(x => !/^https?:/.test(x) && !/_person$/.test(x)) || ((o.edmAgentLabel || [])[0] || {}).def || '',
          date: (o.year || [''])[0] || ((o.edmTimespanLabel || [])[0] || {}).def || '', annee: anneeEu(o),
          lieu: (o.country || [''])[0], regions: c.region ? [c.region] : undefined, musee: ((o.dataProvider || ['Europeana'])[0]) + ' (via Europeana)',
          image: (o.edmPreview || o.edmIsShownBy)[0], fiche: o.guid,
          // Type d'œuvre d'après la fiche ; sans indication, une œuvre trouvée par la recherche de peintures en est une
          classification: [].concat(o.dcType || []).join(' ') + ' ' + enAnglais(o) + ' ' + q,
          type: peintures && typeDe([].concat(o.dcType || []).join(' ') + ' ' + enAnglais(o)) === 'Autre' ? 'Peinture' : undefined
        })));
    }
  },

  smithsonian: {
    nom: 'Smithsonian Institution, Washington',
    actif: () => !!RELAIS,
    chercher(c, n) {
      // Seulement les musées d'art du Smithsonian (sinon la recherche ramène surtout des objets d'histoire naturelle)
      const musees = '(' + Object.keys(MUSEES_SMITHSONIAN).map(u => 'unit_code:' + u).join(' OR ') + ')';
      const q = (motsCles(c).join(' ') || 'art') + ' AND ' + musees + ' AND online_media_type:"Images"';
      const url = debut => RELAIS + '/smithsonian?q=' + encodeURIComponent(q) + '&rows=' + (n * 2) + '&start=' + debut;
      return pageAuHasard(url, 40, r => r.response && r.response.rows, r => r.response && r.response.rowCount).then(rows => rows.map(o => {
        const c2 = o.content || {}, media = c2.descriptiveNonRepeating && c2.descriptiveNonRepeating.online_media && c2.descriptiveNonRepeating.online_media.media && c2.descriptiveNonRepeating.online_media.media[0];
        if (!media || !media.usage || media.usage.access !== 'CC0') return null;
        const ind = c2.indexedStructured || {}, unite = MUSEES_SMITHSONIAN[o.unitCode];
        return oeuvre({
          titre: o.title, artiste: ind.name ? ind.name[0] : '', date: ind.date ? ind.date[0] : '', annee: anneeDe(ind.date ? ind.date[0] : ''),
          lieu: ind.geoLocation && ind.geoLocation[0] && ind.geoLocation[0].L2 ? ind.geoLocation[0].L2.content : '',
          culture: (ind.culture || []).join(', '), indiceRegion: unite ? unite[1] : '',
          musee: unite ? unite[0] + ' (Smithsonian)' : this.nom, image: media.thumbnail || media.content,
          fiche: (c2.descriptiveNonRepeating.record_link || 'https://www.si.edu/'), classification: (ind.object_type || []).join(' ')
        });
      }).filter(Boolean).slice(0, n));
    }
  }
};

// Recherche dans tous les catalogues en même temps ; un catalogue en panne n'empêche pas les autres de répondre
// (seulement : liste facultative des catalogues à interroger, par exemple ceux qui savent chercher par mots-clés)
// Raison d'une panne, affichée au visiteur à côté du catalogue indisponible (aide au diagnostic)
function raisonPanne(e) {
  const m = String((e && e.message) || '');
  if (e && e.name === 'AbortError') return 'délai de réponse dépassé';
  if (/429|en pause/.test(m)) return 'trop de demandes, réessayez dans quelques minutes';
  if (/HTTP 5\d\d/.test(m)) return 'service en panne';
  if (/HTTP 4\d\d/.test(m)) return 'demande refusée';
  if (/inaccessibles|Failed to fetch|NetworkError|Load failed/i.test(m) || (e && e.name === 'TypeError')) return 'connexion impossible ou refusée';
  return '';
}
function chercherDansLesMusees(criteres, parSource, seulement) {
  // Le patrimoine mondial (monuments) n'a pas d'artistes ni de mouvements : il n'est pas interrogé (ni cité « sans œuvre »)
  const horsSujet = k => k === 'patrimoine' && ((criteres.mv || []).length || criteres.artiste);
  const sources = Object.keys(ADAPTATEURS).filter(k => (!seulement || seulement.includes(k)) && (!ADAPTATEURS[k].actif || ADAPTATEURS[k].actif()) && !horsSujet(k));
  // Une recherche par région choisie (trois au plus), sinon une seule recherche sans région
  const regions = criteres.rg.length ? criteres.rg.slice(0, 3) : [null];
  // Mouvements choisis : une recherche par mouvement (trois au plus), combinée aux régions (quatre recherches au plus en tout)
  const mvts = criteres.mv && criteres.mv.length ? criteres.mv.slice(0, 3) : [null];
  let combinaisons = [].concat(...mvts.map(mouvement => regions.map(region => ({ region, mouvement })))).slice(0, 4);
  // Une seule région, sans mouvement ni artiste : les catalogues qui cherchent par mots-clés sont interrogés avec trois mots
  // de culture différents (« Mexican », « Peruvian », « Native American »…), sinon toute l'exposition venait d'une seule culture.
  // Les autres sources (Wikidata…) cherchent déjà dans toute la région : une seule recherche pour elles.
  const varier = regions.length === 1 && regions[0] && !mvts[0] && !criteres.artiste;
  if (varier) combinaisons = (MOTS_RECHERCHE_REGIONS[regions[0]] || []).slice().sort(() => Math.random() - 0.5).slice(0, 3)
    .map(motRegion => ({ region: regions[0], mouvement: null, motRegion }));
  const parMotsCles = k => CATALOGUES_MOTS_CLES.includes(k) || k === 'europeana';
  // Mouvements : les catalogues qui cherchent par mots-clés sont interrogés par nom d'artiste (ceux du mouvement, d'après la
  // liste MOUVEMENTS et Wikidata), plutôt qu'avec le nom du mouvement, que leurs fiches donnent rarement (« Impressionism »
  // trouvait aussi des « impressions » de pièces de monnaie). Chaque œuvre gardée doit être de cet artiste et dater de la
  // période du mouvement. Les mouvements sans artistes connus (œuvres anonymes) gardent la recherche par mots-clés.
  const parArtistes = mvts[0] ? Promise.all(mvts.map(m => nomsArtistesMouvement(mouvement(m)))) : Promise.resolve([]);
  return parArtistes.then(nomsParMv => {
    const combinaisonsArtistes = [].concat(...mvts.map((m, i) => (nomsParMv[i] || []).slice(0, Math.max(2, Math.floor(8 / mvts.length)))
      .map(nom => ({ region: regions[0], mouvement: null, artiste: nom, mvArtiste: m }))));
    const combinaisonsDe = k => varier && !parMotsCles(k) ? combinaisons.slice(0, 1).map(co => ({ region: co.region, mouvement: null }))
      : parMotsCles(k) && combinaisonsArtistes.length ? combinaisonsArtistes.concat(combinaisons.filter(co => !(nomsParMv[mvts.indexOf(co.mouvement)] || []).length))
      : combinaisons;
    // (avec trois mots, un peu plus d'œuvres par recherche : celles qui ne correspondent pas aux choix sont écartées ensuite)
    const nDe = k => Math.max(4, Math.round((parSource || 8) * (varier && parMotsCles(k) ? 1.5 : 1) / combinaisonsDe(k).length));
    const chercherCombinaison = (k, co) => ADAPTATEURS[k].chercher(Object.assign({}, criteres, co), nDe(k) * (ADAPTATEURS[k].poids || 1)).then(l => {
      if (!co.mvArtiste) return l;
      const periode = periodeMouvement(mouvement(co.mvArtiste));
      return l.filter(w => deLArtiste(w, co.artiste) === 2 && (!periode || w.year === null || w.year === undefined || (w.year >= periode[0] && w.year <= periode[1])));
    });
    return Promise.all(sources.map(k => Promise.all(combinaisonsDe(k).map(co => chercherCombinaison(k, co).catch(e => ({ panne: e }))))
      .then(listes => ({ source: ADAPTATEURS[k].nom, liste: [].concat(...listes.filter(Array.isArray)), ok: listes.some(Array.isArray),
        raison: listes.some(Array.isArray) ? '' : raisonPanne((listes.find(l => l && l.panne) || {}).panne) }))))
      .then(resultats => {
        const vus = registreOeuvres(), oeuvres = [];
        // Les catalogues sont pris à tour de rôle, pour que chaque institution soit représentée
        const alternees = [];
        for (let k = 0; resultats.some(r => k < r.liste.length); k++) resultats.forEach(r => { if (k < r.liste.length) alternees.push([r.liste[k], r.source]); });
        // Une même œuvre peut venir de deux sources sous deux titres (« Rue de Paris, temps de pluie » dans Wikidata,
        // « Paris Street; Rainy Day » à Chicago) : même fiche Wikidata, ou même artiste, même année et même musée dans deux
        // sources différentes (dans une même source, ce sont souvent des œuvres différentes : une série d'estampes de la même année)
        const qids = new Set(), parSourceVue = new Map(), oeuvreDeCle = new Map();
        const nomDeFamille = w => cleNom(w.artist);
        // Mouvements choisis : l'œuvre doit dater de leur période (une fiche Wikidata peut porter deux dates, dont une fausse)
        const periodesMv = (criteres.mv || []).map(m => periodeMouvement(mouvement(m))).filter(Boolean);
        const ailleurs = (criteres.mv || []).length && !criteres.artiste ? maitresDAilleurs(criteres.mv) : new Set();
        const cleMusee = w => [nomDeFamille(w), w.year,
          sansAccents(w.museum).replace(/^the\s+/, '').split(',')[0].trim()].join('|');
        // Recherche par artiste : si des œuvres correspondent sûrement au nom tapé, celles d'homonymes probables sont écartées
        const sur = criteres.artiste && alternees.some(w => deLArtiste(w, criteres.artiste) === 2);
        // Mouvements choisis : une œuvre d'une autre région n'en fait pas partie (une affiche française citant l'ukiyo-e…)
        const regionsMv = (criteres.mv || []).map(m => (mouvement(m) || {}).region).filter(Boolean);
        const peinturesSeulement = !criteres.ty.length && (criteres.mv || []).length && criteres.mv.every(m => MOUVEMENTS_DE_PEINTURE.has(m));
        alternees.forEach(([w, source]) => {
          const cm = w.artist && w.year ? cleMusee(w) : '';
          if (!w.title || vus.vue(w) || !w.epoch) return;
          if (w.qid && qids.has(w.qid)) return;
          if (cm && parSourceVue.has(cm) && parSourceVue.get(cm) !== source) { const x = oeuvreDeCle.get(cm); x.renom = Math.max(x.renom, w.renom); return; }
          if (periodesMv.length && typeof w.year === 'number' && !periodesMv.some(pe => w.year >= pe[0] && w.year <= pe[1])) return;
          if (ailleurs.has(nomDeFamille(w))) return;
          // On applique les choix du visiteur aux fiches reçues (les catalogues ne savent pas tous filtrer)
          if (criteres.ep.length && !criteres.ep.includes(w.epoch)) return;
          if (criteres.rg.length && !w.regions.some(x => criteres.rg.includes(x))) return;
          if (criteres.ty.length && !w.types.some(x => criteres.ty.includes(x))) return;
          if (peinturesSeulement && !w.types.includes('Peinture')) return;
          // « Les plus célèbres » : pas d'esquisses ni d'études préparatoires, qui ne sont pas les chefs-d'œuvre d'un artiste
          // (sauf celles de Léonard de Vinci, célèbres en elles-mêmes, et si le visiteur a choisi « Dessins et estampes »)
          if (celebres(criteres) && !criteres.ty.includes('Dessins et estampes') && ESQUISSE.test(sansAccents(w.title)) && !/leonard/.test(sansAccents(w.artist))) return;
          if (criteres.artiste && deLArtiste(w, criteres.artiste) < (sur ? 2 : 1)) return;
          if (regionsMv.length && w.regions.length && !w.regions.some(x => regionsMv.includes(x))) return;
          // Recherche par artiste : les catalogues renvoient surtout des gravures (Rembrandt, Dürer…) ; trois au plus,
          // pour laisser la place aux peintures, sauf si le visiteur a choisi « Dessins et estampes »
          // De même pour un mouvement qui n'est pas d'abord un art de l'estampe (pas l'ukiyo-e ni l'expressionnisme) : la Renaissance
          // ne doit pas se résumer aux gravures de Dürer
          const estampesLimitees = criteres.artiste || ((criteres.mv || []).length && !criteres.mv.some(m => MOUVEMENTS_D_ESTAMPES.has(m)));
          if (estampesLimitees && !criteres.ty.length && w.types.includes('Dessins et estampes') && oeuvres.filter(x => x.types.includes('Dessins et estampes')).length >= 3) return;
          vus.ajouter(w); oeuvres.push(w);
          if (w.qid) qids.add(w.qid);
          if (cm && !parSourceVue.has(cm)) { parSourceVue.set(cm, source); oeuvreDeCle.set(cm, w); }
        });
        // Mouvement choisi : les artistes sont pris à tour de rôle, pour que l'exposition montre tout le mouvement.
        // « Les plus célèbres » : les grands maîtres d'abord (artistes de référence du mouvement, liste MOUVEMENTS, classés
        // par la notoriété de leurs œuvres), sept œuvres chacun pour les quatre premiers, quatre pour les autres, leurs
        // chefs-d'œuvre en tête ; deux pour les artistes que Wikidata rattache aussi au mouvement (Gauguin, Waterhouse…).
        // « Découvertes » : cinq chacun
        if ((criteres.mv || []).length && !criteres.artiste) {
          // Artistes reconnus par leur nom de famille (« Auguste Renoir » dans Wikidata, « Pierre-Auguste Renoir » à Chicago),
          // les écritures d'un même maître étant réunies (« Michel-Ange » dans Wikidata, « Michelangelo » au Met)
          const alias = new Map([].concat(...criteres.mv.map(m => [...clesMaitres(mouvement(m))])));
          const maitres = new Set(alias.values()), cleArtiste = w => alias.get(nomDeFamille(w)) || nomDeFamille(w);
          const parArtiste = new Map();
          // Les œuvres anonymes (tapisseries, sculptures du Moyen Âge…) et les monuments qui ne sont pas d'un maître de la liste
          // (Notre-Dame de Paris, Chartres : leurs architectes ne sont pas des « artistes » du mouvement) forment un groupe à
          // part, avec dix places
          const groupeDe = w => { const a = cleArtiste(w); return a && (maitres.has(a) || !w.types.includes('Architecture')) ? a : ' anonyme'; };
          oeuvres.forEach(w => { const a = groupeDe(w); if (!parArtiste.has(a)) parArtiste.set(a, []); parArtiste.get(a).push(w); });
          let groupes = [...parArtiste.values()], rangs = [];
          const celebre = celebres(criteres);
          if (celebre) {
            groupes.forEach(g => g.sort((a, b) => b.renom - a.renom));
            const score = g => g.slice(0, 3).reduce((t, w) => t + w.renom, 0); // ses trois œuvres les plus connues
            groupes = groupes.map((g, i) => ({ g, i, ref: groupeDe(g[0]) === ' anonyme' || maitres.has(cleArtiste(g[0])) })).sort((a, b) => (b.ref - a.ref) || (score(b.g) - score(a.g)) || (a.i - b.i));
            rangs = groupes.map(x => x.ref); groupes = groupes.map(x => x.g);
          }
          // (liste de référence courte, moins de six maîtres : ukiyo-e… : les autres artistes du mouvement gardent toute leur place)
          const listeComplete = maitres.size >= 6;
          const anonymes = groupes.map(g => groupeDe(g[0]) === ' anonyme');
          const plafond = i => groupes.length < 4 ? Infinity : anonymes[i] ? (celebre ? 10 : 5) : !celebre ? 5 : !listeComplete ? (i < 4 ? 7 : 3) : !rangs[i] ? 2 : i < 4 ? 7 : 4;
          const equilibrees = [];
          for (let k = 0; groupes.some((g, i) => k < Math.min(g.length, plafond(i))); k++) groupes.forEach((g, i) => { if (k < Math.min(g.length, plafond(i))) equilibrees.push(g[k]); });
          // et trois œuvres au plus, en tout, de ces autres artistes (Mondrian, Matisse… pour le postimpressionnisme)
          const autres = new Set(celebre && listeComplete ? [].concat(...groupes.filter((g, i) => !rangs[i])) : []);
          let nAutres = 0;
          oeuvres.splice(0, oeuvres.length, ...equilibrees.filter(w => !autres.has(w) || ++nAutres <= 3));
        }
        return { oeuvres, sources: resultats.map(r => ({ nom: r.source, ok: r.ok, nombre: r.liste.length, raison: r.raison })) };
      });
  });
}

// ---------- Expositions spéciales : œuvres par lien et règle des pays ----------
// Pays (ou territoire) d'une œuvre, reconnu dans son lieu, sa culture ou la nationalité de l'artiste, en français ou en anglais.
// Le texte est comparé sans accents et en minuscules. L'ordre compte : les noms les plus précis d'abord
// (« Polynésie » avant « français », « Papouasie-Nouvelle-Guinée » avant « Guinée », « Amérindien » avant « Inde »).
// [nom affiché, continent, expression reconnue]
const PAYS_OEUVRES = [
  ['Polynésie française', 'Océanie', /\b(polynesie francaise|french polynesia|tahiti|marquesas|marquises)/],
  ['Nouvelle-Calédonie', 'Océanie', /\b(nouvelle-caledonie|new caledonia|kanak)/],
  ['Papouasie-Nouvelle-Guinée', 'Océanie', /\b(papouasie|papua|new guinea|nouvelle-guinee|sepik|asmat|massim)/],
  ['Nouvelle-Zélande', 'Océanie', /\b(nouvelle-zelande|new zealand|maori|aotearoa)/],
  ['Australie', 'Océanie', /\b(australi|aborigin|new south wales)/],
  ['Hawaï', 'Océanie', /\b(hawai)/],
  ['Fidji', 'Océanie', /\b(fidji|fiji)/],
  ['Samoa', 'Océanie', /\bsamoa/],
  ['Tonga', 'Océanie', /\btonga/],
  ['Vanuatu', 'Océanie', /\b(vanuatu|new hebrides|nouvelles-hebrides)/],
  ['Îles Salomon', 'Océanie', /\b(iles salomon|solomon islands)/],
  ['Canada', 'Amériques', /\b(canad|quebec|inuit|haida|kwakwaka|kwakiutl)/],
  ['États-Unis', 'Amériques', /\b(native american|american indian|amerindien|navajo|dine\b|hopi|lakota|sioux|cheyenne|apache|pueblo|zuni|tlingit|cherokee|iroquois|ojibwe|new mexico|nouveau-mexique|arizona|alaska)/],
  ['Mexique', 'Amériques', /\b(mexi|azte|olmec|olmeque|maya|mixtec|mixteque|zapotec|zapoteque|teotihuacan|toltec|huastec|veracruz|oaxaca|colima|jalisco|nayarit)/],
  ['Guatemala', 'Amériques', /\bguatemal/],
  ['El Salvador', 'Amériques', /\b(el salvador|salvadori)/],
  ['Honduras', 'Amériques', /\bhonduras/],
  ['Nicaragua', 'Amériques', /\bnicaragua/],
  ['Costa Rica', 'Amériques', /\bcosta rica/],
  ['Panama', 'Amériques', /\bpanama/],
  ['Cuba', 'Amériques', /\bcuba/],
  ['Haïti', 'Amériques', /\bhaiti/],
  ['Jamaïque', 'Amériques', /\b(jamaica|jamaique)/],
  ['Porto Rico', 'Amériques', /\b(puerto rico|porto rico)/],
  ['Colombie', 'Amériques', /\b(colombi|muisca|quimbaya|tairona)/],
  ['Venezuela', 'Amériques', /\bvenezuel/],
  ['Équateur', 'Amériques', /\b(equateur|ecuador)/],
  ['Pérou', 'Amériques', /\b(perou|peru\b|peruvian|inca\b|incan|moche\b|nazca|nasca|wari\b|huari|chimu\b|paracas|chavin|chancay|lambayeque|recuay)/],
  ['Bolivie', 'Amériques', /\b(bolivi|tiwanaku)/],
  ['Chili', 'Amériques', /\b(chili\b|chile|mapuche)/],
  ['Argentine', 'Amériques', /\bargentin/],
  ['Brésil', 'Amériques', /\b(bresil|brazil)/],
  ['États-Unis', 'Amériques', /\b(etats-unis|united states|american|americain|new york|boston|philadelphi|pennsylvani|massachusetts|chicago|new jersey|new england|connecticut|virginia|maryland|ohio|louisiana|texas|california)/],
  ['Afrique du Sud', 'Afrique', /\b(afrique du sud|south africa|zulu|xhosa)/],
  ['Égypte', 'Afrique', /\b(egypt|egypte|copt|pharaon|thebes|amarna|faiyum|fayoum|alexandri|mamluk|mamelouk|fatimid)/],
  ['Éthiopie', 'Afrique', /\b(ethiopi|amhara|tigray|abyssin)/],
  ['Érythrée', 'Afrique', /\b(erythre|eritre)/],
  ['Soudan', 'Afrique', /\b(soudan|sudan|nubia|nubie|kerma|meroe)/],
  ['Nigeria', 'Afrique', /\b(nigeri|yoruba|igbo|benin city|kingdom of benin|royaume du benin|ife\b|nok\b|hausa|urhobo|ijo\b)/],
  ['Bénin', 'Afrique', /\b(benin|dahomey|fon\b)/],
  ['Ghana', 'Afrique', /\b(ghana|asante|ashanti|akan\b)/],
  ["Côte d'Ivoire", 'Afrique', /\b(cote d.ivoire|ivory coast|baule|baoule|senufo|senoufo|guro\b|gouro)/],
  ['Mali', 'Afrique', /\b(mali\b|dogon|bamana|bambara|djenne|jenne)/],
  ['Burkina Faso', 'Afrique', /\b(burkina|mossi|lobi\b)/],
  ['Guinée', 'Afrique', /\b(guinee|guinea|baga\b)/],
  ['Sierra Leone', 'Afrique', /\b(sierra leone|mende\b|sherbro)/],
  ['Liberia', 'Afrique', /\bliberi/],
  ['Sénégal', 'Afrique', /\b(senegal|wolof)/],
  ['Cameroun', 'Afrique', /\b(cameroun|cameroon|bamileke|bamum|grassfields)/],
  ['Gabon', 'Afrique', /\b(gabon|punu\b|kota\b)/],
  ['République démocratique du Congo', 'Afrique', /\b(congo|kongo|kuba\b|luba\b|songye|pende\b|yaka\b|lega\b|mangbetu|zaire)/],
  ['Angola', 'Afrique', /\b(angola|chokwe)/],
  ['Zimbabwe', 'Afrique', /\b(zimbabwe|shona)/],
  ['Mozambique', 'Afrique', /\bmozambi/],
  ['Tanzanie', 'Afrique', /\b(tanzani|zanzibar|makonde)/],
  ['Kenya', 'Afrique', /\b(kenya|swahili|maasai|masai)/],
  ['Madagascar', 'Afrique', /\b(madagascar|malagasy|malgache)/],
  ['Maroc', 'Afrique', /\b(maroc|morocc)/],
  ['Algérie', 'Afrique', /\b(algeri|alger\b)/],
  ['Tunisie', 'Afrique', /\b(tunisi|carthag|kairouan)/],
  ['Libye', 'Afrique', /\b(libye|libya)/],
  ['Afghanistan', 'Asie', /\b(afghan|herat|gandhara|bactria)/],
  ['Ouzbékistan', 'Asie', /\b(ouzbek|uzbek|boukhara|bukhara|samarcande|samarkand|khiva)/],
  ['Iran', 'Asie', /\b(iran|persia|persan|perse\b|isfahan|ispahan|tabriz|shiraz|safavid|qajar|sasanian|sassanide|achaemenid|achemenide|timurid|timouride)/],
  ['Irak', 'Asie', /\b(irak|iraq|mesopotami|assyri|babylon|sumer|baghdad|bagdad|mosul|nimrud)/],
  ['Syrie', 'Asie', /\b(syri|damas|palmyr|aleppo|alep\b|raqqa)/],
  ['Liban', 'Asie', /\b(liban|lebanon|phenici|beyrouth|beirut)/],
  ['Israël', 'Asie', /\b(israel|jerusalem|palestin|judea|judee)/],
  ['Jordanie', 'Asie', /\b(jordani|jordan\b|petra)/],
  ['Arménie', 'Asie', /\b(armeni|armenian|erevan|yerevan|cilicie arm|cilician arm)/],
  ['Turquie', 'Asie', /\b(turquie|turkey|turkish|turc\b|turque|ottoman|anatoli|istanbul|constantinople|iznik|bursa)/],
  ['Arabie saoudite', 'Asie', /\b(arabie|arabia|saudi|mecca|la mecque)/],
  ['Yémen', 'Asie', /\byemen/],
  ['Pakistan', 'Asie', /\b(pakistan|lahore|mohenjo|indus\b)/],
  ['Népal', 'Asie', /\b(nepal|kathmandu|newar\b)/],
  ['Sri Lanka', 'Asie', /\b(sri lanka|ceylan|ceylon)/],
  ['Bangladesh', 'Asie', /\bbangladesh/],
  ['Inde', 'Asie', /\b(inde\b|india\b|indian|indien|mughal|moghol|rajput|rajasthan|deccan|tamil|chola|kerala|bengal|delhi|agra\b|kangra|pahari|basohli|mewar|mysore|gujarat|orissa|odisha)/],
  ['Cambodge', 'Asie', /\b(cambodg|cambodia|khmer|angkor)/],
  ['Thaïlande', 'Asie', /\b(thailand|thai\b|siam|ayutthaya|sukhothai)/],
  ['Viêt Nam', 'Asie', /\b(vietnam|viet nam|dong son|champa)/],
  ['Indonésie', 'Asie', /\b(indonesi|java\b|javanese|javanais|bali\b|balinese|sumatra)/],
  ['Birmanie', 'Asie', /\b(birmanie|myanmar|burm|bagan)/],
  ['Laos', 'Asie', /\blaos/],
  ['Philippines', 'Asie', /\b(philippin|luzon)/],
  ['Malaisie', 'Asie', /\b(malaisie|malaysia)/],
  ['Japon', 'Asie', /\b(japon|japan|edo period|meiji|kyoto|tokyo|ukiyo|heian|kamakura|muromachi|momoyama)/],
  ['Corée', 'Asie', /\b(coree|korea|joseon|goryeo|silla)/],
  ['Tibet', 'Asie', /\b(tibet|lhasa)/],
  ['Mongolie', 'Asie', /\bmongol/],
  ['Taïwan', 'Asie', /\b(taiwan|formose)/],
  ['Chine', 'Asie', /\b(chine|china|chinese|chinois|ming\b|qing\b|tang dynasty|song dynasty|han dynasty|yuan dynasty|beijing|pekin|jingdezhen)/],
  ['Chypre', 'Europe', /\b(chypre|cyprus|cypriot)/],
  ['Royaume-Uni', 'Europe', /\b(angleterre|england|english|anglais|britain|british|britannique|royaume-uni|united kingdom|london|londres|ecosse|scotland|scottish|wales|gallois)/],
  ['Irlande', 'Europe', /\b(irlande|ireland|irish)/],
  ['Belgique', 'Europe', /\b(belgi|flemish|flamand|flandre|flanders|brussels|bruxelles|antwerp|anvers|bruges|pays-bas du sud|southern netherlands)/],
  ['Pays-Bas', 'Europe', /\b(pays-bas|netherland|dutch|neerlandais|hollan|amsterdam|delft|haarlem|utrecht|leiden)/],
  ['France', 'Europe', /\b(france|french|francais|paris|lyon|giverny|provence|normand|limoges|bretagne|brittany|le havre)/],
  ['Allemagne', 'Europe', /\b(allemagne|germany|german|allemand|prussia|bavaria|berlin|munich|nuremberg|dresden|saxony)/],
  ['Autriche', 'Europe', /\b(autriche|austria|vienna)/],
  ['Suisse', 'Europe', /\b(suisse|switzerland|swiss|geneve|geneva|zurich|basel)/],
  ['Roumanie', 'Europe', /\b(roumani|romania)/],
  ['Italie', 'Europe', /\b(itali|italy|rome\b|roman\b|romain|venise|venice|venetian|florence|florentin|milan|naples|siena|sienne|etrus|pompei|boscoreale|tuscan|toscan|lombard|bologna|genoa)/],
  ['Espagne', 'Europe', /\b(espagne|spain|spanish|espagnol|madrid|seville|toledo|andalus|catalan)/],
  ['Portugal', 'Europe', /\b(portugal|portugu|lisbon|lisbonne)/],
  ['Grèce', 'Europe', /\b(grece|greece|greek|grec\b|grecque|athen|attic\b|corinth|cycladic|cycladique|minoan|minoen|mycen|crete|hellenisti)/],
  ['Danemark', 'Europe', /\b(danemark|denmark|danish|danois|copenhag)/],
  ['Suède', 'Europe', /\b(suede|sweden|swedish|suedois|stockholm)/],
  ['Norvège', 'Europe', /\b(norvege|norway|norwegian)/],
  ['Finlande', 'Europe', /\b(finland|finnish)/],
  ['Islande', 'Europe', /\b(islande|iceland)/],
  ['Pologne', 'Europe', /\b(pologne|poland|polish\b|polonais|krakow|cracovie)/],
  ['Russie', 'Europe', /\b(russi|moscow|moscou|novgorod|petersburg)/],
  ['Ukraine', 'Europe', /\b(ukrain|kyiv|kiev)/],
  ['Tchéquie', 'Europe', /\b(tchequ|czech|bohemi|prague)/],
  ['Hongrie', 'Europe', /\b(hongri|hungar|budapest)/],
  ['Slovaquie', 'Europe', /\b(slovaqu|slovak|bratislava)/],
  ['Croatie', 'Europe', /\bcroati/],
  ['Serbie', 'Europe', /\bserbi/],
  ['Bulgarie', 'Europe', /\bbulgari/]
];
function sansAccents(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
// Renvoie { nom, continent } ou null si aucun pays n'est reconnu.
// Un texte « lieu | culture | nationalité » est examiné morceau par morceau : le lieu indiqué l'emporte sur la culture.
function paysDe(texte) {
  for (const morceau of String(texte || '').split(' | ')) {
    const s = sansAccents(morceau);
    const p = s && PAYS_OEUVRES.find(x => x[2].test(s));
    if (p) return { nom: p[0], continent: p[1] };
  }
  return null;
}

// Œuvre lue à partir du lien de sa fiche au musée (Met, Art Institute of Chicago, Cleveland, Wikidata).
// Renvoie null si le lien n'est pas reconnu, si l'œuvre n'est pas dans le domaine public ou n'a pas d'image.
function oeuvreParLien(lien) {
  const u = String(lien || '').trim();
  let m;
  if ((m = u.match(/metmuseum\.org\/art\/collection\/search\/(\d+)/))) {
    return lireJSON('https://collectionapi.metmuseum.org/public/collection/v1/objects/' + m[1]).then(o => o && o.isPublicDomain && (o.primaryImageSmall || o.primaryImage) ? oeuvre({
      titre: o.title, artiste: o.artistDisplayName, date: o.objectDate, annee: o.objectBeginDate,
      lieu: [o.city, o.country].filter(Boolean).join(', '), culture: o.culture, nationalite: o.artistNationality, indiceRegion: o.department,
      musee: ADAPTATEURS.met.nom, image: o.primaryImageSmall || o.primaryImage, fiche: o.objectURL || u,
      classification: [o.classification, o.objectName, o.department].join(' ')
    }) : null);
  }
  if ((m = u.match(/artic\.edu\/artworks\/(\d+)/))) {
    return lireJSON('https://api.artic.edu/api/v1/artworks/' + m[1] + '?fields=id,title,artist_display,date_display,date_start,place_of_origin,artwork_type_title,classification_title,image_id,is_public_domain')
      .then(r => { const o = r && r.data; return o && o.is_public_domain ? oeuvresAIC([o], 1, 843) : []; }).then(l => l[0] || null);
  }
  if ((m = u.match(/clevelandart\.org\/art\/([^/?#]+)/))) {
    return lireJSON('https://openaccess-api.clevelandart.org/api/artworks/' + encodeURIComponent(m[1])).then(r => {
      const o = r && r.data;
      return o && o.share_license_status === 'CC0' && o.images && o.images.web ? oeuvre({
        titre: o.title, artiste: o.creators && o.creators[0] ? o.creators[0].description.split('(')[0].trim() : '', date: o.creation_date,
        annee: o.creation_date_earliest, culture: (o.culture || []).join(', '), indiceRegion: o.department,
        nationalite: o.creators && o.creators[0] ? o.creators[0].description : '',
        musee: ADAPTATEURS.cleveland.nom, image: o.images.web.url, fiche: o.url || u, classification: [o.type, o.department].join(' ')
      }) : null;
    });
  }
  if ((m = u.match(/wikidata\.org\/(?:wiki|entity)\/(Q\d+)/))) {
    const requete = `SELECT ?i ?iLabel ?m ?mLabel ?date ?img ?typeEn ?createur ?createurLabel ?deces ?origine ?origineLabel ?nat WHERE {
      VALUES ?i { wd:${m[1]} } ?i wdt:P18 ?img .
      OPTIONAL { ?i wdt:P571 ?date } OPTIONAL { ?i wdt:P195 ?m }
      OPTIONAL { ?i wdt:P31 ?type . ?type rdfs:label ?typeEn FILTER(LANG(?typeEn) = "en") }
      OPTIONAL { ?i wdt:P495 ?origine }
      OPTIONAL { ?i wdt:P170 ?createur . OPTIONAL { ?createur wdt:P27 ?nat } OPTIONAL { ?createur wdt:P570 ?deces } }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en,mul". }
    } LIMIT 20`;
    return sparql(requete, 12000).then(lignes => oeuvresWikidata(lignes, 1, {
      lieu: 'mLabel', musee: nom => (nom && !/^Q\d+$/.test(nom) ? nom : 'Wikidata'), region: () => null
    })).then(l => l[0] || null);
  }
  return Promise.resolve(null);
}

// Complète une exposition spéciale avec des œuvres de pays qui n'y sont pas encore représentés.
// options : mots (mots-clés), regions et epoques (facultatifs), dejaPays (noms de pays déjà présents), manque (nombre de pays à ajouter),
// exclure (facultatif : sites d'images qui ne se chargent pas chez le visiteur, dont les œuvres sont écartées).
// surAjout(oeuvre) est appelé dès qu'une œuvre d'un pays nouveau est trouvée : l'exposition se remplit au fur et à mesure.
// Chaque catalogue est interrogé séparément, région par région, et ses réponses sont prises dès qu'elles arrivent.
// Les demandes partent par petits groupes (quatre recherches à la fois, une seule pour Wikidata, qui envoie trois requêtes par recherche et refuse plus de cinq requêtes
// simultanées par visiteur) : envoyées toutes ensemble, elles échouaient en grande partie (délais dépassés, refus).
// - catalogues qui savent chercher par mots-clés (Met, Chicago, Cleveland, SMK, Minneapolis, Smithsonian), première page
//   de résultats, en trois vagues au plus : deux vagues avec les mots-clés de l'exposition (un mot de culture différent
//   par région à chaque vague : « Chinese », puis « Japanese »…), puis une vague sans mot-clé (seulement la culture) ;
// - musées du monde entier via Wikidata (sans mot-clé), lancés après quelques secondes s'il manque encore des pays.
// Une œuvre par pays nouveau. Renvoie (au plus tard après 60 secondes) { choisies, reserve, sources } :
// la réserve sert à remplacer une œuvre dont l'image ne se charge pas ; sources indique les catalogues qui ont répondu.
const CATALOGUES_MOTS_CLES = ['met', 'aic', 'cleveland', 'smk', 'mia', 'smithsonian'];
// File d'attente : au plus « max » tâches en même temps
function fileDAttente(max) {
  let actives = 0;
  const attente = [];
  const suivante = () => {
    if (actives >= max || !attente.length) return;
    actives++;
    const [tache, ok] = attente.shift();
    Promise.resolve().then(tache).catch(() => {}).then(r => { actives--; ok(r); suivante(); });
  };
  return tache => new Promise(ok => { attente.push([tache, ok]); suivante(); });
}
function completerExposition(options, surAjout) {
  const regions = options.regions && options.regions.length ? options.regions : Object.keys(MOTS_RECHERCHE_REGIONS);
  const epoques = options.epoques || [];
  const pris = new Set(options.dejaPays || []), vus = new Set(), choisies = [], reserve = [];
  const exclure = options.exclure || [];
  const sources = {}; // nom du catalogue → { ok, nombre }
  const fini = () => choisies.length >= options.manque;
  function prendre(liste) {
    (liste || []).forEach(w => {
      if (!w || !w.image || !w.title) return;
      if (exclure.some(h => w.image.includes('//' + h + '/'))) return; // site d'images en panne chez ce visiteur
      const cle = cleOeuvre(w);
      if (vus.has(cle)) return;
      vus.add(cle);
      if (epoques.length && !epoques.includes(w.epoch)) return;
      const p = paysDe(w.origine || w.place);
      if (!p) return;
      Object.assign(w, { pays: p.nom, continent: p.continent });
      if (!pris.has(p.nom) && !fini()) { pris.add(p.nom); choisies.push(w); if (surAjout) { try { surAjout(w); } catch (e) {} } }
      else reserve.push(w);
    });
  }
  const actifs = CATALOGUES_MOTS_CLES.filter(k => ADAPTATEURS[k] && (!ADAPTATEURS[k].actif || ADAPTATEURS[k].actif()));
  const file = fileDAttente(4), fileWikidata = fileDAttente(1); // une recherche Wikidata envoie déjà trois requêtes
  const noter = (k, l, e) => {
    const st = sources[ADAPTATEURS[k].nom] = sources[ADAPTATEURS[k].nom] || { ok: false, nombre: 0, raison: '' };
    if (l) { st.ok = true; st.nombre += l.length; } else if (e) st.raison = raisonPanne(e);
  };
  const chercher = (k, c, n, f) => (f || file)(() => fini() ? null : Promise.resolve().then(() => ADAPTATEURS[k].chercher(c, n))
    .then(l => { noter(k, l || []); prendre(l); }, e => noter(k, null, e)));
  const motsRegions = {};
  regions.forEach(r => { motsRegions[r] = (MOTS_RECHERCHE_REGIONS[r] || []).slice().sort(() => Math.random() - 0.5); });
  const vague = k => {
    if (k >= 3 || fini()) return Promise.resolve();
    const avecMots = k < 2 && !!options.mots;
    const taches = [];
    regions.forEach(r => {
      const l = motsRegions[r];
      if (!l.length || (k === 1 && l.length < 2)) return;
      const mot = l[k % l.length];
      actifs.forEach(src => taches.push(chercher(src, { th: [], ty: [], ep: epoques, region: r, motRegion: mot, mots: avecMots ? options.mots : '', premiere: true }, src === 'met' ? 3 : 4)));
    });
    return Promise.all(taches).then(() => vague(k + 1));
  };
  let wikidata = null;
  const lancerWikidata = () => {
    if (!wikidata) wikidata = fini() ? Promise.resolve() : Promise.all(regions.map(r => chercher('wikidata', { th: [], ty: [], ep: epoques, region: r }, 8, fileWikidata)));
    return wikidata;
  };
  const delai = setTimeout(lancerWikidata, 6000);
  const tout = vague(0).then(lancerWikidata);
  const limite = new Promise(ok => setTimeout(ok, 60000));
  return Promise.race([tout, limite]).then(() => {
    clearTimeout(delai);
    return { choisies, reserve, sources: Object.keys(sources).map(nom => ({ nom, ok: sources[nom].ok, nombre: sources[nom].nombre, raison: sources[nom].ok ? '' : sources[nom].raison })) };
  });
}
