import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowLeft,
  FolderKanban,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { WorkSphereLogo } from "@/components/layout/Navbar";

export function Login() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { mutate: loginUser, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // if already logged in, send to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    loginUser(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            (err?.response?.data?.errors && err.response.data.errors[0]?.message) ||
            "Invalid email or password. Please try again.";
          setErrorMessage(msg);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F6] text-zinc-900 selection:bg-blue-600 selection:text-white relative overflow-hidden px-4 py-5 sm:px-6 sm:py-6">
      {/* Background Architectural Grid Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_45%,#000_50%,transparent_100%)] opacity-40"
      />

      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-blue-500/10 blur-[130px]"
      />

      {/* Top Navbar */}
      <header className="relative max-w-6xl w-full mx-auto flex items-center justify-between z-20">
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
        >
          <WorkSphereLogo className="w-8 h-8" />
          <span className="font-bold text-base tracking-tight text-zinc-950">
            Work<span className="text-blue-600">Sphere</span>
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-zinc-200/80 shadow-2xs backdrop-blur-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to website</span>
        </Link>
      </header>

      {/* Main Container with Centered Card and Floating Bento Badges */}
      <main className="relative w-full my-auto py-2 sm:py-4 flex items-center justify-center z-10">
        <div className="relative w-full max-w-[420px]">
          {/* Floating Bento Badge 1: Upper Left (Project Status) */}
          <div
            aria-hidden="true"
            className="hidden lg:flex animate-float-slow absolute -left-60 xl:-left-64 top-4 select-none pointer-events-none items-center gap-2.5 p-3 rounded-2xl bg-white/95 border border-zinc-200/90 shadow-md shadow-zinc-900/5 backdrop-blur-md w-56"
          >
            <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FolderKanban className="size-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-900 truncate">Core Platform MVP</span>
                <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">67% complete • Sprint 4</p>
            </div>
          </div>

          {/* Floating Bento Badge 2: Upper Right (Active Task) */}
          <div
            aria-hidden="true"
            className="hidden lg:flex animate-float-delayed absolute -right-60 xl:-right-64 top-4 select-none pointer-events-none items-center gap-2.5 p-3 rounded-2xl bg-white/95 border border-zinc-200/90 shadow-md shadow-zinc-900/5 backdrop-blur-md w-56"
          >
            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-900 truncate">Auth & API</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-rose-50 text-rose-600 border border-rose-200/60 shrink-0">
                  HIGH
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 truncate mt-0.5">Assigned to Elena R.</p>
            </div>
          </div>

          {/* Floating Bento Badge 3: Lower Left (Multi-tenant Security) */}
          <div
            aria-hidden="true"
            className="hidden lg:flex animate-float-delayed absolute -left-56 xl:-left-60 bottom-8 select-none pointer-events-none items-center gap-2.5 p-3 rounded-2xl bg-white/95 border border-zinc-200/90 shadow-md shadow-zinc-900/5 backdrop-blur-md w-52"
          >
            <div className="size-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">Multi-tenant Schema</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Isolated & encrypted</p>
            </div>
          </div>

          {/* Floating Bento Badge 4: Lower Right (Live Presence) */}
          <div
            aria-hidden="true"
            className="hidden lg:flex animate-float-slow absolute -right-56 xl:-right-60 bottom-8 select-none pointer-events-none items-center gap-2.5 p-3 rounded-2xl bg-white/95 border border-zinc-200/90 shadow-md shadow-zinc-900/5 backdrop-blur-md w-52"
          >
            <div className="flex -space-x-1.5 shrink-0">
              {['ER', 'MV', 'ST'].map((initials, i) => (
                <span
                  key={initials}
                  className={`size-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center ring-1.5 ring-white ${
                    i === 0 ? 'bg-violet-600' : i === 1 ? 'bg-emerald-600' : 'bg-blue-600'
                  }`}
                >
                  {initials}
                </span>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-zinc-900">3 online</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Live board sync</p>
            </div>
          </div>

          {/* Central Auth Card */}
          <div className="w-full rounded-3xl border border-zinc-200/90 bg-white p-7 sm:p-8 shadow-xl shadow-zinc-900/5">
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-3">
              <Zap className="size-3" />
              <span>Sign in to your workspace</span>
            </div>
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-zinc-950">
              Welcome back
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500">
              Enter your credentials to continue to WorkSphere
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Error Banner */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 animate-in fade-in duration-200">
                <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
                <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 size-4 text-zinc-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  disabled={isPending}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 pl-10 pr-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 size-4 text-zinc-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isPending}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 pl-10 pr-10 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 disabled:opacity-50"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-zinc-400 hover:text-zinc-700 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || !email || !password}
              className="mt-2 w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-5 pt-4 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-500">
              Don&apos;t have a workspace?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Create a workspace
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>

      {/* Footer */}
      <footer className="relative max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500 pt-2 z-20">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          <span>Enterprise encryption & multi-tenant isolation</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Systems normal</span>
          </span>
          <span>•</span>
          <span className="font-mono">WorkSphere v1.0</span>
        </div>
      </footer>
    </div>
  );
}

export default Login;


