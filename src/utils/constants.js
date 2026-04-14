export const PLAYER_ROLE_OPTIONS = [
  "Batsman",
  "Bowler",
  "All-Rounder",
  "Wicket-Keeper",
];

export const SITE_BRAND = {
  title: "Periyamulla Trophy",
  subtitle: "Cricket Tournament Registration",
  location: "Negombo",
};

export const ADMIN_CONTACT = {
  phone: "+94774233426",
  displayPhone: "+94 77 423 3426",
  telUrl: "tel:+94774233426",
  whatsappUrl: "https://wa.me/94774233426",
};

export const MIN_PLAYERS_PER_TEAM = 11;
export const DEFAULT_MAX_PLAYERS_PER_TEAM = 20;

export function createPlayerClientId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `player-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyPlayer(index = 0) {
  return {
    clientId: createPlayerClientId(),
    fullName: "",
    role: "Batsman",
    nicNumber: "",
    phoneNumber: "",
    isCaptain: false,
    isViceCaptain: false,
    sortOrder: index + 1,
  };
}

export function createInitialPlayers(count = MIN_PLAYERS_PER_TEAM) {
  return Array.from({ length: count }, (_, index) => createEmptyPlayer(index));
}

export function buildPlayersWithLeadership(players, captainIndex, viceCaptainIndex) {
  return players.map((player, index) => ({
    ...player,
    isCaptain: index === Number(captainIndex),
    isViceCaptain: index === Number(viceCaptainIndex),
    sortOrder: index + 1,
  }));
}

export function getPlayerDisplayName(player, index) {
  return player?.fullName?.trim() || `Player ${index + 1}`;
}
