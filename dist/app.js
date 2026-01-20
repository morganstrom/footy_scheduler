/**
 * App module - handles DOM interactions and imports core functions from main.ts
 */
import { generateSchedule, shuffleArray, Team, } from "./main.js";
/**
 * Exports the schedule to Excel format
 * @param result Result from generateSchedule
 * @param teamName The name of the team
 */
function exportToExcel(result, teamName) {
    const { assignments, totals, positions } = result;
    if (assignments.length === 0) {
        alert("Inget schema att exportera.");
        return;
    }
    // Create the workbook
    const workbook = XLSX.utils.book_new();
    // Group assignments per match
    const grouped = {};
    for (const ass of assignments) {
        if (!grouped[ass.matchIndex])
            grouped[ass.matchIndex] = [];
        grouped[ass.matchIndex].push(ass);
    }
    // Create data for the schedule
    const scheduleData = [];
    Object.keys(grouped)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .forEach((matchKey) => {
        var _a;
        const matchIndex = parseInt(matchKey);
        const matchAssignments = grouped[matchIndex];
        // Add match header
        scheduleData.push([`Match ${matchIndex + 1}`, "", "", "", "", ""]);
        // Add header for shifts and players
        const header = ["Byte"];
        for (let i = 0; i < positions; i++) {
            header.push(`Spelare ${i + 1}`);
        }
        scheduleData.push(header);
        // Add each shift
        for (const ass of matchAssignments) {
            const row = [`${ass.shiftIndex + 1}`];
            for (let i = 0; i < positions; i++) {
                row.push((_a = ass.players[i]) !== null && _a !== void 0 ? _a : "");
            }
            scheduleData.push(row);
        }
        // Add empty row between matches
        scheduleData.push([]);
    });
    // Create worksheet for the schedule
    const scheduleWorksheet = XLSX.utils.aoa_to_sheet(scheduleData);
    XLSX.utils.book_append_sheet(workbook, scheduleWorksheet, "Schema");
    // Create data for total play time
    const summaryData = [
        ["Total speltid per spelare"],
        ["Spelare", "Minuter"],
    ];
    Object.keys(totals)
        .sort((a, b) => a.localeCompare(b))
        .forEach((playerName) => {
        summaryData.push([playerName, totals[playerName]]);
    });
    // Create worksheet for summary
    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Speltid");
    // Export the file
    const fileName = `${teamName}_schedule.xlsx`;
    XLSX.writeFile(workbook, fileName);
}
/**
 * Renders the play schedule and summary in the DOM.
 * @param result Result from generateSchedule.
 * @param container The element where content should be placed.
 */
