import NavigationHeader from "@/components/NavigationHeader";

export const metadata = {
  title: "Privacy Policy - CodeCraft",
  description: "Privacy Policy for CodeCraft",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-gray-800/60 bg-gradient-to-br from-[#12121a] to-[#0b0b13] p-8 md:p-12">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <header className="relative mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Legal</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">Privacy Policy</h1>
            <p className="mt-4 text-gray-400">
              This policy explains what data CodeCraft collects, why we collect it, and how we keep
              it safe.
            </p>
          </header>

          <section className="relative space-y-8 text-gray-300">
            <div>
              <h2 className="text-xl font-semibold text-white">Information We Collect</h2>
              <p className="mt-2">
                We collect account details (name, email), snippet content you publish, and usage
                analytics such as execution history.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">How We Use Data</h2>
              <p className="mt-2">
                Data is used to provide the editor, run code, and improve community discovery.
                We do not sell your personal data.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">Data Retention</h2>
              <p className="mt-2">
                We retain user content until you delete it or request account removal. Some logs may
                be retained for security and operational purposes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">Your Choices</h2>
              <p className="mt-2">
                You can edit or delete snippets at any time. If you would like your account removed,
                contact support.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">Contact</h2>
              <p className="mt-2">
                Questions or requests? Email us at <span className="text-blue-300">privacy@codecraft.app</span>.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
