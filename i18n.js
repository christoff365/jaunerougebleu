// TRADUCTIONS DU SITE (anglais, espagnol, arabe)
// Chaque texte français du site est associé à ses traductions : [anglais, espagnol, arabe].
// Le français reste la langue de référence : on modifie d'abord le texte français dans index.html,
// puis on met à jour sa ligne ici (la clé doit être recopiée exactement).
// Traductions générées par Claude AI (Anthropic), à faire relire par des locuteurs natifs.
const TRAD = {
  // ---- Ajouts du 11 octobre 2026 : liens des musées, fenêtre Accessibilité de chaque œuvre, menu Affichage et lecture, bien-être à la demande
  "Cliquez sur le nom d'une institution pour ouvrir son site officiel ; l'icône": ["Click an institution's name to open its official website; the icon", "Haga clic en el nombre de una institución para abrir su sitio oficial; el icono", "انقر على اسم المؤسسة لفتح موقعها الرسمي؛ والأيقونة"],
  "ouvre sa fiche dans Wikidata.": ["opens its Wikidata record.", "abre su ficha en Wikidata.", "تفتح بطاقتها في ويكي بيانات."],
  "Fiche Wikidata": ["Wikidata record", "Ficha de Wikidata", "بطاقة ويكي بيانات"],
  "Europeana (milliers d'institutions européennes)": ["Europeana (thousands of European institutions)", "Europeana (miles de instituciones europeas)", "يوروبيانا (آلاف المؤسسات الأوروبية)"],
  "En Europe, le générateur interroge aussi directement le catalogue du": ["In Europe, the generator also directly searches the catalogue of", "En Europa, el generador también consulta directamente el catálogo del", "في أوروبا، يبحث المولِّد أيضًا مباشرةً في فهرس"],
  "SMK – Statens Museum for Kunst (Copenhague)": ["SMK – National Gallery of Denmark (Copenhagen)", "SMK – Galería Nacional de Dinamarca (Copenhague)", "SMK – المتحف الوطني للفنون (كوبنهاغن)"],
  "Fermer": ["Close", "Cerrar", "إغلاق"],
  "Description composée automatiquement à partir des informations du musée et des couleurs de l'image : à compléter par une description écrite.": ["Description put together automatically from the museum's information and the colours of the image: to be completed with a written description.", "Descripción compuesta automáticamente a partir de la información del museo y de los colores de la imagen: debe completarse con una descripción escrita.", "وصف مُركَّب تلقائيًا من معلومات المتحف وألوان الصورة: ينبغي إكماله بوصف مكتوب."],
  "L'analyse des couleurs n'a pas pu être faite pour cette image (le musée ne l'autorise pas) : la musique n'est pas disponible, la partition suit un rythme par défaut.": ["The colours of this image could not be analysed (the museum does not allow it): the music is not available, and the score follows a default rhythm.", "No se han podido analizar los colores de esta imagen (el museo no lo permite): la música no está disponible y la partitura sigue un ritmo predeterminado.", "تعذّر تحليل ألوان هذه الصورة (لا يسمح المتحف بذلك): الموسيقى غير متاحة، والنوتة تتبع إيقاعًا افتراضيًا."],
  "Rythme par défaut : environ 72 pulsations par minute, par séries de huit, puis une courte pause.": ["Default rhythm: about 72 pulses per minute, in groups of eight, then a short pause.", "Ritmo predeterminado: unas 72 pulsaciones por minuto, en series de ocho, y luego una breve pausa.", "إيقاع افتراضي: نحو 72 نبضة في الدقيقة، في مجموعات من ثماني نبضات، ثم توقف قصير."],
  "« {titre} »": ["“{titre}”", "«{titre}»", "«{titre}»"],
  "Conservée : {musee}.": ["Held at: {musee}.", "Conservada en: {musee}.", "محفوظة في: {musee}."],
  "Couleurs dominantes : {couleurs}.": ["Main colours: {couleurs}.", "Colores dominantes: {couleurs}.", "الألوان الغالبة: {couleurs}."],
  "et": ["and", "y", "و"],
  "L'image est plutôt sombre": ["The image is rather dark", "La imagen es más bien oscura", "الصورة داكنة إلى حدّ ما"],
  "L'image est plutôt claire et lumineuse": ["The image is rather light and bright", "La imagen es más bien clara y luminosa", "الصورة فاتحة ومضيئة إلى حدّ ما"],
  "L'image est en demi-teintes": ["The image is in half-tones", "La imagen está en medios tonos", "الصورة بدرجات لونية متوسطة"],
  "aux couleurs douces et peu saturées": ["with soft, muted colours", "de colores suaves y poco saturados", "بألوان هادئة قليلة التشبّع"],
  "aux couleurs modérément vives": ["with moderately bright colours", "de colores moderadamente vivos", "بألوان زاهية باعتدال"],
  "aux couleurs vives et intenses": ["with bright, intense colours", "de colores vivos e intensos", "بألوان زاهية وقوية"],
  "avec peu de contrastes.": ["with little contrast.", "con pocos contrastes.", "مع تباين قليل."],
  "avec des contrastes marqués.": ["with marked contrasts.", "con contrastes marcados.", "مع تباين واضح."],
  "avec de forts contrastes entre zones claires et sombres.": ["with strong contrasts between light and dark areas.", "con fuertes contrastes entre zonas claras y oscuras.", "مع تباين قوي بين المناطق الفاتحة والداكنة."],
  "noir": ["black", "negro", "أسود"],
  "blanc": ["white", "blanco", "أبيض"],
  "gris foncé": ["dark grey", "gris oscuro", "رمادي داكن"],
  "gris clair": ["light grey", "gris claro", "رمادي فاتح"],
  "beige": ["beige", "beis", "بيج"],
  "brun": ["brown", "marrón", "بني"],
  "rose": ["pink", "rosa", "وردي"],
  "rouge": ["red", "rojo", "أحمر"],
  "orange": ["orange", "naranja", "برتقالي"],
  "ocre": ["ochre", "ocre", "مغرة"],
  "jaune": ["yellow", "amarillo", "أصفر"],
  "vert": ["green", "verde", "أخضر"],
  "turquoise": ["turquoise", "turquesa", "فيروزي"],
  "bleu": ["blue", "azul", "أزرق"],
  "violet": ["purple", "violeta", "بنفسجي"],
  "Si cette œuvre était une musique, elle serait {mode}, au tempo {vitesse} ({tempo} BPM), avec une énergie {energie}.": ["If this work were music, it would be {mode}, at a {vitesse} tempo ({tempo} BPM), with {energie} energy.", "Si esta obra fuera música, sería {mode}, con un tempo {vitesse} ({tempo} BPM) y una energía {energie}.", "لو كان هذا العمل موسيقى، لكان {mode}، بإيقاع {vitesse} ({tempo} نبضة في الدقيقة)، وبطاقة {energie}."],
  "en mode majeur, plutôt lumineuse": ["in a major key, rather bright", "en modo mayor, más bien luminosa", "في سلّم كبير، مضيئًا إلى حدّ ما"],
  "en mode mineur, plutôt grave": ["in a minor key, rather solemn", "en modo menor, más bien grave", "في سلّم صغير، رصينًا إلى حدّ ما"],
  "lent": ["slow", "lento", "بطيء"],
  "modéré": ["moderate", "moderado", "معتدل"],
  "rapide": ["fast", "rápido", "سريع"],
  "douce": ["gentle", "suave", "هادئة"],
  "modérée": ["moderate", "moderada", "معتدلة"],
  "forte": ["strong", "fuerte", "قوية"],
  "Environ {tempo} pulsations par minute, {force}, par séries de huit (la première de chaque groupe de quatre plus appuyée), puis une courte pause.": ["About {tempo} pulses per minute, {force}, in groups of eight (the first of every four stronger), then a short pause.", "Unas {tempo} pulsaciones por minuto, {force}, en series de ocho (la primera de cada grupo de cuatro más marcada), y luego una breve pausa.", "نحو {tempo} نبضة في الدقيقة، {force}، في مجموعات من ثماني نبضات (الأولى من كل أربع أقوى)، ثم توقف قصير."],
  "légères": ["light", "ligeras", "خفيفة"],
  "moyennes": ["medium", "medias", "متوسطة"],
  "fortes": ["strong", "fuertes", "قوية"],
  "Affichage et lecture": ["Display and reading", "Visualización y lectura", "العرض والقراءة"],
  "Texte plus grand": ["Larger text", "Texto más grande", "نص أكبر"],
  "Contraste élevé": ["High contrast", "Contraste alto", "تباين عالٍ"],
  "Réduire les animations": ["Reduce animations", "Reducir las animaciones", "تقليل الحركة"],
  "Lire la page à voix haute": ["Read the page aloud", "Leer la página en voz alta", "اقرأ الصفحة بصوت عالٍ"],
  "Toutes les œuvres du site": ["All the works on the site", "Todas las obras del sitio", "جميع أعمال الموقع"],
  "Chaque œuvre du site, dans les expositions comme dans le générateur et les séances de bien-être, a son bouton « Accessibilité » : description audio, musique des couleurs, partition visuelle et vibrations. En voici quelques-unes.": ["Every work on the site, in the exhibitions as well as in the generator and the well-being sessions, has its own “Accessibility” button: audio description, colour music, visual score and vibrations. Here are some of them.", "Cada obra del sitio, en las exposiciones, en el generador y en las sesiones de bienestar, tiene su botón «Accesibilidad»: audiodescripción, música de los colores, partitura visual y vibraciones. Aquí tiene algunas.", "لكل عمل في الموقع، في المعارض وفي المولِّد وفي جلسات العافية، زرّ «إتاحة الوصول» الخاص به: وصف صوتي، وموسيقى الألوان، ونوتة بصرية، واهتزازات. إليك بعضها."],
  "Descriptions audio composées automatiquement (œuvres sans description écrite) : assemblées par le site à partir des informations du musée et des couleurs de l'image ; elles restent sommaires et doivent être complétées par des descriptions écrites.": ["Automatically composed audio descriptions (works without a written description): put together by the site from the museum's information and the colours of the image; they remain basic and should be completed with written descriptions.", "Audiodescripciones compuestas automáticamente (obras sin descripción escrita): el sitio las elabora a partir de la información del museo y de los colores de la imagen; siguen siendo básicas y deben completarse con descripciones escritas.", "أوصاف صوتية مُركَّبة تلقائيًا (للأعمال التي لا وصف مكتوبًا لها): يجمعها الموقع من معلومات المتحف وألوان الصورة؛ وتبقى موجزة وينبغي إكمالها بأوصاف مكتوبة."],
  "1. Votre intention": ["1. Your intention", "1. Su intención", "1. نيّتك"],
  "2. Durée de la séance": ["2. Session length", "2. Duración de la sesión", "2. مدة الجلسة"],
  "Durée de la séance": ["Session length", "Duración de la sesión", "مدة الجلسة"],
  "3. Choisissez une œuvre": ["3. Choose a work", "3. Elija una obra", "3. اختر عملًا فنيًا"],
  "Choisissez d'abord une intention : des œuvres vous seront proposées d'après leurs couleurs.": ["First choose an intention: works will be suggested to you based on their colours.", "Elija primero una intención: se le propondrán obras según sus colores.", "اختر نيّة أولًا: ستُقترح عليك أعمال بحسب ألوانها."],
  "Recherche des œuvres les plus adaptées…": ["Looking for the most suitable works…", "Buscando las obras más adecuadas…", "جارٍ البحث عن الأعمال الأنسب…"],
  "Œuvres proposées d'après leurs couleurs. Cliquez sur celle qui vous attire.": ["Works suggested based on their colours. Click the one that draws you in.", "Obras propuestas según sus colores. Haga clic en la que le atraiga.", "أعمال مقترحة بحسب ألوانها. انقر على العمل الذي يجذبك."],
  "Autres propositions": ["Other suggestions", "Otras propuestas", "اقتراحات أخرى"],
  "Commencer la séance": ["Begin the session", "Comenzar la sesión", "ابدأ الجلسة"],
  "Changer d'œuvre": ["Change work", "Cambiar de obra", "غيّر العمل"],
  "Guidage vocal": ["Voice guidance", "Guía por voz", "الإرشاد الصوتي"],
  "Inspirez": ["Breathe in", "Inspire", "شهيق"],
  "Expirez": ["Breathe out", "Espire", "زفير"],
  "Retrouver de la joie": ["Finding joy again", "Recuperar la alegría", "استعادة الفرح"],
  "Simplement contempler": ["Simply contemplating", "Simplemente contemplar", "التأمل فحسب"],
  "Installez-vous confortablement. Posez le regard sur l'œuvre, sans chercher à l'analyser.": ["Make yourself comfortable. Rest your gaze on the work, without trying to analyse it.", "Póngase cómodo. Pose la mirada en la obra, sin intentar analizarla.", "اجلس براحة. أرحْ نظرك على العمل، دون أن تحاول تحليله."],
  "Inspirez lentement par le nez en comptant jusqu'à quatre, puis expirez en comptant jusqu'à six.": ["Breathe in slowly through your nose, counting to four, then breathe out, counting to six.", "Inspire lentamente por la nariz contando hasta cuatro y luego espire contando hasta seis.", "خذ شهيقًا بطيئًا من أنفك وأنت تعدّ إلى أربعة، ثم ازفر وأنت تعدّ إلى ستة."],
  "Laissez vos yeux suivre une ligne ou un contour de l'œuvre, très lentement.": ["Let your eyes follow a line or an outline in the work, very slowly.", "Deje que sus ojos sigan una línea o un contorno de la obra, muy despacio.", "دع عينيك تتبعان خطًا أو حدًّا في العمل، ببطء شديد."],
  "Remarquez la couleur la plus calme de l'image. Laissez-la occuper toute votre attention.": ["Notice the calmest colour in the image. Let it fill all your attention.", "Observe el color más tranquilo de la imagen. Deje que ocupe toda su atención.", "لاحظ أهدأ لون في الصورة. دعه يملأ انتباهك كله."],
  "Relâchez les épaules et la mâchoire. Continuez à respirer au rythme de l'œuvre.": ["Relax your shoulders and jaw. Keep breathing in time with the work.", "Relaje los hombros y la mandíbula. Siga respirando al ritmo de la obra.", "أرخِ كتفيك وفكّك. واصل التنفس على إيقاع العمل."],
  "Accueillez ce que vous ressentez, sans le juger. L'œuvre est là, avec vous.": ["Welcome what you are feeling, without judging it. The work is here, with you.", "Acoja lo que siente, sin juzgarlo. La obra está aquí, con usted.", "تقبّل ما تشعر به دون أن تحكم عليه. العمل هنا، معك."],
  "Cherchez dans l'image un détail qui résonne avec votre état du moment.": ["Look in the image for a detail that echoes how you feel right now.", "Busque en la imagen un detalle que resuene con su estado actual.", "ابحث في الصورة عن تفصيل يتردّد صداه مع حالتك الآن."],
  "Respirez lentement. Laissez l'émotion être présente, comme une couleur parmi d'autres.": ["Breathe slowly. Let the emotion be there, like one colour among others.", "Respire despacio. Deje que la emoción esté presente, como un color entre otros.", "تنفّس ببطء. دع الشعور حاضرًا، كلونٍ بين ألوان أخرى."],
  "Trouvez maintenant une zone de lumière, même petite, dans l'œuvre.": ["Now find an area of light in the work, however small.", "Encuentre ahora una zona de luz en la obra, aunque sea pequeña.", "ابحث الآن عن منطقة ضوء في العمل، ولو كانت صغيرة."],
  "Pensez à un mot qui décrit ce que vous ressentez à présent. Vous pouvez le noter dans le journal.": ["Think of a word that describes how you feel now. You can write it in the journal.", "Piense en una palabra que describa lo que siente ahora. Puede anotarla en el diario.", "فكّر في كلمة تصف ما تشعر به الآن. يمكنك تدوينها في اليوميات."],
  "Fixez le centre de la composition pendant quelques respirations.": ["Look at the centre of the composition for a few breaths.", "Fije la mirada en el centro de la composición durante algunas respiraciones.", "ثبّت نظرك على مركز التكوين لبضعة أنفاس."],
  "Comptez les principales formes que vous distinguez.": ["Count the main shapes you can make out.", "Cuente las principales formas que distingue.", "عُدّ الأشكال الرئيسية التي تميّزها."],
  "Suivez le chemin que fait votre regard : où va-t-il, où revient-il ?": ["Follow the path your gaze takes: where does it go, where does it come back to?", "Siga el camino de su mirada: ¿adónde va, adónde vuelve?", "تتبّع المسار الذي يسلكه نظرك: إلى أين يذهب، وإلى أين يعود؟"],
  "Choisissez un seul détail et observez-le comme si vous deviez le redessiner de mémoire.": ["Choose a single detail and observe it as if you had to redraw it from memory.", "Elija un solo detalle y obsérvelo como si tuviera que volver a dibujarlo de memoria.", "اختر تفصيلًا واحدًا وتأمّله كأنك ستعيد رسمه من الذاكرة."],
  "Revenez à l'ensemble de l'œuvre. Remarquez comment les détails s'organisent.": ["Come back to the work as a whole. Notice how the details fit together.", "Vuelva al conjunto de la obra. Observe cómo se organizan los detalles.", "عد إلى العمل في مجمله. لاحظ كيف تنتظم التفاصيل."],
  "Regardez l'œuvre comme si vous la découvriez pour la première fois.": ["Look at the work as if you were seeing it for the first time.", "Mire la obra como si la descubriera por primera vez.", "انظر إلى العمل كأنك تكتشفه لأول مرة."],
  "Imaginez ce qui se passe juste en dehors du cadre.": ["Imagine what is happening just outside the frame.", "Imagine lo que ocurre justo fuera del marco.", "تخيّل ما يحدث خارج الإطار مباشرةً."],
  "Inventez un autre titre pour cette œuvre.": ["Make up another title for this work.", "Invente otro título para esta obra.", "اخترع عنوانًا آخر لهذا العمل."],
  "Si vous pouviez entrer dans l'image, que feriez-vous en premier ?": ["If you could step into the image, what would you do first?", "Si pudiera entrar en la imagen, ¿qué haría primero?", "لو استطعت الدخول إلى الصورة، ماذا ستفعل أولًا؟"],
  "Notez une idée, une image ou un mot qui vous est venu pendant la séance.": ["Write down an idea, an image or a word that came to you during the session.", "Anote una idea, una imagen o una palabra que se le haya ocurrido durante la sesión.", "دوّن فكرة أو صورة أو كلمة خطرت لك خلال الجلسة."],
  "Laissez votre regard aller vers la couleur la plus vive de l'œuvre.": ["Let your gaze go to the brightest colour in the work.", "Deje que su mirada vaya hacia el color más vivo de la obra.", "دع نظرك يتجه إلى ألمع لون في العمل."],
  "Cherchez un détail qui vous fait sourire ou qui vous plaît particulièrement.": ["Look for a detail that makes you smile or that you particularly like.", "Busque un detalle que le haga sonreír o que le guste especialmente.", "ابحث عن تفصيل يجعلك تبتسم أو يعجبك بشكل خاص."],
  "Respirez profondément et imaginez la chaleur ou la lumière de la scène.": ["Breathe deeply and imagine the warmth or the light of the scene.", "Respire hondo e imagine el calor o la luz de la escena.", "تنفّس بعمق وتخيّل دفء المشهد أو ضوءه."],
  "Pensez à un moment heureux que cette œuvre vous rappelle.": ["Think of a happy moment this work reminds you of.", "Piense en un momento feliz que esta obra le recuerde.", "فكّر في لحظة سعيدة يذكّرك بها هذا العمل."],
  "Gardez cette sensation avec vous en terminant la séance.": ["Keep this feeling with you as you end the session.", "Conserve esta sensación al terminar la sesión.", "احتفظ بهذا الإحساس معك وأنت تنهي الجلسة."],
  "Regardez simplement l'œuvre, sans but particulier.": ["Simply look at the work, with no particular aim.", "Simplemente mire la obra, sin un objetivo concreto.", "انظر إلى العمل فحسب، دون هدف محدّد."],
  "Remarquez ce que vous n'aviez pas vu au premier regard.": ["Notice what you had not seen at first glance.", "Observe lo que no había visto a primera vista.", "لاحظ ما لم تره من النظرة الأولى."],
  "Écoutez les sons autour de vous tout en gardant les yeux sur l'image.": ["Listen to the sounds around you while keeping your eyes on the image.", "Escuche los sonidos a su alrededor sin apartar los ojos de la imagen.", "استمع إلى الأصوات من حولك مع إبقاء عينيك على الصورة."],
  "Laissez les pensées passer, et revenez doucement à l'œuvre.": ["Let your thoughts pass, and gently come back to the work.", "Deje pasar los pensamientos y vuelva suavemente a la obra.", "دع الأفكار تمرّ، وعد بلطف إلى العمل."],
  "Prenez un dernier moment pour la regarder dans son ensemble.": ["Take a last moment to look at it as a whole.", "Tómese un último momento para mirarla en su conjunto.", "خذ لحظة أخيرة لتنظر إليه في مجمله."],
  "Séance terminée. Prenez un instant avant de reprendre vos activités.": ["Session complete. Take a moment before going back to what you were doing.", "Sesión terminada. Tómese un momento antes de retomar sus actividades.", "انتهت الجلسة. خذ لحظة قبل أن تعود إلى أنشطتك."],
  // ---- Accessibilité : libellés sans emoji ni symbole (les symboles sont masqués aux lecteurs d'écran)
  "Aller au contenu": ["Skip to content", "Ir al contenido", "انتقل إلى المحتوى"],
  "Navigation principale": ["Main navigation", "Navegación principal", "التنقل الرئيسي"],
  "Langue": ["Language", "Idioma", "اللغة"],
  "Écouter la description": ["Listen to the description", "Escuchar la descripción", "استمع إلى الوصف"],
  "Arrêter la lecture": ["Stop reading", "Detener la lectura", "أوقف القراءة"],
  "Lancer la partition et les vibrations": ["Start the score and vibrations", "Iniciar la partitura y las vibraciones", "شغّل النوتة والاهتزازات"],
  "Lancer la partition visuelle": ["Start the visual score", "Iniciar la partitura visual", "شغّل النوتة البصرية"],
  "Arrêter": ["Stop", "Detener", "إيقاف"],
  "Démarrer la séance": ["Start the session", "Empezar la sesión", "ابدأ الجلسة"],
  "Reprendre": ["Resume", "Reanudar", "استئناف"],
  "Pause": ["Pause", "Pausa", "إيقاف مؤقت"],
  "Séance terminée": ["Session complete", "Sesión terminada", "انتهت الجلسة"],
  "Votre humeur s'est améliorée après la séance": ["Your mood improved after the session", "Tu estado de ánimo mejoró después de la sesión", "تحسّن مزاجك بعد الجلسة"],
  "Générer mon exposition": ["Generate my exhibition", "Generar mi exposición", "أنشئ معرضي"],
  "Retour": ["Back", "Volver", "رجوع"],
  "Ouvrir Pages CMS": ["Open Pages CMS", "Abrir Pages CMS", "افتح Pages CMS"],
  "(s'ouvre dans un nouvel onglet)": ["(opens in a new tab)", "(se abre en una pestaña nueva)", "(يُفتح في علامة تبويب جديدة)"],
  "Pour les aveugles & malvoyants :": ["For blind and visually impaired visitors:", "Para personas ciegas y con baja visión:", "للمكفوفين وضعاف البصر:"],
  "Pour les sourds & malentendants :": ["For deaf and hard-of-hearing visitors:", "Para personas sordas y con pérdida auditiva:", "للصمّ وضعاف السمع:"],
  "Personnes aveugles & malvoyantes": ["Blind and visually impaired people", "Personas ciegas y con baja visión", "المكفوفون وضعاف البصر"],
  "Personnes sourdes & malentendantes": ["Deaf and hard-of-hearing people", "Personas sordas y con pérdida auditiva", "الصمّ وضعاف السمع"],
  "Description audio de l'œuvre": ["Audio description of the work", "Audiodescripción de la obra", "الوصف الصوتي للعمل"],
  "Partition visuelle — rythme de l'œuvre": ["Visual score — rhythm of the work", "Partitura visual: ritmo de la obra", "النوتة البصرية — إيقاع العمل"],
  "Vibrations — rythme de l'œuvre": ["Vibrations — rhythm of the work", "Vibraciones: ritmo de la obra", "الاهتزازات — إيقاع العمل"],
  "Rythme de l'œuvre": ["Rhythm of the work", "Ritmo de la obra", "إيقاع العمل"],
  "Parcours aveugles et malvoyants": ["Tour for blind and visually impaired visitors", "Recorrido para personas ciegas y con baja visión", "مسار المكفوفين وضعاف البصر"],
  "Parcours sourds et malentendants": ["Tour for deaf and hard-of-hearing visitors", "Recorrido para personas sordas y con pérdida auditiva", "مسار الصمّ وضعاف السمع"],
  "Très mal": ["Very bad", "Muy mal", "سيئ جدًا"],
  "Plutôt mal": ["Rather bad", "Bastante mal", "سيئ نوعًا ما"],
  "Neutre": ["Neutral", "Neutral", "محايد"],
  "Plutôt bien": ["Rather good", "Bastante bien", "جيد نوعًا ما"],
  "Très bien": ["Very good", "Muy bien", "جيد جدًا"],

  // ---- Générateur : recherche en direct dans les catalogues des musées
  "Sélectionnez vos préférences : l'exposition se compose automatiquement à partir de notre collection et des catalogues de musées du monde entier, interrogés en direct. Seules des œuvres du domaine public sont montrées : peintures, sculptures, architecture, dessins, arts décoratifs et photographies.": ["Choose your preferences: the exhibition is put together automatically from our collection and from the catalogues of museums around the world, searched live. Only public-domain works are shown: paintings, sculptures, architecture, drawings, decorative arts and photographs.", "Elige tus preferencias: la exposición se compone automáticamente a partir de nuestra colección y de los catálogos de museos de todo el mundo, consultados en directo. Solo se muestran obras de dominio público: pinturas, esculturas, arquitectura, dibujos, artes decorativas y fotografías.", "اختر تفضيلاتك: يُنشأ المعرض تلقائيًا من مجموعتنا ومن فهارس متاحف من حول العالم، تُستعلَم مباشرةً. لا تُعرض إلا أعمال من الملك العام: لوحات ومنحوتات وعمارة ورسوم وفنون زخرفية وصور فوتوغرافية."],
  "Types d'œuvres": ["Types of work", "Tipos de obra", "أنواع الأعمال"],
  "Peinture": ["Painting", "Pintura", "الرسم"],
  "Sculpture": ["Sculpture", "Escultura", "النحت"],
  "Architecture": ["Architecture", "Arquitectura", "العمارة"],
  "Dessins et estampes": ["Drawings and prints", "Dibujos y grabados", "رسوم ومطبوعات"],
  "Arts décoratifs": ["Decorative arts", "Artes decorativas", "الفنون الزخرفية"],
  "Photographie": ["Photography", "Fotografía", "التصوير الفوتوغرافي"],
  "Asie du Sud et du Sud-Est": ["South and Southeast Asia", "Asia meridional y sudoriental", "جنوب وجنوب شرق آسيا"],
  "Œuvres du générateur et des séances de bien-être trouvées en direct : fiches et images issues des catalogues ouverts des musées (Met, Art Institute of Chicago, Cleveland Museum of Art, SMK, Minneapolis Institute of Art, Smithsonian Institution) et d'Europeana, dans leur langue d'origine ; chaque image est créditée avec un lien vers sa fiche.": ["Works found live for the generator and the well-being sessions: records and images from the museums' open catalogues (Met, Art Institute of Chicago, Cleveland Museum of Art, SMK, Minneapolis Institute of Art, Smithsonian Institution) and from Europeana, in their original language; each image is credited with a link to its record.", "Obras encontradas en directo para el generador y las sesiones de bienestar: fichas e imágenes de los catálogos abiertos de los museos (Met, Art Institute of Chicago, Cleveland Museum of Art, SMK, Minneapolis Institute of Art, Smithsonian Institution) y de Europeana, en su idioma original; cada imagen tiene su crédito con un enlace a su ficha.", "أعمال يُعثر عليها مباشرةً للمولِّد ولجلسات العافية: بطاقات وصور من الفهارس المفتوحة للمتاحف (المتروبوليتان، معهد شيكاغو للفنون، متحف كليفلاند للفنون، SMK، معهد مينيابوليس للفنون، مؤسسة سميثسونيان) ومن يوروبيانا، بلغتها الأصلية؛ ولكل صورة إشارة إلى مصدرها مع رابط إلى بطاقتها."],
  "Musées et institutions": ["Museums and institutions", "Museos e instituciones", "متاحف ومؤسسات"],
  "Recherche en direct dans les catalogues des musées…": ["Searching museum catalogues live…", "Buscando en directo en los catálogos de los museos…", "جارٍ البحث مباشرةً في فهارس المتاحف…"],
  "Aucune œuvre ne réunit tous vos critères : voici celles qui en partagent au moins un.": ["No work matches all your choices: here are the ones that match at least one.", "Ninguna obra reúne todos tus criterios: aquí están las que cumplen al menos uno.", "لا يجمع أيّ عمل كل معاييرك: إليك الأعمال التي تستوفي معيارًا واحدًا على الأقل."],
  "Peu d'œuvres des catalogues réunissaient tous vos critères : la recherche en direct a été élargie en ignorant les thèmes.": ["Few catalogue works matched all your choices: the live search was widened by ignoring the themes.", "Pocas obras de los catálogos reunían todos tus criterios: la búsqueda en directo se amplió ignorando los temas.", "قلّة من أعمال الفهارس استوفت كل معاييرك: وُسِّع البحث المباشر بتجاهل المواضيع."],
  "L'art contemporain est peu représenté : les œuvres récentes sont protégées par le droit d'auteur, et ce site ne montre que des œuvres du domaine public.": ["Contemporary art is barely represented: recent works are protected by copyright, and this site only shows public-domain works.", "El arte contemporáneo está poco representado: las obras recientes están protegidas por derechos de autor y este sitio solo muestra obras de dominio público.", "الفن المعاصر قليل التمثيل: الأعمال الحديثة محمية بحقوق المؤلف، وهذا الموقع لا يعرض إلا أعمال الملك العام."],
  "Œuvres trouvées en direct dans les catalogues de :": ["Works found live in the catalogues of:", "Obras encontradas en directo en los catálogos de:", "أعمال وُجدت مباشرةً في فهارس:"],
  "Catalogues indisponibles pour le moment :": ["Catalogues currently unavailable:", "Catálogos no disponibles por el momento:", "فهارس غير متاحة حاليًا:"],
  "Aucune œuvre correspondant à vos choix dans :": ["No works matching your choices in:", "Ninguna obra que corresponda a su selección en:", "لا توجد أعمال تطابق اختياراتك في:"],
  "Notice Joconde des musées de France, en direct": ["Joconde record from the museums of France, live", "Ficha Joconde de los museos de Francia, en directo", "بطاقة Joconde من متاحف فرنسا، مباشرةً"],
  "Musées de France (base Joconde)": ["Museums of France (Joconde database)", "Museos de Francia (base Joconde)", "متاحف فرنسا (قاعدة Joconde)"],
  "Catalogue du musée, en direct": ["Museum catalogue, live", "Catálogo del museo, en directo", "فهرس المتحف، مباشرةً"],
  "Wikidata et Wikimedia Commons, en direct": ["Wikidata and Wikimedia Commons, live", "Wikidata y Wikimedia Commons, en directo", "ويكي بيانات وويكيميديا كومنز، مباشرةً"],
  "Musées du monde entier (Wikidata et Wikimedia Commons)": ["Museums around the world (Wikidata and Wikimedia Commons)", "Museos de todo el mundo (Wikidata y Wikimedia Commons)", "متاحف من حول العالم (ويكي بيانات وويكيميديا كومنز)"],
  "Patrimoine mondial de l'UNESCO (Wikidata et Wikimedia Commons)": ["UNESCO World Heritage (Wikidata and Wikimedia Commons)", "Patrimonio Mundial de la UNESCO (Wikidata y Wikimedia Commons)", "التراث العالمي لليونسكو (ويكي بيانات وويكيميديا كومنز)"],
  "Art Institute of Chicago": ["Art Institute of Chicago", "Instituto de Arte de Chicago", "معهد شيكاغو للفنون"],
  // ---- Mentions légales (les passages à compléter seront traduits quand le contenu sera fourni)
  "Mentions légales": ["Legal notice", "Aviso legal", "إشعار قانوني"],
  "Éditeur :": ["Publisher:", "Editor:", "الناشر:"],
  "Hébergement :": ["Hosting:", "Alojamiento:", "الاستضافة:"],
  "Directeur de la publication :": ["Publication director:", "Director de la publicación:", "مدير النشر:"],
  "Adresse et coordonnées :": ["Address and contact details:", "Dirección y datos de contacto:", "العنوان ومعلومات الاتصال:"],
  "Équipe du site :": ["Website team:", "Equipo del sitio:", "فريق الموقع:"],
  "Équipe rédactionnelle/contributeurs :": ["Editorial team/contributors:", "Equipo editorial/colaboradores:", "فريق التحرير/المساهمون:"],
  "Textes, traductions et programmation réalisés avec Claude AI (Anthropic), voir les crédits en bas de page.": ["Texts, translations and programming produced with Claude AI (Anthropic); see the credits at the bottom of the page.", "Textos, traducciones y programación realizados con Claude AI (Anthropic); véanse los créditos al pie de la página.", "النصوص والترجمات والبرمجة أُنجزت بواسطة Claude AI (Anthropic)، انظر الإشارات في أسفل الصفحة."],
  // ---- Page « Musées »
  "Musées": ["Museums", "Museos", "المتاحف"],
  "Sources des œuvres": ["Sources of the works", "Fuentes de las obras", "مصادر الأعمال"],
  "Musées et institutions du monde": ["Museums and institutions of the world", "Museos e instituciones del mundo", "متاحف ومؤسسات العالم"],
  "Le générateur d'exposition puise ses œuvres, en direct, dans les collections de ces institutions. Elles sont présentées par région, selon le lieu où elles se trouvent ; certaines conservent des œuvres venues d'autres régions.": ["The exhibition generator draws its works, live, from the collections of these institutions. They are listed by region, according to where they are located; some hold works from other regions.", "El generador de exposiciones toma sus obras, en directo, de las colecciones de estas instituciones. Se presentan por región, según el lugar donde se encuentran; algunas conservan obras procedentes de otras regiones.", "يستمدّ مولِّد المعارض أعماله مباشرةً من مجموعات هذه المؤسسات. وهي مرتّبة حسب المنطقة التي تقع فيها؛ وبعضها يحفظ أعمالًا من مناطق أخرى."],
  "Dans toutes les régions": ["In every region", "En todas las regiones", "في جميع المناطق"],
  "Patrimoine mondial de l'UNESCO (monuments)": ["UNESCO World Heritage (monuments)", "Patrimonio Mundial de la UNESCO (monumentos)", "التراث العالمي لليونسكو (المعالم)"],
  "Ces grands musées et ces bases conservent des œuvres de toutes les régions du monde, interrogées directement dans leurs catalogues ouverts. Les monuments du patrimoine mondial de l'UNESCO, ainsi que les œuvres des institutions ci-dessous, sont décrits dans Wikidata, avec des photos de Wikimedia Commons.": ["These major museums and databases hold works from every region of the world, searched directly in their open catalogues. UNESCO World Heritage monuments, and the works of the institutions below, are described in Wikidata, with photos from Wikimedia Commons.", "Estos grandes museos y bases de datos conservan obras de todas las regiones del mundo, consultadas directamente en sus catálogos abiertos. Los monumentos del Patrimonio Mundial de la UNESCO, así como las obras de las instituciones siguientes, están descritos en Wikidata, con fotos de Wikimedia Commons.", "تحفظ هذه المتاحف الكبرى وقواعد البيانات أعمالًا من جميع مناطق العالم، يُبحث عنها مباشرةً في فهارسها المفتوحة. أمّا معالم التراث العالمي لليونسكو وأعمال المؤسسات أدناه فموصوفة في ويكي بيانات، مع صور من ويكيميديا كومنز."],
  "institutions": ["institutions", "instituciones", "مؤسسة"],
  "Avec quatre musées américains dont les collections sont surtout européennes : Getty, Yale (deux musées) et Walters.": ["Including four American museums whose collections are mainly European: the Getty, Yale (two museums) and the Walters.", "Con cuatro museos estadounidenses cuyas colecciones son sobre todo europeas: Getty, Yale (dos museos) y Walters.", "مع أربعة متاحف أمريكية مجموعاتها أوروبية في معظمها: غيتي، وييل (متحفان)، ووالترز."],
  "En Europe, le générateur interroge aussi directement le catalogue du SMK – Statens Museum for Kunst (Copenhague).": ["In Europe, the generator also searches the catalogue of SMK – National Gallery of Denmark (Copenhagen) directly.", "En Europa, el generador también consulta directamente el catálogo del SMK – Galería Nacional de Dinamarca (Copenhague).", "في أوروبا، يبحث المولِّد أيضًا مباشرةً في فهرس SMK – المتحف الوطني للفنون (كوبنهاغن)."],
  "Liste mise à jour automatiquement à partir de la liste utilisée par le générateur.": ["List updated automatically from the list used by the generator.", "Lista actualizada automáticamente a partir de la lista que usa el generador.", "قائمة تُحدَّث تلقائيًا انطلاقًا من القائمة التي يستخدمها المولِّد."],
  "Œuvres et monuments de 114 institutions du monde entier et du patrimoine mondial de l'UNESCO : fiches de Wikidata et images de Wikimedia Commons, sous licence libre ; chaque image est créditée (auteur, licence et lien vers le fichier).": ["Works and monuments from 114 institutions around the world and from UNESCO World Heritage: records from Wikidata and images from Wikimedia Commons, under free licences; each image is credited (author, licence and link to the file).", "Obras y monumentos de 114 instituciones de todo el mundo y del Patrimonio Mundial de la UNESCO: fichas de Wikidata e imágenes de Wikimedia Commons, con licencia libre; cada imagen tiene su crédito (autor, licencia y enlace al archivo).", "أعمال ومعالم من 114 مؤسسة من حول العالم ومن التراث العالمي لليونسكو: بطاقات من ويكي بيانات وصور من ويكيميديا كومنز، برخص حرّة؛ ولكل صورة إشارة إلى مصدرها (المؤلف والرخصة ورابط الملف)."],
  "Œuvres des musées de France reliées à leur notice Joconde (ministère de la Culture) : fiches de Wikidata et images de Wikimedia Commons, sous licence libre ; chaque œuvre renvoie à sa notice sur la Plateforme ouverte du patrimoine (POP).": ["Works from the museums of France linked to their Joconde record (French Ministry of Culture): Wikidata records and Wikimedia Commons images, under free licences; each work links to its record on the Plateforme ouverte du patrimoine (POP).", "Obras de los museos de Francia vinculadas a su ficha Joconde (Ministerio de Cultura francés): fichas de Wikidata e imágenes de Wikimedia Commons, con licencia libre; cada obra enlaza con su ficha en la Plateforme ouverte du patrimoine (POP).", "أعمال من متاحف فرنسا مرتبطة ببطاقتها في قاعدة Joconde (وزارة الثقافة الفرنسية): بطاقات من ويكي بيانات وصور من ويكيميديا كومنز، برخصة حرة؛ ولكل عمل رابط إلى بطاقته على المنصة المفتوحة للتراث (POP)."],
  "Cleveland Museum of Art": ["Cleveland Museum of Art", "Museo de Arte de Cleveland", "متحف كليفلاند للفنون"],
  "SMK – Statens Museum for Kunst, Copenhague": ["SMK – National Gallery of Denmark, Copenhagen", "SMK – Galería Nacional de Dinamarca, Copenhague", "SMK – المتحف الوطني للفنون، كوبنهاغن"],
  "Minneapolis Institute of Art": ["Minneapolis Institute of Art", "Instituto de Arte de Minneapolis", "معهد مينيابوليس للفنون"],
  "Smithsonian Institution, Washington": ["Smithsonian Institution, Washington", "Instituto Smithsoniano, Washington", "مؤسسة سميثسونيان، واشنطن"],

  // ---- Synesthésie (musique des couleurs)
  "Musique des couleurs (synesthésie)": ["Music of colours (synaesthesia)", "Música de los colores (sinestesia)", "موسيقى الألوان (الحسّ المتزامن)"],
  "Une courte musique est composée en direct à partir des couleurs réelles de l'image : la couleur dominante choisit la note de départ, la luminosité le mode (majeur ou mineur), la saturation l'énergie et le contraste le tempo. Cette correspondance est une règle inventée pour ce site : ce n'est pas une musique liée à l'œuvre.": ["A short piece of music is composed live from the real colours of the image: the dominant colour chooses the starting note, brightness the mode (major or minor), saturation the energy and contrast the tempo. This correspondence is a rule invented for this site: it is not music linked to the work.", "Una breve pieza musical se compone en directo a partir de los colores reales de la imagen: el color dominante elige la nota de partida, la luminosidad el modo (mayor o menor), la saturación la energía y el contraste el tempo. Esta correspondencia es una regla inventada para este sitio: no es una música vinculada a la obra.", "تُؤلَّف مقطوعة قصيرة مباشرةً انطلاقًا من الألوان الحقيقية للصورة: اللون الغالب يحدّد النغمة الأولى، والسطوع يحدّد المقام (كبير أو صغير)، والتشبّع يحدّد الطاقة، والتباين يحدّد الإيقاع. هذا التوافق قاعدة ابتُكرت لهذا الموقع: ليست موسيقى مرتبطة بالعمل."],
  "Écouter la musique des couleurs": ["Listen to the music of colours", "Escuchar la música de los colores", "استمع إلى موسيقى الألوان"],
  "Arrêter la musique": ["Stop the music", "Detener la música", "أوقف الموسيقى"],
  "Lecture en cours": ["Now playing", "Reproduciendo", "قيد التشغيل"],
  "Musique terminée.": ["Music finished.", "Música terminada.", "انتهت الموسيقى."],
  "L'analyse des couleurs n'a pas pu être faite sur cet appareil.": ["The colour analysis could not be done on this device.", "No se pudo analizar los colores en este dispositivo.", "تعذّر تحليل الألوان على هذا الجهاز."],
  "Valeurs calculées à partir des couleurs réelles de l'image (règle de correspondance inventée pour ce site).": ["Values calculated from the real colours of the image (a correspondence rule invented for this site).", "Valores calculados a partir de los colores reales de la imagen (regla de correspondencia inventada para este sitio).", "قيم محسوبة انطلاقًا من الألوان الحقيقية للصورة (قاعدة توافق ابتُكرت لهذا الموقع)."],
  "Valeurs précalculées : l'analyse des couleurs n'a pas pu être faite sur cet appareil.": ["Pre-calculated values: the colour analysis could not be done on this device.", "Valores precalculados: no se pudo analizar los colores en este dispositivo.", "قيم محسوبة مسبقًا: تعذّر تحليل الألوان على هذا الجهاز."],
  "Luminosité": ["Brightness", "Luminosidad", "السطوع"],
  "Sombre": ["Dark", "Oscura", "داكنة"],
  "Nuancée": ["Nuanced", "Matizada", "متدرّجة"],
  "Lumineuse": ["Bright", "Luminosa", "مضيئة"],
  "Modérée": ["Moderate", "Moderada", "معتدلة"],
  "majeur": ["major", "mayor", "الكبير"],
  "mineur": ["minor", "menor", "الصغير"],
  "Do": ["C", "Do", "دو"], "Sol": ["G", "Sol", "صول"], "Ré": ["D", "Re", "ري"], "La": ["A", "La", "لا"],
  "Mi": ["E", "Mi", "مي"], "Si": ["B", "Si", "سي"], "Fa♯": ["F♯", "Fa♯", "فا♯"], "Ré♭": ["D♭", "Re♭", "ري♭"],
  "La♭": ["A♭", "La♭", "لا♭"], "Mi♭": ["E♭", "Mi♭", "مي♭"], "Si♭": ["B♭", "Si♭", "سي♭"], "Fa": ["F", "Fa", "فا"],
  "Les tempos, tonalités et la musique des couleurs sont calculés à partir des couleurs réelles des images, selon une règle de correspondance inventée pour ce site ; les rythmes de vibration et les textes « Si cette œuvre était une musique » sont des interprétations créatives. Aucun ne décrit une musique réelle liée aux œuvres.": ["Tempos, keys and the music of colours are calculated from the real colours of the images, using a correspondence rule invented for this site; the vibration rhythms and the “If this work were music” texts are creative interpretations. None of them describes any real music linked to the works.", "Los tempos, las tonalidades y la música de los colores se calculan a partir de los colores reales de las imágenes, según una regla de correspondencia inventada para este sitio; los ritmos de vibración y los textos «Si esta obra fuera música» son interpretaciones creativas. Ninguno describe una música real vinculada a las obras.", "تُحسب الإيقاعات والمقامات وموسيقى الألوان انطلاقًا من الألوان الحقيقية للصور، وفق قاعدة توافق ابتُكرت لهذا الموقع؛ أما إيقاعات الاهتزاز ونصوص «لو كان هذا العمل موسيقى» فهي تفسيرات إبداعية. ولا يصف أيّ منها موسيقى حقيقية مرتبطة بالأعمال."],

  // ---- Navigation, en-tête, accueil
  "Accueil": ["Home", "Inicio", "الرئيسية"],
  "Exposition": ["Exhibition", "Exposición", "المعرض"],
  "Accessibilité": ["Accessibility", "Accesibilidad", "إتاحة الوصول"],
  "Bien-être": ["Well-being", "Bienestar", "الرفاهية"],
  "Jeux": ["Games", "Juegos", "ألعاب"],
  "Admin": ["Admin", "Admin", "الإدارة"],
  "Site en construction": ["Site under construction", "Sitio en construcción", "الموقع قيد الإنشاء"],
  "L'art mondial,": ["World art,", "El arte del mundo,", "فنّ العالم،"],
  "votre regard": ["through your eyes", "con tu mirada", "بعينيك"],
  "Expositions personnalisées, accessibles aux aveugles et aux sourds, comparaisons mondiales — une plateforme culturelle unique.": ["Personalised exhibitions, accessible to blind and deaf visitors, worldwide comparisons — a unique cultural platform.", "Exposiciones personalizadas, accesibles para personas ciegas y sordas, comparaciones de todo el mundo: una plataforma cultural única.", "معارض مخصّصة، متاحة للمكفوفين والصمّ، ومقارنات من حول العالم — منصّة ثقافية فريدة."],
  "Créer mon exposition": ["Create my exhibition", "Crear mi exposición", "أنشئ معرضي"],
  "Musées représentés": ["Museums represented", "Museos representados", "متاحف ممثَّلة"],
  "Siècles d'art": ["Centuries of art", "Siglos de arte", "قرون من الفن"],
  "Ans d'art à travers le monde": ["Years of art from around the world", "Años de arte de todo el mundo", "عام من الفن عبر العالم"],
  "Langues": ["Languages", "Idiomas", "لغات"],
  "Expositions uniques": ["Unique exhibitions", "Exposiciones únicas", "معارض فريدة"],
  "Une plateforme unique au monde": ["A platform like no other", "Una plataforma única en el mundo", "منصّة فريدة في العالم"],
  "Expositions sur mesure": ["Tailor-made exhibitions", "Exposiciones a medida", "معارض حسب الطلب"],
  "Thèmes, époques et régions. Jamais la même exposition.": ["Themes, periods and regions. Never the same exhibition twice.", "Temas, épocas y regiones. Nunca la misma exposición.", "مواضيع وحقب ومناطق. لا يتكرّر المعرض أبدًا."],
  "Pour les aveugles": ["For blind visitors", "Para personas ciegas", "للمكفوفين"],
  "Description audio détaillée des œuvres du parcours.": ["Detailed audio description of the works on the tour.", "Audiodescripción detallada de las obras del recorrido.", "وصف صوتي مفصّل للأعمال الفنية في المسار."],
  "Pour les sourds": ["For deaf visitors", "Para personas sordas", "للصمّ"],
  "Partition visuelle animée et vibrations au rythme de l'œuvre (téléphones Android).": ["Animated visual score and vibrations to the rhythm of the work (Android phones).", "Partitura visual animada y vibraciones al ritmo de la obra (teléfonos Android).", "نوتة بصرية متحرّكة واهتزازات على إيقاع العمل (هواتف أندرويد)."],
  "Perspective mondiale": ["A global perspective", "Perspectiva mundial", "منظور عالمي"],
  "Comparez artistes de tous pays et toutes époques.": ["Compare artists from every country and every period.", "Compara artistas de todos los países y todas las épocas.", "قارن بين فنانين من كل البلدان وكل العصور."],
  "Expositions spéciales": ["Special exhibitions", "Exposiciones especiales", "معارض خاصة"],
  "Chargement des expositions…": ["Loading exhibitions…", "Cargando exposiciones…", "جارٍ تحميل المعارض…"],
  "Aucune exposition publiée pour le moment.": ["No exhibitions published yet.", "Todavía no hay exposiciones publicadas.", "لا توجد معارض منشورة حاليًا."],
  "Les expositions n'ont pas pu être chargées. Rechargez la page dans un instant.": ["The exhibitions could not be loaded. Please reload the page in a moment.", "No se pudieron cargar las exposiciones. Vuelve a cargar la página en un momento.", "تعذّر تحميل المعارض. أعد تحميل الصفحة بعد قليل."],
  "Comparaison mondiale": ["Worldwide comparison", "Comparación mundial", "مقارنة عالمية"],
  "Exposition spéciale": ["Special exhibition", "Exposición especial", "معرض خاص"],
  "Point de comparaison": ["Point of comparison", "Punto de comparación", "نقطة المقارنة"],
  "Lumière & ombre à travers les cultures": ["Light & shadow across cultures", "Luz y sombra a través de las culturas", "الضوء والظل عبر الثقافات"],
  "Portrait : Orient vs Occident": ["Portraiture: East vs West", "Retrato: Oriente frente a Occidente", "البورتريه: الشرق والغرب"],
  "Sacré & profane": ["Sacred & profane", "Sagrado y profano", "المقدّس والدنيوي"],
  "La nature dans l'art mondial": ["Nature in world art", "La naturaleza en el arte mundial", "الطبيعة في الفن العالمي"],
  "Corps & identité": ["Body & identity", "Cuerpo e identidad", "الجسد والهوية"],
  "Guerre & paix": ["War & peace", "Guerra y paz", "الحرب والسلام"],
  "Abstraction universelle": ["Universal abstraction", "Abstracción universal", "التجريد العالمي"],
  "Couleur & perception": ["Colour & perception", "Color y percepción", "اللون والإدراك"],
  // Titres, sous-titres et introductions des expositions spéciales (expositions.json)
  "La lumière comme langage universel": ["Light as a universal language", "La luz como lenguaje universal", "الضوء لغةً عالمية"],
  "De l'Égypte romaine à l'impressionnisme : onze visions de la lumière, d'Afrique, d'Asie et d'Europe": ["From Roman Egypt to Impressionism: eleven visions of light from Africa, Asia and Europe", "Del Egipto romano al impresionismo: once visiones de la luz, de África, Asia y Europa", "من مصر الرومانية إلى الانطباعية: إحدى عشرة رؤية للضوء من أفريقيا وآسيا وأوروبا"],
  "Sur près de dix-sept siècles (vers 200 – 1872) et trois continents, de l'Égypte à la Chine, de l'Iran à l'Éthiopie, du Japon à l'Europe, la lumière est le véritable sujet de ces œuvres. Modelé d'un visage, brume qui efface les montagnes, éclat des céramiques d'une mosquée, feu d'une fête persane, auréoles des saints ou soleil sur l'eau : naturelle ou divine, intime ou dramatique, peinte ou suggérée par le vide, elle prend dans chaque culture un sens différent.": ["Across nearly seventeen centuries (c. 200 – 1872) and three continents, from Egypt to China, from Iran to Ethiopia, from Japan to Europe, light is the true subject of these works. The modelling of a face, mist that erases the mountains, the gleam of a mosque's ceramics, the fire of a Persian feast, the haloes of saints or the sun on the water: natural or divine, intimate or dramatic, painted or suggested by emptiness, light takes on a different meaning in every culture.", "A lo largo de casi diecisiete siglos (hacia 200 – 1872) y tres continentes, de Egipto a China, de Irán a Etiopía, de Japón a Europa, la luz es el verdadero tema de estas obras. El modelado de un rostro, la bruma que borra las montañas, el brillo de la cerámica de una mezquita, el fuego de una fiesta persa, los halos de los santos o el sol sobre el agua: natural o divina, íntima o dramática, pintada o sugerida por el vacío, la luz adquiere en cada cultura un sentido distinto.", "على امتداد نحو سبعة عشر قرنًا (نحو 200 – 1872) وثلاث قارات، من مصر إلى الصين، ومن إيران إلى إثيوبيا، ومن اليابان إلى أوروبا، يبقى الضوء الموضوع الحقيقي لهذه الأعمال. تجسيم وجه، وضباب يمحو الجبال، وبريق خزف مسجد، ونار عيد فارسي، وهالات القديسين، أو الشمس على الماء: طبيعيًا كان أو إلهيًا، حميمًا أو دراميًا، مرسومًا أو موحًى به بالفراغ، يكتسب الضوء في كل ثقافة معنى مختلفًا."],
  "La couleur est relative": ["Colour is relative", "El color es relativo", "اللون نسبي"],
  "D'après L'Interaction des couleurs de Josef Albers : huit leçons du regard, de l'Égypte ancienne à l'abstraction": ["After Josef Albers's Interaction of Color: eight lessons in looking, from ancient Egypt to abstraction", "Según La interacción del color de Josef Albers: ocho lecciones de la mirada, del antiguo Egipto a la abstracción", "استنادًا إلى كتاب «تفاعل الألوان» لجوزف ألبرز: ثمانية دروس في النظر، من مصر القديمة إلى التجريد"],
  "« Dans la perception visuelle, une couleur n'est presque jamais vue telle qu'elle est réellement, physiquement. » C'est ainsi que Josef Albers (1888–1976), peintre et professeur au Bauhaus puis aux États-Unis, ouvre son livre L'Interaction des couleurs (1963). Pour lui, une couleur change selon ses voisines, selon sa quantité, selon la lumière : c'est le moyen le plus relatif de l'art. Il l'enseignait non par la théorie mais par l'expérience, avec des papiers colorés. Ses tableaux n'étant pas encore dans le domaine public, cette exposition met ses leçons à l'épreuve d'œuvres de quatre continents : Égypte ancienne, Chine, Iran, Éthiopie, Japon, Tahiti et Suède. Pour chaque œuvre, un exercice du regard vous est proposé.": ["“In visual perception a color is almost never seen as it really is — as it physically is.” This is how Josef Albers (1888–1976), painter and teacher at the Bauhaus and later in the United States, opens his book Interaction of Color (1963). For him, a colour changes with its neighbours, its quantity and the light: it is the most relative medium in art. He taught it not through theory but through experience, with coloured paper. As his paintings are not yet in the public domain, this exhibition puts his lessons to the test with works from four continents: ancient Egypt, China, Iran, Ethiopia, Japan, Tahiti and Sweden. Each work comes with an exercise in looking.", "«En la percepción visual, un color casi nunca se ve como es realmente, físicamente.» Así abre Josef Albers (1888–1976), pintor y profesor en la Bauhaus y después en Estados Unidos, su libro La interacción del color (1963). Para él, un color cambia según sus vecinos, su cantidad y la luz: es el medio más relativo del arte. Lo enseñaba no con teoría sino con la experiencia, con papeles de colores. Como sus cuadros aún no son de dominio público, esta exposición pone a prueba sus lecciones con obras de cuatro continentes: antiguo Egipto, China, Irán, Etiopía, Japón, Tahití y Suecia. Cada obra va acompañada de un ejercicio de la mirada.", "«في الإدراك البصري، لا يُرى اللون تقريبًا أبدًا كما هو في حقيقته الفيزيائية.» بهذه العبارة يفتتح جوزف ألبرز (1888–1976)، الرسّام والأستاذ في الباوهاوس ثم في الولايات المتحدة، كتابه «تفاعل الألوان» (1963). فاللون في رأيه يتغيّر بحسب جيرانه وكمّيته والضوء: إنه أكثر وسائل الفن نسبيةً. وكان يعلّمه بالتجربة لا بالنظرية، باستعمال أوراق ملوّنة. ولأن لوحاته لم تدخل الملك العام بعد، يختبر هذا المعرض دروسه على أعمال من أربع قارات: مصر القديمة والصين وإيران وإثيوبيا واليابان وتاهيتي والسويد. ويرافق كل عمل تمرينٌ في النظر."],
  "Ce contenu n'est disponible qu'en français.": ["This content is only available in French.", "Este contenido solo está disponible en francés.", "هذا المحتوى متاح باللغة الفرنسية فقط."],

  // ---- Générateur d'exposition
  "Construisez votre exposition": ["Build your exhibition", "Crea tu exposición", "اصنع معرضك"],
  "Sélectionnez vos préférences : l'exposition se compose instantanément à partir de notre collection d'œuvres du domaine public, de l'Antiquité au début du XXe siècle.": ["Choose your preferences: the exhibition is put together instantly from our collection of public-domain works, from Antiquity to the early 20th century.", "Elige tus preferencias: la exposición se compone al instante a partir de nuestra colección de obras de dominio público, desde la Antigüedad hasta principios del siglo XX.", "اختر تفضيلاتك: يُنشأ المعرض فورًا من مجموعتنا من الأعمال الفنية الواقعة في الملك العام، من العصور القديمة حتى مطلع القرن العشرين."],
  "Thèmes": ["Themes", "Temas", "المواضيع"],
  "Régions": ["Regions", "Regiones", "المناطق"],
  "Époques": ["Periods", "Épocas", "الحقب"],
  "Portraits": ["Portraits", "Retratos", "البورتريهات"],
  "Paysages": ["Landscapes", "Paisajes", "المناظر الطبيعية"],
  "Abstraction": ["Abstraction", "Abstracción", "التجريد"],
  "Spiritualité": ["Spirituality", "Espiritualidad", "الروحانية"],
  "Vie quotidienne": ["Everyday life", "Vida cotidiana", "الحياة اليومية"],
  "Mythologie": ["Mythology", "Mitología", "الأساطير"],
  "Nature morte": ["Still life", "Naturaleza muerta", "الطبيعة الصامتة"],
  "Lumière & couleur": ["Light & colour", "Luz y color", "الضوء واللون"],
  "Europe": ["Europe", "Europa", "أوروبا"],
  "Asie de l'Est": ["East Asia", "Asia oriental", "شرق آسيا"],
  "Amériques": ["The Americas", "Américas", "الأمريكتان"],
  "Afrique": ["Africa", "África", "أفريقيا"],
  "Moyen-Orient": ["Middle East", "Oriente Medio", "الشرق الأوسط"],
  "Océanie": ["Oceania", "Oceanía", "أوقيانوسيا"],
  "Antiquité": ["Antiquity", "Antigüedad", "العصور القديمة"],
  "Moyen Âge": ["Middle Ages", "Edad Media", "العصور الوسطى"],
  "Renaissance": ["Renaissance", "Renacimiento", "عصر النهضة"],
  "XVIIe–XVIIIe s.": ["17th–18th c.", "Siglos XVII–XVIII", "القرنان 17 و18"],
  "XIXe siècle": ["19th century", "Siglo XIX", "القرن التاسع عشر"],
  "Modernisme": ["Modernism", "Modernismo", "الحداثة"],
  "Art contemporain": ["Contemporary art", "Arte contemporáneo", "الفن المعاصر"],
  "Générer mon exposition →": ["Generate my exhibition →", "Generar mi exposición →", "← أنشئ معرضي"],
  "← Retour": ["← Back", "← Volver", "رجوع →"],
  "Art universel": ["Universal art", "Arte universal", "فن عالمي"],
  "Monde": ["World", "Mundo", "العالم"],
  "Toutes époques": ["All periods", "Todas las épocas", "كل الحقب"],
  "œuvre": ["work", "obra", "عمل"],
  "œuvres": ["works", "obras", "أعمال"],
  "Composition de votre exposition…": ["Putting your exhibition together…", "Componiendo tu exposición…", "جارٍ تكوين معرضك…"],
  "Aucune œuvre de la collection ne réunit tous vos critères : voici celles qui en partagent au moins un.": ["No work in the collection matches all your choices: here are the ones that match at least one.", "Ninguna obra de la colección reúne todos tus criterios: aquí están las que cumplen al menos uno.", "لا يجمع أيّ عمل في المجموعة كل معاييرك: إليك الأعمال التي تستوفي معيارًا واحدًا على الأقل."],
  "L'art contemporain n'est pas encore représenté : les œuvres récentes sont protégées par le droit d'auteur, et cette collection ne contient que des œuvres du domaine public.": ["Contemporary art is not represented yet: recent works are protected by copyright, and this collection only contains public-domain works.", "El arte contemporáneo aún no está representado: las obras recientes están protegidas por derechos de autor y esta colección solo contiene obras de dominio público.", "الفن المعاصر غير ممثَّل بعد: الأعمال الحديثة محمية بحقوق المؤلف، وهذه المجموعة لا تضم سوى أعمال من الملك العام."],
  "Aucune œuvre ne correspond pour le moment. Essayez d'autres choix.": ["No work matches for now. Try other choices.", "Por ahora ninguna obra coincide. Prueba otras opciones.", "لا يوجد عمل مطابق حاليًا. جرّب خيارات أخرى."],
  "La collection n'a pas pu être chargée. Rechargez la page dans un instant.": ["The collection could not be loaded. Please reload the page in a moment.", "No se pudo cargar la colección. Vuelve a cargar la página en un momento.", "تعذّر تحميل المجموعة. أعد تحميل الصفحة بعد قليل."],
  "Scène violente — afficher l'image": ["Violent scene — show the image", "Escena violenta: mostrar la imagen", "مشهد عنيف — اعرض الصورة"],

  // ---- Accessibilité
  "Accessibilité universelle": ["Universal accessibility", "Accesibilidad universal", "إتاحة الوصول للجميع"],
  "👁️ Pour les aveugles & malvoyants :": ["👁️ For blind and visually impaired visitors:", "👁️ Para personas ciegas y con baja visión:", "👁️ للمكفوفين وضعاف البصر:"],
  "description audio de chaque œuvre.": ["an audio description of each work.", "audiodescripción de cada obra.", "وصف صوتي لكل عمل."],
  "📳 Pour les sourds & malentendants :": ["📳 For deaf and hard-of-hearing visitors:", "📳 Para personas sordas y con pérdida auditiva:", "📳 للصمّ وضعاف السمع:"],
  "partition visuelle animée et vibrations au rythme de l'œuvre, à ressentir en tenant son téléphone (Android).": ["an animated visual score and vibrations to the rhythm of the work, felt by holding your phone (Android).", "partitura visual animada y vibraciones al ritmo de la obra, para sentir sosteniendo el teléfono (Android).", "نوتة بصرية متحرّكة واهتزازات على إيقاع العمل، تُحَسّ عند إمساك الهاتف (أندرويد)."],
  "Sélectionnez une œuvre": ["Choose a work", "Elige una obra", "اختر عملًا"],
  "👁️ Personnes aveugles & malvoyantes": ["👁️ Blind and visually impaired people", "👁️ Personas ciegas y con baja visión", "👁️ المكفوفون وضعاف البصر"],
  "Description audio détaillée : couleurs, formes, composition, contexte.": ["Detailed audio description: colours, shapes, composition, context.", "Audiodescripción detallada: colores, formas, composición, contexto.", "وصف صوتي مفصّل: الألوان والأشكال والتكوين والسياق."],
  "🔊 Description audio de l'œuvre": ["🔊 Audio description of the work", "🔊 Audiodescripción de la obra", "🔊 الوصف الصوتي للعمل"],
  "▶ Écouter la description": ["▶ Listen to the description", "▶ Escuchar la descripción", "▶ استمع إلى الوصف"],
  "⏹ Arrêter la lecture": ["⏹ Stop reading", "⏹ Detener la lectura", "⏹ أوقف القراءة"],
  "Synthèse vocale non supportée dans ce navigateur.": ["Speech synthesis is not supported in this browser.", "La síntesis de voz no es compatible con este navegador.", "تحويل النص إلى كلام غير مدعوم في هذا المتصفح."],
  "📳 Personnes sourdes & malentendantes": ["📳 Deaf and hard-of-hearing people", "📳 Personas sordas y con pérdida auditiva", "📳 الصمّ وضعاف السمع"],
  "Partition visuelle animée + vibrations du téléphone au même rythme (Android).": ["Animated visual score + phone vibrations to the same rhythm (Android).", "Partitura visual animada + vibraciones del teléfono al mismo ritmo (Android).", "نوتة بصرية متحرّكة + اهتزازات الهاتف على الإيقاع نفسه (أندرويد)."],
  "🎼 Partition visuelle — rythme de l'œuvre": ["🎼 Visual score — rhythm of the work", "🎼 Partitura visual: ritmo de la obra", "🎼 النوتة البصرية — إيقاع العمل"],
  "▶ Lancer la partition et les vibrations": ["▶ Start the score and vibrations", "▶ Iniciar la partitura y las vibraciones", "▶ شغّل النوتة والاهتزازات"],
  "⏹ Arrêter": ["⏹ Stop", "⏹ Detener", "⏹ إيقاف"],
  "▶ Lancer la partition visuelle": ["▶ Start the visual score", "▶ Iniciar la partitura visual", "▶ شغّل النوتة البصرية"],
  "〰️ Rythme de l'œuvre": ["〰️ Rhythm of the work", "〰️ Ritmo de la obra", "〰️ إيقاع العمل"],
  "Les vibrations ne fonctionnent que sur les téléphones Android. Sur cet appareil, la partition visuelle traduit le même rythme à l'écran.": ["Vibrations only work on Android phones. On this device, the visual score shows the same rhythm on screen.", "Las vibraciones solo funcionan en teléfonos Android. En este dispositivo, la partitura visual muestra el mismo ritmo en pantalla.", "لا تعمل الاهتزازات إلا على هواتف أندرويد. على هذا الجهاز، تعرض النوتة البصرية الإيقاع نفسه على الشاشة."],
  "📳 Vibrations — rythme de l'œuvre": ["📳 Vibrations — rhythm of the work", "📳 Vibraciones: ritmo de la obra", "📳 الاهتزازات — إيقاع العمل"],
  "Votre appareil peut vibrer : tenez-le en main et lancez la partition pour ressentir le rythme de l'œuvre.": ["Your device can vibrate: hold it in your hand and start the score to feel the rhythm of the work.", "Tu dispositivo puede vibrar: sostenlo en la mano e inicia la partitura para sentir el ritmo de la obra.", "يمكن لجهازك أن يهتز: أمسكه بيدك وشغّل النوتة لتشعر بإيقاع العمل."],
  "Votre appareil ne permet pas les vibrations depuis un site web (c'est le cas des iPhone et des ordinateurs) : suivez le rythme avec la partition visuelle.": ["Your device does not allow vibrations from a website (this is the case for iPhones and computers): follow the rhythm with the visual score.", "Tu dispositivo no permite vibraciones desde un sitio web (es el caso de los iPhone y los ordenadores): sigue el ritmo con la partitura visual.", "لا يسمح جهازك بالاهتزاز من موقع ويب (كما في أجهزة آيفون والحواسيب): تابع الإيقاع عبر النوتة البصرية."],
  "Tempo": ["Tempo", "Tempo", "الإيقاع"],
  "Tonalité": ["Key", "Tonalidad", "المقام"],
  "Énergie": ["Energy", "Energía", "الطاقة"],
  "Caractère": ["Character", "Carácter", "الطابع"],
  "Mi mineur": ["E minor", "Mi menor", "مي الصغير"],
  "Fa majeur": ["F major", "Fa mayor", "فا الكبير"],
  "Ré majeur": ["D major", "Re mayor", "ري الكبير"],
  "Sol pentatonique": ["G pentatonic", "Sol pentatónico", "صول الخماسي"],
  "Forte": ["Strong", "Fuerte", "قوية"],
  "Douce": ["Gentle", "Suave", "هادئة"],
  "Vive": ["Lively", "Viva", "حيوية"],
  "Méditative": ["Meditative", "Meditativa", "تأمّلية"],
  "Percussif": ["Percussive", "Percusivo", "إيقاعي"],
  "Méditatif": ["Meditative", "Meditativo", "تأمّلي"],
  "Exubérant": ["Exuberant", "Exuberante", "مفعم بالحيوية"],
  "Hypnotique": ["Hypnotic", "Hipnótico", "منوِّم"],

  // ---- Œuvres de la page Accessibilité (noms, légendes, descriptions)
  "La Grande Vague": ["The Great Wave", "La gran ola", "الموجة العظيمة"],
  "La Grande Vague de Kanagawa": ["The Great Wave off Kanagawa", "La gran ola de Kanagawa", "موجة كاناغاوا العظيمة"],
  "Nymphéas": ["Water Lilies", "Nenúfares", "زنابق الماء"],
  "Iris (Van Gogh, 1890, Saint-Rémy)": ["Irises (Van Gogh, 1890, Saint-Rémy)", "Lirios (Van Gogh, 1890, Saint-Rémy)", "السوسن (فان غوخ، 1890، سان ريمي)"],
  "Femmes de Tahiti": ["Tahitian Women", "Mujeres de Tahití", "نساء من تاهيتي"],
  "Iris": ["Irises", "Lirios", "السوسن"],
  "Metropolitan Museum of Art": ["Metropolitan Museum of Art", "Museo Metropolitano de Arte", "متحف المتروبوليتان للفنون"],
  "Musée d'Orsay, Paris (reproduction : Wikimedia Commons)": ["Musée d'Orsay, Paris (reproduction: Wikimedia Commons)", "Museo de Orsay, París (reproducción: Wikimedia Commons)", "متحف أورسيه، باريس (النسخة: ويكيميديا كومنز)"],
  "Une vague géante en forme de griffe domine la composition. Au creux de son écume blanche et dentelée, le Mont Fuji apparaît en miniature au loin, coiffé de neige. Trois embarcations de pêcheurs luttent contre le déferlement. Les teintes dominantes sont le bleu de Prusse profond, le blanc de l'écume et le beige du ciel.": ["A giant claw-shaped wave dominates the composition. In the hollow of its white, lacy foam, Mount Fuji appears in miniature in the distance, capped with snow. Three fishing boats struggle against the breaking wave. The dominant colours are deep Prussian blue, the white of the foam and the beige of the sky.", "Una ola gigantesca en forma de garra domina la composición. En el hueco de su espuma blanca y dentada aparece a lo lejos, en miniatura, el monte Fuji coronado de nieve. Tres barcas de pescadores luchan contra la rompiente. Los tonos dominantes son el azul de Prusia profundo, el blanco de la espuma y el beige del cielo.", "تهيمن على التكوين موجة عملاقة على شكل مخلب. وفي تجويف زبدها الأبيض المسنّن يظهر جبل فوجي صغيرًا في البعيد، تكلّل قمّته الثلوج. ثلاثة قوارب صيد تصارع الموج المتكسّر. الألوان الغالبة هي الأزرق البروسي العميق، وبياض الزبد، واللون البيج للسماء."],
  "La surface de l'eau occupe tout le tableau, sans horizon visible. Des grappes de feuilles de nénuphars, rondes et vertes, flottent à la surface, ponctuées de fleurs roses, blanches et jaunes. Le ciel et les arbres de la rive se reflètent dans l'eau en touches bleues, vertes et mauves. On est immergé dans l'étang — aucune rive, aucune limite visible.": ["The surface of the water fills the whole painting, with no visible horizon. Clusters of round green water-lily leaves float on the surface, dotted with pink, white and yellow flowers. The sky and the trees on the bank are reflected in the water in touches of blue, green and mauve. You are immersed in the pond — no bank, no visible edge.", "La superficie del agua ocupa todo el cuadro, sin horizonte visible. Racimos de hojas de nenúfar, redondas y verdes, flotan en la superficie, salpicados de flores rosas, blancas y amarillas. El cielo y los árboles de la orilla se reflejan en el agua en toques azules, verdes y malvas. Uno queda inmerso en el estanque: ninguna orilla, ningún límite visible.", "يملأ سطح الماء اللوحة كلّها، دون أفق ظاهر. تطفو على السطح عناقيد من أوراق زنابق الماء المستديرة الخضراء، تتخلّلها أزهار وردية وبيضاء وصفراء. وتنعكس السماء وأشجار الضفّة في الماء بلمسات زرقاء وخضراء وبنفسجية فاتحة. نحن مغمورون في البركة — لا ضفّة ولا حدود ظاهرة."],
  "Un grand bouquet d'iris bleu-violet jaillit d'un vase blanc posé sur une table vert vif. Les fleurs et leurs longues feuilles pointues partent dans tous les sens, comme si le bouquet débordait du tableau. Le fond est d'un blanc cassé : il était rose à l'origine, mais la couleur a pâli avec le temps. La peinture est posée en touches épaisses, presque en relief.": ["A large bouquet of blue-violet irises bursts from a white vase on a bright green table. The flowers and their long pointed leaves spread in every direction, as if the bouquet were overflowing the canvas. The background is off-white: it was originally pink, but the colour has faded over time. The paint is laid on in thick strokes, almost in relief.", "Un gran ramo de lirios azul violáceo brota de un jarrón blanco colocado sobre una mesa verde intenso. Las flores y sus largas hojas puntiagudas se extienden en todas direcciones, como si el ramo desbordara el cuadro. El fondo es blanco roto: originalmente era rosa, pero el color se ha desvanecido con el tiempo. La pintura está aplicada en pinceladas gruesas, casi en relieve.", "تنبثق باقة كبيرة من السوسن الأزرق البنفسجي من مزهرية بيضاء موضوعة على طاولة خضراء زاهية. تمتد الأزهار وأوراقها الطويلة المدبّبة في كل اتجاه، كأن الباقة تفيض خارج اللوحة. الخلفية بيضاء مائلة إلى الرمادي: كانت وردية في الأصل، لكن اللون بهت مع الزمن. وُضع الطلاء بضربات سميكة تكاد تكون نافرة."],
  "Deux femmes tahitiennes sont assises sur le sable d'une plage. À gauche, l'une est vue de profil, la tête baissée, une fleur blanche dans ses longs cheveux noirs ; elle porte un haut blanc et un paréo rouge à grandes fleurs blanches. À droite, l'autre est de face, en longue robe rose, et tresse des fibres entre ses mains ; elle regarde de côté, l'air grave. Derrière elles, des bandes de mer sombre et de vert ferment l'horizon.": ["Two Tahitian women sit on the sand of a beach. On the left, one is seen in profile, head bowed, a white flower in her long black hair; she wears a white top and a red pareo with large white flowers. On the right, the other faces us in a long pink dress, plaiting fibres in her hands; she looks to the side with a serious expression. Behind them, bands of dark sea and green close off the horizon.", "Dos mujeres tahitianas están sentadas en la arena de una playa. A la izquierda, una aparece de perfil, con la cabeza inclinada y una flor blanca en su largo cabello negro; lleva una blusa blanca y un pareo rojo con grandes flores blancas. A la derecha, la otra está de frente, con un largo vestido rosa, y trenza fibras entre las manos; mira de reojo con expresión grave. Detrás de ellas, franjas de mar oscuro y de verde cierran el horizonte.", "تجلس امرأتان تاهيتيتان على رمال شاطئ. على اليسار تظهر إحداهما من الجانب، مطأطئة الرأس، وفي شعرها الأسود الطويل زهرة بيضاء؛ ترتدي قميصًا أبيض وإزارًا أحمر بأزهار بيضاء كبيرة. وعلى اليمين تواجهنا الأخرى بفستان وردي طويل، وتضفر أليافًا بين يديها؛ تنظر جانبًا بملامح جادّة. وخلفهما تُغلق الأفقَ أشرطةٌ من البحر الداكن والأخضر."],
  "Si cette œuvre était une musique, elle serait percussive et tendue — comme les vagues qui déferlent. Des pulsations fortes et régulières évoqueraient la puissance de l'océan, puis une montée vers un sommet intense, suivie d'un silence soudain : le moment suspendu avant l'impact.": ["If this work were music, it would be percussive and tense — like breaking waves. Strong, regular beats would evoke the power of the ocean, then a build-up to an intense peak, followed by sudden silence: the suspended moment before impact.", "Si esta obra fuera música, sería percusiva y tensa, como las olas que rompen. Pulsaciones fuertes y regulares evocarían la potencia del océano, luego un ascenso hacia un clímax intenso, seguido de un silencio repentino: el instante suspendido antes del impacto.", "لو كان هذا العمل موسيقى، لكان إيقاعيًا ومتوترًا — كالأمواج المتكسّرة. نبضات قوية ومنتظمة تستحضر قوّة المحيط، ثم صعود نحو ذروة شديدة، يليه صمت مفاجئ: اللحظة المعلّقة قبل الارتطام."],
  "Si cette œuvre était une musique, elle serait lente et enveloppante — comme une brume qui flotte sur l'eau. Des tonalités douces et continues s'enchaînent sans rupture. Un tempo très lent, à peine perceptible, crée une sensation de temps suspendu et d'apaisement profond.": ["If this work were music, it would be slow and enveloping — like mist floating over water. Soft, continuous tones follow one another without a break. A very slow, barely perceptible tempo creates a feeling of suspended time and deep calm.", "Si esta obra fuera música, sería lenta y envolvente, como una bruma que flota sobre el agua. Tonalidades suaves y continuas se encadenan sin ruptura. Un tempo muy lento, apenas perceptible, crea una sensación de tiempo suspendido y de profunda calma.", "لو كان هذا العمل موسيقى، لكان بطيئًا ومحتضنًا — كضباب يطفو فوق الماء. نغمات ناعمة ومتواصلة تتعاقب دون انقطاع. إيقاع بطيء جدًا، يكاد لا يُدرَك، يخلق إحساسًا بزمن معلّق وسكينة عميقة."],
  "Si cette œuvre était une musique, elle serait joyeuse et irrégulière — comme les coups de pinceau énergiques de Van Gogh. Un tempo vif avec des accents imprévisibles reflète l'exubérance et la vitalité de la composition. Des explosions de joie sonore succèdent à des moments de calme.": ["If this work were music, it would be joyful and irregular — like Van Gogh's energetic brushstrokes. A lively tempo with unpredictable accents reflects the exuberance and vitality of the composition. Bursts of joyful sound follow moments of calm.", "Si esta obra fuera música, sería alegre e irregular, como las enérgicas pinceladas de Van Gogh. Un tempo vivo con acentos imprevisibles refleja la exuberancia y la vitalidad de la composición. Explosiones de alegría sonora suceden a momentos de calma.", "لو كان هذا العمل موسيقى، لكان مبهجًا وغير منتظم — كضربات فرشاة فان غوخ المفعمة بالطاقة. إيقاع سريع بنبرات غير متوقعة يعكس حيوية التكوين وفيضه. وتعقب لحظاتِ الهدوء انفجاراتٌ من البهجة الصوتية."],
  "Si cette œuvre était une musique, elle serait méditative et hypnotique — comme un chant lent et répété. Un tempo modéré avec des répétitions rythmiques régulières crée une transe douce. Des tonalités chaudes et profondes reflètent la chaleur tropicale et la mélancolie de la scène.": ["If this work were music, it would be meditative and hypnotic — like a slow, repeated chant. A moderate tempo with regular rhythmic repetitions creates a gentle trance. Warm, deep tones reflect the tropical heat and the melancholy of the scene.", "Si esta obra fuera música, sería meditativa e hipnótica, como un canto lento y repetido. Un tempo moderado con repeticiones rítmicas regulares crea un trance suave. Tonalidades cálidas y profundas reflejan el calor tropical y la melancolía de la escena.", "لو كان هذا العمل موسيقى، لكان تأمّليًا ومنوِّمًا — كترنيمة بطيئة متكرّرة. إيقاع معتدل بتكرارات منتظمة يخلق نشوة هادئة. ونغمات دافئة وعميقة تعكس الحرارة الاستوائية وكآبة المشهد."],
  "Pulsations fortes et régulières, environ une par seconde, qui montent en intensité comme le déferlement, puis s'arrêtent net pendant 2 secondes — le moment suspendu avant l'impact.": ["Strong, regular pulses, about one per second, growing in intensity like the breaking wave, then stopping dead for 2 seconds — the suspended moment before impact.", "Pulsaciones fuertes y regulares, aproximadamente una por segundo, que aumentan de intensidad como la rompiente y luego se detienen en seco durante 2 segundos: el instante suspendido antes del impacto.", "نبضات قوية ومنتظمة، نحو نبضة في الثانية، تزداد شدّتها كالموج المتكسّر، ثم تتوقف فجأة لمدة ثانيتين — اللحظة المعلّقة قبل الارتطام."],
  "Vibrations douces et continues, comme une respiration lente, avec de légères ondulations imitant celles de l'eau. Aucun pic brusque : une texture constante et enveloppante.": ["Gentle, continuous vibrations, like slow breathing, with slight ripples imitating those of the water. No sudden peaks: a constant, enveloping texture.", "Vibraciones suaves y continuas, como una respiración lenta, con ligeras ondulaciones que imitan las del agua. Ningún pico brusco: una textura constante y envolvente.", "اهتزازات ناعمة ومتواصلة، كتنفّس بطيء، مع تموّجات خفيفة تحاكي تموّجات الماء. لا ذروة مفاجئة: ملمس ثابت ومحتضن."],
  "Pulsations vives et irrégulières, environ 98 par minute, qui s'intensifient et accélèrent légèrement, comme un bouquet qui s'épanouit.": ["Lively, irregular pulses, about 98 per minute, growing stronger and speeding up slightly, like a bouquet opening up.", "Pulsaciones vivas e irregulares, unas 98 por minuto, que se intensifican y aceleran ligeramente, como un ramo que se abre.", "نبضات حيوية وغير منتظمة، نحو 98 في الدقيقة، تشتد وتتسارع قليلًا، كباقة تتفتّح."],
  "Pulsations profondes et régulières, environ 72 par minute, par séries de 8 suivies d'une pause d'une seconde — le rythme d'une respiration profonde.": ["Deep, regular pulses, about 72 per minute, in series of 8 followed by a one-second pause — the rhythm of deep breathing.", "Pulsaciones profundas y regulares, unas 72 por minuto, en series de 8 seguidas de una pausa de un segundo: el ritmo de una respiración profunda.", "نبضات عميقة ومنتظمة، نحو 72 في الدقيقة، في سلاسل من 8 تليها وقفة لثانية واحدة — إيقاع تنفّس عميق."],

  // ---- Bien-être
  "Bien-être par l'art": ["Well-being through art", "Bienestar a través del arte", "الرفاهية عبر الفن"],
  "Séances de contemplation guidées pour explorer vos émotions à travers les œuvres du domaine public.": ["Guided contemplation sessions to explore your emotions through public-domain works.", "Sesiones de contemplación guiadas para explorar tus emociones a través de obras de dominio público.", "جلسات تأمّل موجَّهة لاستكشاف مشاعرك من خلال أعمال فنية من الملك العام."],
  "Choisissez une séance": ["Choose a session", "Elige una sesión", "اختر جلسة"],
  "Apaiser le stress": ["Easing stress", "Aliviar el estrés", "تخفيف التوتر"],
  "Traverser la tristesse": ["Moving through sadness", "Atravesar la tristeza", "تجاوز الحزن"],
  "Améliorer la concentration": ["Improving focus", "Mejorar la concentración", "تحسين التركيز"],
  "Stimuler la créativité": ["Sparking creativity", "Estimular la creatividad", "تحفيز الإبداع"],
  "Regardez cette œuvre 30 secondes. Laissez votre regard se poser naturellement, sans chercher à analyser. Où se pose-t-il en premier ? Quelle couleur vous attire ?": ["Look at this work for 30 seconds. Let your gaze settle naturally, without trying to analyse. Where does it land first? Which colour draws you in?", "Mira esta obra durante 30 segundos. Deja que tu mirada se pose con naturalidad, sin intentar analizar. ¿Dónde se detiene primero? ¿Qué color te atrae?", "انظر إلى هذا العمل لمدة 30 ثانية. دع نظرك يستقر بشكل طبيعي دون محاولة التحليل. أين يستقر أولًا؟ أيّ لون يجذبك؟"],
  "Cette œuvre parle d'intensité émotionnelle. Respirez lentement. Laissez vos sentiments être là, sans les fuir. L'art peut être un miroir fidèle de nos émotions les plus profondes.": ["This work speaks of emotional intensity. Breathe slowly. Let your feelings be there, without running from them. Art can be a faithful mirror of our deepest emotions.", "Esta obra habla de intensidad emocional. Respira despacio. Deja que tus sentimientos estén ahí, sin huir de ellos. El arte puede ser un espejo fiel de nuestras emociones más profundas.", "يتحدث هذا العمل عن الشدّة العاطفية. تنفّس ببطء. دع مشاعرك حاضرة دون أن تهرب منها. يمكن للفن أن يكون مرآة صادقة لأعمق مشاعرنا."],
  "Fixez le centre de cette composition. Notez les formes, les tons, l'équilibre. Laissez votre esprit ralentir. Chaque détail est intentionnel — comme vos propres priorités.": ["Focus on the centre of this composition. Notice the shapes, the tones, the balance. Let your mind slow down. Every detail is intentional — like your own priorities.", "Fija la vista en el centro de esta composición. Observa las formas, los tonos, el equilibrio. Deja que tu mente se calme. Cada detalle es intencionado, como tus propias prioridades.", "ثبّت نظرك على مركز هذا التكوين. لاحظ الأشكال والدرجات اللونية والتوازن. دع ذهنك يتباطأ. كل تفصيل مقصود — مثل أولوياتك."],
  "Regardez les formes mouvantes, l'énergie de la composition. Qu'est-ce que cela évoque ? Il n'y a pas de bonne réponse. Laissez votre imagination créer librement.": ["Look at the moving shapes, the energy of the composition. What does it bring to mind? There is no right answer. Let your imagination create freely.", "Mira las formas en movimiento, la energía de la composición. ¿Qué te evoca? No hay respuesta correcta. Deja que tu imaginación cree libremente.", "انظر إلى الأشكال المتحرّكة وطاقة التكوين. ماذا تستحضر في ذهنك؟ لا توجد إجابة صحيحة. دع خيالك يبدع بحرّية."],
  "Votre humeur avant la séance": ["Your mood before the session", "Tu estado de ánimo antes de la sesión", "مزاجك قبل الجلسة"],
  "Votre humeur après la séance": ["Your mood after the session", "Tu estado de ánimo después de la sesión", "مزاجك بعد الجلسة"],
  "Prêt à démarrer": ["Ready to start", "Listo para empezar", "جاهز للبدء"],
  "▶ Démarrer la séance": ["▶ Start the session", "▶ Empezar la sesión", "▶ ابدأ الجلسة"],
  "▶ Reprendre": ["▶ Resume", "▶ Reanudar", "▶ استئناف"],
  "⏸ Pause": ["⏸ Pause", "⏸ Pausa", "⏸ إيقاف مؤقت"],
  "En pause": ["Paused", "En pausa", "متوقفة مؤقتًا"],
  "Séance en cours…": ["Session in progress…", "Sesión en curso…", "الجلسة جارية…"],
  "✓ Séance terminée": ["✓ Session complete", "✓ Sesión terminada", "✓ انتهت الجلسة"],
  "Journal de séance": ["Session journal", "Diario de la sesión", "دفتر الجلسة"],
  "Notez ce que vous ressentez, ce que l'œuvre évoque pour vous…": ["Write down what you feel, what the work brings to mind…", "Anota lo que sientes, lo que la obra te evoca…", "دوّن ما تشعر به وما يستحضره العمل لديك…"],
  "Résultat de votre séance": ["Your session result", "Resultado de tu sesión", "نتيجة جلستك"],
  "Avant": ["Before", "Antes", "قبل"],
  "Après": ["After", "Después", "بعد"],
  "Votre humeur s'est améliorée après la séance ✓": ["Your mood improved after the session ✓", "Tu estado de ánimo mejoró después de la sesión ✓", "تحسّن مزاجك بعد الجلسة ✓"],
  "La séance a soulevé des émotions. C'est tout à fait normal.": ["The session stirred up emotions. That is completely normal.", "La sesión ha despertado emociones. Es totalmente normal.", "أثارت الجلسة بعض المشاعر. وهذا أمر طبيعي تمامًا."],
  "Votre humeur est stable.": ["Your mood is stable.", "Tu estado de ánimo es estable.", "مزاجك مستقر."],

  // ---- Admin et crédits
  "Espace Administration": ["Administration", "Administración", "مساحة الإدارة"],
  "Les expositions se créent et se modifient dans Pages CMS, avec une connexion sécurisée par compte GitHub ou par invitation e-mail.": ["Exhibitions are created and edited in Pages CMS, with a secure login via a GitHub account or an email invitation.", "Las exposiciones se crean y modifican en Pages CMS, con un acceso seguro mediante cuenta de GitHub o invitación por correo electrónico.", "تُنشأ المعارض وتُعدَّل في Pages CMS، مع تسجيل دخول آمن عبر حساب GitHub أو دعوة بالبريد الإلكتروني."],
  "Connectez-vous à Pages CMS.": ["Log in to Pages CMS.", "Inicia sesión en Pages CMS.", "سجّل الدخول إلى Pages CMS."],
  "Ouvrez le site": ["Open the site", "Abre el sitio", "افتح الموقع"],
  ", puis": [", then", " y luego", "، ثم"],
  "Expositions": ["Exhibitions", "Exposiciones", "المعارض"],
  "Ajoutez ou modifiez une exposition, choisissez « Publiée », puis enregistrez.": ["Add or edit an exhibition, choose “Published”, then save.", "Añade o modifica una exposición, elige «Publicada» y guarda.", "أضف معرضًا أو عدّله، واختر «منشور»، ثم احفظ."],
  "Elle apparaît sur le site au bout de 1 à 2 minutes.": ["It appears on the site after 1 to 2 minutes.", "Aparece en el sitio al cabo de 1 a 2 minutos.", "يظهر على الموقع بعد دقيقة إلى دقيقتين."],
  "Ouvrir Pages CMS ↗": ["Open Pages CMS ↗", "Abrir Pages CMS ↗", "افتح Pages CMS ↗"],
  "Crédits des textes": ["Text credits", "Créditos de los textos", "حقوق النصوص"],
  "Chaque image du site est créditée juste en dessous, avec un lien vers sa source.": ["Every image on the site is credited just below it, with a link to its source.", "Cada imagen del sitio tiene su crédito justo debajo, con un enlace a su fuente.", "لكل صورة في الموقع إشارة إلى مصدرها أسفلها مباشرة، مع رابط إليه."],
  "Textes du site (descriptions audio, partitions visuelles, vibrations, séances bien-être, présentation des pages et expositions « La lumière comme langage universel » et « La couleur est relative ») — source : Claude AI (Anthropic), textes générés par intelligence artificielle.": ["Site texts (audio descriptions, visual scores, vibrations, well-being sessions, page introductions and the exhibitions “Light as a universal language” and “Colour is relative”) — source: Claude AI (Anthropic), texts generated by artificial intelligence.", "Textos del sitio (audiodescripciones, partituras visuales, vibraciones, sesiones de bienestar, presentación de las páginas y exposiciones «La luz como lenguaje universal» y «El color es relativo»): fuente: Claude AI (Anthropic), textos generados por inteligencia artificial.", "نصوص الموقع (الأوصاف الصوتية، والنوتات البصرية، والاهتزازات، وجلسات الرفاهية، وتقديم الصفحات، ومعرضا «الضوء لغةً عالمية» و«اللون نسبي») — المصدر: Claude AI (Anthropic)، نصوص مولَّدة بالذكاء الاصطناعي."],
  "Les tempos, tonalités et rythmes des partitions visuelles sont des interprétations créatives : ils ne décrivent pas une musique réelle liée aux œuvres.": ["The tempos, keys and rhythms of the visual scores are creative interpretations: they do not describe any real music linked to the works.", "Los tempos, tonalidades y ritmos de las partituras visuales son interpretaciones creativas: no describen ninguna música real vinculada a las obras.", "إيقاعات النوتات البصرية ومقاماتها هي تفسيرات إبداعية: لا تصف موسيقى حقيقية مرتبطة بالأعمال."],
  "Informations sur les œuvres (titres, artistes, dates, lieux de conservation) — source : les musées et la base Wikimedia Commons cités ci-dessus.": ["Information about the works (titles, artists, dates, holding institutions) — source: the museums and the Wikimedia Commons database cited above.", "Información sobre las obras (títulos, artistas, fechas, lugares de conservación): fuente: los museos y la base Wikimedia Commons citados.", "معلومات الأعمال (العناوين والفنانون والتواريخ وأماكن الحفظ) — المصدر: المتاحف وقاعدة ويكيميديا كومنز المذكورة."],
  "Traductions anglaise, espagnole et arabe : Claude AI (Anthropic), non relues par des traducteurs.": ["English, Spanish and Arabic translations: Claude AI (Anthropic), not reviewed by translators.", "Traducciones al inglés, español y árabe: Claude AI (Anthropic), no revisadas por traductores.", "الترجمات الإنجليزية والإسبانية والعربية: Claude AI (Anthropic)، لم يراجعها مترجمون."],
  "Image :": ["Image:", "Imagen:", "الصورة:"],
  "source": ["source", "fuente", "المصدر"],

  // ---- Lieux, artistes, titres, dates et musées de la collection
  "Japon": ["Japan", "Japón", "اليابان"],
  "France": ["France", "Francia", "فرنسا"],
  "Pays-Bas": ["Netherlands", "Países Bajos", "هولندا"],
  "Angleterre": ["England", "Inglaterra", "إنجلترا"],
  "Italie": ["Italy", "Italia", "إيطاليا"],
  "Égypte": ["Egypt", "Egipto", "مصر"],
  "Mexique": ["Mexico", "México", "المكسيك"],
  "Chine": ["China", "China", "الصين"],
  "Suède": ["Sweden", "Suecia", "السويد"],
  "États-Unis": ["United States", "Estados Unidos", "الولايات المتحدة"],
  "Boscoreale, Italie": ["Boscoreale, Italy", "Boscoreale, Italia", "بوسكوريالي، إيطاليا"],
  "Ispahan, Iran": ["Isfahan, Iran", "Isfahán, Irán", "أصفهان، إيران"],
  "Tabriz, Iran": ["Tabriz, Iran", "Tabriz, Irán", "تبريز، إيران"],
  "France et Pays-Bas du Sud": ["France and the Southern Netherlands", "Francia y Países Bajos del Sur", "فرنسا وجنوب الأراضي المنخفضة"],
  "Pays-Bas du Sud (Flandre)": ["Southern Netherlands (Flanders)", "Países Bajos del Sur (Flandes)", "جنوب الأراضي المنخفضة (فلاندرز)"],
  "Éthiopie (Amhara)": ["Ethiopia (Amhara)", "Etiopía (Amhara)", "إثيوبيا (أمهرة)"],
  "Paris, par un peintre américain": ["Paris, by an American painter", "París, por un pintor estadounidense", "باريس، بريشة رسّام أمريكي"],
  "Saint-Rémy-de-Provence, France": ["Saint-Rémy-de-Provence, France", "Saint-Rémy-de-Provence, Francia", "سان ريمي دو بروفانس، فرنسا"],
  "Tahiti, par un peintre français": ["Tahiti, by a French painter", "Tahití, por un pintor francés", "تاهيتي، بريشة رسّام فرنسي"],
  "Giverny, France": ["Giverny, France", "Giverny, Francia", "جيفرني، فرنسا"],
  "Atelier égyptien, Moyen Empire": ["Egyptian workshop, Middle Kingdom", "Taller egipcio, Imperio Medio", "ورشة مصرية، الدولة الوسطى"],
  "Artiste olmèque": ["Olmec artist", "Artista olmeca", "فنان أولميكي"],
  "Peintres romains": ["Roman painters", "Pintores romanos", "رسّامون رومان"],
  "Peintre de l'Égypte romaine": ["Painter from Roman Egypt", "Pintor del Egipto romano", "رسّام من مصر الرومانية"],
  "Atelier d'Ispahan": ["Isfahan workshop", "Taller de Isfahán", "ورشة أصفهان"],
  "Carton français, tissage des Pays-Bas du Sud": ["French design, woven in the Southern Netherlands", "Cartón francés, tejido en los Países Bajos del Sur", "تصميم فرنسي، نُسج في جنوب الأراضي المنخفضة"],
  "Texte d'Abu'l Qasim Firdausi": ["Text by Abu'l Qasim Firdausi", "Texto de Abu'l Qasim Firdausi", "نص أبي القاسم الفردوسي"],
  "Artiste des hauts plateaux du nord": ["Artist from the northern highlands", "Artista de las tierras altas del norte", "فنان من المرتفعات الشمالية"],
  "Le Caravage": ["Caravaggio", "Caravaggio", "كارافاجيو"],
  "Pieter Bruegel l'Ancien": ["Pieter Bruegel the Elder", "Pieter Brueghel el Viejo", "بيتر بروغل الأكبر"],
  "Hippopotame dit « William »": ["Hippopotamus known as “William”", "Hipopótamo llamado «William»", "فرس النهر المعروف باسم «ويليام»"],
  "Figure assise sur un banc": ["Figure seated on a bench", "Figura sentada en un banco", "تمثال جالس على مقعد"],
  "Chambre (cubiculum) de la villa de Publius Fannius Synistor à Boscoreale": ["Bedroom (cubiculum) from the villa of Publius Fannius Synistor at Boscoreale", "Dormitorio (cubiculum) de la villa de Publio Fannio Sinistor en Boscoreale", "غرفة نوم (كوبيكولوم) من فيلا بوبليوس فانيوس سينيستور في بوسكوريالي"],
  "Portrait d'un jeune homme (portrait du Fayoum)": ["Portrait of a young man (Fayum portrait)", "Retrato de un joven (retrato de El Fayum)", "صورة شاب (بورتريه الفيوم)"],
  "Vieux arbres, lointain plat": ["Old Trees, Level Distance", "Árboles viejos, lejanía llana", "أشجار عتيقة وأفق مستوٍ"],
  "Mihrab (niche de prière)": ["Mihrab (prayer niche)", "Mihrab (nicho de oración)", "محراب"],
  "La Licorne au repos dans un jardin (Tapisseries de la Licorne)": ["The Unicorn Rests in a Garden (Unicorn Tapestries)", "El unicornio descansa en un jardín (Tapices del unicornio)", "وحيد القرن يستريح في حديقة (منسوجات وحيد القرن)"],
  "La Fête de Sada, page du Shahnameh (Livre des rois) de Shah Tahmasp": ["The Feast of Sada, page from the Shahnameh (Book of Kings) of Shah Tahmasp", "La fiesta de Sada, página del Shahnameh (Libro de los reyes) de Shah Tahmasp", "عيد السَّدَه، صفحة من الشاهنامه (كتاب الملوك) للشاه طهماسب"],
  "Les Moissonneurs": ["The Harvesters", "Los segadores", "الحصّادون"],
  "Judith décapitant Holopherne": ["Judith Beheading Holofernes", "Judit decapitando a Holofernes", "يهوديت تقطع رأس هولوفرنيس"],
  "La Ronde de nuit": ["The Night Watch", "La ronda de noche", "دورية الليل"],
  "La Jeune Fille à la perle": ["Girl with a Pearl Earring", "La joven de la perla", "الفتاة ذات القرط اللؤلؤي"],
  "Triptyque : Ewostatewos et huit de ses disciples": ["Triptych: Ewostatewos and eight of his disciples", "Tríptico: Ewostatewos y ocho de sus discípulos", "لوحة ثلاثية: إوستاتيوس وثمانية من تلاميذه"],
  "Iris à Yatsuhashi (les Huit Ponts)": ["Irises at Yatsuhashi (Eight Bridges)", "Lirios en Yatsuhashi (los Ocho Puentes)", "السوسن في ياتسوهاشي (الجسور الثمانية)"],
  "Cent vues du mont Fuji": ["One Hundred Views of Mount Fuji", "Cien vistas del monte Fuji", "مئة منظر لجبل فوجي"],
  "Pluie, vapeur et vitesse": ["Rain, Steam and Speed", "Lluvia, vapor y velocidad", "مطر وبخار وسرعة"],
  "Madame X (Virginie Amélie Avegno Gautreau)": ["Madame X (Virginie Amélie Avegno Gautreau)", "Madame X (Virginie Amélie Avegno Gautreau)", "مدام إكس (فيرجيني أميلي أفينيو غوترو)"],
  "Le Gulf Stream": ["The Gulf Stream", "La corriente del Golfo", "تيار الخليج"],
  "Le Cygne, n° 17 (série SUW, groupe IX)": ["The Swan, No. 17 (SUW series, group IX)", "El cisne, n.º 17 (serie SUW, grupo IX)", "البجعة، رقم 17 (سلسلة SUW، المجموعة التاسعة)"],
  "vers 1961–1878 av. J.-C.": ["c. 1961–1878 BCE", "h. 1961–1878 a. C.", "حوالي 1961–1878 ق.م"],
  "1000–400 av. J.-C.": ["1000–400 BCE", "1000–400 a. C.", "1000–400 ق.م"],
  "vers 50–40 av. J.-C.": ["c. 50–40 BCE", "h. 50–40 a. C.", "حوالي 50–40 ق.م"],
  "190–210 apr. J.-C.": ["190–210 CE", "190–210 d. C.", "190–210 م"],
  "vers 1080": ["c. 1080", "h. 1080", "حوالي 1080"],
  "vers 1525": ["c. 1525", "h. 1525", "حوالي 1525"],
  "vers 1599–1602 (datation discutée)": ["c. 1599–1602 (date debated)", "h. 1599–1602 (datación discutida)", "حوالي 1599–1602 (تأريخ مختلف عليه)"],
  "vers 1665": ["c. 1665", "h. 1665", "حوالي 1665"],
  "fin du XVIIe siècle": ["late 17th century", "finales del siglo XVII", "أواخر القرن السابع عشر"],
  "après 1709": ["after 1709", "después de 1709", "بعد 1709"],
  "vers 1830–1832": ["c. 1830–1832", "h. 1830–1832", "حوالي 1830–1832"],
  "vers 1830-1832": ["c. 1830–1832", "h. 1830–1832", "حوالي 1830–1832"],
  "1899, repris jusqu'en 1906": ["1899, reworked until 1906", "1899, retocado hasta 1906", "1899، أُعيد العمل عليها حتى 1906"],
  "The Metropolitan Museum of Art (The Cloisters), New York": ["The Metropolitan Museum of Art (The Cloisters), New York", "Museo Metropolitano de Arte (The Cloisters), Nueva York", "متحف المتروبوليتان للفنون (ذا كلويسترز)، نيويورك"],
  "The Metropolitan Museum of Art, New York": ["The Metropolitan Museum of Art, New York", "Museo Metropolitano de Arte, Nueva York", "متحف المتروبوليتان للفنون، نيويورك"],
  "Metropolitan Museum of Art, New York": ["Metropolitan Museum of Art, New York", "Museo Metropolitano de Arte, Nueva York", "متحف المتروبوليتان للفنون، نيويورك"],
  "Galleria Nazionale d'Arte Antica, palais Barberini, Rome": ["Galleria Nazionale d'Arte Antica, Palazzo Barberini, Rome", "Galleria Nazionale d'Arte Antica, Palacio Barberini, Roma", "الغاليريا الوطنية للفن القديم، قصر باربريني، روما"],
  "Rijksmuseum, Amsterdam": ["Rijksmuseum, Amsterdam", "Rijksmuseum, Ámsterdam", "متحف رايكس، أمستردام"],
  "Mauritshuis, La Haye": ["Mauritshuis, The Hague", "Mauritshuis, La Haya", "موريتسهاوس، لاهاي"],
  "National Gallery, Londres": ["National Gallery, London", "National Gallery, Londres", "المعرض الوطني، لندن"],
  "Musée d'Orsay, Paris": ["Musée d'Orsay, Paris", "Museo de Orsay, París", "متحف أورسيه، باريس"],
  "Fondation Hilma af Klint, Stockholm": ["Hilma af Klint Foundation, Stockholm", "Fundación Hilma af Klint, Estocolmo", "مؤسسة هيلما أف كلينت، ستوكهولم"]
};

