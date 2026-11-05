import { apiFetch } from "@/shared/api/http";

export type AuthUser = {
  email: string;
  name: string | null;
  role: "ADMIN" | "CUSTOMER";
  createdAt: string;
};

export type Credentials = { email: string; password: string };

export function login({ email, password }: Credentials) {
  return apiFetch<AuthUser>("/auth/login", { method: "POST", body: { email, password } });
}

export function register({ email, password }: Credentials) {
  return apiFetch<AuthUser>("/auth/register", { method: "POST", body: { email, password } });
}

export function logout() {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiFetch<AuthUser>("/auth/me");
}

export function updateProfile(name: string) {
  return apiFetch<AuthUser>("/auth/profile", { method: "PATCH", body: { name } });
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiFetch<void>("/auth/password", { method: "PATCH", body: { currentPassword, newPassword } });
}
