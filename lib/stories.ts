import { EditorialStory } from "./types";

export const editorialStories: EditorialStory[] = [
  // ── anchor stories (linked from bundle pages) ─────────────────────────────
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
      { type: "watch_cta", bundleSlug: "hochzeitswoche-patek", watchSlug: "patek-calatrava-5196r" },
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
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "rolex-daytona-116500ln" },
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
    relatedSlugs: ["geburtstag", "vatertag", "gala-charity-abend"],
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
      { type: "watch_cta", bundleSlug: "jubilaeum-audemars-piguet", watchSlug: "ap-royal-oak-15500st" },
      { type: "heading", text: "Tag 8–21: Sie gehört zu mir" },
      {
        type: "paragraph",
        text: "Ab der zweiten Woche hört man auf, sie als geliehen zu betrachten. Sie wird Teil des Outfits, des Morgenrituals, des Selbstbilds. Das Tapisserie-Zifferblatt ist ein Kunstwerk, das man erst nach Tagen wirklich sieht — bei jedem Lichtwinkel anders.",
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

  // ── 10 lookbook backfill (MAR-92 § 12 / MAR-146) ─────────────────────────
  {
    id: "die-hochzeit",
    title: "Die Hochzeit — vier Uhren für den schönsten Tag",
    excerpt:
      "Datejust, Calatrava, De Ville & Day-Date: welche Uhr zu welchem Moment der Hochzeit passt — und wie Sie sie für sieben Tage mieten.",
    occasion: "Hochzeit",
    brand: "Patek Philippe",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-20",
    heroImageAlt:
      "Bräutigam-Handgelenk mit Rolex Datejust, weißes Manschettenhemd, verschwommener Bouquet-Bokeh im Hintergrund",
    metaTitle: "Luxusuhr zur Hochzeit mieten | marianni",
    metaDescription:
      "Datejust, Calatrava & Omega zur Hochzeit — Lieferung am Vorabend, Versicherung inkl., Concierge. Ab €89/Wochenende.",
    bundleSlugs: ["hochzeitswoche-patek"],
    relatedSlugs: ["gala-charity-abend", "geburtstag", "erstes-date"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Die Hochzeit ist der Tag, an dem jede Entscheidung bleibt — im Album, in der Erinnerung, auf jedem Foto. Am Handgelenk des Bräutigams liegt mehr als eine Uhr. Es liegt eine Haltung.",
      },
      { type: "heading", text: "Rolex Datejust 36 — die klassische Hochzeitswahl" },
      {
        type: "paragraph",
        text: "Die Datejust 36 in Weißgold mit Jubilé-Armband ist das klassische Hochzeitsstatement. Champagner-Zifferblatt, diskrete Fluted-Lünette, Cyclops-Vergößerungsglas: Sie liest sich auf Fotos wie ein Versprechen und passt zum Smoking wie zur modernen Anzughose.",
      },
      { type: "watch_cta", bundleSlug: "hochzeitswoche-patek", watchSlug: "rolex-datejust-36" },
      {
        type: "styling_tip",
        text: "Styling-Tipp: Die Datejust 36 trägt sich perfekt unter der Manschette — wählen Sie ein Hemd mit genug Spielraum am Ärmel, damit die Uhr beim Händedruck sichtbar wird.",
      },
      { type: "heading", text: "Patek Philippe Calatrava 5196R — Understatement der Connaisseure" },
      {
        type: "paragraph",
        text: "Die Calatrava ist handaufgezogen, minimalistisch, ein potentielles Erbteil. Wer sie kennt, braucht keine Erklärung. Wer sie nicht kennt, fragt nach. In Roségold sitzt sie so flach, dass sie unter der Manschette verschwindet — und erst beim Händedruck auftaucht.",
      },
      { type: "watch_cta", bundleSlug: "hochzeitswoche-patek", watchSlug: "patek-calatrava-5196r" },
      { type: "heading", text: "Omega De Ville Prestige Co-Axial — elegant ohne Prahlen" },
      {
        type: "paragraph",
        text: "Die De Ville Prestige Co-Axial ist die diplomatische Wahl: klares Zifferblatt, dezentes Gehäuse, keine Ablenkung. Sie funktioniert beim Standesamt ebenso wie beim Kirchengang — und ihre Co-Axial-Hemmung läuft Jahrzehnte ohne Service.",
      },
      { type: "watch_cta", bundleSlug: "hochzeitswoche-patek", watchSlug: "omega-deville-prestige" },
      { type: "heading", text: "Rolex Day-Date 40 — für die Feier bis Mitternacht" },
      {
        type: "paragraph",
        text: "Der Abend gehört der Day-Date. Die erste Uhr der Welt mit ausgeschriebenem Tagesdatum leuchtet in Gelbgold und Champagner, wenn die Kerzen tiefer brennen. Nicht zufällig ist sie die Uhr der Präsidenten.",
      },
      { type: "watch_cta", bundleSlug: "hochzeitswoche-patek", watchSlug: "rolex-day-date-40" },
      {
        type: "paragraph",
        text: "Unsere Hochzeitswoche liefert am Vorabend — persönlich, in Berlin, München oder Hamburg. Sieben Tage, Premium-Versicherung, 24/7 Concierge, Rückversand inklusive.",
      },
    ],
  },
  {
    id: "gala-charity-abend",
    title: "Gala & Charity-Abend — vier Uhren für Ihren großen Auftritt",
    excerpt:
      "Royal Oak, Day-Date, Portugieser & Daytona für Gala-Abende — welche Uhr zum Smoking passt und warum drei Tage Mietdauer kein Zufall sind.",
    occasion: "Gala",
    brand: "Audemars Piguet",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-18",
    heroImageAlt:
      "Audemars Piguet Royal Oak auf Smoking-Revers, einzelner warmer Lichtspot, dunkler Hintergrund",
    metaTitle: "Uhr für Gala & Charity mieten | marianni",
    metaDescription:
      "Royal Oak, Day-Date & Portugieser für Gala-Abende — Concierge-Service, Versicherung inkl. Ab €139/Abend.",
    bundleSlugs: ["gala-wochenende-rolex-daytona"],
    relatedSlugs: ["die-hochzeit", "silvester", "kunst-kultur-vernissage"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Ein Charity-Abend ist Bühne — und auf einer Bühne zählt jedes Accessoire. Das Smoking-Ensemble sitzt, der Händedruck ist fest. Was zwischen Anwesenheit und Präsenz entscheidet, ist das letzte Detail am Handgelenk.",
      },
      {
        type: "heading",
        text: "Audemars Piguet Royal Oak — der Stil, der den Raum übernimmt",
      },
      {
        type: "paragraph",
        text: "Die Royal Oak in Stahl ist die kompromisslose Gala-Wahl: achteckige Lünette, integriertes Armband, Tapisserie-Zifferblatt. Sie braucht keinen Smoking — sie ist das Statement. Auf einer Charity-Gala, wo Eindrücke in Sekunden entstehen, ist das Ihr stärkster Gesprächsöffner.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "ap-royal-oak-15500st" },
      {
        type: "styling_tip",
        text: "Styling-Tipp: Die Royal Oak in Stahl verleiht Ihrem Smoking eine sportlich-luxuriöse Note — kombinieren Sie sie mit einer schlichten schwarzen Fliege statt Schleife, um den Kontrast zu betonen.",
      },
      { type: "heading", text: "Rolex Day-Date 40 — die Uhr, die Legenden tragen" },
      {
        type: "paragraph",
        text: "Päpste, Präsidenten, Premierminister: Die Day-Date in Gelbgold mit Champagner-Zifferblatt ist der definitive Beweis, dass manche Uhren Symbole sind. Im Saal eines Charity-Abends sagt sie, ohne ein Wort zu sprechen: Ich bin hier, weil ich hier sein will.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "rolex-day-date-40" },
      {
        type: "heading",
        text: "IWC Portugieser Chronograph — für den Kenner im Smoking",
      },
      {
        type: "paragraph",
        text: "Der Portugieser Chronograph ist die Uhr des Uhr-Aficionados. Das blaue Zifferblatt mit arabischen Ziffern, die großen Totalisatoren, das Lederband — er startet die richtigen Gespräche. Mit dem Gast, der seinen Blick zwei Sekunden zu lang auf Ihrem Handgelenk hält.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "iwc-portugieser-chronograph" },
      { type: "heading", text: "Rolex Daytona — wenn der Abend ein Statement verlangt" },
      {
        type: "paragraph",
        text: "Die Daytona Cosmograph mit Keramik-Lünette und drei Totalisatoren ist kein dezenter Begleiter — sie ist ein Statement. Auf der Gala, wo alle schon alles gesehen haben, fällt die Daytona noch auf. Weil sie es verdient.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "rolex-daytona-116500ln" },
      {
        type: "paragraph",
        text: "Das Gala-Wochenende-Bundle umfasst Donnerstag bis Montag: drei Tage, Weiße-Handschuhe-Lieferung, Concierge, Versicherung. Optional: Smoking-Hemdmanschetten zum Bundle dazu.",
      },
    ],
  },
  {
    id: "business-dinner",
    title: "Business-Dinner & wichtige Meetings — vier Uhren für den entscheidenden Abend",
    excerpt:
      "De Ville, Portugieser, Datejust & Saxonia für Geschäftsessen — diskret, präzise, überzeugend.",
    occasion: "Geschäftsabschluss",
    brand: "IWC",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-16",
    heroImageAlt:
      "Manschette mit Omega De Ville auf dunklem Walnuss-Konferenztisch, Füller und Notizbuch, Tageslicht von links",
    metaTitle: "Uhr fürs Business-Dinner mieten | marianni",
    metaDescription:
      "De Ville, Portugieser & Datejust für wichtige Meetings — Lieferung am Vorabend, diskret & versichert. Ab €49/Tag.",
    bundleSlugs: [],
    relatedSlugs: ["wochenend-ausflug-genf-wien", "erstes-date", "vatertag"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Beim Business-Dinner kommuniziert alles — der Handschlag, die Menüwahl, das Schweigen zwischen zwei Sätzen. Am Handgelenk: eine Uhr, die Kompetenz zeigt, ohne Dominanz zu markieren.",
      },
      { type: "heading", text: "Omega De Ville Prestige — Zurückhaltung als Stärke" },
      {
        type: "paragraph",
        text: "Die De Ville Prestige ist die Wahl des Mannes, der keine Uhr tragen muss, um etwas zu beweisen. Ihr schlankes Gehäuse, das sunburst-gebürstete Zifferblatt, das Lederarmband: nichts schreit. Alles flüstert. Manchmal ist das die lauteste Aussage am Tisch.",
      },
      { type: "watch_cta_generic" },
      { type: "heading", text: "IWC Portugieser Automatik — Präzision mit Geschichte" },
      {
        type: "paragraph",
        text: "Der Portugieser Automatik mit seinem großen, klaren Zifferblatt und Stabindizes verkörpert hanseatische Disziplin. Er sagt: Ich achte auf Details — auch die, die andere nicht sehen. Im Verhandlungsraum ist das ein Signal, das ankommt.",
      },
      { type: "watch_cta_generic" },
      { type: "heading", text: "Rolex Datejust 41 Weißgold — klassische Autorität" },
      {
        type: "paragraph",
        text: "Wer die Datejust 41 in Weißgold trägt, braucht keine Visitenkarte. Die Uhr hat bereits kommuniziert: Verlässlichkeit, Substanz, langfristiges Denken. Drei Eigenschaften, die in jeder Branche zählen.",
      },
      { type: "watch_cta_generic" },
      { type: "heading", text: "A. Lange & Söhne Saxonia — für den Abschluss des Abends" },
      {
        type: "paragraph",
        text: "Wenn der Deal unterschrieben ist, verdient das Handgelenk das Beste aus Glashütte. Die Saxonia ist die unerwartetste Wahl am Tisch — und deshalb die wirkungsvollste. Wer sie erkennt, weiß, was er wissen muss.",
      },
      { type: "watch_cta_generic" },
    ],
  },
  {
    id: "wochenend-ausflug-genf-wien",
    title: "Wochenend-Ausflug: Genf oder Wien — vier Uhren für den perfekten Flâneur",
    excerpt:
      "Ballon Bleu, Aqua Terra, Longines & Oyster Perpetual für Wochenend-Ausflüge in Europas elegantesten Städten.",
    occasion: "Reise",
    brand: "Cartier",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-14",
    heroImageAlt:
      "Cartier Ballon Bleu auf Leinentischdecke neben Espresso-Tasse, Genfer Straßenbokeh im Hintergrund",
    metaTitle: "Uhr für Genf & Wien Wochenende | marianni",
    metaDescription:
      "Ballon Bleu, Aqua Terra & Longines — Wochenend-Ausflug in Genf oder Wien, Versicherung inkl. Ab €59/Wochenende.",
    bundleSlugs: ["gala-wochenende-rolex-daytona"],
    relatedSlugs: ["sommerurlaub-mittelmeer", "kunst-kultur-vernissage", "business-dinner"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Genf und Wien sind keine beliebigen Städte. Genf ist die Welthauptstadt der feinen Mechanik. Wien ist elegante Schwere und Kaffee-Kultur. In beiden trägt man eine Uhr mit Geschichte — und wird dafür gesehen.",
      },
      { type: "heading", text: "Cartier Ballon Bleu — der Flâneur par excellence" },
      {
        type: "paragraph",
        text: "Keine Uhr passt besser zu einem Wiener Café als der Ballon Bleu. Seine ovale Krone, das gewölbte Saphirglas, das weiche Armband verkörpern gepflegten Müßiggang. In Genf — wo Uhren Stadtgespräch sind — sorgt er für Kopfnicken an der richtigen Stelle.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "cartier-ballon-bleu" },
      { type: "heading", text: "Omega Seamaster Aqua Terra — von Frühstück bis Abend" },
      {
        type: "paragraph",
        text: "Die Aqua Terra ist die vielseitigste Reiseuhr. Wasserdicht, elegantes Teak-Zifferblatt, Edelstahlarmband, das sich weder zu lässig noch zu formal anfühlt: Sie funktioniert beim Frühstück ebenso wie beim Abendessen im Steirereck. Und überlebt den Regen vor dem Stephansdom.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "omega-seamaster-aqua-terra" },
      { type: "heading", text: "Longines Master Collection — europäische Eleganz mit Geschichte" },
      {
        type: "paragraph",
        text: "Longines ist in Genf zu Hause — buchstäblich. Die Master Collection mit Mondphasen-Komplikation und großem, lesbarem Zifferblatt ist der ideale Reisebegleiter für eine Stadt, in der Uhren ernst genommen werden. Klassisch genug für das Burgtheater, entspannt genug für den Naschmarkt.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "longines-master-collection" },
      { type: "heading", text: "Rolex Oyster Perpetual — der ewige Begleiter" },
      {
        type: "paragraph",
        text: "Manchmal ist die schlichteste Wahl die eleganteste. Der Oyster Perpetual mit einem der farbigen Zifferblätter — Coral Red oder Turquoise — ist die Anti-These zur Statusuhr und trotzdem unübersehbar. In Wien wie in Genf macht er aus dem Handgelenk ein Gespräch.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "rolex-oyster-perpetual" },
    ],
  },
  {
    id: "silvester",
    title: "Silvester — vier Uhren für die Nacht der Nächte",
    excerpt:
      "Royal Oak Offshore, Submariner, Speedmaster & Day-Date für Silvester — die Uhr, die den Countdown verdient.",
    occasion: "Silvester",
    brand: "Audemars Piguet",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-12",
    heroImageAlt:
      "Uhr am Smoking-Handgelenk mit Champagnerflöte, Bokeh von Lichterketten im Hintergrund",
    metaTitle: "Uhr für Silvester mieten | marianni",
    metaDescription:
      "Royal Oak Offshore, Submariner & Speedmaster — Silvester unvergesslich. Lieferung 31.12., Versicherung inkl. Ab €119/Abend.",
    bundleSlugs: ["gala-wochenende-rolex-daytona"],
    relatedSlugs: ["gala-charity-abend", "geburtstag", "die-hochzeit"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Silvester ist die einzige Nacht, bei der alle wissen, dass sie besonders ist — und trotzdem oft enttäuscht. Das Geheimnis liegt in der Haltung: bewusst da sein. Eine Uhr, die den Moment markiert, hilft dabei.",
      },
      { type: "heading", text: "AP Royal Oak Offshore — für den Countdown mit Stil" },
      {
        type: "paragraph",
        text: "Die Royal Oak Offshore Chronograph ist Silvester in Metall: 42mm Gehäuse, massiver Pushpiece-Kronenschutz, der orange Sekundenzeiger wie ein Countdown-Timer. Sie gehört zu den Uhren, die man noch um 4 Uhr morgens gerne trägt.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "ap-royal-oak-offshore" },
      { type: "heading", text: "Rolex Submariner Date — klassisch unter Kerzenlicht" },
      {
        type: "paragraph",
        text: "Der Submariner Date in schwarzem Zifferblatt und Oyster-Armband ist einer der wenigen Sportuhren, die mit dem Smoking harmonieren. Er schafft den Spagat zwischen Dresscode und Persönlichkeit: der Mann, der die Submariner trägt, spielt nach den Regeln — aber seinen Regeln.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "rolex-submariner-date" },
      { type: "heading", text: "Omega Speedmaster Moonwatch — Mitternacht in vier Ziffern" },
      {
        type: "paragraph",
        text: "Die Speedmaster war auf dem Mond. Um Mitternacht des 31. Dezember hat sie einige Male die Geschichte begleitet. Ihre manuelle Aufzugswerk, der schwarze Chronographenzeiger, das Stahlgehäuse: Sie ist eine Legende — getragen von jemandem, der das weiß.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "omega-speedmaster-moonwatch" },
      { type: "heading", text: "Rolex Day-Date — die erste Minute des neuen Jahres" },
      {
        type: "paragraph",
        text: "Wenn um 00:01 der Tagesname wechselt und das Datum von 31 auf 1 springt, ist die Day-Date der einzige Zeitmesser, der diesen Übergang mit ausgeschriebenem Text festhält. Eine kleine Komplikation mit großer Wirkung für die erste Minute des neuen Jahres.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "rolex-day-date-40" },
    ],
  },
  {
    id: "geburtstag",
    title: "Geburtstag — ein besonderer Anlass verdient die besondere Uhr",
    excerpt:
      "Patek Nautilus, Cartier Tank, Datejust & Royal Oak zum Geburtstag — mieten statt kaufen, Erlebnis statt Eigentum.",
    occasion: "Geburtstag",
    brand: "Patek Philippe",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-10",
    heroImageAlt:
      "Patek Philippe Nautilus auf handgeschriebenem Brief in cremefarbenem Umschlag, einzelne Kerze, warmes Licht",
    metaTitle: "Uhr zum Geburtstag mieten | marianni",
    metaDescription:
      "Patek Nautilus, Cartier Tank & Datejust zum Geburtstag — Mietdauer nach Wahl, Versicherung inkl. Ab €89/Wochenende.",
    bundleSlugs: ["jubilaeum-audemars-piguet"],
    relatedSlugs: ["vatertag", "gala-charity-abend", "erstes-date"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Der runde Geburtstag ist der einzige Anlass, an dem Maßlosigkeit erlaubt ist — im Sinne von Bewusstsein. Dieser Tag ist einmalig. Die Uhr dazu muss es auch sein.",
      },
      { type: "heading", text: "Patek Philippe Nautilus — die Uhr, die Wunschlisten anführt" },
      {
        type: "paragraph",
        text: "Die Nautilus ist die begehrteste Sportuhr der Welt. Ihre porthole-inspirierte Lünette, das horizontalgeriffte Zifferblatt, das integrierte Armband: entworfen 1976 von Gérald Genta und seitdem kein bisschen gealtert. Zum Geburtstag die Nautilus zu tragen bedeutet: Ich mache keine Kompromisse.",
      },
      { type: "watch_cta", bundleSlug: "jubilaeum-audemars-piguet", watchSlug: "patek-nautilus-5711" },
      { type: "heading", text: "Cartier Tank Louis — zeitlose Eleganz seit 1917" },
      {
        type: "paragraph",
        text: "Die Tank ist die eleganteste rechteckige Uhr, die je gebaut wurde. Coco Chanel trug sie, Jackie Kennedy trug sie, Andy Warhol trug sie. Zum Geburtstag schließen Sie sich einer Liste an, für die keine weitere Erklärung nötig ist.",
      },
      { type: "watch_cta", bundleSlug: "jubilaeum-audemars-piguet", watchSlug: "cartier-tank-louis" },
      { type: "heading", text: "Rolex Datejust 36 Everose — Jubiläum mit Wärme" },
      {
        type: "paragraph",
        text: "Die Datejust 36 in Everose-Gold mit Champagner-Zifferblatt und Jubilé-Armband nimmt den Geburtstag warmherziger als ihre weißgoldene Schwester. Kein Statement, kein Schreien — eine Uhr, die sagt: Ich freue mich auf heute.",
      },
      { type: "watch_cta", bundleSlug: "jubilaeum-audemars-piguet", watchSlug: "rolex-datejust-36" },
      { type: "heading", text: "Audemars Piguet Royal Oak — das Geburtstags-Statement" },
      {
        type: "paragraph",
        text: "Wer zum runden Geburtstag die Royal Oak trägt, sendet ein Signal: Heute gilt keine Zurückhaltung. Das achteckige Gehäuse, die integrierten Armbandglieder, der unverwechselbare Blick — die Royal Oak ist nicht für jeden Tag gemacht. Genau deshalb passt sie zu diesem einen.",
      },
      { type: "watch_cta", bundleSlug: "jubilaeum-audemars-piguet", watchSlug: "ap-royal-oak-15500st" },
    ],
  },
  {
    id: "erstes-date",
    title: "Erstes Date, das bleiben soll — vier Uhren für den besten ersten Eindruck",
    excerpt:
      "Cartier Santos, TAG Monaco, Seamaster & Portugieser — die Uhr, die zeigt, wer Sie sind, bevor das erste Wort fällt.",
    occasion: "Date",
    brand: "Cartier",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-08",
    heroImageAlt:
      "Zwei Weingläser, Cartier Santos auf ruhendem Handgelenk zwischen ihnen, Restaurant-Kerzenlicht",
    metaTitle: "Uhr fürs erste Date mieten | marianni",
    metaDescription:
      "Cartier Santos, TAG Monaco & Seamaster — der beste erste Eindruck. Lieferung am Abend, Versicherung inkl. Ab €59/Abend.",
    bundleSlugs: [],
    relatedSlugs: ["geburtstag", "silvester", "gala-charity-abend"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Ein erstes Date ist ein Gespräch — und jedes Detail spricht, bevor Sie sprechen. Die Uhr ist das einzige Accessoire, das jemand sieht, während er Ihnen in die Augen schaut. Sie sollte sagen: Ich bin der Mühe wert. Ohne laut zu werden.",
      },
      { type: "heading", text: "Cartier Santos — Charme mit Geschichte" },
      {
        type: "paragraph",
        text: "Der Santos de Cartier ist die erste Armbanduhr, die ein Pilot je trug — Alberto Santos-Dumont, 1904. Seine sichtbaren Schrauben an der Lünette, die quadratische Form, das Stahlarmband: Er ist unverwechselbar ohne protzig zu sein. Der perfekte Date-Begleiter.",
      },
      { type: "watch_cta_generic" },
      { type: "heading", text: "TAG Heuer Monaco — für den, der Geschichten erzählt" },
      {
        type: "paragraph",
        text: "Steve McQueen trug die Monaco in Le Mans. Das weiß fast jeder, der Uhren kennt — und ein gutes Gespräch beginnt mit einer Geschichte. Die Monaco mit ihrem quadratischen Gehäuse und dem blauen Zifferblatt sagt: Ich bin nicht Standard.",
      },
      { type: "watch_cta_generic" },
      { type: "heading", text: "Omega Seamaster 300 — klassisch, ohne langweilig zu sein" },
      {
        type: "paragraph",
        text: "Die Seamaster 300 in Schwarz mit Wave-Zifferblatt ist die Sportuhr, die beim Abendessen funktioniert. Nicht zu sportlich, nicht zu formal, immer interessant. Falls das Gespräch auf Uhren kommt: Es gibt kaum eine mit besserem Geschmack-Verhältnis.",
      },
      { type: "watch_cta_generic" },
      { type: "heading", text: "IWC Portugieser Chronograph — souverän und diskret" },
      {
        type: "paragraph",
        text: "Der Portugieser Chronograph ist die Uhr des ruhigen Selbstbewusstseins. Kein Statement, kein Schreien — ein großes, klares Zifferblatt, das Zeit ernst nimmt. Die beste Uhr ist die, die erinnert wird, ohne dass man weiß, warum.",
      },
      { type: "watch_cta_generic" },
    ],
  },
  {
    id: "sommerurlaub-mittelmeer",
    title: "Sommerurlaub — Mittelmeer: vier Taucheruhren fürs offene Meer",
    excerpt:
      "Submariner Bluesy, Seamaster Tropics, Breitling Superocean & Sea-Dweller — wasserdicht, versichert und Mittelmeer-ready.",
    occasion: "Urlaub",
    brand: "Rolex",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-06",
    heroImageAlt:
      "Rolex Submariner auf nacktem Handgelenk auf Teakholz-Schiffsdeck, Meerhorizont oben",
    metaTitle: "Taucheruhr Mittelmeer-Urlaub mieten | marianni",
    metaDescription:
      "Submariner Bluesy, Seamaster Tropics & Breitling Superocean — wasserdicht, versichert, Mittelmeer-ready. Ab €79/Woche.",
    bundleSlugs: [],
    relatedSlugs: ["wochenend-ausflug-genf-wien", "kunst-kultur-vernissage", "erstes-date"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Das Mittelmeer erfordert eine andere Uhr als die Stadt. Salzwasser, Sonnencreme, Bootsdeck und Tauchgang: Was hier trägt, muss es ernst meinen. Gleichzeitig sitzt man abends beim Rosé an der Marina — und da sollte das Handgelenk trotzdem überzeugend aussehen.",
      },
      { type: "heading", text: "Rolex Submariner Date 'Bluesy' — die Blue-Chip Sportuhr" },
      {
        type: "paragraph",
        text: "Der Submariner 'Bluesy' — blaue Lünette, blaues Zifferblatt, Rolesor-Armband — ist die eleganteste Variante des Classicers. 300m Wasserdichte, Cerachrom-Lünette: Sie trägt sich am Boot genauso gut wie abends im Hafenrestaurant.",
      },
      { type: "watch_cta_generic" },
      { type: "heading", text: "Omega Seamaster 300M — Titan für lange Tage" },
      {
        type: "paragraph",
        text: "Die Seamaster 300M in Titan ist leichter als die Submariner — ideal für längere Tragesessions unter Sonne. Das blaue Wave-Zifferblatt, die Keramikhülse der Lünette, der Kautschukband: Sie ist für das Meer entwickelt worden und sieht es auch so aus.",
      },
      { type: "watch_cta_generic" },
      { type: "heading", text: "Breitling Superocean Heritage — für den ernsthaften Taucher" },
      {
        type: "paragraph",
        text: "Die Superocean Heritage mit Vintage-Lünette und Kautschukband ist die Wahl des Mannes, der nicht nur so tut als ob. 200m Wasserdichte, Unidirektional-Lünette, leuchtende Zeiger: für das offene Meer gemacht.",
      },
      { type: "watch_cta_generic" },
      { type: "heading", text: "Rolex Sea-Dweller — wenn's tiefer geht" },
      {
        type: "paragraph",
        text: "1220 Meter Wasserdichte brauchen die wenigsten. Aber die Sea-Dweller mit ihrem Heliumventil und dem massiven Gehäuse ist die Taucheruhr, die sagt: Ich nehme mein Hobby ernst. Und der cyclop-freie Saphirglasrand hat eine Ehrlichkeit, die man schätzt.",
      },
      { type: "watch_cta_generic" },
    ],
  },
  {
    id: "kunst-kultur-vernissage",
    title: "Kunst & Kultur: Vernissage, Museum & Konzert — vier Uhren für kultivierte Abende",
    excerpt:
      "Portugieser, Patek Calatrava, Jaeger-LeCoultre Reverso & Omega Tourbillon für Vernissagen und Kulturabende.",
    occasion: "Kultur",
    brand: "IWC",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-04",
    heroImageAlt:
      "Hand mit IWC Portugieser, Galeriekatalog haltend, unscharfes Gemälde im Hintergrund",
    metaTitle: "Uhr für Vernissage & Museum mieten | marianni",
    metaDescription:
      "Portugieser, Patek Calatrava & Omega Tourbillon für Vernissagen & Kulturabende — Tagesmiete, Versicherung inkl. Ab €129/Tag.",
    bundleSlugs: ["gala-wochenende-rolex-daytona"],
    relatedSlugs: ["gala-charity-abend", "wochenend-ausflug-genf-wien", "sommerurlaub-mittelmeer"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Wer in eine Vernissage geht, weiß, dass Details beobachtet werden. Das Milieu schaut — diskret, aber genau. Die Uhr ist das einzige Objekt, das selbst als Kunstwerk gelesen werden kann. Bei dem, was am Handgelenk sitzt, scheiden sich die Kenner von den Gästen.",
      },
      { type: "heading", text: "IWC Portugieser 7-Day — Handwerkskunst, sichtbar gemacht" },
      {
        type: "paragraph",
        text: "Der Portugieser 7-Day mit seinem offenen Sichtboden zeigt das Werk — buchstäblich. Das Uhrwerk dreht sich unter dem Kristallglas, der Rotor schwingt, die Unruh schlägt im Rhythmus. Für einen Abend unter Kunstliebhabern: Schönheit von innen nach außen.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "iwc-portugieser-7day" },
      { type: "heading", text: "Patek Philippe Calatrava — das leise Original" },
      {
        type: "paragraph",
        text: "Die Calatrava ist die Referenzuhr für Kunstsammler. Sie ist in keiner Vitrine der Welt fehl am Platz — weder neben einem Gerhard Richter noch einem Banksy. Ihre Schlichtheit ist ihre Radikalität: absolute Stille als stärkste Aussage.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "patek-calatrava-5196r" },
      { type: "heading", text: "Jaeger-LeCoultre Reverso — ein Kunstwerk am Handgelenk" },
      {
        type: "paragraph",
        text: "Das Reverso dreht sich — buchstäblich. Sein Art-Déco-Gehäuse lässt sich umklappen, um das Werk zu schützen oder eine gravierte Rückseite zu zeigen. 1931 für Polo-Spieler entworfen, heute das erlesenste Statement für Kulturliebhaber.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "jlc-reverso" },
      { type: "heading", text: "Omega De Ville Tourbillon — Mechanik als Kunstform" },
      {
        type: "paragraph",
        text: "Ein Tourbillon ist die komplizierteste Komplikation der Uhrmacherei. Der De Ville Tourbillon zeigt ihn offen auf 6 Uhr — ein kleines Karussell gegen die Gravitation. In einer Galerie macht er das Gespräch unvermeidlich.",
      },
      { type: "watch_cta", bundleSlug: "gala-wochenende-rolex-daytona", watchSlug: "omega-deville-tourbillon" },
    ],
  },
  {
    id: "vatertag",
    title: "Vatertag / Geschenk für ihn — vier Uhren, die man nicht vergisst",
    excerpt:
      "Submariner, Navitimer, Carrera & Speedmaster für Papa — Lieferung freitagabends mit Grußkarte, Rückholung montags.",
    occasion: "Geschenk",
    brand: "Rolex",
    author: "Marlo Redaktion",
    publishedAt: "2026-05-02",
    heroImageAlt:
      "Rolex Submariner in Marlo-Geschenkbox auf verwittertem Holzschreibtisch, Lesebrille und Buch daneben",
    metaTitle: "Uhr als Vatertagsgeschenk mieten | marianni",
    metaDescription:
      "Submariner, Navitimer & Carrera für Papa — Lieferung freitagabends mit Grußkarte, Rückholung montags. Ab €119/Wochenende.",
    bundleSlugs: ["jubilaeum-audemars-piguet"],
    relatedSlugs: ["geburtstag", "business-dinner", "die-hochzeit"],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Manche Männer kaufen sich keine Luxusuhr. Nicht weil sie sie nicht mögen — sondern weil sie es sich nicht erlauben. Vatertag ist der Anlass, ihnen diese Entscheidung abzunehmen. Für ein Wochenende.",
      },
      { type: "heading", text: "Rolex Submariner — die Traumuhr des Vaters" },
      {
        type: "paragraph",
        text: "Fast jeder Mann hat irgendwann von einer Submariner geträumt. Die schwarze Lünette, das Oyster-Armband, die 300m Wasserdichtheit: Die Ikone unter den Sporttaucheruhren. Zum Vatertag die Submariner zu mieten bedeutet das Erfüllen eines Wunsches.",
      },
      { type: "watch_cta", bundleSlug: "jubilaeum-audemars-piguet", watchSlug: "rolex-submariner-date" },
      {
        type: "styling_tip",
        text: "Styling-Tipp: Die Submariner sitzt ideal am Handgelenk ohne Lederband — wählen Sie ein Hemd ohne Manschettenknöpfe, um das Oyster-Armband in seiner ganzen Breite zu zeigen.",
      },
      { type: "heading", text: "Breitling Navitimer — für den Vater mit Sinn für Mechanik" },
      {
        type: "paragraph",
        text: "Die Navitimer ist die komplizierteste Fliegeruhr, die man noch mit dem Auge ablesen kann. Ihr Rechenschieber-Drehlünette war für Piloten gedacht; heute ist er das Statement des Mannes, der seine Werkzeuge versteht. Für den Vater, der gerne erklärt, wie Dinge funktionieren.",
      },
      { type: "watch_cta", bundleSlug: "jubilaeum-audemars-piguet", watchSlug: "breitling-navitimer-b01" },
      { type: "heading", text: "TAG Heuer Carrera — der Rennsport am Handgelenk" },
      {
        type: "paragraph",
        text: "Die Carrera wurde 1963 nach dem gefährlichsten Straßenrennen der Welt benannt. Jack Heuer entwarf sie für Rennfahrer, die mit einem Blick ihre Zeit lesen mussten. Für den Vater, dem Schnelligkeit und Präzision nie egal waren.",
      },
      { type: "watch_cta", bundleSlug: "jubilaeum-audemars-piguet", watchSlug: "tag-heuer-carrera" },
      { type: "heading", text: "Omega Speedmaster Moonwatch — der Vater der Mondlandung" },
      {
        type: "paragraph",
        text: "Neil Armstrong trug eine Speedmaster auf dem Mond. Das ist keine Marketinggeschichte — das ist NASA-Geschichte. Zum Vatertag die Moonwatch zu schenken bedeutet: Du bist derjenige, der die unmöglichen Dinge möglich macht.",
      },
      { type: "watch_cta", bundleSlug: "jubilaeum-audemars-piguet", watchSlug: "omega-speedmaster-moonwatch" },
      {
        type: "paragraph",
        text: "Vatertag-Lieferung: freitagabends mit personalisierbarer Grußkarte, in der Marlo-Geschenkbox, weiße Handschuhe. Rückholung Montagmorgen — das Wochenende gehört ihm.",
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
): EditorialStory[] {
  const current = getStoryById(currentId);
  if (!current) return [];

  if (current.relatedSlugs && current.relatedSlugs.length > 0) {
    return current.relatedSlugs
      .slice(0, limit)
      .map((id) => getStoryById(id))
      .filter((s): s is EditorialStory => s !== undefined);
  }

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
