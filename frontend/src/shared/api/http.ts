// Set VITE_API_URL at build time (e.g. https://api.rivalnepal.com/api). When it is empty the
// browser calls `/api` on the same origin, which is what a reverse-proxied deploy wants.
const configuredUrl = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");
const API_URL = configuredUrl || (import.meta.env.DEV ? "http://localhost:4000/api" : "/api");

/** Error thrown by every API call so query/mutation handlers can show `error.message`. */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

/**
 * Single entry point for the backend. Sends the cookies the auth session needs and the
 * `X-Requested-With` header the API checks on writes, then normalises error messages.
 */
export async function apiFetch<T>(path: string, { body, ...init }: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(init.headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const payload = await res.json();
      if (payload?.message) message = payload.message;
    } catch {
      // non-JSON error body; keep the status-based message
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export { API_URL };
