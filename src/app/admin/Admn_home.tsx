import { useState } from "react";
import Lunch from "../components/main_components/lunch_event";
import Good from "../components/main_components/goodthings";
import Reveal from "../Reveal";
import { motion } from "motion/react";

const ALBUMS = [
  {
    id: "01",
    title: "Kaung Khant Kyaw",
    year: "2025",
    type: "MEMBER",
    tracks: 11,
    tag: "Guitarist",
    color: "#3b82f6",
    img: "https://images.unsplash.com/photo-1765224747205-3c9c23f0553c?w=600&h=800&fit=crop&auto=format",
    desc: "Their landmark debut — eleven tracks of compressed post-rock clarity and devastating beauty.",
  },
  {
    id: "02",
    title: "ZAW YE HTIKE",
    year: "2025",
    type: "MEMBER",
    tracks: 6,
    tag: "Guitarist",
    color: "#1d4ed8",
    img: "https://images.unsplash.com/photo-1765224747170-be7b97010052?w=600&h=800&fit=crop&auto=format",
    desc: "Six tracks recorded live in a single night — raw, uncompressed, and essential.",
  },
  {
    id: "03",
    title: "AYE MYAT MON",
    year: "2025",
    type: "Vacalist",
    tracks: 2,
    tag: "Vacalist",
    color: "#60a5fa",
    img: "https://images.unsplash.com/photo-1549046701-6bd11cf71796?w=600&h=800&fit=crop&auto=format",
    desc: "The debut single that introduced Blue Diamond to the world. Still devastating.",
  },
];

