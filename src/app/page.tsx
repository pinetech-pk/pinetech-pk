// src/app/page.tsx
import { Header } from "@/components/shared/header";
import { HeroSection } from "@/components/sections/hero";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />

      {/* Placeholder for future sections */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">About Section</h2>
          <p className="text-muted-foreground">Coming next...</p>
        </div>
      </section>
    </div>
  );
}
