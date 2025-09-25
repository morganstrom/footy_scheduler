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
   npm install -g typescript
   ```
   Detta installerar kommandot `tsc` globalt så att du kan kompilera TypeScript.
3. **Kompilera TypeScript**:
   
   I projektmappen finns en `tsconfig.json` som beskriver hur koden ska kompileras. Navigera till mappen `footy_scheduler` och kör:
   ```bash
   cd footy_scheduler
   tsc
   ```
   Kommandot `tsc` läser `tsconfig.json` och kompileringen följer inställningarna där. Som standard omvandlas `main.ts` till `main.js` i samma mapp. Varje gång du gör ändringar i TypeScript‑koden kör du `tsc` igen för att generera en uppdaterad JavaScript‑fil. Du kan öppna `tsconfig.json` för att se eller ändra vilka ECMAScript‑versioner och modulformat som används.

## Köra applikationen

När `main.js` har genererats kan du öppna `index.html` direkt i din webbläsare.

1. Öppna filen `footy_scheduler/index.html` i en modern webbläsare (t.ex. Chrome, Edge eller Firefox). Dubbelklicka på filen eller dra den till webbläsarfönstret.
2. Följ instruktionerna i sidopanelen: ange spelarnamn, dela lagen och generera scheman.

Eftersom applikationen är helt statisk behövs ingen webbserver – allt körs lokalt i webbläsaren.

## Anpassningar

- **Ändra kompilatorinställningar**: du kan justera `tsconfig.json` för att ändra mål‑ECMAScript‑version, modulformat eller andra TypeScript‑inställningar.
- **Lägga till funktioner**: TypeScript‑koden finns i `main.ts`. Här kan du lägga till ytterligare logik, till exempel exportfunktioner eller olika inställningar för de två lagen.

## Licens

Detta projekt är öppet för personligt bruk. Anpassa och utöka det gärna efter behov.