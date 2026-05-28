export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-display text-xl font-semibold tracking-tight">
          CozyInn<span className="text-primary">.</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#reviews" className="hover:text-foreground transition">Reviews</a>
          <a href="#contact" className="hover:text-foreground transition">Contact</a>
        </nav>
        <a
          href="#book"
          className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 sm:px-5 py-2 text-sm font-medium shadow-sm hover:opacity-90 transition"
        >
          Book Now
        </a>
      </div>
    </header>
  );
}