const TOUR_DATES = [
  {
    date: "2026.08.14",
    venue:
      "The debut single that introduced Blue Diamond to the world. Still devastating.",
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

export default function AdminHome() {
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);

    if (!element) {
      console.log("Section not found:", id);
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div
      className="
        w-full
        min-h-screen
        bg-background
        text-foreground
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
          flex
          items-center
          justify-center
          bg-background
          pointer-events-none
          opacity-0
          transition-opacity
          duration-700
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
            scroll-mt-14
          "
        >
          <motion.img
            src="https://images.unsplash.com/photo-1577042816206-2e85c23f2392?w=1600&h=1000&fit=crop&auto=format"
            alt="Blue Diamond performing on stage"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 2,
              ease: [0.22, 1, 0.36, 1],
            }}
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
            <Reveal direction="up" delay={0.1}>
              <div
                className="
                  mb-4
                  text-[11px]
                  uppercase
                  tracking-[0.4em]
                  text-primary
                "
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                }}
              >
                SAGA / JAPAN — EST. 2026
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.2}>
              <h1
                className="
                  mb-6
                  font-black
                  uppercase
                  leading-[0.88]
                  text-foreground
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
            </Reveal>

            <Reveal direction="up" delay={0.35}>
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-4
                  md:gap-8
                "
              >
                <button
                  type="button"
                  onClick={() => scrollToSection("lineup")}
                  className="
                    inline-block
                    cursor-pointer
                    border-0
                    bg-primary
                    px-2
                    py-4
                    text-sm
                    font-black
                    uppercase
                    tracking-widest
                    text-primary-foreground
                    transition-colors
                    duration-200
                    hover:bg-foreground
                  "
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  リクエストコーナー
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("tour")}
                  className="
                    inline-block
                    cursor-pointer
                    border
                    border-foreground/30
                    bg-transparent
                    px-4
                    py-3
                    text-sm
                    font-bold
                    uppercase
                    tracking-widest
                    text-foreground
                    transition-colors
                    duration-200
                    hover:border-primary
                    hover:text-primary
                  "
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  入部申込書 →
                </button>
              </div>
            </Reveal>
          </div>

          <div
            className="
              relative
              z-10
              h-1.5
              w-full
              bg-primary
            "
          />
        </section>

        

        <section
          id="about_us"
          className="
            overflow-hidden
            bg-background
            scroll-mt-14
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
                  mr-20
                  whitespace-nowrap
                  font-black
                  uppercase
                  text-foreground
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
                  mr-20
                  whitespace-nowrap
                  font-black
                  uppercase
                  text-foreground
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

          <Reveal direction="up">
            <div className="min-[1100px]:hidden">
              <Lunch />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <Good />
            </div>
          </Reveal>
        </section>

        {/* CONCERT IMAGE */}

        <div
          className="
            relative
            h-64
            overflow-hidden
            bg-[#04080f]
            md:h-96
          "
        >
          <motion.img
            src="https://images.unsplash.com/photo-1577648875929-894904f7b051?w=1600&h=600&fit=crop&auto=format"
            alt="Blue Diamond concert crowd"
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              h-full
              w-full
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

          <Reveal>
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
                  text-2xl
                  font-black
                  uppercase
                  tracking-widest
                  text-foreground/90
                  md:text-5xl
                "
                style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                }}
              >
                GO!! CRAZY!!
              </p>
            </div>
          </Reveal>

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

        {/* NEWS */}

        <section
          id="news"
          className="
            bg-background
            py-24
            scroll-mt-14
            md:py-36
          "
        >
          <div className="px-6 md:px-16">
            <Reveal>
              <div
                className="
                  mb-4
                  flex
                  items-center
                  gap-5
                "
              >
                <div
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.35em]
                    text-primary
                  "
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  BLUE DIAMOND
                </div>

                <div className="h-px flex-1 bg-border" />
              </div>

              <h2
                className="
                  mb-4
                  text-5xl
                  font-black
                  uppercase
                  leading-none
                  text-foreground
                  md:text-7xl
                "
                style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                }}
              >
                NEWS
              </h2>
            </Reveal>

            <div className="border-t border-border">
              {TOUR_DATES.map((show, i) => (
                <Reveal
                  key={i}
                  delay={i * 0.07}
                  direction="up"
                >
                  <div
                    className="
                      group
                      flex
                      flex-col
                      gap-3
                      border-b
                      border-border
                      px-0
                      py-6
                      transition-colors
                      duration-150
                      hover:bg-card
                      sm:flex-row
                      sm:items-center
                      sm:gap-0
                      md:hover:px-6
                    "
                  >
                    <div
                      className="
                        text-sm
                        font-bold
                        text-foreground
                        sm:w-44
                      "
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {show.date}
                    </div>

                    <div
                      className="
                        flex-2
                        text-sm
                        font-light
                        text-foreground
                      "
                    >
                      {show.venue}
                    </div>

                    <div className="sm:w-36 sm:text-right">
                      <button
                        type="button"
                        className="
                          cursor-pointer
                          inline-block
                          border-0
                          bg-primary
                          px-4
                          py-2
                          text-[10px]
                          font-black
                          tracking-widest
                          text-primary-foreground
                          transition-colors
                          duration-150
                          hover:bg-foreground
                        "
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                        }}
                      >
                        View Details→
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <button
                type="button"
                className="
                  cursor-pointer
                  border-0
                  bg-primary
                  px-4
                  py-2
                  text-[10px]
                  font-black
                  tracking-widest
                  text-primary-foreground
                  transition-colors
                  duration-150
                  hover:bg-foreground
                "
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                MORES →
              </button>
            </div>
          </Reveal>
        </section>

        {/* MEMBER'S NOTE */}

        <section
          id="member_note"
          className="
            bg-secondary
            py-24
            scroll-mt-14
            md:py-36
          "
        >
          <div className="px-6 md:px-16">
            <Reveal>
              <div
                className="
                  mb-4
                  flex
                  items-center
                  gap-5
                "
              >
                <div
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.35em]
                    text-primary
                  "
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  HEllO
                </div>

                <div className="h-px flex-1 bg-border" />
              </div>

              <h2
                className="
                  mb-16
                  text-5xl
                  font-black
                  uppercase
                  leading-none
                  text-foreground
                  md:mb-24
                  md:text-7xl
                "
                style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                }}
              >
                MEMBER'S NOTE
              </h2>
            </Reveal>

            <div
              className="
                grid
                gap-4
                md:grid-cols-1
                md:gap-6
              "
            >
              {ALBUMS.map((album, i) => (
                <Reveal
                  key={album.id}
                  delay={i * 0.12}
                  direction="up"
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.25 }}
                    className="
                      group
                      cursor-pointer
                      overflow-hidden
                      border
                      border-border
                      bg-card
                      transition-all
                      duration-300
                      hover:border-primary
                    "
                    onClick={() =>
                      setSelectedAlbum(selectedAlbum === i ? null : i)
                    }
                  >
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
                          h-full
                          w-full
                          object-cover
                          opacity-75
                          transition-all
                          duration-500
                          group-hover:scale-105
                          group-hover:opacity-90
                        "
                      />

                      <div
                        className="
                          absolute
                          left-4
                          top-4
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

                      <div
                        className="
                          absolute
                          bottom-4
                          right-4
                          text-6xl
                          font-black
                          leading-none
                          text-white/10
                        "
                        style={{
                          fontFamily: "'Big Shoulders Display', sans-serif",
                        }}
                      >
                        {album.id}
                      </div>
                    </div>

                    <div className="p-5 md:p-6">
                      <div
                        className="
                          mb-1
                          text-[10px]
                          tracking-widest
                          text-muted-foreground
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
                          mb-2
                          text-2xl
                          font-black
                          uppercase
                          text-foreground
                          transition-colors
                          group-hover:text-primary
                        "
                        style={{
                          fontFamily: "'Big Shoulders Display', sans-serif",
                        }}
                      >
                        {album.title}
                      </h3>

                      <div
                        className="
                          mb-4
                          text-[11px]
                          text-muted-foreground
                        "
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                        }}
                      >
                        {album.tracks} TRACKS
                      </div>

                      {selectedAlbum === i && (
                        <p
                          className="
                            mb-4
                            border-t
                            border-border
                            pt-4
                            text-sm
                            font-light
                            leading-relaxed
                            text-muted-foreground
                          "
                        >
                          {album.desc}
                        </p>
                      )}

                      <button
                        type="button"
                        className="
                          flex
                          items-center
                          gap-2
                          text-[11px]
                          font-bold
                          uppercase
                          tracking-widest
                          text-primary
                          transition-colors
                          hover:text-foreground
                        "
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                        }}
                      >
                        {selectedAlbum === i ? "CLOSE ✕" : "DETAILS →"}
                      </button>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <button
                type="button"
                className="
                  cursor-pointer
                  border-0
                  bg-primary
                  px-4
                  py-2
                  text-[10px]
                  font-black
                  tracking-widest
                  text-primary-foreground
                  transition-colors
                  duration-150
                  hover:bg-foreground
                "
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                MORES →
              </button>
            </div>
          </Reveal>
        </section>

        {/* BRAND */}

        <div>
          <Reveal>
            <div
              style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontSize: "18rem",
                letterSpacing: "-0.01em",
                fontWeight: "bolder",
                textAlign: "center",
              }}
            >
              <span className="text-primary">B</span>
              <span className="text-foreground">D</span>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div
              style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontSize: "8rem",
                letterSpacing: "-0.01em",
                fontWeight: "bolder",
                textAlign: "center",
                marginBottom: "10rem",
              }}
            >
              <span className="text-foreground">BLUE</span>
              <br />
              <span className="text-primary">DIAMOND</span>
              <br />
              <span className="text-foreground">BAND</span>
            </div>
          </Reveal>
        </div>

        {/* GALLERY */}

        <section
          id="gallery"
          className="
            bg-secondary
            py-24
            scroll-mt-14
            md:py-36
          "
        >
          <div className="px-6 md:px-16">
            <Reveal>
              <div
                className="
                  mb-4
                  flex
                  items-center
                  gap-5
                "
              >
                <div
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.35em]
                    text-primary
                  "
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  GALLERY
                </div>

                <div className="h-px flex-1 bg-border" />
              </div>

              <h2
                className="
                  mb-12
                  text-5xl
                  font-black
                  uppercase
                  leading-none
                  text-foreground
                  md:text-7xl
                "
                style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                }}
              >
                PHOTOS
              </h2>
            </Reveal>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-1
              md:grid-cols-4
            "
          >
            <Reveal className="row-span-2 aspect-[2/3] overflow-hidden bg-muted md:aspect-auto">
              <div className="h-full w-full overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1649772308558-db37c0dfae7e?w=600&h=900&fit=crop&auto=format"
                  alt="Performer at microphone"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="
                    h-full
                    w-full
                    object-cover
                    opacity-80
                    transition-all
                    duration-500
                    hover:opacity-100
                  "
                />
              </div>
            </Reveal>

            <Reveal className="col-span-2 aspect-video overflow-hidden bg-muted" delay={0.1}>
              <div className="h-full w-full overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1577042816206-2e85c23f2392?w=900&h=500&fit=crop&auto=format"
                  alt="Band on stage"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="
                    h-full
                    w-full
                    object-cover
                    opacity-80
                    transition-all
                    duration-500
                    hover:opacity-100
                  "
                />
              </div>
            </Reveal>

            <Reveal className="aspect-square overflow-hidden bg-muted" delay={0.15}>
              <div className="h-full w-full overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1574155088851-0c770818ba40?w=500&h=500&fit=crop&auto=format"
                  alt="Concert crowd"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="
                    h-full
                    w-full
                    object-cover
                    opacity-80
                    transition-all
                    duration-500
                    hover:opacity-100
                  "
                />
              </div>
            </Reveal>

            <Reveal className="aspect-square overflow-hidden bg-muted" delay={0.2}>
              <div className="h-full w-full overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?w=500&h=500&fit=crop&auto=format"
                  alt="Concert celebration"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="
                    h-full
                    w-full
                    object-cover
                    opacity-80
                    transition-all
                    duration-500
                    hover:opacity-100
                  "
                />
              </div>
            </Reveal>

            <Reveal className="col-span-2 aspect-video overflow-hidden bg-muted" delay={0.25}>
              <div className="h-full w-full overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1765224747205-3c9c23f0553c?w=900&h=500&fit=crop&auto=format"
                  alt="Singer silhouette blue stage"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="
                    h-full
                    w-full
                    object-cover
                    opacity-80
                    transition-all
                    duration-500
                    hover:opacity-100
                  "
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}

        <section
          id="contact"
          className="
            bg-background
            py-24
            scroll-mt-14
            md:py-36
          "
        >
          <div className="px-6 md:px-16">
            <Reveal>
              <div
                className="
                  mb-4
                  flex
                  items-center
                  gap-5
                "
              >
                <div
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.35em]
                    text-primary
                  "
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  CONTACT
                </div>

                <div className="h-px flex-1 bg-border" />
              </div>

              <h2
                className="
                  mb-16
                  text-5xl
                  font-black
                  uppercase
                  leading-none
                  text-foreground
                  md:text-7xl
                "
                style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                }}
              >
                GET IN
                <br />
                TOUCH!!
              </h2>
            </Reveal>

            <div
              className="
                grid
                gap-16
                md:grid-cols-1
                md:gap-24
              "
            >
              <Reveal direction="left">
                <div>
                  <div
                    className="
                      divide-y
                      divide-border
                      border-t
                      border-border
                    "
                  >
                    {[
                      {
                        role: "PRESS",
                        email: "bluediamond.sajotan@gmail.com",
                      },
                      {
                        role: "GENERAL",
                        email: "bluediamond.sajotan@gmail.com",
                      },
                    ].map((c) => (
                      <div
                        key={c.role}
                        className="
                          group
                          flex
                          items-center
                          justify-between
                          py-5
                        "
                      >
                        <span
                          className="
                            text-[11px]
                            font-bold
                            tracking-widest
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
                            font-light
                            text-foreground
                            transition-colors
                            hover:text-primary
                          "
                        >
                          {c.email}
                        </a>
                      </div>
                    ))}
                  </div>

                  <div
                    className="
                      mt-10
                      flex
                      flex-wrap
                      gap-3
                    "
                  >
                    {["INSTAGRAM", "YOUTUBE", "TIKTOK"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="
                          border
                          border-border
                          bg-transparent
                          px-4
                          py-2
                          text-[10px]
                          font-black
                          tracking-widest
                          text-muted-foreground
                          transition-all
                          duration-200
                          hover:border-primary
                          hover:text-primary
                        "
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal direction="right" delay={0.1}>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-7"
                >
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
                          mb-2
                          block
                          text-[10px]
                          font-bold
                          tracking-widest
                          text-muted-foreground
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
                          border-b
                          border-border
                          bg-transparent
                          py-3
                          text-sm
                          text-foreground
                          outline-none
                          transition-colors
                          placeholder:text-muted-foreground/40
                          focus:border-primary
                        "
                      />
                    </div>
                  ))}

                  <div>
                    <label
                      className="
                        mb-2
                        block
                        text-[10px]
                        font-bold
                        tracking-widest
                        text-muted-foreground
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
                        resize-none
                        border-b
                        border-border
                        bg-transparent
                        py-3
                        text-sm
                        text-foreground
                        outline-none
                        transition-colors
                        placeholder:text-muted-foreground/40
                        focus:border-primary
                      "
                    />
                  </div>

                  <button
                    type="submit"
                    className="
                      bg-primary
                      px-8
                      py-4
                      text-sm
                      font-black
                      uppercase
                      tracking-widest
                      text-primary-foreground
                      transition-colors
                      duration-200
                      hover:bg-foreground
                    "
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                    }}
                  >
                    SEND MESSAGE →
                  </button>
                </form>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FOOTER */}

        <footer
          className="
            border-t
            border-border
            bg-secondary
            py-10
          "
        >
          <div
            className="
              flex
              flex-col
              items-start
              justify-between
              gap-6
              px-6
              md:flex-row
              md:items-center
              md:px-16
            "
          >
            <Reveal>
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
                <span className="text-primary">BLUE </span>
                <span className="text-foreground">DIAMOND</span>
              </div>
            </Reveal>

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
              © 2026 BLUE DIAMOND — SAGA / JAPAN. ALL RIGHTS RESERVED.
              <br/>
              Developed By Zaw Ye Htike
            </div>
          </div>
        </footer>
      </main>

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

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </div>
  );
}