// Remplacements dans les lignes de crédit des images (« Image : …, via …, domaine public »)
const TRAD_CREDITS = [
  ["Image :", ["Image:", "Imagen:", "الصورة:"]],
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
  [", via", [", via", ", vía", "، عبر"]]
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
  if ((r = m.match(/^(\d+) min$/))) return langue === 'ar' ? r[1] + ' دقيقة' : r[1] + ' min';
  if (/\d/.test(m) && /vers |J\.-C\./.test(m)) { let s = m; DATES.forEach(([re, tr]) => { s = s.replace(re, tr[RANG[langue]]); }); return s; }
  return null;
}
// Textes composés de morceaux séparés par « — », « · », « & » ou « , » (titres d'exposition, légendes…)
function traduireCompose(s) {
  const parts = s.split(/( — | · | & |, )/);
  if (parts.length < 3) { const m = traduireMorceau(s); return m === null ? null : m; }
  const out = []; let trouve = false;
  for (let i = 0; i < parts.length; i += 2) {
    let fait = false;
    for (let j = parts.length - 1; j >= i; j -= 2) { // on essaie d'abord le plus long assemblage connu
      const cand = parts.slice(i, j + 1).join('');
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
function changerLangue(l) {
  if (!LANGUES[l]) return;
  langue = l;
  try { localStorage.setItem('jrb-langue', l); } catch (e) {}
  traduirePage();
  if (typeof apresChangementLangue === 'function') apresChangementLangue();
}
// Tout texte ajouté ou modifié par le code est traduit au passage suivant
let attenteTrad = false;
new MutationObserver(() => {
  if (enCours || attenteTrad) return;
  attenteTrad = true;
  setTimeout(() => { attenteTrad = false; traduirePage(); }, 15); // court délai : fonctionne aussi dans un onglet en arrière-plan
}).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRIBUTS });
