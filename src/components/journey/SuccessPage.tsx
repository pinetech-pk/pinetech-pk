import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SuccessPageProps {
  submissionId: number;
}

export function SuccessPage({ submissionId }: SuccessPageProps) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-pine-gradient rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold mb-2">Successfully Submitted!</h2>
      <p className="text-muted-foreground mb-2">
        Your details have been recorded successfully.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Reference ID: #{submissionId}
      </p>

      <div className="bg-muted/30 p-6 rounded-lg mb-8">
        <h3 className="font-semibold mb-4">What happens next?</h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• We&apos;ll review your responses and project fit</p>
          <p>• You may receive an email within 3-7 days</p>
          <p>• Response time may vary based on current project availability</p>
        </div>
      </div>

      <div className="border-2 border-pine-200 dark:border-pine-800 rounded-lg p-6 bg-pine-50/50 dark:bg-pine-950/20">
        <Badge variant="pine" className="mb-3">
          Recommended Next Step
        </Badge>
        <h3 className="font-bold mb-2">Want to fast-track the process?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Book a free consultation call to discuss opportunities directly. This
          guarantees a response within your selected time slot.
        </p>
        <Button variant="pine" className="w-full" asChild>
          <Link href="/book-appointment">Book Free Consultation</Link>
        </Button>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Return to Homepage
        </Link>
      </div>
    </div>
  );
}
