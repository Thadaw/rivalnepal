import { QueryClient } from "@tanstack/react-query";

/** Shared cache for every query/mutation in the app. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
