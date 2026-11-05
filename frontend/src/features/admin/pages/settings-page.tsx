import { Boxes, LogOut, Mail, RefreshCw, ShieldCheck, Store, Truck } from "lucide-react";
import { useAdminSettings } from "@/features/admin/hooks/use-admin-queries";
import { useLogout } from "@/features/auth/hooks/use-auth-mutations";
import { formatNPR } from "@/shared/lib/utils";

export function SettingsPage() {
  const settings = useAdminSettings();
  const logout = useLogout({ redirectTo: "/admin/login" });
  const data = settings.data;

  const signOut = () => logout.mutate();

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Configuration</p>
          <h1 className="display mt-2 text-4xl font-bold uppercase">
            Settings<span className="text-lime-600">.</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Store profile, delivery rates and the account running this workspace.</p>
        </div>
        <button
          type="button"
          onClick={() => settings.refetch()}
          disabled={settings.isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-bold text-neutral-700 transition hover:border-neutral-950 disabled:opacity-50"
        >
          <RefreshCw size={14} className={settings.isFetching ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {settings.isError && (
        <div className="mt-6 rounded-2xl border border-dashed border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
          Settings could not load. Your session may have expired — refresh the page to sign in again.
        </div>
      )}

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime-100 text-lime-700"><Store size={18} /></span>
            <div>
              <h2 className="font-bold">Store profile</h2>
              <p className="text-xs text-neutral-400">How the storefront identifies itself</p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-xs">
            {[
              ["Store name", data?.storeName ?? "—"],
              ["Currency", data?.currency ?? "—"],
              ["Ships from", data?.shipsFrom ?? "—"],
              ["Admin email", data?.adminEmail ?? "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                <dt className="text-neutral-500">{label}</dt>
                <dd className="text-right font-semibold">{settings.isLoading ? "—" : value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 rounded-xl bg-neutral-50 px-4 py-3 text-[11px] leading-5 text-neutral-500">
            Store name, currency and origin are fixed in the server configuration.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><Truck size={18} /></span>
            <div>
              <h2 className="font-bold">Delivery</h2>
              <p className="text-xs text-neutral-400">Flat rates charged at checkout</p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-xs">
            {[
              ["Damauli & Pokhara area", data ? formatNPR(data.shipping.valley) : "—"],
              ["Outside the area", data ? formatNPR(data.shipping.outside) : "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                <dt className="text-neutral-500">{label}</dt>
                <dd className="text-right font-semibold">{settings.isLoading ? "—" : value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 rounded-xl bg-neutral-50 px-4 py-3 text-[11px] leading-5 text-neutral-500">
            Delivery charges are applied by the API when an order is created, so they cannot be changed from the browser.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700"><Boxes size={18} /></span>
            <div>
              <h2 className="font-bold">Inventory</h2>
              <p className="text-xs text-neutral-400">Thresholds and catalogue size</p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-xs">
            {[
              ["Limited-stock threshold", data ? `${data.lowStockThreshold} units` : "—"],
              ["Products", data ? String(data.counts.products) : "—"],
              ["Variants", data ? String(data.counts.variants) : "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                <dt className="text-neutral-500">{label}</dt>
                <dd className="text-right font-semibold">{settings.isLoading ? "—" : value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck size={18} /></span>
            <div>
              <h2 className="font-bold">Account & access</h2>
              <p className="text-xs text-neutral-400">The session protecting this dashboard</p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-xs">
            {[
              ["Signed in as", data?.adminEmail ?? "—"],
              ["Role", "Administrator"],
              ["Registered customers", data ? String(data.counts.customers) : "—"],
              ["Orders recorded", data ? String(data.counts.orders) : "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                <dt className="text-neutral-500">{label}</dt>
                <dd className="text-right font-semibold">{settings.isLoading ? "—" : value}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            onClick={signOut}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 px-5 py-3 text-xs font-bold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={14} /> Sign out of admin
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-5">
        <Mail size={16} className="mt-0.5 shrink-0 text-neutral-400" />
        <p className="text-xs leading-6 text-neutral-500">
          Need to change shipping rates or the low-stock threshold? Update <code className="rounded bg-neutral-100 px-1.5 py-0.5">backend/src/config.ts</code> and restart the API. These values are shared by the storefront checkout and the admin dashboard.
        </p>
      </div>
    </div>
  );
}
