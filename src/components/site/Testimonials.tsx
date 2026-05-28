import { Star, BadgeCheck, Zap, ShieldCheck } from "lucide-react";

const reviews = [
  {
    quote: "Felt like a private suite at a five-star hotel — without the hotel.",
    name: "Amara O.",
    place: "Lagos, NG",
  },
  {
    quote: "Spotless, stylish, and the concierge sorted everything before we asked.",
    name: "Daniel R.",
    place: "London, UK",
  },
  {
    quote: "Best shortlet stay we've ever booked. We're already planning the next trip.",
    name: "Priya & Sam",
    place: "Toronto, CA",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-primary">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="reviews" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Loved by guests</span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-medium">
              4.9 <Star className="inline h-7 w-7 fill-primary text-primary -mt-2" /> from 320+ stays
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-primary" /> Verified Host</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> Superhost</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-primary" /> Instant Book</span>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="rounded-2xl bg-card border border-border/70 p-6 sm:p-7 flex flex-col gap-4"
            >
              <Stars />
              <blockquote className="font-display text-lg leading-snug">"{r.quote}"</blockquote>
              <figcaption className="mt-auto text-sm">
                <div className="font-semibold">{r.name}</div>
                <div className="text-muted-foreground">{r.place}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}