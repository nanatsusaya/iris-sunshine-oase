# 04 — Design-System der Altseite

Erfasst aus den Screenshots vom 18.07.2026. **Alle Farb-, Größen- und
Abstandsangaben sind visuelle Schätzungen**, keine aus dem Stylesheet
ausgelesenen Werte. Als Anhaltspunkt für die Gestaltungsrichtung gedacht, nicht
als Spezifikation.

Die einzige exakt belegte Farbangabe stammt aus dem Custom CSS im Export:
der Hero-Verlauf `#c2d1f0 → #ffc000`.

## Farben

| Rolle | Wert (geschätzt) | Verwendung |
|---|---|---|
| Akzent Orange | ~`#F5A623` | Links, aktiver Menüpunkt, Telefonnummer, „Zu den Preisen…" |
| Button Orange | ~`#FF9800` – `#F57C00` | Suchbutton, Kategorie-Badges |
| Überschriften | ~`#3C4858` | alle H1–H4 im Inhalt (blaustichiges Anthrazit, Hestia-Standard) |
| Fließtext | ~`#55595C` – `#767676` | Absätze |
| Hilfstext | ~`#9A9A9A` | Untertexte, Datumsangaben — kontrastschwach |
| Flächen | `#FFFFFF` | Header, Inhaltskarte |
| Abschnittswechsel | ~`#F5F5F7` | einzelne Sektionen mit hellgrauem Hintergrund |
| Footer | ~`#2D3436` – `#333` | dunkler Anthrazit-Block |

Die Sonnen-Farbwelt in Orange und Amber ist die tragende Idee und passt zum
Namen. Sie sollte erhalten bleiben.

## Typografie

Durchgehend eine serifenlose Grotesk mit Roboto-Charakter — vermutlich Roboto
selbst, das Hestia-Standard ist.

| Ebene | Größe (geschätzt) | Auszeichnung |
|---|---|---|
| Hero-H1 | ~40–42 px | Bold, weiß, zentriert, Textschatten |
| Sektions-H2 | ~30–32 px | Semibold, zentriert |
| H3 | ~24–26 px | linksbündig |
| Fließtext | ~16–17 px | Zeilenhöhe ~1,5 |
| Menü | ~11–12 px | Uppercase, leichte Laufweite |

Der Hero-Titel skaliert nicht mit der Textlänge — lange Titel behalten dieselbe
Größe und laufen bis an den Rand.

## Layout

**Prägendes Element ist Hestias `main-raised`:** Der gesamte Inhalt liegt auf
einer weißen Karte, die den Hero um etwa 50 px nach oben überlappt, mit weichem
Schlagschatten und minimal gerundeten Ecken. Links und rechts bleiben etwa 24 px
Rand, durch den der Seitenhintergrund durchscheint.

Weitere Merkmale:

- **Karten** mit weichem, diffusem Schatten (Material-Design-Anmutung), Radius
  ~4–6 px. Das Kartenbild sitzt leicht nach oben versetzt und trägt einen
  eigenen, stärkeren Schatten — ein charakteristisches Detail.
- **Buttons** mit farbigem Schlagschatten in der Buttonfarbe.
- **Formularfelder** im Material-Stil: kein Rahmen, nur Unterstrich.
- **Abstände** werden über explizite Elementor-Spacer-Widgets erzeugt, nicht
  über CSS-Margins. Zwischen praktisch jeder Sektion steht ein eigener
  Abstandshalter als Vollbreiten-Sektion.
- **Raster:** dreispaltig für Karten (je 33 %), zweispaltig für Bild-Text-Blöcke
  (50/50), einspaltig für Fließtext.
- **Keine wirksame Maximalbreite** — das Layout läuft fluid bis mindestens
  1568 px, Textzeilen werden auf großen Monitoren sehr breit.

## Was übernommen werden sollte

- Die **warme Sonnen-Farbwelt** in Orange/Amber als Akzent
- Die **großzügigen Foto-Heros** als Seiteneinstieg
- Die **Kartenstruktur** für Leistungen und Preise — inhaltlich sinnvoll
  gegliedert, nur technisch schlecht umgesetzt
- Die **klare Sektionsgliederung** der Startseite

## Was verworfen werden sollte

**Der Verlaufs-Hero.** Auf Impressum, Zertifizierung und einem Blogbeitrag
erscheint statt eines Fotos der CSS-Verlauf von Grau-Blau nach Gelb. Er wirkt
wie ein fehlendes Bild und bricht die Farbwelt. Entweder überall ein Bild oder
überall eine bewusst gestaltete Fläche.

**Der Serifen-Stilbruch.** Die „im Aufbau"-Hinweisboxen und die
Footer-Überschriften sind in einer Serifenschrift gesetzt, alles andere
serifenlos. Ohne erkennbare Absicht.

**Die Material-Design-Anmutung von 2017.** Überlappende Karte, farbige
Buttonschatten, Unterstrich-Formularfelder — das datiert die Seite sofort.

**Fluid ohne Maximalbreite.** Eine Lesebreite von etwa 65–75 Zeichen begrenzen.

**Abstände über Spacer-Elemente.** Gehört in ein Abstandssystem im CSS.

## Markenauftritt

**Es gibt kein Logo.** Der Header trägt nur den Schriftzug „Iris' Sunshine Oase"
in der Systemschrift, ohne Bildmarke und ohne Claim.

Im Medienarchiv liegen zwar Dateien mit Logo-Namen (`Logo.png`, `logo2.png`,
`logo3.png`, `logo4.png`, `Logo-Sun.svg`, `favicon.ico`), aber:

> **`Logo-Sun.svg` ist kein Vektorlogo.** Die Datei ist ein SVG-Container, in
> den ein 500 × 500 px großes PNG als Base64 eingebettet wurde. Skaliert also
> nicht verlustfrei.

Für den Neubau bedeutet das: Ein echtes Vektorlogo muss neu erstellt werden,
wenn eines gewünscht ist. Die vorhandenen PNGs können als Vorlage dienen.

Kleinigkeit am Rande: Der Markenname wird uneinheitlich geschrieben — im Header
mit geradem Apostroph, im Hero mit typografischem. Für den Neubau eine
Schreibweise festlegen. Empfehlung: `Iris’ Sunshine Oase` mit typografischem
Apostroph.

## Navigation

Menüstruktur der Altseite:

```
HOME
LEISTUNGEN & PREISE  ▾  (Untermenü: Sonderaktionen)
SUNSHINE
MOMENTS              ▾  (Untermenü: Kosmetik, Massage, Ton Erden, Honig)
ÜBER UNS                (Unterseite Zertifizierung fehlt im Menü)
proWIN
BEITRÄGE
[Telefon-Icon]  [Such-Icon]
```

Anmerkungen:

- „proWIN" bricht als einziger Punkt die Uppercase-Konvention (über die
  CSS-Pseudo-Tags `<lower>`/`<upper>` erzwungen)
- Der aktive Menüpunkt wird auf Unterseiten und im Blog nicht hervorgehoben
- Im Export liegen zwei ungenutzte Menüeinträge mit **Hestia-Demodaten**:
  `1-800-123-4567` und `friends@themeisle.com`. Sie erscheinen nicht im Header,
  sind aber angelegt.
- Es gibt **keinen Call-to-Action** im Header — weder Terminanfrage noch
  Anruf-Button. Für ein lokales Studio ist besonders auf Mobilgeräten ein
  direkter Anruf-Button naheliegend.
