/**
 * Fotbollslag Spelschema Planerare
 *
 * Denna fil innehåller en enkel algoritm för att allokera speltider
 * jämnt mellan spelare över flera matcher. Användaren anger en lista med
 * barnens namn, antal matcher, längden på varje match, speltid per byte
 * och hur många spelare som ska vara på planen samtidigt. Algoritmen
 * delar upp varje match i lika långa byten (baserat på angiven speltid
 * per byte) och använder sedan en greedy-strategi för att välja de
 * spelare som har spelat minst tid hittills. Den försöker också undvika
 * att samma spelare spelar två byten i rad i samma match när det är
 * möjligt. Resultatet presenteras i ett tabellformat.
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
function generateSchedule(playerNames, numMatches, matchLength, shiftLength, positions) {
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
 * Renderar spelschemat i DOM.
 */
/**
 * Renderar spelschemat och sammanställning i DOM.
 * @param result Resultat från generateSchedule.
 * @param container Elementet där innehållet ska placeras.
 */
function renderSchedule(result, container) {
    const { assignments, totals, positions } = result;
    container.innerHTML = "";
    if (assignments.length === 0) {
        container.textContent = "Inget schema genererat.";
        return;
    }
    // Grupp tilldelningar per match
    const grouped = {};
    for (const ass of assignments) {
        if (!grouped[ass.matchIndex])
            grouped[ass.matchIndex] = [];
        grouped[ass.matchIndex].push(ass);
    }
    // Skapa HTML för varje match
    Object.keys(grouped)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .forEach((matchKey) => {
        var _a;
        const matchAssignments = grouped[parseInt(matchKey)];
        const header = document.createElement("h2");
        header.textContent = `Match ${parseInt(matchKey) + 1}`;
        container.appendChild(header);
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        // Byte kolumn
        const thShift = document.createElement("th");
        thShift.textContent = "Byte";
        headerRow.appendChild(thShift);
        // En kolumn per spelare/position
        for (let i = 0; i < positions; i++) {
            const th = document.createElement("th");
            th.textContent = `Spelare ${i + 1}`;
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);
        const tbody = document.createElement("tbody");
        for (const ass of matchAssignments) {
            const row = document.createElement("tr");
            const tdShift = document.createElement("td");
            tdShift.textContent = `${ass.shiftIndex + 1}`;
            row.appendChild(tdShift);
            // Lägg till spelare i separata kolumner; fyll med tom sträng om färre än positions
            for (let i = 0; i < positions; i++) {
                const cell = document.createElement("td");
                cell.textContent = (_a = ass.players[i]) !== null && _a !== void 0 ? _a : "";
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
        container.appendChild(table);
    });
    // Skapa tabell för total speltid
    const summaryHeader = document.createElement("h2");
    summaryHeader.textContent = "Total speltid per spelare";
    container.appendChild(summaryHeader);
    const summaryTable = document.createElement("table");
    const summaryThead = document.createElement("thead");
    const summaryHeaderRow = document.createElement("tr");
    const nameTh = document.createElement("th");
    nameTh.textContent = "Spelare";
    summaryHeaderRow.appendChild(nameTh);
    const minutesTh = document.createElement("th");
    minutesTh.textContent = "Minuter";
    summaryHeaderRow.appendChild(minutesTh);
    summaryThead.appendChild(summaryHeaderRow);
    summaryTable.appendChild(summaryThead);
    const summaryTbody = document.createElement("tbody");
    Object.keys(totals)
        .sort((a, b) => a.localeCompare(b))
        .forEach((playerName) => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.textContent = playerName;
        row.appendChild(nameCell);
        const minCell = document.createElement("td");
        minCell.textContent = totals[playerName].toString();
        row.appendChild(minCell);
        summaryTbody.appendChild(row);
    });
    summaryTable.appendChild(summaryTbody);
    container.appendChild(summaryTable);
}
// Anslut formuläret
const form = document.getElementById("scheduleForm");
const outputDiv = document.getElementById("output");
form === null || form === void 0 ? void 0 : form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!outputDiv)
        return;
    // Läs värden från formuläret
    const playersInput = document.getElementById("players")
        .value;
    const matchesInput = parseInt(document.getElementById("matches").value, 10);
    const matchLengthInput = parseInt(document.getElementById("matchLength").value, 10);
    const shiftLengthInput = parseInt(document.getElementById("shiftLength").value, 10);
    const positionsInput = parseInt(document.getElementById("positions").value, 10);
    // Omvandla spelare (dela på radbrytningar och kommatecken)
    const rawNames = playersInput
        .split(/[\n,]+/)
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
    // Validering
    if (rawNames.length === 0) {
        outputDiv.textContent = "Ange minst en spelare.";
        return;
    }
    if (positionsInput < 1) {
        outputDiv.textContent = "Antal spelare på planen måste vara minst 1.";
        return;
    }
    if (positionsInput > rawNames.length) {
        outputDiv.textContent = "Antalet positioner kan inte överstiga antalet spelare.";
        return;
    }
    const result = generateSchedule(rawNames, matchesInput, matchLengthInput, shiftLengthInput, positionsInput);
    renderSchedule(result, outputDiv);
});
