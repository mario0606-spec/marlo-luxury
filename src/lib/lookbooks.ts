export interface WatchItem {
  name: string;
  description: string;
  slug: string;
  price: string;
}

export interface Lookbook {
  slug: string;
  title: string;
  subtitle: string;
  occasion: string;
  intro: string;
  watches: WatchItem[];
  stylingTip?: string;
}

export const lookbooks: Lookbook[] = [
  {
    slug: "die-hochzeit",
    title: "Die Hochzeit",
    subtitle: "Der schönste Tag verdient die schönste Uhr.",
    occasion: "Hochzeit",
    intro:
      "Du hast Monate für diesen Tag geplant. Das Hemd sitzt perfekt. Der Anzug auch. Was fehlt, ist die Uhr — die letzte Geste, die alles zusammenhält.\n\nBei einer Hochzeit trägt die Uhr die Geschichte des Tages mit. Sie ist das Erste, was die Braut sieht, wenn ihr euch gegenübersteht. Das Erste, woran sich Gäste erinnern. Und das Einzige, das auf den Fotos für immer bleibt.\n\nTrage den Moment — mit einer Uhr, die zu ihm passt.",
    watches: [
      {
        name: "Rolex Datejust 41 — Weißgold / Jubilé-Armband",
        description:
          "Die Datejust ist die Uhr des Moments. Diskret genug für die Trauungszeremonie, stark genug für das Foto der nächsten zwanzig Jahre. Das Jubilé-Armband schmiegt sich an das Handgelenk wie ein zweites Versprechen.",
        slug: "rolex-datejust-41-weissgold",
        price: "ab €149/Wochenende",
      },
      {
        name: "Patek Philippe Calatrava 5227G",
        description:
          "Wenn der Vater schon eine Patek trägt — dann trägst du heute die gleiche. Die Calatrava ist das stille Einverständnis zwischen Generationen. Weiße Schlichtheit, Gelbgold-Zifferblatt, handgenähtes Lederband in Bordeaux.",
        slug: "patek-calatrava-5227g",
        price: "ab €249/Wochenende",
      },
      {
        name: "Omega Constellation Co-Axial",
        description:
          "Für den Bräutigam, der Zurückhaltung als Stärke versteht: Die Constellation sitzt am Handgelenk, ohne aufzufallen — aber wer genau schaut, sieht sofort: das ist kein gewöhnlicher Tag.",
        slug: "omega-constellation-co-axial",
        price: "ab €89/Wochenende",
      },
      {
        name: "TAG Heuer Carrera Calibre 5 — Blau/Silber",
        description:
          "Stilvoll, aber nicht konkurrierend. Die Carrera signalisiert Persönlichkeit, ohne dem Bräutigam die Schau zu stehlen. Perfekt für den Trauzeugen, der ankommen will, ohne anzugeben.",
        slug: "tag-heuer-carrera-calibre5",
        price: "ab €79/Wochenende",
      },
    ],
    stylingTip:
      "Kombination aus weißem Hemd, Weinrot-Krawatte und der Datejust in Weißgold ist das klassische Dreiklang — funktioniert von 11 Uhr morgens bis 2 Uhr nachts.",
  },
  {
    slug: "gala-charity-abend",
    title: "Gala & Charity-Abend",
    subtitle: "Der Abend beginnt am Handgelenk.",
    occasion: "Gala",
    intro:
      "Ein Charity-Abend ist kein gewöhnlicher Abend. Der Dresscode steht auf der Einladung — aber was du am Handgelenk trägst, ist dein eigener Satz. Gäste sehen ihn. Fotografen auch. Der Tischnachbar fragt. Der Gastgeber bemerkt.\n\nBei Gala ist die Uhr keine Dekoration. Sie ist die Aussage.\n\nWelche Aussage willst du machen?",
    watches: [
      {
        name: "Audemars Piguet Royal Oak Selfwinding — 41mm, Stahl",
        description:
          "Das Royal Oak ist seit 1972 das lauteste Statement in jedem Raum. Das integrierte Armband, das Tapisserie-Zifferblatt, die acht Sechskantschrauben — es gibt keine Uhr, die selbstsicherer am Tisch sitzt. Für den Abend, an dem du in Erinnerung bleiben willst.",
        slug: "ap-royal-oak-selfwinding",
        price: "ab €199/Abend",
      },
      {
        name: "Rolex Day-Date 40 — Gelbgold, Président-Armband",
        description:
          '"The Watch of Presidents" ist nicht ohne Grund so benannt. Zum Smoking ist die Day-Date das goldene Kapitel — rund, vollständig, unvergesslich. Das Président-Armband aus Gelbgold ist das beste Argument gegen Manschettenknöpfe.',
        slug: "rolex-day-date-40",
        price: "ab €229/Abend",
      },
      {
        name: "IWC Portugieser Chronograph — Roségold",
        description:
          "Für den Gala-Gast, der lieber Tiefe als Volumen zeigt: Der Portugieser Chrono in Roségold verbindet Handwerkskunst mit Intimität. Das weiße Zifferblatt, die blauen Zeiger — ein Augenpaar, das nie langweilig wird.",
        slug: "iwc-portugieser-chronograph-rosegold",
        price: "ab €169/Abend",
      },
      {
        name: "Cartier Santos de Cartier — ADLC Stahl",
        description:
          "Zum weißen Hemd ohne Krawatte, zum Tuxedo ohne Schleife: Der Santos bricht Regeln, ohne die Eleganz zu brechen. Er ist die Uhr des kreativen Philanthropen — Stärke mit Stil.",
        slug: "cartier-santos-adlc",
        price: "ab €139/Abend",
      },
    ],
    stylingTip:
      "Day-Date + Smoking = zu schwer. Tag Heuer Monaco + Smoking = zu locker. Die sweet spot ist Royal Oak oder Portugieser — beides sitzt sowohl unter dem Jackett als auch freigelegt auf dem Tisch.",
  },
  {
    slug: "business-dinner",
    title: "Business-Dinner & wichtige Meetings",
    subtitle: "Die Uhr am Konferenztisch spricht. Du musst nichts erklären.",
    occasion: "Business",
    intro:
      "Der Deal ist noch nicht unterschrieben. Der Gegner sitzt dir gegenüber. Du hast fünfzehn Sekunden, um Vertrauen aufzubauen, bevor du das erste Wort sagst.\n\nDie richtige Uhr sagt: Ich kenne den Wert von Zeit. Meiner und deiner.",
    watches: [
      {
        name: "Omega De Ville Prestige — Stahl/Gold",
        description:
          "Nicht zu laut, nicht zu leise. Der De Ville ist die Business-Uhr für Leute, die wissen, dass Souveränität nicht schreien muss. Das schlanke Gehäuse verschwindet unter der Manschette — und taucht genau dann auf, wenn es zählt.",
        slug: "omega-deville-prestige",
        price: "ab €69/Tag",
      },
      {
        name: "IWC Portugieser Automatic — Silber/Edelstahl",
        description:
          "Wenn der Besprechungsraum nach Precision riecht: Der Portugieser Automatic ist das Uhrwerk des Vertrauens. Große Sekunde, klares Zifferblatt — ein Mann, der diese Uhr trägt, hat seine Hausaufgaben gemacht.",
        slug: "iwc-portugieser-automatic",
        price: "ab €129/Tag",
      },
      {
        name: "Rolex Datejust 36 — Stahl, Oyster-Armband, Silber-Zifferblatt",
        description:
          "Der Klassiker für wichtige Tage. Im Boardroom wirkt die Datejust wie ein zweiter Handschlag — sie sagt, wer du bist, ohne zu übertreiben. Silber auf Stahl ist das Businessgold der deutschen Unternehmenskultur.",
        slug: "rolex-datejust-36-stahl",
        price: "ab €99/Tag",
      },
      {
        name: "Longines Master Collection — Mondphase",
        description:
          "Für den Tisch, an dem Substanz mehr zählt als Status: Die Longines Master Collection mit Mondphase zeigt, dass du es nicht nötig hast, Preisschilder zu tragen. Anspruch ohne Aufwand — das ist die klügste Businessuhr im Raum.",
        slug: "longines-master-mondphase",
        price: "ab €49/Tag",
      },
    ],
    stylingTip:
      "Niemals Chronograph im Vorstellungsgespräch. Drei-Zeiger-Uhr mit Datum — das ist Präzision signalisieren, nicht Hobbyrennen. Und nie: Smartwatch.",
  },
  {
    slug: "wochenend-ausflug-genf-wien",
    title: "Wochenend-Ausflug: Genf oder Wien",
    subtitle: "Wer die schönsten Städte kennt, trägt die passenden Uhren.",
    occasion: "Reise",
    intro:
      "Genf riecht nach Schokolade, Banken und Uhren. Wien riecht nach Kaffee, Geschichte und Eleganz. Beide Städte haben eine gemeinsame Sprache: alles Gute braucht Zeit.\n\nAn einem Wochenend-Ausflug in diese Städte trägt man keine Sportuhr. Und keine Smartwatch. Man trägt Haltung.",
    watches: [
      {
        name: "Cartier Ballon Bleu de Cartier — Roségold, 42mm",
        description:
          "Zum Flanieren durch den ersten Bezirk oder am Lac Léman: Der Ballon Bleu ist die romantischste Uhr der Stadt. Seine Wölbung ist einzigartig, sein Ausdruck ist warmherzig — genau wie ein perfekter Herbsttag in Wien.",
        slug: "cartier-ballon-bleu-rosegold",
        price: "ab €159/Wochenende",
      },
      {
        name: "Omega Seamaster Aqua Terra — Blau/Stahl",
        description:
          "Für den Spaziergang um den Zürichsee nach dem Genf-Meeting: vielseitig, souverän, wasserresistent. Das Aqua Terra passt zur Terrasse des Beau-Rivage genauso wie zur Caféterrasse am Michaelerplatz.",
        slug: "omega-seamaster-aqua-terra-blau",
        price: "ab €99/Wochenende",
      },
      {
        name: "TAG Heuer Aquaracer Professional 300 — Blau",
        description:
          "Wer von der Altstadt direkt ans Wasser wechselt, braucht Anpassungsfähigkeit. Der Aquaracer tauscht nahtlos zwischen Jackett und Fleece — kein Drama, kein Kompromiss.",
        slug: "tag-heuer-aquaracer-300",
        price: "ab €79/Wochenende",
      },
      {
        name: "Longines Record — Silber/Stahl",
        description:
          "Für das Stöbern in Wiener Antiquitätenläden und Genfer Uhrengeschäften: Der Longines Record ist die Uhr der Kenner. Dünnes Gehäuse, zertifiziert chronometrisch — er ist sein eigenes bestes Argument.",
        slug: "longines-record-stahl",
        price: "ab €59/Wochenende",
      },
    ],
  },
  {
    slug: "silvester",
    title: "Silvester",
    subtitle: "Lass das Jahr nicht mit einer gewöhnlichen Uhr enden.",
    occasion: "Silvester",
    intro:
      "Silvester ist der einzige Abend, an dem der Countdown auf deinem Handgelenk läuft. Du weißt: Um Mitternacht schauen alle auf die Uhr. Deine Uhr. Sei bereit.",
    watches: [
      {
        name: "Audemars Piguet Royal Oak Offshore — 44mm, Titan",
        description:
          "Für den Silvester-Abend, der keine Grenzen kennt: Der Offshore ist die lauteste Uhr in jedem Raum. Groß, mutig, titangrau. Wenn Champagner fließt und Konfetti fällt, willst du diese Uhr am Handgelenk.",
        slug: "ap-royal-oak-offshore-titan",
        price: "ab €229/Abend",
      },
      {
        name: "Rolex Submariner Date — Schwarz/Stahl",
        description:
          "Der Submariner ist der ewige Silvester-Begleiter. Zum Rollkragenpullover. Zum Abendanzug. Zur Lederjacke. Er passt zu allem — und er braucht nichts, um zu wirken.",
        slug: "rolex-submariner-date",
        price: "ab €149/Abend",
      },
      {
        name: "Omega Speedmaster Moonwatch — Professional",
        description:
          "Astronauten haben damit die Zeit im Weltall gemessen. Du misst die Zeit bis Mitternacht. Der Speedmaster Professional ist die Uhr für Momente, die man nicht vergisst — seit 1969.",
        slug: "omega-speedmaster-moonwatch",
        price: "ab €119/Abend",
      },
      {
        name: "IWC Portugieser Yacht Club Chronograph — Blau/Roségold",
        description:
          "Für den letzten Abend des Jahres, der auch der schönste werden soll: Der Yacht Club Chrono in Blau und Roségold ist Feste in Uhrenform. Elegant, sportlich, unerwartet.",
        slug: "iwc-portugieser-yacht-chrono",
        price: "ab €189/Abend",
      },
    ],
  },
  {
    slug: "geburtstag",
    title: "Geburtstag — ein besonderer Anlass",
    subtitle: "Dein Geburtstag ist der einzige Tag, an dem du dich feiern darfst.",
    occasion: "Geburtstag",
    intro:
      "Manche Menschen kaufen sich zum Geburtstag eine Uhr. Bei marianni kaufst du dir den Moment — ohne die Verpflichtung auf zwanzig Jahre.\n\nLeih dir heute die Uhr, von der du weißt, dass sie zu dir passt. Oder die, von der du es herausfinden willst.",
    watches: [
      {
        name: "Patek Philippe Nautilus 5711/1A — Stahl, Blau",
        description:
          "Die Warteliste bei Patek beträgt acht Jahre. Bei marianni: 48 Stunden. Der Nautilus ist die Ikone der Ikonen — das Zifferblatt aus Sonnenblau, das integrierte Armband, das Leuchten am Handgelenk. Ein Geburtstagsgeschenk an dich selbst, das du nie vergessen wirst.",
        slug: "patek-nautilus-5711",
        price: "ab €299/Wochenende",
      },
      {
        name: "Rolex Datejust 41 — Roségold, Schokoladenbraunes Zifferblatt",
        description:
          "Warm, edel, persönlich: Das Chocolate-Dial Datejust in Roségold ist die Geburtstagsuhr für den Tag, der sich besonders anfühlen soll — nicht teuer, sondern echt.",
        slug: "rolex-datejust-41-rosegold-chocolate",
        price: "ab €169/Wochenende",
      },
      {
        name: "Cartier Tank Louis Cartier — Gelbgold",
        description:
          "Die Tank ist zeitlos — buchstäblich. Sie ist so zeitlos, dass Cary Grant sie trug, und heute trage ich sie auf meinem Geburtstag. Die Schönheit ist immer die gleiche: rechteckig, still, vollkommen.",
        slug: "cartier-tank-louis-gelbgold",
        price: "ab €199/Wochenende",
      },
      {
        name: "Omega Constellation — Stahl/Gold, Weißes Zifferblatt",
        description:
          "Ein Geburtstag, der sich leicht anfühlen soll: Die Constellation ist Eleganz ohne Gewicht. Brillantensteinchen auf der Lünette, Stahl-Gold-Kombination — das ist die Uhr für das Dinner zum Geburtstag, das sich anfühlt wie eine Umarmung.",
        slug: "omega-constellation-stahl-gold",
        price: "ab €109/Wochenende",
      },
    ],
  },
  {
    slug: "erstes-date",
    title: "Erstes Date, das bleiben soll",
    subtitle: "Du hast nur eine Chance, den ersten Eindruck zu hinterlassen.",
    occasion: "Date",
    intro:
      "Nicht mit der Uhr. Mit dem Gefühl, das sie vermittelt: Ich habe Stil. Ich habe Haltung. Ich nehme diesen Moment ernst.\n\nDas Erste Date ist der einzige Abend, bei dem jedes Detail zählt — und bei dem du nicht an allem gleichzeitig denken solltest. Lass die Uhr denken.",
    watches: [
      {
        name: "Cartier Santos de Cartier — Stahl, 40mm",
        description:
          "Der Santos ist der charmanteste Uhrenklassiker der Geschichte. Er hat Persönlichkeit ohne zu prahlen — und er erzählt eine Geschichte (Cartier hat ihn 1904 für Alberto Santos-Dumont entworfen, damit er beim Fliegen die Zeit ablesen konnte). Eine Uhr mit Geschichte macht deinen Abend interessanter.",
        slug: "cartier-santos-stahl",
        price: "ab €99/Abend",
      },
      {
        name: "TAG Heuer Monaco — Blau, Automatik",
        description:
          "Steve McQueen. Le Mans. Lederjacke. Du musst das alles nicht erklären — die Monaco erklärt es selbst. Das quadratische Gehäuse ist das mutigste Statement auf dem Handgelenk: Ich bin anders, und das ist absichtlich.",
        slug: "tag-heuer-monaco-blau",
        price: "ab €109/Abend",
      },
      {
        name: "Omega Seamaster Professional 300m — Schwarz",
        description:
          "Lässig genug für das Barhocker-Gespräch, präzise genug für das Restaurant-Dinner: Der Seamaster 300m ist die souveräne Date-Uhr. James Bond wählt ihn nicht umsonst. Du auch nicht.",
        slug: "omega-seamaster-300m",
        price: "ab €99/Abend",
      },
      {
        name: "Longines Master Collection Chronograph — Stahl, Weiß",
        description:
          "Für das erste Date, bei dem du zeigen willst: Ich weiß, was gut ist — ohne protzen zu müssen. Der Longines Master Chrono ist die klügste Uhr in diesem Lookbook. Weniger bekannt, mehr Substanz.",
        slug: "longines-master-chrono",
        price: "ab €59/Abend",
      },
    ],
    stylingTip:
      "Erster Abend = keine Sportuhr. Kein Chrono mit zu vielen Hilfszifferblättern. Drei Zeiger, klares Zifferblatt, Ledermanschette oder Metallband — das ist Fokus signalisieren.",
  },
  {
    slug: "sommerurlaub-mittelmeer",
    title: "Sommerurlaub — Mittelmeer",
    subtitle: "Santorini. Amalfi. Dubrovnik. Die Uhr, die dazu passt, gibt es hier.",
    occasion: "Urlaub",
    intro:
      "Sommer am Meer ist der Kontext, in dem alles leichter wird: das Leinen, die Schritte, das Gespräch. Auch die Uhr sollte leichter werden — aber nicht weniger gut.\n\nKeine Plastik-Smartwatch. Keine Vintage-Schätzchen, die du nicht ins Wasser nimmst. Nimm die Uhr mit, die du liebst, weil du sie gemietet hast.",
    watches: [
      {
        name: "Rolex Submariner Date — Blau/Blau, Stahl (‚Bluesy')",
        description:
          "Die ikonischste Taucheruhr der Welt, in der Farbe des Mittelmeers: Der Submariner in Blau/Blau ist das Urlaubsobjekt schlechthin. Er ist 300m wasserdicht, er ist blau wie das Wasser unter deinen Füßen, er ist das Stück, das alle am Pool bewundern.",
        slug: "rolex-submariner-blau-stahl",
        price: "ab €149/Woche",
      },
      {
        name: "Omega Seamaster Diver 300m — Türkis (‚Tropics')",
        description:
          "Für die Poolbar auf Mykonos: Das Tropics-Zifferblatt in Türkis ist der Sommer in Uhrenform. Das Kautschukband ist bequem, wasserdicht, und sieht aus wie gemacht für Salzwasser und Rosé.",
        slug: "omega-seamaster-tropics",
        price: "ab €119/Woche",
      },
      {
        name: "TAG Heuer Aquaracer Professional 300 — Khaki/Grün",
        description:
          "Für den Urlaub zwischen Segeltörn und Cocktailstunde: Der Aquaracer in Khaki ist das vielseitigste Stück im Sommerlookbook. Zum Badeshorts. Zum Leinenhemd. Zum Bootsschuh ohne Socken.",
        slug: "tag-heuer-aquaracer-khaki",
        price: "ab €79/Woche",
      },
      {
        name: "Breitling Superocean Heritage II — Blau, 46mm",
        description:
          "Für den Taucher, den Schnorchler, den Traumtänzer: Der Superocean Heritage ist die Uhr für alle, die das Meer ernst nehmen — oder zumindest so aussehen wollen, als ob. Groß, dramatisch, blau.",
        slug: "breitling-superocean-heritage-blau",
        price: "ab €129/Woche",
      },
    ],
    stylingTip:
      "Kautschukband im Urlaub, immer. Lederband bei Salzwasser — nie. marianni liefert die Uhr mit Reiseversicherung, damit du sie auch wirklich trägst, nicht im Safe lässt.",
  },
  {
    slug: "kunst-kultur-vernissage",
    title: "Kunst & Kultur: Museumsbesuch, Vernissage",
    subtitle: "Die schönste Kunst trägt man manchmal am Handgelenk.",
    occasion: "Kultur",
    intro:
      "Eine Vernissage ist der Ort, an dem du gleichzeitig Kunst betrachtest und selbst betrachtet wirst. Ein Museumsbesuch ist der Ort, an dem Zeit eine andere Bedeutung bekommt.\n\nBeides verlangt eine Uhr, die versteht, was Schönheit ist.",
    watches: [
      {
        name: "IWC Portugieser Automatic — Weißes Zifferblatt, 42mm",
        description:
          "Das Zifferblatt des Portugieser ist selbst ein kleines Kunstwerk: arabische Ziffern, dezentrale Sekunde, arabische Indizes. Er passt in die Pinakothek genauso wie in die Galerie — er ist Präzision als ästhetisches Prinzip.",
        slug: "iwc-portugieser-automatic-weiss",
        price: "ab €129/Tag",
      },
      {
        name: "Patek Philippe Calatrava 5196G — Weißgold, Lachs-Zifferblatt",
        description:
          "Für die Vernissage eines aufstrebenden Berliner Künstlers, bei der du der einzige bist, der eine Patek trägt — und der einzige, der es nicht erwähnt. Das Lachs-Zifferblatt ist der Gesprächsstarter, den du gar nicht brauchst.",
        slug: "patek-calatrava-5196g-lachs",
        price: "ab €279/Tag",
      },
      {
        name: "Omega De Ville Tourbillon — Limited Edition",
        description:
          "Mechanik als Kunst: Das Tourbillon rotiert sichtbar im Zifferblatt — ein kleines, perpetuierliches Uhrwerk, das den Fokus von jedem Gespräch auf dein Handgelenk zieht. In einer Kunstgalerie ist das nicht unangemessen — es ist angemessen.",
        slug: "omega-deville-tourbillon",
        price: "ab €349/Tag",
      },
      {
        name: "Cartier Tank Américaine — Gelbgold",
        description:
          "Die Tank Américaine ist das Bindeglied zwischen Architektur und Schmuck. Art Déco in Gehäuseform. Louis Cartier und der Panzer, der ihm die Inspiration gab — das ist die Uhr für den Besuch im MoMA, im Städel oder im Centre Pompidou.",
        slug: "cartier-tank-americaine-gelbgold",
        price: "ab €189/Tag",
      },
    ],
  },
  {
    slug: "vatertag",
    title: "Vatertag / Geschenk für ihn",
    subtitle: "Die beste Überraschung ist die, die er nie vergisst.",
    occasion: "Geschenk",
    intro:
      "Krawatte. Rasierwasser. Socken. Er weiß, was kommt. Dieses Jahr nicht.\n\nSchenkst du ihm eine Uhr — für einen Tag, ein Wochenende, eine Woche — schenkst du ihm keinen Gegenstand. Du schenkst ihm das Gefühl, das nur die richtige Uhr am richtigen Handgelenk auslöst.\n\nmarianni liefert die Uhr für Papa — Freitagabend pünktlich an die Haustür.",
    watches: [
      {
        name: "Rolex Submariner Date — Schwarz/Stahl",
        description:
          "Weil er sich nie selbst eine kaufen würde — aber immer davon geträumt hat. Der Submariner ist die Vaterfigur unter den Uhren: zuverlässig, zeitlos, ohne Kapriolen. Ein Wochenende damit trägt er weiter in der Erinnerung.",
        slug: "rolex-submariner-date",
        price: "ab €149/Wochenende · Geschenkverpackung inklusive",
      },
      {
        name: "Breitling Navitimer B01 Chronograph — 43mm",
        description:
          "Für den Vater, der Flugzeuge liebt: Der Navitimer ist der Chronograph der Piloten. Das Zifferblatt ist komplex wie ein Cockpit, die Haptik ist souverän wie eine Landung bei Schönwetter. Er wird die Geschichte erzählen, die du ihm schenkst.",
        slug: "breitling-navitimer-b01",
        price: "ab €149/Wochenende · Geschenkverpackung inklusive",
      },
      {
        name: "TAG Heuer Carrera Chronograph — Stahl, Schwarz",
        description:
          "Der Racing-Chrono für den Vater, der noch weiß, was Motorsport bedeutet. TAG Heuer und Carrera gehören zusammen wie Schumacher und Monza. Er trägt ihn nicht zum Rennen — aber er wird sich fühlen, als ob er könnte.",
        slug: "tag-heuer-carrera-chrono-schwarz",
        price: "ab €119/Wochenende · Geschenkverpackung inklusive",
      },
      {
        name: "IWC Pilot's Watch Mark XX — Stahl",
        description:
          "Für den Vater, der Funktionalität schätzt und trotzdem weiß, dass Schönheit kein Widerspruch ist: Der Pilot's Watch Mark XX ist das Beste aus beiden Welten. Klares Zifferblatt, robuste Qualität, zeitloser Stil.",
        slug: "iwc-pilots-watch-mark-xx",
        price: "ab €129/Wochenende · Geschenkverpackung inklusive",
      },
    ],
    stylingTip:
      "Wähle die Uhr. Wir liefern sie freitagabends mit handgeschriebener marianni-Grußkarte. Am Montag holen wir sie zurück. Das Lächeln bleibt.",
  },
];

export function getLookbook(slug: string): Lookbook | undefined {
  return lookbooks.find((lb) => lb.slug === slug);
}
