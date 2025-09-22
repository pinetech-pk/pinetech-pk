import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Briefcase, Users, ArrowRight } from "lucide-react";

const services = [
  {
    id: "development",
    title: "Full Stack Development",
    description:
      "Complete web applications built with React, Next.js, and modern technologies",
    icon: Code,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: "strategy",
    title: "Strategic Planning",
    description:
      "Business strategy, growth consulting, and digital transformation guidance",
    icon: Briefcase,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "partnership",
    title: "Co-Founder Partnership",
    description:
      "Technical co-founder role with equity-based strategic partnership",
    icon: Users,
    gradient: "from-purple-500 to-pink-600",
  },
];

export default function BookAppointmentPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-20">
        <section className="py-20 lg:py-32">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              {/* Page header */}
              <div className="text-center mb-16">
                <Badge
                  variant="outline"
                  className="mb-4 text-pine-600 dark:text-pine-400 border-pine-200 dark:border-pine-800"
                >
                  Book Appointment
                </Badge>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Choose Your
                  <br />
                  <span className="text-pine-600 dark:text-pine-400">
                    Service Area
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Select the type of collaboration you're interested in. We'll
                  discuss your project needs and timeline during our
                  consultation.
                </p>
              </div>

              {/* Service options */}
              <div className="grid md:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  >
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center`}
                      >
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        {service.description}
                      </p>
                      <Button
                        className="w-full group-hover:bg-pine-600 group-hover:text-white"
                        variant="outline"
                      >
                        Schedule Consultation
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Additional info */}
              <div className="mt-16 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold mb-4">What to Expect</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="font-medium text-foreground mb-1">
                        Initial Consultation
                      </div>
                      <div>
                        30-minute discussion about your needs and project scope
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="font-medium text-foreground mb-1">
                        Availability Review
                      </div>
                      <div>
                        Timeline assessment and scheduling based on current
                        capacity
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="font-medium text-foreground mb-1">
                        Next Steps
                      </div>
                      <div>
                        Proposal, timeline, and engagement terms discussion
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
