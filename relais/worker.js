// RELAIS EUROPEANA ET SMITHSONIAN (Cloudflare Worker)
// Le site ne connaît pas les clés : il demande ici une recherche, le relais y ajoute la clé (gardée dans les secrets
// du Worker, jamais dans le dépôt) et renvoie la réponse. Seules les recherches venant du site sont acceptées.
const ORIGINES = ['https://jaunerougebleu.org', 'https://www.jaunerougebleu.org', 'https://christoff365.github.io'];
// chemin du relais : [adresse de l'API, nom du paramètre de la clé, nom du secret]
const CIBLES = {
  '/europeana': ['https://api.europeana.eu/record/v2/search.json', 'wskey', 'EUROPEANA_KEY'],
  '/smithsonian': ['https://api.si.edu/openaccess/api/v1.0/search', 'api_key', 'SMITHSONIAN_KEY']
};

export default {
  async fetch(req, env) {
    const origine = req.headers.get('Origin') || '';
    const cors = { 'Access-Control-Allow-Origin': ORIGINES.includes(origine) ? origine : ORIGINES[0], 'Vary': 'Origin' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: { ...cors, 'Access-Control-Allow-Methods': 'GET' } });
    const url = new URL(req.url), cible = CIBLES[url.pathname];
    if (req.method !== 'GET' || !cible || !ORIGINES.includes(origine)) return new Response('Interdit', { status: 403, headers: cors });
    const cle = env[cible[2]];
    if (!cle) return new Response('Clé absente', { status: 503, headers: cors });
    const dest = new URL(cible[0]);
    url.searchParams.forEach((v, k) => { if (k !== cible[1]) dest.searchParams.append(k, v); });
    dest.searchParams.set(cible[1], cle);
    const r = await fetch(dest, { cf: { cacheTtl: 600 } });
    // Europeana recopie la clé dans les liens de ses réponses : on l'efface avant de répondre au site
    const texte = (await r.text()).split(cle).join('');
    return new Response(texte, { status: r.status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=600' } });
  }
};
