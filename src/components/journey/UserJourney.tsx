// ============================================================================
// 1. CORE TYPE SYSTEM - Single source of truth for all journey data
// ============================================================================

// Base types for discriminated unions
type JourneyType = "developer" | "investor" | "entrepreneur";

// Developer Journey Schema
interface DeveloperJourney {
  type: "developer";
  data: {
    experienceLevel?: "junior" | "mid" | "senior" | "lead";
    technologies?: string[];
    workPreference?: "freelance" | "part_time" | "full_time" | "project_based";
    availability?: "immediate" | "two_weeks" | "one_month" | "flexible";
    projectInterest?: "startup" | "established" | "agency" | "open_source";
    remotePref?: "remote_only" | "hybrid" | "onsite" | "flexible";
  };
}

// Investor Journey Schema
interface InvestorJourney {
  type: "investor";
  data: {
    investmentRange?: "small" | "medium" | "large" | "flexible";
    investmentType?: "equity" | "revenue_share" | "profit_share" | "hybrid";
    industries?: string[];
    timeline?: "immediate" | "one_month" | "three_months" | "exploring";
    involvement?: "passive" | "advisory" | "active" | "hands_on";
  };
}

// Entrepreneur Journey Schema
interface EntrepreneurJourney {
  type: "entrepreneur";
  data: {
    projectStage?: "idea" | "planning" | "mvp_ready" | "launched";
    projectType?: "web_app" | "mobile_app" | "saas" | "marketplace" | "other";
    otherDescription?: string;
    budget?:
      | "bootstrap"
      | "seed_funded"
      | "investor_backed"
      | "revenue_generating";
    estimatedBudget?: string;
    partnershipType?:
      | "developer_only"
      | "cofounder_equity"
      | "hybrid"
      | "consulting";
    timeline?: "urgent" | "one_month" | "three_months" | "flexible";
  };
}

// Contact information (shared by all journeys)
interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  preferredContact?: "email" | "phone" | "either";
}

// Discriminated union for journey state
type Journey = DeveloperJourney | InvestorJourney | EntrepreneurJourney;

// Complete form state
interface FormState {
  journey: Journey | null;
  contact: Partial<ContactInfo>;
  currentStep: number;
  isComplete: boolean;
  submissionId?: string;
}

// ============================================================================
// 2. STEP CONFIGURATION - Define what fields belong to each step
// ============================================================================

const STEP_FIELDS = {
  developer: [
    ["experienceLevel"], // Step 1
    ["technologies"], // Step 2
    ["workPreference", "availability"], // Step 3
    ["projectInterest", "remotePref"], // Step 4
  ],
  investor: [
    ["investmentRange"], // Step 1
    ["investmentType"], // Step 2
    ["industries"], // Step 3
    ["timeline", "involvement"], // Step 4
  ],
  entrepreneur: [
    ["projectStage"], // Step 1
    ["projectType", "otherDescription"], // Step 2
    ["budget", "estimatedBudget"], // Step 3
    ["partnershipType", "timeline"], // Step 4
  ],
} as const;

// ============================================================================
// 3. CUSTOM HOOK - Single hook with proper typing
// ============================================================================

import { useState, useCallback } from "react";

interface UseJourneyReturn {
  state: FormState;
  actions: {
    selectJourneyType: (type: JourneyType) => void;
    updateJourneyData: <T extends Journey>(updates: Partial<T["data"]>) => void;
    updateContactInfo: (updates: Partial<ContactInfo>) => void;
    nextStep: () => void;
    prevStep: () => void;
    submitForm: () => Promise<boolean>;
    reset: () => void;
  };
  computed: {
    isStepValid: boolean;
    canGoNext: boolean;
    canGoPrev: boolean;
    progressPercent: number;
    currentStepFields: readonly string[];
  };
}

