import { EditorialStory } from "./types";

export const editorialStories: EditorialStory[] = [
  // ── original anchor stories (linked from bundle pages) ──────────────────
  {
    id: "hochzeit-uhr-guide",
    title: "Die perfekte Uhr für den schönsten Tag",
    excerpt:
      "Warum eine Patek Philippe Calatrava der ideale Begleiter für Ihre Hochzeit ist — und wie Sie sie für sieben Tage mieten können.",
    occasion: "Hochzeit",
    brand: "Patek Philippe",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-15",
    heroImageAlt: "Patek Philippe Calatrava am Handgelenk eines Bräutigams",
    bundleSlugs: ["hochzeitswoche-patek"],
    relatedSlugs: ["die-hochzeit", "gala-charity-abend", "geburtstag"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Der Tag der Hochzeit ist ein Moment, der für immer bleibt. Jedes Detail zählt — das Sakko, die Schuhe, der Ring. Und am Handgelenk? Da sollte etwas liegen, das diesem Moment gerecht wird.",
      },
      { type: "heading", text: "Warum die Calatrava?" },
      {
        type: "paragraph",
        text: "Die Patek Philippe Calatrava ist die Essenz der Genfer Uhrmacherkunst: schlank, zurückhaltend, zeitlos. Kein Chronograph, keine Komplikation — nur reines Design und Perfektion im Detail. Genau das macht sie zum idealen Begleiter für einen Anlass, bei dem Understatement die stärkste Aussage ist.",
      },
      { type: "watch_cta", bundleSlug: "hochzeitswoche-patek" },
      { type: "heading", text: "Sieben Tage, nicht nur einer" },
      {
        type: "paragraph",
        text: "Die meisten denken bei einer Hochzeitsuhr an den Tag selbst. Aber die schönsten Momente beginnen vorher — beim letzten Fitting, beim Probeessen, bei der Ankunft am Venue. Mit unserer Hochzeitswoche tragen Sie die Calatrava sieben volle Tage: von der Generalprobe bis zum letzten Frühstück als Verheiratete.",
      },
      {
        type: "image",
        alt: "Detail der Calatrava-Krone und des Zifferblatts im Abendlicht",
        caption: "Die Calatrava im Abendlicht — dezent, aber unvergesslich.",
      },
      {
        type: "paragraph",
        text: "Persönliche Übergabe in Berlin, München oder Hamburg. 24/7-Concierge. Premium-Versicherung inklusive. Sie denken nur an Ihren Tag — wir kümmern uns um den Rest.",
      },
      { type: "heading", text: "Was Ihre Gäste nicht wissen müssen" },
      {
        type: "paragraph",
        text: "Luxus muss nicht Eigentum bedeuten. Die schönsten Dinge im Leben sind oft geliehen — ein Moment, ein Blick, ein Sonnenuntergang. Eine Uhr, die Geschichte erzählt, ohne Ihre zu sein. Das ist die Philosophie von Marlo: Zugang statt Besitz.",
      },
    ],
  },
  {
    id: "gala-look-rolex",
    title: "Gala-Abend: Ihr Handgelenk verdient Applaus",
    excerpt:
      "Von der Einladung bis zum letzten Tanz — warum die Rolex Daytona das Statement-Stück jeder Gala ist.",
    occasion: "Gala",
    brand: "Rolex",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-10",
    heroImageAlt: "Rolex Daytona auf schwarzem Samt neben einer Gala-Einladung",
    bundleSlugs: ["gala-wochenende-rolex-daytona"],
    relatedSlugs: ["gala-charity-abend", "silvester", "kunst-kultur-vernissage"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Eine Gala ist Theater — und Sie sind die Hauptrolle. Das Outfit sitzt, der Einstecktuch ist gefaltet, die Schuhe glänzen. Fehlt nur noch das Finale am Handgelenk.",
      },
      { type: "heading", text: "Die Daytona: Für Männer, die ankommen" },
      {
        type: "paragraph",
        text: "Die Rolex Daytona ist kein dezenter Begleiter — sie ist ein Statement. Ihr Keramik-Lünettenring, die drei Totalisatoren, das massive Oyster-Gehäuse: Diese Uhr sagt, dass Sie da sind. Und zwar nicht zufällig.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona" },
      {
        type: "paragraph",
        text: "Unser Gala-Wochenende umfasst drei Tage: Versand am Donnerstag, Rücksendung am Montag. Weiße-Handschuhe-Lieferung, Concierge-Hotline, alles inklusive. Sie konzentrieren sich auf Ihren Auftritt.",
      },
      {
        type: "image",
        alt: "Nahaufnahme der Daytona-Totalisatoren im Kerzenlicht",
        caption: "Drei Totalisatoren, ein Abend, tausend Blicke.",
      },
      {
        type: "paragraph",
        text: "Und falls Sie noch Manschettenknöpfe brauchen: Unsere optionalen Smoking-Hemdmanschetten passen perfekt zum Look. Fragen Sie beim Buchen danach.",
      },
    ],
  },
  {
    id: "jubilaeum-royal-oak",
    title: "30 Tage Royal Oak: Ein Jubiläum, das sich wie Luxus anfühlt",
    excerpt:
      "Ein ganzer Monat mit der Audemars Piguet Royal Oak — unser ausführlichster Erlebnisbericht.",
    occasion: "Jubiläum",
    brand: "Audemars Piguet",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-01",
    heroImageAlt: "Audemars Piguet Royal Oak auf einem Schreibtisch neben einem Champagnerglas",
    bundleSlugs: ["jubilaeum-audemars-piguet"],
    relatedSlugs: ["geburtstag", "vatertag", "gala-look-rolex"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Was passiert, wenn man eine der ikonischsten Uhren der Welt nicht nur einen Abend, sondern einen ganzen Monat lang trägt? Wir haben es ausprobiert.",
      },
      { type: "heading", text: "Tag 1–7: Die Eingewöhnung" },
      {
        type: "paragraph",
        text: "Die Royal Oak ist schwerer als erwartet. Nicht unangenehm — aber präsent. Man spürt sie. Im Büro, beim Abendessen, beim Autofahren. Die achteckige Lünette fängt das Licht auf eine Art, die Gespräche startet. In der ersten Woche wurde ich dreimal darauf angesprochen.",
      },
      { type: "watch_cta", bundleSlug: "jubilaeum-audemars-piguet" },
      { type: "heading", text: "Tag 8–21: Sie gehört zu mir" },
      {
        type: "paragraph",
        text: "Ab der zweiten Woche hört man auf, sie als geliehen zu betrachten. Sie wird Teil des Outfits, des Morgenrituals, des Selbstbilds. Der Tapisserie-Zifferblatt ist ein Kunstwerk, das man erst nach Tagen wirklich sieht — bei jedem Lichtwinkel anders.",
      },
      {
        type: "image",
        alt: "Royal Oak Tapisserie-Zifferblatt in natürlichem Tageslicht",
        caption: "Das Tapisserie-Muster — bei jedem Lichtwinkel ein neues Bild.",
      },
      {
        type: "paragraph",
        text: "Für Jubiläen empfehlen wir die optionale Foto-Session: Ein professioneller Fotograf hält den Moment fest — Sie, die Uhr, den Anlass. Bilder, die bleiben, wenn die Uhr zurückgeht.",
      },
      { type: "heading", text: "Tag 22–30: Der Abschied" },
      {
        type: "paragraph",
        text: "Die letzten Tage sind die intensivsten. Man weiß, dass es endet — und genau das macht jeden Blick aufs Handgelenk bewusster. Luxus ist nicht Besitz. Luxus ist Bewusstsein.",
      },
    ],
  },

  // ── 10 lookbook backfill (MAR-92 / MAR-146) ─────────────────────────────
  {
    id: "die-hochzeit",
    title: "Die Hochzeit: Die Uhr, die bleibt",
    excerpt:
      "Vier Uhren, ein Anlass — welche Datejust, Calatrava oder Omega wirklich zum Bräutigam passt, und warum die richtige Wahl sieben Tage beginnt.",
    occasion: "Hochzeit",
    brand: "Rolex",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-20",
    heroImageAlt: "Rolex Datejust am Handgelenk eines Bräutigams, weißes Manschettenhemd, verschwommenes Bouquet im Hintergrund",
    metaTitle: "Luxusuhr zur Hochzeit mieten | marianni",
    metaDescription: "Datejust, Calatrava & Omega zur Hochzeit — Lieferung am Vorabend, Versicherung inkl., Concierge. Ab €89/Wochenende.",
    bundleSlugs: ["hochzeitswoche-patek"],
    relatedSlugs: ["gala-charity-abend", "geburtstag", "erstes-date"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Die Hochzeit ist der Tag, an dem jede Entscheidung bleibt — im Album, in der Erinnerung, auf jedem Foto. Am Handgelenk des Bräutigams liegt mehr als eine Uhr. Es liegt eine Haltung.",
      },
      { type: "heading", text: "Vier Uhren für vier Gelegenheiten" },
      {
        type: "paragraph",
        text: "Die Rolex Datejust 36 in Weißgold ist das klassische Hochzeitsstatement: Jubilé-Armband, Champagner-Zifferblatt, diskrete Fluted-Lünette. Sie passt zum Smoking wie zur modernen Anzughose. Die Patek Philippe Calatrava 5196R geht tiefer — minimalistisch, handaufgezogen, ein Erbteil für die Nachwelt. Wer ein offenes Statement bevorzugt, wählt die Omega De Ville Prestige Co-Axial: elegant ohne Prahlen, präzise ohne Kompromisse.",
      },
      { type: "watch_cta", bundleSlug: "hochzeitswoche-patek" },
      { type: "heading", text: "Sieben Tage für einen einzigen Moment" },
      {
        type: "paragraph",
        text: "Das Hochzeits-Bundle startet am Dienstag vor dem großen Tag. Wir liefern persönlich in Berlin, München oder Hamburg — weiße Handschuhe, Tragehinweise, Concierge-Nummer. So tragen Sie die Uhr bereits beim Junggesellenabend, beim Probeessen, beim letzten Fitting. Der eigentliche Hochzeitstag wird der Tag, an dem Sie sie vergessen — weil sie einfach sitzt.",
      },
      {
        type: "image",
        alt: "Detail der Rolex Datejust-Lünette im Morgenlicht",
        caption: "Fluted-Lünette und Jubilé-Armband — Hochzeitsklassiker seit 1945.",
      },
      {
        type: "paragraph",
        text: "Rücksendung am Montag nach der Hochzeit. Versicherung Premium inklusive. Und falls die Uhr doch Ihre werden soll: Wir vermitteln bei Interesse an die besten Boutiquen Europas.",
      },
    ],
  },
  {
    id: "gala-charity-abend",
    title: "Gala & Charity-Abend: Wenn der Abend anfängt, fällt Ihr Handgelenk auf",
    excerpt:
      "Royal Oak, Day-Date & Portugieser für Gala-Abende — welche Uhr zu welchem Smoking passt, und warum drei Tage Mietdauer kein Zufall sind.",
    occasion: "Gala",
    brand: "Audemars Piguet",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-18",
    heroImageAlt: "Audemars Piguet Royal Oak auf einem Smoking-Revers, einzelne Punktlichtquelle, dunkler Hintergrund",
    metaTitle: "Uhr für Gala & Charity mieten | marianni",
    metaDescription: "Royal Oak, Day-Date & Portugieser für Gala-Abende — Concierge-Service, Versicherung inkl. Ab €139/Abend.",
    bundleSlugs: ["gala-wochenende-rolex-daytona"],
    relatedSlugs: ["die-hochzeit", "silvester", "kunst-kultur-vernissage"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Ein Charity-Gala-Abend ist kein Abend unter vielen. Es ist Theater mit echtem Publikum — Unternehmer, Mäzene, Journalisten. Was Sie am Handgelenk tragen, wird gesehen. Und erinnert.",
      },
      { type: "heading", text: "Drei Uhren, drei Statements" },
      {
        type: "paragraph",
        text: "Die Audemars Piguet Royal Oak in Stahl ist die kompromisslose Wahl: achteckige Lünette, integriertes Armband, Tapisserie-Zifferblatt. Sie braucht keinen Smoking — sie ist der Smoking. Der Rolex Day-Date 40 in Gelbgold spielt eine andere Karte: präsidiale Autorität, warmem Schimmer, Oyster-Perpetual-Mechanik. Und die IWC Portugieser Chronograph geht dem Abend eine intellektuelle Tiefe — Fliegerästhetik trifft auf klassischen Anzug.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona" },
      { type: "heading", text: "Donnerstag rein, Montag raus" },
      {
        type: "paragraph",
        text: "Das Gala-Wochenende-Bundle startet Donnerstag und endet Montag früh. Drei Tage: für den Vorabend-Empfang, den Gala-Hauptabend, den Brunch am Sonntag. Concierge-Nummer inklusive — falls das Armband am Abend klemmt.",
      },
      {
        type: "image",
        alt: "IWC Portugieser Chronograph im Kerzenlicht eines Gala-Empfangs",
        caption: "Der Portugieser bei Nacht: Fliegeruhr trifft schwarze Krawatte.",
      },
      {
        type: "paragraph",
        text: "Zusatzoption: Smoking-Hemdmanschetten, die perfekt zu Daytona oder Royal Oak passen. Beim Buchen einfach ankreuzen.",
      },
    ],
  },
  {
    id: "business-dinner",
    title: "Business-Dinner: Die Uhr, die Vertrauen schafft, bevor Sie sprechen",
    excerpt:
      "De Ville, Portugieser & Datejust für wichtige Meetings — welche Uhr Ihre Kompetenz unterstreicht, ohne Ihren Gesprächspartner einzuschüchtern.",
    occasion: "Business",
    brand: "Omega",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-17",
    heroImageAlt: "Omega De Ville am Handgelenk auf einem dunklen Walnuss-Konferenztisch, Füller und Notizbuch im Hintergrund",
    metaTitle: "Uhr fürs Business-Dinner mieten | marianni",
    metaDescription: "De Ville, Portugieser & Datejust für wichtige Meetings — Lieferung am Vorabend, diskret & versichert. Ab €49/Tag.",
    bundleSlugs: [],
    relatedSlugs: ["wochenend-ausflug-genf-wien", "erstes-date", "vatertag"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Beim Business-Dinner kommuniziert alles — der Handschlag, die Menüwahl, das Schweigen zwischen zwei Sätzen. Und am Handgelenk: eine Uhr, die Kompetenz zeigt, ohne Dominanz zu markieren.",
      },
      { type: "heading", text: "Drei Uhren für drei Verhandlungsrollen" },
      {
        type: "paragraph",
        text: "Die Omega De Ville Prestige ist die diplomatischste Wahl: klares Zifferblatt, dezentes Gehäuse, Co-Axial-Präzision. Sie stört nicht — sie beruhigt. Die IWC Portugieser Automatic setzt ein klares Zeichen für technisches Verständnis und handwerkliche Tiefe: 44,2 mm, Handaufzug, Arabic numerals. Und die Rolex Datejust 41 in Oystersteel schließt die Mitte — weder zu still noch zu laut, eine Uhr für Räume, in denen Entscheidungen fallen.",
      },
      { type: "watch_cta_generic" },
      { type: "heading", text: "Der richtige Zeitpunkt: am Vorabend" },
      {
        type: "paragraph",
        text: "Wir liefern am Tag vor Ihrem Meeting. So können Sie die Uhr über Nacht anlegen, das Gewicht spüren, sich eingewöhnen. Eine fremde Uhr am Handgelenk beim ersten wichtigen Handschlag — das bemerkt man. Zwei Stunden Eingewöhnung kosten nichts.",
      },
      {
        type: "image",
        alt: "Rolex Datejust 41 auf weißem Hemdärmel, gekreuzte Hände über einem Vertragsdeckblatt",
        caption: "Die Datejust 41 — diskrete Stärke am Verhandlungstisch.",
      },
      {
        type: "paragraph",
        text: "Für Business-Anlässe empfehlen wir Mietdauer ab zwei Tagen: Vorabend plus Haupttag. Versicherung Premium inklusive, Rücksendung per Kurier am Folgetag.",
      },
    ],
  },
  {
    id: "wochenend-ausflug-genf-wien",
    title: "Wochenend-Ausflug: Genf oder Wien — die richtige Uhr für jede Stadt",
    excerpt:
      "Ballon Bleu, Aqua Terra & Longines für Wochenend-Ausflüge — warum das Reiseziel die Uhrenentscheidung beeinflusst.",
    occasion: "Reise",
    brand: "Cartier",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-16",
    heroImageAlt: "Cartier Ballon Bleu auf Leinentuch neben einem Espresso, Wiener Straße im Hintergrund unscharf",
    metaTitle: "Uhr für Genf & Wien Wochenende | marianni",
    metaDescription: "Ballon Bleu, Aqua Terra & Longines — Wochenend-Ausflug in Genf oder Wien, Versicherung inkl. Ab €59/Wochenende.",
    bundleSlugs: ["gala-wochenende-rolex-daytona"],
    relatedSlugs: ["sommerurlaub-mittelmeer", "kunst-kultur-vernissage", "business-dinner"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Genf und Wien sind keine beliebigen Städte. Genf ist die Welthauptstadt der feinen Mechanik — hier trägt man eine Uhr mit Verstand. Wien ist elegante Schwere und Kaffee-Kultur — hier trägt man eine Uhr mit Geschichte.",
      },
      { type: "heading", text: "Genf: die Cartier-Stadt" },
      {
        type: "paragraph",
        text: "In Genf gehört der Cartier Ballon Bleu zum Straßenbild wie das Jet d'Eau. Die runde Gehäuseform, das blaue Kronensctzrapell, das silberne Guilloche-Zifferblatt — das ist nicht Schmuck, das ist Haltung. Für das Wochenende am Lac Léman: perfekt.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona" },
      { type: "heading", text: "Wien: die Aqua Terra-Stadt" },
      {
        type: "paragraph",
        text: "Wien braucht eine Uhr mit Charakter. Die Omega Aqua Terra 150M hat ihn: Teak-Zifferblatt, Lederband, 150 Meter Wasserdichtheit — für den Heurigenabend genauso geeignet wie für das Opernfoyer. Und die Longines Conquest Heritage ergänzt das Wien-Arsenal mit schweizer Präzision zum halben Preis.",
      },
      {
        type: "image",
        alt: "Omega Aqua Terra 150M auf einem Heurigenbalkon mit Weinreben im Hintergrund",
        caption: "Die Aqua Terra in Wien — Heurigenkultur trifft schweizer Mechanik.",
      },
      {
        type: "paragraph",
        text: "Für Wochenend-Ausflüge: Lieferung Freitagvormittag, Rücksendung Montag. Wir versichern auch bei Reiseeinsatz — das ist kein Standard, das ist Marlo.",
      },
    ],
  },
  {
    id: "silvester",
    title: "Silvester: Die Uhr, die den Countdown verdient",
    excerpt:
      "Royal Oak Offshore, Submariner & Speedmaster für Sylvester — welche Uhr den Jahreswechsel wirklich feiert.",
    occasion: "Silvester",
    brand: "Audemars Piguet",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-14",
    heroImageAlt: "Uhrenhandgelenk mit Champagnerflöte, Lichter-Bokeh im Hintergrund, Silvester-Stimmung",
    metaTitle: "Uhr für Silvester mieten | marianni",
    metaDescription: "Royal Oak Offshore, Submariner & Speedmaster — Silvester unvergesslich. Lieferung 31.12., Versicherung inkl. Ab €119/Abend.",
    bundleSlugs: ["gala-wochenende-rolex-daytona"],
    relatedSlugs: ["gala-charity-abend", "geburtstag", "die-hochzeit"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Es gibt Abende, die eine Uhr brauchen, die nicht schweigt. Silvester ist einer davon. Der Countdown ist kein Hintergrundgeräusch — er ist der Moment. Und Ihr Handgelenk sollte ihm gewachsen sein.",
      },
      { type: "heading", text: "Drei Uhren für den Jahreswechsel" },
      {
        type: "paragraph",
        text: "Die Audemars Piguet Royal Oak Offshore Chronograph ist Silvester in Metall: voluminös, präzise, unübersehbar. Der orange Sekundenzeiger arbeitet wie ein Countdown-Timer. Die Rolex Submariner Date bringt sportliche Coolness — Smokinghemd und Submariner, das ist ein Look, den man sich merkt. Und der Omega Speedmaster Moonwatch schließt den Abend mit Geschichte: die Uhr, die auf dem Mond war, hat auch Ihren Jahreswechsel verdient.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona" },
      { type: "heading", text: "31. Dezember — Lieferung bis 16 Uhr" },
      {
        type: "paragraph",
        text: "Für Silvester garantieren wir Lieferung bis 16 Uhr am 31. Dezember in Berlin, München und Hamburg. So haben Sie vier Stunden, um sich mit der Uhr vertraut zu machen, bevor der erste Sekt geöffnet wird. Rücksendung am 2. Januar.",
      },
      {
        type: "image",
        alt: "Omega Speedmaster Moonwatch auf schwarzem Smokingärmel",
        caption: "Der Speedmaster Moonwatch — für alle Countdown-Momente, irdisch wie kosmisch.",
      },
      {
        type: "paragraph",
        text: "Versicherung inklusive — auch für die Nacht, die manchmal länger wird als geplant.",
      },
    ],
  },
  {
    id: "geburtstag",
    title: "Geburtstag: Die Uhr als Geschenk an sich selbst",
    excerpt:
      "Patek Nautilus, Cartier Tank & Datejust zum Geburtstag — warum ein runder Geburtstag eine runde Uhr verdient.",
    occasion: "Geburtstag",
    brand: "Patek Philippe",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-13",
    heroImageAlt: "Patek Philippe Nautilus auf einem handgeschriebenen Brief in cremefarbenem Umschlag, einzelne Kerze im Hintergrund",
    metaTitle: "Uhr zum Geburtstag mieten | marianni",
    metaDescription: "Patek Nautilus, Cartier Tank & Datejust zum Geburtstag — Mietdauer nach Wahl, Versicherung inkl. Ab €89/Wochenende.",
    bundleSlugs: ["jubilaeum-audemars-piguet"],
    relatedSlugs: ["vatertag", "gala-charity-abend", "erstes-date"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Es gibt Geburtstage, die man begeht. Und es gibt Geburtstage, die man feiert. Ab dem 30. sollten es nur noch letztere sein — mit einer Uhr, die dem Anlass entspricht.",
      },
      { type: "heading", text: "Die Nautilus: für den Geburtstag, den man sich merkt" },
      {
        type: "paragraph",
        text: "Die Patek Philippe Nautilus 5711 ist vielleicht die begehrteste Uhr der Gegenwart. Ihr horizontales Zifferblatt-Muster, die achteckige Lünette, das integrierte Stahlarmband — das ist kein Statussymbol, das ist Designgeschichte. Für einen runden Geburtstag: das richtige Statement.",
      },
      { type: "watch_cta", bundleSlug: "jubilaeum-audemars-piguet" },
      { type: "heading", text: "Tank oder Datejust: zwei Klassiker, zwei Temperaturen" },
      {
        type: "paragraph",
        text: "Der Cartier Tank Louis Cartier ist die Wahl der Ästheten: rechteckiges Gehäuse, römische Ziffern, schwarzes Alligatorlederband. Kühl, präzise, unvergänglich. Die Rolex Datejust 36 in Everose-Gold mit Champagner-Zifferblatt nimmt den Geburtstag warmherziger — Jubilé-Armband, Datumsfenster, Fluted-Lünette. Luxus mit einem Lächeln.",
      },
      {
        type: "image",
        alt: "Cartier Tank Louis Cartier auf weißem Tischtuch, festliche Tischdekoration",
        caption: "Der Tank Louis Cartier — seit 1919 die Uhr der Feierlichkeit.",
      },
      {
        type: "paragraph",
        text: "Mietdauer nach Wahl: ein Wochenende, eine Woche, ein Monat. Für runde Geburtstage empfehlen wir das Jubiläum-Bundle mit optionaler Foto-Session — Bilder, die bleiben, wenn der Kuchen gegessen ist.",
      },
    ],
  },
  {
    id: "erstes-date",
    title: "Erstes Date: Die Uhr, die zeigt, dass Sie nachgedacht haben",
    excerpt:
      "Cartier Santos, TAG Monaco & Seamaster — welche Uhr beim ersten Date zeigt, wer Sie sind, ohne es zu erklären.",
    occasion: "Date",
    brand: "Cartier",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-12",
    heroImageAlt: "Cartier Santos am Handgelenk zwischen zwei Weingläsern, Restaurant-Kerzenlicht",
    metaTitle: "Uhr fürs erste Date mieten | marianni",
    metaDescription: "Cartier Santos, TAG Monaco & Seamaster — der beste erste Eindruck. Lieferung am Abend, Versicherung inkl. Ab €59/Abend.",
    bundleSlugs: [],
    relatedSlugs: ["geburtstag", "silvester", "gala-charity-abend"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Beim ersten Date reden nicht nur Worte. Das Restaurant zeigt Geschmack. Die Kleidung zeigt Sorgfalt. Und die Uhr am Handgelenk zeigt, wie viel Sie über Details nachgedacht haben — ohne es sagen zu müssen.",
      },
      { type: "heading", text: "Der Cartier Santos: Für den, der Haltung hat" },
      {
        type: "paragraph",
        text: "Der Cartier Santos-Dumont ist die älteste Armbandherren­uhr der Welt — entworfen für einen Mann, der als erster mit einem Motorflugzeug flog. Das rechteckige Gehäuse, die exponierten Schrauben auf der Lünette, das blasse Champagner-Zifferblatt. Diese Uhr erklärt sich nicht. Sie ist.",
      },
      { type: "watch_cta_generic" },
      { type: "heading", text: "Monaco oder Seamaster: zwei weitere Wege" },
      {
        type: "paragraph",
        text: "Der TAG Heuer Monaco — die quadratische Ikone aus Le Mans — ist die Wahl für den, dem klassische Eleganz zu still ist. Blau-blau, eckig, Chronograph. Die Omega Seamaster Aqua Terra wählt eine dritte Linie: sportliche Eleganz, Teak-Zifferblatt, Edelstahl — für den Abend, der nicht im Restaurant endet.",
      },
      {
        type: "image",
        alt: "TAG Heuer Monaco auf Jeansjackenärmel, urban, leger",
        caption: "Der Monaco — für das Date, das man anders angeht.",
      },
      {
        type: "paragraph",
        text: "Wir liefern bis 18 Uhr am Abend des Dates. Rücksendung am nächsten Morgen. Die Uhr ist versichert — der Abend liegt bei Ihnen.",
      },
    ],
  },
  {
    id: "sommerurlaub-mittelmeer",
    title: "Mittelmeer-Urlaub: Die Uhr, die Salz und Sonne überlebt",
    excerpt:
      "Submariner Bluesy, Seamaster Tropics & Breitling Superocean — welche Taucheruhr den Mittelmeer-Urlaub wirklich begleiten kann.",
    occasion: "Urlaub",
    brand: "Rolex",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-11",
    heroImageAlt: "Rolex Submariner auf nacktem Handgelenk auf Teakholz-Bootsdeck, Meereshorizont dahinter",
    metaTitle: "Taucheruhr Mittelmeer-Urlaub mieten | marianni",
    metaDescription: "Submariner Bluesy, Seamaster Tropics & Breitling Superocean — wasserdicht, versichert, Mittelmeer-ready. Ab €79/Woche.",
    bundleSlugs: [],
    relatedSlugs: ["wochenend-ausflug-genf-wien", "kunst-kultur-vernissage", "erstes-date"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Der Mittelmeer verändert alles — die Temperatur, das Licht, den Rhythmus. Und er verändert, was am Handgelenk passt. Keine Smoking-Uhr, keine Konferenzuhr. Eine Uhr, die ins Wasser darf.",
      },
      { type: "heading", text: "Der Submariner Bluesy: Wasser ist sein Element" },
      {
        type: "paragraph",
        text: "Die Rolex Submariner Date in Blaustahl — intern 'Bluesy' genannt — ist die kompromissloseste Kombination aus Eleganz und Funktion. 300 Meter Wasserdichtheit, Cerachrom-Lünette, Oysterlock-Verschluss. Sie geht mit Ihnen tauchen. Und zum Abendessen danach.",
      },
      { type: "watch_cta_generic" },
      { type: "heading", text: "Seamaster & Superocean: zwei Alternativen" },
      {
        type: "paragraph",
        text: "Die Omega Seamaster 300M mit blauem Zifferblatt und Titanarmband ist leichter als die Submariner — ideal für längere Tragesessions unter Sonne. Das Breitling Superocean Heritage II bringt Vintage-Ästhetik mit echter 200m-Tauglichkeit: Fischgrätarmband, großes Zifferblatt, klare Lesbarkeit.",
      },
      {
        type: "image",
        alt: "Omega Seamaster 300M unter Wasser, Lichtbrechung auf blauem Zifferblatt",
        caption: "Die Seamaster 300M — entwickelt für mehr als das Hotelpool-Plantschen.",
      },
      {
        type: "paragraph",
        text: "Alle Urlaubsmietungen sind mit Wasserschäden-Versicherung abgesichert. Was Sie auf dem Boot verlieren, ersetzen wir — bis zur vereinbarten Deckungssumme. Urlaubssorglos.",
      },
    ],
  },
  {
    id: "kunst-kultur-vernissage",
    title: "Vernissage & Museum: Die Uhr als Kunstgespräch",
    excerpt:
      "Portugieser, Patek Calatrava & Omega Tourbillon für Vernissagen und Kulturabende — welche Uhr im Kunstkontext zählt.",
    occasion: "Kultur",
    brand: "IWC",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-09",
    heroImageAlt: "Hand mit IWC Portugieser hält ein Galerie-Programm, Gemälde im Hintergrund unscharf",
    metaTitle: "Uhr für Vernissage & Museum mieten | marianni",
    metaDescription: "Portugieser, Patek Calatrava & Omega Tourbillon für Vernissagen & Kulturabende — Tagesmiete, Versicherung inkl. Ab €129/Tag.",
    bundleSlugs: ["gala-wochenende-rolex-daytona"],
    relatedSlugs: ["gala-charity-abend", "wochenend-ausflug-genf-wien", "sommerurlaub-mittelmeer"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Bei einer Vernissage beobachten Menschen Kunst. Und Menschen beobachten Menschen, die Kunst beobachten. In diesem Umfeld ist eine Uhr kein Accessoire — sie ist ein Statements über Ihren Blick auf die Welt.",
      },
      { type: "heading", text: "Der Portugieser: Uhrmacherkunst als Gesprächseinstieg" },
      {
        type: "paragraph",
        text: "Die IWC Portugieser Automatic 7 mit 42mm-Gehäuse und großem Sekundenzeiger ist die Kultururhr schlechthin: klares Zifferblatt, arabische Ziffern, Lederband. Sie lädt zur Frage ein: 'Interessante Uhr — was ist das?' Und dann reden Sie über Handwerk, nicht über Marken.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona" },
      { type: "heading", text: "Calatrava & Tourbillon: zwei Tiefenstufen" },
      {
        type: "paragraph",
        text: "Die Patek Philippe Calatrava 5196R geht tiefer: handaufgezogen, Hochglanz-Stahlgehäuse, blaue Zeiger. Eine Uhr ohne Kompromisse, ohne Marketing. Die Omega Tourbillon Central schließlich ist das Statement für Liebhaber mechanischer Uhrmacherei: sichtbares Tourbillon, minimalistisches Zifferblatt, die Gravitation besiegt.",
      },
      {
        type: "image",
        alt: "Patek Philippe Calatrava 5196R neben einem abstrakten Gemälde, weißer Galerieraum",
        caption: "Die Calatrava in der Galerie — zwei Dinge, die sich gegenseitig aufwerten.",
      },
      {
        type: "paragraph",
        text: "Für Vernissagen und einzelne Kulturabende bieten wir Tagesmiete ab einem Tag. Wir liefern bis 16 Uhr, Sie geben bis 10 Uhr morgens zurück. Kein Wochenend-Bundle nötig, wenn es nur ein Abend ist.",
      },
    ],
  },
  {
    id: "vatertag",
    title: "Vatertag: Die Uhr, die der Mann in Ihrem Leben nie kaufen würde",
    excerpt:
      "Submariner, Navitimer & Carrera als Vatertagsgeschenk — wie man einer Uhr mietet, verpackt und liefert, ohne zu wissen, welche passt.",
    occasion: "Geschenk",
    brand: "Rolex",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-08",
    heroImageAlt: "Rolex Submariner in Marlo-Geschenkbox auf dem Schreibtisch eines Vaters, Lesebrille und Buch daneben",
    metaTitle: "Uhr als Vatertagsgeschenk mieten | marianni",
    metaDescription: "Submariner, Navitimer & Carrera für Papa — Lieferung freitagabends mit Grußkarte, Rückholung montags. Ab €119/Wochenende.",
    bundleSlugs: ["jubilaeum-audemars-piguet"],
    relatedSlugs: ["geburtstag", "business-dinner", "die-hochzeit"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Manche Männer kaufen sich keine Luxusuhr. Nicht weil sie sie nicht mögen — sondern weil sie es sich nicht erlauben. Vatertag ist der Anlass, ihnen diese Entscheidung abzunehmen. Für ein Wochenende.",
      },
      { type: "heading", text: "Der Submariner: für den Vater, dem Klassiker wichtig sind" },
      {
        type: "paragraph",
        text: "Die Rolex Submariner Date in Stahl ist die meistbegehrte Uhr der Nachkriegszeit. Kein Gimmick, keine Mode — ein Instrument, das funktioniert. Für den Vater, der sich für Qualität interessiert, aber Protz verabscheut: die richtige Wahl.",
      },
      { type: "watch_cta", bundleSlug: "jubilaeum-audemars-piguet" },
      { type: "heading", text: "Navitimer & Carrera: für andere Väter" },
      {
        type: "paragraph",
        text: "Der Breitling Navitimer 01 ist die Wahl für den Vater mit Aviation-Interesse: Rechenschieber-Lünette, Chronograph, das Zifferblatt eine funktionierende Rechenstube. Die TAG Heuer Carrera ist für den, dem Rennsport und Design zusammengehören — 39mm, Chronograph, made for speed.",
      },
      {
        type: "image",
        alt: "Breitling Navitimer 01 auf einem Piloten-Flugplan, Cockpit-Atmosphäre",
        caption: "Der Navitimer — für Väter, die wissen, was ein Schieberechen ist.",
      },
      {
        type: "paragraph",
        text: "Vatertag-Lieferung freitagabends mit handgeschriebener Grußkarte. Rückholung Montagmorgen. Sie müssen nichts organisieren — wir kümmern uns um alles, damit er sich nur kümmern muss um die Uhr.",
      },
    ],
  },
];

export function getStoryById(id: string): EditorialStory | undefined {
  return editorialStories.find((s) => s.id === id);
}

export function getRelatedStories(
  currentId: string,
  limit = 3,
  relatedSlugs?: string[],
): EditorialStory[] {
  if (relatedSlugs && relatedSlugs.length > 0) {
    return relatedSlugs
      .map((slug) => editorialStories.find((s) => s.id === slug))
      .filter((s): s is EditorialStory => !!s)
      .slice(0, limit);
  }

  const current = getStoryById(currentId);
  if (!current) return [];

  return editorialStories
    .filter((s) => s.id !== currentId)
    .map((s) => {
      let score = 0;
      if (s.occasion === current.occasion) score += 2;
      if (s.brand === current.brand) score += 1;
      return { story: s, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.story);
}
