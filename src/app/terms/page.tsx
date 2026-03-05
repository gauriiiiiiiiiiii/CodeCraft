import NavigationHeader from "@/components/NavigationHeader";

export const metadata = {
  title: "Terms of Service - CodeCraft",
  description: "Terms of Service for CodeCraft",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-gray-800/60 bg-gradient-to-br from-[#12121a] to-[#0b0b13] p-8 md:p-12">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

          <header className="relative mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Legal</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">Terms of Service</h1>
            <p className="mt-4 text-gray-400">
              These terms govern access to CodeCraft, including code execution, snippet sharing,
              and community features. By using the app, you agree to these terms.
            </p>
          </header>

          <section className="relative space-y-8 text-gray-300">
            <div>
              <h2 className="text-xl font-semibold text-white">Use of the Service</h2>
              <p className="mt-2">
                You agree to use CodeCraft lawfully and responsibly. You are solely responsible
                for any code you run, share, or publish through the platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">User Content</h2>
              <p className="mt-2">
                You retain ownership of your snippets. By publishing snippets, you grant CodeCraft
                a non-exclusive license to host and display that content within the product.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">Acceptable Use</h2>
              <p className="mt-2">
                Do not upload or execute malicious code, infringe intellectual property, or attempt
                to disrupt the service. Abuse may lead to account suspension.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">Availability</h2>
              <p className="mt-2">
                We strive for high uptime, but the service may be unavailable during maintenance or
                due to unexpected issues.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">Contact</h2>
              <p className="mt-2">
                Questions about these terms? Email us at <span className="text-blue-300">support@codecraft.app</span>.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
