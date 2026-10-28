import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { useApp } from "../App";
import Reveal from "../Reveal";

interface NewsDetailsItem {
  id: string;
  title: string;
  details: string;
  author: string;
  authorUid: string;
  imageUrl: string;
  imageFileId: string;
  createdAt: Date | null;
  updatedAt?: Date | null;
}

const NewsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use existing global context
  const { news } = useApp();

  const [item, setItem] = useState<NewsDetailsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the selected news by Firestore document ID
  useEffect(() => {
    let cancelled = false;

    const fetchNews = async () => {
      if (!id) {
        setError("News ID not found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setItem(null);

      try {
        const snapshot = await getDoc(doc(db, "news", id));

        if (!snapshot.exists()) {
          if (!cancelled) {
            setError("News not found.");
          }
          return;
        }

        const data = snapshot.data();

        const timestampToDate = (value: unknown): Date | null => {
          if (
            value &&
            typeof value === "object" &&
            "toDate" in value &&
            typeof value.toDate === "function"
          ) {
            return value.toDate();
          }

          if (value instanceof Date) {
            return value;
          }

          return null;
        };

        if (!cancelled) {
          setItem({
            id: snapshot.id,
            title: data.title ?? "",
            details: data.details ?? "",
            author: data.author ?? "",
            authorUid: data.authorUid ?? "",
            imageUrl: data.imageUrl ?? "",
            imageFileId: data.imageFileId ?? "",
            createdAt: timestampToDate(data.createdAt),
            updatedAt: timestampToDate(data.updatedAt),
          });
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);

        if (!cancelled) {
          setError("Failed to load news. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchNews();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Find current news in the global news cache
  const currentIndex = news.findIndex((newsItem) => newsItem.id === id);

  const previousNews = currentIndex > 0 ? news[currentIndex - 1] : null;

  const nextNews =
    currentIndex >= 0 && currentIndex < news.length - 1
      ? news[currentIndex + 1]
      : null;

  const goPrevious = () => {
    if (previousNews) {
      navigate(`/admin/newdetails/${previousNews.id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goNext = () => {
    if (nextNews) {
      navigate(`/admin/newdetails/${nextNews.id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] px-6 py-32 text-center text-white">
        <p className="animate-pulse text-blue-300">Loading news...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#050816] px-6 py-32 text-center text-white">
        <p className="text-red-400">{error || "News not found."}</p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-lg border border-blue-400/40 px-5 py-3 text-sm text-white transition hover:bg-blue-500/20"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-8 text-xl font-bold transition-opacity hover:opacity-70"
            style={{ position: "fixed", cursor: "pointer" }}
          >
            ← 戻す
          </button>
        </Reveal>

        <Reveal>
          <article>
            {item.imageUrl && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="max-h-[500px] w-full object-cover"
                />
              </div>
            )}

            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-blue-300">
              <span>BLUE DIAMOND BAND</span>

              {item.createdAt && (
                <>
                  <span className="text-white/30">•</span>
                  <time dateTime={item.createdAt.toISOString()}>
                    {formatDate(item.createdAt)}
                  </time>
                </>
              )}
            </div>

            <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {item.title}
            </h1>

            {item.author && (
              <p className="mb-8 text-sm text-white/50">By {item.author}</p>
            )}

            <div className="whitespace-pre-wrap break-words border-b border-white/10 pb-10 text-base leading-8 text-white/80 sm:text-lg">
              {item.details}
            </div>
          </article>
        </Reveal>

        {/* Previous / Next Navigation */}
        <Reveal>
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
            <button
              onClick={goPrevious}
              disabled={!previousNews}
              className="rounded-lg border border-blue-400/40 px-4 py-3 text-sm text-white transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-30 sm:px-6"
            >
              ← Previous
            </button>

            <button
              onClick={goNext}
              disabled={!nextNews}
              className="rounded-lg bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-30 sm:px-6"
            >
              Next →
            </button>
          </div>

          <div className="mt-4 flex justify-between gap-4 text-xs text-white/50">
            <span className="max-w-[45%] truncate">
              {previousNews ? previousNews.title : "No previous news"}
            </span>

            <span className="max-w-[45%] truncate text-right">
              {nextNews ? nextNews.title : "No next news"}
            </span>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default NewsDetails;
