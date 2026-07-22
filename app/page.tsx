import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#171310]">
      {/* Hero — builder-first: the page is the product, payments is the upgrade */}
      <section className="flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center sm:pt-32">
        <span className="rounded-full border border-[#171310]/10 bg-white px-3 py-1 text-[12px] font-medium text-[#5c574c]">
          For Lebanese & Syrian freelancers
        </span>
        <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Your professional page,{" "}
          <span className="text-[#e8623d]">ready in minutes</span>.
        </h1>
        <p className="mt-4 max-w-md text-[#5c574c]">
          A page that looks better than your Instagram — your work, your prices,
          your voice. Share one link. No website builder, no code.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/auth/signup"
            className="rounded-xl bg-[#e8623d] px-6 py-3 text-[14px] font-bold text-white"
          >
            Make your page — free
          </Link>
          <Link
            href="/rami"
            className="rounded-xl border border-[#171310]/15 bg-white px-6 py-3 text-[14px] font-semibold shadow-sm"
          >
            See a live page
          </Link>
        </div>
        <p className="mt-3 text-[13px] text-[#8a8477]">
          Free forever. Upgrade only when you want to get paid through it.
        </p>
      </section>

      {/* Supporting — payments/chaser demoted to the paid upgrade, not the lead */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-3">
          <Feature
            title="A page you're proud of"
            body="Pick a look, add your work, set it live. Beautiful in Arabic and English."
          />
          <Feature
            title="One link everywhere"
            body="Put it on your QR card, your bio, your WhatsApp. It's you, in one place."
          />
          <Feature
            title="Get paid, when you're ready"
            body="Upgrade to send quotes, invoices, and polite payment reminders — on local rails."
            muted
          />
        </div>
      </section>
    </main>
  );
}

function Feature({
  title,
  body,
  muted,
}: {
  title: string;
  body: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#171310]/8 p-5 ${
        muted ? "bg-[#f2ede3]" : "bg-white"
      }`}
    >
      <h3 className="text-[15px] font-semibold">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[#5c574c]">{body}</p>
    </div>
  );
}
