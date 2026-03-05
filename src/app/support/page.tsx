import NavigationHeader from "@/components/NavigationHeader";

export const metadata = {
  title: "Support - CodeCraft",
  description: "Get help and support for CodeCraft",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-gray-800/60 bg-gradient-to-br from-[#12121a] to-[#0b0b13] p-8 md:p-12">
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <header className="relative mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Support</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">How can we help?</h1>
            <p className="mt-4 text-gray-400">
              Get answers fast, report bugs, or request new features. We typically respond within
              1-2 business days.
            </p>
          </header>

          <section className="relative grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-800/60 bg-black/20 p-6">
              <h2 className="text-lg font-semibold text-white">General Support</h2>
              <p className="mt-2 text-gray-400">
                Questions about your account, snippets, or editor issues.
              </p>
              <p className="mt-4 text-blue-300">support@codecraft.app</p>
            </div>

            <div className="rounded-2xl border border-gray-800/60 bg-black/20 p-6">
              <h2 className="text-lg font-semibold text-white">Bug Reports</h2>
              <p className="mt-2 text-gray-400">
                Include steps to reproduce, screenshots, and browser details.
              </p>
              <p className="mt-4 text-blue-300">bugs@codecraft.app</p>
            </div>

            <div className="rounded-2xl border border-gray-800/60 bg-black/20 p-6">
              <h2 className="text-lg font-semibold text-white">Feature Requests</h2>
              <p className="mt-2 text-gray-400">
                Tell us what would improve your workflow and why.
              </p>
              <p className="mt-4 text-blue-300">product@codecraft.app</p>
            </div>

            <div className="rounded-2xl border border-gray-800/60 bg-black/20 p-6">
              <h2 className="text-lg font-semibold text-white">Security</h2>
              <p className="mt-2 text-gray-400">
                Report vulnerabilities responsibly with details and impact.
              </p>
              <p className="mt-4 text-blue-300">security@codecraft.app</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
