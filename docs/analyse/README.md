# Dokumentation — Relaunch iris-sunshine-oase.de

Bestandsaufnahme der bestehenden WordPress-Seite als Grundlage für den Neubau
mit Astro.

## Inhalt

| Datei | Zweck |
|---|---|
| [01-ausgangslage.md](01-ausgangslage.md) | Technischer Stand der Altseite, Datenlage im Backup, Datenschutz-Bereinigung |
| [02-inhaltsinventar.md](02-inhaltsinventar.md) | Alle Seiten und Beiträge mit Bewertung: übernehmen, überarbeiten oder streichen |
| [03-leistungen-und-preise.md](03-leistungen-und-preise.md) | Vollständige Preisliste — das inhaltlich wichtigste Asset |
| [04-design-system.md](04-design-system.md) | Farben, Typografie, Layout der Altseite; was übernommen und was verworfen wird |
| [05-maengelliste.md](05-maengelliste.md) | Konkrete Defekte der Altseite, als Arbeitspakete formuliert |
| [06-medien-inventar.md](06-medien-inventar.md) | Bildbestand, Mengengerüst und Empfehlung zur Ablage |

## Herkunft der Angaben

Zwei Quellen, mit unterschiedlicher Belastbarkeit:

**Aus dem WordPress-Export ausgelesen** — exakt, maschinell verifiziert. Dazu
zählen alle Seiten- und Beitragslisten, Preise, Texte, Menüstruktur,
Öffnungszeiten-Datensätze und die Auswertung der Sprungmarken.

**Aus Screenshots abgelesen** — visuelle Einschätzung, keine gemessenen Werte.
Dazu zählen Farbangaben (Hex-Werte sind Schätzungen), Schriftgrößen,
Abstände und alle Aussagen zur Optik. Diese Angaben sind als Anhaltspunkt
gedacht, nicht als Spezifikation.

Wo eine Aussage verifiziert wurde, ist das im Text vermerkt.

## Wichtig: Das Archiv ist nicht Teil des Repositorys

Der Ordner `Archive/` mit dem WordPress-Backup ist per `.gitignore` **komplett
ausgeschlossen** — wegen ungeklärter Bildrechte und personenbezogener Daten
Dritter. Begründung und Mengengerüst in
[06-medien-inventar.md](06-medien-inventar.md).

Die Texte des Altauftritts wurden vorher herausgelöst und liegen versioniert
unter [`docs/inhalte/`](../inhalte/README.md). **Das ist die einzige
versionierte Quelle der Alt-Inhalte.**

Falls das Archiv lokal vorliegt, gibt es dort zwei Export-Fassungen:

- `…2026-07-18.xml` — bereinigt: ohne die 2.216 `pf_contact`-Einträge
  (Kontaktformular-Einsendungen 2017–2021 mit E-Mail- und IP-Adressen Dritter),
  ohne zwei Spam-Kommentare mit Absender-IP, alle echten E-Mail-Adressen durch
  Platzhalter unter `example.invalid` ersetzt
- `…ORIGINAL-MIT-PII.xml` — vollständig und unverändert. Darf nicht committet,
  hochgeladen oder anderweitig nach außen gegeben werden.

Wer die echte Geschäfts-E-Mail fürs Impressum braucht: aus der Original-Datei
entnehmen oder beim Betreiber erfragen. Sie steht bewusst nirgends in dieser
Dokumentation.

## Stand

Bestandsaufnahme vom 18.07.2026, bezogen auf den Export vom selben Tag.
Die Live-Seite war zu diesem Zeitpunkt erreichbar; inhaltlich ist sie auf dem
Stand von Mai 2020, die Öffnungszeiten wurden bis Winter 2024/25 gepflegt.
