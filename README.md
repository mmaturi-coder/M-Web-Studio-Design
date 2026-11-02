# PAWAY

Presentazione del servizio **PAWAY**: segnalare un animale in difficoltà, capire come aiutare e seguire gli aggiornamenti.

L’interfaccia riprende l’identità del progetto: fondo `#F2F5EF`, inchiostro `#171717`, corallo `#DB766B`, blu `#679FD4`, verde `#94CCAD`. I titoli sono in Bagel Fat One, il testo in Nunito Sans. Le schermate sono quelle del file di interfaccia.

## Avvio

```bash
python3 -m http.server 4173
```

Apri `http://localhost:4173`.

## Cosa si può fare

- Leggere il servizio nei tre momenti: segnalazione, protezione, cura.
- Provare il percorso (situazione, animale, riepilogo). Non viene inviato nulla.
- Cercare nella guida e passare da gatto a cane.
- Vedere mappa, contatti e aggiornamenti così come sono nell’app.

Il movimento è fatto con GSAP: ingresso del marchio, titoli, comparsa allo scorrimento e nastro «Segnala — Aiuta — Proteggi». Con `prefers-reduced-motion` le animazioni restano ferme e i contenuti sono subito visibili.
