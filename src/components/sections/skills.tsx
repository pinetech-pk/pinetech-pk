// src/components/sections/skills.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Server,
  Shield,
  Wrench,
  Rocket,
  Palette,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const skillCategories = {
  frontend: {
    name: "Frontend",
    icon: Palette,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-500",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "ShadCN/UI",
      "Framer Motion",
    ],
    description:
      "Building beautiful, responsive user interfaces with modern React ecosystem",
  },
  backend: {
    name: "Backend",
    icon: Server,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-500",
    skills: ["Node.js", "Express", "MongoDB", "RESTful APIs", "GraphQL"],
    description:
      "Robust server-side solutions with Node.js and scalable databases",
  },
  auth: {
    name: "Authentication",
    icon: Shield,
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-500",
    skills: ["Kinde", "Auth0", "JWT", "OAuth", "Session Management"],
    description:
      "Secure authentication and authorization systems for modern applications",
  },
  tools: {
    name: "Tools",
    icon: Wrench,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-500",
    skills: [
      "Cloudinary",
      "Sentry",
      "AI Integration",
      "Email Services",
      "Payment Gateways",
    ],
    description:
      "Essential services and integrations that power modern web applications",
  },
  deployment: {
    name: "Deployment",
    icon: Rocket,
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-500",
    skills: ["Vercel", "Railway", "Digital Ocean", "AWS", "Docker"],
    description:
      "Reliable deployment and hosting solutions for production applications",
  },
  approach: {
    name: "Approach",
    icon: Zap,
    color: "from-pine-500 to-pine-600",
    bgColor: "bg-pine-500",
    skills: [
      "Fast Prototyping",
      "AI-Powered Development",
      "Modern Stack",
      "Best Practices",
      "Scalable Architecture",
    ],
    description:
      "My development philosophy focused on speed, quality, and modern best practices",
  },
};

export function SkillsSection() {
  const [selectedCategory, setSelectedCategory] = useState<
    keyof typeof skillCategories | null
  >(null);
  const [hoveredCategory, setHoveredCategory] = useState<
    keyof typeof skillCategories | null
  >(null);

  const handleCategoryClick = (key: string) => {
    const newSelection =
      selectedCategory === key ? null : (key as keyof typeof skillCategories);
    setSelectedCategory(newSelection);
  };

  return (
    <section
      id="skills"
      className="py-20 lg:py-32 bg-gradient-to-b from-muted/30 to-background"
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
              Skills & Technologies
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Modern Stack,
              <br />
              <span className="text-pine-600 dark:text-pine-400">
                Proven Results
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              Explore my technology expertise. Each area represents a core
              competency that I bring to every project.
            </p>
            <p className="text-sm text-muted-foreground">
              Click on any skill area to explore the technologies
            </p>
          </div>

          {/* Skills Grid - Clean layout for both desktop and mobile */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 mb-12">
            {Object.entries(skillCategories).map(([key, category], index) => {
              const isHovered = hoveredCategory === key;
              const isSelected = selectedCategory === key;
              const isActive = isHovered || isSelected;

              return (
                <motion.div
                  key={key}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.05 * index,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() =>
                    setHoveredCategory(key as keyof typeof skillCategories)
                  }
                  onHoverEnd={() => setHoveredCategory(null)}
                  onClick={() => handleCategoryClick(key)}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col items-center space-y-3">
                    {/* Icon Container */}
                    <div className="relative">
                      <div
                        className={cn(
                          "relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 bg-gradient-to-br",
                          category.color,
                          isActive && "shadow-lg scale-105"
                        )}
                      >
                        <category.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />

                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-white/30"
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.5, 0.2, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                      </div>

                      {/* Selection dot */}
                      {isSelected && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pine-600 dark:bg-pine-400 rounded-full" />
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={cn(
                        "text-xs md:text-sm font-medium transition-all duration-200 text-center",
                        isActive
                          ? "text-foreground scale-105"
                          : "text-muted-foreground"
                      )}
                    >
                      {category.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Detailed view */}
          <AnimatePresence mode="wait">
            {selectedCategory && (
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 bg-background/50 backdrop-blur-sm border-pine-200 dark:border-pine-800">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4 mb-6">
                      <div
                        className={cn(
                          "p-3 rounded-xl bg-gradient-to-br",
                          skillCategories[selectedCategory].color
                        )}
                      >
                        {(() => {
                          const IconComponent =
                            skillCategories[selectedCategory].icon;
                          return (
                            <IconComponent className="h-6 w-6 text-white" />
                          );
                        })()}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          {skillCategories[selectedCategory].name}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {skillCategories[selectedCategory].description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {skillCategories[selectedCategory].skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-sm"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-border/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCategory(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ← Back to skills overview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats cards - only show when no category is selected */}
          {!selectedCategory && (
            <motion.div
              className="grid md:grid-cols-3 gap-6 mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-0">
                  <Code2 className="h-8 w-8 text-pine-600 dark:text-pine-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">Modern Stack</div>
                  <div className="text-sm text-muted-foreground">
                    Latest React, Next.js, and TypeScript
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-0">
                  <Zap className="h-8 w-8 text-pine-600 dark:text-pine-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">Fast Delivery</div>
                  <div className="text-sm text-muted-foreground">
                    AI-powered development workflow
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-0">
                  <Shield className="h-8 w-8 text-pine-600 dark:text-pine-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">
                    Production Ready
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Scalable, secure, maintainable code
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
