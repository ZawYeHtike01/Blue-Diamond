
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import Reveal from "../../Reveal";
import { db } from "../../../firebase/firebase";
import { useApp } from "../../App";

interface LunchSong {
  id: string;
  date: string;
  songName: string;
  artistName: string;
  remark?: string;
}

const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getMonday = (date: Date): Date => {
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);

  const day = monday.getDay();
  monday.setDate(monday.getDate() + (day === 0 ? -6 : 1 - day));

  return monday;
};

export default function LunchEvent() {
  const { weeklyEvents = [], setWeeklyEvents } = useApp();

  const [selectedDate, setSelectedDate] = useState(() =>
    getDateKey(new Date()),
  );

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Current week's Monday to Sunday
  const weekDates = useMemo(() => {
    const monday = getMonday(new Date());

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  }, []);

  const mondayKey = getDateKey(weekDates[0]);

  const nextMonday = new Date(weekDates[0]);
  nextMonday.setDate(nextMonday.getDate() + 7);

  const nextMondayKey = getDateKey(nextMonday);

  // Fetch this week's lunch events from Firestore
  useEffect(() => {
    setLoading(true);
    setLoadError(false);

    const eventsQuery = query(
      collection(db, "lunchEvents"),
      where("date", ">=", mondayKey),
      where("date", "<", nextMondayKey),
    );

    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const songList: LunchSong[] = snapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,
            date: data.date ?? "",
            songName: data.songName ?? "",
            artistName: data.artistName ?? "",
            remark: data.remark ?? "",
          };
        });

        setWeeklyEvents(songList);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load lunch events:", error);
        setLoadError(true);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [mondayKey, nextMondayKey, setWeeklyEvents]);

  // Dates that have scheduled events
  const eventDates = useMemo(
    () => new Set(weeklyEvents.map((song: LunchSong) => song.date)),
    [weeklyEvents],
  );

  // Events for the selected date
  const songs = useMemo(
    () =>
      weeklyEvents.filter(
        (song: LunchSong) => song.date === selectedDate,
      ),
    [weeklyEvents, selectedDate],
  );

  return (
    <div className="w-full pb-10">
      {/* Logo */}
      <Reveal direction="up" delay={0.1}>
        <div
          className="text-center text-[10rem] font-black leading-none tracking-tight"
          style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
        >
          <span className="text-primary">B</span>
          <span className="text-foreground">D</span>
        </div>
      </Reveal>

      {/* Heading */}
      <Reveal direction="up" delay={0.2}>
        <div
          className="text-center"
          style={{
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontSize: "2rem",
          }}
        >
          <span className="text-foreground">THIS WEEK</span>
          <br />
          <span className="text-foreground">LUNCH LIVE EVENT</span>
        </div>
      </Reveal>

      {/* Week Calendar - stays outside the scroll area */}
      <div className="mt-6 mb-8 flex flex-wrap justify-center gap-3 sm:gap-5">
        {weekDates.map((date, index) => {
          const dateKey = getDateKey(date);
          const isSelected = selectedDate === dateKey;
          const hasEvents = eventDates.has(dateKey);

          return (
            <Reveal
              key={dateKey}
              direction="right"
              delay={0.1 + index * 0.04}
            >
              <button
                type="button"
                onClick={() => setSelectedDate(dateKey)}
                aria-pressed={isSelected}
                aria-label={`Show songs for ${dateKey}`}
                className={`
                  flex h-9 w-9 items-center justify-center
                  rounded-full border text-sm font-bold
                  transition-all duration-200
                  ${
                    hasEvents
                      ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
                      : "border-neutral-600 bg-[#ABABAB] text-white hover:border-primary"
                  }
                  ${
                    isSelected
                      ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : ""
                  }
                `}
                style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                }}
              >
                {date.getDate()}
              </button>
            </Reveal>
          );
        })}
      </div>

      {/* Selected Date + Song List: scroll only this section */}
      <section
        className="
          mx-auto w-full max-w-md px-4
          h-[calc(100dvh-380px)]
          min-h-[200px]
          overflow-y-auto
          overscroll-contain
          pb-6
        "
      >
        
        <div className="mb-5 border-b border-border pb-3">
          <p className="text-xs tracking-[0.2em] text-primary">
            SELECTED DATE
          </p>

          <h2 className="mt-2 text-xl font-bold text-foreground">
            {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            )}
          </h2>
        </div>

        {/* Loading / Error / Empty / Songs */}
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading songs...
          </p>
        ) : loadError ? (
          <p className="py-8 text-center text-sm text-red-400">
            Failed to load songs. Please try again.
          </p>
        ) : songs.length === 0 ? (
          <div className="border border-dashed border-border px-4 py-10 text-center">
            <p className="text-foreground">No songs scheduled.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no lunch event songs for this date yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {songs.map((song, index) => (
              <Reveal
                key={song.id}
                direction="up"
                delay={index * 0.08}
              >
                <article className="border border-border p-4 transition-colors hover:border-primary">
                  <p className="text-xs font-bold tracking-widest text-primary">
                    SONG {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="mt-3 break-words text-lg font-bold text-foreground">
                    {song.songName}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Artist: {song.artistName}
                  </p>

                  {song.remark && (
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                      {song.remark}
                    </p>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
