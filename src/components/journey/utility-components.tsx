import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Progress Indicator Component
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  if (currentStep === 0 || currentStep > totalSteps) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-2 mb-4">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
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
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}

// Step Navigation Component
interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  isSubmitting?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  isStepValid,
  isSubmitting = false,
  onPrevious,
  onNext,
  onSubmit,
}: StepNavigationProps) {
  // Don't show navigation on success step
  if (currentStep > totalSteps) return null;

  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between items-center">
      <Button
        onClick={onPrevious}
        variant="ghost"
        className="flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {!isLastStep && (
        <Button
          onClick={onNext}
          variant="pine"
          className="flex items-center"
          disabled={!isStepValid}
        >
          Next Step
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}

      {isLastStep && onSubmit && (
        <Button
          onClick={onSubmit}
          variant="pine"
          className="flex items-center"
          disabled={!isStepValid || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Details"}
          {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}

// Form Field Component
interface FormFieldProps {
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
}

export function FormField({
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  rows = 4,
}: FormFieldProps) {
  const baseClassName =
    "w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-pine-500 focus:border-transparent";

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
        {!required && <span className="text-muted-foreground">(optional)</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          className={baseClassName}
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={baseClassName}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
