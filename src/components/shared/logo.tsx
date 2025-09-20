// src/components/shared/logo.tsx
import Link from "next/link";
import { TreePine } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "minimal";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center space-x-2 font-bold transition-opacity duration-200 hover:opacity-80",
        className
      )}
    >
      <div className="relative">
        <TreePine className="h-8 w-8 text-pine-600 dark:text-pine-400" />
        <div className="absolute -top-1 -right-1 h-2 w-2 bg-pine-gradient rounded-full animate-pulse" />
      </div>
      {variant === "default" && (
        <div className="flex flex-col">
          <span className="text-lg leading-none text-foreground">
            Pine<span className="text-pine-600 dark:text-pine-400">Tech</span>
          </span>
          <span className="text-xs text-muted-foreground leading-none">
            .pk
          </span>
        </div>
      )}
    </Link>
  );
}