function renderSchedule(result, container) {
    const { assignments, totals, positions } = result;
    container.innerHTML = "";
    if (assignments.length === 0) {
        container.textContent = "Inget schema genererat.";
        return;
    }
    // Group assignments per match
    const grouped = {};
    for (const ass of assignments) {
        if (!grouped[ass.matchIndex])
            grouped[ass.matchIndex] = [];
        grouped[ass.matchIndex].push(ass);
    }
    // Create HTML for each match
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
        // Shift column
        const thShift = document.createElement("th");
        thShift.textContent = "Byte";
        headerRow.appendChild(thShift);
        // One column per player/position
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
            // Add players in separate columns; fill with empty string if fewer than positions
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
    // Create table for total play time
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
// Global storage for teams after random distribution
let teamA = null;
let teamB = null;
// Global storage for schedule results
let resultA = null;
let resultB = null;
// Navigation between steps in the sidebar
const navStep1 = document.getElementById("nav-step1");
const navStep2 = document.getElementById("nav-step2");
const step1Div = document.getElementById("step1");
const step2Div = document.getElementById("step2");
function showStep(step) {
    if (!step1Div || !step2Div || !navStep1 || !navStep2)
        return;
    if (step === 1) {
        step1Div.style.display = "block";
        step2Div.style.display = "none";
        navStep1.classList.add("active");
        navStep2.classList.remove("active");
    }
    else {
        step1Div.style.display = "none";
        step2Div.style.display = "block";
        navStep1.classList.remove("active");
        navStep2.classList.add("active");
    }
}
navStep1 === null || navStep1 === void 0 ? void 0 : navStep1.addEventListener("click", () => showStep(1));
navStep2 === null || navStep2 === void 0 ? void 0 : navStep2.addEventListener("click", () => showStep(2));
/**
 * Renders a team list with drag-and-drop functionality (mouse and touch)
 */
function renderTeamList(team, listElement, teamId) {
    listElement.innerHTML = "";
    const playerNames = team.getPlayerNames();
    playerNames.forEach((name, index) => {
        const li = document.createElement("li");
        li.textContent = name;
        li.draggable = true;
        li.dataset.playerName = name;
        li.dataset.teamId = teamId;
        li.style.cursor = "grab";
        li.style.padding = "12px";
        li.style.marginBottom = "6px";
        li.style.backgroundColor = "#f9f9f9";
        li.style.borderRadius = "4px";
        li.style.border = "1px solid #ddd";
        li.style.transition = "transform 0.1s, opacity 0.2s";
        li.style.userSelect = "none";
        // Mouse drag events
        li.addEventListener("dragstart", (e) => {
            if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", name);
                e.dataTransfer.setData("sourceTeam", teamId);
                li.style.opacity = "0.5";
            }
        });
        li.addEventListener("dragend", () => {
            li.style.opacity = "1";
        });
        // Touch events for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        let isDragging = false;
        let clone = null;
        let currentDropZone = null;
        li.addEventListener("touchstart", (e) => {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isDragging = false;
            li.style.cursor = "grabbing";
        }, { passive: true });
        li.addEventListener("touchmove", (e) => {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - touchStartX);
            const deltaY = Math.abs(touch.clientY - touchStartY);
            // Start dragging if moved more than 10px
            if (!isDragging && (deltaX > 10 || deltaY > 10)) {
                isDragging = true;
                li.style.opacity = "0.3";
                // Create a visual clone that follows the finger
                clone = li.cloneNode(true);
                clone.style.position = "fixed";
                clone.style.pointerEvents = "none";
                clone.style.zIndex = "1000";
                clone.style.width = li.offsetWidth + "px";
                clone.style.opacity = "0.8";
                clone.style.transform = "scale(1.05)";
                document.body.appendChild(clone);
            }
            if (isDragging && clone) {
                e.preventDefault();
                // Position clone at touch location
                clone.style.left = touch.clientX - clone.offsetWidth / 2 + "px";
                clone.style.top = touch.clientY - clone.offsetHeight / 2 + "px";
                // Check if we're over a drop zone
                const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                const dropZone = elemBelow === null || elemBelow === void 0 ? void 0 : elemBelow.closest(".team");
                if (dropZone && dropZone !== currentDropZone) {
                    currentDropZone === null || currentDropZone === void 0 ? void 0 : currentDropZone.classList.remove("drag-over");
                    dropZone.classList.add("drag-over");
                    currentDropZone = dropZone;
                }
                else if (!dropZone && currentDropZone) {
                    currentDropZone.classList.remove("drag-over");
                    currentDropZone = null;
                }
            }
        }, { passive: false });
        li.addEventListener("touchend", (e) => {
            li.style.cursor = "grab";
            li.style.opacity = "1";
            if (isDragging && clone) {
                const touch = e.changedTouches[0];
                const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                const dropZone = elemBelow === null || elemBelow === void 0 ? void 0 : elemBelow.closest(".team");
                if (dropZone) {
                    dropZone.classList.remove("drag-over");
                    const targetTeamId = dropZone.id === "teamAContainer" ? "teamA" : "teamB";
                    // Only move if dropping on different team
                    if (targetTeamId !== teamId) {
                        const sourceTeam = teamId === "teamA" ? teamA : teamB;
                        const targetTeam = targetTeamId === "teamA" ? teamA : teamB;
                        if (sourceTeam && targetTeam) {
                            sourceTeam.removePlayer(name);
                            targetTeam.addPlayer(name);
                            // Update both team displays
                            const listA = document.getElementById("teamAList");
                            const listB = document.getElementById("teamBList");
                            if (listA && teamA)
                                renderTeamList(teamA, listA, "teamA");
                            if (listB && teamB)
                                renderTeamList(teamB, listB, "teamB");
                        }
                    }
                }
                currentDropZone === null || currentDropZone === void 0 ? void 0 : currentDropZone.classList.remove("drag-over");
                currentDropZone = null;
                clone.remove();
                clone = null;
            }
            isDragging = false;
        });
        li.addEventListener("touchcancel", () => {
            li.style.cursor = "grab";
            li.style.opacity = "1";
            if (clone) {
                clone.remove();
                clone = null;
            }
            currentDropZone === null || currentDropZone === void 0 ? void 0 : currentDropZone.classList.remove("drag-over");
            currentDropZone = null;
            isDragging = false;
        });
        listElement.appendChild(li);
    });
}
/**
 * Sets up drag-and-drop handlers for a team container
 */
