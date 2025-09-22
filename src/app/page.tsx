// src/app/page.tsx
import { Header } from "@/components/shared/header";
import { HeroSection } from "@/components/sections/hero";
import { StorySection } from "@/components/sections/story";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <StorySection />
      <SkillsSection />
      <ProjectsSection />

      {/* Placeholder for future sections */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Contact Section</h2>
          <p className="text-muted-foreground">Coming next...</p>
        </div>
      </section>
    </div>
  );
}
