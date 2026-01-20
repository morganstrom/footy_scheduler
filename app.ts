/**
 * App module - handles DOM interactions and imports core functions from main.ts
 */

import {
  generateSchedule,
  shuffleArray,
  type ScheduleResult,
  type ScheduleAssignment,
} from "./main.js";

// XLSX is loaded from CDN as global variable
declare const XLSX: any;

/**
 * Exports the schedule to Excel format
 * @param result Result from generateSchedule
 * @param teamName The name of the team
 */
function exportToExcel(result: ScheduleResult, teamName: string) {
  const { assignments, totals, positions } = result;

  if (assignments.length === 0) {
    alert("Inget schema att exportera.");
    return;
  }

  // Create the workbook
  const workbook = XLSX.utils.book_new();

  // Group assignments per match
  const grouped: Record<number, ScheduleAssignment[]> = {};
  for (const ass of assignments) {
    if (!grouped[ass.matchIndex]) grouped[ass.matchIndex] = [];
    grouped[ass.matchIndex].push(ass);
  }

  // Create data for the schedule
  const scheduleData: any[] = [];

  Object.keys(grouped)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((matchKey) => {
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
          row.push(ass.players[i] ?? "");
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
  const summaryData: any[] = [
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
function renderSchedule(result: ScheduleResult, container: HTMLElement) {
  const { assignments, totals, positions } = result;
  container.innerHTML = "";
  if (assignments.length === 0) {
    container.textContent = "Inget schema genererat.";
    return;
  }
  // Group assignments per match
  const grouped: Record<number, ScheduleAssignment[]> = {};
  for (const ass of assignments) {
    if (!grouped[ass.matchIndex]) grouped[ass.matchIndex] = [];
    grouped[ass.matchIndex].push(ass);
  }
  // Create HTML for each match
  Object.keys(grouped)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((matchKey) => {
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
          cell.textContent = ass.players[i] ?? "";
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
let teamA: string[] = [];
let teamB: string[] = [];

// Global storage for schedule results
let resultA: ScheduleResult | null = null;
let resultB: ScheduleResult | null = null;

// Navigation between steps in the sidebar
const navStep1 = document.getElementById("nav-step1");
const navStep2 = document.getElementById("nav-step2");
const step1Div = document.getElementById("step1");
const step2Div = document.getElementById("step2");

function showStep(step: number) {
  if (!step1Div || !step2Div || !navStep1 || !navStep2) return;
  if (step === 1) {
    step1Div.style.display = "block";
    step2Div.style.display = "none";
    navStep1.classList.add("active");
    navStep2.classList.remove("active");
  } else {
    step1Div.style.display = "none";
    step2Div.style.display = "block";
    navStep1.classList.remove("active");
    navStep2.classList.add("active");
  }
}

navStep1?.addEventListener("click", () => showStep(1));
navStep2?.addEventListener("click", () => showStep(2));

// Handle random team distribution
const splitBtn = document.getElementById("splitTeamsBtn");
splitBtn?.addEventListener("click", () => {
  const playersInputEl = document.getElementById(
    "players",
  ) as HTMLTextAreaElement;
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
  teamA = shuffled.slice(0, half);
  teamB = shuffled.slice(half);
  // Update DOM
  const listA = document.getElementById("teamAList");
  const listB = document.getElementById("teamBList");
  if (listA) listA.innerHTML = "";
  if (listB) listB.innerHTML = "";
  teamA.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    listA?.appendChild(li);
  });
  teamB.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    listB?.appendChild(li);
  });
  // Automatically switch to step 2
  showStep(2);
});

// Handle the form for schedule generation for both teams
const scheduleFormEl = document.getElementById("scheduleForm");
const outputA = document.getElementById("outputA");
const outputB = document.getElementById("outputB");
scheduleFormEl?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!outputA || !outputB) return;
  // Read values from the form
  const matchesInput = parseInt(
    (document.getElementById("matches") as HTMLInputElement).value,
    10,
  );
  const matchLengthInput = parseInt(
    (document.getElementById("matchLength") as HTMLInputElement).value,
    10,
  );
  const shiftLengthInput = parseInt(
    (document.getElementById("shiftLength") as HTMLInputElement).value,
    10,
  );
  const positionsInput = parseInt(
    (document.getElementById("positions") as HTMLInputElement).value,
    10,
  );
  // Ensure that teams have been generated
  if (teamA.length === 0 || teamB.length === 0) {
    alert("Dela först upp lagen i steg 1 innan du genererar schema.");
    return;
  }
  // Validate that the number of positions does not exceed team sizes
  if (positionsInput > teamA.length || positionsInput > teamB.length) {
    alert(
      "Antalet positioner kan inte överstiga antalet spelare i något av lagen.",
    );
    return;
  }
  // Generate and render schedule for both teams
  resultA = generateSchedule(
    teamA,
    matchesInput,
    matchLengthInput,
    shiftLengthInput,
    positionsInput,
  );
  resultB = generateSchedule(
    teamB,
    matchesInput,
    matchLengthInput,
    shiftLengthInput,
    positionsInput,
  );
  renderSchedule(resultA, outputA as HTMLElement);
  renderSchedule(resultB, outputB as HTMLElement);

  // Show export buttons
  const exportBtnA = document.getElementById("exportA");
  const exportBtnB = document.getElementById("exportB");
  if (exportBtnA) exportBtnA.style.display = "block";
  if (exportBtnB) exportBtnB.style.display = "block";
});

// Event handlers for export buttons
const exportBtnA = document.getElementById("exportA");
const exportBtnB = document.getElementById("exportB");

exportBtnA?.addEventListener("click", () => {
  if (resultA) {
    exportToExcel(resultA, "Norrviken_Svart_1");
  }
});

exportBtnB?.addEventListener("click", () => {
  if (resultB) {
    exportToExcel(resultB, "Norrviken_Svart_2");
  }
});
