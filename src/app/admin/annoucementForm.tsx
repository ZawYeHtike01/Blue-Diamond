
import { useEffect, useState } from "react";

export default function AnnouncementForm() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    setError("");
    setImage(file);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!image) {
      setError("Please select a cover image.");
      return;
    }

    // UI test only. ImageKit and Firestore integration comes next.
    console.log({
      title,
      details,
      author,
      imageName: image.name,
    });

    alert("Form validation successful!");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:py-12">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl space-y-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10"
      >
        {/* Header */}
        <header className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-700">
            ✦
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create Announcement
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Share news with the Blue Diamond community.
            </p>
          </div>
        </header>

        <div className="h-px bg-slate-200" />

        {/* Title */}
        <div className="space-y-2">
          <label
            htmlFor="news-title"
            className="block text-sm font-semibold text-slate-800"
          >
            Title <span className="text-red-500">*</span>
          </label>

          <input
            id="news-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter announcement title"
            maxLength={150}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800">
            Cover Image <span className="text-red-500">*</span>
          </label>

          <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-5 text-center transition hover:border-blue-400 hover:bg-blue-50">
            {preview ? (
              <img
                src={preview}
                alt="Cover preview"
                className="max-h-80 w-full rounded-lg object-contain"
              />
            ) : (
              <>
                <span className="flex size-14 items-center justify-center rounded-2xl bg-blue-100 text-3xl text-blue-600">
                  ↑
                </span>

                <span className="font-semibold text-slate-800">
                  Choose an image to upload
                </span>

                <span className="text-xs text-slate-500">
                  PNG, JPG or WebP · Maximum 5 MB
                </span>

                <span className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
                  Browse Images
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="sr-only"
            />
          </label>

          {image && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <p className="break-all text-emerald-700">
                ✓ {image.name}
              </p>

              <button
                type="button"
                onClick={() => setImage(null)}
                className="font-medium text-red-600 hover:text-red-700"
              >
                Remove image
              </button>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2">
          <label
            htmlFor="news-details"
            className="block text-sm font-semibold text-slate-800"
          >
            News Details <span className="text-red-500">*</span>
          </label>

          <textarea
            id="news-details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Write your announcement details..."
            rows={7}
            maxLength={10000}
            required
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />

          <p className="text-right text-xs text-slate-400">
            {details.length}/10000 characters
          </p>
        </div>

        {/* Author */}
        <div className="space-y-2">
          <label
            htmlFor="news-author"
            className="block text-sm font-semibold text-slate-800"
          >
            Author <span className="text-red-500">*</span>
          </label>

          <input
            id="news-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
            maxLength={100}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-[0.99]"
        >
          Submit Announcement
          <span aria-hidden="true">→</span>
        </button>

        <p className="text-center text-xs text-slate-400">
          * Required fields
        </p>
      </form>
    </main>
  );
}
