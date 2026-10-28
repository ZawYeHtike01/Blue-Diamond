
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { useApp, type NewsItem } from "../App";
import { db } from "../../firebase/firebase";

const PAGE_SIZE = 10;

export default function NewsList() {
  const navigate = useNavigate();

  const {
    news,
    setNews,
    lastNewsDoc,
    setLastNewsDoc,
    hasMoreNews,
    setHasMoreNews,
    newsLoaded,
    setNewsLoaded,
    resetNewsCache,
    setGlobalMsg,
    user,
  } = useApp();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load the first 10 documents, then fetch 10 more per click.
  const loadMore = useCallback(async () => {
    if (loading || (!hasMoreNews && newsLoaded)) return;

    setLoading(true);
    setError(false);

    try {
      const constraints = [
        orderBy("createdAt", "desc"),
        ...(lastNewsDoc ? [startAfter(lastNewsDoc)] : []),
        limit(PAGE_SIZE),
      ];

      const newsQuery = query(collection(db, "news"), ...constraints);
      const snapshot = await getDocs(newsQuery);

      const newItems: NewsItem[] = snapshot.docs.map((newsDoc) => {
        const data = newsDoc.data();

        return {
          id: newsDoc.id,
          title: data.title ?? "",
          details: data.details ?? "",
          author: data.author ?? "",
          authorUid: data.authorUid ?? "",
          imageUrl: data.imageUrl ?? "",
          imageFileId: data.imageFileId ?? "",
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : null,
          updatedAt:
            data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate()
              : null,
        };
      });

      setNews((current) => {
        const existingIds = new Set(current.map((item) => item.id));

        return [
          ...current,
          ...newItems.filter((item) => !existingIds.has(item.id)),
        ];
      });

      const nextCursor: QueryDocumentSnapshot<DocumentData> | null =
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1]
          : null;

      if (nextCursor) {
        setLastNewsDoc(nextCursor);
      }

      setHasMoreNews(snapshot.docs.length === PAGE_SIZE);
      setNewsLoaded(true);
    } catch (err) {
      console.error("Failed to load News:", err);
      setError(true);

      setGlobalMsg({
        type: "error",
        message: "Unable to load News.",
      });
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    hasMoreNews,
    newsLoaded,
    lastNewsDoc,
    setNews,
    setLastNewsDoc,
    setHasMoreNews,
    setNewsLoaded,
    setGlobalMsg,
  ]);

  // Fetch the first page only when the global cache is empty.
  useEffect(() => {
    if (!newsLoaded) {
      void loadMore();
    }
  }, [newsLoaded, loadMore]);

  // Delete News and remove it from the global cache.
  const handleDelete = async (item: NewsItem) => {
    if (!user) {
      setGlobalMsg({
        type: "error",
        message: "Please log in to delete News.",
      });
      return;
    }

    if (deletingId !== null) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`,
    );

    if (!confirmed) return;

    setDeletingId(item.id);

    try {
      await deleteDoc(doc(db, "news", item.id));

      setNews((current) => current.filter((newsItem) => newsItem.id !== item.id));

      setGlobalMsg({
        type: "success",
        message: "News deleted successfully!",
      });
    } catch (err) {
      console.error("Failed to delete News:", err);

      setGlobalMsg({
        type: "error",
        message: "Failed to delete News.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "—";

    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredNews = news.filter((item) =>
    `${item.title} ${item.author}`
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

      <div className="mx-auto mt-[3rem] max-w-4xl">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black tracking-[3px] sm:text-2xl">
              NEWS MANAGEMENT
            </h1>

            <p className="mt-3 text-sm text-neutral-500">
              Manage news articles
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/addnews")}
            className="shrink-0 bg-[#397ff0] px-4 py-3 text-sm font-bold transition hover:bg-blue-600"
          >
            + Submit
          </button>
        </header>

        <div className="mt-10">
          <input
            type="search"
            placeholder="Search title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-0 border-b border-[#292929] bg-transparent py-4 text-sm outline-none placeholder:text-neutral-600 focus:border-[#397ff0]"
          />
        </div>

        <section className="mt-8 space-y-4">
          {loading && news.length === 0 ? (
            <p className="py-12 text-center text-neutral-400">
              Loading news...
            </p>
          ) : error && news.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-red-400">Unable to load News.</p>

              <button
                type="button"
                onClick={() => {
                  setError(false);
                  void loadMore();
                }}
                className="mt-4 text-sm text-[#397ff0] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-neutral-400">
                {search ? "No matching News found." : "No News yet."}
              </p>
            </div>
          ) : (
            filteredNews.map((item) => (
              <article
                key={item.id}
                className="border border-[#292929] p-5 transition hover:border-[#397ff0] sm:p-6"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <h2 className="break-words text-lg font-bold sm:text-xl">
                      {item.title || "Untitled"}
                    </h2>

                    <p className="mt-2 text-sm text-neutral-400">
                      Author: {item.author || "Unknown"}
                    </p>

                    <p className="mt-2 text-xs text-neutral-500">
                      Posted: {formatDate(item.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {user && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/newsupdate/${item.id}`)
                          }
                          className="border border-[#397ff0] px-3 py-2 text-xs font-semibold text-[#6da0ff] transition hover:bg-[#397ff0] hover:text-white"
                        >
                          Update
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDelete(item)}
                          disabled={deletingId !== null}
                          className="border border-red-900 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === item.id ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        {newsLoaded && hasMoreNews && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => void loadMore()}
              disabled={loading}
              className="border border-[#292929] px-8 py-3 text-sm font-bold transition hover:border-[#397ff0] disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        {newsLoaded && !hasMoreNews && news.length > 0 && (
          <p className="mt-8 text-center text-sm text-neutral-600">
            All news loaded.
          </p>
        )}
      </div>
    </main>
  );
}