export function useJourney(): UseJourneyReturn {
  const [state, setState] = useState<FormState>({
    journey: null,
    contact: {},
    currentStep: 0,
    isComplete: false,
  });

  // Select journey type and initialize
  const selectJourneyType = useCallback((type: JourneyType) => {
    const journey: Journey =
      type === "developer"
        ? { type: "developer", data: {} }
        : type === "investor"
          ? { type: "investor", data: {} }
          : { type: "entrepreneur", data: {} };

    setState((prev) => ({
      ...prev,
      journey,
      currentStep: 1,
    }));
  }, []);

  // Type-safe journey data update
  const updateJourneyData = useCallback(
    <T extends Journey>(updates: Partial<T["data"]>) => {
      setState((prev) => {
        if (!prev.journey) return prev;

        return {
          ...prev,
          journey: {
            ...prev.journey,
            data: {
              ...prev.journey.data,
              ...updates,
            },
          } as Journey,
        };
      });
    },
    []
  );

  // Update contact information
  const updateContactInfo = useCallback((updates: Partial<ContactInfo>) => {
    setState((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        ...updates,
      },
    }));
  }, []);

  // Navigation
  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 6),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

  // Submit form
  const submitForm = useCallback(async (): Promise<boolean> => {
    try {
      // Your submission logic here
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journey: state.journey,
          contact: state.contact,
        }),
      });

      if (response.ok) {
        const { id } = await response.json();
        setState((prev) => ({
          ...prev,
          isComplete: true,
          submissionId: id,
          currentStep: 6,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Submission error:", error);
      return false;
    }
  }, [state.journey, state.contact]);

  // Reset form
  const reset = useCallback(() => {
    setState({
      journey: null,
      contact: {},
      currentStep: 0,
      isComplete: false,
    });
  }, []);

  // Computed values
  const computed = {
    isStepValid: (() => {
      if (!state.journey) return false;
      if (state.currentStep === 5) {
        return !!(state.contact.name && state.contact.email);
      }
      if (state.currentStep > 0 && state.currentStep <= 4) {
        const fields = STEP_FIELDS[state.journey.type][state.currentStep - 1];
        return fields.every(
          (field) =>
            state.journey!.data[field as keyof typeof state.journey.data] !==
            undefined
        );
      }
      return true;
    })(),
    canGoNext: state.currentStep < 5,
    canGoPrev: state.currentStep > 0,
    progressPercent: (state.currentStep / 6) * 100,
    currentStepFields: state.journey
      ? STEP_FIELDS[state.journey.type][state.currentStep - 1] || []
      : [],
  };

  return {
    state,
    actions: {
      selectJourneyType,
      updateJourneyData,
      updateContactInfo,
      nextStep,
      prevStep,
      submitForm,
      reset,
    },
    computed,
  };
}

// ============================================================================
// 4. MAIN COMPONENT - Clean and type-safe
// ============================================================================

import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

