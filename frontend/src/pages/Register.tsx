import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useRegister } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  FolderKanban,
  CheckCircle2,
  Users2,
  Rocket,
} from "lucide-react";
import { WorkSphereLogo } from "@/components/layout/Navbar";

export function Register() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { mutate: registerUser, isPending } = useRegister();

  const [organizationName, setOrganizationName] = useState("");
  const [name, setName] = useState("");
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

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    registerUser(
      {
        organizationName: organizationName.trim(),
        name: name.trim(),
        email: email.trim(),
        password,
      },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            (err?.response?.data?.errors && err.response.data.errors[0]?.message) ||
            "Failed to create workspace. Please try again.";
          setErrorMessage(msg);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F6] text-zinc-900 selection:bg-blue-600 selection:text-white relative overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
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
      <main className="relative w-full my-auto py-2 sm:py-3 flex items-center justify-center z-10">
        <div className="relative w-full max-w-[430px]">
          {/* Floating Bento Badge 1: Upper Left (Instant Provisioning) */}
          <div
            aria-hidden="true"
            className="hidden lg:flex animate-float-slow absolute -left-60 xl:-left-64 top-4 select-none pointer-events-none items-center gap-2.5 p-3 rounded-2xl bg-white/95 border border-zinc-200/90 shadow-md shadow-zinc-900/5 backdrop-blur-md w-56"
          >
            <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Rocket className="size-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-900 truncate">Instant Provisioning</span>
                <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Ready in &lt; 2 minutes</p>
            </div>
          </div>

          {/* Floating Bento Badge 2: Upper Right (Starter Kanban) */}
          <div
            aria-hidden="true"
            className="hidden lg:flex animate-float-delayed absolute -right-60 xl:-right-64 top-4 select-none pointer-events-none items-center gap-2.5 p-3 rounded-2xl bg-white/95 border border-zinc-200/90 shadow-md shadow-zinc-900/5 backdrop-blur-md w-56"
          >
            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FolderKanban className="size-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-900 truncate">Preconfigured Kanban</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60 shrink-0">
                  AUTO
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 truncate mt-0.5">To Do • In Progress • Done</p>
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
              <p className="text-xs font-bold text-zinc-900">Dedicated Isolation</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">PostgreSQL multi-tenant</p>
            </div>
          </div>

          {/* Floating Bento Badge 4: Lower Right (Admin Control) */}
          <div
            aria-hidden="true"
            className="hidden lg:flex animate-float-slow absolute -right-56 xl:-right-60 bottom-8 select-none pointer-events-none items-center gap-2.5 p-3 rounded-2xl bg-white/95 border border-zinc-200/90 shadow-md shadow-zinc-900/5 backdrop-blur-md w-52"
          >
            <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Users2 className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-zinc-900">Workspace Admin</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Custom roles & invites</p>
            </div>
          </div>

          {/* Central Auth Card */}
          <div className="w-full rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xl shadow-zinc-900/5">
          {/* Card Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-2">
              <Sparkles className="size-3" />
              <span>Get started in under 2 minutes</span>
            </div>
            <h1 className="text-2xl sm:text-[25px] font-bold tracking-tight text-zinc-950">
              Create your workspace
            </h1>
            <p className="mt-1 text-xs text-zinc-500">
              Set up your team&apos;s project management headquarters
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Error Banner */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 animate-in fade-in duration-200">
                <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
                <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Organization / Workspace Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Company / Organization
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-2.5 size-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  disabled={isPending}
                  placeholder="e.g. Acme Studio"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 pl-10 pr-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Your Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-2.5 size-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  disabled={isPending}
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 pl-10 pr-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Work Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 size-4 text-zinc-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  disabled={isPending}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 pl-10 pr-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  Password
                </label>
                <span className="text-[10px] text-zinc-400 font-mono">Min. 6 chars</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 size-4 text-zinc-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isPending}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 pl-10 pr-10 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 disabled:opacity-50"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2 text-zinc-400 hover:text-zinc-700 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || !organizationName || !name || !email || !password}
              className="mt-2 w-full inline-flex h-10.5 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Creating workspace...</span>
                </>
              ) : (
                <span>Create workspace & account</span>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-4 pt-3.5 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-500">
              Already have a workspace?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>

      {/* Footer */}
      <footer className="relative max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500 pt-1 z-20">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          <span>Enterprise encryption & multi-tenant isolation</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="size-3 text-emerald-600" />
            <span>No credit card required</span>
          </span>
          <span>•</span>
          <span className="font-mono">WorkSphere v1.0</span>
        </div>
      </footer>
    </div>
  );
}

export default Register;


