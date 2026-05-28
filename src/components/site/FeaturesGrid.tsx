import { BedDouble, Wifi, Lock, Waves, Tv, ChefHat, Bell, Car } from "lucide-react";

const features = [
  { icon: BedDouble, title: "2 Bedrooms", desc: "Plush king beds with premium linens" },
  { icon: Wifi, title: "High-Speed Wi-Fi", desc: "Gigabit fibre, ideal for remote work" },
  { icon: Lock, title: "Smart Lock", desc: "Keyless check-in, anytime arrival" },
  { icon: Waves, title: "Infinity Pool", desc: "Rooftop pool with skyline views" },
  { icon: Tv, title: "Smart TV", desc: "Netflix, Prime & local streaming" },
  { icon: ChefHat, title: "Full Kitchen", desc: "Chef-grade appliances & cookware" },
  { icon: Bell, title: "24/7 Concierge", desc: "Real humans, always on call" },
  { icon: Car, title: "Secure Parking", desc: "Private bay with EV charging" },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">The Space</span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-medium">
            Everything you need, <em className="not-italic text-primary">nothing you don't</em>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Thoughtfully equipped so you can settle in the moment you arrive.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl bg-card border border-border/70 p-5 sm:p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}