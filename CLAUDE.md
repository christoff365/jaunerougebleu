# Consignes pour Claude

Site statique en français (GitHub Pages) ; la documentation complète est dans `README.md`.

## Expositions spéciales (`expositions.json`)

- **Varier les sources des œuvres** (demande expresse de la personne qui gère le site). Ne pas tirer la plupart des œuvres d'un ou deux musées : chercher aussi, outre le Met et le Cleveland Museum of Art, dans Wikimedia Commons et Wikidata (musées du monde entier : Prado, Ermitage, Tretiakov, galeries nationales d'Australie, du Canada, du Mexique, d'Inde…), l'Art Institute of Chicago, la National Gallery of Art de Washington, le Statens Museum for Kunst, Paris Musées, le Rijksmuseum, le Smithsonian, Europeana, et les musées des pays représentés. Viser des œuvres conservées dans leur pays ou région d'origine quand c'est possible.
- Si une source refuse l'accès depuis l'environnement de travail (Wikimedia répond souvent « trop de requêtes », l'Art Institute of Chicago bloque les téléchargements automatiques d'images), le dire, réessayer plus tard ou proposer de partir de liens fournis par la personne qui gère le site, plutôt que de se rabattre en silence sur une seule source.
- Uniquement des œuvres du domaine public, chacune créditée (musée, lien vers la fiche, licence). Pour les objets en volume (masques, sculptures…), une photo sous licence libre (CC BY, CC BY-SA) est acceptée si le crédit cite le photographe et la licence (accord de la personne qui gère le site) ; vérifier l'auteur et la licence sur la page du fichier, et écarter les photos qui semblent scannées dans un livre ; au moins 20 pays ; chaque œuvre a une analyse et un point de comparaison vérifiés (ne rien affirmer qui ne se voie pas dans l'image ou ne soit pas dans la notice du musée).
- Les grandes œuvres avec nudité sont acceptées (accord de la personne qui gère le site), toujours marquées « Image sensible » (`"sensible": true`) pour être floutées jusqu'au clic. Éviter les objets sacrés que leurs communautés demandent de ne pas montrer.
- Le thème (`theme`) doit correspondre à l'exposition ; ajouter un nouveau thème dans `.pages.yml`, `MOTS_THEMES_EXPO` (`index.html`) et `i18n.js` si aucun ne convient.
- Traduire titre, sous-titre et introduction dans `i18n.js` (anglais, espagnol, arabe), et, pour chaque œuvre ajoutée ou modifiée, son titre, sa date, son analyse et son point de comparaison dans `i18n-expositions.js`.

## Habitudes de travail

- Répondre en français, simplement.
- Après une modification d'un fichier `.js`, changer le numéro de version des scripts (`?v=AAAAMMJJx`) dans `index.html`, `README.md` et `mentions-legales/index.html`.
- Tester sur un écran de téléphone (390 px) avant de proposer une pull request.
