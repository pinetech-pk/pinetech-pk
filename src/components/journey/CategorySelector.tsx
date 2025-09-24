import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// User categories configuration
const userCategories = [
  {
    id: "developer" as const,
    title: "I'm a Developer Ready to Level Up",
    description:
      "Join innovative projects with equity opportunities and cutting-edge technology",
    icon: Code,
    gradient: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50/50 dark:bg-blue-950/20",
  },
  {
    id: "investor" as const,
    title: "I Want to Invest in Tech Success",
    description:
      "Generate income through strategic investments in profitable web applications",
    icon: TrendingUp,
    gradient: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50/50 dark:bg-green-950/20",
  },
  {
    id: "entrepreneur" as const,
    title: "I Have an Idea, Need Execution",
    description:
      "Transform your business vision into reality with strategic and technical partnership",
    icon: Users,
    gradient: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50/50 dark:bg-purple-950/20",
  },
];

interface CategorySelectorProps {
  onSelectCategory: (
    category: "developer" | "investor" | "entrepreneur"
  ) => void;
}

export function CategorySelector({ onSelectCategory }: CategorySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-12">
        <Badge
          variant="outline"
          className="mb-4 text-pine-600 dark:text-pine-400 border-pine-200 dark:border-pine-800"
        >
          Choose Your Path
        </Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          How Can We
          <br />
          <span className="text-pine-600 dark:text-pine-400">
            Work Together?
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Select the collaboration type that best describes your goals. Your
          choice will unlock a personalized journey tailored to your needs.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {userCategories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg",
                category.bgColor,
                "border-2 hover:border-pine-200 dark:hover:border-pine-800"
              )}
              onClick={() => onSelectCategory(category.id)}
            >
              <CardContent className="p-8 text-center">
                <div
                  className={cn(
                    "w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br flex items-center justify-center",
                    category.gradient
                  )}
                >
                  <category.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-4 leading-tight">
                  {category.title}
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {category.description}
                </p>

                <Button className="w-full group" variant="outline">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
