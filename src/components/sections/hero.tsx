// src/components/sections/hero.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MapPin,
  Code,
  Briefcase,
  Users,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-pine-50/30 dark:to-pine-950/20" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container relative z-10 px-4 py-32">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          {/* Location badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center space-x-2 bg-pine-50 dark:bg-pine-950/50 text-pine-700 dark:text-pine-300 px-4 py-2 rounded-full text-sm font-medium mb-8"
          >
            <MapPin className="h-4 w-4" />
            <span>Karachi, Pakistan 🇵🇰</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            React & Next.js
            <br />
            <span className="text-pine-600 dark:text-pine-400">Developer</span>
          </motion.h1>

          {/* Professional subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            <span className="font-semibold text-foreground">
              20+ years of IT experience
            </span>{" "}
            meets cutting-edge development. From{" "}
            <span className="text-pine-600 dark:text-pine-400 font-medium">
              business strategy to full-stack solutions
            </span>{" "}
            — I bring both vision and execution.
          </motion.p>

          {/* Value proposition */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-background/50 dark:bg-background/20 px-4 py-2 rounded-full border border-border/50">
              <Code className="h-4 w-4 text-pine-600 dark:text-pine-400" />
              <span>Full-Stack Developer</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-background/50 dark:bg-background/20 px-4 py-2 rounded-full border border-border/50">
              <Briefcase className="h-4 w-4 text-pine-600 dark:text-pine-400" />
              <span>Business Strategist</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-background/50 dark:bg-background/20 px-4 py-2 rounded-full border border-border/50">
              <Users className="h-4 w-4 text-pine-600 dark:text-pine-400" />
              <span>Potential Co-founder</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-background/50 dark:bg-background/20 px-4 py-2 rounded-full border border-border/50">
              <TrendingUp className="h-4 w-4 text-pine-600 dark:text-pine-400" />
              <span>Competitive Pricing</span>
            </div>
          </motion.div>

          {/* Experience highlight */}
          <motion.div
            variants={fadeInUp}
            className="max-w-2xl mx-auto mb-12 p-6 bg-background/50 dark:bg-background/20 rounded-lg border border-border/50 backdrop-blur-sm"
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              My journey spans{" "}
              <span className="font-semibold text-foreground">
                9 years building the &quot;What Price&quot; brand
              </span>
              ,
              <span className="font-semibold text-foreground">
                {" "}
                3 years mastering financial markets
              </span>
              , and now
              <span className="text-pine-600 dark:text-pine-400 font-semibold">
                {" "}
                actively developing modern applications
              </span>
              with React, Next.js, and cutting-edge tools.
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              size="lg"
              variant="pine"
              className="group"
              onClick={() => scrollToSection("projects")}
            >
              View My Projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("about")}
            >
              Read My Story
            </Button>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto pt-16 border-t border-border/50"
          >
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-pine-600 dark:text-pine-400 mb-2 group-hover:scale-105 transition-transform duration-200">
                20+
              </div>
              <div className="text-sm text-muted-foreground">
                Years IT Experience
              </div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-pine-600 dark:text-pine-400 mb-2 group-hover:scale-105 transition-transform duration-200">
                4
              </div>
              <div className="text-sm text-muted-foreground">
                Apps in Production
              </div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-pine-600 dark:text-pine-400 mb-2 group-hover:scale-105 transition-transform duration-200">
                3
              </div>
              <div className="text-sm text-muted-foreground">
                Apps in Pipeline
              </div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-pine-600 dark:text-pine-400 mb-2 group-hover:scale-105 transition-transform duration-200">
                9+
              </div>
              <div className="text-sm text-muted-foreground">
                Years Brand Building
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={fadeInUp}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-pine-600 dark:bg-pine-400 rounded-full mt-2 animate-bounce"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
