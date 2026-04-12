export const PLAYER_ROLE_OPTIONS = [
  "Batsman",
  "Bowler",
  "All-Rounder",
  "Wicket-Keeper",
];

export function createEmptyPlayer(index = 0) {
  return {
    fullName: "",
    role: "Batsman",
    age: "",
    jerseyNumber: index + 1,
    battingStyle: "",
    bowlingStyle: "",
    phoneNumber: "",
    isCaptain: index === 0,
  };
}

export function createInitialPlayers(count = 11) {
  return Array.from({ length: count }, (_, index) => createEmptyPlayer(index));
}
