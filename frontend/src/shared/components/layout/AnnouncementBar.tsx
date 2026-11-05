import { useState } from "react";
import { X } from "lucide-react";
import { PageContainer } from "./PageContainer";

const messages = [
  "Delivery from Rs 100 — local rate",
  "New drop — After Hours",
  "Cash on delivery nationwide",
];

export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="relative bg-black text-chalk">
      <p className="sr-only">{messages.join(" · ")}</p>

      <PageContainer className="hidden items-center justify-center gap-0 py-2.5 sm:flex" aria-hidden="true">
        {messages.map((message, index) => (
          <span key={message} className="flex items-center">
            <span className="text-[8px] font-medium uppercase tracking-[.28em] text-chalk/65">{message}</span>
            {index < messages.length - 1 && <span className="mx-5 h-3 w-px bg-chalk/20" aria-hidden="true" />}
          </span>
        ))}
      </PageContainer>

      <div className="marquee overflow-hidden sm:hidden" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center py-2.5">
              {messages.map((message) => (
                <span
                  key={`${copy}-${message}`}
                  className="flex items-center whitespace-nowrap text-[8px] font-medium uppercase tracking-[.24em] text-chalk/65"
                >
                  {message}
                  <span className="mx-4 text-chalk/30">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen(false)}
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 p-1 text-chalk/40 transition hover:text-chalk sm:block"
        aria-label="Dismiss announcement"
      >
        <X size={13} />
      </button>
    </div>
  );
}
