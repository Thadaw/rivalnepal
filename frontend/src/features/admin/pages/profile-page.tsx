import { Navigate } from "react-router-dom";
import { CalendarDays, Mail, ShieldCheck } from "lucide-react";
import { useSession } from "@/features/auth/hooks/use-session";
import { ProfileForms } from "@/features/account/components/profile-forms";

export function ProfilePage() {
  const { data: user, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse space-y-4">
        <div className="h-4 w-32 rounded bg-neutral-100" />
        <div className="h-10 w-64 rounded bg-neutral-100" />
        <div className="h-40 rounded-2xl bg-neutral-100" />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;

  const displayName = user.name?.trim() || user.email.split("@")[0];
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const joined = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Your account</p>
      <h1 className="display mt-2 text-4xl font-bold uppercase">
        Profile<span className="text-lime-600">.</span>
      </h1>
      <p className="mt-2 text-sm text-neutral-500">Manage the name and password attached to this admin account.</p>

      <div className="mt-7 flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-lime-300 text-2xl font-bold text-neutral-950">
          {initials || "RN"}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="display text-2xl font-bold">{displayName}</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-lime-300">
              <ShieldCheck size={11} /> Admin
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500"><Mail size={13} /> {user.email}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500"><CalendarDays size={13} /> Joined {joined}</p>
        </div>
      </div>

      <div className="mt-5">
        <ProfileForms user={user} />
      </div>
    </div>
  );
}
