import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useUserJourney } from "@/hooks/useUserJourney";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { CategorySelector } from "./CategorySelector";
import { DeveloperSteps } from "./DeveloperSteps";
import { ContactForm } from "./ContactForm";
import { SuccessPage } from "./SuccessPage";
import { ProgressIndicator, StepNavigation } from "./utility-components";

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

  // Helper function to get step data safely
  const getStepData = (step: number) => {
    switch (step) {
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
                {/* Developer Journey Steps */}
                {formData.userType === "developer" && currentStep <= 4 && (
                  <DeveloperSteps
                    step={currentStep}
                    formData={getStepData(currentStep)}
                    onUpdateFormData={updateFormData}
                  />
                )}

                {/* Contact Form (Step 5) */}
                {currentStep === 5 && (
                  <ContactForm
                    formData={formData.finalForm}
                    onUpdateFormData={(data) =>
                      updateFormData("finalForm", data)
                    }
                    submissionError={
                      submissionResult?.success === false
                        ? submissionResult.message
                        : null
                    }
                  />
                )}

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
