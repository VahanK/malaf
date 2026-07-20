export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0e0f13] text-[#f4f2ec] px-6">
      <h1 className="text-4xl font-black tracking-tight">
        Malaf{" "}
        <span
          className="text-[#c9a45c]"
          style={{ fontFamily: "var(--font-tajawal), sans-serif" }}
        >
          ملف
        </span>
      </h1>
      <p className="mt-3 text-[#9aa0ae] text-center max-w-md">
        A professional page in seconds — portfolio, prices, and quote requests,
        straight to WhatsApp.
      </p>
      <p className="mt-8 text-sm text-[#9aa0ae]">
        صفحة مهنية بثواني، وتحصيل بلا إحراج
      </p>
    </main>
  );
}
