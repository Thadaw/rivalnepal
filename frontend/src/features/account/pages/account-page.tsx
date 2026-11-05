import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Package,
  PackageSearch,
  Settings,
} from "lucide-react";
import { useLogout } from "@/features/auth/hooks/use-auth-mutations";
import { useSession } from "@/features/auth/hooks/use-session";
import { useMyOrders } from "@/features/account/hooks/use-my-orders";
import { ProfileForms } from "@/features/account/components/profile-forms";
import { ORDER_STATUS_LABEL } from "@/features/orders/types";
import { Breadcrumbs } from "@/shared/components/layout/Breadcrumbs";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn, formatNPR } from "@/shared/lib/utils";

type Section = "overview" | "orders" | "addresses" | "settings";

const sections: { key: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "orders", label: "Orders", icon: Package },
  { key: "addresses", label: "Delivery", icon: MapPin },
  { key: "settings", label: "Account settings", icon: Settings },
];

export function AccountPage() {
  const [section, setSection] = useState<Section>("overview");
  const { data: user, isLoading } = useSession();
  const orders = useMyOrders(Boolean(user));
  const logout = useLogout({ redirectTo: "/" });

  const signOut = () => logout.mutate();

  if (isLoading) {
    return (
      <PageContainer className="py-16 lg:py-24">
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-32 bg-ash" />
          <div className="h-16 w-72 bg-ash" />
          <div className="h-48 bg-ash" />
        </div>
      </PageContainer>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: "/account" }} />;
  }

  const orderList = orders.data ?? [];
  const latestOrders = orderList.slice(0, 3);

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
    <div className="bg-chalk">
      <PageContainer className="border-b border-black/10 pb-10 pt-8 md:pb-14 md:pt-12">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Account" }]} />
        <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-black/40">Your account — {user.role === "ADMIN" ? "Admin" : "Member"}</p>
            <h1 className="mt-4 text-[clamp(2.8rem,7vw,6rem)] font-bold uppercase leading-[.84]">
              {displayName}
            </h1>
            <p className="mt-4 max-w-md text-[13px] leading-6 text-black/55">
              Manage your details, review orders and track recent purchases.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/track">
                <PackageSearch size={14} /> Track order
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/shop">
                Continue shopping <ArrowUpRight size={14} />
              </Link>
            </Button>
          </div>
        </div>
      </PageContainer>

      <PageContainer className="py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
          <aside>
            <div className="flex gap-2 overflow-x-auto border-b border-black/10 pb-4 lg:hidden">
              {sections.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSection(item.key)}
                    aria-pressed={section === item.key}
                    className={cn(
                      "flex shrink-0 items-center gap-2 border px-3 py-2 text-[9px] font-semibold uppercase tracking-[.14em] transition",
                      section === item.key
                        ? "border-black bg-black text-chalk"
                        : "border-black/15 text-black/55",
                    )}
                  >
                    <Icon size={13} /> {item.label}
                  </button>
                );
              })}
            </div>

            <div className="hidden border border-black/10 bg-white lg:block">
              <div className="border-b border-black/10 p-5">
                <span className="grid h-14 w-14 place-items-center bg-black text-lg font-bold text-chalk">
                  {initials || "NX"}
                </span>
                <p className="mt-4 truncate text-[13px] font-semibold uppercase tracking-[.06em]">{displayName}</p>
                <p className="mt-1 truncate text-[11px] text-black/45">{user.email}</p>
              </div>
              <nav className="p-2" aria-label="Account">
                {sections.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSection(item.key)}
                      aria-pressed={section === item.key}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-3 text-left text-[10px] font-medium uppercase tracking-[.14em] transition",
                        section === item.key
                          ? "bg-black text-chalk"
                          : "text-black/55 hover:bg-black/5 hover:text-black",
                      )}
                    >
                      <Icon size={15} /> {item.label}
                    </button>
                  );
                })}
              </nav>
              <div className="border-t border-black/10 p-2">
                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left text-[10px] font-medium uppercase tracking-[.14em] text-black/45 transition hover:bg-black/5 hover:text-black"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            {section === "overview" && (
              <div className="space-y-5">
                <div className="flex flex-col gap-5 border border-black/10 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
                  <span className="grid h-20 w-20 shrink-0 place-items-center bg-black text-2xl font-bold text-chalk">
                    {initials || "NX"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xl font-bold uppercase tracking-[.04em]">{displayName}</p>
                      <span className="border border-black/15 px-2.5 py-1 text-[8px] font-medium uppercase tracking-[.18em] text-black/50">
                        {user.role === "ADMIN" ? "Admin" : "Customer"}
                      </span>
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] text-black/55">
                      <Mail size={13} /> {user.email}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] text-black/55">
                      <CalendarDays size={13} /> Joined {joined}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSection("settings")}
                    className="inline-flex shrink-0 items-center justify-center gap-2 border border-black/20 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[.16em] transition hover:border-black hover:bg-black hover:text-chalk"
                  >
                    Edit profile <ArrowUpRight size={13} />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      label: "Orders",
                      value: orders.isLoading ? "…" : String(orderList.length),
                      note: orderList.length ? "Placed with this email" : "No orders yet",
                    },
                    { label: "Delivery", value: "COD", note: "Cash on delivery nationwide" },
                    { label: "Member since", value: new Date(user.createdAt).getFullYear().toString(), note: "RIVAL circle" },
                  ].map((stat) => (
                    <div key={stat.label} className="border border-black/10 bg-white p-5">
                      <p className="eyebrow text-black/35">{stat.label}</p>
                      <p className="mt-3 text-3xl font-bold">{stat.value}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[.12em] text-black/35">{stat.note}</p>
                    </div>
                  ))}
                </div>

                <div className="border border-black/10 bg-white">
                  <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                    <h2 className="text-[11px] font-semibold uppercase tracking-[.18em]">Recent orders</h2>
                    <button
                      type="button"
                      onClick={() => setSection("orders")}
                      className="text-[9px] uppercase tracking-[.16em] text-black/45 underline underline-offset-4 hover:text-black"
                    >
                      View all
                    </button>
                  </div>
                  {orders.isLoading ? (
                    <div className="space-y-3 px-5 py-6">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : latestOrders.length ? (
                    <ul className="divide-y divide-black/10">
                      {latestOrders.map((order) => (
                        <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-[.06em]">{order.id}</p>
                            <p className="mt-1 text-[10px] uppercase tracking-[.12em] text-black/40">
                              {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                              {" · "}
                              {order.items.reduce((sum, item) => sum + item.qty, 0)} pcs
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={order.status === "cancelled" ? "destructive" : "outline"}>
                              {ORDER_STATUS_LABEL[order.status]}
                            </Badge>
                            <span className="text-[12px] font-semibold">{formatNPR(order.total)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-5 py-10 text-center">
                      <Package size={20} className="mx-auto text-black/25" />
                      <p className="mt-3 text-[11px] uppercase tracking-[.14em] text-black/45">
                        No orders linked to this account yet.
                      </p>
                      <Link
                        to="/shop"
                        className="link-underline mt-4 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.16em]"
                      >
                        Start with the collection <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {section === "orders" && (
              <div className="border border-black/10 bg-white">
                <div className="border-b border-black/10 px-6 py-5">
                  <h2 className="text-lg font-bold uppercase">Orders</h2>
                  <p className="mt-1 text-[11px] text-black/45">
                    Orders placed with {user.email} appear here, newest first.
                  </p>
                </div>
                {orders.isLoading ? (
                  <div className="space-y-3 p-6">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                  </div>
                ) : orderList.length ? (
                  <ul className="divide-y divide-black/10">
                    {orderList.map((order) => (
                      <li key={order.id} className="px-6 py-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[.06em]">{order.id}</p>
                            <p className="mt-1 text-[10px] uppercase tracking-[.12em] text-black/40">
                              {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                          </div>
                          <Badge variant={order.status === "cancelled" ? "destructive" : "outline"}>
                            {ORDER_STATUS_LABEL[order.status]}
                          </Badge>
                        </div>
                        <ul className="mt-3 space-y-1 text-[11px] text-black/55">
                          {order.items.map((item, index) => (
                            <li key={`${item.name}-${index}`}>
                              {item.qty} × {item.name} — {item.color} / {item.size}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3">
                          <span className="text-[9px] uppercase tracking-[.14em] text-black/40">
                            Cash on delivery
                          </span>
                          <span className="text-[12px] font-semibold">{formatNPR(order.total)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                    <Package size={24} className="text-black/25" />
                    <p className="mt-4 text-[13px] font-semibold uppercase tracking-[.08em]">No orders yet</p>
                    <p className="mt-2 max-w-sm text-[11px] leading-5 text-black/45">
                      Check out with {user.email} and the order will show up here automatically.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <Button asChild size="sm">
                        <Link to="/shop">Shop the edit</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/track">Track an order</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {section === "addresses" && (
              <div className="space-y-5">
                <div className="border border-black/10 bg-white p-6 md:p-8">
                  <div className="flex flex-col justify-between gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-lg font-bold uppercase">Delivery details</h2>
                      <p className="mt-1 text-[11px] text-black/45">
                        Delivery details are entered at checkout for each order. They aren't stored on your account.
                      </p>
                    </div>
                    <span className="text-[9px] uppercase tracking-[.14em] text-black/45">Entered at checkout</span>
                  </div>
                  <div className="py-14 text-center">
                    <MapPin size={22} className="mx-auto text-black/25" />
                    <p className="mt-3 text-[12px] font-semibold uppercase tracking-[.08em]">Addresses aren't stored.</p>
                    <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-black/45">
                      Enter your delivery details at checkout; they're used to fulfil that order only.
                    </p>
                  </div>
                </div>
                <p className="border border-black/10 bg-white p-5 text-[10px] uppercase leading-5 tracking-[.12em] text-black/40">
                  Cash on delivery is available nationwide. We call to confirm every order before it ships.
                </p>
              </div>
            )}

            {section === "settings" && (
              <div className="space-y-5">
                <div className="border border-black/10 bg-white p-6 md:p-8">
                  <h2 className="text-lg font-bold uppercase">Account settings</h2>
                  <p className="mt-1 text-[11px] text-black/45">
                    Update your display name or change the password used to sign in.
                  </p>
                </div>
                <ProfileForms user={user} />
                <div className="border border-black/10 bg-white p-6 md:p-8">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-[11px] font-semibold uppercase tracking-[.18em]">Session</h2>
                      <p className="mt-1 text-[11px] text-black/45">Sign out of this device. Your bag stays saved.</p>
                    </div>
                    <button
                      type="button"
                      onClick={signOut}
                      className="inline-flex items-center justify-center gap-2 border border-black/20 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[.16em] transition hover:border-error hover:bg-error-light hover:text-error"
                    >
                      <LogOut size={13} /> Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
