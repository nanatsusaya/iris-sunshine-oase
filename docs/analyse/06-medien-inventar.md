# 06 — Medien-Inventar und Ablage-Empfehlung

## Mengengerüst

Gemessen am 18.07.2026, vor und nach dem Aufräumen (siehe unten).

| Bereich | Dateien vorher | Größe vorher | Dateien jetzt | Größe jetzt |
|---|---|---|---|---|
| `iris-sujnshine-oase-backup/wp-content/` | 2.523 | 145,3 MB | 505 | 85,7 MB |
| `media-backup/` | 849 | 590,3 MB | 345 | 494,3 MB |
| `screenshots/` | 69 | 3,3 MB | 69 | 3,3 MB |
| XML-Export (beide Fassungen) | 2 | 10,7 MB | 2 | 10,7 MB |
| **Gesamt** | **3.443** | **749,7 MB** | **921** | **594,0 MB** |

Die folgenden Abschnitte beschreiben den **Zustand vor dem Aufräumen** — sie
erklären, woraus sich die Differenz ergibt.

## Wie viel davon ist Substanz?

### wp-content: zwei Drittel sind reproduzierbar

| | Dateien | Größe |
|---|---|---|
| Automatisch erzeugte Größenvarianten | 2.018 | 59,6 MB |
| Originale | 505 | 85,7 MB |

WordPress legt zu jedem Upload mehrere Zuschnitte an (`-150x150.jpg`,
`-300x200.jpg` und so weiter). Diese 2.018 Dateien sind **reine Ableitungen** —
sie tragen keine Information, die nicht in den Originalen steckt, und würden von
einem Astro-Build ohnehin neu erzeugt.

Die Zahl der Originale (505) deckt sich mit den 504 `attachment`-Einträgen im
Export.

### media-backup: hoher Duplikat-Anteil

Der Ordner enthält thematisch sortierte Originalfotos: Studio, Frau, Mann, Paar,
Massage, Kosmetik, Sonnenbank, Landschaft, Stilleben, Thema, Sonne. Dazu ein
Ordner „sunshine alles" mit Material von 2013 (Logo-Entwürfe, GIMP-Dateien, ein
Flyer als PowerPoint).

Auffällig: 373 Dateien (259,8 MB) tragen den Zusatz `-Big` und existieren
zusätzlich in einer Webgröße.

### Inhaltsgleiche Duplikate

Über `media-backup` und die wp-content-Originale hinweg per SHA1 geprüft:

**485 Dateien sind byte-identische Kopien anderer Dateien — 83,2 MB.**

Das ist erwartbar, weil dieselben Fotos einmal im Sortier-Archiv und einmal in
der WordPress-Mediathek liegen.

### Zusammengefasst

| | Größe |
|---|---|
| Reproduzierbare Größenvarianten | 59,6 MB |
| Redundante Kopien | 83,2 MB |
| Windows-Artefakte (`Thumbs.db`) | 12,9 MB |
| **Tatsächlich einzigartiges Quellmaterial** | **594,0 MB** |

## Bildrechte — vor Wiederverwendung klären

Das Impressum der Altseite sagt, alle Bilder stammten „entweder von der Webseite
pixabay und somit unter dem CC0" oder seien eigene Fotos.

**Welches Bild zu welcher Kategorie gehört, ist nirgends dokumentiert.** Bei den
Studio-Aufnahmen ist die Herkunft klar, bei Stock-Motiven aus 2013–2017 nicht.

Das ist nicht bloß eine Formalie: Pixabay hat seine Lizenzbedingungen 2019
geändert, und CC0 galt nur für ältere Uploads. Wer heute ein damals
heruntergeladenes Bild weiterverwendet, sollte die Herkunft belegen können.

**Empfehlung:** Beim Kuratieren für die neue Seite jedes übernommene Bild in
einer Liste erfassen — Datei, Quelle, Lizenz, Nachweis. Im Zweifel lieber neu
fotografieren oder neu lizenzieren. Für ein Studio, das ohnehin von eigenen
Räumen und Geräten lebt, sind eigene Aufnahmen die bessere Wahl.

