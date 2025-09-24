"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Code, TrendingUp, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Types for form data
interface FormData {
  userType: "developer" | "investor" | "entrepreneur" | null;
  step1: any;
  step2: any;
  step3: any;
  step4: any;
  finalForm: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  } | null;
}

// User categories configuration
const userCategories = [
  {
    id: "developer",
    title: "I'm a Developer Ready to Level Up",
    description:
      "Join innovative projects with equity opportunities and cutting-edge technology",
    icon: Code,
    gradient: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50/50 dark:bg-blue-950/20",
  },
  {
    id: "investor",
    title: "I Want to Invest in Tech Success",
    description:
      "Generate income through strategic investments in profitable web applications",
    icon: TrendingUp,
    gradient: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50/50 dark:bg-green-950/20",
  },
  {
    id: "entrepreneur",
    title: "I Have an Idea, Need Execution",
    description:
      "Transform your business vision into reality with strategic and technical partnership",
    icon: Users,
    gradient: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50/50 dark:bg-purple-950/20",
  },
] as const;

export default function LetsWorkTogetherPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    userType: null,
    step1: null,
    step2: null,
    step3: null,
    step4: null,
    finalForm: null,
  });
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    id?: number;
    message: string;
  } | null>(null);

  // Ensure client-side hydration is complete
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Submit form to database
  const submitForm = async () => {
    if (!formData.finalForm?.name || !formData.finalForm?.email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userType: formData.userType,
          name: formData.finalForm.name,
          email: formData.finalForm.email,
          phone: formData.finalForm.phone || "",
          message: formData.finalForm.message || "",
          stepResponses: {
            step1: formData.step1,
            step2: formData.step2,
            step3: formData.step3,
            step4: formData.step4,
          },
          submissionType: "form",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmissionResult({
          success: true,
          id: result.id,
          message: "Your details have been recorded successfully!",
        });
        setCurrentStep(6); // Move to success step
      } else {
        setSubmissionResult({
          success: false,
          message: "Failed to submit form. Please try again.",
        });
      }
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: "Network error. Please check your connection and try again.",
      });
    }
    setIsSubmitting(false);
  };

  // Step 0: Category Selection
  const selectCategory = (
    category: "developer" | "investor" | "entrepreneur"
  ) => {
    setFormData((prev) => ({ ...prev, userType: category }));
    setCurrentStep(1);
  };

  // Navigation
  const goToNextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Update form data for specific step
  const updateFormData = (step: keyof FormData, data: any) => {
    setFormData((prev) => ({ ...prev, [step]: data }));
  };

  // Don't render interactive elements until client is ready
  if (!isClient) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20 pb-10">
          <section className="py-10 lg:py-20">
            <div className="container px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
                    <div className="h-12 bg-muted rounded w-96 mx-auto mb-6"></div>
                    <div className="h-4 bg-muted rounded w-80 mx-auto"></div>
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

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-20 pb-10">
        <section className="py-10 lg:py-20">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              {/* Progress indicator - only show after category selection and before success */}
              {currentStep > 0 && currentStep < 6 && (
                <div className="mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div
                        key={step}
                        className={cn(
                          "w-3 h-3 rounded-full transition-colors duration-200",
                          step <= currentStep
                            ? "bg-pine-600 dark:bg-pine-400"
                            : "bg-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Step {currentStep} of 5
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* Step 0: Category Selection Gate */}
                {currentStep === 0 && (
                  <motion.div
                    key="category-selection"
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
                        Select the collaboration type that best describes your
                        goals. Your choice will unlock a personalized journey
                        tailored to your needs.
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
                            onClick={() => selectCategory(category.id)}
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

                              <Button
                                className="w-full group"
                                variant="outline"
                              >
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Steps 1-5: Dynamic content based on user type */}
                {currentStep > 0 && (
                  <motion.div
                    key={`step-${currentStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-8">
                      <CardContent className="p-0">
                        {/* Developer Journey Steps */}
                        {formData.userType === "developer" && (
                          <>
                            {/* Step 1: Skills Assessment */}
                            {currentStep === 1 && (
                              <div>
                                <h2 className="text-2xl font-bold mb-2">
                                  What's Your Tech Stack?
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                  Help us understand your current skills so we
                                  can find the perfect project match.
                                </p>

                                <div className="space-y-4 mb-8">
                                  {[
                                    "React",
                                    "Next.js",
                                    "TypeScript",
                                    "Node.js",
                                    "Python",
                                    "Vue.js",
                                    "Angular",
                                    "PHP",
                                  ].map((skill) => (
                                    <label
                                      key={skill}
                                      className="flex items-center space-x-3 cursor-pointer"
                                    >
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-pine-600 rounded focus:ring-pine-500"
                                        checked={
                                          formData.step1?.skills?.includes(
                                            skill
                                          ) || false
                                        }
                                        onChange={(e) => {
                                          const currentSkills =
                                            formData.step1?.skills || [];
                                          const updatedSkills = e.target.checked
                                            ? [...currentSkills, skill]
                                            : currentSkills.filter(
                                                (s: string) => s !== skill
                                              );
                                          updateFormData("step1", {
                                            ...formData.step1,
                                            skills: updatedSkills,
                                          });
                                        }}
                                      />
                                      <span className="text-sm font-medium">
                                        {skill}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Step 2: Career Stage */}
                            {currentStep === 2 && (
                              <div>
                                <h2 className="text-2xl font-bold mb-2">
                                  Where Are You Now?
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                  Understanding your current stage helps us
                                  create the right growth opportunity.
                                </p>

                                <div className="space-y-3 mb-8">
                                  {[
                                    {
                                      id: "junior",
                                      label: "Junior Developer (0-2 years)",
                                      desc: "Building foundational skills and experience",
                                    },
                                    {
                                      id: "mid",
                                      label: "Mid-level Developer (2-5 years)",
                                      desc: "Solid skills, looking for next challenge",
                                    },
                                    {
                                      id: "senior",
                                      label: "Senior Developer (5+ years)",
                                      desc: "Expert skills, want leadership opportunities",
                                    },
                                    {
                                      id: "freelancer",
                                      label: "Freelancer/Contractor",
                                      desc: "Independent work, seeking stable partnerships",
                                    },
                                  ].map((stage) => (
                                    <div
                                      key={stage.id}
                                      className={cn(
                                        "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                                        formData.step2?.stage === stage.id
                                          ? "border-pine-500 bg-pine-50 dark:bg-pine-950/20"
                                          : "border-border hover:border-pine-200"
                                      )}
                                      onClick={() =>
                                        updateFormData("step2", {
                                          ...formData.step2,
                                          stage: stage.id,
                                        })
                                      }
                                    >
                                      <div className="font-medium">
                                        {stage.label}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {stage.desc}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Step 3: Partnership Interest */}
                            {currentStep === 3 && (
                              <div>
                                <h2 className="text-2xl font-bold mb-2">
                                  What Excites You Most?
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                  Different developers are motivated by
                                  different opportunities. What drives you?
                                </p>

                                <div className="space-y-3 mb-8">
                                  {[
                                    {
                                      id: "salary",
                                      label: "Stable High Salary",
                                      desc: "Competitive fixed compensation with benefits",
                                    },
                                    {
                                      id: "equity",
                                      label: "Equity & Revenue Share",
                                      desc: "Ownership stake in growing applications",
                                    },
                                    {
                                      id: "learning",
                                      label: "Skill Building & Mentorship",
                                      desc: "Learn cutting-edge tech with experienced guidance",
                                    },
                                    {
                                      id: "leadership",
                                      label: "Technical Leadership",
                                      desc: "Lead development teams and make architecture decisions",
                                    },
                                  ].map((interest) => (
                                    <div
                                      key={interest.id}
                                      className={cn(
                                        "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                                        formData.step3?.interest === interest.id
                                          ? "border-pine-500 bg-pine-50 dark:bg-pine-950/20"
                                          : "border-border hover:border-pine-200"
                                      )}
                                      onClick={() =>
                                        updateFormData("step3", {
                                          ...formData.step3,
                                          interest: interest.id,
                                        })
                                      }
                                    >
                                      <div className="font-medium">
                                        {interest.label}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {interest.desc}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Step 4: Availability & Commitment */}
                            {currentStep === 4 && (
                              <div>
                                <h2 className="text-2xl font-bold mb-2">
                                  When Can You Start?
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                  Help us understand your availability and
                                  commitment level for new projects.
                                </p>

                                <div className="space-y-6 mb-8">
                                  <div>
                                    <label className="block text-sm font-medium mb-3">
                                      Availability:
                                    </label>
                                    <div className="space-y-2">
                                      {[
                                        {
                                          id: "immediate",
                                          label: "Available Immediately",
                                        },
                                        {
                                          id: "two_weeks",
                                          label: "Available in 2 weeks",
                                        },
                                        {
                                          id: "one_month",
                                          label: "Available in 1 month",
                                        },
                                        {
                                          id: "exploring",
                                          label: "Just exploring opportunities",
                                        },
                                      ].map((option) => (
                                        <label
                                          key={option.id}
                                          className="flex items-center space-x-3 cursor-pointer"
                                        >
                                          <input
                                            type="radio"
                                            name="availability"
                                            value={option.id}
                                            className="w-4 h-4 text-pine-600 focus:ring-pine-500"
                                            checked={
                                              formData.step4?.availability ===
                                              option.id
                                            }
                                            onChange={(e) =>
                                              updateFormData("step4", {
                                                ...formData.step4,
                                                availability: e.target.value,
                                              })
                                            }
                                          />
                                          <span className="text-sm">
                                            {option.label}
                                          </span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-3">
                                      Time Commitment:
                                    </label>
                                    <div className="space-y-2">
                                      {[
                                        {
                                          id: "full_time",
                                          label: "Full-time (40+ hours/week)",
                                        },
                                        {
                                          id: "part_time",
                                          label: "Part-time (20-30 hours/week)",
                                        },
                                        {
                                          id: "contract",
                                          label: "Project-based contracts",
                                        },
                                        {
                                          id: "side_project",
                                          label:
                                            "Side project (evenings/weekends)",
                                        },
                                      ].map((option) => (
                                        <label
                                          key={option.id}
                                          className="flex items-center space-x-3 cursor-pointer"
                                        >
                                          <input
                                            type="radio"
                                            name="commitment"
                                            value={option.id}
                                            className="w-4 h-4 text-pine-600 focus:ring-pine-500"
                                            checked={
                                              formData.step4?.commitment ===
                                              option.id
                                            }
                                            onChange={(e) =>
                                              updateFormData("step4", {
                                                ...formData.step4,
                                                commitment: e.target.value,
                                              })
                                            }
                                          />
                                          <span className="text-sm">
                                            {option.label}
                                          </span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Step 5: Contact Information Form */}
                            {currentStep === 5 && (
                              <div>
                                <h2 className="text-2xl font-bold mb-2">
                                  Your Contact Details
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                  Great! Now let's get your details so we can
                                  connect with you about opportunities.
                                </p>

                                <div className="space-y-4 mb-8">
                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Full Name{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-pine-500 focus:border-transparent"
                                      placeholder="Enter your full name"
                                      value={formData.finalForm?.name || ""}
                                      onChange={(e) =>
                                        updateFormData("finalForm", {
                                          ...formData.finalForm,
                                          name: e.target.value,
                                        })
                                      }
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Email Address{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="email"
                                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-pine-500 focus:border-transparent"
                                      placeholder="your.email@example.com"
                                      value={formData.finalForm?.email || ""}
                                      onChange={(e) =>
                                        updateFormData("finalForm", {
                                          ...formData.finalForm,
                                          email: e.target.value,
                                        })
                                      }
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Phone Number{" "}
                                      <span className="text-muted-foreground">
                                        (optional)
                                      </span>
                                    </label>
                                    <input
                                      type="tel"
                                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-pine-500 focus:border-transparent"
                                      placeholder="+92 XXX XXX XXXX"
                                      value={formData.finalForm?.phone || ""}
                                      onChange={(e) =>
                                        updateFormData("finalForm", {
                                          ...formData.finalForm,
                                          phone: e.target.value,
                                        })
                                      }
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Additional Message{" "}
                                      <span className="text-muted-foreground">
                                        (optional)
                                      </span>
                                    </label>
                                    <textarea
                                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-pine-500 focus:border-transparent"
                                      placeholder="Any specific questions or details you'd like to share..."
                                      rows={4}
                                      value={formData.finalForm?.message || ""}
                                      onChange={(e) =>
                                        updateFormData("finalForm", {
                                          ...formData.finalForm,
                                          message: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>

                                {/* Submission error message */}
                                {submissionResult &&
                                  !submissionResult.success && (
                                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                                      <p className="text-red-600 dark:text-red-400 text-sm">
                                        {submissionResult.message}
                                      </p>
                                    </div>
                                  )}
                              </div>
                            )}

                            {/* Step 6: Success & Appointment Offer */}
                            {currentStep === 6 && submissionResult?.success && (
                              <div className="text-center">
                                <div className="w-16 h-16 bg-pine-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                                  <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>

                                <h2 className="text-2xl font-bold mb-2">
                                  Successfully Submitted!
                                </h2>
                                <p className="text-muted-foreground mb-2">
                                  Your details have been recorded successfully.
                                </p>
                                <p className="text-sm text-muted-foreground mb-8">
                                  Reference ID: #{submissionResult.id}
                                </p>

                                <div className="bg-muted/30 p-6 rounded-lg mb-8">
                                  <h3 className="font-semibold mb-4">
                                    What happens next?
                                  </h3>
                                  <div className="text-sm text-muted-foreground space-y-2">
                                    <p>
                                      • We'll review your responses and project
                                      fit
                                    </p>
                                    <p>
                                      • You may receive an email within 3-7 days
                                    </p>
                                    <p>
                                      • Response time may vary based on current
                                      project availability
                                    </p>
                                  </div>
                                </div>

                                <div className="border-2 border-pine-200 dark:border-pine-800 rounded-lg p-6 bg-pine-50/50 dark:bg-pine-950/20">
                                  <Badge variant="pine" className="mb-3">
                                    Recommended Next Step
                                  </Badge>
                                  <h3 className="font-bold mb-2">
                                    Want to fast-track the process?
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-4">
                                    Book a free consultation call to discuss
                                    opportunities directly. This guarantees a
                                    response within your selected time slot.
                                  </p>
                                  <Button
                                    variant="pine"
                                    className="w-full"
                                    asChild
                                  >
                                    <Link href="/book-appointment">
                                      Book Free Consultation
                                    </Link>
                                  </Button>
                                </div>

                                <div className="mt-8 text-center">
                                  <Link
                                    href="/"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    ← Return to Homepage
                                  </Link>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {/* Navigation buttons */}
                        {currentStep < 6 && (
                          <div className="flex justify-between items-center">
                            <Button
                              onClick={goToPreviousStep}
                              variant="ghost"
                              className="flex items-center"
                            >
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Back
                            </Button>

                            {currentStep < 5 && (
                              <Button
                                onClick={goToNextStep}
                                variant="pine"
                                className="flex items-center"
                                disabled={
                                  (currentStep === 1 &&
                                    !formData.step1?.skills?.length) ||
                                  (currentStep === 2 &&
                                    !formData.step2?.stage) ||
                                  (currentStep === 3 &&
                                    !formData.step3?.interest) ||
                                  (currentStep === 4 &&
                                    (!formData.step4?.availability ||
                                      !formData.step4?.commitment))
                                }
                              >
                                Next Step
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            )}

                            {currentStep === 5 && (
                              <Button
                                onClick={submitForm}
                                variant="pine"
                                className="flex items-center"
                                disabled={
                                  !formData.finalForm?.name ||
                                  !formData.finalForm?.email ||
                                  isSubmitting
                                }
                              >
                                {isSubmitting
                                  ? "Submitting..."
                                  : "Submit Details"}
                                {!isSubmitting && (
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
