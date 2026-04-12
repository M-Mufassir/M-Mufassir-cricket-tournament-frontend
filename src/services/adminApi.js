import { apiRequest } from "./http";

export function loginAdmin(credentials) {
  return apiRequest("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getAdminProfile(token) {
  return apiRequest("/admin/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getDashboardSummary(token) {
  return apiRequest("/admin/dashboard/summary", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAdminTeams(token, params = {}) {
  const searchParams = new URLSearchParams();

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.tournamentId) {
    searchParams.set("tournamentId", params.tournamentId);
  }

  if (params.search) {
    searchParams.set("search", params.search);
  }

  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

  return apiRequest(`/admin/teams${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAdminTeamById(token, teamId) {
  return apiRequest(`/admin/teams/${teamId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateAdminTeamStatus(token, teamId, payload) {
  return apiRequest(`/admin/teams/${teamId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updateAdminTeam(token, teamId, payload) {
  return apiRequest(`/admin/teams/${teamId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function deleteAdminTeam(token, teamId) {
  return apiRequest(`/admin/teams/${teamId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
