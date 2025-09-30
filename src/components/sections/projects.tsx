"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Users,
  TrendingUp,
  Heart,
  BarChart3,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const projects = [
  {
    id: 0,
    name: "Meal Planner",
    tagline: "Universal meal planning solution",
    description:
      "A globally scalable app addressing universal meal planning needs with focus on convenience, health goals, and budget management.",
    role: "Business Strategist, Founder & Full-Stack Developer",
    status: "In Production",
    stack: [
      "Next.js",
      "React",
      "Express",
      "Node.js",
      "ShadCN",
      "Cloudinary",
      "Sentry",
    ],
    features: [
      "Convenience Planning",
      "Health & Diet Goals",
      "Budget Management",
      "Global Scalability",
    ],
    icon: Heart,
    gradient: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    link: "https://mealplanner.pk",
  },
  {
    id: 1,
    name: "WhatPrice.com.pk",
    tagline: "Pakistan's trusted price discovery platform",
    description:
      "A 9-year proven platform with millions of users across Pakistan's major cities. Built organic search dominance in price comparison, now transforming into a sustainable vendor-first subscription marketplace with automated listings and multi-tier access.",
    role: "Founder & Platform Developer",
    status: "Strategic Rebrand",
    stack: [
      "Next.js",
      "React",
      "MongoDB",
      "SEO Optimization",
      "Vendor Dashboard",
      "Subscription System",
    ],
    features: [
      "Price Discovery Platform",
      "Vendor Subscriptions",
      "Multi-tier Access",
      "Automated Listings",
    ],
    icon: TrendingUp,
    gradient: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    link: "https://whatprice.com.pk",
  },
  {
    id: 2,
    name: "Nikah First",
    tagline: "Modern matrimonial platform",
    description:
      "Disruptive marriage platform with free-tier access, multi-profile management, and innovative credits-based system.",
    role: "Market Analyst, Product Strategist & Developer",
    status: "In Production",
    stack: [
      "Next.js",
      "React",
      "MongoDB",
      "Auth0",
      "Credits System",
      "Multi-tier Architecture",
    ],
    features: [
      "Free Tier Access",
      "Multi-Profile Management",
      "Credits System",
      "Role-based Access",
    ],
    icon: Users,
    gradient: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    link: "https://nikahfirst.com",
  },
  {
    id: 3,
    name: "Tadawul Insight",
    tagline: "Saudi stock market community",
    description:
      "Specialized platform for Saudi traders with curated content, signal validation, and role-driven community features.",
    role: "Fintech Strategist, Platform Architect & Developer",
    status: "In Production",
    stack: [
      "Next.js",
      "React",
      "Role-based Access",
      "Content Management",
      "Signal Validation",
    ],
    features: [
      "Curated Content",
      "Trade Signals",
      "Community Features",
      "Saudi Market Focus",
    ],
    icon: BarChart3,
    gradient: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    link: "https://tadawulinsight.com",
  },
];

const featureDescriptions = [
  "Core functionality that drives user engagement",
  "Key differentiator in the market",
  "Scalable feature for growth",
  "Strategic advantage for expansion",
];

export function ProjectsSection() {
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  const toggleProject = (id: number) => {
    setExpandedProject(expandedProject === id ? null : id);
  };

  return (
    <section
      id="projects"
      className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 text-pine-600 dark:text-pine-400 border-pine-200 dark:border-pine-800"
            >
              Portfolio Projects
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              From Concept to
              <br />
              <span className="text-pine-600 dark:text-pine-400">
                Production Reality
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Four applications currently in production, each solving real-world
              problems with modern technology and strategic thinking.
            </p>
          </div>

          {/* Projects Stack */}
          <div className="space-y-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    "overflow-hidden transition-all duration-300 hover:shadow-xl",
                    project.bgColor,
                    "border-2 border-border/50 hover:border-pine-300 dark:hover:border-pine-700"
                  )}
                >
                  <CardContent className="p-0">
                    {/* Main Project Card */}
                    <div
                      className={cn(
                        "p-6 md:p-8 cursor-pointer",
                        "grid md:grid-cols-[auto_1fr_auto] gap-6 items-start"
                      )}
                      onClick={() => toggleProject(project.id)}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "p-4 rounded-xl bg-gradient-to-br shrink-0",
                          project.gradient
                        )}
                      >
                        <project.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-2xl md:text-3xl font-bold">
                            {project.name}
                          </h3>
                          <Badge variant="pine" className="shrink-0">
                            {project.status}
                          </Badge>
                        </div>

                        <p className="text-sm md:text-base text-muted-foreground mb-3">
                          {project.tagline}
                        </p>

                        <p className="text-sm font-medium text-pine-600 dark:text-pine-400 mb-4">
                          {project.role}
                        </p>

                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                          {project.description}
                        </p>

                        {/* Key Features - Always visible */}
                        <div>
                          <div className="text-sm font-semibold mb-2 text-foreground">
                            Key Features:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.features.map((feature) => (
                              <Badge
                                key={feature}
                                variant="secondary"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Expand Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 md:self-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProject(project.id);
                        }}
                      >
                        {expandedProject === project.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedProject === project.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-border/50 overflow-hidden"
                        >
                          <div className="p-6 md:p-8 bg-background/50">
                            <div className="grid md:grid-cols-2 gap-8">
                              {/* Technology Stack */}
                              <div>
                                <h4 className="text-lg font-bold mb-4">
                                  Technology Stack
                                </h4>
                                <div className="flex flex-wrap gap-2 mb-6">
                                  {project.stack.map((tech) => (
                                    <Badge key={tech} variant="outline">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>

                                <h4 className="text-lg font-bold mb-3">
                                  My Role & Impact
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  As a{" "}
                                  <span className="font-semibold text-foreground">
                                    {project.role}
                                  </span>
                                  , I handled everything from market research
                                  and strategic planning to full technical
                                  implementation, demonstrating the complete
                                  skill set that makes me valuable as both a
                                  developer and business partner.
                                </p>
                              </div>

                              {/* Project Highlights */}
                              <div>
                                <h4 className="text-lg font-bold mb-4">
                                  Project Highlights
                                </h4>
                                <div className="space-y-4 mb-6">
                                  {project.features.map((feature, idx) => (
                                    <div
                                      key={feature}
                                      className="flex items-start space-x-3"
                                    >
                                      <div className="w-2 h-2 bg-pine-600 dark:bg-pine-400 rounded-full mt-2 shrink-0"></div>
                                      <div>
                                        <div className="font-medium text-sm">
                                          {feature}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {featureDescriptions[idx]}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <Button
                                  variant="pine"
                                  className="w-full group"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(
                                      project.link,
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                                  }}
                                >
                                  <Globe className="mr-2 h-4 w-4" />
                                  View Live Project
                                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
