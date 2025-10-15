"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Briefcase,
  Code,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    value: "contact@pinetech.pk",
    description: "For project inquiries and partnerships",
    action: "mailto:contact@pinetech.pk",
    primary: true,
  },
  {
    icon: MessageSquare,
    title: "WhatsApp",
    value: "+92 333 333 6282",
    description: "Quick discussions and consultations",
    action: "https://wa.me/923333336282",
    primary: false,
  },
  {
    icon: Phone,
    title: "Call",
    value: "+92 333 333 6282",
    description: "Direct calls for urgent projects",
    action: "tel:+923333336282",
    primary: false,
  },
];

const engagementTypes = [
  {
    icon: Code,
    title: "Full-Stack Developer",
    description:
      "Complete web applications with React, Next.js, and modern stack",
    features: [
      "Frontend Development",
      "Backend APIs",
      "Database Design",
      "Deployment",
    ],
    pricing: "Competitive hourly rates",
  },
  {
    icon: Briefcase,
    title: "Business Strategist",
    description:
      "Strategic planning, growth consulting, and online presence building",
    features: [
      "Market Analysis",
      "Growth Strategy",
      "Brand Development",
      "Digital Planning",
    ],
    pricing: "Project-based consulting",
  },
  {
    icon: Users,
    title: "Co-founder Partner",
    description:
      "Full partnership bringing technical expertise and strategic vision",
    features: [
      "Technical Leadership",
      "Strategic Planning",
      "Product Development",
      "Market Entry",
    ],
    pricing: "Equity-based partnership",
  },
];

export function ContactSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText("contact@pinetech.pk");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section
      id="contact"
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
              Let&apos;s Work Together
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Build
              <br />
              <span className="text-pine-600 dark:text-pine-400">
                Something Great?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Whether you need a developer, strategist, or technical co-founder,
              I bring 20+ years of experience with competitive pricing and
              modern solutions.
            </p>
          </div>

          {/* Contact methods */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  className={cn(
                    "p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group",
                    method.primary &&
                      "border-pine-200 dark:border-pine-800 bg-pine-50/50 dark:bg-pine-950/20"
                  )}
                  onClick={() =>
                    method.title === "Email"
                      ? copyEmail()
                      : window.open(method.action, "_blank")
                  }
                >
                  <CardContent className="p-0 text-center">
                    <div
                      className={cn(
                        "w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center transition-all duration-200",
                        method.primary
                          ? "bg-pine-gradient text-white group-hover:scale-110"
                          : "bg-muted group-hover:bg-pine-100 dark:group-hover:bg-pine-900/30"
                      )}
                    >
                      <method.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{method.title}</h3>
                    <p
                      className={cn(
                        "text-sm mb-2 font-mono",
                        method.primary
                          ? "text-pine-600 dark:text-pine-400"
                          : "text-muted-foreground"
                      )}
                    >
                      {method.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {method.description}
                    </p>
                    {method.title === "Email" && copiedEmail && (
                      <div className="flex items-center justify-center mt-2 text-xs text-pine-600 dark:text-pine-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Copied to clipboard!
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Engagement types */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">
              How I Can Help You
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {engagementTypes.map((type, index) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-pine-gradient rounded-lg">
                          <type.icon className="w-5 h-5 text-white" />
                        </div>
                        <CardTitle className="text-lg">{type.title}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {type.features.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-1.5 h-1.5 bg-pine-600 dark:bg-pine-400 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-border/50">
                        <span className="text-xs font-medium text-pine-600 dark:text-pine-400">
                          {type.pricing}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Location and availability */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="w-5 h-5 text-pine-600 dark:text-pine-400" />
                  <h3 className="font-semibold">Location</h3>
                </div>
                <p className="text-muted-foreground mb-2">
                  Based in Karachi, Pakistan
                </p>
                <p className="text-sm text-muted-foreground">
                  Working with clients globally. Remote-first approach with
                  flexible timezone coordination.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-5 h-5 text-pine-600 dark:text-pine-400" />
                  <h3 className="font-semibold">Availability</h3>
                </div>
                <p className="text-muted-foreground mb-2">
                  Currently accepting new projects
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Typical response time: Within 24 hours for project inquiries.
                </p>
                <Link href="/lets-work-together">
                  <Button variant="pine" className="w-full group">
                    Let&apos;s Work Together
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
