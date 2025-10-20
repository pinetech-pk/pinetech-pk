import { cn } from "@/lib/utils";

// Step data types
interface InvestorStep1Data {
  investmentRange: "small" | "medium" | "large" | "flexible";
}

interface InvestorStep2Data {
  investmentType: "equity" | "revenue_share" | "profit_share" | "hybrid";
}

interface InvestorStep3Data {
  industries: string[];
}

interface InvestorStep4Data {
  timeline: "immediate" | "one_month" | "three_months" | "exploring";
  involvement: "passive" | "advisory" | "active" | "hands_on";
}

type InvestorStepData =
  | InvestorStep1Data
  | InvestorStep2Data
  | InvestorStep3Data
  | InvestorStep4Data
  | null;

interface InvestorStepsProps {
  step: number;
  formData: InvestorStepData;
  onUpdateFormData: (
    step: "step1" | "step2" | "step3" | "step4",
    data: any
  ) => void;
}

export function InvestorSteps({
  step,
  formData,
  onUpdateFormData,
}: InvestorStepsProps) {
  switch (step) {
    case 1:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-2">
            What&apos;s Your Investment Range?
          </h2>
          <p className="text-muted-foreground mb-8">
            Help us understand your investment capacity to match you with
            suitable opportunities.
          </p>

          <div className="space-y-3 mb-8">
            {[
              {
                id: "small",
                label: "$5K - $25K",
                desc: "Entry-level investment for early-stage projects",
              },
              {
                id: "medium",
                label: "$25K - $100K",
                desc: "Substantial investment for growing applications",
              },
              {
                id: "large",
                label: "$100K+",
                desc: "Major investment for established or scaling projects",
              },
              {
                id: "flexible",
                label: "Flexible / Project-dependent",
                desc: "Investment amount varies based on opportunity",
              },
            ].map((range) => (
              <div
                key={range.id}
                className={cn(
                  "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                  (formData as InvestorStep1Data)?.investmentRange === range.id
                    ? "border-pine-500 bg-pine-50 dark:bg-pine-950/20"
                    : "border-border hover:border-pine-200"
                )}
                onClick={() =>
                  onUpdateFormData("step1", { investmentRange: range.id })
                }
              >
                <div className="font-medium">{range.label}</div>
                <div className="text-sm text-muted-foreground">
                  {range.desc}
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
            What Investment Structure Interests You?
          </h2>
          <p className="text-muted-foreground mb-8">
            Different investment models offer different returns and involvement
            levels.
          </p>

          <div className="space-y-3 mb-8">
            {[
              {
                id: "equity",
                label: "Equity Investment",
                desc: "Ownership stake in the application with long-term value",
              },
              {
                id: "revenue_share",
                label: "Revenue Share",
                desc: "Monthly percentage of gross revenue generated",
              },
              {
                id: "profit_share",
                label: "Profit Share",
                desc: "Percentage of net profits after expenses",
              },
              {
                id: "hybrid",
                label: "Hybrid Model",
                desc: "Combination of equity and revenue/profit sharing",
              },
            ].map((type) => (
              <div
                key={type.id}
                className={cn(
                  "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                  (formData as InvestorStep2Data)?.investmentType === type.id
                    ? "border-pine-500 bg-pine-50 dark:bg-pine-950/20"
                    : "border-border hover:border-pine-200"
                )}
                onClick={() =>
                  onUpdateFormData("step2", { investmentType: type.id })
                }
              >
                <div className="font-medium">{type.label}</div>
                <div className="text-sm text-muted-foreground">{type.desc}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 3:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Which Industries Interest You?
          </h2>
          <p className="text-muted-foreground mb-8">
            Select one or more industries where you see investment potential.
          </p>

          <div className="space-y-4 mb-8">
            {[
              "E-commerce & Marketplace",
              "SaaS & Business Tools",
              "FinTech & Financial Services",
              "Health & Wellness",
              "Education & E-learning",
              "Social & Community Platforms",
              "Food & Hospitality",
              "Real Estate & Property Tech",
            ].map((industry) => (
              <label
                key={industry}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-pine-600 rounded focus:ring-pine-500"
                  checked={
                    (formData as InvestorStep3Data)?.industries?.includes(
                      industry
                    ) || false
                  }
                  onChange={(e) => {
                    const current =
                      (formData as InvestorStep3Data)?.industries || [];
                    const updated = e.target.checked
                      ? [...current, industry]
                      : current.filter((i) => i !== industry);
                    onUpdateFormData("step3", { industries: updated });
                  }}
                />
                <span className="text-sm font-medium">{industry}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case 4:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Timeline & Involvement Level
          </h2>
          <p className="text-muted-foreground mb-8">
            Let us know when you&apos;re ready to invest and how involved
            you&apos;d like to be.
          </p>

          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-3">
                Investment Timeline:
              </label>
              <div className="space-y-2">
                {[
                  { id: "immediate", label: "Ready to invest now" },
                  { id: "one_month", label: "Within 1 month" },
                  { id: "three_months", label: "Within 3 months" },
                  { id: "exploring", label: "Just exploring opportunities" },
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
                        (formData as InvestorStep4Data)?.timeline === option.id
                      }
                      onChange={(e) =>
                        onUpdateFormData("step4", {
                          ...(formData as InvestorStep4Data),
                          timeline: e.target.value,
                        })
                      }
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Desired Involvement Level:
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: "passive",
                    label: "Passive Investor",
                    desc: "Receive reports, minimal involvement",
                  },
                  {
                    id: "advisory",
                    label: "Advisory Role",
                    desc: "Strategic guidance and mentorship",
                  },
                  {
                    id: "active",
                    label: "Active Investor",
                    desc: "Regular involvement in key decisions",
                  },
                  {
                    id: "hands_on",
                    label: "Hands-On Partner",
                    desc: "Deep involvement in operations and strategy",
                  },
                ].map((option) => (
                  <div key={option.id}>
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="involvement"
                        value={option.id}
                        className="w-4 h-4 text-pine-600 focus:ring-pine-500 mt-0.5"
                        checked={
                          (formData as InvestorStep4Data)?.involvement ===
                          option.id
                        }
                        onChange={(e) =>
                          onUpdateFormData("step4", {
                            ...(formData as InvestorStep4Data),
                            involvement: e.target.value,
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
          </div>
        </div>
      );

    default:
      return <div>Invalid step</div>;
  }
}
