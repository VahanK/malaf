import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f7f3ec] text-[#171310] px-6">
      <h1 className="text-4xl font-semibold tracking-tight">WorkWith</h1>
      <p className="mt-3 text-[#5c574c] text-center max-w-md">
        Whatever you do — the price and the{" "}
        <span className="text-[#e8623d] font-medium">proof</span>, in one
        place. Quote requests go straight to WhatsApp.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/demo"
          className="rounded-xl bg-[#e8623d] px-6 py-3 text-[14px] font-bold text-white"
        >
          See how you get paid
        </Link>
        <Link
          href="/rami"
          className="rounded-xl border border-[#171310]/15 bg-white px-6 py-3 text-[14px] font-semibold shadow-sm"
        >
          See a live card
        </Link>
      </div>
    </main>
  );
}
