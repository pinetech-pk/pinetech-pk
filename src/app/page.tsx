// src/app/page.tsx
import { Header } from "@/components/shared/header";
import { HeroSection } from "@/components/sections/hero";
import { StorySection } from "@/components/sections/story";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <StorySection />

      {/* Placeholder for future sections */}
      <section id="skills" className="py-20 bg-muted/30">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Skills Section</h2>
          <p className="text-muted-foreground">Coming next...</p>
        </div>
      </section>
    </div>
  );
}
