import heroImg from "@/assets/hero-interior.jpg";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt="Luxury CozyInn living room at dusk with city skyline"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20">
        <span className="inline-block text-xs sm:text-sm uppercase tracking-[0.3em] text-white/70 mb-6">
          Premium Shortlet Rentals
        </span>
        <h1 className="font-display text-white text-4xl sm:text-6xl md:text-7xl font-medium leading-[1.05]">
          Your Premium Home <br className="hidden sm:block" />
          <em className="not-italic text-primary">Away From Home</em>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-white/80 max-w-xl mx-auto">
          Curated apartments designed for effortless comfort. Stay a night, a week, or a season.
        </p>
        <div className="mt-10 flex items-center justify-center">
          <a
            href="#book"
            className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-base font-semibold shadow-2xl shadow-primary/40 hover:translate-y-[-2px] hover:shadow-primary/60 transition-all"
          >
            Book Your Stay
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>

      {/* Floating mobile CTA */}
      <a
        href="#book"
        className="md:hidden fixed bottom-5 inset-x-5 z-30 rounded-full bg-primary text-primary-foreground py-3.5 text-center font-semibold shadow-lg shadow-primary/40"
      >
        Book Your Stay
      </a>
    </section>
  );
}