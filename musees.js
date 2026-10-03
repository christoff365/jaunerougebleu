// MUSÉES EN DIRECT
// Le générateur d'exposition interroge ici, sans intervention humaine, les catalogues ouverts de musées du monde entier.
// Seules les œuvres du domaine public avec image sont retenues. Chaque œuvre est créditée avec un lien vers sa fiche au musée.
//
// Sources actives sans clé : Met (New York), Art Institute of Chicago, Cleveland Museum of Art, SMK (Copenhague),
// Minneapolis Institute of Art. Sources activables avec une clé gratuite (à demander par l'association, voir README) :
// Europeana (milliers d'institutions européennes) et Smithsonian (Washington).
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
  ['Sculpture', /sculpt|statue|statuette|figure|figurine|bust|relief|carving|head of|torso|bronze|mask/i],
  ['Photographie', /photograph|daguerreotype|albumen|gelatin silver/i],
  ['Dessins et estampes', /print|drawing|watercolor|etching|engraving|woodcut|lithograph|kobberstik|tegning|grafik|book|manuscript|album leaf/i],
  ['Arts décoratifs', /ceramic|porcelain|vessel|vase|textile|tapestry|furniture|glass|metalwork|silver|jewel|costume|armor|arms|coin|medal|lacquer|enamel/i],
  ['Peinture', /paint|canvas|oil|tempera|fresco|maleri|icon|panel/i]
];
// Titres évoquant une scène violente ou de nudité : image floutée jusqu'au clic (filtre imparfait, fondé sur le titre)
const MOTS_SENSIBLES = /\b(nude|naked|nu|nue|nus|nøgen|beheading|decapitat|execution|massacre|crucifixion|martyrdom|torture|corpse|cadavre|slaughter|murder|rape|suicide|severed)/i;

function anneeDe(texte) {
  if (typeof texte === 'number') return texte;
  const s = String(texte || '');
  const m = s.match(/(-?\d{3,4})/);
  if (!m) return null;
  let a = parseInt(m[1], 10);
  if (/b\.?c\.?e?\b|av\. j/i.test(s) && a > 0) a = -a;
  return a;
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
function lireJSON(url, delai) {
  const ctrl = new AbortController();
  const minuteur = setTimeout(() => ctrl.abort(), delai || 9000);
  return fetch(url, { signal: ctrl.signal }).then(r => { clearTimeout(minuteur); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
}
function hasard(n) { return Math.floor(Math.random() * n); }

// Mot ajouté à la recherche pour chaque région (les catalogues cherchent aussi dans la culture et le lieu d'origine)
const MOTS_RECHERCHE_REGIONS = {
  'Europe': 'European', "Asie de l'Est": 'Chinese Japanese', 'Asie du Sud et du Sud-Est': 'Indian',
  'Moyen-Orient': 'Islamic Persian', 'Afrique': 'African', 'Amériques': 'American', 'Océanie': 'Oceania'
};
// Mots-clés de recherche à partir des choix du visiteur (criteres.region : la région traitée par cette recherche)
function motsCles(criteres) {
  const mots = [];
  if (criteres.region) mots.push(MOTS_RECHERCHE_REGIONS[criteres.region]);
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
    credit: o.musee + ' (' + o.fiche + '), domaine public',
    // Région : d'abord le lieu et la culture ; le département du musée seulement en dernier recours
    regions: regionsDe(texteLieu).length ? regionsDe(texteLieu) : regionsDe(o.indiceRegion || ''), epoch: epoqueDe(annee), themes: [],
    types: [o.type || typeDe(o.classification)], langue: o.langue || 'en', direct: true,
    sensible: MOTS_SENSIBLES.test(o.titre || '')
  };
}

const ADAPTATEURS = {
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
  return Promise.all(sources.map(k => Promise.all(regions.map(region => ADAPTATEURS[k].chercher(Object.assign({}, criteres, { region }), n).catch(() => null)))
    .then(listes => ({ source: ADAPTATEURS[k].nom, liste: [].concat(...listes.filter(Boolean)), ok: listes.some(Boolean) }))))
    .then(resultats => {
      const vus = new Set(), oeuvres = [];
      resultats.forEach(r => r.liste.forEach(w => {
        const cle = (w.title + '|' + w.artist).toLowerCase();
        if (!w.title || vus.has(cle) || !w.epoch) return;
        // On applique les choix du visiteur aux fiches reçues (les catalogues ne savent pas tous filtrer)
        if (criteres.ep.length && !criteres.ep.includes(w.epoch)) return;
        if (criteres.rg.length && !w.regions.some(x => criteres.rg.includes(x))) return;
        if (criteres.ty.length && !w.types.some(x => criteres.ty.includes(x))) return;
        vus.add(cle); oeuvres.push(w);
      }));
      return { oeuvres, sources: resultats.map(r => ({ nom: r.source, ok: r.ok, nombre: r.liste.length })) };
    });
}
