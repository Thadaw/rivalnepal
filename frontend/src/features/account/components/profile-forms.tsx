import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useChangePassword, useUpdateProfile } from "@/features/auth/hooks/use-auth-mutations";
import type { AuthUser } from "@/features/auth/api/auth.api";
import {
  passwordSchema,
  profileSchema,
  type PasswordValues,
  type ProfileValues,
} from "@/features/account/schemas/profile-schema";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { FormField } from "@/shared/components/ui/form-field";
import { Input } from "@/shared/components/ui/input";

const card = "border border-black/10 bg-white p-6 md:p-8";
const errorText = "text-[11px] text-error";

export function ProfileForms({ user }: { user: AuthUser }) {
  const profileMutation = useUpdateProfile();
  const passwordMutation = useChangePassword();

  const profile = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name ?? "" },
  });

  const password = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const profileError = profileMutation.error instanceof Error ? profileMutation.error.message : null;
  const passwordError = passwordMutation.error instanceof Error ? passwordMutation.error.message : null;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <form
        onSubmit={profile.handleSubmit((values) =>
          profileMutation.mutate(values.name ?? "", {
            onSuccess: () => toast.success("Profile updated."),
          }),
        )}
        className={card}
        noValidate
      >
        <h2 className="text-[11px] font-semibold uppercase tracking-[.18em]">Display name</h2>
        <p className="mt-1.5 text-[11px] leading-5 text-black/45">Shown on your account. Email stays unchanged.</p>

        <div className="mt-5">
          <FormField
            id="profile-name"
            label="Name"
            error={profile.formState.errors.name?.message ?? undefined}
            hint="Leave empty to remove your display name."
          >
            <Input
              id="profile-name"
              placeholder="e.g. Aarav Sharma"
              aria-invalid={Boolean(profile.formState.errors.name)}
              {...profile.register("name")}
            />
          </FormField>
          {profileError && <p className={`mt-2 ${errorText}`}>{profileError}</p>}
        </div>

        <div className="mt-6 flex justify-end border-t border-black/10 pt-5">
          <Button type="submit" size="sm" disabled={profileMutation.isPending}>
            {profileMutation.isPending ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </form>

      <form
        onSubmit={password.handleSubmit((values) =>
          passwordMutation.mutate(values, {
            onSuccess: () => {
              password.reset();
              toast.success("Password changed.");
            },
          }),
        )}
        className={card}
        noValidate
      >
        <h2 className="text-[11px] font-semibold uppercase tracking-[.18em]">Password</h2>
        <p className="mt-1.5 text-[11px] leading-5 text-black/45">
          Use at least 8 characters. You stay signed in after changing it.
        </p>

        <div className="mt-5 space-y-4">
          <FormField
            id="current-password"
            label="Current password"
            error={password.formState.errors.currentPassword?.message}
          >
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(password.formState.errors.currentPassword)}
              {...password.register("currentPassword")}
            />
          </FormField>
          <FormField
            id="new-password"
            label="New password"
            error={password.formState.errors.newPassword?.message}
          >
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(password.formState.errors.newPassword)}
              {...password.register("newPassword")}
            />
          </FormField>
          {passwordError && <Alert variant="destructive">{passwordError}</Alert>}
        </div>

        <div className="mt-6 flex justify-end border-t border-black/10 pt-5">
          <Button type="submit" size="sm" disabled={passwordMutation.isPending}>
            {passwordMutation.isPending ? "Updating…" : "Update password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
