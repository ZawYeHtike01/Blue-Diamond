
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../../firebase/firebase";
import { useApp, type NewsItem } from "../App";

type ImageKitAuth = {
  token: string;
  expire: number;
  signature: string;
};

export default function NewsUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { news, setNews, setGlobalMsg } = useApp();

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileId, setImageFileId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load from Global Cache first; use Firestore only if missing.
  useEffect(() => {
    let active = true;

    async function loadNews() {
      if (!id) {
        setError("News ID မတွေ့ပါ။");
        setLoading(false);
        return;
      }

      const cachedNews = news.find((item) => item.id === id);

      if (cachedNews) {
        setTitle(cachedNews.title);
        setDetails(cachedNews.details);
        setAuthor(cachedNews.author);
        setImageUrl(cachedNews.imageUrl);
        setImageFileId(cachedNews.imageFileId);
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, "news", id));

        if (!active) return;

        if (!snapshot.exists()) {
          setError("News ကို ရှာမတွေ့ပါ။");
          return;
        }

        const data = snapshot.data();

        setTitle(data.title ?? "");
        setDetails(data.details ?? "");
        setAuthor(data.author ?? "");
        setImageUrl(data.imageUrl ?? "");
        setImageFileId(data.imageFileId ?? "");

        // Add the fetched document to the cache too.
        const cachedItem: NewsItem = {
          id: snapshot.id,
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

        setNews((current) =>
          current.some((item) => item.id === snapshot.id)
            ? current
            : [...current, cachedItem],
        );
      } catch (err) {
        console.error("Failed to load news:", err);

        if (active) {
          setError("News ကို ဖတ်လို့မရပါ။");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadNews();

    return () => {
      active = false;
    };
    // Intentionally load once per News ID, avoiding form resets
    // when the global cache changes.
  }, [id, setNews]);

  // Upload a new image to ImageKit only when a file is selected.
  async function uploadImage(file: File) {
    const getImageKitAuth = httpsCallable<void, ImageKitAuth>(
      functions,
      "getImageKitAuth",
    );

    const result = await getImageKitAuth();
    const { token, expire, signature } = result.data;

    const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

    if (!publicKey) {
      throw new Error("ImageKit public key မသတ်မှတ်ရသေးပါ။");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("fileName", `news-${Date.now()}-${file.name}`);
    formData.append("publicKey", publicKey);
    formData.append("token", token);
    formData.append("expire", String(expire));
    formData.append("signature", signature);
    formData.append("useUniqueFileName", "true");

    const response = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Image upload မအောင်မြင်ပါ။");
    }

    return {
      url: data.url as string,
      fileId: data.fileId as string,
    };
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      setError("News ID မတွေ့ပါ။");
      return;
    }

    if (!title.trim() || !details.trim() || !author.trim()) {
      setError("အချက်အလက်အားလုံး ဖြည့်ပေးပါ။");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const newsRef = doc(db, "news", id);

      let nextImageUrl = imageUrl;
      let nextImageFileId = imageFileId;

      // No file selected = keep the existing image.
      if (imageFile) {
        const uploaded = await uploadImage(imageFile);
        nextImageUrl = uploaded.url;
        nextImageFileId = uploaded.fileId;
      }

      // Firestore update first.
      await updateDoc(newsRef, {
        title: title.trim(),
        details: details.trim(),
        author: author.trim(),
        imageUrl: nextImageUrl,
        imageFileId: nextImageFileId,
        updatedAt: serverTimestamp(),
      });

      // Update the global cache only after Firestore succeeds.
      setNews((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                title: title.trim(),
                details: details.trim(),
                author: author.trim(),
                imageUrl: nextImageUrl,
                imageFileId: nextImageFileId,
                updatedAt: new Date(),
              }
            : item,
        ),
      );

      setGlobalMsg({
        type: "success",
        message: "News ကို Update လုပ်ပြီးပါပြီ။",
      });

      navigate("/admin/newslist");
    } catch (err) {
      console.error("Failed to update news:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Update လုပ်ရာတွင် အမှားဖြစ်သွားပါသည်။";

      setError(message);

      setGlobalMsg({
        type: "error",
        message,
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen border-x-2 border-t-2 border-[#168bdb] bg-[#050505] px-5 py-8 text-white sm:px-10 md:px-16">
        <div className="mx-auto mt-[3rem] max-w-4xl text-neutral-500">
          Loading news...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen border-x-2 border-t-2 border-[#168bdb] bg-[#050505] px-5 py-8 text-white sm:px-10 md:px-16">
      <div className="mx-auto mt-[3rem] max-w-4xl">
        <button
          type="button"
          onClick={() => navigate("/admin/newslist")}
          className="mb-8 text-xl font-bold transition-opacity hover:opacity-70"
        >
          ← 戻す
        </button>

        <header className="mb-10">
          <h1 className="text-xl font-black tracking-[3px] sm:text-2xl">
            UPDATE NEWS
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Edit your news article
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 border border-red-900 bg-red-950/30 p-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-7">
          <div>
            <label
              htmlFor="news-title"
              className="mb-2 block text-sm font-semibold text-neutral-300"
            >
              Title
            </label>
            <input
              id="news-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
              className="w-full border border-[#292929] bg-[#090909] px-4 py-3 text-white outline-none transition focus:border-[#397ff0]"
              placeholder="Enter news title"
            />
          </div>

          <div>
            <label
              htmlFor="news-author"
              className="mb-2 block text-sm font-semibold text-neutral-300"
            >
              Author
            </label>
            <input
              id="news-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full border border-[#292929] bg-[#090909] px-4 py-3 text-white outline-none transition focus:border-[#397ff0]"
              placeholder="Enter author name"
            />
          </div>

          <div>
            <label
              htmlFor="news-details"
              className="mb-2 block text-sm font-semibold text-neutral-300"
            >
              Details
            </label>
            <textarea
              id="news-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              rows={8}
              className="w-full resize-y border border-[#292929] bg-[#090909] px-4 py-3 text-white outline-none transition focus:border-[#397ff0]"
              placeholder="Write your news..."
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-neutral-300">
              News Image
            </label>

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Current news"
                className="mb-4 max-h-72 w-full border border-[#292929] object-contain"
              />
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;

                if (file && file.size > 5 * 1024 * 1024) {
                  setError("ပုံအရွယ်အစား 5MB ထက်မကျော်ရပါ။");
                  e.target.value = "";
                  setImageFile(null);
                  return;
                }

                setError("");
                setImageFile(file);
              }}
              className="block w-full text-sm text-neutral-400 file:mr-4 file:border-0 file:bg-[#397ff0] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-blue-600"
            />

            <p className="mt-2 text-xs text-neutral-600">
              ပုံအသစ်မရွေးပါက လက်ရှိပုံကို ဆက်သုံးပါမည်။ Maximum 5MB.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-[#292929] pt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#397ff0] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update News"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => navigate("/admin/newslist")}
              className="border border-[#292929] px-6 py-3 text-sm font-semibold text-neutral-300 transition hover:border-neutral-500 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
