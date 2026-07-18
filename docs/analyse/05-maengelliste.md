# 05 — Mängelliste der Altseite

Konkrete Defekte des Ist-Zustands, als Arbeitspakete formuliert. Gedacht als
Ausgangsmaterial für Tickets.

Jeder Eintrag ist mit `M-nn` referenzierbar. Die Spalte **Quelle** gibt an, wie
belastbar der Befund ist:

- **verifiziert** — maschinell gegen den WordPress-Export geprüft
- **beobachtet** — aus Screenshots abgelesen, visuelle Einschätzung

---

## Inhalt

### M-01 — Blindtext auf fünf Seiten
**Quelle:** verifiziert · **Priorität:** hoch

Lorem-ipsum-Blindtext steht als Seiteninhalt auf `/moments`, `/kosmetik`,
`/massage`, `/ton-erden` und `/zertifizierung`. Auf `/zertifizierung` sogar als
Überschrift („Lorem ipsum dolor") direkt über echtem Fachtext zur
BfS-Zertifizierung.

**Zu tun:** Texte redaktionell erstellen. Betrifft vor allem den
Moments-Bereich; die Leistungen und Preise sind bekannt, es fehlen die
erklärenden Texte.

### M-02 — „Im Aufbau"-Hinweise mit Datumsstempel
**Quelle:** verifiziert · **Priorität:** hoch

Sechs Seiten tragen einen Baustellenhinweis, zwei davon mit Datum:
„Diese Seite befindet sich **seit Januar 2018** im Aufbau" (`/zertifizierung`)
und „**seit Juli 2019** im Umbau" (`/moments`). Das legt den Stillstand offen.

Auf `/honig` steht der Hinweis, obwohl die Seite vollständigen Inhalt hat.

**Zu tun:** Hinweise entfernen. Seiten entweder fertigstellen oder gar nicht
veröffentlichen.

### M-03 — Veraltete Aktionen im Schaufenster
**Quelle:** verifiziert · **Priorität:** hoch

Die Startseite bewirbt unter „Sonderaktionen" Beiträge von 2019 und 2020,
darunter ein „Juni Highlight" vom 01.06.2019. Dieselbe Einbindung findet sich
auf der Preisseite.

**Zu tun:** Einbindung ersetzen. Entweder gepflegte, datierte Aktionen oder
ersatzlos entfernen.

### M-04 — Uneingelöstes Versprechen im ältesten Beitrag
**Quelle:** verifiziert · **Priorität:** mittel

Der Beitrag „Neuer Webauftritt" vom 22.12.2017 kündigt an, die Seite werde „in
den kommenden Tagen und Wochen mit Leben gefüllt".

**Zu tun:** Beitrag nicht übernehmen.

---

## Funktion

### M-05 — 15 von 20 Sprungmarken laufen ins Leere
**Quelle:** verifiziert · **Priorität:** hoch

Die Leistungskacheln der Startseite verlinken auf Anker der Preisseite, aber mit
falschen IDs. Geprüft wurden 20 Anker-Links; nur 5 haben ein Ziel.

| Verlinkt | Existiert |
|---|---|
| `#naturkosmetik` (3×) | nein — heißt `#moments-naturkosmetik` |
| `#solarium` (3×) | nein — heißt `#sunshine` |
| `#massagen` (3×) | nein — heißt `#moments-massagen` |
| `#wellness-paket` (2×) | nein — heißt `#moments-wellness-pakete` |
| `#wellness` (1×) | nein |
| `#freundinnen-wellness-paket` (3×) | nein — heißt `#moments-freundinnen-wellness-pakete` |

Innerhalb einer Kachel funktioniert nur der Textlink „Zu den Preisen…"; Bild
und Titel derselben Kachel springen ins Leere.

**Zu tun:** Beim Neubau Anker aus den Kategorie-IDs generieren, damit Ziel und
Verweis nicht auseinanderlaufen können. Siehe
[03-leistungen-und-preise.md](03-leistungen-und-preise.md).

### M-28 — Vier Links auf Seiten, die es nie gab
**Quelle:** verifiziert · **Priorität:** hoch

Startseite und „Über uns" verlinken auf `/ueber-uns/sonnenstudio` und
`/ueber-uns/kosmetikstudio`. **Beide Seiten existieren im gesamten Export
nicht** — weder als Seite noch als Beitrag.

| Fundort | Linktext | Ziel |
|---|---|---|
| Startseite, Kachel „Sunshine" | Bild/Titel | `/ueber-uns/sonnenstudio` |
| Startseite, Kachel „Moments" | Bild/Titel | `/ueber-uns/sonnenstudio` |
| Über uns, Absatz Solarien | „hier" | `/ueber-uns/sonnenstudio` |
| Über uns, Absatz Moments | „hier" | `/ueber-uns/kosmetikstudio` |

Zusätzlich ein Verwechsler: Die Kachel **„Moments"** auf der Startseite zeigt
ebenfalls auf `sonnenstudio` statt auf ein Kosmetik-Ziel.

Weitere tote Verweise im Bestand: `/test1` und `/sonderaktion-weihnachten-2018`
(beide aus der Entwurfsseite „Spielewiese", die ohnehin entfällt) sowie
`/leistungen-und-preise/embed` und `/ueber-uns/kosmetikstudio` aus Blogbeiträgen.

**Zu tun:** Beim Neubau auf die tatsächlich vorhandenen Seiten verlinken
(`/sunshine`, `/moments`). Zusammen mit M-05 sind das die beiden Stellen, an
denen die Altseite ihre Besucher systematisch ins Leere schickt — ein
Link-Check gehört in die Build-Pipeline.

### M-06 — Zero-Width-Space in Anker und Überschrift
**Quelle:** verifiziert · **Priorität:** mittel

Die Überschrift „Moments - Massagen" und der zugehörige Anker
`#moments-massagen` enthalten am Ende ein unsichtbares Zeichen (U+200B).
Verweis und Ziel stimmen zwar zeichengenau überein, das ist aber fragil.

Dasselbe Zeichen steht in der Adressangabe der Startseite („Herxheim bei
Landau​ (Pfalz)").

**Zu tun:** Beim Übertragen der Texte auf Steuerzeichen prüfen und entfernen.

### M-07 — Zertifizierungsseite über die Navigation nicht erreichbar
**Quelle:** verifiziert · **Priorität:** mittel

`/zertifizierung` hängt korrekt als Unterseite unter „Über uns", aber im
Menübaum existiert kein Eintrag dafür. Die Seite ist nur über Inline-Links
auffindbar.

**Zu tun:** Beim Neubau in die Navigation aufnehmen oder in „Über uns"
integrieren.

### M-08 — Öffnungszeiten-Widget zeigt doppelte Punkte
**Quelle:** beobachtet · **Priorität:** mittel

Das Widget rendert die Wochentage als „Mo.. – Mi..", „Do.. – Fr..", „Sa..",
„So..". Sichtbar auf jeder Seite mit Sidebar.

**Zu tun:** Entfällt mit dem Plugin. Beim Neubau Öffnungszeiten als Daten
modellieren.

### M-09 — Zweispalter bricht mobil nicht um
**Quelle:** beobachtet · **Priorität:** mittel

Auf `/honig` bleiben Bild und Textspalte auf Mobilgeräten nebeneinander. Die
Textspalte wird auf etwa 130 px gequetscht, die Überschrift bricht mitten im
Satz um.

### M-10 — Kontaktformular ohne Validierung und mit gemischter Sprache
**Quelle:** verifiziert · **Priorität:** mittel

Das E-Mail-Feld ist als `type="text"` deklariert statt `type="email"`, also ohne
Browser-Validierung. Die Platzhalter sind teils englisch („Email", „Message"),
der Button deutsch („Absenden"). Sichtbare Labels fehlen — die `<label>`-Elemente
sind leer, es gibt nur Platzhalter.

**Zu tun:** Beim Neubau korrekte Feldtypen, durchgehend deutsche Beschriftung,
echte Labels (nicht nur Platzhalter, das ist ein Barrierefreiheitsproblem) und
ein wirksamer Spam-Schutz.

### M-11 — Spam-Aufkommen des alten Formulars
**Quelle:** verifiziert · **Priorität:** hoch

Das Pirate-Forms-Formular hat zwischen 2017 und 2021 **2.216 Einsendungen**
gesammelt, ganz überwiegend Spam, und diese samt E-Mail- und IP-Adressen in der
Datenbank abgelegt.

**Zu tun:** Beim Neubau kein serverseitiges Speichern von Einsendungen. Versand
per E-Mail genügt. Spam-Schutz ohne Cookies vorsehen.

---

## Recht

### M-12 — Datenschutzerklärung auf Stand vor DSGVO
**Quelle:** verifiziert · **Priorität:** hoch

Das Impressum enthält einen Google-Analytics-Abschnitt mit der Formulierung
„Durch die Nutzung dieser Website erklären Sie sich mit der Bearbeitung der über
Sie erhobenen Daten … einverstanden". Das ist das Einwilligungsmodell von vor
2018.

Ferner: Datenschutzerklärung und Impressum stehen auf einer Seite; die
Erklärung besteht aus drei Absätzen und deckt weder Rechtsgrundlagen noch
Betroffenenrechte, Speicherdauer oder Auftragsverarbeiter ab.

**Zu tun:** Getrennte, aktuelle Datenschutzerklärung. Vor Livegang juristisch
prüfen lassen.

### M-13 — Kein Cookie-Banner trotz Google Analytics
**Quelle:** beobachtet · **Priorität:** hoch

Auf keinem der 15 Screenshots ist ein Consent-Banner zu sehen, während das
Impressum Google Analytics beschreibt. Möglicherweise beim Screenshotten
weggeklickt — zu prüfen.

**Zu tun:** Beim Neubau möglichst ohne einwilligungspflichtige Dienste
auskommen, dann entfällt das Banner. Falls Statistik gewünscht ist, eine
cookiefreie Lösung wählen.

### M-14 — Google Maps ohne Einwilligung eingebunden
**Quelle:** verifiziert · **Priorität:** hoch

Die Startseite bindet Google Maps als iframe direkt ein. Damit fließen beim
Seitenaufruf Daten an Google, ohne vorherige Einwilligung.

**Zu tun:** Statische Kartengrafik mit Link, oder Karte erst nach aktivem Klick
laden.

### M-15 — Bildrechte nicht dokumentiert
**Quelle:** verifiziert · **Priorität:** hoch

Das Impressum sagt, alle Bilder stammten „entweder von pixabay und somit unter
CC0" oder seien eigene Fotos. Welches Bild welcher Kategorie angehört, ist
nirgends festgehalten.

**Zu tun:** Vor Wiederverwendung klären. Siehe
[06-medien-inventar.md](06-medien-inventar.md).

---

## Text und Konsistenz

### M-16 — Wiederkehrender Grammatikfehler in Überschriften
**Quelle:** verifiziert · **Priorität:** niedrig

„Unser Wellnessprodukte" (`/moments`), „Unser Kosmetikprodukte" (`/kosmetik`),
„Unser Massageangebote" (`/massage`) — jeweils „Unser" statt „Unsere".

### M-17 — Uneinheitliche Schreibweisen
**Quelle:** verifiziert · **Priorität:** niedrig

- „Ton Erden" (Seitentitel) vs. „Tonerden" (Überschrift)
- „Honig Massage" (Überschrift) vs. „Honigmassage" (Fließtext)
- Telefonnummer als „+49 (0)7276 50 50 550" (Impressum) vs. „07276 / 5050550"
  (Blogbeitrag)
- Markenname mit geradem vs. typografischem Apostroph

**Zu tun:** Schreibweisen festlegen und beim Übertragen vereinheitlichen.

### M-18 — Tippfehler
**Quelle:** verifiziert · **Priorität:** niedrig

„staffender Maske" (gemeint: straffender), „Kostemtik" in mehreren
Beitragsauszügen, „Highligt", „hygiensch".

### M-19 — Rohe URL als Linktext
**Quelle:** verifiziert · **Priorität:** niedrig

Auf `/prowin` steht `http://www.prowin.net/cms/aktuelle-aktionen.htm` als
sichtbarer Linktext — unverschlüsselt und über zwei Zeilen umbrechend.

### M-20 — Theme-Credit statt Copyright
**Quelle:** beobachtet · **Priorität:** niedrig

Der Footer trägt als einzige Fußzeile „Hestia | Entwickelt von ThemeIsle". Eine
eigene Copyright-Angabe fehlt.

---

## Gestaltung und Barrierefreiheit

### M-21 — Bildmotive ohne Bezug zum Angebot
**Quelle:** beobachtet · **Priorität:** mittel

Auf der Preisseite illustrieren eine Meeresbucht, Strandkörbe und eine
Fantasy-Ruinen-Illustration die Solarien-Kategorien — drei Bildstile
nebeneinander, keiner mit Bezug zum Studio. Der Hero derselben Seite zeigt
Vintage-Briefpapier mit getrockneten Blüten.

„Über uns" zeigt dunkle Schaufensterpuppen-Torsos — für die Seite über ein
persönlich geführtes Studio das denkbar unpassendste Motiv.

### M-22 — Verlaufs-Hero wirkt wie fehlendes Bild
**Quelle:** beobachtet · **Priorität:** mittel

Impressum, Zertifizierung und ein Blogbeitrag zeigen statt eines Fotos den
CSS-Verlauf von Grau-Blau nach Gelb (`#c2d1f0 → #ffc000`, im Custom CSS belegt).

### M-23 — Kontrastprobleme
**Quelle:** beobachtet · **Priorität:** mittel

- Auf dem Blogbeitrag „Neuer Webauftritt" steht die weiße Meta-Zeile mit dem
  Datum auf dem hellsten Punkt des Hero-Bildes und ist praktisch unlesbar
- Hilfstexte der Aufbau-Hinweise in sehr hellem Grau auf Weiß — dürfte
  WCAG AA unterschreiten
- Hero-Titel auf hellen Bildern (`/ton-erden`, `/honig`, `/ueber-uns`) mit
  unzureichendem Textschatten
- Links sind ausschließlich über die Farbe markiert, ohne Unterstreichung

### M-24 — Uneinheitliche Innenabstände
**Quelle:** beobachtet · **Priorität:** niedrig

Der linke Textbeginn variiert je nach Seite spürbar. Ursache ist die Mischung
aus Theme-Container und Elementor-Sections mit eigenen Paddings. Zusätzlich
existieren zwei verschiedene Sidebar-Raster für Seiten und für Blogbeiträge.

### M-25 — Kein Anruf-Button auf Mobilgeräten
**Quelle:** beobachtet · **Priorität:** mittel

Der mobile Header enthält nur Schriftzug und Burger-Menü. Für ein lokales
Studio, dessen Terminvereinbarung telefonisch läuft, fehlt damit der
naheliegendste Handlungsweg.

### M-26 — Wichtigste Seite ohne Inhalt im ersten Bildschirm
**Quelle:** beobachtet · **Priorität:** mittel

Auf `/leistungen-und-preise` ist mobil nach einem vollen Bildschirm noch kein
einziger Preis sichtbar — Header, Hero, Leerraum, Einleitungstext. Auf sechs
weiteren Seiten besteht der erste Bildschirm aus Header, Hero, Leerraum und
Baustellenhinweis.

### M-27 — Keine Maximalbreite
**Quelle:** beobachtet · **Priorität:** niedrig

Das Layout läuft fluid bis mindestens 1568 px ohne wirksame Begrenzung.
Textzeilen werden auf großen Monitoren sehr lang.
