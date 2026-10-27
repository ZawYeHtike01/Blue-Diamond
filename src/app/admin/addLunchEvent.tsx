
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useApp } from "../App";

export default function AddLunchEvent() {
  const navigate = useNavigate();
  const {globalMsg, setGlobalMsg}=useApp();

  const [form, setForm] = useState({
    date: "",
    songName: "",
    artistName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e:any) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setGlobalMsg("");
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setGlobalMsg("");
    setError(false);

    try {
      await addDoc(collection(db, "lunchEvents"), {
        date: form.date,
        songName: form.songName.trim(),
        artistName: form.artistName.trim(),
        status: "upcoming",
        createdAt: serverTimestamp(),
      });

      setForm({
        date: "",
        songName: "",
        artistName: "",
      });

      setGlobalMsg("Lunch Event submitted successfully!");

      // Optional: return to the event list after submission.
      // navigate("/lunch-event");
    } catch (err) {
      console.error("Lunch Event submission failed:", err);
      setError(true);
      setGlobalMsg(
        "Failed to submit. Please try again."
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
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-xl font-bold transition-opacity hover:opacity-70"
        style={{position:"fixed",cursor:"pointer"}}
      >
        ← 戻す
      </button>

      <section className="mx-auto mt-[54px] w-full max-w-[472px] pb-8">
        <h1 className="mb-[70px] text-center text-[23px] font-black tracking-[4px]">
          LUNCH EVENT
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-[35px]">
            <label htmlFor="date" className={labelClass}>
              DATE
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>

          <div className="mb-[35px]">
            <label htmlFor="songName" className={labelClass}>
              SONG NAME
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

          <div className="mb-[35px]">
            <label htmlFor="artistName" className={labelClass}>
              Artist Name
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
