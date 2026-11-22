// SIGNALER UNE ERREUR
// Un lien discret « Signaler une erreur » (en bas des pages et sous chaque œuvre) ouvre un petit formulaire.
// Le message est envoyé à l'adresse de l'association (signalements@jaunerougebleu.org) par le service Web3Forms.
// La clé ci-dessous n'est pas secrète : elle permet seulement d'envoyer des messages vers cette adresse.
// Les textes sont en français ; i18n.js les traduit (clés dans i18n-dico.js).
const SIG_CLE = '976bae91-fb4c-4f62-9aad-b1569bf30d40';
const SIG_BASE = document.currentScript ? document.currentScript.src.replace(/signalement\.js.*$/, '') : '';
let sigOeuvre = '', sigGenre = 'oeuvre'; // ce qui est signalé : une œuvre ou un passage de texte

function sigEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

// Lien à placer sous une œuvre ; o = {titre, artiste, musee}
function lienSignalement(o) {
  const nom = [o && o.titre, o && o.artiste, o && o.musee].filter(Boolean).join(' — ');
  return `<button type="button" class="sig-lien" data-oeuvre="${sigEsc(nom)}" onclick="ouvrirSignalement(this.dataset.oeuvre)">Signaler une erreur</button>`;
}
// Lien à placer après un long texte (introduction, « La civilisation en bref », débats…) ; nom = titre du passage
// libelle : texte du lien (par défaut « Signaler une erreur dans ce texte »)
function lienTexte(nom, libelle) {
  return `<button type="button" class="sig-lien" data-texte="${sigEsc(nom)}" onclick="ouvrirSignalement(this.dataset.texte,'texte')">${sigEsc(libelle || 'Signaler une erreur dans ce texte')}</button>`;
}
// Passage qui change à l'écran (séance de bien-être) : on joint au nom le texte affiché dans les éléments indiqués
function ouvrirSignalementZone(nom, ids) {
  const extrait = (ids || []).map(id => { const el = document.getElementById(id); return el && !el.hidden ? el.textContent.replace(/\s+/g, ' ').trim() : ''; })
    .filter(Boolean).join(' · ').slice(0, 400);
  ouvrirSignalement(nom + (extrait ? ' · ' + extrait : ''), 'texte');
}

(function () {
  const css = document.createElement('style');
  css.textContent = `
.sig-lien,.sig-pied{background:none;border:0;padding:0;font:inherit;cursor:pointer;text-decoration:underline;text-underline-offset:2px}
.sig-lien{display:block;margin:6px 0 0;font-size:12px;color:#777}
.sig-apres{margin:-18px 0 24px}
.sig-ctx-fin .sig-lien,.debat-civ>.sig-lien,.def-civ>.sig-lien,.mus-tous>.sig-lien{margin-top:10px}
.sig-lien:hover,.sig-pied:hover{color:#D8261C}
.sig-pied{color:inherit;font-weight:inherit}
.sig-dlg{width:min(520px,calc(100vw - 32px));max-height:calc(100dvh - 32px);overflow:auto;border:0;border-top:6px solid #D8261C;border-radius:6px;padding:22px 20px 18px;color:#222;background:#fff;font-family:inherit;box-shadow:0 10px 40px rgba(0,0,0,.3)}
.sig-dlg::backdrop{background:rgba(0,0,0,.55)}
.sig-dlg h2{margin:0 0 8px;font-size:22px;line-height:1.25}
.sig-dlg p{margin:0 0 12px;font-size:14px;line-height:1.55;color:#444}
.sig-dlg label{display:block;margin:12px 0 4px;font-size:13px;font-weight:600;color:#222}
.sig-dlg textarea,.sig-dlg input[type=email]{display:block;width:100%;box-sizing:border-box;font:inherit;font-size:15px;padding:9px 10px;border:1px solid #bbb;border-radius:4px;background:#fff;color:#111}
.sig-dlg textarea{min-height:120px;resize:vertical}
.sig-dlg textarea:focus,.sig-dlg input:focus{outline:3px solid #1C3F9E;outline-offset:1px}
.sig-ctx{background:#faf7f2;border-left:3px solid #C9A84C;padding:8px 10px}
.sig-piege{position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0}
.sig-rgpd{font-size:12px!important;color:#666!important;margin-top:12px!important}
.sig-rgpd a{color:#1C3F9E}
.sig-etat{font-weight:600;min-height:1em}
.sig-etat.ok{color:#1D7A4C}.sig-etat.err{color:#B3261E}
.sig-btns{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;margin-top:6px}
.sig-btns button{font:inherit;font-size:14px;padding:9px 16px;border-radius:4px;cursor:pointer;border:1px solid #111;background:#fff;color:#111}
.sig-btns button[type=submit]{background:#111;color:#fff}
.sig-btns button:disabled{opacity:.5;cursor:wait}
.sig-btns button:focus-visible{outline:3px solid #1C3F9E;outline-offset:2px}`;
  document.head.appendChild(css);
})();

