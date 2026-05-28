# CozyInn Rentals — 1-Page Booking Site

A modern, conversion-focused single-page site for a premium shortlet rental, built with React + Tailwind. Luxury palette (deep charcoal/black, clean white, royal blue `#0070f3`), fully responsive, modular so a chat widget can drop into the footer later.

## Sections (in order)

1. **Sticky Top Nav** — minimal: "CozyInn" wordmark left, anchor links (Features, Reviews, Book) right, royal-blue "Book Now" pill on desktop.

2. **Hero**
   - Full-viewport background image (luxury interior, generated as a hero asset).
   - Dark gradient overlay for legibility on charcoal/white type.
   - Headline: *"Your Premium Home Away From Home"* (large serif/display weight).
   - Subcopy: short line on comfort + location.
   - Floating royal-blue **"Book Your Stay"** CTA with subtle shadow + hover lift. Stays visually prominent; on scroll a compact version persists in the nav.

3. **Property Details — Features Grid**
   - Clean responsive grid (2 cols mobile → 4 cols desktop).
   - 8 feature cards with icon + title + one-line description:
     2 Bedrooms · High-Speed Wi-Fi · Smart Lock · Infinity Pool · Smart TV · Fully Equipped Kitchen · 24/7 Concierge · Secure Parking.
   - White cards on off-white section, charcoal text, royal-blue icon accents.

4. **Testimonial / Trust Banner**
   - Minimal horizontal row: aggregate "4.9 ★ from 320+ guests" headline.
   - 3 short testimonial cards (name, location, 5-star row, 1–2 line quote).
   - Subtle divider strip with trust badges (Verified Host · Superhost · Instant Book).

5. **Footer**
   - Three columns: brand + tagline, quick links, contact.
   - **Reserved slot** (`<div id="chat-widget-slot">`) bottom-right with a TODO comment, so a chat widget can mount later without layout changes.
   - Copyright row.

## Design System

- Tokens in `index.css` + `tailwind.config.ts` (HSL semantic tokens):
  - `--background` clean white, `--foreground` deep charcoal (#0B0B0F).
  - `--primary` royal blue `#0070f3`, `--primary-foreground` white.
  - `--muted` soft neutral for section alternation.
- Typography: display serif (e.g. Fraunces) for headlines, Inter for body.
- Rounded-2xl cards, soft shadows, generous spacing, subtle fade-in on scroll.
- Mobile-first: hero text scales, grid collapses, CTA remains thumb-reachable.

## File Structure

```text
src/
  pages/Index.tsx           // composes sections
  components/site/
    Navbar.tsx
    Hero.tsx
    FeaturesGrid.tsx
    Testimonials.tsx
    SiteFooter.tsx          // includes chat-widget-slot
  assets/
    hero-interior.jpg       // generated
index.css                   // design tokens
tailwind.config.ts          // token wiring
```

Each section is a self-contained component so future edits (and the chat widget mount) are isolated.

## Technical Notes

- Generate one hero image via image gen (luxury living room, warm evening light).
- Use lucide-react for feature icons (BedDouble, Wifi, Lock, Waves, Tv, ChefHat, Concierge/Bell, Car).
- SEO: `<title>` ≤60 chars, meta description, single H1 in Hero, semantic `<section>` landmarks, alt text on hero.
- No backend needed for this pass — "Book Your Stay" scrolls to a booking anchor (placeholder form can be added later).
