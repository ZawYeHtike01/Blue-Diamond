import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Event from "./components/main_components/lunch_event";
import { Link } from "react-router-dom";

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

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          threshold: 0.5,
        },
      );

      SECTIONS.forEach(({ id }) => {
        const element = document.getElementById(id);

        if (element) {
          observer.observe(element);
        }
      });

      observerRef.current = observer;
    }, 100);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-background">
      <div
        className="
          hidden
          min-[1100px]:grid
          min-[1100px]:grid-cols-7
          min-h-screen
        "
      >
        <div className="col-span-3">
          <div
            className="
              sticky
              top-0

              h-screen

              flex
              flex-col
              items-center
              justify-center

             
            "
          >
            <Event />
          </div>
        </div>

        <main
          className="
            col-span-3
            min-h-screen
            w-full
          "
        >
          <Outlet />
        </main>

        <div className="col-span-1">
          <nav
            className="
              sticky
              top-0

              h-screen

              flex
              flex-col

              items-center
              justify-center

              gap-10

              border-l
              border-border

              bg-background/80

              backdrop-blur-sm
            "
          >
            {SECTIONS.map(({ id, label }) => (
              <a
                key={id}
                href={`#/${id}`}
                className={`
                  text-[10px]

                  tracking-[0.2em]

                  transition-colors
                  duration-200

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
                }}
              >
                {label}
              </a>
            ))}

            {/* Bottom line */}

            <div
              className="
                absolute

                bottom-0
                left-1/2

                -translate-x-1/2

                w-px
                h-16

                bg-primary

                opacity-60
              "
            />
          </nav>
        </div>
      </div>

      <main
        className="
          block
          min-[1100px]:hidden

          w-full
          min-h-screen

          pt-14
        "
      >
        <Outlet />
      </main>

      <header
        className="
          flex
          min-[1100px]:hidden

          fixed

          top-0
          left-0
          right-0

          z-50

          h-14
          w-full

          items-center
          justify-between

          px-5

          bg-background/90
          backdrop-blur-sm

          border-b
          border-border
        "
      >
        <span
          className="
            text-lg
            font-black
            tracking-tight
            text-foreground
          "
          style={{
            fontFamily: "'Big Shoulders Display', sans-serif",
          }}
        >
          BLUE DIAMOND
        </span>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="
            flex
            flex-col

            gap-1.5

            p-2
          "
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {/* Top */}

          <span
            className={`
              block

              w-6
              h-0.5

              bg-foreground

              origin-center

              transition-all
              duration-300

              ${menuOpen ? "rotate-45 translate-y-2" : ""}
            `}
          />

          {/* Middle */}

          <span
            className={`
              block

              w-6
              h-0.5

              bg-foreground

              transition-opacity
              duration-200

              ${menuOpen ? "opacity-0" : "opacity-100"}
            `}
          />

          {/* Bottom */}

          <span
            className={`
              block

              w-6
              h-0.5

              bg-foreground

              origin-center

              transition-all
              duration-300

              ${menuOpen ? "-rotate-45 -translate-y-2" : ""}
            `}
          />
        </button>
      </header>

      {menuOpen && (
        <div
          className="
            flex
            min-[1100px]:hidden
            fixed
            inset-0
            z-40
            h-dvh
            w-full
            flex-col
            items-center
            justify-center
            gap-8
            pt-14
            bg-background/95
            backdrop-blur-md
          "
        >
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#/${id}`}
              onClick={() => {
                setActiveSection(id);
                setMenuOpen(false);
              }}
              className={`
      text-4xl
      font-black
      transition-colors
      duration-200
      hover:text-primary
      ${activeSection === id ? "text-primary" : "text-foreground"}
    `}
              style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}