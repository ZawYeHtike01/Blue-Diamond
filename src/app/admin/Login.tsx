import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, Music2, ArrowRight } from "lucide-react";

import logo from "../Image/logo.png";
import { useApp } from "../App";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { globalMsg, setGlobalMsg } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);

      setGlobalMsg("Login successful!");

      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      setGlobalMsg("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!globalMsg) return;

    const timer = window.setTimeout(() => {
      setGlobalMsg(null);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [globalMsg, setGlobalMsg]);

  

  return (
    <main
      className="
        fixed inset-0 z-[9999]
        flex min-h-0 w-full
        items-start justify-center
        overflow-y-auto overscroll-contain
        bg-[#080b14] text-slate-100
        px-4 py-6
        sm:items-center sm:px-6 sm:py-8
      "
    >
      {/* Background effects */}
      <div
        className="
          pointer-events-none fixed -right-32 -top-32
          h-72 w-72 rounded-full
          bg-blue-600/15 blur-[90px]
          sm:h-96 sm:w-96
        "
      />

      <div
        className="
          pointer-events-none fixed -bottom-32 -left-32
          h-72 w-72 rounded-full
          bg-blue-700/15 blur-[90px]
          sm:h-96 sm:w-96
        "
      />

      {/* Background grid */}
      <div
        className="
          pointer-events-none fixed inset-0 opacity-30
          bg-[linear-gradient(rgba(59,130,246,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.035)_1px,transparent_1px)]
          bg-[size:36px_36px]
          sm:bg-[size:48px_48px]
        "
      />

      {/* Login card */}
      <section
        className="
          relative my-auto w-full min-w-0 max-w-sm
          rounded-2xl border border-slate-700/70
          bg-gradient-to-br from-[#141d2d] to-[#0e1523]
          p-5
          shadow-[0_24px_80px_rgba(0,0,0,0.45)]
          sm:max-w-md sm:rounded-3xl sm:p-8
          lg:p-10
        "
      >
        {/* Logo */}
        <div className="mb-5 flex justify-center sm:mb-6">
          <img
            src={logo}
            alt="Blue Diamond Band Logo"
            className="h-15 w-40 object-contain"
          />
        </div>

        <h1 className="text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Welcome back
        </h1>

        <p className="mb-6 mt-2 text-center text-xs leading-5 text-slate-400 sm:mb-8 sm:text-sm">
          Sign in to manage your band events
        </p>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          {/* Email */}
          <div className="min-w-0">
            <label
              htmlFor="login-email"
              className="mb-2 block text-xs font-bold text-slate-300 sm:text-sm"
            >
              Email address
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                block w-full min-w-0 box-border
                rounded-xl border border-slate-700
                bg-[#0b1220] px-3 py-3.5
                text-base text-white outline-none
                transition placeholder:text-slate-600
                focus:border-blue-500 focus:ring-2
                focus:ring-blue-500/15
                sm:px-4 sm:py-4 sm:text-sm
              "
            />
          </div>

          {/* Password */}
          <div className="min-w-0">
            <label
              htmlFor="login-password"
              className="mb-2 block text-xs font-bold text-slate-300 sm:text-sm"
            >
              Password
            </label>

            <div
              className="
                flex min-w-0 items-center overflow-hidden
                rounded-xl border border-slate-700
                bg-[#0b1220] transition
                focus-within:border-blue-500
                focus-within:ring-2
                focus-within:ring-blue-500/15
              "
            >
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  min-w-0 flex-1 bg-transparent
                  px-3 py-3.5 text-base text-white
                  outline-none placeholder:text-slate-600
                  sm:px-4 sm:py-4 sm:text-sm
                "
              />

              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="
                  flex min-h-12 min-w-12 shrink-0
                  items-center justify-center
                  text-slate-400 transition
                  hover:text-blue-400
                  sm:min-h-14 sm:min-w-14
                "
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 shrink-0 cursor-pointer accent-blue-500"
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={() =>
                setGlobalMsg(
                  "Please contact the administrator to reset your password.",
                )
              }
              className="
                min-h-11 text-left text-xs font-bold
                text-blue-400 transition
                hover:text-blue-300
              "
            >
              Forgot password?
            </button>
          </div>

          {/* Sign in */}
          <button
            type="submit"
            disabled={loading}
            className="
              flex min-h-12 w-full items-center
              justify-center gap-2 rounded-xl
              bg-gradient-to-r from-blue-500 to-blue-600
              px-4 py-3.5 text-sm font-extrabold text-white
              shadow-lg shadow-blue-600/20 transition
              hover:from-blue-400 hover:to-blue-500
              hover:shadow-blue-500/30
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-blue-400
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[#111827]
              disabled:cursor-not-allowed disabled:opacity-60
              sm:min-h-14 sm:py-4
            "
          >
            <span>{loading ? "Signing in..." : "Sign In"}</span>

            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Footer */}
        <div
          className="
            mt-6 flex flex-wrap items-center
            justify-center gap-2
            border-t border-slate-700/70 pt-5
            sm:mt-8 sm:pt-6
          "
        >
          <Music2 size={14} className="shrink-0 text-blue-400" />

          <p className="text-center text-[10px] leading-5 text-slate-500 sm:text-xs">
            Blue Diamond Band · Admin Portal
          </p>
        </div>
      </section>

      {globalMsg && (
        <div
          role="status"
          aria-live="polite"
          className="
            fixed bottom-4 left-1/2 z-[10000]
            flex w-[calc(100%-2rem)] max-w-md
            -translate-x-1/2 items-center justify-between
            gap-3 rounded-xl border border-slate-700
            bg-slate-900 px-4 py-3
            text-sm text-white shadow-2xl
            sm:bottom-6
          "
        >
          <span className="min-w-0 break-words">{globalMsg}</span>

          <button
            type="button"
            onClick={() => setGlobalMsg(null)}
            aria-label="Close notification"
            className="shrink-0 text-slate-400 transition hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </main>
  );
}
