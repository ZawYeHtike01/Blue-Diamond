import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { db } from "../../firebase/firebase";
import { useApp } from "../App";
import { Pointer } from "lucide-react";

interface LunchEvent {
  id: string;
  date: string;
  songName: string;
  artistName: string;
  remark?: string;
  status?: string;
  createdBy?: string;
}

export default function LunchEventList() {
  const navigate = useNavigate();
  const { globalMsg,setGlobalMsg } = useApp();

  const [events, setEvents] = useState<LunchEvent[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Track Firebase Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load Lunch Events in real time
  useEffect(() => {
    const eventsQuery = query(
      collection(db, "lunchEvents"),
      orderBy("date", "asc"),
    );

    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const eventList = snapshot.docs.map((eventDoc) => ({
          id: eventDoc.id,
          ...eventDoc.data(),
        })) as LunchEvent[];

        setEvents(eventList);
        setLoading(false);
        setError(false);
      },
      (err) => {
        console.error("Failed to load Lunch Events:", err);
        setLoading(false);
        setError(true);
      },
    );

    return () => unsubscribe();
  }, []);

  // Delete Lunch Event
  const handleDelete = async (eventId: string) => {
    if (!currentUser) {
      setGlobalMsg({
        type: "error",
        message: "Please log in to delete a Lunch Event.",
      });
      return;
    }

    if (deletingId !== null) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this Lunch Event?",
    );

    if (!confirmed) return;

    setDeletingId(eventId);

    try {
      await deleteDoc(doc(db, "lunchEvents", eventId));

      setGlobalMsg({
        type: "success",
        message: "Lunch Event deleted successfully!",
      });
    } catch (err) {
      console.error("Failed to delete Lunch Event:", err);

      setGlobalMsg({
        type: "error",
        message: "Failed to delete Lunch Event.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Search by song or artist
  const filteredEvents = events.filter((event) =>
    `${event.songName ?? ""} ${event.artistName ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase().trim()),
  );

  return (
    <main className="min-h-screen border-x-2 border-t-2 border-[#168bdb] bg-[#050505] px-5 py-8 text-white sm:px-10 md:px-16">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-8 text-xl font-bold transition-opacity hover:opacity-70"
        style={{ position: "fixed", cursor: "pointer" }}
      >
        ← 戻す
      </button>
      <div className="mx-auto max-w-4xl mt-[3rem]">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black tracking-[3px] sm:text-2xl">
              LUNCH EVENT
            </h1>

            <p className="mt-3 text-sm text-neutral-500">
              Upcoming performances and song requests
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/luncheventlist/submit")}
            className="shrink-0 bg-[#397ff0] px-4 py-3 text-sm font-bold transition hover:bg-blue-600"
          >
            + Submit
          </button>
        </header>

        {/* Search */}
        <div className="mt-10">
          <input
            type="search"
            placeholder="Search song or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-0 border-b border-[#292929] bg-transparent py-4 text-sm outline-none placeholder:text-neutral-600 focus:border-[#397ff0]"
          />
        </div>

        {/* Event List */}
        <section className="mt-8 space-y-4">
          {loading || authLoading ? (
            <p className="py-12 text-center text-neutral-400">
              Loading events...
            </p>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-red-400">Unable to load Lunch Events.</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 text-sm text-[#397ff0] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-neutral-400">
                {search
                  ? "No matching Lunch Events found."
                  : "No Lunch Events yet."}
              </p>

              {!search && (
                <p className="mt-2 text-sm text-neutral-600">
                  Be the first to submit a song!
                </p>
              )}
            </div>
          ) : (
            filteredEvents.map((event) => (
              <article
                key={event.id}
                className="border border-[#292929] p-5 transition hover:border-[#397ff0] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold tracking-widest text-[#397ff0]">
                      {event.date}
                    </p>

                    <h2 className="mt-4 break-words text-xl font-bold sm:text-2xl">
                      {event.songName}
                    </h2>

                    <p className="mt-2 text-sm text-neutral-400">
                      Artist: {event.artistName}
                    </p>

                    {event.remark && (
                      <p className="mt-4 whitespace-pre-wrap break-words text-sm text-neutral-500">
                        {event.remark}
                      </p>
                    )}
                  </div>

                  {/* Delete button for logged-in users */}
                  {currentUser && (
                    <button
                      type="button"
                      onClick={() => handleDelete(event.id)}
                      disabled={deletingId !== null}
                      aria-label={`Delete ${event.songName}`}
                      className="shrink-0 border border-red-900 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === event.id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
