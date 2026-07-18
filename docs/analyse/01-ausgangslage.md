# 01 — Ausgangslage

## Das Studio

Iris' Sunshine Oase, Sonnen- & Kosmetikstudio in Herxheim bei Landau (Pfalz).
Inhaberin Iris Zellner, übernommen im Februar 2013. Seit November 2016 um das
Kosmetikstudio „Moments" erweitert (Naturkosmetik, Massagen).

Stammdaten für Impressum und Kontakt:

```
Kosmetik- & Sonnenstudio Iris' Sunshine Oase
Inh. Iris Zellner
Offenbacher Str. 2
76863 Herxheim bei Landau (Pfalz)
Telefon: +49 (0)7276 50 50 550
USt-ID:  DE276633210
```

Die E-Mail-Adresse steht bewusst nicht in dieser Dokumentation — siehe
Datenschutzhinweis im [README](README.md).

## Technischer Stand der Altseite

| | |
|---|---|
| CMS | WordPress **5.8.13** (veraltet, End of Life) |
| Theme | **Hestia** (ThemeIsle) mit Custom CSS |
| Page Builder | **Elementor 3.4.6** |
| Hosting | netcup |
| Sprache | de |

### Eingesetzte Plugins

Erkennbar an den Spuren im Export:

- **Elementor** — Seitenaufbau; 10 gespeicherte Templates in `elementor_library`
- **Orbit Fox** (ThemeIsle) — liefert `obfx-posts-grid` (Beitragskacheln),
  `obfx-pricing-table` und `content_form_contact` (Kontaktformular)
- **Pirate Forms** — älteres Kontaktformular; hat die Einsendungen als
  Post-Type `pf_contact` in der Datenbank abgelegt
- **Opening Hours** — Öffnungszeiten als Post-Type `op-set`, Ausgabe über das
  Widget `widget_op_overview`
- **Google Analytics** — im Impressum beschrieben, mit einem Einwilligungstext
  aus der Zeit **vor** der DSGVO
- **Yoast SEO** und **All in One SEO** — Metadaten beider Plugins sind in den
  Seiten vorhanden, sie liefen also parallel oder nacheinander

### Custom CSS

Enthält im Wesentlichen Workarounds, die beim Neubau ersatzlos entfallen:

- selbstgebaute Tabellen über `div.my-table` mit `display: table` — weil der
  Page Builder keine brauchbaren Tabellen konnte
- Pseudo-Tags `<upper>` und `<lower>` für Groß-/Kleinschreibung, im Menü für
  die Schreibweise „proWIN" genutzt
- Hilfsklassen für absolute Positionierung und Schatten
- ein Hintergrundverlauf `header-filter-gradient` von `#c2d1f0` nach `#ffc000` —
  das ist der grau-blau-nach-gelb-Verlauf, der auf drei Seiten als Hero
  erscheint und dort wie ein fehlendes Bild wirkt

## Datenlage im Backup

Der Ordner `Archive/` enthält drei Bestandteile:

### 1. WordPress-Export (XML)

Vollständiger WXR-Export vom 18.07.2026. Nach der Bereinigung enthält er
**576 Items**:

| Post-Type | Anzahl | Inhalt |
|---|---|---|
| `attachment` | 504 | Medienbibliothek-Einträge |
| `post` | 19 | Blogbeiträge |
| `nav_menu_item` | 17 | Menüstruktur |
| `page` | 14 | Seiten |
| `op-set` | 11 | Öffnungszeiten-Sätze (Saisons) |
| `elementor_library` | 10 | wiederverwendbare Layout-Bausteine |
| `custom_css` | 1 | Theme-Anpassungen |

Der Export enthält die Elementor-Layoutdaten als JSON im Postmeta
`_elementor_data`. Dort stehen sowohl die Texte als auch der komplette
Seitenaufbau — er ist damit die verlässlichste Quelle für die Inhalte.

### 2. Medienbestand

Zwei getrennte Sammlungen, insgesamt rund 750 MB. Details und Empfehlung zur
Ablage in [06-medien-inventar.md](06-medien-inventar.md).

### 3. Screenshots

69 Aufnahmen (3,3 MB) des Zustands vom 18.07.2026, in vier Varianten:
Desktop und Mobil, jeweils als Viewport-Ausschnitt und als Vollseite. Dazu
Segmentaufnahmen der Startseite und der Preisseite.

Nützlich als visuelle Referenz, aber mit Einschränkungen: Die
Viewport-Aufnahmen zeigen nur den ersten Bildschirm, die Vollseiten-Aufnahmen
sind stark verkleinert und schlecht lesbar, und die Segmentaufnahmen decken die
Seiten nicht lückenlos ab. Für Inhalte ist der XML-Export die bessere Quelle.

## Aktueller Zustand der Live-Seite

Die Seite ist erreichbar und funktionsfähig. Inhaltlich steht sie auf dem Stand
von **Mai 2020** — der letzte Blogbeitrag stammt vom 09.05.2020, davor ein
Corona-Statement. Die Öffnungszeiten wurden dagegen bis **Winter 2024/25**
weitergepflegt.

Daraus folgt: Der Betrieb läuft, gepflegt wurde nur das Nötigste. Der Verfall
ist redaktioneller, nicht technischer Natur.

## Bewertung für den Neubau

Die Seite ist kein Sanierungsfall, sondern ein **Fertigstellungsfall**. 2017/18
wurde eine tragfähige Struktur gebaut und danach nie zu Ende geführt: Fünf
Seiten enthalten bis heute Blindtext, sechs tragen einen „im Aufbau"-Hinweis,
zum Teil mit Datumsstempel von Januar 2018.

Inhaltlich ist genug Substanz vorhanden, um daraus eine vollständige Seite zu
bauen — vor allem die Preisliste, die Beschreibungen der Sonnenbänke und die
Über-uns-Texte. Was fehlt, ist überschaubar und redaktionell zu lösen.

Gegen eine Fortführung mit WordPress spricht der Betriebsaufwand: WordPress,
Elementor und vier Plugins müssten dauerhaft aktuell gehalten werden, für
Funktionen, die eine im Kern statische Seite nicht braucht. Die 2.216
Spam-Einsendungen im Kontaktformular zeigen, was ein unbeaufsichtigtes Setup
über die Jahre produziert.
