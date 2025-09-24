import { cn } from "@/lib/utils";
import { FormData } from "@/hooks/useUserJourney";

interface DeveloperStepsProps {
  step: number;
  formData: any;
  onUpdateFormData: (step: keyof FormData, data: any) => void;
}

export function DeveloperSteps({
  step,
  formData,
  onUpdateFormData,
}: DeveloperStepsProps) {
  switch (step) {
    case 1:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-2">What's Your Tech Stack?</h2>
          <p className="text-muted-foreground mb-8">
            Help us understand your current skills so we can find the perfect
            project match.
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
                  checked={formData?.skills?.includes(skill) || false}
                  onChange={(e) => {
                    const currentSkills = formData?.skills || [];
                    const updatedSkills = e.target.checked
                      ? [...currentSkills, skill]
                      : currentSkills.filter((s: string) => s !== skill);
                    onUpdateFormData("step1", {
                      ...formData,
                      skills: updatedSkills,
                    });
                  }}
                />
                <span className="text-sm font-medium">{skill}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case 2:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-2">Where Are You Now?</h2>
          <p className="text-muted-foreground mb-8">
            Understanding your current stage helps us create the right growth
            opportunity.
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
                  formData?.stage === stage.id
                    ? "border-pine-500 bg-pine-50 dark:bg-pine-950/20"
                    : "border-border hover:border-pine-200"
                )}
                onClick={() =>
                  onUpdateFormData("step2", { ...formData, stage: stage.id })
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

    case 3:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-2">What Excites You Most?</h2>
          <p className="text-muted-foreground mb-8">
            Different developers are motivated by different opportunities. What
            drives you?
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
                  formData?.interest === interest.id
                    ? "border-pine-500 bg-pine-50 dark:bg-pine-950/20"
                    : "border-border hover:border-pine-200"
                )}
                onClick={() =>
                  onUpdateFormData("step3", {
                    ...formData,
                    interest: interest.id,
                  })
                }
              >
                <div className="font-medium">{interest.label}</div>
                <div className="text-sm text-muted-foreground">
                  {interest.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 4:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-2">When Can You Start?</h2>
          <p className="text-muted-foreground mb-8">
            Help us understand your availability and commitment level for new
            projects.
          </p>

          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-3">
                Availability:
              </label>
              <div className="space-y-2">
                {[
                  { id: "immediate", label: "Available Immediately" },
                  { id: "two_weeks", label: "Available in 2 weeks" },
                  { id: "one_month", label: "Available in 1 month" },
                  { id: "exploring", label: "Just exploring opportunities" },
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
                      checked={formData?.availability === option.id}
                      onChange={(e) =>
                        onUpdateFormData("step4", {
                          ...formData,
                          availability: e.target.value,
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
                Time Commitment:
              </label>
              <div className="space-y-2">
                {[
                  { id: "full_time", label: "Full-time (40+ hours/week)" },
                  { id: "part_time", label: "Part-time (20-30 hours/week)" },
                  { id: "contract", label: "Project-based contracts" },
                  {
                    id: "side_project",
                    label: "Side project (evenings/weekends)",
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
                      checked={formData?.commitment === option.id}
                      onChange={(e) =>
                        onUpdateFormData("step4", {
                          ...formData,
                          commitment: e.target.value,
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