Vorhandene Markenassets: `Logo.png`, `logo2.png`, `logo3.png`, `logo4.png`,
`favicon.ico`, `Logo-Sun.svg`. Letztere ist trotz der Endung **kein Vektorlogo**,
sondern ein eingebettetes PNG.

---

## Ablage — getroffene Entscheidung

> **Der gesamte Ordner `Archive/` ist per `.gitignore` vom Repository
> ausgeschlossen.** Kein Bild, kein Screenshot und keine Export-Datei wird
> versioniert.

### Begründung

Zwei Gründe, ein technischer und ein rechtlicher.

**Rechtlich:** Die Nutzungsrechte an den Bildern sind nicht dokumentiert (siehe
oben). In ein öffentliches Repository gehört kein Material, dessen Lizenzstatus
ungeklärt ist. Der Ausschluss ist bewusst **pauschal** gehalten — eine Regel
statt einer Einzelfallprüfung je Datei. Regeln überleben, Abwägungen erodieren.

**Technisch:** Bei einem Workflow, in dem Tickets von einem Agenten abgearbeitet
werden, wird das Repository bei jedem Lauf neu geklont. Jedes Megabyte kostet
dann bei jedem einzelnen Ticket Zeit — dauerhaft, nicht einmalig. Dazu speichert
Git Binärdateien ohne Delta-Kompression: Ein einmal eingechecktes Bild bleibt
für immer in der Historie, auch nach dem Löschen.

### Wie die Inhalte trotzdem erhalten bleiben

Der Ausschluss funktioniert nur, weil das Wesentliche vorher herausgelöst wurde:

| Was | Wo | Erzeugt durch |
|---|---|---|
| Alle Seitentexte, Beiträge, Öffnungszeiten, URL-Bestand, Bildzuordnung | [`docs/inhalte/`](../inhalte/README.md) | `tools/extract-wp-content.mjs` |
| Preisliste, Design-System, Mängel, Struktur | `docs/analyse/` | diese Analyse |

Damit ist `docs/` die einzige versionierte Quelle der Alt-Inhalte — und zugleich
die einzige, die ein Agent überhaupt braucht.

### Was später doch ins Repository kommt

Die **kuratierten Webbilder** — also die 30 bis 60 Bilder, die die neue Seite
tatsächlich zeigt. Aber erst, wenn für jedes einzelne die Herkunft geklärt und
dokumentiert ist. Sie kommen dann nach `src/assets/`, auf Zielgröße gebracht als
WebP oder AVIF; die Größenvarianten erzeugt Astro beim Build.

Bilder mit ungeklärter Herkunft kommen nicht ins Repository — auch nicht
„vorläufig".

### Aufgeräumt am 18.07.2026 — erledigt

Entfernt wurden 2.522 Dateien (155,7 MB), ausschließlich solche ohne eigenen
Informationsgehalt:

| Kategorie | Dateien | Größe | Regel |
|---|---|---|---|
| Größenvarianten | 2.018 | 59,6 MB | `-BREITExHÖHE` vor der Endung, nur wenn das Original im selben Ordner liegt |
| Inhaltsgleiche Duplikate | 485 | 83,2 MB | byte-identisch per SHA1; behalten wurde die Fassung unter `wp-content/` |
| `Thumbs.db` | 19 | 12,9 MB | Windows-Artefakte |

**Kein Motiv ist verloren gegangen.** Zu jeder entfernten Datei existiert
entweder das Original oder eine byte-identische Kopie; verwaiste Varianten ohne
Original gab es keine.

Das vollständige Protokoll aller 2.522 Einträge liegt im Archiv selbst unter
`Archive/AUFRAEUMPROTOKOLL.md`. Es hält zu jedem entfernten Duplikat fest,
welche Datei an seine Stelle tritt — damit bleibt die thematische Einsortierung
des `media-backup/` (`Media/Studio/`, `Media/Frau/` …) nachvollziehbar, auch wo
die dortige Kopie zugunsten der `wp-content/`-Fassung entfallen ist.

