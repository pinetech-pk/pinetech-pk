import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useUserJourney } from "@/hooks/useUserJourney";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { CategorySelector } from "./CategorySelector";
import { DeveloperSteps } from "./DeveloperSteps";
import { InvestorSteps } from "./InvestorSteps";
import { EntrepreneurSteps } from "./EntrepreneurSteps";
import { ContactForm } from "./ContactForm";
import { SuccessPage } from "./SuccessPage";
import { ProgressIndicator, StepNavigation } from "./utility-components";

// Import step data types - these should match the component prop types
type DeveloperStepData =
  | { experienceLevel: "junior" | "mid" | "senior" | "lead" }
  | { technologies: string[] }
  | {
      workPreference: "freelance" | "part_time" | "full_time" | "project_based";
      availability: "immediate" | "two_weeks" | "one_month" | "flexible";
    }
  | {
      projectInterest: "startup" | "established" | "agency" | "open_source";
      remotePref: "remote_only" | "hybrid" | "onsite" | "flexible";
    }
  | null;

type InvestorStepData =
  | { investmentRange: "small" | "medium" | "large" | "flexible" }
  | { investmentType: "equity" | "revenue_share" | "profit_share" | "hybrid" }
  | { industries: string[] }
  | {
      timeline: "immediate" | "one_month" | "three_months" | "exploring";
      involvement: "passive" | "advisory" | "active" | "hands_on";
    }
  | null;

type EntrepreneurStepData =
  | { projectStage: "idea" | "planning" | "mvp_ready" | "launched" }
  | {
      projectType: "web_app" | "mobile_app" | "saas" | "marketplace" | "other";
      otherDescription?: string;
    }
  | {
      budget:
        | "bootstrap"
        | "seed_funded"
        | "investor_backed"
        | "revenue_generating";
      estimatedBudget?: string;
    }
  | {
      partnershipType:
        | "developer_only"
        | "cofounder_equity"
        | "hybrid"
        | "consulting";
      timeline: "urgent" | "one_month" | "three_months" | "flexible";
    }
  | null;

// Union type that can be passed to step components
type StepDataUnion =
  | DeveloperStepData
  | InvestorStepData
  | EntrepreneurStepData;

export function UserJourney() {
  const {
    currentStep,
    setCurrentStep,
    formData,
    selectCategory,
    goToNextStep,
    goToPreviousStep,
    updateFormData,
    isStepValid,
  } = useUserJourney();

  const { isSubmitting, submissionResult, submitForm } = useFormSubmission();

  // Handle successful form submission
  useEffect(() => {
    if (submissionResult?.success) {
      setCurrentStep(6);
    }
  }, [submissionResult, setCurrentStep]);

  // Submit form
  const handleSubmit = async () => {
    const success = await submitForm(formData);
    if (success) {
      setCurrentStep(6);
    }
  };

  // Render appropriate steps based on user type
  const renderSteps = () => {
    if (currentStep === 5) {
      return (
        <ContactForm
          formData={formData.finalForm}
          onUpdateFormData={(data) => updateFormData("finalForm", data)}
          submissionError={
            submissionResult?.success === false
              ? submissionResult.message
              : null
          }
        />
      );
    }

    // Get current step data
    const stepData = (() => {
      switch (currentStep) {
        case 1:
          return formData.step1;
        case 2:
          return formData.step2;
        case 3:
          return formData.step3;
        case 4:
          return formData.step4;
        default:
          return null;
      }
    })();

    if (currentStep >= 1 && currentStep <= 4) {
      if (formData.userType === "developer") {
        return (
          <DeveloperSteps
            step={currentStep}
            formData={stepData as DeveloperStepData}
            onUpdateFormData={updateFormData}
          />
        );
      } else if (formData.userType === "investor") {
        return (
          <InvestorSteps
            step={currentStep}
            formData={stepData as InvestorStepData}
            onUpdateFormData={updateFormData}
          />
        );
      } else if (formData.userType === "entrepreneur") {
        return (
          <EntrepreneurSteps
            step={currentStep}
            formData={stepData as EntrepreneurStepData}
            onUpdateFormData={updateFormData}
          />
        );
      }
    }

    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <ProgressIndicator currentStep={currentStep} totalSteps={5} />

      <AnimatePresence mode="wait">
        {/* Step 0: Category Selection Gate */}
        {currentStep === 0 && (
          <CategorySelector key="category" onSelectCategory={selectCategory} />
        )}

        {/* Steps 1-5: Journey Steps */}
        {currentStep > 0 && currentStep <= 5 && (
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8">
              <CardContent className="p-0">
                {renderSteps()}

                {/* Navigation buttons */}
                <StepNavigation
                  currentStep={currentStep}
                  totalSteps={5}
                  isStepValid={isStepValid(currentStep)}
                  isSubmitting={isSubmitting}
                  onPrevious={goToPreviousStep}
                  onNext={goToNextStep}
                  onSubmit={currentStep === 5 ? handleSubmit : undefined}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 6: Success Page */}
        {currentStep === 6 && submissionResult?.success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-8">
              <CardContent className="p-0">
                <SuccessPage submissionId={submissionResult.id!} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
