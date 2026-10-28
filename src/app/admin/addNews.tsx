
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../App";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions } from "../../firebase/firebase";

type ImageKitAuth = {
  token: string;
  expire: number;
  signature: string;
};

type ImageKitUploadResponse = {
  url?: string;
  fileId?: string;
  name?: string;
  message?: string;
};

export default function AddNews() {
  const navigate = useNavigate();
  const { globalMsg, setGlobalMsg, resetNewsCache } = useApp();

  const [form, setForm] = useState({
    title: "",
    details: "",
    author: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate and clean up image preview.
  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setGlobalMsg(null);
    setError("");
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setError("");
    setGlobalMsg(null);

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("JPG、PNG、WebP 形式の画像を選択してください。");
      e.target.value = "";
      setImage(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("画像サイズは5MB以下にしてください。");
      e.target.value = "";
      setImage(null);
      return;
    }

    setImage(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setGlobalMsg(null);

    const user = auth.currentUser;

    if (!user) {
      setError("ログインしてから送信してください。");
      return;
    }

    if (
      !form.title.trim() ||
      !form.details.trim() ||
      !form.author.trim()
    ) {
      setError("タイトル、詳細、作者名を入力してください。");
      return;
    }

    // Only require the ImageKit public key when an image is selected.
    const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

    if (image && !publicKey) {
      setError("VITE_IMAGEKIT_PUBLIC_KEY が設定されていません。");
      return;
    }

    setLoading(true);

    try {
      // Image is optional. Default to empty values.
      let imageUrl = "";
      let imageFileId = "";
      let imageName = "";

      // Upload only when an image was selected.
      if (image) {
        const getImageKitAuth = httpsCallable<
          Record<string, never>,
          ImageKitAuth
        >(functions, "getImageKitAuth");

        const authResult = await getImageKitAuth({});
        const { token, expire, signature } = authResult.data;

        if (!token || !signature || !expire) {
          throw new Error(
            "ImageKit authentication response is incomplete.",
          );
        }

        const uploadData = new FormData();

        uploadData.append("file", image);
        uploadData.append("fileName", `${Date.now()}-${image.name}`);
        uploadData.append("publicKey", publicKey);
        uploadData.append("token", token);
        uploadData.append("expire", String(expire));
        uploadData.append("signature", signature);

        const uploadResponse = await fetch(
          "https://upload.imagekit.io/api/v1/files/upload",
          {
            method: "POST",
            body: uploadData,
          },
        );

        const uploadedImage =
          (await uploadResponse.json()) as ImageKitUploadResponse;

        if (!uploadResponse.ok) {
          throw new Error(
            `ImageKit upload failed (${uploadResponse.status}): ${
              uploadedImage.message || "Please check ImageKit settings."
            }`,
          );
        }

        if (!uploadedImage.url || !uploadedImage.fileId) {
          throw new Error(
            "ImageKit did not return the image URL or file ID.",
          );
        }

        imageUrl = uploadedImage.url;
        imageFileId = uploadedImage.fileId;
        imageName = uploadedImage.name || image.name;
      }

      // Save news whether or not an image was selected.
      const newsData = {
        title: form.title.trim(),
        details: form.details.trim(),
        author: form.author.trim(),
        imageUrl,
        imageFileId,
        imageName,
        authorUid: user.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "news"), newsData);

      // Reset global pagination cache.
      resetNewsCache();

      // Reset form after successful submission.
      setForm({
        title: "",
        details: "",
        author: "",
      });

      setImage(null);

      const fileInput = document.getElementById(
        "news-image",
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      setGlobalMsg("News saved successfully!");
      navigate("/admin/newslist");
    } catch (err: unknown) {
      console.error("News submission failed:", err);

      const firebaseError = err as {
        code?: string;
        message?: string;
        details?: unknown;
      };

      console.error("Error code:", firebaseError.code);
      console.error("Error message:", firebaseError.message);
      console.error("Error details:", firebaseError.details);

      setError(
        `送信に失敗しました${
          firebaseError.code ? ` [${firebaseError.code}]` : ""
        }: ${firebaseError.message || "もう一度お試しください。"}`,
      );

      setGlobalMsg(null);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "block w-full rounded-none border-0 border-b border-[#202020] bg-transparent px-0 pb-[14px] text-sm text-white outline-none transition-colors focus:border-[#3980f5] placeholder:text-[#454545]";

  const labelClass =
    "mb-[22px] block text-[10px] font-extrabold tracking-[1px] text-[#858585]";

  return (
    <main className="min-h-screen border-x-2 border-t-2 border-[#168bdb] bg-[#050505] px-[22px] py-[30px] text-white sm:px-[5%]">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="fixed z-10 text-xl font-bold transition-opacity hover:opacity-70"
        style={{ cursor: "pointer" }}
      >
        ← 戻す
      </button>

      <section className="mx-auto mt-[54px] w-full max-w-[472px] pb-8">
        <h1 className="mb-[70px] text-center text-[23px] font-black tracking-[4px]">
          NEWS / ANNOUNCEMENT
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-[35px]">
            <label htmlFor="title" className={labelClass}>
              TITLE <span className="text-[#397ff0]">*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="News title"
              value={form.title}
              onChange={handleChange}
              maxLength={150}
              required
              className={inputClass}
            />
          </div>

          {/* Optional Image Upload */}
          <div className="mb-[35px]">
            <label htmlFor="news-image" className={labelClass}>
              COVER IMAGE{" "}
              <span className="text-[#656565]">(OPTIONAL)</span>
            </label>

            <label
              htmlFor="news-image"
              className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-[#303030] bg-[#0b0b0b] px-4 py-6 text-center transition-colors hover:border-[#397ff0]"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="News image preview"
                  className="max-h-[260px] w-full object-contain"
                />
              ) : (
                <>
                  <span className="text-3xl text-[#397ff0]">↑</span>
                  <span className="text-sm font-bold">SELECT IMAGE</span>
                  <span className="text-[11px] text-[#656565]">
                    Optional · JPG / PNG / WEBP · MAX 5 MB
                  </span>
                </>
              )}
            </label>

            <input
              id="news-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="sr-only"
            />

            {image && (
              <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                <span className="break-all text-[#858585]">
                  {image.name}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setImage(null);

                    const input = document.getElementById(
                      "news-image",
                    ) as HTMLInputElement | null;

                    if (input) input.value = "";
                  }}
                  className="shrink-0 text-[#397ff0] hover:text-white"
                >
                  REMOVE
                </button>
              </div>
            )}
          </div>

          {/* News Details */}
          <div className="mb-[35px]">
            <label htmlFor="details" className={labelClass}>
              NEWS DETAILS <span className="text-[#397ff0]">*</span>
            </label>

            <textarea
              id="details"
              name="details"
              placeholder="Write your news details..."
              value={form.details}
              onChange={handleChange}
              rows={6}
              maxLength={10000}
              required
              className={`${inputClass} min-h-[140px] resize-y leading-7`}
            />

            <p className="mt-2 text-right text-[10px] text-[#555]">
              {form.details.length}/10000
            </p>
          </div>

          {/* Author */}
          <div className="mb-[35px]">
            <label htmlFor="author" className={labelClass}>
              AUTHOR <span className="text-[#397ff0]">*</span>
            </label>

            <input
              id="author"
              name="author"
              type="text"
              placeholder="Author name"
              value={form.author}
              onChange={handleChange}
              maxLength={100}
              required
              className={inputClass}
            />
          </div>

          {error && (
            <p className="mb-5 text-xs leading-6 text-red-400" role="alert">
              {error}
            </p>
          )}

          {globalMsg && (
            <p className="mb-5 text-xs leading-6 text-[#6ba0ff]" role="status">
              {globalMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mx-auto mt-[50px] flex h-[56px] w-[186px] items-center justify-center gap-2 bg-[#397ff0] text-[13px] font-black tracking-[1px] transition hover:bg-[#2469d9] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "SUBMITTING..." : "SUBMIT →"}
          </button>
        </form>
      </section>
    </main>
  );
}
