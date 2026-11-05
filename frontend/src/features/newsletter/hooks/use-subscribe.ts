import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/features/newsletter/api/newsletter.api";

export function useSubscribeToNewsletter() {
  return useMutation({
    mutationFn: (email: string) => subscribeToNewsletter(email),
    onSuccess: () => toast.success("You're on the list for the next RIVAL drop."),
  });
}