function creerSignalement() {
  let d = document.getElementById('sig-dlg');
  if (d) return d;
  d = document.createElement('dialog');
  d.id = 'sig-dlg'; d.className = 'sig-dlg'; d.setAttribute('aria-labelledby', 'sig-titre');
  d.innerHTML = `<form id="sig-form" novalidate>
  <h2 id="sig-titre">Signaler une erreur</h2>
  <p>Une date, un nom, une traduction ou une image vous semble faux ? Dites-le-nous : nous vérifions chaque message avant de corriger le site.</p>
  <p class="sig-ctx" id="sig-ctx" hidden><b id="sig-ctx-t">Œuvre :</b> <span id="sig-ctx-nom"></span></p>
  <label for="sig-msg">Votre message</label>
  <textarea id="sig-msg" required maxlength="4000" rows="5"></textarea>
  <label for="sig-mail">Votre adresse e-mail (facultatif, pour vous répondre)</label>
  <input type="email" id="sig-mail" autocomplete="email" maxlength="200">
  <input type="checkbox" class="sig-piege" id="sig-piege" tabindex="-1" autocomplete="off" aria-hidden="true">
  <p class="sig-etat" id="sig-etat" role="status" aria-live="polite"></p>
  <div class="sig-btns"><button type="button" id="sig-annuler">Annuler</button><button type="submit" id="sig-envoyer">Envoyer</button></div>
  <p class="sig-rgpd">Votre message est transmis à l'association par le service Web3Forms. <a href="${SIG_BASE}mentions-legales/#signalements" onclick="fermerSignalement()">Données personnelles</a></p>
</form>`;
  document.body.appendChild(d);
  d.querySelector('#sig-annuler').onclick = () => fermerSignalement();
  d.querySelector('#sig-form').onsubmit = e => { e.preventDefault(); envoyerSignalement(); };
  d.addEventListener('click', e => { if (e.target === d) fermerSignalement(); }); // clic sur le fond
  return d;
}

function ouvrirSignalement(oeuvre, genre) {
  const d = creerSignalement();
  sigOeuvre = typeof oeuvre === 'string' ? oeuvre : '';
  sigGenre = genre === 'texte' ? 'texte' : 'oeuvre';
  d.querySelector('#sig-ctx-t').textContent = sigGenre === 'texte' ? 'Passage :' : 'Œuvre :';
  const ctx = d.querySelector('#sig-ctx');
  ctx.hidden = !sigOeuvre;
  d.querySelector('#sig-ctx-nom').textContent = sigOeuvre;
  const etat = d.querySelector('#sig-etat'); etat.textContent = ''; etat.className = 'sig-etat';
  d.querySelector('#sig-envoyer').disabled = false;
  d.querySelector('#sig-envoyer').hidden = false;
  d.querySelector('#sig-annuler').textContent = 'Annuler';
  if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
  setTimeout(() => d.querySelector('#sig-msg').focus(), 30);
}

function fermerSignalement() {
  const d = document.getElementById('sig-dlg');
  if (!d) return;
  if (typeof d.close === 'function' && d.open) d.close(); else d.removeAttribute('open');
}

// Page en cours : sur le site principal, la page ouverte et son titre (par exemple le titre de l'exposition)
function sigPage() {
  const pg = document.querySelector('.pg.on');
  const titre = pg && pg.querySelector('h1, h2');
  return [pg ? pg.id.replace(/^pg-/, '') : '', titre ? titre.textContent.trim() : document.title].filter(Boolean).join(' · ');
}

function envoyerSignalement() {
  const d = document.getElementById('sig-dlg');
  const msg = d.querySelector('#sig-msg'), mail = d.querySelector('#sig-mail');
  const etat = d.querySelector('#sig-etat'), btn = d.querySelector('#sig-envoyer');
  const texte = msg.value.trim();
  if (!texte) { etat.className = 'sig-etat err'; etat.textContent = 'Écrivez votre message avant de l\'envoyer.'; msg.focus(); return; }
  if (mail.value.trim() && !mail.checkValidity()) { etat.className = 'sig-etat err'; etat.textContent = 'L\'adresse e-mail ne semble pas valide.'; mail.focus(); return; }
  const fini = () => {
    msg.value = ''; mail.value = '';
    etat.className = 'sig-etat ok'; etat.textContent = 'Merci ! Votre message a bien été envoyé. Nous le vérifierons avant toute correction.';
    btn.hidden = true; d.querySelector('#sig-annuler').textContent = 'Fermer';
  };
  if (d.querySelector('#sig-piege').checked) { fini(); return; } // robot : rien n'est envoyé
  btn.disabled = true; etat.className = 'sig-etat'; etat.textContent = 'Envoi en cours…';
  const donnees = {
    access_key: SIG_CLE,
    subject: 'Signalement d\'erreur — Jaune-Rouge-Bleu',
    from_name: 'Site Jaune-Rouge-Bleu',
    'Message': texte,
    [sigGenre === 'texte' ? 'Passage' : 'Œuvre']: sigOeuvre || '—',
    'Page': sigPage(),
    'Adresse': location.href,
    'Langue du site': (typeof langue === 'string' ? langue : 'fr')
  };
  if (mail.value.trim()) donnees.email = mail.value.trim();
  fetch('https://api.web3forms.com/submit', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(donnees)
  }).then(r => r.json()).then(r => {
    if (r && r.success) fini(); else throw new Error(r && r.message);
  }).catch(() => {
    btn.disabled = false; etat.className = 'sig-etat err';
    etat.textContent = 'L\'envoi n\'a pas fonctionné. Vérifiez votre connexion et réessayez un peu plus tard.';
  });
}
