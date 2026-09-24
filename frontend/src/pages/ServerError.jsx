import { Link } from "react-router-dom";
import { FiArrowRight, FiHome, FiRefreshCw, FiSearch } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkHealth } from "../middleware/index.js";

export default function ServerError() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [healthMessage, setHealthMessage] = useState("");

  const retryPage = async () => {
    setIsChecking(true);
    setHealthMessage("");

    try {
      await checkHealth();
      navigate("/", { replace: true });
    } catch {
      setHealthMessage("The server is still unavailable. Please try again shortly.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#f7f8fb] px-6 py-16 text-[#2b2f3a] sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(rgba(43,47,58,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(43,47,58,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -right-32 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full border-[42px] border-[#8685ef]/30 sm:h-[34rem] sm:w-[34rem]" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <section className="animate-[fade-in_600ms_ease-out_both]">
          <Link to="/" className="mb-12 inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8685ef]/15 text-xl font-bold text-[#8685ef]">
              V
            </span>
            <span className="text-lg font-bold tracking-tight">Venture</span>
          </Link>

          <div className="mb-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#586274]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8685ef]" />
            Temporary server issue
          </div>

          <h1 className="text-[clamp(6rem,20vw,13rem)] font-black leading-[0.72] tracking-[-0.08em] text-[#2b2f3a]">
            502
          </h1>

          <div className="mt-10 max-w-xl border-l-2 border-[#2b2f3a] pl-5 sm:pl-7">
            <h2 className="text-3xl font-extrabold leading-tight sm:text-5xl">
              Our server needs a moment.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-[#586274] sm:text-lg">
              Something went wrong while connecting to Venture. Please try
              again, or keep shopping while we get things back on track.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={retryPage}
              disabled={isChecking}
              className="group inline-flex items-center gap-2 rounded-full bg-[#2b2f3a] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#454b59]"
            >
              <FiRefreshCw
                size={17}
                className={`${isChecking ? "animate-spin" : "transition-transform group-hover:rotate-180"}`}
              />
              {isChecking ? "Checking server..." : "Try again"}
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#2b2f3a]/25 bg-white/50 px-5 py-3 text-sm font-bold text-[#2b2f3a] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <FiHome size={17} />
              Back to home
              <FiArrowRight size={17} />
            </Link>
          </div>
          {healthMessage && (
            <p className="mt-4 text-sm font-semibold text-red-500" role="alert">
              {healthMessage}
            </p>
          )}
        </section>

        <section className="relative mx-auto w-full max-w-md lg:justify-self-end">
          <div className="relative aspect-square rotate-3 rounded-[2.5rem] border-2 border-[#2b2f3a] bg-[#8685ef] p-5 shadow-[12px_12px_0_#2b2f3a] transition-transform duration-500 hover:rotate-1">
            <div className="flex h-full flex-col justify-between rounded-[1.9rem] border border-[#2b2f3a]/20 bg-[#f0efff] p-7 sm:p-9">
              <div className="flex items-start justify-between">
                <span className="rounded-full border border-[#2b2f3a]/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#586274]">
                  V.com
                </span>
                <FiRefreshCw className="text-3xl text-[#8685ef]" aria-hidden="true" />
              </div>

              <div>
                <p className="text-7xl font-black leading-none tracking-[-0.08em] sm:text-8xl">
                  Offline
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-[#8685ef]" />
                  <span className="h-3 w-20 rounded-full bg-[#2b2f3a]" />
                  <span className="h-3 w-10 rounded-full bg-[#2b2f3a]/20" />
                </div>
              </div>

              <p className="max-w-[13rem] text-sm font-semibold leading-5 text-[#586274]">
                Gateway response received. Your account and cart are safe.
              </p>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}