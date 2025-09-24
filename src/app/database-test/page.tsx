"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Badge } from "@/components/ui/badge";
import { UserJourney } from "@/components/journey/UserJourney";

export default function LetsWorkTogetherPage() {
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side hydration is complete
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render interactive elements until client is ready
  if (!isClient) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20 pb-10">
          <section className="py-10 lg:py-20">
            <div className="container px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
                    <div className="h-12 bg-muted rounded w-96 mx-auto mb-6"></div>
                    <div className="h-4 bg-muted rounded w-80 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-20 pb-10">
        <section className="py-10 lg:py-20">
          <div className="container px-4">
            <UserJourney />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
