/**
 * Football Team Schedule Planner - Core Functions
 *
 * This file contains a simple algorithm to allocate play times
 * evenly between players across multiple matches. The user provides a list
 * of children's names, number of matches, the length of each match, play time per shift,
 * and how many players should be on the field simultaneously. The algorithm
 * divides each match into equally long shifts (based on the specified play time
 * per shift) and then uses a greedy strategy to select the
 * players who have played the least time so far. It also tries to avoid
 * having the same player play two shifts in a row in the same match when
 * possible.
 */
/**
 * Team class that contains a list of Players
 */
export class Team {
    constructor(playerNames) {
        this.players = playerNames.map((name) => ({
            name,
            totalMinutes: 0,
            lastShiftIndex: -Infinity,
        }));
    }
    /**
     * Get all players in the team
     */
    getPlayers() {
        return this.players;
    }
    /**
     * Get player names as an array
     */
    getPlayerNames() {
        return this.players.map((p) => p.name);
    }
    /**
     * Add a player to the team
     */
    addPlayer(name) {
        this.players.push({
            name,
            totalMinutes: 0,
            lastShiftIndex: -Infinity,
        });
    }
    /**
     * Remove a player from the team by name
     */
    removePlayer(name) {
        const index = this.players.findIndex((p) => p.name === name);
        if (index !== -1) {
            this.players.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Get the number of players in the team
     */
    size() {
        return this.players.length;
    }
    /**
     * Set players from an array of names
     */
    setPlayers(playerNames) {
        this.players = playerNames.map((name) => ({
            name,
            totalMinutes: 0,
            lastShiftIndex: -Infinity,
        }));
    }
}
/**
 * Generates a play schedule based on input data.
 * @param playerNames List of player names
 * @param numMatches Number of matches
 * @param matchLength Length of match in minutes
 * @param shiftLength Length of each shift in minutes
 * @param positions Number of players playing simultaneously
 * @returns A list of schedule assignments
 */
export function generateSchedule(playerNames, numMatches, matchLength, shiftLength, positions) {
    // Filter out empty or duplicate names and trim whitespace
    const uniqueNames = Array.from(new Set(playerNames.map((n) => n.trim()).filter((n) => n.length > 0)));
    // Create players with accumulators
    const players = uniqueNames.map((name) => ({
        name,
        totalMinutes: 0,
        lastShiftIndex: -Infinity,
    }));
    const assignments = [];
    if (players.length === 0)
        return { assignments, totals: {}, positions };
    // Total table with play times per player
    const totals = {};
    players.forEach((p) => (totals[p.name] = 0));
    for (let m = 0; m < numMatches; m++) {
        // Reset lastShiftIndex for each match
        players.forEach((p) => {
            p.lastShiftIndex = -Infinity;
        });
        // Number of shifts per match. If the match doesn't divide evenly into shifts,
        // the last shift will be shorter than shiftLength.
        const fullShifts = Math.floor(matchLength / shiftLength);
        const remainder = matchLength % shiftLength;
        const shiftsInMatch = remainder > 0 ? fullShifts + 1 : fullShifts;
        for (let s = 0; s < shiftsInMatch; s++) {
            // Sort players by lowest totalMinutes; break ties by name order
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
                // Avoid two shifts in a row for the same player (if possible)
                if (players.length > positions && candidate.lastShiftIndex === s - 1) {
                    continue;
                }
                selected.push(candidate);
            }
            // Fill up if we haven't gotten enough players
            if (selected.length < positions) {
                for (const candidate of sortedPlayers) {
                    if (selected.includes(candidate))
                        continue;
                    selected.push(candidate);
                    if (selected.length >= positions)
                        break;
                }
            }
            // Actual length of the shift: either full length or remainder
            const currentShiftLength = s === shiftsInMatch - 1 && remainder > 0 ? remainder : shiftLength;
            // Save assignment and update play times
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
 * Function to shuffle an array randomly (Fisher–Yates)
 */
export function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
