// src/app/page.tsx
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Test content with scroll */}
      <main className="pt-20">
        {/* Hero test section */}
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-pine-50/30 dark:to-pine-950/20">
          <div className="container px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Pine<span className="text-pine-600 dark:text-pine-400">Tech</span>
              .pk
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Testing our components with Tailwind v4 and Pine theme
            </p>

            {/* Button variants test */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Button variant="default">Default</Button>
              <Button variant="pine">Pine Gradient</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>

            {/* Card test */}
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Component Test</CardTitle>
                  <CardDescription>
                    Testing our Pine-themed components with Tailwind v4
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All components are working correctly with our custom Pine
                    theme colors and the new Tailwind v4 configuration system.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Test scroll behavior */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Scroll Test</h2>
            <p className="text-muted-foreground">
              Scroll up to see the header backdrop blur effect
            </p>
          </div>
        </section>

        {/* More content for scroll testing */}
        <section className="py-20">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-pine-600 dark:text-pine-400">
              Pine Colors Test
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-2xl mx-auto">
              <div className="bg-pine-100 dark:bg-pine-900 p-4 rounded text-pine-900 dark:text-pine-100 text-sm">
                Pine 100
              </div>
              <div className="bg-pine-300 dark:bg-pine-700 p-4 rounded text-pine-900 dark:text-pine-100 text-sm">
                Pine 300
              </div>
              <div className="bg-pine-500 p-4 rounded text-white text-sm">
                Pine 500
              </div>
              <div className="bg-pine-600 p-4 rounded text-white text-sm">
                Pine 600
              </div>
              <div className="bg-pine-800 p-4 rounded text-white text-sm">
                Pine 800
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
