import { useState } from "react";
import Lunch from "../components/main_components/lunch_event";

const ALBUMS = [
  {
    id: "01",
    title: "Crystalline",
    year: "2023",
    type: "FULL ALBUM",
    tracks: 11,
    tag: "LATEST",
    color: "#3b82f6",
    img: "https://images.unsplash.com/photo-1765224747205-3c9c23f0553c?w=600&h=800&fit=crop&auto=format",
    desc: "Their landmark debut — eleven tracks of compressed post-rock clarity and devastating beauty.",
  },
  {
    id: "02",
    title: "Depths",
    year: "2021",
    type: "EP",
    tracks: 6,
    tag: "EP",
    color: "#1d4ed8",
    img: "https://images.unsplash.com/photo-1765224747170-be7b97010052?w=600&h=800&fit=crop&auto=format",
    desc: "Six tracks recorded live in a single night — raw, uncompressed, and essential.",
  },
  {
    id: "03",
    title: "Signal / Noise",
    year: "2020",
    type: "SINGLE",
    tracks: 2,
    tag: "SINGLE",
    color: "#60a5fa",
    img: "https://images.unsplash.com/photo-1549046701-6bd11cf71796?w=600&h=800&fit=crop&auto=format",
    desc: "The debut single that introduced Blue Diamond to the world. Still devastating.",
  },
];

const TOUR_DATES = [
  {
    date: "2026.08.14",
    venue: "Blue Note Tokyo",
    city: "TOKYO",
    status: "SOLD OUT",
  },
  {
    date: "2026.08.21",
    venue: "Zepp Osaka Bayside",
    city: "OSAKA",
    status: "ON SALE",
  },
  {
    date: "2026.09.05",
    venue: "The Roundhouse",
    city: "LONDON",
    status: "ON SALE",
  },
  {
    date: "2026.09.12",
    venue: "Ancienne Belgique",
    city: "BRUSSELS",
    status: "ON SALE",
  },
  {
    date: "2026.10.03",
    venue: "Webster Hall",
    city: "NEW YORK",
    status: "COMING SOON",
  },
  {
    date: "2026.10.18",
    venue: "The Fillmore",
    city: "SAN FRANCISCO",
    status: "COMING SOON",
  },
];

