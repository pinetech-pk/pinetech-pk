import { useState, useCallback } from "react";
import { FormData } from "./useUserJourney";

interface SubmissionResult {
  success: boolean;
  id?: number;
  message: string;
}

export const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);

  const submitForm = useCallback(async (formData: FormData) => {
    if (!formData.finalForm?.name || !formData.finalForm?.email) {
      setSubmissionResult({
        success: false,
        message: "Name and email are required",
      });
      return false;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

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
        return true;
      } else {
        setSubmissionResult({
          success: false,
          message: "Failed to submit form. Please try again.",
        });
        return false;
      }
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: "Network error. Please check your connection and try again.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setSubmissionResult(null);
  }, []);

  return {
    isSubmitting,
    submissionResult,
    submitForm,
    clearResult,
  };
};
