import { apiFetch } from "@/shared/api/http";

export type SubscribeResult = { email: string; subscribed: boolean };

/** Signing up twice is fine — the API treats it as idempotent. */
export function subscribeToNewsletter(email: string): Promise<SubscribeResult> {
  return apiFetch<SubscribeResult>("/newsletter", { method: "POST", body: { email } });
}
