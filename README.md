# PAWAY

Landing page di **PAWAY**, l’app che aiuta chi incontra un cane o un gatto in difficoltà a orientarsi e a inviare una segnalazione.

Idea: **dal dubbio al primo gesto**. La protagonista è l’interfaccia vera dell’app, dentro una cornice da iPhone, che emerge dalla mezzaluna corallo del marchio. Fondo `#F2F5EF`, inchiostro `#171717`, corallo `#DB766B` (per i testi `#C6695F`). Bagel Fat One solo per il titolo d’apertura, Nunito Sans per tutto il resto.

## Avvio

```bash
python3 -m http.server 4173
```

Apri `http://localhost:4173`.

## Link agli store

I link stanno in `js/config.js`. Un badge compare solo quando il campo contiene un URL `https://`; se sono tutti vuoti la sezione mostra «Disponibile prossimamente».

## Schermate

Esportate a 2× dal file Figma dell’interfaccia, in `assets/img/` (versione `-sm` a 1×):

- `app-home` — apertura
- `app-guida` — Esplora
- `app-segnala` — Segnala
- `app-aggiornamenti` — Segui

## Movimento

Da 900 px di larghezza (e 620 px di altezza) con movimento consentito, apertura e «Come funziona» condividono un solo telefono, fisso nella sua colonna. Nel primo tratto di scroll la mezzaluna scorre più lenta della pagina e il telefono si sposta al centro della colonna; poi la schermata cambia con una breve dissolvenza a ogni passaggio. Il testo scorre normalmente e lo scroll non viene bloccato.

Su mobile, con `prefers-reduced-motion` o senza JavaScript la pagina è statica: ogni passaggio mostra la sua schermata.
