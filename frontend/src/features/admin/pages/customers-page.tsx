import { useMemo, useState } from "react";
import { Mail, Phone, RefreshCw, Search, UserCheck, Users } from "lucide-react";
import { useAdminCustomers } from "@/features/admin/hooks/use-admin-queries";
import { formatNPR } from "@/shared/lib/utils";

export function CustomersPage() {
  const [search, setSearch] = useState("");
  const customers = useAdminCustomers();

  const rows = customers.data ?? [];
  const registered = rows.filter((row) => row.registered).length;
  const guests = rows.length - registered;
  const lifetime = rows.reduce((total, row) => total + row.spent, 0);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      [row.name, row.email ?? "", row.phone ?? ""].some((value) => value.toLowerCase().includes(term))
    );
  }, [rows, search]);

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Relationships</p>
          <h1 className="display mt-2 text-4xl font-bold uppercase">
            Customers<span className="text-lime-600">.</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Registered accounts and guest buyers, ranked by lifetime spend.</p>
        </div>
        <button
          type="button"
          onClick={() => customers.refetch()}
          disabled={customers.isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-bold text-neutral-700 transition hover:border-neutral-950 disabled:opacity-50"
        >
          <RefreshCw size={14} className={customers.isFetching ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total customers", value: rows.length, icon: Users, tone: "bg-neutral-100 text-neutral-700" },
          { label: "Registered accounts", value: registered, icon: UserCheck, tone: "bg-lime-100 text-lime-700" },
          { label: "Guest buyers", value: guests, icon: Phone, tone: "bg-blue-50 text-blue-700" },
          { label: "Lifetime spend", value: formatNPR(lifetime), icon: Mail, tone: "bg-emerald-50 text-emerald-700" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500">{label}</p>
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}><Icon size={17} /></span>
            </div>
            <p className="display mt-4 text-3xl font-bold">{customers.isLoading ? "—" : value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
        <div className="relative mb-5 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email or phone"
            aria-label="Search customers"
            className="w-full rounded-full border-neutral-200 py-2.5 pl-9 pr-4 text-xs focus:border-lime-400 focus:ring-lime-300"
          />
        </div>

        {customers.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        ) : customers.isError ? (
          <div className="rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center">
            <p className="text-sm font-bold">Customers could not load.</p>
            <p className="mt-1 text-xs text-neutral-500">Your session may have expired. Try refreshing.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 px-6 py-14 text-center">
            <p className="text-sm font-bold">{rows.length ? "No customers match that search." : "No customers yet."}</p>
            <p className="mt-1 text-xs text-neutral-500">
              {rows.length ? "Try another name, email or phone." : "Accounts and guest orders will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead className="border-b text-[10px] uppercase tracking-widest text-neutral-400">
                <tr>
                  {["Customer", "Phone", "Type", "Orders", "Spent", "Joined", "Last order"].map((heading) => (
                    <th className="pb-3 font-semibold" key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/70">
                    <td className="py-3.5">
                      <p className="font-bold">{row.name}</p>
                      <p className="mt-0.5 text-[10px] text-neutral-400">{row.email ?? "No email"}</p>
                    </td>
                    <td className="py-3.5 text-neutral-600">{row.phone ?? "—"}</td>
                    <td className="py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${row.registered ? "bg-lime-100 text-lime-700" : "bg-neutral-100 text-neutral-500"}`}>
                        {row.registered ? "Registered" : "Guest"}
                      </span>
                    </td>
                    <td className="py-3.5 font-semibold">{row.orders}</td>
                    <td className="py-3.5 font-semibold">{formatNPR(row.spent)}</td>
                    <td className="py-3.5 text-neutral-500">{row.joined}</td>
                    <td className="py-3.5 text-neutral-500">{row.lastOrder ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
