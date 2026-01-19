import Link from "next/link"

export default function Home() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url(/ripvault.gif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 p-4 sm:p-6">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-semibold text-center leading-tight" style={{ fontFamily: "Oswald" }}>Chase the Grail with RipVault</h1>
        <p className="text-base sm:text-lg md:text-xl text-center max-w-2xl text-gray-300 px-2" style={{ fontFamily: "var(--font-geist-sans)" }}>
          Premium cards. Insured storage. Rip packs, reveal graded gems, and build a collection that holds real value.
        </p>
        <Link
          href="/auth/login"
          className="bg-primary text-primary-foreground px-4 sm:px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity mt-2 sm:mt-4 text-sm sm:text-base"
        >
          Get Started with RipVault ➤
        </Link>
        
      </div>
      
    </div>
  )
}
