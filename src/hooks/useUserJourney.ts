import { useState, useCallback } from "react";

// ──────────────────────────────────────────────
// DEVELOPER Step-specific data types
// ──────────────────────────────────────────────
export interface DeveloperStep1Data {
  skills: string[];
}

export interface DeveloperStep2Data {
  stage: "junior" | "mid" | "senior" | "freelancer";
}

export interface DeveloperStep3Data {
  interest: "salary" | "equity" | "learning" | "leadership";
}

export interface DeveloperStep4Data {
  availability: "immediate" | "two_weeks" | "one_month" | "exploring";
  commitment: "full_time" | "part_time" | "contract" | "side_project";
}

// ──────────────────────────────────────────────
// INVESTOR Step-specific data types
// ──────────────────────────────────────────────
export interface InvestorStep1Data {
  investmentRange: "small" | "medium" | "large" | "flexible";
}

export interface InvestorStep2Data {
  investmentType: "equity" | "revenue_share" | "profit_share" | "hybrid";
}

export interface InvestorStep3Data {
  industries: string[];
}

export interface InvestorStep4Data {
  timeline: "immediate" | "one_month" | "three_months" | "exploring";
  involvement: "passive" | "advisory" | "active" | "hands_on";
}

// ──────────────────────────────────────────────
// ENTREPRENEUR Step-specific data types
// ──────────────────────────────────────────────
export interface EntrepreneurStep1Data {
  projectStage: "idea" | "planning" | "mvp_ready" | "launched";
}

export interface EntrepreneurStep2Data {
  projectType: "web_app" | "mobile_app" | "saas" | "marketplace" | "other";
  otherDescription?: string;
}

export interface EntrepreneurStep3Data {
  budget:
    | "bootstrap"
    | "seed_funded"
    | "investor_backed"
    | "revenue_generating";
  estimatedBudget?: string;
}

export interface EntrepreneurStep4Data {
  partnershipType:
    | "developer_only"
    | "cofounder_equity"
    | "hybrid"
    | "consulting";
  timeline: "urgent" | "one_month" | "three_months" | "flexible";
}

// ──────────────────────────────────────────────
// Contact / final form
// ──────────────────────────────────────────────
export interface FinalFormData {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

// ──────────────────────────────────────────────
// Union types for each step (all possible data types)
// ──────────────────────────────────────────────
type Step1DataUnion =
  | DeveloperStep1Data
  | InvestorStep1Data
  | EntrepreneurStep1Data
  | null;
type Step2DataUnion =
  | DeveloperStep2Data
  | InvestorStep2Data
  | EntrepreneurStep2Data
  | null;
type Step3DataUnion =
  | DeveloperStep3Data
  | InvestorStep3Data
  | EntrepreneurStep3Data
  | null;
type Step4DataUnion =
  | DeveloperStep4Data
  | InvestorStep4Data
  | EntrepreneurStep4Data
  | null;

// ──────────────────────────────────────────────
// Master FormData type for the entire journey
// ──────────────────────────────────────────────
export interface FormData {
  userType: "developer" | "investor" | "entrepreneur" | null;
  step1: Step1DataUnion;
  step2: Step2DataUnion;
  step3: Step3DataUnion;
  step4: Step4DataUnion;
  finalForm: FinalFormData | null;
}

export const useUserJourney = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
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
  const updateFormData = useCallback(
    <K extends keyof FormData>(step: K, data: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [step]: data }));
    },
    []
  );

  // Validation logic
  const isStepValid = useCallback(
    (step: number): boolean => {
      if (!formData.userType) return false;

      switch (step) {
        case 1:
          if (formData.userType === "developer") {
            return !!(formData.step1 as DeveloperStep1Data)?.skills?.length;
          } else if (formData.userType === "investor") {
            return !!(formData.step1 as InvestorStep1Data)?.investmentRange;
          } else if (formData.userType === "entrepreneur") {
            return !!(formData.step1 as EntrepreneurStep1Data)?.projectStage;
          }
          return false;

        case 2:
          if (formData.userType === "developer") {
            return !!(formData.step2 as DeveloperStep2Data)?.stage;
          } else if (formData.userType === "investor") {
            return !!(formData.step2 as InvestorStep2Data)?.investmentType;
          } else if (formData.userType === "entrepreneur") {
            return !!(formData.step2 as EntrepreneurStep2Data)?.projectType;
          }
          return false;

        case 3:
          if (formData.userType === "developer") {
            return !!(formData.step3 as DeveloperStep3Data)?.interest;
          } else if (formData.userType === "investor") {
            return !!(formData.step3 as InvestorStep3Data)?.industries?.length;
          } else if (formData.userType === "entrepreneur") {
            return !!(formData.step3 as EntrepreneurStep3Data)?.budget;
          }
          return false;

        case 4:
          if (formData.userType === "developer") {
            const devStep4 = formData.step4 as DeveloperStep4Data;
            return !!(devStep4?.availability && devStep4?.commitment);
          } else if (formData.userType === "investor") {
            const invStep4 = formData.step4 as InvestorStep4Data;
            return !!(invStep4?.timeline && invStep4?.involvement);
          } else if (formData.userType === "entrepreneur") {
            const entStep4 = formData.step4 as EntrepreneurStep4Data;
            return !!(entStep4?.partnershipType && entStep4?.timeline);
          }
          return false;

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
