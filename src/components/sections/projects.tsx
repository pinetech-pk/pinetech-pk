// src/components/sections/projects.tsx
"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Code,
  Users,
  TrendingUp,
  Heart,
  DollarSign,
  BarChart3,
  Globe,
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
  },
  {
    id: 1,
    name: "Impact Meter - MIF",
    tagline: "Transparency in donation impact",
    description:
      "Powerful tool building trust between donors and beneficiaries with real-time impact tracking and transparent fund allocation.",
    role: "Social Innovation Strategist, Systems Designer & Developer",
    status: "In Production",
    stack: [
      "Next.js",
      "React",
      "Node.js",
      "Data Visualization",
      "Real-time Updates",
    ],
    features: [
      "Impact Tracking",
      "Donor Transparency",
      "Real-time Progress",
      "Trust Building",
    ],
    icon: TrendingUp,
    gradient: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
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
  },
];

export function ProjectsSection() {
  const [currentFace, setCurrentFace] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const cubeRef = useRef<HTMLDivElement>(null);

  const rotateCube = (direction: "next" | "prev") => {
    if (isRotating) return;

    setIsRotating(true);
    const newFace =
      direction === "next" ? (currentFace + 1) % 4 : (currentFace - 1 + 4) % 4;

    setCurrentFace(newFace);
    setSelectedProject(null);

    setTimeout(() => setIsRotating(false), 800);
  };

  const getRotation = () => {
    const rotations = [
      "rotateY(0deg)", // Front (Meal Planner)
      "rotateY(-90deg)", // Right (Impact Meter)
      "rotateY(-180deg)", // Back (Nikah First)
      "rotateY(-270deg)", // Left (Tadawul Insight)
    ];
    return rotations[currentFace];
  };

  const currentProject = projects[currentFace];

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
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              Four applications currently in production, each solving real-world
              problems with modern technology and strategic thinking.
            </p>
            <p className="text-sm text-muted-foreground">
              Navigate with arrows or swipe to explore each project
            </p>
          </div>

          {/* 3D Cube Container */}
          <div className="relative max-w-4xl mx-auto mb-16">
            <div className="perspective-1000 h-96 md:h-[500px] flex items-center justify-center">
              <div
                ref={cubeRef}
                className="relative preserve-3d transition-transform duration-700 ease-out"
                style={{
                  transform: `${getRotation()} scale(0.9)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Cube faces */}
                {projects.map((project, index) => {
                  const faceTransforms = [
                    "translateZ(200px)", // Front
                    "rotateY(90deg) translateZ(200px)", // Right
                    "rotateY(180deg) translateZ(200px)", // Back
                    "rotateY(270deg) translateZ(200px)", // Left
                  ];

                  // Calculate if this face is currently visible/front-facing
                  const isFrontFace = currentFace === index;
                  const isBackFace = (currentFace + 2) % 4 === index;

                  return (
                    <div
                      key={project.id}
                      className="absolute inset-0 w-80 h-80 md:w-96 md:h-96"
                      style={{
                        transform: faceTransforms[index],
                        transformStyle: "preserve-3d",
                        opacity: isBackFace ? 0 : 1,
                        visibility: isBackFace ? "hidden" : "visible",
                      }}
                    >
                      <Card
                        className={cn(
                          "w-full h-full p-8 cursor-pointer transition-all duration-300 relative",
                          project.bgColor,
                          "hover:shadow-2xl border-2",
                          currentFace === index
                            ? "border-pine-500 shadow-2xl z-10 backdrop-blur-sm"
                            : "border-border/50",
                          isFrontFace && "shadow-[0_0_50px_rgba(0,0,0,0.3)]"
                        )}
                        onClick={() =>
                          setSelectedProject(
                            selectedProject === project.id ? null : project.id
                          )
                        }
                      >
                        <CardContent className="p-0 h-full flex flex-col">
                          {/* Project icon and title */}
                          <div className="flex items-center space-x-4 mb-6">
                            <div
                              className={cn(
                                "p-4 rounded-xl bg-gradient-to-br",
                                project.gradient
                              )}
                            >
                              <project.icon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold mb-1">
                                {project.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {project.tagline}
                              </p>
                            </div>
                          </div>

                          {/* Status and role */}
                          <div className="mb-4">
                            <Badge variant="pine" className="mb-2">
                              {project.status}
                            </Badge>
                            <p className="text-sm font-medium text-pine-600 dark:text-pine-400">
                              {project.role}
                            </p>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                            {project.description}
                          </p>

                          {/* Key features */}
                          <div className="mb-6">
                            <div className="text-sm font-medium mb-2">
                              Key Features:
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {project.features.slice(0, 4).map((feature) => (
                                <div
                                  key={feature}
                                  className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded"
                                >
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action button */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full group"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(
                                selectedProject === project.id
                                  ? null
                                  : project.id
                              );
                            }}
                          >
                            {selectedProject === project.id
                              ? "Hide Details"
                              : "View Details"}
                            <ExternalLink className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => rotateCube("prev")}
                disabled={isRotating}
                className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => rotateCube("next")}
                disabled={isRotating}
                className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Project indicator dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isRotating) {
                      setCurrentFace(index);
                      setSelectedProject(null);
                    }
                  }}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    currentFace === index
                      ? "bg-pine-600 dark:bg-pine-400 scale-125"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Detailed project info */}
          <AnimatePresence mode="wait">
            {selectedProject !== null && (
              <motion.div
                key={selectedProject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 bg-background/50 backdrop-blur-sm border-pine-200 dark:border-pine-800">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-2xl font-bold mb-4">
                          Technology Stack
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {projects[selectedProject].stack.map((tech) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        <h4 className="text-lg font-semibold mb-3">
                          My Role & Impact
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          As a{" "}
                          <span className="font-semibold text-foreground">
                            {projects[selectedProject].role}
                          </span>
                          , I handled everything from market research and
                          strategic planning to full technical implementation,
                          demonstrating the complete skill set that makes me
                          valuable as both a developer and business partner.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-3">
                          Project Highlights
                        </h4>
                        <div className="space-y-3">
                          {projects[selectedProject].features.map(
                            (feature, index) => (
                              <div
                                key={feature}
                                className="flex items-start space-x-3"
                              >
                                <div className="w-2 h-2 bg-pine-600 dark:bg-pine-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <div className="font-medium">{feature}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {index === 0 &&
                                      "Core functionality that drives user engagement"}
                                    {index === 1 &&
                                      "Key differentiator in the market"}
                                    {index === 2 &&
                                      "Scalable feature for growth"}
                                    {index === 3 &&
                                      "Strategic advantage for expansion"}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-border/50">
                          <Button variant="pine" className="w-full group">
                            <Globe className="mr-2 h-4 w-4" />
                            View Live Project
                            <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
