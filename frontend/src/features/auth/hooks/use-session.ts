import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/features/auth/api/auth.api";

export const authKeys = {
  /** Everything scoped to the signed-in user hangs off this key. */
  all: ["auth"] as const,
  me: ["auth", "me"] as const,
};

/** The signed-in user, or `null` when the cookie is missing/expired. */
export function useSession() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      try {
        return await getMe();
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60_000,
  });
}
