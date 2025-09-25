import { FormField } from "./utility-components";

interface ContactFormProps {
  formData: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  } | null;
  onUpdateFormData: (data: any) => void;
  submissionError?: string | null;
}

export function ContactForm({
  formData,
  onUpdateFormData,
  submissionError,
}: ContactFormProps) {
  const updateField = (field: string, value: string) => {
    onUpdateFormData({ ...formData, [field]: value });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Your Contact Details</h2>
      <p className="text-muted-foreground mb-8">
        Great! Now let&apos;s get your details so we can connect with you about
        opportunities.
      </p>

      <div className="space-y-4 mb-8">
        <FormField
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData?.name || ""}
          onChange={(value) => updateField("name", value)}
          required
        />

        <FormField
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          value={formData?.email || ""}
          onChange={(value) => updateField("email", value)}
          required
        />

        <FormField
          label="Phone Number"
          type="tel"
          placeholder="+92 XXX XXX XXXX"
          value={formData?.phone || ""}
          onChange={(value) => updateField("phone", value)}
        />

        <FormField
          label="Additional Message"
          type="textarea"
          placeholder="Any specific questions or details you'd like to share..."
          value={formData?.message || ""}
          onChange={(value) => updateField("message", value)}
          rows={4}
        />
      </div>

      {/* Submission error message */}
      {submissionError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">
            {submissionError}
          </p>
        </div>
      )}
    </div>
  );
}