function setupTeamDropZone(containerElement, teamId) {
    containerElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = "move";
        }
        containerElement.style.backgroundColor = "#e3f2fd";
    });
    containerElement.addEventListener("dragleave", () => {
        containerElement.style.backgroundColor = "#ffffff";
    });
    containerElement.addEventListener("drop", (e) => {
        e.preventDefault();
        containerElement.style.backgroundColor = "#ffffff";
        if (!e.dataTransfer)
            return;
        const playerName = e.dataTransfer.getData("text/plain");
        const sourceTeamId = e.dataTransfer.getData("sourceTeam");
        if (!playerName || sourceTeamId === teamId)
            return;
        // Move player from source team to target team
        const sourceTeam = sourceTeamId === "teamA" ? teamA : teamB;
        const targetTeam = teamId === "teamA" ? teamA : teamB;
        if (sourceTeam && targetTeam) {
            sourceTeam.removePlayer(playerName);
            targetTeam.addPlayer(playerName);
            // Update both team displays
            const listA = document.getElementById("teamAList");
            const listB = document.getElementById("teamBList");
            if (listA && teamA)
                renderTeamList(teamA, listA, "teamA");
            if (listB && teamB)
                renderTeamList(teamB, listB, "teamB");
        }
    });
}
// Handle random team distribution
const splitBtn = document.getElementById("splitTeamsBtn");
splitBtn === null || splitBtn === void 0 ? void 0 : splitBtn.addEventListener("click", () => {
    const playersInputEl = document.getElementById("players");
    const rawInput = playersInputEl.value;
    const names = rawInput
        .split(/[\n,]+/)
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
    if (names.length < 2) {
        alert("Ange minst två spelare för att dela upp lagen.");
        return;
    }
    // Shuffle names and split into two teams
    const shuffled = shuffleArray(names);
    const half = Math.ceil(shuffled.length / 2);
    teamA = new Team(shuffled.slice(0, half));
    teamB = new Team(shuffled.slice(half));
    // Update DOM with drag-and-drop enabled lists
    const listA = document.getElementById("teamAList");
    const listB = document.getElementById("teamBList");
    const containerA = document.getElementById("teamAContainer");
    const containerB = document.getElementById("teamBContainer");
    if (listA && teamA)
        renderTeamList(teamA, listA, "teamA");
    if (listB && teamB)
        renderTeamList(teamB, listB, "teamB");
    // Set up drop zones
    if (containerA)
        setupTeamDropZone(containerA, "teamA");
    if (containerB)
        setupTeamDropZone(containerB, "teamB");
});
// Handle the form for schedule generation for both teams
const scheduleFormEl = document.getElementById("scheduleForm");
const outputA = document.getElementById("outputA");
const outputB = document.getElementById("outputB");
scheduleFormEl === null || scheduleFormEl === void 0 ? void 0 : scheduleFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!outputA || !outputB)
        return;
    // Read values from the form
    const matchesInput = parseInt(document.getElementById("matches").value, 10);
    const matchLengthInput = parseInt(document.getElementById("matchLength").value, 10);
    const shiftLengthInput = parseInt(document.getElementById("shiftLength").value, 10);
    const positionsInput = parseInt(document.getElementById("positions").value, 10);
    // Ensure that teams have been generated
    if (!teamA || !teamB || teamA.size() === 0 || teamB.size() === 0) {
        alert("Dela först upp lagen i steg 1 innan du genererar schema.");
        return;
    }
    // Validate that the number of positions does not exceed team sizes
    if (positionsInput > teamA.size() || positionsInput > teamB.size()) {
        alert("Antalet positioner kan inte överstiga antalet spelare i något av lagen.");
        return;
    }
    // Generate and render schedule for both teams
    resultA = generateSchedule(teamA.getPlayerNames(), matchesInput, matchLengthInput, shiftLengthInput, positionsInput);
    resultB = generateSchedule(teamB.getPlayerNames(), matchesInput, matchLengthInput, shiftLengthInput, positionsInput);
    renderSchedule(resultA, outputA);
    renderSchedule(resultB, outputB);
    // Show export buttons
    const exportBtnA = document.getElementById("exportA");
    const exportBtnB = document.getElementById("exportB");
    if (exportBtnA)
        exportBtnA.style.display = "block";
    if (exportBtnB)
        exportBtnB.style.display = "block";
});
// Event handlers for export buttons
const exportBtnA = document.getElementById("exportA");
const exportBtnB = document.getElementById("exportB");
exportBtnA === null || exportBtnA === void 0 ? void 0 : exportBtnA.addEventListener("click", () => {
    if (resultA) {
        exportToExcel(resultA, "Norrviken_Svart_1");
    }
});
exportBtnB === null || exportBtnB === void 0 ? void 0 : exportBtnB.addEventListener("click", () => {
    if (resultB) {
        exportToExcel(resultB, "Norrviken_Svart_2");
    }
});
