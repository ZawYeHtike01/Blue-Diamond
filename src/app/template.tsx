import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Event from "./components/main_components/lunch_event";
import { useApp } from "./App";

const SECTIONS = [
  { id: "top", label: "TOP" },
  { id: "about_us", label: "ABOUT US" },
  { id: "news", label: "NEWS" },
  { id: "member_note", label: "MEMBER NOTE" },
  { id: "gallery", label: "GALLERY" },
  { id: "contact", label: "CONTACT" },
];

export default function Template() {
  const [activeSection, setActiveSection] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const { globalMsg, setGlobalMsg } = useApp();

  useEffect(() => {
    if (!globalMsg) return;

    const timer = window.setTimeout(() => {
      setGlobalMsg(null);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [globalMsg, setGlobalMsg]);

  // Scroll to a section on the current Home page.
  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    setActiveSection(id);

    // Wait for the menu state update before scrolling.
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  // Highlight the section currently visible on screen.
  useEffect(() => {
    const elements = SECTIONS.map(({ id }) =>
      document.getElementById(id),
    ).filter((element): element is HTMLElement => element !== null);

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        threshold: [0.1, 0.25, 0.5, 0.75],
        rootMargin: "-56px 0px -10% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  // Close the mobile menu when the Escape key is pressed.
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen w-full bg-background">
      {/* DESKTOP GRID + SHARED PAGE CONTENT */}
      <div className="min-h-screen w-full min-[1100px]:grid min-[1100px]:grid-cols-8">
        {/* LEFT EVENT PANEL */}
        <aside className="hidden min-[1100px]:col-span-3 min-[1100px]:block">
          <div className="sticky top-0 flex h-screen items-center justify-center">
            <Event />
          </div>
        </aside>

        {/* ONE OUTLET ONLY: Home.tsx */}
        <main className="w-full min-h-screen pt-14 min-[1100px]:col-span-4 min-[1100px]:pt-0">
          <Outlet />
        </main>

        {/* DESKTOP RIGHT NAVIGATION */}
        <aside className="hidden min-[1100px]:col-span-1 min-[1100px]:block">
          <nav className="sticky top-0 flex h-screen flex-col items-center justify-center gap-10  bg-background/80 backdrop-blur-sm">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                aria-current={activeSection === id ? "location" : undefined}
                className={`
                  text-[10px] tracking-[0.2em]
                  transition-colors duration-200
                  hover:text-primary
                  ${
                    activeSection === id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                `}
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}

            <div className="absolute bottom-0 left-1/2 h-16 w-px -translate-x-1/2 bg-primary opacity-60" />
          </nav>
        </aside>
      </div>

      {/* MOBILE HEADER */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-sm min-[1100px]:hidden">
        <button
          type="button"
          onClick={() => scrollToSection("top")}
          className="text-lg font-black tracking-tight text-foreground"
          style={{
            fontFamily: "'Big Shoulders Display', sans-serif",
          }}
        >
          BLUE DIAMOND
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex flex-col gap-1.5 p-2"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span
            className={`block h-0.5 w-6 origin-center bg-foreground transition-all duration-300 ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />

          <span
            className={`block h-0.5 w-6 bg-foreground transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />

          <span
            className={`block h-0.5 w-6 origin-center bg-foreground transition-all duration-300 ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-40 flex h-dvh w-full flex-col items-center justify-center gap-8 bg-background/95 pt-14 backdrop-blur-md min-[1100px]:hidden"
        >
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(id)}
              aria-current={activeSection === id ? "location" : undefined}
              className={`
                text-4xl font-black
                transition-colors duration-200
                hover:text-primary
                ${activeSection === id ? "text-primary" : "text-foreground"}
              `}
              style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      )}
      {globalMsg && (
        <div
          role="status"
          aria-live="polite"
          className="
            fixed bottom-4 left-1/2 z-[10000]
            flex w-[calc(100%-2rem)] max-w-md
            -translate-x-1/2 items-center justify-between
            gap-3 rounded-xl border border-slate-700
            bg-slate-900 px-4 py-3
            text-sm text-white shadow-2xl
            sm:bottom-6
          "
        >
          <span className="min-w-0 break-words">{globalMsg}</span>

          <button
            type="button"
            onClick={() => setGlobalMsg(null)}
            aria-label="Close notification"
            className="shrink-0 text-slate-400 transition hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
