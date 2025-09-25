/**
 * Fotbollslag Spelschema Planerare - Core Functions
 *
 * Denna fil innehåller en enkel algoritm för att allokera speltider
 * jämnt mellan spelare över flera matcher. Användaren anger en lista med
 * barnens namn, antal matcher, längden på varje match, speltid per byte
 * och hur många spelare som ska vara på planen samtidigt. Algoritmen
 * delar upp varje match i lika långa byten (baserat på angiven speltid
 * per byte) och använder sedan en greedy-strategi för att välja de
 * spelare som har spelat minst tid hittills. Den försöker också undvika
 * att samma spelare spelar två byten i rad i samma match när det är
 * möjligt.
 */
/**
 * Genererar ett spelschema baserat på indata.
 * @param playerNames Lista med spelarnas namn
 * @param numMatches Antal matcher
 * @param matchLength Längd på match i minuter
 * @param shiftLength Längd på varje byte i minuter
 * @param positions Antal spelare som spelar samtidigt
 * @returns En lista med schematilldelningar
 */
export function generateSchedule(playerNames, numMatches, matchLength, shiftLength, positions) {
    // Filtera bort tomma eller duplicerade namn och trimma whitespace
    const uniqueNames = Array.from(new Set(playerNames.map((n) => n.trim()).filter((n) => n.length > 0)));
    // Skapa spelare med ackumulatorer
    const players = uniqueNames.map((name) => ({
        name,
        totalMinutes: 0,
        lastShiftIndex: -Infinity,
    }));
    const assignments = [];
    if (players.length === 0)
        return { assignments, totals: {}, positions };
    // Total tabell med speltider per spelare
    const totals = {};
    players.forEach((p) => (totals[p.name] = 0));
    for (let m = 0; m < numMatches; m++) {
        // Återställ lastShiftIndex för varje match
        players.forEach((p) => {
            p.lastShiftIndex = -Infinity;
        });
        // Antal byten per match. Om matchen inte delar sig jämnt in i byten
        // kommer den sista bytet att vara kortare än shiftLength.
        const fullShifts = Math.floor(matchLength / shiftLength);
        const remainder = matchLength % shiftLength;
        const shiftsInMatch = remainder > 0 ? fullShifts + 1 : fullShifts;
        for (let s = 0; s < shiftsInMatch; s++) {
            // Sortera spelare efter minsta totalMinutes; bryt lika genom namnordning
            const sortedPlayers = [...players].sort((a, b) => {
                if (a.totalMinutes === b.totalMinutes) {
                    return a.name.localeCompare(b.name);
                }
                return a.totalMinutes - b.totalMinutes;
            });
            const selected = [];
            for (const candidate of sortedPlayers) {
                if (selected.length >= positions)
                    break;
                // Undvik två byten i rad för samma spelare (om möjligt)
                if (players.length > positions && candidate.lastShiftIndex === s - 1) {
                    continue;
                }
                selected.push(candidate);
            }
            // Fyll upp om vi inte fått tillräckligt många spelare
            if (selected.length < positions) {
                for (const candidate of sortedPlayers) {
                    if (selected.includes(candidate))
                        continue;
                    selected.push(candidate);
                    if (selected.length >= positions)
                        break;
                }
            }
            // Faktisk längd på bytet: antingen full längd eller remainder
            const currentShiftLength = s === shiftsInMatch - 1 && remainder > 0 ? remainder : shiftLength;
            // Spara tilldelning och uppdatera speltider
            const names = selected.map((p) => p.name);
            assignments.push({ matchIndex: m, shiftIndex: s, players: names });
            for (const p of selected) {
                p.totalMinutes += currentShiftLength;
                p.lastShiftIndex = s;
                totals[p.name] += currentShiftLength;
            }
        }
    }
    return { assignments, totals, positions };
}
/**
 * Funktion för att blanda en array slumpmässigt (Fisher–Yates)
 */
export function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
