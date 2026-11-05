import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn } from "lucide-react";
import { useLogin, useLogout } from "@/features/auth/hooks/use-auth-mutations";
import { authSchema, type AuthValues } from "@/features/auth/schemas/auth-schema";
import { Button } from "@/shared/components/ui/button";
import { FormField } from "@/shared/components/ui/form-field";
import { Input } from "@/shared/components/ui/input";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const login = useLogin();
  const logout = useLogout();
  const [roleError, setRoleError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "admin@rivalnepal.com", password: "" },
  });

  const submit = handleSubmit((values) =>
    login.mutate(
      { email: values.email.trim(), password: values.password },
      {
        onSuccess: async (user) => {
          if (user.role !== "ADMIN") {
            setRoleError("This account does not have admin access.");
            await logout.mutateAsync();
            return;
          }
          setRoleError("");
          navigate(from, { replace: true });
        },
      },
    ),
  );

  const error = roleError || (login.error instanceof Error ? login.error.message : "");
  const pending = login.isPending;

  return (
    <div className="grid min-h-screen bg-[#f2f3ee] lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-[#141510] p-12 text-white lg:flex">
        <Link to="/" className="display text-2xl font-bold tracking-[-.08em]">
          RIVAL<span className="text-lime-300">®</span>
          <span className="ml-1 text-[9px] tracking-widest">ADMIN</span>
        </Link>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/40">Store management</p>
          <h1 className="display mt-4 text-6xl font-bold uppercase leading-[.85]">
            Run the<br />
            <span className="text-lime-300">store.</span>
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-6 text-white/55">
            Sign in to manage products, orders, inventory and the storefront catalog.
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-white/30">Rival Nepal</p>
      </div>

      <div className="flex items-center justify-center px-5 py-12">
        <form onSubmit={submit} noValidate className="w-full max-w-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Admin access</p>
          <h2 className="display mt-2 text-4xl font-bold uppercase">Log in<span className="text-lime-600">.</span></h2>
          <p className="mt-3 text-sm text-neutral-500">Use your RIVAL admin account.</p>

          <div className="mt-8 space-y-5">
            <FormField id="email" label="Email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                aria-invalid={Boolean(errors.email)}
                className="rounded-xl border-neutral-200 bg-white focus-visible:border-lime-400"
                {...register("email")}
              />
            </FormField>
            <FormField id="password" label="Password" error={errors.password?.message}>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                className="rounded-xl border-neutral-200 bg-white focus-visible:border-lime-400"
                {...register("password")}
              />
            </FormField>
          </div>

          {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={pending}>
            <LogIn size={16} /> {pending ? "Signing in…" : "Sign in"}
          </Button>

          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black">
            <ArrowLeft size={14} /> Back to store
          </Link>
        </form>
      </div>
    </div>
  );
}
