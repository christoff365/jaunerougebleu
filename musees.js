// MUSÉES EN DIRECT
// Le générateur d'exposition interroge ici, sans intervention humaine, les catalogues ouverts de musées du monde entier.
// Seules les œuvres du domaine public avec image sont retenues. Chaque œuvre est créditée avec un lien vers sa fiche au musée.
//
// Sources actives sans clé : 90 institutions du monde entier et le patrimoine mondial de l'UNESCO (via Wikidata et
// Wikimedia Commons, liste MUSEES_MONDE ci-dessous), Met (New York), Art Institute of Chicago, Cleveland Museum of Art,
// SMK (Copenhague), Minneapolis Institute of Art. Sources activables avec une clé gratuite (à demander par l'association,
// voir README) : Europeana (milliers d'institutions européennes) et Smithsonian (Washington).
const CLES_API = { europeana: '', smithsonian: '' };

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
  'Dessins et estampes': 'print', 'Arts décoratifs': 'ceramic', 'Photographie': 'photograph'
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
  ['Architecture', /architect|building|column|capital|portal|doorway|facade|façade|period room|room from|ceiling|mihrab|temple|relief from|fragment of a (wall|building)/i],
  ['Sculpture', /sculpt|statue|statuette|figure|figurine|bust|relief|carving|head of|torso|bronze|mask|stele/i],
  ['Photographie', /photograph|daguerreotype|albumen|gelatin silver/i],
  ['Dessins et estampes', /print|drawing|watercolor|etching|engraving|woodcut|lithograph|kobberstik|tegning|grafik|book|manuscript|album leaf|folio/i],
  ['Arts décoratifs', /ceramic|porcelain|pottery|vessel|vase|bowl|jar|plate|cup|mirror|jade|textile|embroidery|tapestry|furniture|fitting|glass|metalwork|silver|jewel|costume|armor|arms|tsuba|coin|medal|lacquer|enamel/i],
  ['Peinture', /paint|canvas|oil|tempera|fresco|maleri|icon|panel|scroll|calligraph|emakimono|triptych/i]
];
// Titres évoquant une scène violente ou de nudité : image floutée jusqu'au clic (filtre imparfait, fondé sur le titre)
const MOTS_SENSIBLES = /\b(nude|naked|nu|nue|nus|nøgen|beheading|decapitat|execution|massacre|crucifixion|martyrdom|torture|corpse|cadavre|slaughter|murder|rape|suicide|severed)/i;

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
function typeDe(texte) {
  const t = MOTS_TYPES_RECONNUS.find(([, re]) => re.test(texte || ''));
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
  if (criteres.region) mots.push(auHasard(MOTS_RECHERCHE_REGIONS[criteres.region]));
  criteres.th.forEach(t => mots.push(MOTS_THEMES[t]));
  criteres.ty.forEach(t => mots.push(MOTS_TYPES[t]));
  return mots.filter(Boolean);
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
    types: [o.type || typeDe(o.classification)], langue: o.langue || 'en', direct: true, pastille: o.pastille,
    sensible: MOTS_SENSIBLES.test(o.titre || '')
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
// Musées, par région : [identifiant Wikidata, nombre approximatif d'œuvres illustrées, collection locale ?]
// (collection locale = 0 : collection venue du monde entier, la région de l'œuvre n'est alors déduite que de son origine)
const MUSEES_MONDE = {
  "Asie de l'Est": [
    ['Q653433', 305, 1],   // Musée national de Tokyo
    ['Q147286', 51, 1],    // Musée national de Kyoto
    ['Q147312', 20, 1],    // Musée national de Nara
    ['Q540668', 1337, 1],  // Musée national du Palais, Taipei
    ['Q2047427', 11016, 1],// Musée du Palais (Cité interdite), Pékin
    ['Q1074318', 252, 1],  // Musée national de Chine, Pékin
    ['Q1051293', 697, 1],  // Musée de Shanghai
    ['Q494407', 40, 1],    // Musée national de Corée, Séoul
    ['Q390124', 10, 1],    // Musée national de Gyeongju
    ['Q487498', 14, 1],    // Leeum, Séoul
    ['Q1359908', 41, 1],   // Musée national d'art moderne de Tokyo
    ['Q1233913', 62, 0],   // Musée Fuji de Tokyo
    ['Q843638', 11, 1],    // Musée MOA, Atami
    ['Q1075126', 267, 1],  // Freer Gallery of Art, Washington (arts d'Asie)
    ['Q860994', 369, 1]    // Musée Guimet, Paris (arts d'Asie)
  ],
  'Asie du Sud et du Sud-Est': [
    ['Q1356138', 202, 1],  // Musée national, New Delhi
    ['Q1071500', 16, 1],   // Chhatrapati Shivaji Maharaj Vastu Sangrahalaya, Mumbai
    ['Q1364900', 150, 1],  // Indian Museum, Calcutta
    ['Q1864572', 99, 0],   // Musée Salar Jung, Hyderabad
    ['Q1356352', 40, 0],   // Victoria Memorial, Calcutta
    ['Q1467125', 195, 1],  // Musée national d'Indonésie, Jakarta
    ['Q1255815', 12, 1],   // Musée national de Bangkok
    ['Q3654706', 11, 1],   // Musée national des beaux-arts du Vietnam, Hanoï
    ['Q860994', 369, 0]    // Musée Guimet, Paris
  ],
  'Moyen-Orient': [
    ['Q46815', 233, 0],    // Musée d'Israël, Jérusalem
    ['Q1267958', 83, 0],   // Musée d'art de Tel Aviv
    ['Q3395851', 45, 1],   // Musée Sakıp Sabancı, Istanbul
    ['Q1662392', 66, 0],   // Musée Pera, Istanbul
    ['Q636978', 16, 1],    // Musées archéologiques d'Istanbul
    ['Q170495', 9, 1],     // Palais de Topkapı, Istanbul
    ['Q287360', 124, 1],   // Musée Sursock, Beyrouth
    ['Q617254', 106, 1],   // Musée national de Damas
    ['Q521251', 10, 1],    // Musée national d'Irak, Bagdad
    ['Q210610', 85, 1],    // Palais du Golestan, Téhéran
    ['Q1148353', 20, 1],   // Musée d'art islamique, Doha
    ['Q3176133', 21, 0],   // Louvre Abou Dabi
    ['Q391976', 257, 0],   // Chester Beatty, Dublin (arts de l'Islam et d'Asie)
    ['Q4690937', 27, 1]    // Musée Aga Khan, Toronto (arts de l'Islam)
  ],
  'Afrique': [
    ['Q201219', 86, 1],    // Musée égyptien du Caire
    ['Q2583681', 8, 1],    // Grand Musée égyptien, Gizeh
    ['Q1878362', 36, 1],   // Musée de Louxor
    ['Q2354677', 36, 1],   // Musée de Nubie, Assouan
    ['Q2912600', 31, 0],   // Musée national des beaux-arts d'Alger
    ['Q4115728', 17, 0],   // Musée Mahmoud Khalil, Le Caire
    ['Q1419469', 18, 1],   // Galerie nationale d'Afrique du Sud, Le Cap
    ['Q6217142', 11, 1],   // Galerie d'art de Johannesburg
    ['Q167863', 167, 0]    // Musée du quai Branly, Paris
  ],
  'Amériques': [
    ['Q1138147', 171, 1],  // Museo Nacional de Arte, Mexico
    ['Q524249', 16, 1],    // Musée national d'anthropologie, Mexico
    ['Q2097646', 198, 0],  // Museo Soumaya, Mexico
    ['Q1779837', 211, 1],  // Musée national des beaux-arts, La Havane
    ['Q3137182', 132, 0],  // Museo de Arte de Ponce, Porto Rico
    ['Q82941', 284, 0],    // Musée d'art de São Paulo
    ['Q2095209', 643, 1],  // Pinacothèque de São Paulo
    ['Q1954370', 305, 1],  // Musée national des beaux-arts, Rio de Janeiro
    ['Q371803', 26, 1],    // Musée Paulista, São Paulo
    ['Q6033913', 51, 1],   // Musée d'art de Lima
    ['Q1568821', 20, 1],   // Musée national d'archéologie, d'anthropologie et d'histoire du Pérou, Lima
    ['Q775376', 38, 1],    // Musée national des beaux-arts, Santiago du Chili
    ['Q1068063', 434, 0],  // Musée des beaux-arts du Canada, Ottawa
    ['Q860812', 191, 0],   // Musée des beaux-arts de Montréal
    ['Q649250', 37, 0],    // Musée royal de l'Ontario, Toronto
    ['Q2568412', 22, 1]    // Museo de América, Madrid
  ],
  'Océanie': [
    ['Q1464509', 333, 0],  // National Gallery of Victoria, Melbourne
    ['Q705551', 285, 0],   // Art Gallery of New South Wales, Sydney
    ['Q795228', 104, 0],   // Galerie nationale d'Australie, Canberra
    ['Q705557', 224, 0],   // Art Gallery of South Australia, Adélaïde
    ['Q7270900', 16, 0],   // Queensland Art Gallery, Brisbane
    ['Q915603', 162, 1],   // Te Papa Tongarewa, Wellington
    ['Q4819492', 489, 0],  // Auckland Art Gallery
    ['Q758657', 117, 1],   // Musée du mémorial de guerre d'Auckland
    ['Q7424149', 347, 0],  // Sarjeant Gallery, Whanganui
    ['Q61797555', 143, 0], // The Suter, Nelson
    ['Q5109058', 11, 0]    // Christchurch Art Gallery
  ],
  'Europe': [
    ['Q190804', 6286, 1],  // Rijksmuseum, Amsterdam
    ['Q180788', 4090, 1],  // National Gallery, Londres
    ['Q6373', 885, 0],     // British Museum, Londres
    ['Q640447', 2014, 1],  // Musée Carnavalet, Paris (Paris Musées)
    ['Q820892', 8, 1],     // Petit Palais, Paris (Paris Musées)
    ['Q23402', 2194, 1],   // Musée d'Orsay, Paris
    ['Q160112', 4066, 1],  // Musée du Prado, Madrid
    ['Q51252', 836, 1],    // Galerie des Offices, Florence
    ['Q95569', 3592, 1],   // Kunsthistorisches Museum, Vienne
    ['Q842858', 14008, 1], // Nationalmuseum, Stockholm
    ['Q132783', 3797, 0],  // Musée de l'Ermitage, Saint-Pétersbourg
    ['Q816669', 73, 1],    // Musée Benaki, Athènes
    ['Q668300', 1081, 0],  // Musée Rietberg, Zurich (arts du monde)
    ['Q731126', 810, 0],   // J. Paul Getty Museum, Los Angeles
    ['Q6352575', 32668, 1],// Yale Center for British Art, New Haven
    ['Q1568434', 29011, 0],// Yale University Art Gallery, New Haven
    ['Q210081', 661, 0]    // Walters Art Museum, Baltimore
  ]
};
// Classes Wikidata correspondant aux types d'œuvres du générateur
const CLASSES_TYPES = {
  'Peinture': 'Q3305213 Q22669850 Q12681 Q15727816 Q99516640 Q1190781 Q79218',
  'Sculpture': 'Q860861 Q179700 Q29527347 Q1066288 Q928357 Q245117 Q14562306 Q178743 Q161524 Q241045',
  'Dessins et estampes': 'Q11060274 Q75837457 Q18219090 Q93184 Q18887969 Q11835431 Q15123870 Q18218093 Q28913685 Q18761202 Q48498 Q8362',
  'Arts décoratifs': 'Q161439 Q28823 Q96952903 Q98276829 Q191851 Q60733799 Q17379525 Q153988 Q28966302 Q45621 Q1207302 Q1758043 Q57216 Q35197 Q368972 Q4390114 Q11631761',
  'Photographie': 'Q125191'
};
// Monuments (et non sites naturels) : temples, mosquées, églises, palais, forts, tombeaux, sites archéologiques, centres historiques…
const CLASSES_ARCHITECTURE = 'Q44539 Q842402 Q5393308 Q199451 Q180987 Q12516 Q381885 Q162875 Q32815 Q16970 Q2977 Q56242215 Q120560 Q2031836 Q108325 Q44613 Q160742 ' +
  'Q16560 Q751876 Q23413 Q1785071 Q12518 Q41176 Q1497375 Q18247357 Q4989906 Q839954 Q15661340 Q109607 Q1081138 Q676050 Q15243209';
// Genres Wikidata correspondant aux thèmes
const GENRES_THEMES = {
  'Portraits': 'Q134307', 'Paysages': 'Q191163', 'Nature morte': 'Q170571', 'Spiritualité': 'Q2864737',
  'Vie quotidienne': 'Q1047337', 'Mythologie': 'Q3374376', 'Abstraction': 'Q128115'
};
const REGIONS_HORS_EUROPE = ["Asie de l'Est", 'Asie du Sud et du Sud-Est', 'Moyen-Orient', 'Afrique', 'Amériques', 'Océanie'];
const wd = liste => liste.map(q => 'wd:' + q).join(' ');
function bornesEpoques(ep) {
  if (!ep.length) return null;
  const d = ep.map(e => DATES_EPOQUES[e]);
  return [Math.min(...d.map(x => x[0])), Math.max(...d.map(x => x[1]))];
}
function sparql(requete) {
  // Envoi en POST : les requêtes longues dépasseraient la taille maximale d'une adresse
  return lireJSON('https://query.wikidata.org/sparql?format=json', 15000, {
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
// Vignette, auteur et licence de chaque image, en une seule demande à Wikimedia Commons
function infosCommons(fichiers) {
  if (!fichiers.length) return Promise.resolve({});
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=extmetadata|url&iiurlwidth=400' +
    '&iiextmetadatafilter=LicenseShortName|Artist&titles=' + encodeURIComponent(fichiers.slice(0, 50).map(f => 'File:' + f).join('|'));
  return lireJSON(url).then(r => {
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
    if (!libreDeDroits(b, annee)) return;
    vus.set(id, b);
  });
  const parLieu = {}, choisies = [];
  const plafond = Math.max(2, Math.ceil(n / 3));
  for (const b of [...vus.values()].sort(() => Math.random() - 0.5)) {
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
      artiste: /^(Q\d+|https?:)/.test(createur) ? '' : createur, annee: anneeWikidata(val(b, 'date')),
      date: (a => a === null ? '' : a < 0 ? (-a) + ' av. J.-C.' : String(a))(anneeWikidata(val(b, 'date'))),
      lieu: majuscule(val(b, 'origineLabel').replace(/^Q\d+$/, '')), musee: options.musee(lieu),
      image: info ? info.image : 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(fichiers[k]) + '?width=400',
      credit: creditCommons(options.musee(lieu), fichiers[k], info),
      regions: region ? [region] : [],
      type: options.type || (classes[qid(b, 'i')] || []).map(typeDe).find(t => t !== 'Autre') || 'Autre',
      pastille: 'Wikidata et Wikimedia Commons, en direct'
    });
  }));
}
// Choisit les musées à interroger : ceux de la région demandée, ou un échantillon du monde entier (surtout hors d'Europe)
function museesPour(region) {
  if (region) return MUSEES_MONDE[region];
  const melange = l => l.slice().sort(() => Math.random() - 0.5);
  return [].concat(...REGIONS_HORS_EUROPE.map(r => melange(MUSEES_MONDE[r]).slice(0, 3)), melange(MUSEES_MONDE.Europe).slice(0, 2));
}

