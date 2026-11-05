import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  changePassword,
  login,
  logout,
  register,
  updateProfile,
  type Credentials,
} from "@/features/auth/api/auth.api";
import { authKeys } from "@/features/auth/hooks/use-session";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: Credentials) => login(credentials),
    onSuccess: (user) => queryClient.setQueryData(authKeys.me, user),
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: Credentials) => register(credentials),
    onSuccess: (user) => queryClient.setQueryData(authKeys.me, user),
  });
}

export function useLogout({ redirectTo }: { redirectTo?: string } = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      if (redirectTo) navigate(redirectTo, { replace: true });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => updateProfile(name),
    onSuccess: (user) => queryClient.setQueryData(authKeys.me, user),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      changePassword(input.currentPassword, input.newPassword),
  });
}