export default function Home() {
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);

  return (
    <div
      className="
        w-full
        bg-background
        text-foreground
        min-h-screen
        overflow-x-hidden
      "
      style={{
        fontFamily: "'Barlow', sans-serif",
      }}
    >
      <div
        className="
          fixed
          inset-0
          z-[100]
          bg-background
          flex
          items-center
          justify-center
          transition-opacity
          duration-700
          pointer-events-none
          opacity-0
        "
      >
        <div
          className="
            text-6xl
            font-black
            tracking-tight
            text-primary
            drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]
          "
          style={{
            fontFamily: "'Big Shoulders Display', sans-serif",
          }}
        >
          BD
        </div>
      </div>

      <main className="lg:pr-14">
        <section
          id="top"
          className="
            relative
            h-screen
            min-h-[600px]
            flex
            flex-col
            justify-end
            overflow-hidden
            bg-[#04080f]
          "
        >
          <img
            src="https://images.unsplash.com/photo-1577042816206-2e85c23f2392?w=1600&h=1000&fit=crop&auto=format"
            alt="Blue Diamond performing on stage"
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              opacity-40
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-background
              via-background/20
              to-transparent
            "
          />

          <div
            className="
              absolute
              top-0
              right-0
              w-1/3
              h-full
              opacity-10
            "
            style={{
              background:
                "linear-gradient(135deg, transparent 50%, #1d4ed8 50%)",
            }}
          />


          <div
            className="
              relative
              z-10
              px-6
              pb-12
            "
          >
            <div
              className="
                text-[11px]
                tracking-[0.4em]
                text-primary
                uppercase
                mb-4
              "
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
              }}
            >
              SAGA / JAPAN — EST. 2026
            </div>

            <h1
              className="
                font-black
                text-foreground
                uppercase
                leading-[0.88]
                mb-6
              "
              style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontSize: "clamp(4rem, 10vw, 9rem)",
                letterSpacing: "-0.01em",
              }}
            >
              BLUE
              <br />
              <span className="text-primary">DIA</span>
              <span className="text-foreground">MOND</span>
            </h1>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-4
                md:gap-8
              "
            >
              <a
                href="#lineup"
                className="
                  inline-block
                  bg-primary
                  text-primary-foreground
                  px-2
                  py-4
                  font-black
                  text-sm
                  tracking-widest
                  uppercase
                  hover:bg-foreground
                  transition-colors
                  duration-200
                "
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                リクエストコーナー
              </a>

              <a
                href="#tour"
                className="
                  inline-block
                  border
                  border-foreground/30
                  text-foreground
                  px-4
                  py-3
                  font-bold
                  text-sm
                  tracking-widest
                  uppercase
                  hover:border-primary
                  hover:text-primary
                  transition-colors
                  duration-200
                "
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                入部申込書 →
              </a>
            </div>
          </div>

          {/* Bottom strip */}

          <div
            className="
              relative
              z-10
              bg-primary
              h-1.5
              w-full
            "
          />
        </section>

        <section
          id="concept"
          className="
            bg-background
            overflow-hidden
          "
        >
          <div className="w-full overflow-hidden">
            <div
              className="
                flex
                w-max
                animate-marquee
              "
            >
              <p
                className="
                  whitespace-nowrap
                  font-black
                  uppercase
                  text-foreground
                  mr-20
                "
                style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  fontSize: "2.5rem",
                }}
              >
                <span className="text-primary">Blue Diamond </span>
                Music Band は、佐賀女子短期大学の学内音楽バンドです。
              </p>

              <p
                className="
                  whitespace-nowrap
                  font-black
                  uppercase
                  text-foreground
                  mr-20
                "
                style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  fontSize: "2.5rem",
                }}
              >
                <span className="text-primary">Blue Diamond </span>
                Music Band は、佐賀女子短期大学の学内音楽バンドです。
              </p>
            </div>
          </div>
          <div className="min-[1100px]:hidden">
            <Lunch />
          </div>
        </section>

        {/* ==================================================
            DIVIDER IMAGE
        ================================================== */}

        <div
          className="
            relative
            h-64
            md:h-96
            overflow-hidden
            bg-[#04080f]
          "
        >
          <img
            src="https://images.unsplash.com/photo-1577648875929-894904f7b051?w=1600&h=600&fit=crop&auto=format"
            alt="Blue Diamond concert crowd"
            className="
              w-full
              h-full
              object-cover
              opacity-40
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-background/80
              via-transparent
              to-background/80
            "
          />

          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
            "
          >
            <p
              className="
                text-center
                font-black
                uppercase
                text-foreground/90
                text-2xl
                md:text-5xl
                tracking-widest
              "
              style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
              }}
            >
              GO!! CRAZY!!
            </p>
          </div>

          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              h-1
              bg-primary
            "
          />
        </div>

        {/* ==================================================
            NEWS / LINEUP
        ================================================== */}

        <section
          id="lineup"
          className="
            py-24
            md:py-36
            bg-secondary
          "
        >
          <div className="px-6 md:px-16">
            <div
              className="
                flex
                items-center
                gap-5
                mb-4
              "
            >
              <div
                className="
                  text-[11px]
                  tracking-[0.35em]
                  uppercase
                  text-primary
                "
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                }}
              >
                LINEUP
              </div>

              <div className="flex-1 h-px bg-border" />
            </div>

            <h2
              className="
                font-black
                uppercase
                text-foreground
                text-5xl
                md:text-7xl
                mb-16
                md:mb-24
                leading-none
              "
              style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
              }}
            >
              DISCOGRAPHY
            </h2>

            <div
              className="
                grid
                md:grid-cols-3
                gap-4
                md:gap-6
              "
            >
              {ALBUMS.map((album, i) => (
                <div
                  key={album.id}
                  className="
                    group
                    cursor-pointer
                    bg-card
                    border
                    border-border
                    hover:border-primary
                    transition-all
                    duration-300
                    overflow-hidden
                  "
                  onClick={() =>
                    setSelectedAlbum(selectedAlbum === i ? null : i)
                  }
                >
                  {/* Image */}

                  <div
                    className="
                      relative
                      aspect-[3/4]
                      overflow-hidden
                      bg-muted
                    "
                  >
                    <img
                      src={album.img}
                      alt={album.title}
                      className="
                        w-full
                        h-full
                        object-cover
                        opacity-75
                        group-hover:opacity-90
                        group-hover:scale-105
                        transition-all
                        duration-500
                      "
                    />

                    {/* Tag */}

                    <div
                      className="
                        absolute
                        top-4
                        left-4
                        px-3
                        py-1
                        text-[10px]
                        font-bold
                        tracking-widest
                        text-primary-foreground
                      "
                      style={{
                        backgroundColor: album.color,
                        fontFamily: "'Barlow Condensed', sans-serif",
                      }}
                    >
                      {album.tag}
                    </div>

                    {/* Number */}

                    <div
                      className="
                        absolute
                        bottom-4
                        right-4
                        text-6xl
                        font-black
                        text-white/10
                        leading-none
                      "
                      style={{
                        fontFamily: "'Big Shoulders Display', sans-serif",
                      }}
                    >
                      {album.id}
                    </div>
                  </div>

                  {/* Info */}

                  <div className="p-5 md:p-6">
                    <div
                      className="
                        text-[10px]
                        tracking-widest
                        text-muted-foreground
                        mb-1
                      "
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {album.type} — {album.year}
                    </div>

                    <h3
                      className="
                        font-black
                        text-foreground
                        text-2xl
                        uppercase
                        mb-2
                        group-hover:text-primary
                        transition-colors
                      "
                      style={{
                        fontFamily: "'Big Shoulders Display', sans-serif",
                      }}
                    >
                      {album.title}
                    </h3>

                    <div
                      className="
                        text-[11px]
                        text-muted-foreground
                        mb-4
                      "
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                      }}
                    >
                      {album.tracks} TRACKS
                    </div>

                    {/* Description */}

                    {selectedAlbum === i && (
                      <p
                        className="
                          text-sm
                          text-muted-foreground
                          leading-relaxed
                          mb-4
                          font-light
                          border-t
                          border-border
                          pt-4
                        "
                      >
                        {album.desc}
                      </p>
                    )}

                    <button
                      className="
                        text-[11px]
                        tracking-widest
                        uppercase
                        font-bold
                        text-primary
                        hover:text-foreground
                        transition-colors
                        flex
                        items-center
                        gap-2
                      "
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                      }}
                    >
                      {selectedAlbum === i ? "CLOSE ✕" : "DETAILS →"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================
            MEMBER NOTE / TOUR
        ================================================== */}

        <section
          id="tour"
          className="
            py-24
            md:py-36
            bg-background
          "
        >
          <div className="px-6 md:px-16">
            <div
              className="
                flex
                items-center
                gap-5
                mb-4
              "
            >
              <div
                className="
                  text-[11px]
                  tracking-[0.35em]
                  uppercase
                  text-primary
                "
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                }}
              >
                TOUR
              </div>

              <div className="flex-1 h-px bg-border" />
            </div>

            <h2
              className="
                font-black
                uppercase
                text-foreground
                text-5xl
                md:text-7xl
                mb-4
                leading-none
              "
              style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
              }}
            >
              LIVE 2026
            </h2>

            <p
              className="
                text-muted-foreground
                text-sm
                mb-16
                font-light
              "
            >
              World tour in support of <em>Crystalline</em>. Limited capacity
              only.
            </p>

            <div className="border-t border-border">
              {TOUR_DATES.map((show, i) => (
                <div
                  key={i}
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    gap-3
                    sm:gap-0
                    py-6
                    border-b
                    border-border
                    group
                    hover:bg-card
                    transition-colors
                    duration-150
                    px-0
                    hover:px-4
                    md:hover:px-6
                  "
                  style={{
                    transition: "padding 0.2s, background 0.2s",
                  }}
                >
                  {/* Date */}

                  <div
                    className="
                      sm:w-44
                      font-bold
                      text-foreground
                      text-sm
                    "
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {show.date}
                  </div>

                  {/* City */}

                  <div className="sm:w-36">
                    <span
                      className="
                        text-[10px]
                        tracking-widest
                        font-black
                        px-2.5
                        py-1
                        bg-muted
                        text-muted-foreground
                      "
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                      }}
                    >
                      {show.city}
                    </span>
                  </div>

                  {/* Venue */}

                  <div
                    className="
                      flex-1
                      text-sm
                      font-light
                      text-foreground
                    "
                  >
                    {show.venue}
                  </div>

                  {/* Status */}

                  <div
                    className="
                      sm:text-right
                      sm:w-36
                    "
                  >
                    {show.status === "SOLD OUT" ? (
                      <span
                        className="
                          text-[10px]
                          tracking-widest
                          font-bold
                          text-muted-foreground/50
                          line-through
                        "
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                        }}
                      >
                        SOLD OUT
                      </span>
                    ) : show.status === "COMING SOON" ? (
                      <span
                        className="
                          text-[10px]
                          tracking-widest
                          font-bold
                          text-muted-foreground
                        "
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                        }}
                      >
                        COMING SOON
                      </span>
                    ) : (
                      <a
                        href="#"
                        className="
                          inline-block
                          bg-primary
                          text-primary-foreground
                          text-[10px]
                          tracking-widest
                          font-black
                          px-4
                          py-2
                          hover:bg-foreground
                          transition-colors
                          duration-150
                        "
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                        }}
                      >
                        GET TICKETS →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================
            GALLERY
        ================================================== */}

        <section
          id="gallery"
          className="
            py-24
            md:py-36
            bg-secondary
          "
        >
          <div className="px-6 md:px-16">
            <div
              className="
                flex
                items-center
                gap-5
                mb-4
              "
            >
              <div
                className="
                  text-[11px]
                  tracking-[0.35em]
                  uppercase
                  text-primary
                "
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                }}
              >
                GALLERY
              </div>

              <div className="flex-1 h-px bg-border" />
            </div>

            <h2
              className="
                font-black
                uppercase
                text-foreground
                text-5xl
                md:text-7xl
                mb-12
                leading-none
              "
              style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
              }}
            >
              PHOTOS
            </h2>
          </div>

          {/* Masonry */}

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-1
            "
          >
            <div
              className="
                row-span-2
                bg-muted
                overflow-hidden
                aspect-[2/3]
                md:aspect-auto
              "
            >
              <img
                src="https://images.unsplash.com/photo-1649772308558-db37c0dfae7e?w=600&h=900&fit=crop&auto=format"
                alt="Performer at microphone"
                className="
                  w-full
                  h-full
                  object-cover
                  opacity-80
                  hover:opacity-100
                  hover:scale-105
                  transition-all
                  duration-500
                "
              />
            </div>

            <div
              className="
                col-span-2
                bg-muted
                overflow-hidden
                aspect-video
              "
            >
              <img
                src="https://images.unsplash.com/photo-1577042816206-2e85c23f2392?w=900&h=500&fit=crop&auto=format"
                alt="Band on stage"
                className="
                  w-full
                  h-full
                  object-cover
                  opacity-80
                  hover:opacity-100
                  hover:scale-105
                  transition-all
                  duration-500
                "
              />
            </div>

            <div
              className="
                bg-muted
                overflow-hidden
                aspect-square
              "
            >
              <img
                src="https://images.unsplash.com/photo-1574155088851-0c770818ba40?w=500&h=500&fit=crop&auto=format"
                alt="Concert crowd"
                className="
                  w-full
                  h-full
                  object-cover
                  opacity-80
                  hover:opacity-100
                  hover:scale-105
                  transition-all
                  duration-500
                "
              />
            </div>

            <div
              className="
                bg-muted
                overflow-hidden
                aspect-square
              "
            >
              <img
                src="https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?w=500&h=500&fit=crop&auto=format"
                alt="Concert celebration"
                className="
                  w-full
                  h-full
                  object-cover
                  opacity-80
                  hover:opacity-100
                  hover:scale-105
                  transition-all
                  duration-500
                "
              />
            </div>

            <div
              className="
                col-span-2
                bg-muted
                overflow-hidden
                aspect-video
              "
            >
              <img
                src="https://images.unsplash.com/photo-1765224747205-3c9c23f0553c?w=900&h=500&fit=crop&auto=format"
                alt="Singer silhouette blue stage"
                className="
                  w-full
                  h-full
                  object-cover
                  opacity-80
                  hover:opacity-100
                  hover:scale-105
                  transition-all
                  duration-500
                "
              />
            </div>
          </div>
        </section>

        {/* ==================================================
            CONTACT
        ================================================== */}

        <section
          id="contact"
          className="
            py-24
            md:py-36
            bg-background
          "
        >
          <div className="px-6 md:px-16">
            <div
              className="
                flex
                items-center
                gap-5
                mb-4
              "
            >
              <div
                className="
                  text-[11px]
                  tracking-[0.35em]
                  uppercase
                  text-primary
                "
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                }}
              >
                CONTACT
              </div>

              <div className="flex-1 h-px bg-border" />
            </div>

            <h2
              className="
                font-black
                uppercase
                text-foreground
                text-5xl
                md:text-7xl
                mb-16
                leading-none
              "
              style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
              }}
            >
              GET IN
              <br />
              TOUCH!!
            </h2>

            <div
              className="
                grid
                md:grid-cols-2
                gap-16
                md:gap-24
              "
            >
              {/* Contact info */}

              <div>
                <div
                  className="
                    border-t
                    border-border
                    divide-y
                    divide-border
                  "
                >
                  {[
                    {
                      role: "BOOKINGS",
                      email: "bookings@bluediamond.band",
                    },
                    {
                      role: "PRESS",
                      email: "press@bluediamond.band",
                    },
                    {
                      role: "GENERAL",
                      email: "hello@bluediamond.band",
                    },
                    {
                      role: "MANAGEMENT",
                      email: "mgmt@bluediamond.band",
                    },
                  ].map((c) => (
                    <div
                      key={c.role}
                      className="
                        flex
                        items-center
                        justify-between
                        py-5
                        group
                      "
                    >
                      <span
                        className="
                          text-[11px]
                          tracking-widest
                          font-bold
                          text-muted-foreground
                        "
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                        }}
                      >
                        {c.role}
                      </span>

                      <a
                        href={`mailto:${c.email}`}
                        className="
                          text-sm
                          text-foreground
                          hover:text-primary
                          transition-colors
                          font-light
                        "
                      >
                        {c.email}
                      </a>
                    </div>
                  ))}
                </div>

                {/* Social */}

                <div
                  className="
                    mt-10
                    flex
                    flex-wrap
                    gap-3
                  "
                >
                  {["INSTAGRAM", "SPOTIFY", "YOUTUBE", "BANDCAMP"].map((s) => (
                    <a
                      key={s}
                      href="#"
                      className="
                        text-[10px]
                        tracking-widest
                        font-black
                        border
                        border-border
                        px-4
                        py-2
                        text-muted-foreground
                        hover:border-primary
                        hover:text-primary
                        transition-all
                        duration-200
                      "
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                      }}
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>

              {/* Form */}

              <form onSubmit={(e) => e.preventDefault()} className="space-y-7">
                {[
                  {
                    label: "NAME",
                    type: "text",
                    placeholder: "Your name",
                  },
                  {
                    label: "EMAIL",
                    type: "email",
                    placeholder: "your@email.com",
                  },
                ].map((f) => (
                  <div key={f.label}>
                    <label
                      className="
                        block
                        text-[10px]
                        tracking-widest
                        font-bold
                        text-muted-foreground
                        mb-2
                      "
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                      }}
                    >
                      {f.label}
                    </label>

                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      className="
                        w-full
                        bg-transparent
                        border-b
                        border-border
                        focus:border-primary
                        outline-none
                        py-3
                        text-sm
                        text-foreground
                        placeholder:text-muted-foreground/40
                        transition-colors
                      "
                    />
                  </div>
                ))}

                <div>
                  <label
                    className="
                      block
                      text-[10px]
                      tracking-widest
                      font-bold
                      text-muted-foreground
                      mb-2
                    "
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                    }}
                  >
                    MESSAGE
                  </label>

                  <textarea
                    rows={4}
                    placeholder="Tell us about your inquiry..."
                    className="
                      w-full
                      bg-transparent
                      border-b
                      border-border
                      focus:border-primary
                      outline-none
                      py-3
                      text-sm
                      text-foreground
                      placeholder:text-muted-foreground/40
                      transition-colors
                      resize-none
                    "
                  />
                </div>

                <button
                  type="submit"
                  className="
                    bg-primary
                    text-primary-foreground
                    px-8
                    py-4
                    text-sm
                    font-black
                    tracking-widest
                    uppercase
                    hover:bg-foreground
                    transition-colors
                    duration-200
                  "
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  SEND MESSAGE →
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer
          className="
            border-t
            border-border
            py-10
            bg-secondary
          "
        >
          <div
            className="
              px-6
              md:px-16
              flex
              flex-col
              md:flex-row
              items-start
              md:items-center
              justify-between
              gap-6
            "
          >
            <div
              className="
                text-2xl
                font-black
                text-foreground
              "
              style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
              }}
            >
              BLUE DIAMOND
            </div>

            <div
              className="
                text-[10px]
                tracking-widest
                text-muted-foreground
              "
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            >
              © 2026 BLUE DIAMOND — TOKYO / SEOUL. ALL RIGHTS RESERVED.
            </div>
          </div>
        </footer>
      </main>

      {/* ==================================================
          GLOBAL STYLE
      ================================================== */}

      <style>{`
        html {
          scroll-behavior: smooth;
          
        }

        ::-webkit-scrollbar {
          width: 3px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #3b82f6;
        }
      `}</style>
    </div>
  );
}