const ADAPTATEURS = {
  wikidata: {
    nom: 'Musées du monde entier (Wikidata et Wikimedia Commons)',
    poids: 2,
    chercher(c, n) {
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
      const grandOk = m => m[1] <= 3000 || (!genres.length && (!types.length || c.ty.some(t => t === 'Peinture' || t === 'Dessins et estampes')));
      const musees = [...new Map(museesPour(c.region).map(m => [m[0], m])).values()].filter(grandOk).sort(() => Math.random() - 0.5).slice(0, 10);
      if (!musees.length) return Promise.resolve([]);
      const k = Math.max(4, Math.ceil(n * 3 / musees.length));
      const sous = musees.map(m => `{ SELECT ?i ?m ?img ?date WHERE {
          VALUES ?m { wd:${m[0]} } ?i wdt:P195 ?m ; wdt:P18 ?img ; wdt:P571 ?date .
          ${d ? `FILTER(YEAR(?date) >= ${d[0]} && YEAR(?date) <= ${d[1]})` : ''}
          ${types.length ? `?i wdt:P31 ?t . FILTER(?t IN (${types.map(q => 'wd:' + q).join(', ')}))` : ''}
          ${genres.length ? `?i wdt:P136 ?g . FILTER(?g IN (${genres.map(q => 'wd:' + q).join(', ')}))` : ''}
        } LIMIT ${k} OFFSET ${hasard(Math.max(1, (filtre ? Math.min(Math.floor(m[1] / 8), 60) : m[1]) - k))} }`).join(' UNION ');
      // Ordre imposé : d'abord les œuvres de chaque musée, puis les filtres (sinon la recherche peut être très lente)
      const requete = `SELECT ?i ?iLabel ?m ?mLabel ?date ?img ?typeEn ?createur ?createurLabel ?deces ?origine ?origineLabel ?nat WHERE {
        hint:Query hint:optimizer "None" .
        ${sous}
        OPTIONAL { ?i wdt:P31 ?type . ?type rdfs:label ?typeEn FILTER(LANG(?typeEn) = "en") }
        OPTIONAL { ?i wdt:P495 ?origine }
        OPTIONAL { ?i wdt:P170 ?createur . OPTIONAL { ?createur wdt:P27 ?nat } OPTIONAL { ?createur wdt:P570 ?deces } }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en,mul". }
      }`;
      return sparql(requete).then(lignes => oeuvresWikidata(lignes, n, {
        lieu: 'mLabel', musee: nom => nom, region: b => regionMusee[qid(b, 'm')]
      }));
    }
  },
  patrimoine: {
    nom: 'Patrimoine mondial de l\'UNESCO (Wikidata et Wikimedia Commons)',
    poids: 2,
    chercher(c, n) {
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
        SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en,mul". }
      } ORDER BY ?h LIMIT ${n * 4}`;
      return sparql(requete).then(lignes => oeuvresWikidata(lignes.map(b => Object.assign({ origine: b.pays, origineLabel: b.paysLabel }, b)), n, {
        lieu: 'paysLabel', type: 'Architecture', musee: p => 'Patrimoine mondial de l\'UNESCO, ' + p, region: () => null
      }));
    }
  },
  met: {
    nom: 'The Metropolitan Museum of Art, New York',
    chercher(c, n) {
      const q = motsCles(c).join(' ') || 'art';
      let url = 'https://collectionapi.metmuseum.org/public/collection/v1.1/search?hasImages=true&limit=60&offset=0&q=' + encodeURIComponent(q);
      if (c.ep.length) { const d = c.ep.map(e => DATES_EPOQUES[e]); url += '&dateBegin=' + Math.min(...d.map(x => x[0])) + '&dateEnd=' + Math.max(...d.map(x => x[1])); }
      return lireJSON(url).then(r => {
        const ids = (r.objectIDs || []).sort(() => Math.random() - 0.5).slice(0, n * 2);
        return Promise.all(ids.map(id => lireJSON('https://collectionapi.metmuseum.org/public/collection/v1/objects/' + id, 8000).catch(() => null)));
      }).then(liste => liste.filter(o => o && o.isPublicDomain && o.primaryImageSmall).slice(0, n).map(o => oeuvre({
        titre: o.title, artiste: o.artistDisplayName, date: o.objectDate, annee: o.objectBeginDate,
        lieu: [o.city, o.country].filter(Boolean).join(', '), culture: o.culture, indiceRegion: o.department,
        musee: this.nom, image: o.primaryImageSmall, fiche: o.objectURL,
        classification: [o.classification, o.objectName, o.department].join(' ')
      })));
    }
  },
  aic: {
    nom: 'Art Institute of Chicago',
    chercher(c, n) {
      const filtres = [{ term: { is_public_domain: true } }, { exists: { field: 'image_id' } }];
      if (c.ep.length) { const d = c.ep.map(e => DATES_EPOQUES[e]); filtres.push({ range: { date_start: { gte: Math.min(...d.map(x => x[0])), lte: Math.max(...d.map(x => x[1])) } } }); }
      const requete = { query: { bool: { must: filtres } }, fields: 'id,title,artist_display,date_display,date_start,place_of_origin,artwork_type_title,classification_title,image_id', limit: n, page: 1 + hasard(5) };
      const q = motsCles(c).join(' ');
      if (q) requete.q = q;
      return lireJSON('https://api.artic.edu/api/v1/artworks/search?params=' + encodeURIComponent(JSON.stringify(requete)))
        .then(r => (r.data || []).filter(o => o.image_id).map(o => oeuvre({
          titre: o.title, artiste: (o.artist_display || '').split('\n')[0], date: o.date_display, annee: o.date_start,
          lieu: o.place_of_origin, musee: this.nom, image: 'https://www.artic.edu/iiif/2/' + o.image_id + '/full/400,/0/default.jpg',
          fiche: 'https://www.artic.edu/artworks/' + o.id, classification: [o.artwork_type_title, o.classification_title].join(' ')
        })));
    }
  },
  cleveland: {
    nom: 'Cleveland Museum of Art',
    chercher(c, n) {
      let url = 'https://openaccess-api.clevelandart.org/api/artworks/?cc0=1&has_image=1&limit=' + n + '&skip=' + hasard(40);
      const q = motsCles(c).join(' ');
      if (q) url += '&q=' + encodeURIComponent(q);
      if (c.ep.length) { const d = c.ep.map(e => DATES_EPOQUES[e]); url += '&created_after=' + Math.min(...d.map(x => x[0])) + '&created_before=' + Math.max(...d.map(x => x[1])); }
      return lireJSON(url).then(r => (r.data || []).filter(o => o.images && o.images.web).map(o => oeuvre({
        titre: o.title, artiste: o.creators && o.creators[0] ? o.creators[0].description.split('(')[0].trim() : '', date: o.creation_date,
        annee: o.creation_date_earliest, culture: (o.culture || []).join(', '), indiceRegion: o.department,
        musee: this.nom, image: o.images.web.url, fiche: o.url, classification: [o.type, o.department].join(' ')
      })));
    }
  },
  smk: {
    nom: 'SMK – Statens Museum for Kunst, Copenhague',
    chercher(c, n) {
      const q = motsCles(c).join(' ') || '*';
      const url = 'https://api.smk.dk/api/v1/art/search/?keys=' + encodeURIComponent(q) + '&offset=' + hasard(30) + '&rows=' + (n * 2) + '&filters=%5Bpublic_domain:true%5D,%5Bhas_image:true%5D&lang=en';
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
    actif: () => !!CLES_API.europeana,
    chercher(c, n) {
      const q = motsCles(c).join(' ') || 'art';
      const url = 'https://api.europeana.eu/record/v2/search.json?wskey=' + CLES_API.europeana + '&query=' + encodeURIComponent(q) +
        '&reusability=open&qf=TYPE:IMAGE&qf=RIGHTS:*publicdomain*&media=true&thumbnail=true&rows=' + n + '&start=' + (1 + hasard(50)) + '&profile=rich';
      return lireJSON(url).then(r => (r.items || []).filter(o => o.edmIsShownBy || o.edmPreview).map(o => oeuvre({
        titre: (o.title || ['Sans titre'])[0], langue: o.language && o.language[0] ? o.language[0] : 'en',
        artiste: (o.dcCreator || [''])[0], date: (o.year || [''])[0], annee: anneeDe((o.year || [''])[0]),
        lieu: (o.country || [''])[0], musee: ((o.dataProvider || ['Europeana'])[0]) + ' (via Europeana)',
        image: (o.edmPreview || o.edmIsShownBy)[0], fiche: o.guid, classification: (o.dcType || []).join(' ') + ' ' + q
      })));
    }
  },
  smithsonian: {
    nom: 'Smithsonian Institution, Washington',
    actif: () => !!CLES_API.smithsonian,
    chercher(c, n) {
      const q = (motsCles(c).join(' ') || 'art') + ' AND online_media_type:"Images"';
      const url = 'https://api.si.edu/openaccess/api/v1.0/search?api_key=' + CLES_API.smithsonian + '&q=' + encodeURIComponent(q) + '&rows=' + (n * 2) + '&start=' + hasard(40);
      return lireJSON(url).then(r => ((r.response && r.response.rows) || []).map(o => {
        const c2 = o.content || {}, media = c2.descriptiveNonRepeating && c2.descriptiveNonRepeating.online_media && c2.descriptiveNonRepeating.online_media.media && c2.descriptiveNonRepeating.online_media.media[0];
        if (!media || !media.usage || media.usage.access !== 'CC0') return null;
        const ind = c2.indexedStructured || {};
        return oeuvre({
          titre: o.title, artiste: ind.name ? ind.name[0] : '', date: ind.date ? ind.date[0] : '', annee: anneeDe(ind.date ? ind.date[0] : ''),
          lieu: ind.geoLocation && ind.geoLocation[0] && ind.geoLocation[0].L2 ? ind.geoLocation[0].L2.content : '',
          musee: this.nom, image: media.thumbnail || media.content, fiche: (c2.descriptiveNonRepeating.record_link || 'https://www.si.edu/'),
          classification: (ind.object_type || []).join(' ')
        });
      }).filter(Boolean).slice(0, n));
    }
  }
};

// Recherche dans tous les catalogues en même temps ; un catalogue en panne n'empêche pas les autres de répondre
function chercherDansLesMusees(criteres, parSource) {
  const sources = Object.keys(ADAPTATEURS).filter(k => !ADAPTATEURS[k].actif || ADAPTATEURS[k].actif());
  // Une recherche par région choisie (trois au plus), sinon une seule recherche sans région
  const regions = criteres.rg.length ? criteres.rg.slice(0, 3) : [null];
  const n = Math.max(4, Math.round((parSource || 8) / regions.length));
  return Promise.all(sources.map(k => Promise.all(regions.map(region => ADAPTATEURS[k].chercher(Object.assign({}, criteres, { region }), n * (ADAPTATEURS[k].poids || 1)).catch(() => null)))
    .then(listes => ({ source: ADAPTATEURS[k].nom, liste: [].concat(...listes.filter(Boolean)), ok: listes.some(Boolean) }))))
    .then(resultats => {
      const vus = new Set(), oeuvres = [];
      // Les catalogues sont pris à tour de rôle, pour que chaque institution soit représentée
      const alternees = [];
      for (let k = 0; resultats.some(r => k < r.liste.length); k++) resultats.forEach(r => { if (k < r.liste.length) alternees.push(r.liste[k]); });
      alternees.forEach(w => {
        const cle = (w.title + '|' + w.artist).toLowerCase();
        if (!w.title || vus.has(cle) || !w.epoch) return;
        // On applique les choix du visiteur aux fiches reçues (les catalogues ne savent pas tous filtrer)
        if (criteres.ep.length && !criteres.ep.includes(w.epoch)) return;
        if (criteres.rg.length && !w.regions.some(x => criteres.rg.includes(x))) return;
        if (criteres.ty.length && !w.types.some(x => criteres.ty.includes(x))) return;
        vus.add(cle); oeuvres.push(w);
      });
      return { oeuvres, sources: resultats.map(r => ({ nom: r.source, ok: r.ok, nombre: r.liste.length })) };
    });
}
