import Link from "next/link";
import { Logo } from "./logo";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: "About", href: "/#about" },
  { name: "Skills", href: "/#skills" },
  { name: "Projects", href: "/#projects" },
  { name: "Contact", href: "/#contact" },
];

const projects = [
  { name: "Meal Planner", status: "In Production" },
  { name: "Impact Meter - MIF", status: "In Production" },
  { name: "Nikah First", status: "In Production" },
  { name: "Tadawul Insight", status: "In Production" },
];

export function Footer() {
  // Use a fixed date to avoid hydration mismatch
  const currentDate = "2024";

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="md:col-span-2">
            <Logo className="mb-4" />
            <p className="text-muted-foreground mb-4 max-w-md">
              Modern web applications built with React, Next.js, and strategic
              thinking. 20+ years of IT experience meets cutting-edge
              development.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Based in Karachi, Pakistan</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Working Globally</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="font-semibold mb-4">Portfolio</h3>
            <ul className="space-y-2">
              {projects.map((project) => (
                <li
                  key={project.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-muted-foreground">
                    {project.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {project.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentDate} PineTech.pk. Built with Next.js, TypeScript, and
            Tailwind CSS.
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="pine" className="text-xs">
              Open for Projects
            </Badge>
            <span className="text-xs text-muted-foreground">
              Ready for new challenges
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
