import { cn } from "@/lib/utils";

// Step data types
interface EntrepreneurStep1Data {
  projectStage: "idea" | "planning" | "mvp_ready" | "launched";
}

interface EntrepreneurStep2Data {
  projectType: "web_app" | "mobile_app" | "saas" | "marketplace" | "other";
  otherDescription?: string;
}

interface EntrepreneurStep3Data {
  budget:
    | "bootstrap"
    | "seed_funded"
    | "investor_backed"
    | "revenue_generating";
  estimatedBudget?: string;
}

interface EntrepreneurStep4Data {
  partnershipType:
    | "developer_only"
    | "cofounder_equity"
    | "hybrid"
    | "consulting";
  timeline: "urgent" | "one_month" | "three_months" | "flexible";
}

type EntrepreneurStepData =
  | EntrepreneurStep1Data
  | EntrepreneurStep2Data
  | EntrepreneurStep3Data
  | EntrepreneurStep4Data
  | null;

interface EntrepreneurStepsProps {
  step: number;
  formData: EntrepreneurStepData;
  onUpdateFormData: (
    step: "step1" | "step2" | "step3" | "step4",
    data: any
  ) => void;
}

export function EntrepreneurSteps({
  step,
  formData,
  onUpdateFormData,
}: EntrepreneurStepsProps) {
  switch (step) {
    case 1:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-2">
            What Stage Is Your Project?
          </h2>
          <p className="text-muted-foreground mb-8">
            Understanding where you are helps us provide the right support and
            guidance.
          </p>

          <div className="space-y-3 mb-8">
            {[
              {
                id: "idea",
                label: "Just an Idea",
                desc: "Concept stage, need help validating and planning",
              },
              {
                id: "planning",
                label: "Planning Phase",
                desc: "Business plan ready, need technical execution",
              },
              {
                id: "mvp_ready",
                label: "MVP Design Ready",
                desc: "Designs/specs complete, ready for development",
              },
              {
                id: "launched",
                label: "Already Launched",
                desc: "Product live, need scaling or new features",
              },
            ].map((stage) => (
              <div
                key={stage.id}
                className={cn(
                  "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                  (formData as EntrepreneurStep1Data)?.projectStage === stage.id
                    ? "border-pine-500 bg-pine-50 dark:bg-pine-950/20"
                    : "border-border hover:border-pine-200"
                )}
                onClick={() =>
                  onUpdateFormData("step1", { projectStage: stage.id })
                }
              >
                <div className="font-medium">{stage.label}</div>
                <div className="text-sm text-muted-foreground">
                  {stage.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 2:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-2">
            What Type of Project Are You Building?
          </h2>
          <p className="text-muted-foreground mb-8">
            Help us understand your vision so we can align our expertise.
          </p>

          <div className="space-y-3 mb-8">
            {[
              {
                id: "web_app",
                label: "Web Application",
                desc: "Browser-based application or platform",
              },
              {
                id: "mobile_app",
                label: "Mobile Application",
                desc: "iOS/Android app or progressive web app",
              },
              {
                id: "saas",
                label: "SaaS Platform",
                desc: "Subscription-based software service",
              },
              {
                id: "marketplace",
                label: "Marketplace/E-commerce",
                desc: "Platform connecting buyers and sellers",
              },
              {
                id: "other",
                label: "Other/Custom Solution",
                desc: "Something unique or specialized",
              },
            ].map((type) => (
              <div
                key={type.id}
                className={cn(
                  "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                  (formData as EntrepreneurStep2Data)?.projectType === type.id
                    ? "border-pine-500 bg-pine-50 dark:bg-pine-950/20"
                    : "border-border hover:border-pine-200"
                )}
                onClick={() =>
                  onUpdateFormData("step2", {
                    ...(formData as EntrepreneurStep2Data),
                    projectType: type.id,
                  })
                }
              >
                <div className="font-medium">{type.label}</div>
                <div className="text-sm text-muted-foreground">{type.desc}</div>
              </div>
            ))}
          </div>

          {(formData as EntrepreneurStep2Data)?.projectType === "other" && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Please describe your project:
              </label>
              <textarea
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-pine-500 focus:border-transparent"
                placeholder="Tell us about your unique project idea..."
                rows={3}
                value={
                  (formData as EntrepreneurStep2Data)?.otherDescription || ""
                }
                onChange={(e) =>
                  onUpdateFormData("step2", {
                    ...(formData as EntrepreneurStep2Data),
                    otherDescription: e.target.value,
                  })
                }
              />
            </div>
          )}
        </div>
      );

    case 3:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-2">
            What&apos;s Your Funding Situation?
          </h2>
          <p className="text-muted-foreground mb-8">
            Understanding your budget helps us propose the right engagement
            model.
          </p>

          <div className="space-y-3 mb-6">
            {[
              {
                id: "bootstrap",
                label: "Bootstrapped / Self-funded",
                desc: "Building with personal resources",
              },
              {
                id: "seed_funded",
                label: "Seed Funded",
                desc: "Initial funding secured from angels/VCs",
              },
              {
                id: "investor_backed",
                label: "Investor Backed",
                desc: "Series A+ funding or established investors",
              },
              {
                id: "revenue_generating",
                label: "Revenue Generating",
                desc: "Already profitable or generating revenue",
              },
            ].map((budget) => (
              <div
                key={budget.id}
                className={cn(
                  "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                  (formData as EntrepreneurStep3Data)?.budget === budget.id
                    ? "border-pine-500 bg-pine-50 dark:bg-pine-950/20"
                    : "border-border hover:border-pine-200"
                )}
                onClick={() =>
                  onUpdateFormData("step3", {
                    ...(formData as EntrepreneurStep3Data),
                    budget: budget.id,
                  })
                }
              >
                <div className="font-medium">{budget.label}</div>
                <div className="text-sm text-muted-foreground">
                  {budget.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">
              Estimated Budget for Development{" "}
              <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              type="text"
              className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-pine-500 focus:border-transparent"
              placeholder="e.g., $10K - $50K"
              value={(formData as EntrepreneurStep3Data)?.estimatedBudget || ""}
              onChange={(e) =>
                onUpdateFormData("step3", {
                  ...(formData as EntrepreneurStep3Data),
                  estimatedBudget: e.target.value,
                })
              }
            />
          </div>
        </div>
      );

    case 4:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Partnership & Timeline Preferences
          </h2>
          <p className="text-muted-foreground mb-8">
            Let&apos;s discuss how we&apos;ll work together and your project
            timeline.
          </p>

          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-3">
                Preferred Partnership Model:
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: "developer_only",
                    label: "Hire as Developer",
                    desc: "Fixed fee or hourly rate for development work",
                  },
                  {
                    id: "cofounder_equity",
                    label: "Technical Co-founder",
                    desc: "Equity-based partnership with strategic role",
                  },
                  {
                    id: "hybrid",
                    label: "Hybrid Model",
                    desc: "Combination of payment and equity stake",
                  },
                  {
                    id: "consulting",
                    label: "Strategic Consulting",
                    desc: "Advisory role with project guidance",
                  },
                ].map((option) => (
                  <div key={option.id}>
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="partnershipType"
                        value={option.id}
                        className="w-4 h-4 text-pine-600 focus:ring-pine-500 mt-0.5"
                        checked={
                          (formData as EntrepreneurStep4Data)
                            ?.partnershipType === option.id
                        }
                        onChange={(e) =>
                          onUpdateFormData("step4", {
                            ...(formData as EntrepreneurStep4Data),
                            partnershipType: e.target.value,
                          })
                        }
                      />
                      <div>
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {option.desc}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Project Timeline:
              </label>
              <div className="space-y-2">
                {[
                  { id: "urgent", label: "Urgent - Need to start ASAP" },
                  { id: "one_month", label: "Can start within 1 month" },
                  { id: "three_months", label: "Planning for 2-3 months out" },
                  {
                    id: "flexible",
                    label: "Flexible timeline, exploring options",
                  },
                ].map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="timeline"
                      value={option.id}
                      className="w-4 h-4 text-pine-600 focus:ring-pine-500"
                      checked={
                        (formData as EntrepreneurStep4Data)?.timeline ===
                        option.id
                      }
                      onChange={(e) =>
                        onUpdateFormData("step4", {
                          ...(formData as EntrepreneurStep4Data),
                          timeline: e.target.value,
                        })
                      }
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return <div>Invalid step</div>;
  }
}
