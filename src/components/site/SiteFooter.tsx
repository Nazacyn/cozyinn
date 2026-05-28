export function SiteFooter() {
  return (
    <footer id="contact" className="bg-[oklch(0.18_0.01_270)] text-white/80">
      <div id="book" className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-24">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-12">
          <div>
            <div className="font-display text-2xl text-white font-semibold">
              CozyInn<span className="text-primary">.</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-white/60 leading-relaxed">
              Premium shortlet rentals designed for travelers who refuse to compromise.
            </p>
            <a
              href="mailto:hello@cozyinn.rentals"
              className="mt-6 inline-flex items-center rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              Book Your Stay
            </a>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-white/50 mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#reviews" className="hover:text-white transition">Reviews</a></li>
              <li><a href="#book" className="hover:text-white transition">Book</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-white/50 mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li>hello@cozyinn.rentals</li>
              <li>+1 (555) 010-7788</li>
              <li>Mon–Sun · 24/7</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© {new Date().getFullYear()} CozyInn Rentals. All rights reserved.</span>
          <span>Crafted for comfort.</span>
        </div>
      </div>

      {/*
        Chat widget mount point.
        TODO: Initialize chat widget here (e.g. Intercom, Crisp, custom).
        Keep this div present so the widget can attach without layout shifts.
      */}
      <div id="chat-widget-slot" aria-hidden="true" />
    </footer>
  );
}