Unangetastet blieben die Screenshots und beide XML-Exporte. Mitentfernt wurden
97 leere Ordner, darunter die Jahresordner `wp-content/2021/` bis `2026/` — sie
waren bereits vorher leer, nach Mai 2020 wurde nichts mehr hochgeladen.

### Wohin mit dem Archiv?

> **Die Sicherung des Archivs verantwortet der Betreiber selbst.** Der folgende
> Abschnitt hält nur fest, welche Wege geprüft wurden und warum einer davon
> ausscheidet.

**Ausgeschlossen: ein GitHub Release in diesem Repository.**

Naheliegend wäre, das Archiv als ZIP an ein Release zu hängen — Release-Assets
liegen außerhalb der Git-Historie, ein `git clone` lädt sie nicht mit. Das löst
das Größenproblem, aber nicht das eigentliche:

**Dieses Repository ist öffentlich, und Release-Assets eines öffentlichen
Repositorys sind ebenfalls öffentlich.** Jeder kann sie ohne Anmeldung
herunterladen. Sie liegen außerhalb der Historie, nicht außerhalb der
Öffentlichkeit.

Ein Archiv-Release würde damit genau das veröffentlichen, wovor der
`.gitignore`-Ausschluss schützen soll: die Bilder mit ungeklärten
Nutzungsrechten und die Datei `…ORIGINAL-MIT-PII.xml` mit 2.216
Kontaktformular-Einsendungen samt E-Mail- und IP-Adressen.

**Wenn GitHub, dann ein separates privates Repository.** Dessen Release-Assets
sind nur für Berechtigte sichtbar. Auch dort gehört `…ORIGINAL-MIT-PII.xml`
aber nicht hinein — personenbezogene Daten Dritter gehören nur dorthin, wo es
einen Grund für sie gibt, und den gibt es außerhalb des lokalen Rechners nicht.

**Sonst außerhalb von GitHub.** Externe Festplatte plus verschlüsseltes
Cloud-Backup. Das Archiv ist ein Backup, kein Projektartefakt — ein Agent
braucht es nie, weil alles Nötige in `docs/` steht.

**Von Git LFS ist abzuraten** (Begründung unten) — und ebenso davon, das Archiv
unverändert einzuchecken.

### Wovon abzuraten ist

**Git LFS.** Auf den ersten Blick die naheliegende Lösung, in diesem Fall aber
die schlechteste. GitHub gibt kostenlos 1 GB Speicher und 1 GB Bandbreite pro
Monat; beides wird bei 594 MB Bestand und wiederholten Clones sofort gesprengt,
danach kostet es. LFS bringt zusätzliche Werkzeugabhängigkeiten mit, und wenn
ein Agent den Checkout ohne LFS-Unterstützung macht, hat er statt der Bilder
Textdateien mit Zeigern darin — ein Fehlerbild, das schwer zu diagnostizieren
ist.

**Alles unverändert einchecken.** Funktioniert technisch (kein Einzelfile
überschreitet GitHubs 100-MB-Grenze), aber macht jeden Clone zu einem
600-MB-Download und die Historie unumkehrbar schwer.

### Offene Schritte

- [x] Texte nach `docs/inhalte/` extrahieren
- [x] `Archive/` per `.gitignore` ausschließen
- [x] Archiv aufräumen — 749,7 MB → 594,0 MB
- [ ] Archiv sichern — **liegt beim Betreiber**, nicht in diesem Projekt
- [ ] Bilder für die neue Seite auswählen, Herkunft je Bild klären und
      dokumentieren, optimiert nach `src/assets/` übernehmen

> **Wichtig:** Mit dem `.gitignore`-Ausschluss ist das Repository ausdrücklich
> **kein** Backup des Altbestands mehr. Solange das Archiv nur auf einem Rechner
> liegt, existiert es einfach. Sicherung und Versionierung des Archivs liegen
> beim Betreiber und sind nicht Teil dieses Repositorys.
