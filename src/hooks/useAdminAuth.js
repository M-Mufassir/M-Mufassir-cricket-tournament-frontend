const TOKEN_KEY = "cricket_admin_token";
const ADMIN_KEY = "cricket_admin_profile";

export function getStoredAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredAdminProfile() {
  const profile = localStorage.getItem(ADMIN_KEY);

  if (!profile) {
    return null;
  }

  try {
    return JSON.parse(profile);
  } catch (error) {
    clearAdminSession();
    return null;
  }
}

export function saveAdminSession({ token, admin }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}
