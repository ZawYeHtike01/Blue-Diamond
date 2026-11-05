
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  Timestamp,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";

import {
  getAuth,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import { db } from "../../firebase/firebase";
import { useApp } from "../App";
import { Trash2, AlertTriangle } from "lucide-react";

interface MusicRequest {
  id: string;
  name: string;
  songName: string;
  artistName: string;
  remark?: string;
  status?: string;
  createdAt: Timestamp | null;
}

const PAGE_SIZE = 2;

export default function LunchMusicRequestList() {
  const navigate = useNavigate();
  const { setGlobalMsg } = useApp();

  // Request Data
  const [requests, setRequests] = useState<MusicRequest[]>([]);
  const [search, setSearch] = useState("");

  // Loading States
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  // Pagination
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [hasMore, setHasMore] = useState(true);

  // Authentication
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Delete Modal
  const [selectedRequest, setSelectedRequest] =
    useState<MusicRequest | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ==========================================
  // Firebase Authentication
  // ==========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ==========================================
  // Load Initial 5 Music Requests
  // ==========================================

  useEffect(() => {
    if (authLoading || !currentUser) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadInitialRequests = async () => {
      setLoading(true);
      setError(false);

      try {
        const requestsQuery = query(
          collection(db, "lunchMusicRequests"),
          orderBy("createdAt", "desc"),
          orderBy("__name__", "desc"),
          limit(PAGE_SIZE)
        );

        const snapshot = await getDocs(requestsQuery);

        if (cancelled) return;

        const requestList = snapshot.docs.map((requestDoc) => ({
          id: requestDoc.id,
          ...requestDoc.data(),
        })) as MusicRequest[];

        setRequests(requestList);

        setLastDoc(
          snapshot.docs.length > 0
            ? snapshot.docs[snapshot.docs.length - 1]
            : null
        );

        setHasMore(snapshot.docs.length === PAGE_SIZE);
      } catch (err) {
        console.error("Failed to load Music Requests:", err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialRequests();

    return () => {
      cancelled = true;
    };
  }, [currentUser, authLoading]);

  // ==========================================
  // Load More Requests (Next 5)
  // ==========================================

  const loadMoreRequests = async () => {
    if (!lastDoc || !hasMore || loadingMore) return;

    setLoadingMore(true);

    try {
      const nextQuery = query(
        collection(db, "lunchMusicRequests"),
        orderBy("createdAt", "desc"),
        orderBy("__name__", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );

      const snapshot = await getDocs(nextQuery);

      const newRequests = snapshot.docs.map((requestDoc) => ({
        id: requestDoc.id,
        ...requestDoc.data(),
      })) as MusicRequest[];

      setRequests((prev) => [...prev, ...newRequests]);

      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }

      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to load more requests:", err);

      setGlobalMsg({
        type: "error",
        message: "Failed to load more requests.",
      });
    } finally {
      setLoadingMore(false);
    }
  };

  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return "Date unavailable";

    return timestamp.toDate().toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // Delete Confirmation
  // ==========================================

  const handleDelete = (request: MusicRequest) => {
    if (!currentUser) {
      setGlobalMsg({
        type: "error",
        message: "Please log in to delete a Music Request.",
      });

      return;
    }

    if (deletingId !== null) return;

    setSelectedRequest(request);
  };

  // ==========================================
  // Confirm Delete
  // ==========================================

  const confirmDelete = async () => {
    if (!selectedRequest || !currentUser || deletingId !== null) {
      return;
    }

    const requestId = selectedRequest.id;

    setDeletingId(requestId);

    try {
      await deleteDoc(doc(db, "lunchMusicRequests", requestId));

      setRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );

      setSelectedRequest(null);

      setGlobalMsg({
        type: "success",
        message: "Music Request deleted successfully!",
      });
    } catch (err) {
      console.error("Failed to delete Music Request:", err);

      setGlobalMsg({
        type: "error",
        message: "Failed to delete Music Request.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // Close Modal with Escape Key
  // ==========================================

  useEffect(() => {
    if (!selectedRequest || deletingId !== null) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedRequest(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedRequest, deletingId]);

  // ==========================================
  // Search
  // ==========================================

  const filteredRequests = requests.filter((request) =>
    `${request.name ?? ""} ${request.songName ?? ""} ${request.artistName ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  // ==========================================
  // Render
  // ==========================================

  return (
    <main className="min-h-screen border-x-2 border-t-2 border-[#168bdb] bg-[#050505] px-5 py-8 text-white sm:px-10 md:px-16">

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-8 text-xl font-bold transition-opacity hover:opacity-70"
        style={{ position: "fixed", cursor: "pointer" }}
      >
        ← 戻す
      </button>

      <div className="mx-auto mt-[3rem] max-w-4xl">

        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black tracking-[3px] sm:text-2xl">
              LUNCH MUSIC REQUESTS
            </h1>

            <p className="mt-3 text-sm text-neutral-500">
              Songs requested by our audience
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-2xl font-black text-[#397ff0]">
              {requests.length}
            </p>

            <p className="text-xs text-neutral-500">
              Loaded Requests
            </p>
          </div>
        </header>

        {/* Search */}
        <div className="mt-10">
          <input
            type="search"
            placeholder="Search requester, song or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-0 border-b border-[#292929] bg-transparent py-4 text-sm outline-none placeholder:text-neutral-600 focus:border-[#397ff0]"
          />
        </div>

        {/* Request List */}
        <section className="mt-8 space-y-4">

          {authLoading || loading ? (
            <p className="py-12 text-center text-neutral-400">
              Loading music requests...
            </p>
          ) : !currentUser ? (
            <p className="py-12 text-center text-red-400">
              Please log in to view music requests.
            </p>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-red-400">
                Unable to load Music Requests.
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 text-sm text-[#397ff0] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-neutral-400">
                {search
                  ? "No matching Music Requests found."
                  : "No Music Requests yet."}
              </p>

              {!search && (
                <p className="mt-2 text-sm text-neutral-600">
                  New requests will appear here.
                </p>
              )}
            </div>
          ) : (
            filteredRequests.map((request) => (
              <article
                key={request.id}
                className="border border-[#292929] p-5 transition hover:border-[#397ff0] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0 flex-1">

                    {/* Date */}
                    <p className="text-xs font-bold tracking-widest text-[#397ff0]">
                      {formatDate(request.createdAt)}
                    </p>

                    {/* Song */}
                    <h2 className="mt-4 break-words text-xl font-bold sm:text-2xl">
                      {request.songName}
                    </h2>

                    {/* Artist */}
                    <p className="mt-2 text-sm text-neutral-400">
                      Artist: {request.artistName}
                    </p>

                    {/* Requester */}
                    <p className="mt-3 text-xs text-neutral-500">
                      Requested by: {request.name}
                    </p>

                    {/* Remark */}
                    {request.remark && (
                      <p className="mt-4 whitespace-pre-wrap break-words text-sm text-neutral-500">
                        {request.remark}
                      </p>
                    )}

                    {/* Status */}
                    <span className="mt-4 inline-block border border-[#397ff0]/30 px-3 py-1 text-xs text-[#397ff0]">
                      {request.status ?? "pending"}
                    </span>

                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(request)}
                    disabled={deletingId !== null}
                    aria-label={`Delete ${request.songName}`}
                    className="flex shrink-0 items-center gap-2 border border-red-900 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>

                </div>
              </article>
            ))
          )}

        </section>

        {/* Load More Button */}
        {!loading &&
          !error &&
          currentUser &&
          hasMore &&
          !search.trim() && (
            <div className="flex justify-center pt-8">
              <button
                type="button"
                onClick={loadMoreRequests}
                disabled={loadingMore}
                className="border border-[#397ff0] px-8 py-3 text-sm font-bold tracking-wider text-[#397ff0] transition hover:bg-[#397ff0] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingMore ? (
                  "LOADING..."
                ) : (
                  "LOAD MORE ↓"
                )}
              </button>
            </div>
          )}

        {/* End of List */}
        {!loading &&
          !error &&
          currentUser &&
          requests.length > 0 &&
          !hasMore &&
          !search.trim() && (
            <p className="py-8 text-center text-xs tracking-widest text-neutral-600">
              — ALL REQUESTS LOADED —
            </p>
          )}

        {/* Search Result Count */}
        {!loading &&
          currentUser &&
          search.trim() !== "" &&
          filteredRequests.length > 0 && (
            <p className="mt-6 text-center text-xs text-neutral-500">
              {filteredRequests.length} matching requests
            </p>
          )}

      </div>

      {/* ====================================== */}
      {/* Delete Confirmation Modal */}
      {/* ====================================== */}

      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm"
          onClick={(e) => {
            if (
              e.target === e.currentTarget &&
              deletingId === null
            ) {
              setSelectedRequest(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="w-full max-w-md border border-[#292929] bg-[#101010] p-6 shadow-2xl sm:p-8"
          >

            {/* Warning Icon */}
            <div className="mb-6 flex h-14 w-14 items-center justify-center border border-red-900 bg-red-950/40">
              <AlertTriangle
                size={26}
                className="text-red-400"
              />
            </div>

            {/* Modal Title */}
            <h2
              id="delete-modal-title"
              className="text-xl font-black tracking-wide text-white"
            >
              Delete Music Request?
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              Are you sure you want to delete this Music Request?
              This action cannot be undone.
            </p>

            {/* Request Information */}
            <div className="mt-5 border border-[#292929] bg-[#080808] p-4">

              <p className="text-xs font-bold tracking-widest text-[#397ff0]">
                {selectedRequest.name}
              </p>

              <p className="mt-2 break-words font-bold text-white">
                {selectedRequest.songName}
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Artist: {selectedRequest.artistName}
              </p>

            </div>

            {/* Modal Actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              {/* Cancel */}
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                disabled={deletingId !== null}
                className="border border-[#333] px-5 py-3 text-sm font-bold text-neutral-300 transition hover:bg-[#222] disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Confirm Delete */}
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="flex items-center justify-center gap-2 bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={15} />

                {deletingId !== null
                  ? "Deleting..."
                  : "Delete Request"}
              </button>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}
