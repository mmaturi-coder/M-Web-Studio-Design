# PAWAY

Landing page di **PAWAY**, l’app che aiuta chi incontra un cane o un gatto in difficoltà a orientarsi e a inviare una segnalazione.

Idea: **dal dubbio al primo gesto**. La protagonista è l’interfaccia vera dell’app, dentro una cornice da iPhone. Fondo `#F2F5EF`, inchiostro `#171717`, corallo `#DB766B` (per i testi `#C6695F`). Bagel Fat One solo per il titolo d’apertura, Nunito Sans per tutto il resto.

## Avvio

**Modo consigliato (Mac e Linux):** dalla cartella del progetto (dove c’è `index.html`):

```bash
chmod +x start.sh
./start.sh
```

Lo script sceglie la porta `4173` se è libera, altrimenti la successiva disponibile, e stampa l’URL da aprire nel browser.

**Manuale:**

```bash
python3 -m http.server 4173
```

Poi apri `http://localhost:4173` (non aprire `index.html` con doppio clic: con `file://` video e animazioni potrebbero non funzionare).

### Risoluzione problemi (Mac)

| Problema | Cosa fare |
| -------- | --------- |
| **ERR_CONNECTION_REFUSED** su `localhost` o `127.0.0.1` | Il server non è in esecuzione. Apri Terminale, vai nella cartella del progetto (`cd ~/Downloads/PAWAY-presentazione` se l’hai estratta lì) ed esegui `./start.sh`. L’errore compare anche se hai chiuso il Terminale mentre il server era attivo. |
| **Pagina bianca o link «non funziona»** | Apri l’URL che stampa `./start.sh`, es. `http://localhost:4173`. Non usare `file:///Users/.../index.html`. |
| **Cartella sbagliata** | `start.sh` e `index.html` devono stare nella stessa cartella. Se manca `index.html`, sei in una sottocartella o nell’archivio non estratto. |
| **Porta occupata** | `./start.sh` prova automaticamente la porta successiva e lo indica a schermo. Usa quell’URL, non necessariamente `4173`. |
| **Terminale chiuso** | Il server vive solo finché la finestra del Terminale resta aperta. Riavvia con `./start.sh`. |
| **Aprire subito Safari/Chrome** | Con il server avviato: `open http://localhost:4173` (sostituisci la porta se lo script ne ha scelta un’altra). |

**Python mancante:** su Mac, da [python.org](https://www.python.org/downloads/) o `brew install python`, poi riprova `./start.sh`.

## Teaser cinematico

La sezione **Teaser** del sito usa `assets/video/paway-teaser-cinematico.mp4` e il poster `assets/img/paway-teaser-poster.webp`. Nel repository c’è ancora un **segnaposto** (lo stesso file della presentazione/showreel, ~15 MB, ~63 s): non è il file «PAWAY | Teaser cinematico» dal Mac.

**Sorgente sul Mac (non accessibile dall’ambiente cloud):**

`/Users/mariamaturi/Downloads/PAWAY | Teaser cinematico.mp4`

**Destinazione nel progetto:**

`assets/video/paway-teaser-cinematico.mp4`

Per sostituirlo in locale, dopo aver copiato il file sul Mac nel clone del repo:

```bash
SOURCE="/Users/mariamaturi/Downloads/PAWAY | Teaser cinematico.mp4" ./scripts/install-teaser.sh
```

Oppure trascina il file `.mp4` nella chat di Cursor sull’agente, così può copiarlo nel repo e rigenerare il poster. Poi committa video e poster.

I riferimenti in `index.html` e `js/config.js` puntano già a `paway-teaser-cinematico.mp4`.

## Link agli store

I link stanno in `js/config.js`. Un badge compare solo quando il campo contiene un URL `https://`; se sono tutti vuoti la sezione mostra «Disponibile prossimamente».

## Sezioni

1. **Apertura** — eyebrow «Segnala. Aiuta. Proteggi.», titolo, testo, pulsante, tre fatti; a destra la home nel telefono con due chip dell’interfaccia.
2. **Come funziona** — Esplora, Segnala, Segui con la schermata corrispondente.
3. **Nastro** — «Il primo gesto può partire da te».
4. **Nell’app** — bento con Mappa, SOS, Guida, Helpaw AI, Numeri utili. Le icone sono quelle del sistema dell’app (`assets/icons.svg`).
5. **Download** e piè di pagina.

## Schermate

Esportate a 2× dal file Figma dell’interfaccia, in `assets/img/` (versione `-sm` a 1×):

- `app-home` — apertura
- `app-guida` — Esplora
- `app-segnala` — Segnala
- `app-aggiornamenti` — Segui
- `app-mappa` — la mappa di Roma della schermata Mappa (ritaglio orizzontale con i punti di interesse), nella tile «Mappa» del bento
- `helpaw-orb.mp4` / `helpaw-orb.webp` — l’animazione della sfera di Helpaw (dalla GIF del brand, composta sul colore della tile) e il suo primo fotogramma come poster; parte solo con movimento consentito e quando è in vista

## Movimento

Da 900 px di larghezza (e 620 px di altezza) con movimento consentito, apertura e «Come funziona» condividono un solo telefono, fisso nella sua colonna. Nel primo tratto di scroll le chip scorrono più lente della pagina e svaniscono mentre il telefono si sposta al centro della colonna; poi la schermata cambia con una breve dissolvenza a ogni passaggio. Il testo scorre normalmente e lo scroll non viene bloccato.

Lo scorrimento è ammorbidito da Lenis (`vendor/lenis.min.js`), che interpola la posizione senza toccare lo scroll nativo; ScrollTrigger si aggiorna sul suo tick. All’apertura gli elementi entrano in sequenza; il telefono segue appena il puntatore; l’intestazione diventa di vetro quando si scorre; le sezioni in basso compaiono una volta sola.

Su mobile, con `prefers-reduced-motion` o senza JavaScript la pagina è statica: ogni passaggio mostra la sua schermata, il nastro è fermo e tutto è visibile da subito.
