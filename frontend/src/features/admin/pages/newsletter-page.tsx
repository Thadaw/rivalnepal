import { useMemo, useState } from "react";
import { CalendarDays, Mail, RefreshCw, Search, Trash2, UserPlus } from "lucide-react";
import type { AdminSubscriber } from "@/features/admin/api/admin.api";
import { useDeleteAdminSubscriber } from "@/features/admin/hooks/use-admin-mutations";
import { useAdminSubscribers } from "@/features/admin/hooks/use-admin-queries";

const DAY = 24 * 60 * 60 * 1000;

function joinedDate(joined: string) {
  const date = new Date(`${joined}T00:00:00`);
  if (Number.isNaN(date.getTime())) return joined;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function NewsletterPage() {
  const [search, setSearch] = useState("");
  const subscribers = useAdminSubscribers();
  const remove = useDeleteAdminSubscriber();

  const rows = subscribers.data ?? [];
  const last30 = rows.filter((row) => {
    const date = new Date(`${row.joined}T00:00:00`).getTime();
    return !Number.isNaN(date) && Date.now() - date <= 30 * DAY;
  }).length;
  const newest = rows.reduce<AdminSubscriber | null>(
    (latest, row) => (!latest || row.joined > latest.joined ? row : latest),
    null,
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => row.email.toLowerCase().includes(term));
  }, [rows, search]);

  function confirmDelete(subscriber: AdminSubscriber) {
    const confirmed = window.confirm(
      `Remove ${subscriber.email} from the mailing list?\n\nThe address stops receiving drop alerts and cannot be restored.`,
    );
    if (confirmed) remove.mutate(subscriber.id);
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Audience</p>
          <h1 className="display mt-2 text-4xl font-bold uppercase">
            Newsletter<span className="text-lime-600">.</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Everyone waiting for the next RIVAL drop.</p>
        </div>
        <button
          type="button"
          onClick={() => subscribers.refetch()}
          disabled={subscribers.isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-bold text-neutral-700 transition hover:border-neutral-950 disabled:opacity-50"
        >
          <RefreshCw size={14} className={subscribers.isFetching ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Subscribers", value: rows.length, icon: Mail, tone: "bg-lime-100 text-lime-700" },
          { label: "Joined in 30 days", value: last30, icon: UserPlus, tone: "bg-emerald-50 text-emerald-700" },
          { label: "Latest signup", value: newest ? joinedDate(newest.joined) : "—", icon: CalendarDays, tone: "bg-neutral-100 text-neutral-700" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500">{label}</p>
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}><Icon size={17} /></span>
            </div>
            <p className="display mt-4 text-3xl font-bold">{subscribers.isLoading ? "—" : value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
        <div className="relative mb-5 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by email"
            aria-label="Search subscribers"
            className="w-full rounded-full border-neutral-200 py-2.5 pl-9 pr-4 text-xs focus:border-lime-400 focus:ring-lime-300"
          />
        </div>

        {subscribers.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        ) : subscribers.isError ? (
          <div className="rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center">
            <p className="text-sm font-bold">Subscribers could not load.</p>
            <p className="mt-1 text-xs text-neutral-500">Your session may have expired. Try refreshing.</p>
            <button
              type="button"
              onClick={() => subscribers.refetch()}
              className="mt-4 rounded-full bg-neutral-950 px-5 py-2.5 text-xs font-bold text-white"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 px-6 py-14 text-center">
            <p className="text-sm font-bold">{rows.length ? "No subscribers match that search." : "No subscribers yet."}</p>
            <p className="mt-1 text-xs text-neutral-500">
              {rows.length ? "Try another email address." : "Signups from the storefront footer will appear here."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-xs">
                <thead className="border-b text-[10px] uppercase tracking-widest text-neutral-400">
                  <tr>
                    {["Email", "Joined", "Actions"].map((heading) => (
                      <th className="pb-3 font-semibold" key={heading}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/70">
                      <td className="py-3.5 font-semibold">{row.email}</td>
                      <td className="py-3.5 text-neutral-500">{joinedDate(row.joined)}</td>
                      <td className="py-3.5">
                        <button
                          type="button"
                          title="Remove subscriber"
                          disabled={remove.isPending && remove.variables === row.id}
                          onClick={() => confirmDelete(row)}
                          className="rounded-lg border p-2 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={13} className="text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 0 && (
              <p className="mt-4 text-[10px] text-neutral-400">
                Showing {filtered.length} of {rows.length} subscribers · newest first
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
