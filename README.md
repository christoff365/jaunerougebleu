# Jaune-Rouge-Bleu — jaunerougebleu.org

Site de l'association Jaune-Rouge-Bleu (projet Artmonde) : des expositions d'œuvres du domaine public à composer soi-même, accessibles aux personnes aveugles et malvoyantes comme aux personnes sourdes et malentendantes, en français, anglais, espagnol et arabe.

Le site est un site statique : pas de serveur, pas de base de données. Il est hébergé gratuitement par **GitHub Pages** ; chaque envoi sur la branche `main` le met en ligne en une à deux minutes (le cache peut garder l'ancienne version jusqu'à 10 minutes : recharger avec Ctrl + F5).

## Modifier le contenu sans toucher au code : Pages CMS

Les bénévoles se connectent sur **https://app.pagescms.org** (compte GitHub ou invitation par e-mail), ouvrent le site *jaunerougebleu*, puis :

- **Expositions** : les expositions spéciales de la page d'accueil (fichier `expositions.json`) ;
- **Collection du générateur** : les œuvres utilisées par le générateur d'exposition (fichier `collection.json`).

Règles à respecter :

- n'utiliser que des images **du domaine public** (Met « Open Access », Wikimedia Commons avec la licence « Public domain » ; éviter « CC BY-SA ») ;
- mettre le lien de la source entre parenthèses dans le crédit : il devient cliquable ;
- cocher « Image sensible » pour les scènes violentes ou de nudité (l'image est floutée jusqu'au clic).

Pages CMS enregistre directement sur GitHub : avant de modifier le site sur un ordinateur, faire **Fetch origin** puis **Pull origin** dans GitHub Desktop.

## Organisation des fichiers

| Fichier ou dossier | Rôle |
| --- | --- |
| `index.html` | Tout le site : pages Accueil, Exposition, Accessibilité, Bien-être, Admin, et leur code |
| `musees.js` | Recherche en direct dans les catalogues ouverts des musées pour le générateur d'exposition |
| `i18n.js` | Traductions anglaise, espagnole et arabe, et moteur de traduction (clé = texte français exact) |
| `expositions.json` | Expositions spéciales (modifiées via Pages CMS) |
| `collection.json` | Œuvres du générateur d'exposition (modifiées via Pages CMS) |
| `.pages.yml` | Formulaires de Pages CMS |
| `images/oeuvres/`, `images/expositions/`, `images/collection/` | Images des œuvres, toutes du domaine public, créditées sous chaque image |
| `logo.jpg`, `favicon.svg` | Logo de l'écran d'ouverture et icône d'onglet |
| `masterpiece/` | Le jeu Masterpiece (en français uniquement) |
| `CNAME` | Nom de domaine jaunerougebleu.org pour GitHub Pages |

## Générateur d'exposition : recherche automatique dans les musées

Le générateur compose chaque exposition sans intervention humaine : il réunit les œuvres de `collection.json` et des œuvres trouvées **en direct** dans les catalogues ouverts des musées (fichier `musees.js`), filtrées par thème, région, époque et type (peinture, sculpture, architecture, dessins et estampes, arts décoratifs, photographie). Seules les œuvres du domaine public avec image sont retenues ; chaque image est créditée avec un lien vers sa fiche au musée.

| Institution | État |
| --- | --- |
| The Metropolitan Museum of Art (New York) | actif, sans clé |
| Art Institute of Chicago | actif, sans clé |
| Cleveland Museum of Art | actif, sans clé |
| SMK – Statens Museum for Kunst (Copenhague) | actif, sans clé |
| Minneapolis Institute of Art | actif, sans clé |
| Europeana (milliers d'institutions européennes) | prêt, à activer avec une clé gratuite |
| Smithsonian Institution (Washington) | prêt, à activer avec une clé gratuite |
| Rijksmuseum, Yale, Getty, Paris Musées | possibles plus tard (données plus complexes ou compte requis) |
| British Museum, National Gallery (Londres), Musée national du Palais (Taipei), Walters | impossibles en direct : pas d'interface publique de ce type |

**Activer Europeana et le Smithsonian (gratuit, sans facturation)** : demander une clé sur https://pro.europeana.eu/pages/get-api (Europeana) et sur https://api.data.gov/signup/ (Smithsonian), puis la recopier entre les guillemets au début de `musees.js` : `const CLES_API = { europeana: 'votre-clé', smithsonian: 'votre-clé' };`.

Limites : les fiches venues des catalogues restent dans la langue du musée (souvent l'anglais) ; le floutage des scènes violentes ou de nudité repose sur le titre et n'est pas infaillible ; si un catalogue ne répond pas, les autres continuent ; une œuvre dont l'image ne se charge pas est retirée automatiquement.

## Fonctionnement à connaître

- **Traductions** : toute nouvelle phrase française affichée doit être ajoutée dans `i18n.js`, sinon elle reste en français dans les autres langues. Les traductions ont été générées par IA et doivent être relues par des locuteurs natifs.
- **Accessibilité** : deux parcours distincts sur la page Accessibilité (aveugles et malvoyants / sourds et malentendants) ; les emojis décoratifs sont masqués aux lecteurs d'écran ; tout est utilisable au clavier.
- **Vibrations** : uniquement sur les téléphones Android (les iPhone et les ordinateurs ne le permettent pas depuis un site) ; ailleurs, seule la partition visuelle est proposée.
- **Musique des couleurs** : tempo, tonalité, énergie et luminosité sont calculés à partir des couleurs réelles de l'image, selon une règle inventée pour le site, puis une courte musique est jouée dans le navigateur.
- **Textes** : générés par Claude AI (Anthropic) ; à faire relire, en particulier les descriptions audio destinées aux visiteurs aveugles.

## Tester en local

Ouvrir `index.html` dans un navigateur suffit pour la plupart des pages. Les expositions et le générateur ne s'affichent pas en local (le navigateur interdit de lire `expositions.json` et `collection.json` depuis le disque) : ils fonctionnent sur le site en ligne.
