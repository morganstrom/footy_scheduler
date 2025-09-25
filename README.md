# Fotbollslag Spelschema Planerare

Den här mappen innehåller en enkel webbapplikation skriven i TypeScript som hjälper dig att dela upp ett lag i två slumpmässiga lag och generera rättvisa spelscheman för dem. Applikationen körs helt i webbläsaren och kräver därför bara att du bygger TypeScript‑koden till JavaScript innan du öppnar sidan.

## Funktioner

- **Dela lag slumpmässigt**: mata in en lista med spelarnamn (t.ex. 16 barn), klicka på *Dela lag slumpmässigt* så fördelas spelarna i två lag som visas på skärmen.
- **Skapa spelschema**: ange antal matcher, matchlängd, speltid per byte och hur många spelare som ska vara på planen samtidigt. Appen genererar scheman för båda lagen där varje byte visas med separata kolumner för varje spelare och en sammanställning av total speltid per spelare.
- **Stegvis arbetsflöde**: en sidopanel guidar dig igenom steg 1 (*Dela lag*) och steg 2 (*Skapa spelschema*).

## Förutsättningar

För att bygga projektet behöver du Node.js och npm installerat på din dator. Du kan ladda ned Node.js från [nodejs.org](https://nodejs.org/).

## Installation och kompilering

1. **Kloning eller nedladdning**: kopiera projektmappen `footy_scheduler` till din lokala dator.
2. **Installera TypeScript** (om du inte redan har det):
   ```bash
   npm install
   ```

## Köra applikationen

```bash
npm run dev
```

## Laglista

Caesar
Hugo
Jibreel
Justin
Leo
Matheo
Matteo
Melwin
Nils
Oliver
Ousman
Sigurd
Ture
Wilmer