export function UserJourney() {
  const { state, actions, computed } = useJourney();

  // Render step content based on current state
  const renderStepContent = () => {
    // Category selection
    if (state.currentStep === 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => actions.selectJourneyType("developer")}
            className="p-6 border rounded-lg hover:bg-gray-50"
          >
            Developer
          </button>
          <button
            onClick={() => actions.selectJourneyType("investor")}
            className="p-6 border rounded-lg hover:bg-gray-50"
          >
            Investor
          </button>
          <button
            onClick={() => actions.selectJourneyType("entrepreneur")}
            className="p-6 border rounded-lg hover:bg-gray-50"
          >
            Entrepreneur
          </button>
        </div>
      );
    }

    // Journey steps (1-4)
    if (state.journey && state.currentStep >= 1 && state.currentStep <= 4) {
      return (
        <JourneyStepRenderer
          journey={state.journey}
          currentStep={state.currentStep}
          onUpdate={actions.updateJourneyData}
        />
      );
    }

    // Contact form (step 5)
    if (state.currentStep === 5) {
      return (
        <ContactFormRenderer
          data={state.contact}
          onUpdate={actions.updateContactInfo}
        />
      );
    }

    // Success page (step 6)
    if (state.currentStep === 6 && state.isComplete) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Success!</h2>
          <p>Your submission ID: {state.submissionId}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress bar */}
      {state.currentStep > 0 && state.currentStep <= 5 && (
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-500 rounded transition-all"
              style={{ width: `${computed.progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card>
            <CardContent className="p-8">
              {renderStepContent()}

              {/* Navigation */}
              {state.currentStep > 0 && state.currentStep <= 5 && (
                <div className="flex justify-between mt-8">
                  <button
                    onClick={actions.prevStep}
                    disabled={!computed.canGoPrev}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {state.currentStep < 5 ? (
                    <button
                      onClick={actions.nextStep}
                      disabled={!computed.isStepValid}
                      className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={actions.submitForm}
                      disabled={!computed.isStepValid}
                      className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
                    >
                      Submit
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// 5. STEP RENDERER - Type-safe component for rendering journey steps
// ============================================================================

interface JourneyStepRendererProps {
  journey: Journey;
  currentStep: number;
  onUpdate: <T extends Journey>(updates: Partial<T["data"]>) => void;
}

function JourneyStepRenderer({
  journey,
  currentStep,
  onUpdate,
}: JourneyStepRendererProps) {
  // This component would contain the actual form fields for each step
  // The key insight is that it receives a properly typed journey object
  // and can use type guards to render the appropriate fields

  if (journey.type === "developer") {
    return (
      <DeveloperStepFields
        step={currentStep}
        data={journey.data}
        onUpdate={onUpdate}
      />
    );
  }

  if (journey.type === "investor") {
    return (
      <InvestorStepFields
        step={currentStep}
        data={journey.data}
        onUpdate={onUpdate}
      />
    );
  }

  if (journey.type === "entrepreneur") {
    return (
      <EntrepreneurStepFields
        step={currentStep}
        data={journey.data}
        onUpdate={onUpdate}
      />
    );
  }

  return null;
}

// ============================================================================
// 6. STEP FIELD COMPONENTS - Individual journey implementations
// ============================================================================

// Developer Step Fields
function DeveloperStepFields({
  step,
  data,
  onUpdate,
}: {
  step: number;
  data: DeveloperJourney["data"];
  onUpdate: (updates: Partial<DeveloperJourney["data"]>) => void;
}) {
  switch (step) {
    case 1:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            What&apos;s your experience level?
          </h3>
          <select
            value={data.experienceLevel || ""}
            onChange={(e) =>
              onUpdate({
                experienceLevel: e.target
                  .value as DeveloperJourney["data"]["experienceLevel"],
              })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">Select...</option>
            <option value="junior">Junior (0-2 years)</option>
            <option value="mid">Mid (2-5 years)</option>
            <option value="senior">Senior (5-10 years)</option>
            <option value="lead">Lead (10+ years)</option>
          </select>
        </div>
      );

    case 2:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select your technologies</h3>
          <div className="grid grid-cols-2 gap-2">
            {["React", "Node.js", "Python", "TypeScript", "Go", "Java"].map(
              (tech) => (
                <label key={tech} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={data.technologies?.includes(tech) || false}
                    onChange={(e) => {
                      const current = data.technologies || [];
                      const updated = e.target.checked
                        ? [...current, tech]
                        : current.filter((t) => t !== tech);
                      onUpdate({ technologies: updated });
                    }}
                  />
                  <span>{tech}</span>
                </label>
              )
            )}
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Work preferences</h3>
          <div>
            <label>Work Type</label>
            <select
              value={data.workPreference || ""}
              onChange={(e) =>
                onUpdate({
                  workPreference: e.target
                    .value as DeveloperJourney["data"]["workPreference"],
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select...</option>
              <option value="freelance">Freelance</option>
              <option value="part_time">Part Time</option>
              <option value="full_time">Full Time</option>
              <option value="project_based">Project Based</option>
            </select>
          </div>
          <div>
            <label>Availability</label>
            <select
              value={data.availability || ""}
              onChange={(e) =>
                onUpdate({
                  availability: e.target
                    .value as DeveloperJourney["data"]["availability"],
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select...</option>
              <option value="immediate">Immediate</option>
              <option value="two_weeks">2 Weeks</option>
              <option value="one_month">1 Month</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Project preferences</h3>
          <div>
            <label>Project Type Interest</label>
            <select
              value={data.projectInterest || ""}
              onChange={(e) =>
                onUpdate({
                  projectInterest: e.target
                    .value as DeveloperJourney["data"]["projectInterest"],
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select...</option>
              <option value="startup">Startup</option>
              <option value="established">Established Company</option>
              <option value="agency">Agency</option>
              <option value="open_source">Open Source</option>
            </select>
          </div>
          <div>
            <label>Remote Preference</label>
            <select
              value={data.remotePref || ""}
              onChange={(e) =>
                onUpdate({
                  remotePref: e.target
                    .value as DeveloperJourney["data"]["remotePref"],
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select...</option>
              <option value="remote_only">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// Investor Step Fields
function InvestorStepFields({
  step,
  data,
  onUpdate,
}: {
  step: number;
  data: InvestorJourney["data"];
  onUpdate: (updates: Partial<InvestorJourney["data"]>) => void;
}) {
  switch (step) {
    case 1:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Investment Range</h3>
          <select
            value={data.investmentRange || ""}
            onChange={(e) =>
              onUpdate({
                investmentRange: e.target
                  .value as InvestorJourney["data"]["investmentRange"],
              })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">Select...</option>
            <option value="small">Small ($10k - $50k)</option>
            <option value="medium">Medium ($50k - $250k)</option>
            <option value="large">Large ($250k+)</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      );

    case 2:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Investment Type</h3>
          <select
            value={data.investmentType || ""}
            onChange={(e) =>
              onUpdate({
                investmentType: e.target
                  .value as InvestorJourney["data"]["investmentType"],
              })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">Select...</option>
            <option value="equity">Equity</option>
            <option value="revenue_share">Revenue Share</option>
            <option value="profit_share">Profit Share</option>
            <option value="hybrid">Hybrid Model</option>
          </select>
        </div>
      );

    case 3:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Industries of Interest</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              "SaaS",
              "FinTech",
              "HealthTech",
              "EdTech",
              "E-commerce",
              "AI/ML",
            ].map((industry) => (
              <label key={industry} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.industries?.includes(industry) || false}
                  onChange={(e) => {
                    const current = data.industries || [];
                    const updated = e.target.checked
                      ? [...current, industry]
                      : current.filter((i) => i !== industry);
                    onUpdate({ industries: updated });
                  }}
                />
                <span>{industry}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Investment Timeline & Involvement
          </h3>
          <div>
            <label>Timeline</label>
            <select
              value={data.timeline || ""}
              onChange={(e) =>
                onUpdate({
                  timeline: e.target
                    .value as InvestorJourney["data"]["timeline"],
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select...</option>
              <option value="immediate">Immediate</option>
              <option value="one_month">Within 1 Month</option>
              <option value="three_months">Within 3 Months</option>
              <option value="exploring">Just Exploring</option>
            </select>
          </div>
          <div>
            <label>Level of Involvement</label>
            <select
              value={data.involvement || ""}
              onChange={(e) =>
                onUpdate({
                  involvement: e.target
                    .value as InvestorJourney["data"]["involvement"],
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select...</option>
              <option value="passive">Passive</option>
              <option value="advisory">Advisory</option>
              <option value="active">Active</option>
              <option value="hands_on">Hands-on</option>
            </select>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// Entrepreneur Step Fields
function EntrepreneurStepFields({
  step,
  data,
  onUpdate,
}: {
  step: number;
  data: EntrepreneurJourney["data"];
  onUpdate: (updates: Partial<EntrepreneurJourney["data"]>) => void;
}) {
  switch (step) {
    case 1:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What stage is your project?</h3>
          <select
            value={data.projectStage || ""}
            onChange={(e) =>
              onUpdate({
                projectStage: e.target
                  .value as EntrepreneurJourney["data"]["projectStage"],
              })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">Select...</option>
            <option value="idea">Just an Idea</option>
            <option value="planning">Planning Phase</option>
            <option value="mvp_ready">MVP Ready</option>
            <option value="launched">Already Launched</option>
          </select>
        </div>
      );

    case 2:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Project Type</h3>
          <select
            value={data.projectType || ""}
            onChange={(e) =>
              onUpdate({
                projectType: e.target
                  .value as EntrepreneurJourney["data"]["projectType"],
              })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">Select...</option>
            <option value="web_app">Web Application</option>
            <option value="mobile_app">Mobile App</option>
            <option value="saas">SaaS Platform</option>
            <option value="marketplace">Marketplace</option>
            <option value="other">Other</option>
          </select>
          {data.projectType === "other" && (
            <input
              type="text"
              placeholder="Please describe your project"
              value={data.otherDescription || ""}
              onChange={(e) => onUpdate({ otherDescription: e.target.value })}
              className="w-full p-2 border rounded"
            />
          )}
        </div>
      );

    case 3:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Budget & Funding</h3>
          <div>
            <label>Funding Status</label>
            <select
              value={data.budget || ""}
              onChange={(e) =>
                onUpdate({
                  budget: e.target
                    .value as EntrepreneurJourney["data"]["budget"],
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select...</option>
              <option value="bootstrap">Bootstrap</option>
              <option value="seed_funded">Seed Funded</option>
              <option value="investor_backed">Investor Backed</option>
              <option value="revenue_generating">Revenue Generating</option>
            </select>
          </div>
          <div>
            <label>Estimated Budget (Optional)</label>
            <input
              type="text"
              placeholder="e.g., $10,000 - $50,000"
              value={data.estimatedBudget || ""}
              onChange={(e) => onUpdate({ estimatedBudget: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Partnership Preferences</h3>
          <div>
            <label>Partnership Type</label>
            <select
              value={data.partnershipType || ""}
              onChange={(e) =>
                onUpdate({
                  partnershipType: e.target
                    .value as EntrepreneurJourney["data"]["partnershipType"],
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select...</option>
              <option value="developer_only">Developer Only</option>
              <option value="cofounder_equity">Co-founder with Equity</option>
              <option value="hybrid">Hybrid (Cash + Equity)</option>
              <option value="consulting">Consulting</option>
            </select>
          </div>
          <div>
            <label>Timeline</label>
            <select
              value={data.timeline || ""}
              onChange={(e) =>
                onUpdate({
                  timeline: e.target
                    .value as EntrepreneurJourney["data"]["timeline"],
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select...</option>
              <option value="urgent">Urgent (ASAP)</option>
              <option value="one_month">Within 1 Month</option>
              <option value="three_months">Within 3 Months</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        </div>
      );

    default:
      return null;
  }
}

function ContactFormRenderer({
  data,
  onUpdate,
}: {
  data: Partial<ContactInfo>;
  onUpdate: (updates: Partial<ContactInfo>) => void;
}) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={data.name || ""}
        onChange={(e) => onUpdate({ name: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={data.email || ""}
        onChange={(e) => onUpdate({ email: e.target.value })}
        className="w-full p-2 border rounded"
      />
      {/* ... other fields */}
    </div>
  );
}
