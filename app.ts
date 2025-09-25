/**
 * App module - handles DOM interactions and imports core functions from main.ts
 */

import { generateSchedule, shuffleArray, type ScheduleResult, type ScheduleAssignment } from './main.js';

/**
 * Renderar spelschemat och sammanställning i DOM.
 * @param result Resultat från generateSchedule.
 * @param container Elementet där innehållet ska placeras.
 */
function renderSchedule(result: ScheduleResult, container: HTMLElement) {
  const { assignments, totals, positions } = result;
  container.innerHTML = "";
  if (assignments.length === 0) {
    container.textContent = "Inget schema genererat.";
    return;
  }
  // Grupp tilldelningar per match
  const grouped: Record<number, ScheduleAssignment[]> = {};
  for (const ass of assignments) {
    if (!grouped[ass.matchIndex]) grouped[ass.matchIndex] = [];
    grouped[ass.matchIndex].push(ass);
  }
  // Skapa HTML för varje match
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
          cell.textContent = ass.players[i] ?? "";
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

// Globalt lagringsutrymme för lag efter slumpfördelning
let teamA: string[] = [];
let teamB: string[] = [];

// Navigering mellan steg i sidpanelen
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

// Hantera slumpmässig lagindelning
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
  // Blanda namn och dela i två lag
  const shuffled = shuffleArray(names);
  const half = Math.ceil(shuffled.length / 2);
  teamA = shuffled.slice(0, half);
  teamB = shuffled.slice(half);
  // Uppdatera DOM
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
  // Växla till steg 2 automatiskt
  showStep(2);
});

// Hantera formuläret för schemagenerering för båda lag
const scheduleFormEl = document.getElementById("scheduleForm");
const outputA = document.getElementById("outputA");
const outputB = document.getElementById("outputB");
scheduleFormEl?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!outputA || !outputB) return;
  // Läs värden från formuläret
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
  // Säkerställ att lag har genererats
  if (teamA.length === 0 || teamB.length === 0) {
    alert("Dela först upp lagen i steg 1 innan du genererar schema.");
    return;
  }
  // Validera att antalet positioner inte överstiger lagstorlekar
  if (positionsInput > teamA.length || positionsInput > teamB.length) {
    alert(
      "Antalet positioner kan inte överstiga antalet spelare i något av lagen.",
    );
    return;
  }
  // Generera och rendera schema för båda lag
  const resultA = generateSchedule(
    teamA,
    matchesInput,
    matchLengthInput,
    shiftLengthInput,
    positionsInput,
  );
  const resultB = generateSchedule(
    teamB,
    matchesInput,
    matchLengthInput,
    shiftLengthInput,
    positionsInput,
  );
  renderSchedule(resultA, outputA as HTMLElement);
  renderSchedule(resultB, outputB as HTMLElement);
});
