import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLogin, useRegister } from "@/features/auth/hooks/use-auth-mutations";
import { authSchema, type AuthValues } from "@/features/auth/schemas/auth-schema";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { BRAND } from "@/shared/lib/brand";

type AuthMode = "login" | "signup";

const AUTH_IMAGE =
  "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1400&q=88";

export function AuthPage({ mode }: { mode: AuthMode }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const active = isSignup ? registerMutation : loginMutation;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = handleSubmit((values) =>
    active.mutate(
      { email: values.email.trim(), password: values.password },
      { onSuccess: () => navigate(from, { replace: true }) },
    ),
  );

  const error = active.error instanceof Error ? active.error.message : null;
  const pending = active.isPending;

  return (
    <section className="grid min-h-[calc(100svh-76px)] bg-white lg:grid-cols-2">
      <div className="relative min-h-[320px] overflow-hidden bg-black lg:min-h-0">
        <img
          src={AUTH_IMAGE}
          alt="RIVAL campaign portrait"
          className="absolute inset-0 h-full w-full object-cover object-[center_25%] mono"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/20" />
        <div className="relative flex h-full flex-col justify-between p-6 text-chalk md:p-10">
          <Link to="/" className="flex w-fit items-baseline gap-1" aria-label={`${BRAND.name} home`}>
            <span className="display text-[22px] font-bold uppercase leading-none">{BRAND.name}</span>
            <span className="text-[9px] text-chalk/50">{BRAND.mark}</span>
          </Link>
          <div className="max-w-md">
            <p className="eyebrow text-chalk/50">Private access</p>
            <p className="mt-3 text-[clamp(1.8rem,3.4vw,3rem)] font-bold uppercase leading-[.9]">
              The inner circle.
            </p>
            <p className="mt-4 text-[12px] leading-6 text-chalk/55">
              Early access, private fittings and the pieces that never reach the floor.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-14 sm:px-10 lg:px-14">
        <div className="w-full max-w-[420px]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[.2em] text-black/45 transition hover:text-black"
          >
            <ArrowLeft size={13} /> Back to store
          </Link>

          <p className="mt-10 eyebrow text-black/40">{isSignup ? "Create account" : "Welcome back"}</p>
          <h1 className="mt-3 text-[clamp(2.8rem,5vw,4.4rem)] font-bold uppercase leading-[.86]">
            {isSignup ? (
              <>
                Join the
                <br />
                circle.
              </>
            ) : (
              <>Log in.</>
            )}
          </h1>
          <p className="mt-5 max-w-sm text-[12px] leading-6 text-black/55">
            {isSignup
              ? "Create your account to check out faster, track orders and receive private drop access."
              : "Sign in with your email and password to pick up where you left off."}
          </p>

          <form onSubmit={submit} noValidate className="mt-9 grid gap-5">
            <div>
              <Label htmlFor="email" className="text-black/45">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                className="mt-2"
                {...register("email")}
              />
              {errors.email && <p className="mt-1.5 text-[11px] text-error">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password" className="text-black/45">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder={isSignup ? "At least 8 characters" : "Your password"}
                aria-invalid={Boolean(errors.password)}
                className="mt-2"
                {...register("password")}
              />
              {errors.password && <p className="mt-1.5 text-[11px] text-error">{errors.password.message}</p>}
            </div>

            {error && <Alert variant="destructive">{error}</Alert>}

            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending ? "Please wait…" : isSignup ? "Create account" : "Log in"}
              {!pending && <ArrowUpRight size={16} />}
            </Button>
          </form>

          <p className="mt-7 border-t border-black/10 pt-6 text-[11px] text-black/50">
            {isSignup ? "Already have an account?" : `New to ${BRAND.name}?`}{" "}
            <Link
              to={isSignup ? "/login" : "/signup"}
              state={{ from }}
              className="font-semibold text-black underline underline-offset-4"
            >
              {isSignup ? "Log in" : "Create an account"}
            </Link>
          </p>
          <p className="mt-3 text-[9px] uppercase leading-5 tracking-[.16em] text-black/30">
            By continuing you agree to our{" "}
            <Link to="/policies/terms" className="underline underline-offset-2 hover:text-black">
              terms
            </Link>{" "}
            and{" "}
            <Link to="/policies/privacy" className="underline underline-offset-2 hover:text-black">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
