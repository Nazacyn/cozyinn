import { Home, Building2, Heart, Hotel, Crown, Waves, Moon, Briefcase, Trees, Users } from "lucide-react";

type Property = {
  name: string;
  type: string;
  price: string;
  img: string;
  icon: React.ComponentType<{ className?: string }>;
};

const properties: Property[] = [
  { name: "The Loft", type: "Studio", price: "₦45,000", icon: Home,
    img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80" },
  { name: "City View Suite", type: "1-Bedroom", price: "₦72,000", icon: Building2,
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80" },
  { name: "The Couples Retreat", type: "1-Bedroom", price: "₦68,000", icon: Heart,
    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80" },
  { name: "The Grand Suite", type: "2-Bedroom", price: "₦110,000", icon: Hotel,
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80" },
  { name: "The Penthouse", type: "Penthouse", price: "₦220,000", icon: Crown,
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" },
  { name: "Poolside Studio", type: "Studio", price: "₦50,000", icon: Waves,
    img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80" },
  { name: "The Cozy Nest", type: "Studio", price: "₦40,000", icon: Moon,
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80" },
  { name: "The Executive", type: "1-Bedroom", price: "₦65,000", icon: Briefcase,
    img: "https://images.unsplash.com/photo-1551776235-dde6d4829808?auto=format&fit=crop&w=1200&q=80" },
  { name: "Garden Studio", type: "Studio", price: "₦38,000", icon: Trees,
    img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80" },
  { name: "The Family Flat", type: "2-Bedroom", price: "₦95,000", icon: Users,
    img: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80" },
];

export function Properties() {
  return (
    <section id="properties" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">The Collection</span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-medium">
            Our <em className="not-italic text-primary">Luxury Units</em>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ten meticulously designed homes. Pick your favourite and book in seconds.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map(({ name, type, price, img, icon: Icon }) => (
            <article
              key={name}
              className="group flex flex-col overflow-hidden rounded-2xl bg-card border border-border/70 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={img}
                  alt={`${name} — ${type}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {type}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl font-semibold">{name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-semibold text-primary">{price}</span>
                  <span className="text-sm text-muted-foreground">/ night</span>
                </div>
                <a
                  href="#book"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition"
                >
                  Book now
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}