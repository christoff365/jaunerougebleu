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
- pour une œuvre d'exposition spéciale, on peut simplement coller le **lien de sa fiche au musée** (Met, Art Institute of Chicago, Cleveland ou Wikidata) : voir plus bas « Expositions spéciales : œuvres des musées en direct » ;
- cocher « Image sensible » pour les scènes violentes ou de nudité (l'image est floutée jusqu'au clic).

Pages CMS enregistre directement sur GitHub : avant de modifier le site sur un ordinateur, faire **Fetch origin** puis **Pull origin** dans GitHub Desktop.

## Organisation des fichiers

| Fichier ou dossier | Rôle |
| --- | --- |
| `index.html` | Tout le site : pages Accueil, Exposition, Accessibilité, Bien-être, Musées (liste des institutions par région, construite à partir de `musees.js`, avec liens vers leurs sites et vers Wikidata), et leur code principal. Il n'y a pas d'onglet d'administration sur le site : l'administration se fait uniquement dans Pages CMS |
| `accessibilite.js` | Bouton « Accessibilité » de chaque œuvre du site (description audio, musique des couleurs, partition visuelle, vibrations) et menu « Aa » Affichage et lecture (texte plus grand, contraste élevé, animations réduites, lecture de la page à voix haute) |
| `bienetre.js` | Séances de bien-être composées à la demande : intention, durée (2, 3 ou 5 min), œuvres proposées d'après leurs couleurs |
| `musees.js` | Recherche en direct dans les catalogues ouverts des musées pour le générateur d'exposition |
| `relais/` | Relais (Cloudflare Worker) qui garde les clés Europeana et Smithsonian hors du site et fait les recherches à sa place |
| `i18n.js` | Traductions anglaise, espagnole et arabe, et moteur de traduction (clé = texte français exact) |
| `expositions.json` | Expositions spéciales (modifiées via Pages CMS) ; une œuvre peut n'y être qu'un lien vers sa fiche au musée |
| `collection.json` | Œuvres du générateur d'exposition (modifiées via Pages CMS) |
| `.pages.yml` | Formulaires de Pages CMS |
| `images/oeuvres/`, `images/expositions/`, `images/collection/` | Images des œuvres, toutes du domaine public, créditées sous chaque image |
| `logo.jpg`, `favicon.svg` | Logo de l'écran d'ouverture et icône d'onglet |
| `jeux/` | Page « Jeux » qui présente les deux jeux (lien « Jeux » du menu) |
| `masterpiece/` | Le jeu Masterpiece (en français uniquement) : `index.html` (le jeu) et `oeuvres.json` (sa collection de 517 œuvres) |
| `copiste/` | Le jeu Copiste, repeindre une composition de mémoire (en français uniquement ; il s'appelait auparavant Masterpiece) |
| `CNAME` | Nom de domaine jaunerougebleu.org pour GitHub Pages |

## Expositions spéciales : œuvres des musées en direct et règle des 20 pays

**Œuvre par lien.** Dans Pages CMS (Expositions → Œuvres à comparer), le champ « Lien de l'œuvre au musée » accepte l'adresse de la fiche d'une œuvre :

| Musée | Forme du lien |
| --- | --- |
| The Metropolitan Museum of Art | `https://www.metmuseum.org/art/collection/search/12345` |
| Art Institute of Chicago | `https://www.artic.edu/artworks/12345` |
| Cleveland Museum of Art | `https://www.clevelandart.org/art/1915.534` |
| Wikidata (toutes les institutions qui y décrivent leurs œuvres) | `https://www.wikidata.org/wiki/Q12345` |

À chaque visite, le navigateur du visiteur demande au musée l'image, le titre, l'artiste, la date, le lieu et le crédit (fonction `oeuvreParLien` de `musees.js`). Les champs remplis dans Pages CMS restent prioritaires (par exemple un titre en français). L'œuvre n'est affichée que si le musée la déclare dans le domaine public (Met : Open Access ; Chicago : domaine public ; Cleveland : CC0 ; Wikidata : même règle que le générateur). Si le musée ne répond pas, l'image locale est utilisée si elle existe, sinon l'œuvre est masquée sans bloquer le reste.

**Règle des 20 pays.** Chaque exposition spéciale présente des œuvres d'au moins 20 pays différents (champ « Nombre minimum de pays », 20 par défaut). Le pays de chaque œuvre est lu dans le champ « Pays », ou dans la fiche du musée (lieu, puis culture, puis nationalité de l'artiste), et reconnu grâce à la liste `PAYS_OEUVRES` de `musees.js` (noms français et anglais, cultures et villes : « Yoruba » → Nigeria, « Wari » → Pérou…). S'il manque des pays, le site complète l'exposition (fonction `completerExposition`) avec des œuvres du domaine public trouvées en direct, une par pays absent, en alternant les régions du monde : dans les catalogues qui savent chercher par mots-clés (Met, Chicago, Cleveland, SMK, Minneapolis, Smithsonian), en trois vagues au plus, et, après quelques secondes s'il manque encore des pays, dans les musées du monde entier via Wikidata. Chaque catalogue est interrogé séparément et chaque œuvre trouvée s'affiche aussitôt : un catalogue lent ne retarde pas les autres (recherche arrêtée au bout de 45 secondes). Les mots-clés viennent du champ « Recherche automatique » de l'exposition (en anglais, langue des catalogues), sinon du thème. Ces œuvres sont présentées à part (« Œuvres d'autres pays, trouvées en direct dans les musées »), sans analyse écrite, et changent d'une visite à l'autre ; une œuvre dont l'image ne se charge pas est remplacée par une autre d'un pays absent. Un compteur indique le nombre d'œuvres, de pays et de continents. Pour une exposition fixe et entièrement commentée, il suffit d'ajouter soi-même des œuvres (par lien) jusqu'à 20 pays : le complément automatique ne sert alors plus.

