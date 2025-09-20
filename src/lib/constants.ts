// src/lib/constants.ts
export const SITE_CONFIG = {
  name: "PineTech.pk",
  title: "PineTech.pk - React & Next.js Developer from Karachi",
  description:
    "Modern web applications built with React, Next.js, and JavaScript. Fast prototyping, affordable projects, and full-stack development services from Karachi, Pakistan.",
  url: "https://pinetech.pk",
  ogImage: "https://pinetech.pk/og.jpg",
  creator: "@pinetech_pk",
  keywords: [
    "React Developer",
    "Next.js Developer",
    "JavaScript Developer",
    "Full Stack Developer",
    "Karachi Developer",
    "Pakistan Developer",
    "Web Development",
    "Fast Prototyping",
  ],
} as const;

export const PROJECTS = {
  mealPlanner: {
    name: "Meal Planner",
    description:
      "Universal meal planning with convenience, health, and budget focus",
    stack: [
      "Next.js",
      "React",
      "Express",
      "Node.js",
      "ShadCN",
      "Cloudinary",
      "Sentry",
    ],
    role: "Business Strategist, Founder & Full-Stack Developer",
    status: "In Production",
  },
  impactMeter: {
    name: "Impact Meter - MIF",
    description:
      "Transparency tool connecting donors and beneficiaries with real-time impact tracking",
    stack: ["Next.js", "React", "Node.js", "Data Visualization"],
    role: "Social Innovation Strategist, Systems Designer & Developer",
    status: "In Production",
  },
  nikahFirst: {
    name: "Nikah First",
    description:
      "Modern matrimonial platform with free tier and multi-profile management",
    stack: ["Next.js", "React", "MongoDB", "Auth0", "Credits System"],
    role: "Market Analyst, Product Strategist & Developer",
    status: "In Production",
  },
  tadawulInsight: {
    name: "Tadawul Insight",
    description:
      "Saudi stock market community with curated content and signal validation",
    stack: ["Next.js", "React", "Role-based Access", "Content Management"],
    role: "Fintech Strategist, Platform Architect & Developer",
    status: "In Production",
  },
} as const;

export const TECH_STACK = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "ShadCN/UI"],
  backend: ["Node.js", "Express", "MongoDB"],
  auth: ["Kinde", "Auth0", "JWT"],
  tools: ["Cloudinary", "Sentry", "AI Integration"],
  deployment: ["Vercel", "Railway", "Digital Ocean"],
} as const;
