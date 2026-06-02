const TOKEN_KEY = "connect_auth_token";
const USER_KEY = "connect_auth_user";

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): string | null {
  return localStorage.getItem(USER_KEY);
}

export function setStoredUser(json: string): void {
  localStorage.setItem(USER_KEY, json);
}
