import { Suspense, useEffect, useRef, useState } from "react";

import { NavLink, Outlet, Link, Navigate, useLocation } from "react-router-dom";
import { BarChart3, Boxes, ChevronDown, LayoutDashboard, LogOut, Mail, Palette, Settings, Shirt, ShoppingCart, Store, UserRound, Users } from "lucide-react";
import { useLogout } from "@/features/auth/hooks/use-auth-mutations";
import { useSession } from "@/features/auth/hooks/use-session";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Shirt },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/designs", label: "Designs", icon: Palette },
  { to: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/profile", label: "Profile", icon: UserRound },
];
export function AdminLayout() {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { data: user, isLoading } = useSession();
  const logout = useLogout({ redirectTo: "/admin/login" });

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

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

  const signOut = () => logout.mutate();

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center bg-[#f2f3ee] text-xs font-bold uppercase tracking-widest text-neutral-400">Checking session…</div>;
  }
  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const label = user.name?.trim() || user.email.split("@")[0];
  const parts = label.split(/\s+/);
  const initials = (parts.length > 1 ? parts.map((part) => part[0]).slice(0, 2).join("") : label.slice(0, 2)).toUpperCase();

  return <div className="min-h-screen bg-[#f2f3ee] md:flex">
    <aside className="flex w-full flex-col bg-[#141510] px-5 py-6 text-white md:fixed md:inset-y-0 md:w-64">
      <Link to="/" className="display text-2xl font-bold tracking-[-.08em]">RIVAL<span className="text-lime-300">®</span><span className="ml-1 tracking-widest tracking-widest">ADMIN</span></Link>
      <p className="mb-4 mt-12 font-bold uppercase tracking-[.2em] font-bold uppercase tracking-[.2em] text-white/35">Workspace</p>
      <nav className="flex gap-1 overflow-x-auto md:flex-col">{links.map(({to,label,icon:Icon,end})=><NavLink key={to} to={to} end={end} className={({isActive})=>`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold transition ${isActive?"bg-lime-300 text-black":"text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon size={16}/>{label}</NavLink>)}</nav>
      <div className="mt-8 hidden rounded-xl border border-white/10 p-4 md:mt-auto md:block"><p className="text-xs font-bold">Rival Nepal</p><p className="mt-1 truncate text-[10px] text-white/40"><Link to="/admin/profile" className="hover:text-white">{user.email}</Link></p><div className="mt-4 flex items-center justify-between gap-2"><Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-lime-300">Storefront</Link><button type="button" onClick={signOut} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white">Log out <LogOut size={12}/></button></div></div>
    </aside>
    <div className="min-w-0 flex-1 md:ml-64"><header className="flex h-[72px] items-center justify-between border-b border-black/5 bg-white px-6 md:px-10"><div><p className="text-xs font-bold">Store administration</p><p className="mt-1 text-[10px] text-neutral-400">Manage your RIVAL store</p></div><div className="flex items-center gap-3"><div ref={profileRef} className="relative"><button type="button" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen} aria-haspopup="menu" className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-3 transition hover:border-neutral-300"><span className="grid h-8 w-8 place-items-center rounded-full bg-lime-300 text-xs font-bold">{initials}</span><span className="hidden max-w-[150px] truncate text-xs font-semibold text-neutral-600 sm:block">{label}</span><ChevronDown size={14} className={`text-neutral-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}/></button>{profileOpen && <div role="menu" className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_24px_50px_-20px_rgba(0,0,0,.35)]"><div className="border-b border-neutral-100 px-4 py-3"><p className="truncate text-sm font-bold">{label}</p><p className="mt-0.5 truncate text-[11px] text-neutral-400">{user.email}</p><span className="mt-2 inline-block rounded-full bg-lime-300 px-2 py-0.5 tracking-widest font-bold uppercase tracking-widest">Admin</span></div><div className="p-2"><Link to="/admin/profile" role="menuitem" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-600 transition hover:bg-neutral-100 hover:text-black"><UserRound size={15}/> Profile</Link><Link to="/admin/settings" role="menuitem" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-600 transition hover:bg-neutral-100 hover:text-black"><Settings size={15}/> Settings</Link><Link to="/" role="menuitem" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-600 transition hover:bg-neutral-100 hover:text-black"><Store size={15}/> View storefront</Link></div><div className="border-t border-neutral-100 p-2"><button type="button" role="menuitem" onClick={signOut} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-500 transition hover:bg-red-50 hover:text-red-600"><LogOut size={15}/> Sign out</button></div></div>}</div></div></header><main className="p-5 md:p-10"><Suspense fallback={<p className="py-20 text-center text-[10px] uppercase tracking-[.24em] text-black/30">Loading…</p>}><Outlet/></Suspense></main></div>
  </div>;
}
