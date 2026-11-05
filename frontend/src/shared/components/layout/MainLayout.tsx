import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnnouncementBar } from "./AnnouncementBar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { PageTitle } from "./PageTitle";

export function MainLayout() {
  const { pathname, hash } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
        window.setTimeout(() => target.scrollIntoView({ behavior, block: "start" }), 60);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return (
    <div className="store flex min-h-screen flex-col bg-chalk text-black">
      <PageTitle />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-chalk focus:px-4 focus:py-3 focus:text-[10px] focus:font-semibold focus:uppercase focus:tracking-[.18em] focus:text-black"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <div className="relative flex-1">
        <Navbar variant={isHome ? "transparent" : "solid"} />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
