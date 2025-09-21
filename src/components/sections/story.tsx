// src/components/sections/story.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Briefcase,
  BarChart3,
  Code2,
  Lightbulb,
  Users,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const timelineItems = [
  {
    period: "20+ Years",
    title: "IT Industry Foundation",
    description:
      "Built comprehensive experience across technology, strategy, and business development",
    icon: Briefcase,
    color: "bg-pine-100 dark:bg-pine-900/30",
  },
  {
    period: "9 Years",
    title: "What Price Brand Building",
    description:
      "Strategic planning and online marketing, transitioning from marketing strategist to business strategist driving digital growth",
    icon: TrendingUp,
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    period: "3 Years",
    title: "Financial Markets Mastery",
    description:
      "Professional break focusing on financial markets, advancing from novice to expert level, strengthening analytical and strategic thinking",
    icon: BarChart3,
    color: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    period: "Current",
    title: "Modern Development Era",
    description:
      "Embracing latest advancements in software development and AI tools, upskilling in React, Next.js, JavaScript, and full-stack development",
    icon: Code2,
    color: "bg-pine-100 dark:bg-pine-900/30",
  },
];

export function StorySection() {
  return (
    <section
      id="about"
      className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Section header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 text-pine-600 dark:text-pine-400 border-pine-200 dark:border-pine-800"
            >
              My Story
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              From Strategy to Code,
              <br />
              <span className="text-pine-600 dark:text-pine-400">
                Experience Drives Innovation
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Two decades of IT experience shaped by strategic thinking,
              business growth, and an unwavering drive to learn and evolve with
              technology.
            </p>
          </motion.div>

          {/* Journey overview */}
          <motion.div variants={fadeInUp} className="mb-16">
            <Card className="p-8 bg-background/50 backdrop-blur-sm border-pine-200 dark:border-pine-800">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-3 bg-pine-gradient rounded-lg">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      The Journey Philosophy
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      My long experience fuels my drive to{" "}
                      <span className="font-semibold text-foreground">
                        continuously learn and evolve
                      </span>
                      , proving that age is never a barrier to growth. This
                      passion has become a strength: I not only build scalable,
                      modern solutions but also keep my{" "}
                      <span className="text-pine-600 dark:text-pine-400 font-semibold">
                        pricing highly competitive
                      </span>
                      , giving you the advantage of high-quality work at very
                      reasonable cost.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-border/50">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-pine-600 dark:text-pine-400 mx-auto mb-2" />
                    <div className="font-semibold">Business Development</div>
                    <div className="text-sm text-muted-foreground">
                      Strategic growth & partnerships
                    </div>
                  </div>
                  <div className="text-center">
                    <Target className="h-8 w-8 text-pine-600 dark:text-pine-400 mx-auto mb-2" />
                    <div className="font-semibold">Technical Excellence</div>
                    <div className="text-sm text-muted-foreground">
                      Modern full-stack solutions
                    </div>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-pine-600 dark:text-pine-400 mx-auto mb-2" />
                    <div className="font-semibold">Competitive Edge</div>
                    <div className="text-sm text-muted-foreground">
                      Experience + affordable pricing
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timeline */}
          <motion.div variants={fadeInUp} className="space-y-8">
            <h3 className="text-2xl font-bold text-center mb-12">
              Professional Timeline
            </h3>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-pine-600 via-pine-400 to-pine-600 rounded-full opacity-20"></div>

              {timelineItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } mb-12 last:mb-0`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-pine-gradient rounded-full border-4 border-background z-10 shadow-lg"></div>

                  {/* Content card */}
                  <div
                    className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-0">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${item.color}`}>
                            <item.icon className="h-6 w-6 text-pine-600 dark:text-pine-400" />
                          </div>
                          <div className="flex-1">
                            <Badge variant="secondary" className="mb-2 text-xs">
                              {item.period}
                            </Badge>
                            <h4 className="text-lg font-semibold mb-2">
                              {item.title}
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Current focus */}
          <motion.div variants={fadeInUp} className="mt-16">
            <Card className="p-8 bg-pine-gradient text-white">
              <CardContent className="p-0 text-center">
                <h3 className="text-2xl font-bold mb-4">Today's Reality</h3>
                <p className="text-lg leading-relaxed mb-6 text-pine-100">
                  I am actively developing my own applications —{" "}
                  <span className="font-semibold">
                    four currently in production and three more in the pipeline
                  </span>{" "}
                  — while also delivering projects for clients and stakeholders
                  using cutting-edge solutions.
                </p>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="font-semibold mb-2">Active Development</div>
                    <div className="text-sm text-pine-100">
                      Building production-ready applications with modern tech
                      stack
                    </div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="font-semibold mb-2">Client Projects</div>
                    <div className="text-sm text-pine-100">
                      Delivering solutions that combine strategy with technical
                      excellence
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
