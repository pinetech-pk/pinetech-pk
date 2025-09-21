"use client";

import { useState, useRef } from "react";
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
    color: "bg-blue-500",
    position: { x: 20, y: 15 },
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "ShadCN/UI",
      "Framer Motion",
    ],
  },
  backend: {
    name: "Backend",
    icon: Server,
    color: "bg-green-500",
    position: { x: 75, y: 25 },
    skills: ["Node.js", "Express", "MongoDB", "RESTful APIs", "GraphQL"],
  },
  auth: {
    name: "Authentication",
    icon: Shield,
    color: "bg-red-500",
    position: { x: 15, y: 70 },
    skills: ["Kinde", "Auth0", "JWT", "OAuth", "Session Management"],
  },
  tools: {
    name: "Tools & Services",
    icon: Wrench,
    color: "bg-purple-500",
    position: { x: 65, y: 75 },
    skills: [
      "Cloudinary",
      "Sentry",
      "AI Integration",
      "Email Services",
      "Payment Gateways",
    ],
  },
  deployment: {
    name: "Deployment",
    icon: Rocket,
    color: "bg-orange-500",
    position: { x: 85, y: 60 },
    skills: ["Vercel", "Railway", "Digital Ocean", "AWS", "Docker"],
  },
  approach: {
    name: "Approach",
    icon: Zap,
    color: "bg-pine-500",
    position: { x: 45, y: 45 },
    skills: [
      "Fast Prototyping",
      "AI-Powered Development",
      "Modern Stack",
      "Best Practices",
      "Scalable Architecture",
    ],
  },
};

export function SkillsSection() {
  const [selectedCategory, setSelectedCategory] = useState<
    keyof typeof skillCategories | null
  >(null);
  const [hoveredCategory, setHoveredCategory] = useState<
    keyof typeof skillCategories | null
  >(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (key: string) => {
    const newSelection =
      selectedCategory === key ? null : (key as keyof typeof skillCategories);
    setSelectedCategory(newSelection);

    if (newSelection && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
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
              Explore my technology constellation. Each cluster represents a
              core area of expertise that I bring to every project.
            </p>
            <p className="text-sm text-muted-foreground">
              Click on any skill area to explore the technologies
            </p>
          </div>

          <div className="relative h-72 md:h-96 mb-12 bg-gradient-to-br from-background/50 to-muted/50 rounded-2xl border border-border/50 overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-pine-400 rounded-full animate-pulse"></div>
              <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-pine-400 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-pine-400 rounded-full animate-pulse delay-2000"></div>
              <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-pine-400 rounded-full animate-pulse delay-500"></div>
            </div>

            {Object.entries(skillCategories).map(([key, category]) => {
              const isHovered = hoveredCategory === key;
              const isSelected = selectedCategory === key;
              const isActive = isHovered || isSelected;

              return (
                <motion.div
                  key={key}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${category.position.x}%`,
                    top: `${category.position.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.1 * Object.keys(skillCategories).indexOf(key),
                    duration: 0.5,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() =>
                    setHoveredCategory(key as keyof typeof skillCategories)
                  }
                  onHoverEnd={() => setHoveredCategory(null)}
                  onClick={() => handleCategoryClick(key)}
                >
                  <div
                    className={cn(
                      "relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                      category.color,
                      isActive && "shadow-2xl shadow-current/50"
                    )}
                  >
                    <category.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />

                    {isActive && (
                      <motion.div
                        className={cn(
                          "absolute inset-0 rounded-full border-2 border-current opacity-50",
                          category.color
                        )}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>

                  <motion.div
                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                    animate={{
                      opacity: isActive ? 1 : 0.7,
                      scale: isActive ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-xs md:text-sm font-medium bg-background/90 backdrop-blur-sm px-2 py-1 rounded border border-border/50">
                      {category.name}
                    </span>
                  </motion.div>

                  <motion.div
                    className="absolute top-1/2 left-1/2 w-px bg-gradient-to-r from-pine-400/30 to-transparent origin-left"
                    style={{
                      height: "2px",
                      width: `${Math.sqrt(Math.pow(50 - category.position.x, 2) + Math.pow(50 - category.position.y, 2))}%`,
                      transform: `translate(-50%, -50%) rotate(${(Math.atan2(50 - category.position.y, 50 - category.position.x) * 180) / Math.PI}deg)`,
                    }}
                    animate={{ opacity: isActive ? 0.6 : 0.2 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              );
            })}
          </div>

          <div ref={detailsRef}>
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
                            "p-3 rounded-lg",
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
                            {selectedCategory === "frontend" &&
                              "Building beautiful, responsive user interfaces with modern React ecosystem"}
                            {selectedCategory === "backend" &&
                              "Robust server-side solutions with Node.js and scalable databases"}
                            {selectedCategory === "auth" &&
                              "Secure authentication and authorization systems for modern applications"}
                            {selectedCategory === "tools" &&
                              "Essential services and integrations that power modern web applications"}
                            {selectedCategory === "deployment" &&
                              "Reliable deployment and hosting solutions for production applications"}
                            {selectedCategory === "approach" &&
                              "My development philosophy focused on speed, quality, and modern best practices"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {skillCategories[selectedCategory].skills.map(
                          (skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="text-sm"
                            >
                              {skill}
                            </Badge>
                          )
                        )}
                      </div>

                      <div className="mt-6 pt-6 border-t border-border/50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCategory(null)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ← Back to constellation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
