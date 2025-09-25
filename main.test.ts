/**
 * Unit tests for footy scheduler core functionality
 */

import {
  generateSchedule,
  shuffleArray,
  Player,
  ScheduleAssignment,
  ScheduleResult,
} from "./main";

// DOM environment is provided by jsdom

describe("generateSchedule", () => {
  test("should generate basic schedule with valid inputs", () => {
    const playerNames = ["Alice", "Bob", "Charlie"];
    const result = generateSchedule(playerNames, 1, 30, 10, 2);

    expect(result.assignments).toHaveLength(3); // 30 minutes / 10 minutes = 3 shifts
    expect(result.totals).toHaveProperty("Alice");
    expect(result.totals).toHaveProperty("Bob");
    expect(result.totals).toHaveProperty("Charlie");
    expect(result.positions).toBe(2);
  });

  test("should handle empty player list", () => {
    const result = generateSchedule([], 1, 30, 10, 2);

    expect(result.assignments).toHaveLength(0);
    expect(result.totals).toEqual({});
    expect(result.positions).toBe(2);
  });

  test("should filter out empty and duplicate names", () => {
    const playerNames = ["Alice", "", "Bob", "Alice", "  ", "Charlie  "];
    const result = generateSchedule(playerNames, 1, 10, 10, 2);

    expect(Object.keys(result.totals)).toHaveLength(3);
    expect(result.totals).toHaveProperty("Alice");
    expect(result.totals).toHaveProperty("Bob");
    expect(result.totals).toHaveProperty("Charlie");
  });

  test("should distribute playing time evenly", () => {
    const playerNames = ["Alice", "Bob", "Charlie", "David"];
    const result = generateSchedule(playerNames, 2, 20, 10, 2);

    const totalMinutes = Object.values(result.totals);
    const maxMinutes = Math.max(...totalMinutes);
    const minMinutes = Math.min(...totalMinutes);

    // With even distribution, max and min should not differ by more than one shift
    expect(maxMinutes - minMinutes).toBeLessThanOrEqual(10);
  });

  test("should handle remainder minutes correctly", () => {
    const playerNames = ["Alice", "Bob"];
    const result = generateSchedule(playerNames, 1, 25, 10, 2); // 25 minutes = 2 full shifts + 5 minute remainder

    expect(result.assignments).toHaveLength(3); // 2 full shifts + 1 remainder shift

    // Total playing time should equal match length
    const totalTime = Object.values(result.totals).reduce(
      (sum, time) => sum + time,
      0,
    );
    expect(totalTime).toBe(50); // 25 minutes * 2 players
  });

  test("should assign correct number of players per shift", () => {
    const playerNames = ["Alice", "Bob", "Charlie", "David", "Eve"];
    const result = generateSchedule(playerNames, 1, 20, 10, 3);

    result.assignments.forEach((assignment) => {
      expect(assignment.players).toHaveLength(3);
    });
  });

  test("should handle single match with single shift", () => {
    const playerNames = ["Alice", "Bob", "Charlie"];
    const result = generateSchedule(playerNames, 1, 10, 10, 2);

    expect(result.assignments).toHaveLength(1);
    expect(result.assignments[0].matchIndex).toBe(0);
    expect(result.assignments[0].shiftIndex).toBe(0);
    expect(result.assignments[0].players).toHaveLength(2);
  });

  test("should work with more positions than players", () => {
    const playerNames = ["Alice", "Bob"];
    const result = generateSchedule(playerNames, 1, 10, 10, 5);

    expect(result.assignments).toHaveLength(1);
    expect(result.assignments[0].players).toHaveLength(2); // Can only assign available players
  });
});

describe("shuffleArray", () => {
  test("should return array with same elements", () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);

    expect(shuffled).toHaveLength(original.length);
    expect(shuffled.sort()).toEqual(original.sort());
  });

  test("should not modify original array", () => {
    const original = [1, 2, 3, 4, 5];
    const originalCopy = [...original];
    shuffleArray(original);

    expect(original).toEqual(originalCopy);
  });

  test("should handle empty array", () => {
    const result = shuffleArray([]);
    expect(result).toEqual([]);
  });

  test("should handle single element array", () => {
    const result = shuffleArray([42]);
    expect(result).toEqual([42]);
  });

  test("should shuffle array (statistical test)", () => {
    const original = [1, 2, 3, 4, 5];
    let differentCount = 0;

    // Run shuffle multiple times and count how many times result differs from original
    for (let i = 0; i < 100; i++) {
      const shuffled = shuffleArray(original);
      if (JSON.stringify(shuffled) !== JSON.stringify(original)) {
        differentCount++;
      }
    }

    // Should be shuffled most of the time (allowing for occasional same order by chance)
    expect(differentCount).toBeGreaterThan(80);
  });
});
