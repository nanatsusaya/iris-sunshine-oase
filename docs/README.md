# Dokumentation

Zentrale Wissensbasis für den Relaunch von **iris-sunshine-oase.de** — dem
Sonnen- & Kosmetikstudio Iris' Sunshine Oase in Herxheim bei Landau (Pfalz).

Dieser Ordner ist die **Single Source of Truth** des Projekts. Was hier nicht
steht, existiert für die Umsetzung nicht.

## Aufbau

### [`analyse/`](analyse/README.md) — Bestandsaufnahme der Altseite

Zustand, Technik, Design und Mängel des bestehenden WordPress-Auftritts.
Beschreibt, **was war** und warum es abgelöst wird.

| Datei | Inhalt |
|---|---|
| [01-ausgangslage.md](analyse/01-ausgangslage.md) | Technikstack, Plugins, Datenlage |
| [02-inhaltsinventar.md](analyse/02-inhaltsinventar.md) | Alle Seiten und Beiträge mit Bewertung |
| [03-leistungen-und-preise.md](analyse/03-leistungen-und-preise.md) | Vollständige Preisliste, Datenmodell-Vorschlag |
| [04-design-system.md](analyse/04-design-system.md) | Farben, Typografie, Layout, Navigation |
| [05-maengelliste.md](analyse/05-maengelliste.md) | 28 Defekte als Arbeitspakete `M-01`…`M-28` |
| [06-medien-inventar.md](analyse/06-medien-inventar.md) | Bildbestand, Rechtelage, Archiv-Ablage |

### [`inhalte/`](inhalte/README.md) — Textsicherung der Altseite

Alle Texte des alten Auftritts, aus dem WordPress-Export extrahiert. Da der
Ordner `Archive/` nicht Teil des Repositorys ist, ist dies die **einzige
versionierte Quelle** der Alt-Inhalte.

Erzeugt mit `tools/extract-wp-content.mjs`. Nicht von Hand bearbeiten —
Korrekturen gehören in die neuen Inhalte, nicht in die Sicherung.

## Zielbild

| | |
|---|---|
| Technik | Astro, statisch generiert |
| Inhalte | strukturierte Daten (Preise, Öffnungszeiten) statt Layout-Blöcke |
| Pflege | über GitHub Issues, Abarbeitung durch einen Agenten |
| Hosting | offen — der bisherige Anbieter (netcup) steht zur Disposition |

Daraus folgen zwei Leitplanken für alles Weitere:

**Das Repository bleibt klein.** Es wird pro Ticket neu geklont; jedes Megabyte
kostet dauerhaft. Kein Rohmaterial, keine Binärlasten.

**Die Dokumentation ist selbsttragend.** Ein Agent, der ein Ticket bearbeitet,
hat nur dieses Repository — keinen Gesprächsverlauf und keinen Zugriff auf das
Archiv. Was er wissen muss, steht in `docs/`.

## Was das Archiv enthält und wo es liegt

`Archive/` (rund 600 MB) ist per `.gitignore` ausgeschlossen: Bildmaterial mit
ungeklärten Nutzungsrechten und der Datenbank-Export mit personenbezogenen Daten
Dritter. Details in [06-medien-inventar.md](analyse/06-medien-inventar.md).

> Das Repository ist damit **kein Backup des Altbestands**. Sicherung und
> Versionierung des Archivs liegen beim Betreiber und sind nicht Teil dieses
> Projekts.

## Stand

Bestandsaufnahme vom 18.07.2026. Die Altseite war zu diesem Zeitpunkt online,
inhaltlich auf dem Stand von Mai 2020, die Öffnungszeiten gepflegt bis
Winter 2024/25.
