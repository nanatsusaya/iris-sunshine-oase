# 02 — Inhaltsinventar

Alle Seiten und Beiträge der Altseite mit Bewertung für den Neubau.
Angaben aus dem WordPress-Export ausgelesen.

Legende:

- **Übernehmen** — Inhalt ist brauchbar, wandert weitgehend unverändert mit
- **Überarbeiten** — Substanz vorhanden, muss redaktionell ergänzt werden
- **Neu schreiben** — praktisch kein verwertbarer Inhalt
- **Streichen** — entfällt ersatzlos

## Seiten

| Seite | Pfad | ID | Zustand | Bewertung |
|---|---|---|---|---|
| Iris' Sunshine Oase (Start) | `/` | 15 | Vollständig, Elementor | **Übernehmen** |
| Leistungen & Preise | `/leistungen-und-preise` | 83 | Vollständig, gepflegt | **Übernehmen** |
| Sunshine | `/sunshine` | 74 | Vollständig | **Übernehmen** |
| Über uns | `/ueber-uns` | 283 | Vollständig | **Übernehmen** |
| Impressum | `/impressum` | 131 | Vollständig, aber rechtlich veraltet | **Überarbeiten** |
| Kontakt | `/kontakt` | 132 | Knapp, funktional | **Überarbeiten** |
| Zertifizierung | `/zertifizierung` | 1557 | Echter Fachtext + Blindtext | **Überarbeiten** |
| Honig | `/honig` | 2249 | Echter Inhalt, fälschlich als Baustelle markiert | **Überarbeiten** |
| Moments | `/moments` | 77 | Einleitung echt, Rest Blindtext | **Überarbeiten** |
| Ton Erden | `/ton-erden` | 2201 | Teils echt, teils Blindtext | **Überarbeiten** |
| Kosmetik | `/kosmetik` | 2187 | Leistungsliste echt, Rest Blindtext | **Überarbeiten** |
| Massage | `/massage` | 2191 | Überwiegend Blindtext | **Neu schreiben** |
| proWIN | `/prowin` | 285 | 750 Zeichen, verweist nach extern | **Klären** |
| Spielewiese | (Entwurf) | 429 | Elementor-Spielwiese, reiner Blindtext | **Streichen** |

### Anmerkungen

**Struktur:** „Moments" ist Elternseite von Kosmetik, Massage, Ton Erden und
Honig. „Über uns" ist Elternseite von Zertifizierung.

**Zertifizierung ist nicht erreichbar.** Die Seite existiert und hängt korrekt
unter „Über uns", aber im Menübaum ist kein Eintrag dafür angelegt — verifiziert
über die `nav_menu_item`-Daten. Sie ist nur über Inline-Links im Text zu finden.

**Der Zertifizierungstext ist inhaltlich wertvoll**, trotz der Blindtext-Umgebung:
Das Studio wurde 2008 vom Bundesamt für Strahlenschutz für drei Jahre
zertifiziert; die Zertifizierung wird seither nicht mehr angeboten, die
Standards werden laut Text weiter eingehalten. Das ist ein Vertrauensargument
und sollte erhalten bleiben — allerdings mit Vorsicht formuliert, weil eine
abgelaufene Zertifizierung nicht als aktuelle ausgegeben werden darf.

**proWIN** ist ein Direktvertrieb für Reinigungs- und Wellnessprodukte, den das
Studio nebenher betreibt. Die Seite besteht aus zwei Absätzen und einer rohen
externen URL. Vor dem Neubau zu klären: Ist das noch aktiv? Wenn ja, gehört es
ordentlich integriert; wenn nein, ersatzlos streichen.

**Spielewiese** ist ein Entwurf mit Slug `/` — eine Elementor-Testseite mit
Blindtext und Beispiel-Preistabellen. Ohne Wert.

## Blogbeiträge

19 Beiträge, alle zwischen Dezember 2017 und Mai 2020.

| Zeitraum | Anzahl | Art |
|---|---|---|
| 2017 | 2 | Begrüßung „Neuer Webauftritt", Weihnachtsaktion |
| 2018 | 5 | Sonderaktionen, 5-Jahres-Jubiläum mit Gewinnspiel |
| 2019 | 9 | „Kosmetik des Monats"-Reihe, Winter-Öffnungszeiten |
| 2020 | 3 | Corona-Statement, Wiedereröffnung, Kosmetik des Monats Mai |

### Bewertung

Die Beiträge sind **abgelaufene Aktionen**. „Kosmetik des Monats Mai" von 2019
und 2020, Weihnachtsangebote von 2017 und 2018, ein Gewinnspiel von 2018 mit
eigener Teilnahmebedingungen-Seite. Nichts davon hat heute noch Gültigkeit.

Zwei Beiträge sind aktiv schädlich, wenn sie online bleiben:

- **„Neuer Webauftritt"** (22.12.2017) kündigt an, die Seite werde „in den
  kommenden Tagen und Wochen mit Leben gefüllt". Acht Jahre später liest sich
  das als uneingelöstes Versprechen.
- **Das Corona-Statement** (15.03.2020) und die Wiedereröffnungs-Meldung
  (09.05.2020) sind erkennbar veraltet und lassen die Seite tot wirken.

**Empfehlung:** Blog beim Neubau nicht übernehmen. Die Beitragsstruktur an sich
ist sinnvoll — für „Kosmetik des Monats" und saisonale Aktionen —, aber sie
sollte leer starten. Wenn ein Archiv gewünscht ist, gehört es hinter eine
deutliche Datierung und nicht auf die Startseite.

Wichtig für den Neubau: Auf der **Startseite** und auf der **Preisseite** werden
diese Beiträge aktuell als „Sonderaktionen" eingebunden. Die Startseite bewirbt
damit prominent ein „Juni Highlight" von 2019. Diese Einbindung muss ersetzt
werden — entweder durch gepflegte Aktionen oder ersatzlos.

## Was inhaltlich fehlt

Für eine vollständige neue Seite müsste redaktionell ergänzt werden:

1. **Moments-Bereich** — Kosmetik, Massage, Ton Erden brauchen echte
   Beschreibungstexte. Die Leistungen und Preise sind bekannt (siehe
   [03-leistungen-und-preise.md](03-leistungen-und-preise.md)), es fehlen die
   erklärenden Texte drumherum.
2. **Aktuelle Öffnungszeiten** — die hinterlegten Datensätze stammen aus 2024,
   und es existieren zwei Sommer-Sets mit abweichenden Sonntagszeiten. Vor dem
   Livegang beim Betreiber abgleichen.
3. **Team-Vorstellung** — „Unser Team" existiert als Überschrift mit einem
   allgemeinen Absatz, ohne Personen.
4. **Aktuelle Preise** — die Preisliste ist vollständig, aber der Stand ist
   unbekannt. Vor Übernahme bestätigen lassen.
5. **Datenschutzerklärung** — siehe [05-maengelliste.md](05-maengelliste.md);
   die vorhandene ist vor-DSGVO.
