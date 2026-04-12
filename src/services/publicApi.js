import { apiRequest } from "./http";

export function getPublicTournament(tournamentId) {
  const query = tournamentId ? `?tournamentId=${tournamentId}` : "";
  return apiRequest(`/public/tournament${query}`);
}

export function getApprovedTeams(tournamentId) {
  const query = tournamentId ? `?tournamentId=${tournamentId}` : "";
  return apiRequest(`/public/teams/approved${query}`);
}

export function registerTeam(formData) {
  return apiRequest("/public/teams/register", {
    method: "POST",
    body: formData,
  });
}
