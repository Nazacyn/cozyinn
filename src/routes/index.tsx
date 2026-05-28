import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { FeaturesGrid } from "@/components/site/FeaturesGrid";
import { Properties } from "@/components/site/Properties";
import { Testimonials } from "@/components/site/Testimonials";
import { SiteFooter } from "@/components/site/SiteFooter";
import { VoiceflowWidget } from "@/components/site/VoiceflowWidget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CozyInn Rentals — Premium Shortlet Stays" },
      { name: "description", content: "Book curated, luxury shortlet apartments. Smart locks, infinity pool, 24/7 concierge — your premium home away from home." },
      { property: "og:title", content: "CozyInn Rentals — Premium Shortlet Stays" },
      { property: "og:description", content: "Book curated, luxury shortlet apartments. Smart locks, infinity pool, 24/7 concierge." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Properties />
      <FeaturesGrid />
      <Testimonials />
      <SiteFooter />
      <VoiceflowWidget />
    </main>
  );
}