## Générateur d'exposition : recherche automatique dans les musées

Le générateur compose chaque exposition sans intervention humaine : il réunit les œuvres de `collection.json` et des œuvres trouvées **en direct** dans les catalogues ouverts des musées (fichier `musees.js`), filtrées par thème, région, époque et type (peinture, sculpture, architecture, dessins et estampes, arts décoratifs, photographie). Seules les œuvres du domaine public avec image sont retenues ; chaque image est créditée avec un lien vers sa fiche au musée.

| Institution | État |
| --- | --- |
| 114 institutions du monde entier, via Wikidata et Wikimedia Commons (liste `MUSEES_MONDE` dans `musees.js`) | actif, sans clé |
| Patrimoine mondial de l'UNESCO (monuments : temples, mosquées, palais, sites archéologiques…), via Wikidata et Wikimedia Commons | actif, sans clé |
| Musées de France : œuvres reliées à leur notice Joconde dans Wikidata (P347) et illustrées sur Wikimedia Commons, avec lien vers la notice POP | actif, sans clé |
| The Metropolitan Museum of Art (New York) | actif, sans clé |
| Art Institute of Chicago | actif, sans clé |
| Cleveland Museum of Art | actif, sans clé |
| SMK – Statens Museum for Kunst (Copenhague) | actif, sans clé |
| Minneapolis Institute of Art | actif, sans clé |
| Europeana (milliers d'institutions européennes) | actif, via le relais de l'association (clé gardée hors du site) |
| Smithsonian Institution (Washington) : ses musées d'art (Hirshhorn, American Art Museum, National Portrait Gallery, art asiatique, Cooper Hewitt, art africain, musée des Amérindiens) | actif, via le relais de l'association (clé gardée hors du site) |

Les 114 institutions de Wikidata, par région :

- **Asie de l'Est** : musées nationaux de Tokyo, Kyoto, Nara, Corée (Séoul) et Gyeongju, Musée national du Palais (Taipei), Musée du Palais (Cité interdite, Pékin), Musée national de Chine, Musée de Shanghai, Leeum (Séoul), Musée national d'art moderne de Tokyo, Musée Fuji de Tokyo, Musée MOA, Freer Gallery (Washington), Musée Guimet (Paris) ;
- **Asie du Sud et du Sud-Est** : Musée national (New Delhi), CSMVS (Mumbai), Indian Museum et Victoria Memorial (Calcutta), Musée Salar Jung (Hyderabad), musées nationaux d'Indonésie (Jakarta) et de Bangkok, Musée national des beaux-arts du Vietnam (Hanoï) ;
- **Moyen-Orient** : Musée d'Israël, Musée d'art de Tel Aviv, musées Sakıp Sabancı et Pera, musées archéologiques et palais de Topkapı (Istanbul), Musée Sursock (Beyrouth), Musée national de Damas, Musée national d'Irak, Palais du Golestan (Téhéran), Musée d'art islamique (Doha), Louvre Abou Dabi, Chester Beatty (Dublin), Musée Aga Khan (Toronto) ;
- **Afrique** : Musée égyptien du Caire, Grand Musée égyptien, musées de Louxor et de Nubie (Assouan), Musée Mahmoud Khalil (Le Caire), Musée national des beaux-arts d'Alger, Galerie nationale d'Afrique du Sud (Le Cap), Galerie d'art de Johannesburg, Musée du quai Branly (Paris) ;
- **Amériques** : Museo Nacional de Arte, Musée national d'anthropologie et Museo Soumaya (Mexico), Musée national des beaux-arts (La Havane), Museo de Arte de Ponce, MASP, Pinacothèque et Musée Paulista (São Paulo), Musée national des beaux-arts (Rio de Janeiro), Musée d'art de Lima, Musée national d'archéologie du Pérou, Musée national des beaux-arts (Santiago), musées des beaux-arts du Canada (Ottawa) et de Montréal, Musée royal de l'Ontario, Museo de América (Madrid) ;
- **Océanie** : National Gallery of Victoria, galeries d'art de Nouvelle-Galles du Sud, d'Australie-Méridionale et du Queensland, Galerie nationale d'Australie, Te Papa (Wellington), Auckland Art Gallery, Musée d'Auckland, Sarjeant Gallery, The Suter, Christchurch Art Gallery ;
- **France** : musée du Louvre (8 départements : peintures, sculptures, antiquités grecques, étrusques et romaines, objets d'art, arts graphiques, et, rangés dans leurs régions, antiquités égyptiennes, antiquités orientales et arts de l'Islam), château de Versailles et musée de l'Histoire de France, musée Condé (Chantilly), musées des Augustins et Saint-Raymond (Toulouse), palais des Beaux-Arts de Lille, musées des Beaux-Arts de Reims, Dijon, Bordeaux, Strasbourg, Besançon, Rouen, musée Magnin (Dijon), musée de Grenoble, musée d'Art moderne et contemporain de Strasbourg, musée d'Art et d'Histoire de Saint-Brieuc ;
- **Europe et États-Unis** : Rijksmuseum, National Gallery et British Museum (Londres), Carnavalet et Petit Palais (Paris Musées), Orsay, Prado, Offices, Kunsthistorisches Museum, Nationalmuseum (Stockholm), Ermitage, Benaki, Rietberg, Getty, Yale (deux musées), Walters.

**Bases françaises** : Joconde et POP (ministère de la Culture), Gallica (BnF), le site des collections du Louvre et Paris Musées ne peuvent pas être interrogés directement par le site, car ils n'autorisent pas les demandes venant d'un navigateur (il faudrait un serveur, ou une clé pour Paris Musées). Leurs œuvres arrivent quand même par deux chemins : la source « Musées de France (notices Joconde) », qui retient dans Wikidata les œuvres reliées à leur notice Joconde et illustrées sur Wikimedia Commons (l'image vient de Commons, car les données ouvertes de Joconde ne contiennent pas d'images ; chaque œuvre renvoie à sa notice sur POP), et Europeana, qui réunit aussi une partie des collections françaises.

**Ajouter une institution** : trouver son identifiant sur https://www.wikidata.org (de la forme Q12345), puis l'ajouter dans `MUSEES_MONDE` (région, identifiant, nombre approximatif d'œuvres illustrées, 1 si la collection est surtout locale). Seules les institutions dont les œuvres sont décrites dans Wikidata avec une image apparaissent ; certaines grandes institutions (Musée national du Cambodge, Musée national du Nigeria à Lagos, Musée national des beaux-arts de Buenos Aires…) n'y ont pas encore d'œuvres illustrées.

**Droits** : une œuvre venue de Wikidata n'est montrée que si son auteur est mort depuis plus de 70 ans (règle française), ou, si l'auteur est inconnu, si elle date d'avant 1900 ; même règle pour les monuments. Les photos de Wikimedia Commons sont sous licence libre (domaine public, CC0, CC BY, CC BY-SA…) : l'auteur et la licence de chaque photo sont indiqués avec un lien vers le fichier, comme ces licences l'exigent.

**Clés Europeana et Smithsonian** : elles ne doivent jamais être écrites dans le code du site, car tout ce qui y est publié est lisible par n'importe quel visiteur. Le site passe donc par un relais (dossier `relais/`, un Cloudflare Worker gratuit) : le site lui envoie la recherche, le relais y ajoute la clé et renvoie les œuvres, avec leur crédit et le lien vers leur fiche. Les clés restent dans les secrets du relais, jamais dans le dépôt.

Le relais est publié à l'adresse https://jaunerougebleu.loic-a-messian.workers.dev (Worker `jaunerougebleu`, créé directement dans le tableau de bord Cloudflare, sans liaison avec GitHub). Cette adresse est inscrite dans `const RELAIS` au début de `musees.js` ; elle n'est pas secrète. `relais/worker.js` est la copie de référence de son code.

Modifier le relais : dans https://dash.cloudflare.com/, ouvrir le Worker `jaunerougebleu`, cliquer sur **Edit code**, coller le nouveau contenu de `relais/worker.js`, puis **Deploy**. Changer une clé : **Settings**, puis **Variables and Secrets**, et modifier `EUROPEANA_KEY` ou `SMITHSONIAN_KEY` (type **Secret**).

Le relais n'accepte que les demandes venant de jaunerougebleu.org (liste `ORIGINES` dans `relais/worker.js`). Si un quota est dépassé, la source concernée est simplement ignorée. Pour changer de clé : https://pro.europeana.eu/pages/get-api et https://api.data.gov/signup/, puis la remplacer dans **Variables and Secrets**.

Limites : les fiches venues des catalogues restent dans la langue du musée (souvent l'anglais ; Wikidata donne souvent le titre en français) ; Wikidata limite le nombre de recherches par visiteur et par minute (largement suffisant pour un usage normal) ; le floutage des scènes violentes ou de nudité repose sur le titre et n'est pas infaillible ; si un catalogue ne répond pas, les autres continuent ; une œuvre dont l'image ne se charge pas est retirée automatiquement.

## Le jeu Masterpiece

Une œuvre arrive au musée sans son cartel (son étiquette) : le joueur la reconstitue en choisissant, à chaque question, parmi trois propositions (artiste, époque, pays, mouvement, genre, type, musée). L'œuvre apparaît sous un voile qui se lève à chaque réponse ; répondre sous le voile rapporte davantage. Huit salles par visite, quatre parcours (tour du monde, au-delà de l'Europe, chefs-d'œuvre, sculptures et objets), trois niveaux (Amateur, Connaisseur, Expert avec chronomètre, désactivable), un joker « Demander au guide » et un « Soulever le voile ». À la fin, les œuvres de la visite sont accrochées au mur avec leur score.

La collection (`masterpiece/oeuvres.json`) a été préparée par Claude à partir de Wikidata et de Wikimedia Commons : œuvres célèbres et œuvres des musées du monde entier, domaine public selon la règle française, chaque image créditée (auteur, licence, lien). Pour éviter les questions ambiguës, les États historiques sont ramenés au pays actuel (« République florentine » devient « Italie »), seuls les genres et types reconnus sont gardés, et deux propositions ne peuvent jamais appartenir à la même famille de mouvements (par exemple deux mouvements de la Renaissance). Les nus et les scènes violentes ont été écartés. Le fichier est fixe : pour le renouveler, il faut le régénérer (à demander à Claude).

## Mentions légales

Page « Mentions légales » dans `index.html` (lien en bas de chaque page, accès direct : jaunerougebleu.org/#mentions-legales), sur le modèle des rubriques des mentions légales du Centre Pompidou : éditeur, hébergement, directeur de la publication, adresse et coordonnées, équipe du site, équipe rédactionnelle et contributeurs. Les passages surlignés en jaune sont à compléter par l'association.

## Fonctionnement à connaître

- **Traductions** : toute nouvelle phrase française affichée doit être ajoutée dans `i18n.js`, sinon elle reste en français dans les autres langues. Les traductions ont été générées par IA et doivent être relues par des locuteurs natifs.
- **Accessibilité** : deux parcours distincts sur la page Accessibilité (aveugles et malvoyants / sourds et malentendants). Chaque œuvre du site (expositions spéciales, générateur, bien-être, page Accessibilité) a un bouton « Accessibilité » qui ouvre une fenêtre avec description audio, musique des couleurs, partition visuelle et vibrations. Les œuvres sans description écrite reçoivent une description composée automatiquement (titre, artiste, date, musée, couleurs dominantes, luminosité, contrastes), signalée comme telle. Pour les images de musées qui n'autorisent pas l'analyse des couleurs, la musique n'est pas proposée et la partition suit un rythme par défaut. Le menu « Aa » (en haut de chaque page) agrandit le texte, renforce le contraste, réduit les animations et lit la page à voix haute. Les emojis décoratifs sont masqués aux lecteurs d'écran ; tout est utilisable au clavier.
- **Bien-être** : le visiteur choisit une intention (six au choix) et une durée de 2, 3 ou 5 minutes ; le site lui propose six œuvres choisies d'après leurs couleurs parmi toutes celles du site et des œuvres trouvées en direct dans les musées (bouton « Autres propositions », et « Changer d'œuvre » pendant la séance). Le guide change cinq fois au cours de la séance, peut être lu à voix haute (« Guidage vocal ») et, pour les intentions d'apaisement, une respiration guidée (4 s / 6 s) s'affiche. Les guides sont des propositions générées par Claude AI, sans valeur thérapeutique.
- **Page Musées** : le nom de chaque institution ouvre son site officiel (lu en direct dans Wikidata, propriété P856, et gardé 7 jours dans le navigateur) ; l'icône code-barres ouvre sa fiche Wikidata.
- **Vibrations** : uniquement sur les téléphones Android (les iPhone et les ordinateurs ne le permettent pas depuis un site) ; ailleurs, seule la partition visuelle est proposée.
- **Musique des couleurs** : tempo, tonalité, énergie et luminosité sont calculés à partir des couleurs réelles de l'image, selon une règle inventée pour le site, puis une courte musique est jouée dans le navigateur.
- **Version des scripts** : dans `index.html`, les scripts sont appelés avec un numéro de version (`musees.js?v=20261015`). Après une modification d'un fichier `.js`, changer ce numéro (la date du jour), sinon certains navigateurs gardent l'ancienne version en cache jusqu'à 10 minutes, alors que la page, elle, est nouvelle.
- **Textes** : générés par Claude AI (Anthropic) ; à faire relire, en particulier les descriptions audio destinées aux visiteurs aveugles.

## Tester en local

Ouvrir `index.html` dans un navigateur suffit pour la plupart des pages. Les expositions et le générateur ne s'affichent pas en local (le navigateur interdit de lire `expositions.json` et `collection.json` depuis le disque) : ils fonctionnent sur le site en ligne.
