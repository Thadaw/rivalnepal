import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { getMe, logout } from "@/features/auth/api/auth.api";
import { useCartStore } from "@/features/cart/store/cart-store";
import { BRAND } from "@/shared/lib/brand";
import { cn } from "@/shared/lib/utils";
import { PageContainer } from "./PageContainer";

const navItems = [
  {
    label: "Shop",
    to: "/shop",
    menu: [
      { label: "All pieces", to: "/shop" },
      { label: "Tees & graphics", to: "/shop?category=T-Shirts" },
      { label: "Hoodies & fleece", to: "/shop?category=Hoodies" },
      { label: "Outerwear", to: "/shop?category=Jackets" },
      { label: "Accessories", to: "/shop?category=Accessories" },
    ],
  },
  {
    label: "Collections",
    to: "/categories",
    menu: [
      { label: "All collections", to: "/categories" },
      { label: "The essentials", to: "/shop?category=T-Shirts" },
      { label: "Fleece programme", to: "/shop?category=Hoodies" },
      { label: "Outerwear", to: "/shop?category=Jackets" },
      { label: "Small goods", to: "/shop?category=Accessories" },
    ],
  },
  { label: "Lookbook", to: "/lookbook" },
  { label: "Our story", to: "/story" },
];

export function Navbar({ variant = "solid" }: { variant?: "transparent" | "solid" }) {
  const count = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
  });

  const displayName = user?.name?.trim() || user?.email.split("@")[0] || "";
  const nameParts = displayName.split(/\s+/);
  const initials = (
    nameParts.length > 1 ? nameParts.map((part) => part[0]).slice(0, 2).join("") : displayName.slice(0, 2)
  ).toUpperCase();

  const transparent = variant === "transparent" && !scrolled && !open;
  const position =
    variant === "transparent"
      ? scrolled || open
        ? "fixed inset-x-0 top-0"
        : "absolute inset-x-0 top-0"
      : "sticky top-0";

  async function signOut() {
    try {
      await logout();
    } finally {
      queryClient.removeQueries({ queryKey: ["auth"] });
      setOpen(false);
      setProfileOpen(false);
      navigate("/");
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!profileOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) setProfileOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const isCurrent = (to: string) => (to.startsWith("/shop") ? location.pathname === "/shop" : location.pathname === to);

  return (
    <header
      className={cn(
        position,
        "z-40 text-chalk transition-colors duration-300",
        transparent ? "bg-transparent" : "border-b border-chalk/10 bg-black",
      )}
    >
      <PageContainer className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 md:h-[76px]">
        <Link to="/" className="group flex items-baseline gap-1" aria-label={`${BRAND.name} home`}>
          <span className="display text-[22px] font-bold uppercase leading-none tracking-[-.03em] md:text-[26px]">
            {BRAND.name}
          </span>
          <span className="text-[9px] font-medium text-chalk/50">{BRAND.mark}</span>
        </Link>

        <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label="Store">
          {navItems.map((item) =>
            item.menu ? (
              <div key={item.label} className="group relative">
                <Link
                  to={item.to}
                  aria-current={isCurrent(item.to) ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-[9px] font-semibold uppercase tracking-[.22em] transition",
                    isCurrent(item.to) ? "text-chalk" : "text-chalk/65 hover:text-chalk",
                  )}
                >
                  {item.label}
                  <ChevronDown size={11} className="transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full w-60 origin-top border border-chalk/15 bg-black p-2 opacity-0 shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {item.menu.map((entry) => (
                    <Link
                      key={entry.label}
                      to={entry.to}
                      className="flex items-center justify-between px-3 py-2.5 text-[9px] font-medium uppercase tracking-[.16em] text-chalk/70 transition hover:bg-chalk hover:text-black"
                    >
                      {entry.label}
                      <ArrowUpRight size={12} />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                aria-current={isCurrent(item.to) ? "page" : undefined}
                className="px-4 py-2 text-[9px] font-semibold uppercase tracking-[.22em] text-chalk/65 transition hover:text-chalk"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center justify-end gap-1">
          <Link
            to="/shop"
            aria-label="Search the collection"
            className="hidden h-10 w-10 place-items-center text-chalk/70 transition hover:text-chalk sm:grid"
          >
            <Search size={17} />
          </Link>

          {user ? (
            <div ref={profileRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="flex h-10 items-center gap-2 px-2 text-chalk/70 transition hover:text-chalk"
              >
                <span className="grid h-7 w-7 place-items-center border border-chalk/25 text-[9px] font-semibold tracking-[.08em]">
                  {initials || BRAND.name.slice(0, 2)}
                </span>
                <ChevronDown size={12} className={cn("transition-transform", profileOpen && "rotate-180")} />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+10px)] w-64 border border-chalk/15 bg-black shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)]"
                >
                  <div className="border-b border-chalk/10 px-4 py-4">
                    <p className="truncate text-xs font-semibold uppercase tracking-[.12em]">{displayName}</p>
                    <p className="mt-1 truncate text-[11px] text-chalk/45">{user.email}</p>
                    <span className="mt-2 inline-block border border-chalk/20 px-2 py-0.5 text-[8px] uppercase tracking-[.18em] text-chalk/60">
                      {user.role === "ADMIN" ? "Admin" : "Member"}
                    </span>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/account"
                      role="menuitem"
                      className="flex items-center gap-2.5 px-3 py-2.5 text-[9px] font-medium uppercase tracking-[.16em] text-chalk/70 transition hover:bg-chalk hover:text-black"
                    >
                      <UserRound size={14} /> Your account
                    </Link>
                    <Link
                      to="/track"
                      role="menuitem"
                      className="flex items-center gap-2.5 px-3 py-2.5 text-[9px] font-medium uppercase tracking-[.16em] text-chalk/70 transition hover:bg-chalk hover:text-black"
                    >
                      <PackageSearch size={14} /> Track order
                    </Link>
                    {user.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        role="menuitem"
                        className="flex items-center gap-2.5 px-3 py-2.5 text-[9px] font-medium uppercase tracking-[.16em] text-chalk/70 transition hover:bg-chalk hover:text-black"
                      >
                        <LayoutDashboard size={14} /> Admin dashboard
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-chalk/10 p-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={signOut}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-[9px] font-medium uppercase tracking-[.16em] text-chalk/55 transition hover:bg-chalk hover:text-black"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              state={{ from: location.pathname }}
              aria-label="Account"
              className="hidden h-10 w-10 place-items-center text-chalk/70 transition hover:text-chalk sm:grid"
            >
              <UserRound size={17} />
            </Link>
          )}

          <Link
            to="/cart"
            className="relative grid h-10 w-10 place-items-center text-chalk/80 transition hover:text-chalk"
            aria-label={`Shopping bag${count ? `, ${count} items` : ""}`}
          >
            <ShoppingBag size={17} />
            {count > 0 && (
              <span className="absolute -right-0.5 top-1 grid h-[18px] min-w-[18px] place-items-center bg-chalk px-1 text-[9px] font-bold text-black">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center text-chalk transition hover:text-chalk/70 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu size={20} />
          </button>
        </div>
      </PageContainer>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Store menu"
          className="fixed inset-0 z-50 bg-black lg:hidden"
        >
          <div className="flex h-full flex-col">
            <PageContainer className="flex h-16 items-center justify-between border-b border-chalk/10">
              <span className="display text-[22px] font-bold uppercase leading-none">{BRAND.name}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center text-chalk"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </PageContainer>

            <nav className="flex-1 overflow-y-auto py-8" aria-label="Mobile store">
              <PageContainer className="grid">
                {navItems.map((item, index) => (
                  <div key={item.label} className="border-b border-chalk/10">
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      aria-current={location.pathname === item.to ? "page" : undefined}
                      className="flex items-baseline justify-between gap-4 py-5"
                    >
                      <span className="display text-[clamp(1.8rem,8vw,2.6rem)] font-semibold uppercase leading-none">
                        {item.label}
                      </span>
                      <span className="text-[10px] tracking-[.2em] text-chalk/35">0{index + 1}</span>
                    </Link>
                    {item.menu && (
                      <div className="grid gap-1 pb-4 pl-1">
                        {item.menu.map((entry) => (
                          <Link
                            key={entry.label}
                            to={entry.to}
                            onClick={() => setOpen(false)}
                            className="py-1.5 text-[10px] font-medium uppercase tracking-[.16em] text-chalk/50"
                          >
                            {entry.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  to="/track"
                  onClick={() => setOpen(false)}
                  aria-current={location.pathname === "/track" ? "page" : undefined}
                  className="border-b border-chalk/10 py-5"
                >
                  <span className="display text-[clamp(1.8rem,8vw,2.6rem)] font-semibold uppercase leading-none">
                    Track order
                  </span>
                </Link>
              </PageContainer>
            </nav>

            <PageContainer className="border-t border-chalk/10 py-5">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold uppercase tracking-[.14em]">{displayName}</p>
                    <p className="truncate text-[10px] text-chalk/40">{user.email}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <Link to="/account" onClick={() => setOpen(false)} className="text-[9px] uppercase tracking-[.18em] text-chalk/70">
                      Account
                    </Link>
                    <button
                      type="button"
                      onClick={signOut}
                      className="text-[9px] uppercase tracking-[.18em] text-chalk/50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="border border-chalk/25 py-3 text-center text-[9px] font-medium uppercase tracking-[.18em] text-chalk"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="bg-chalk py-3 text-center text-[9px] font-medium uppercase tracking-[.18em] text-black"
                  >
                    Create account
                  </Link>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between text-[9px] uppercase tracking-[.18em] text-chalk/45">
                <span>Bag · {count}</span>
                <span>{BRAND.city}</span>
              </div>
            </PageContainer>
          </div>
        </div>
      )}
    </header>
  );
}
