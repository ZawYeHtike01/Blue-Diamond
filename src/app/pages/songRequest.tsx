
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function SongRequest() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    songName: "",
    artistName: "",
    remark: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.songName.trim() ||
      !form.artistName.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setError("Email service is not configured.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Save request to Firestore.
      const requestData = {
        name: form.name.trim(),
        songName: form.songName.trim(),
        artistName: form.artistName.trim(),
        remark: form.remark.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "lunchMusicRequests"),
        requestData,
      );

      // Step 2: Send notification email to Admin.
      await emailjs.send(
        serviceId,
        templateId,
        {
          requester_name: form.name.trim(),
          song_name: form.songName.trim(),
          artist_name: form.artistName.trim(),
          remark: form.remark.trim() || "No remark",
          request_id: docRef.id,
          submitted_at: new Date().toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo",
          }),
        },
        {
          publicKey,
        },
      );

      setForm({
        name: "",
        songName: "",
        artistName: "",
        remark: "",
      });

      setSuccess(
        "Your music request has been submitted successfully!",
      );
    } catch (err) {
      console.error("Music request submission failed:", err);

      setError(
        "Something went wrong. Please try again later.",
      );
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
      {/* Back Button */}
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
          LUNCH TIME MUSIC REQUEST
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-[35px]">
            <label htmlFor="name" className={labelClass}>
              NAME <span className="text-[#397ff0]">*</span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              maxLength={100}
              required
              className={inputClass}
            />
          </div>

          {/* Song Name */}
          <div className="mb-[35px]">
            <label htmlFor="songName" className={labelClass}>
              Request Song <span className="text-[#397ff0]">*</span>
            </label>

            <input
              id="songName"
              name="songName"
              type="text"
              placeholder="Song name"
              value={form.songName}
              onChange={handleChange}
              maxLength={150}
              required
              className={inputClass}
            />
          </div>

          {/* Artist Name */}
          <div className="mb-[35px]">
            <label htmlFor="artistName" className={labelClass}>
              Artist Name <span className="text-[#397ff0]">*</span>
            </label>

            <input
              id="artistName"
              name="artistName"
              type="text"
              placeholder="Artist name"
              value={form.artistName}
              onChange={handleChange}
              maxLength={150}
              required
              className={inputClass}
            />
          </div>

          {/* Remark */}
          <div className="mb-[35px]">
            <label htmlFor="remark" className={labelClass}>
              Remark
            </label>

            <textarea
              id="remark"
              name="remark"
              placeholder="Tell us about your inquiry..."
              value={form.remark}
              onChange={handleChange}
              rows={5}
              maxLength={2000}
              className={`${inputClass} min-h-[140px] resize-y leading-7`}
            />
          </div>

          {/* Error */}
          {error && (
            <p
              className="mb-5 text-xs leading-6 text-red-400"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p
              className="mb-5 text-xs leading-6 text-green-400"
              role="status"
            >
              {success}
            </p>
          )}

          {/* Submit */}
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
