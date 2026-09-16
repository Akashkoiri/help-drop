import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, CheckCircle2, Zap, Shield, Layout } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ModeToggle } from "@/components/theme-toggle";

export default async function Home() {
  const { userId } = await auth();
  return (
    <div className={`relative min-h-screen bg-[#FAFAFA] ${"dark:bg-[#0A0A0A]"} flex flex-col items-center overflow-hidden font-sans`}>
      {/* Navbar */}
      <header className={`absolute top-0 left-0 w-full p-6 z-50 flex items-center justify-between max-w-350 mx-auto right-0`}>
        <div className={`flex items-center gap-10`}>
          <Link
            href="/"
            className={`flex items-center gap-3 hover:opacity-80 transition-opacity`}
          >
            <Image
              src="/logo.jpg"
              alt="Help Drop Logo"
              width={36}
              height={36}
              className={`rounded-xl shadow-sm`}
            />
            <span className={`font-bold text-xl tracking-tight text-black ${"dark:text-white"}`}>
              Help Drop
            </span>
          </Link>
        </div>
        <div className={`flex items-center gap-6`}>
          <ModeToggle />
          {!userId ? (
            <div className={`flex items-center gap-4`}>
              <Link
                href="/sign-in"
                className={`hidden md:block text-sm font-medium text-black/60 ${"dark:text-white/60"} hover:text-black dark:hover:text-white transition-colors`}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={`hidden md:flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-black ${"dark:text-black dark:bg-white"} rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]`}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className={`flex items-center gap-4`}>
              <UserButton />
            </div>
          )}
        </div>
      </header>

      {/* Refined Ambient Glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 opacity-30 ${"dark:opacity-20"} pointer-events-none`}>
        <div className={`absolute inset-0 bg-linear-to-b from-black/10 ${"dark:from-white/10"} to-transparent blur-3xl rounded-full mix-blend-multiply ${"dark:mix-blend-screen"}`} />
      </div>

      <main className={`relative z-10 w-full flex flex-col items-center`}>
        {/* Hero Section */}
        <section className={`w-full max-w-250 mx-auto px-6 pt-32 md:pt-40 pb-24 flex flex-col items-center text-center`}>
          {/* Soft Beta Tag */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/5 bg-white/50 text-xs font-medium text-black/60 ${"dark:border-white/10 dark:bg-black/50 dark:text-white/60"} mb-8 backdrop-blur-md`}>
            <span className={`relative flex h-2 w-2`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 bg-emerald-500`}></span>
            </span>
            Help Drop is now available
          </div>

          {/* Elegant Typography Headline */}
          <h1 className={`text-5xl md:text-7xl font-semibold tracking-tighter text-black ${"dark:text-white"} max-w-4xl mb-6 leading-[1.05]`}>
            Manage your issues <br className={`hidden md:block`} />
            <span className={`text-black/40 ${"dark:text-white/40"}`}>
              with absolute clarity.
            </span>
          </h1>

          {/* Human-friendly Subhead */}
          <p className={`text-lg md:text-xl text-black/50 ${"dark:text-white/50"} max-w-2xl mb-12 leading-relaxed font-normal tracking-tight`}>
            Help Drop strips away the clutter of traditional issue trackers.
            Experience a focused, lightning-fast workflow designed for modern
            product teams.
          </p>

          {/* Minimal Call to Actions */}
          <div className={`flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto`}>
            <MagneticButton>
              <Link
                href="/dashboard"
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-black ${"dark:text-black dark:bg-white"} rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.1)] ${"dark:shadow-[0_0_40px_rgba(255,255,255,0.1)]"} transition-transform hover:scale-[1.02] active:scale-[0.98]`}
              >
                <span>Open Dashboard</span>
                <ArrowRight className={`w-4 h-4 opacity-70`} />
              </Link>
            </MagneticButton>
          </div>

          {/* Abstract UI Mockup */}
          <div className={`mt-20 md:mt-32 w-full relative max-w-4xl mx-auto`}>
            <div className={`relative rounded-[24px] border border-black/5 bg-white/40 backdrop-blur-xl p-2 shadow-2xl shadow-black/5 ${"dark:border-white/10 dark:bg-black/40 dark:shadow-white/5"}`}>
              <div className={`rounded-[16px] border border-black/5 bg-white ${"dark:border-white/10 dark:bg-[#111]"} overflow-hidden`}>
                {/* Fake Window Controls */}
                <div className={`h-12 border-b border-black/5 flex items-center px-4 bg-black/2 ${"dark:border-white/5 dark:bg-white/2"}`}>
                  <div className={`flex gap-1.5`}>
                    <div className={`w-2.5 h-2.5 rounded-full bg-black/10 ${"dark:bg-white/20"}`} />
                    <div className={`w-2.5 h-2.5 rounded-full bg-black/10 ${"dark:bg-white/20"}`} />
                    <div className={`w-2.5 h-2.5 rounded-full bg-black/10 ${"dark:bg-white/20"}`} />
                  </div>
                </div>

                {/* Fake UI Content */}
                <div className={`p-6 md:p-10 space-y-4`}>
                  <div className={`flex items-center justify-between mb-8`}>
                    <div className={`h-6 w-32 bg-black/5 ${"dark:bg-white/5"} rounded-md`} />
                    <div className={`h-8 w-24 bg-black/5 ${"dark:bg-white/5"} rounded-lg`} />
                  </div>

                  {[
                    {
                      width: "w-3/4",
                      color: "bg-emerald-500/10",
                      dot: "bg-emerald-500",
                    },
                    {
                      width: "w-1/2",
                      color: "bg-blue-500/10",
                      dot: "bg-blue-500",
                    },
                    {
                      width: "w-5/6",
                      color: "bg-amber-500/10",
                      dot: "bg-amber-500",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-4 p-4 rounded-xl border border-black/5 hover:bg-black/2 ${"dark:border-white/5 dark:hover:bg-white/2"} transition-colors`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-full border border-black/10 ${"dark:border-white/20"} flex items-center justify-center shrink-0`}>
                        <CheckCircle2 className={`w-3 h-3 text-black/20 ${"dark:text-white/20"}`} />
                      </div>
                      <div className={`flex-1 space-y-3`}>
                        <div
                          className={`h-4 ${item.width} bg-black/10 ${"dark:bg-white/10"} rounded`}
                        />
                        <div className={`flex gap-2 items-center`}>
                          <div
                            className={`flex items-center gap-1.5 px-2 py-0.5 ${item.color} rounded-md`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${item.dot}`}
                            />
                            <div className={`h-3 w-10 bg-black/10 ${"dark:bg-white/10"} rounded-sm`} />
                          </div>
                          <div className={`h-5 w-12 bg-black/5 ${"dark:bg-white/5"} rounded-md`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={`w-full max-w-5xl mx-auto mt-24 md:mt-32 px-6`}>
          <div className={`text-center mb-16`}>
            <h2 className={`text-3xl md:text-5xl font-semibold tracking-tight text-black ${"dark:text-white"} mb-4`}>
              Everything you need.{" "}
              <span className={`text-black/40 ${"dark:text-white/40"}`}>
                Nothing you don&apos;t.
              </span>
            </h2>
            <p className={`text-lg text-black/50 ${"dark:text-white/50"} max-w-2xl mx-auto`}>
              We&apos;ve stripped away the complexity to give you a tool that
              feels fast, intuitive, and gets out of your way.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
            {/* Feature 1 */}
            <div className={`p-8 rounded-[24px] border border-black/5 bg-white/40 ${"dark:border-white/10 dark:bg-black/40"} backdrop-blur-xl text-left hover:bg-white/60 dark:hover:bg-white/2 transition-colors`}>
              <div className={`w-12 h-12 rounded-2xl bg-black/5 ${"dark:bg-white/5"} flex items-center justify-center mb-6`}>
                <Zap className={`w-6 h-6 text-black ${"dark:text-white"}`} />
              </div>
              <h3 className={`text-xl font-medium text-black ${"dark:text-white"} mb-3`}>
                Lightning Fast
              </h3>
              <p className={`text-black/60 ${"dark:text-white/60"} leading-relaxed`}>
                Built on modern web technologies, Help Drop responds instantly
                to every interaction, keeping you in the flow.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-8 rounded-[24px] border border-black/5 bg-white/40 ${"dark:border-white/10 dark:bg-black/40"} backdrop-blur-xl text-left hover:bg-white/60 dark:hover:bg-white/2 transition-colors`}>
              <div className={`w-12 h-12 rounded-2xl bg-black/5 ${"dark:bg-white/5"} flex items-center justify-center mb-6`}>
                <Layout className={`w-6 h-6 text-black ${"dark:text-white"}`} />
              </div>
              <h3 className={`text-xl font-medium text-black ${"dark:text-white"} mb-3`}>
                Intuitive Interface
              </h3>
              <p className={`text-black/60 ${"dark:text-white/60"} leading-relaxed`}>
                No steep learning curves. Start managing issues efficiently from
                day one with our streamlined, clutter-free design.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`p-8 rounded-[24px] border border-black/5 bg-white/40 ${"dark:border-white/10 dark:bg-black/40"} backdrop-blur-xl text-left hover:bg-white/60 dark:hover:bg-white/2 transition-colors`}>
              <div className={`w-12 h-12 rounded-2xl bg-black/5 ${"dark:bg-white/5"} flex items-center justify-center mb-6`}>
                <Shield className={`w-6 h-6 text-black ${"dark:text-white"}`} />
              </div>
              <h3 className={`text-xl font-medium text-black ${"dark:text-white"} mb-3`}>
                Secure by Design
              </h3>
              <p className={`text-black/60 ${"dark:text-white/60"} leading-relaxed`}>
                Your data is protected with enterprise-grade security, ensuring
                absolute privacy for your team&apos;s most critical work.
              </p>
            </div>
          </div>
        </section>

        {/* Additional Info Cards */}
        <section className={`w-full max-w-5xl mx-auto mt-24 mb-32 px-6`}>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
            <div className={`p-10 rounded-[32px] bg-black text-white relative overflow-hidden group ${"dark:bg-white dark:text-black"}`}>
              <div className={`absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 ${"dark:bg-black/10"}`} />
              <div className={`relative z-10 h-full flex flex-col justify-between`}>
                <div>
                  <h3 className={`text-3xl font-semibold tracking-tight mb-4`}>
                    Focus on what matters.
                  </h3>
                  <p className={`text-white/70 text-lg max-w-sm ${"dark:text-black/70"}`}>
                    We handle the complexity of issue tracking so your team can
                    focus on building great products.
                  </p>
                </div>
                <div className={`mt-12 flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer`}>
                  <span>Learn more about our philosophy</span>
                  <ArrowRight className={`w-4 h-4`} />
                </div>
              </div>
            </div>

            <div className={`grid grid-rows-2 gap-6`}>
              <div className={`p-8 rounded-[32px] border border-black/5 bg-white/40 ${"dark:border-white/10 dark:bg-black/40"} backdrop-blur-xl flex flex-col justify-center hover:bg-white/60 dark:hover:bg-white/2 transition-colors`}>
                <h4 className={`text-xl font-medium text-black ${"dark:text-white"} mb-2`}>
                  Seamless Integrations
                </h4>
                <p className={`text-black/60 ${"dark:text-white/60"}`}>
                  Connect with GitHub, Slack, and your favorite tools in one
                  click.
                </p>
              </div>
              <div className={`p-8 rounded-[32px] border border-black/5 bg-white/40 ${"dark:border-white/10 dark:bg-black/40"} backdrop-blur-xl flex flex-col justify-center hover:bg-white/60 dark:hover:bg-white/2 transition-colors`}>
                <h4 className={`text-xl font-medium text-black ${"dark:text-white"} mb-2`}>
                  Advanced Analytics
                </h4>
                <p className={`text-black/60 ${"dark:text-white/60"}`}>
                  Gain insights into your team&apos;s velocity and issue
                  resolution times.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`w-full py-8 border-t border-black/5 bg-white/40 ${"dark:border-white/10 dark:bg-black/40"} backdrop-blur-md mt-auto`}>
        <div className={`max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-black/40 ${"dark:text-white/40"}`}>
          <p>© {new Date().getFullYear()} Help Drop. All rights reserved.</p>
          <div className={`flex gap-6`}>
            <Link
              href="#"
              className={`hover:text-black dark:hover:text-white transition-colors`}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className={`hover:text-black dark:hover:text-white transition-colors`}
            >
              Terms of Service
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={`hover:text-black dark:hover:text-white transition-colors`}
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
