import { useState, useCallback } from "react";

// Types for form data
export interface FormData {
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

export const useUserJourney = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    userType: null,
    step1: null,
    step2: null,
    step3: null,
    step4: null,
    finalForm: null,
  });

  // Step 0: Category Selection
  const selectCategory = useCallback(
    (category: "developer" | "investor" | "entrepreneur") => {
      setFormData((prev) => ({ ...prev, userType: category }));
      setCurrentStep(1);
    },
    []
  );

  // Navigation
  const goToNextStep = useCallback(() => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  }, [currentStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  // Update form data for specific step
  const updateFormData = useCallback((step: keyof FormData, data: any) => {
    setFormData((prev) => ({ ...prev, [step]: data }));
  }, []);

  // Validation logic
  const isStepValid = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return !!formData.step1?.skills?.length;
        case 2:
          return !!formData.step2?.stage;
        case 3:
          return !!formData.step3?.interest;
        case 4:
          return !!(formData.step4?.availability && formData.step4?.commitment);
        case 5:
          return !!(formData.finalForm?.name && formData.finalForm?.email);
        default:
          return true;
      }
    },
    [formData]
  );

  return {
    currentStep,
    setCurrentStep,
    formData,
    selectCategory,
    goToNextStep,
    goToPreviousStep,
    updateFormData,
    isStepValid,
  };
};
