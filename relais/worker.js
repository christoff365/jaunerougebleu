// RELAIS EUROPEANA, SMITHSONIAN, YALE ET MUSEUMS VICTORIA (Cloudflare Worker)
// Le site ne connaît pas les clés : il demande ici une recherche, le relais y ajoute la clé si besoin (gardée dans les
// secrets du Worker, jamais dans le dépôt) et renvoie la réponse. Seules les recherches venant du site sont acceptées.
// Yale et Museums Victoria n'ont pas de clé : ils refusent seulement les demandes envoyées depuis un autre site web.
const ORIGINES = ['https://jaunerougebleu.org', 'https://www.jaunerougebleu.org', 'https://christoff365.github.io'];
// chemin du relais : [adresse de l'API, nom du paramètre de la clé, nom du secret] (null, null : pas de clé)
const CIBLES = {
  '/europeana': ['https://api.europeana.eu/record/v2/search.json', 'wskey', 'EUROPEANA_KEY'],
  '/smithsonian': ['https://api.si.edu/openaccess/api/v1.0/search', 'api_key', 'SMITHSONIAN_KEY'],
  '/yale': ['https://lux.collections.yale.edu/api/search/item', null, null],
  '/museumsvictoria': ['https://collections.museumsvictoria.com.au/api/search', null, null]
};
// Fiche d'un objet de Yale : /yale-fiche?id=<identifiant> → https://lux.collections.yale.edu/data/object/<identifiant>
const ID_YALE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export default {
  async fetch(req, env) {
    const origine = req.headers.get('Origin') || '';
    const cors = { 'Access-Control-Allow-Origin': ORIGINES.includes(origine) ? origine : ORIGINES[0], 'Vary': 'Origin' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: { ...cors, 'Access-Control-Allow-Methods': 'GET' } });
    const url = new URL(req.url);
    if (req.method !== 'GET' || !ORIGINES.includes(origine)) return new Response('Interdit', { status: 403, headers: cors });
    let dest, cle = null;
    if (url.pathname === '/yale-fiche') {
      const id = url.searchParams.get('id') || '';
      if (!ID_YALE.test(id)) return new Response('Identifiant invalide', { status: 400, headers: cors });
      dest = new URL('https://lux.collections.yale.edu/data/object/' + id);
    } else {
      const cible = CIBLES[url.pathname];
      if (!cible) return new Response('Interdit', { status: 403, headers: cors });
      dest = new URL(cible[0]);
      url.searchParams.forEach((v, k) => { if (k !== cible[1]) dest.searchParams.append(k, v); });
      if (cible[2]) {
        cle = env[cible[2]];
        if (!cle) return new Response('Clé absente', { status: 503, headers: cors });
        dest.searchParams.set(cible[1], cle);
      }
    }
    const r = await fetch(dest, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'JauneRougeBleu/1.0 (+https://jaunerougebleu.org)' },
      cf: { cacheTtl: 600 }
    });
    // Europeana recopie la clé dans les liens de ses réponses : on l'efface avant de répondre au site
    let texte = await r.text();
    if (cle) texte = texte.split(cle).join('');
    return new Response(texte, { status: r.status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=600' } });
  }
};
