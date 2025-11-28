"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Phone,
  Video,
  MessageCircle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";

interface TimeSlot {
  label: string;
  time: string;
  available: boolean;
}

interface DaySlots {
  date: string;
  dayName: string;
  formattedDate: string;
  slots: {
    morning: TimeSlot;
    evening: TimeSlot;
  };
}

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

type Step = "date" | "time" | "type" | "tool" | "details" | "confirm" | "success";

// Loading fallback component
function BookingLoadingFallback() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Main booking content component
function BookingContent() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("ref");

  const [step, setStep] = useState<Step>("date");
  const [availableSlots, setAvailableSlots] = useState<DaySlots[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selection state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<"morning" | "evening" | null>(null);
  const [selectedCallType, setSelectedCallType] = useState<"voice" | "video" | null>(null);
  const [selectedTool, setSelectedTool] = useState<"phone" | "whatsapp" | "zoom" | null>(null);
  const [formData, setFormData] = useState<BookingForm>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [bookingResult, setBookingResult] = useState<{
    id: number;
    date: string;
    time: string;
  } | null>(null);

  // Fetch available slots
  const fetchSlots = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/bookings/slots");
      if (!response.ok) throw new Error("Failed to fetch slots");
      const data = await response.json();
      setAvailableSlots(data.slots);
    } catch {
      setError("Unable to load available slots. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Get selected day info
  const selectedDayInfo = availableSlots.find((s) => s.date === selectedDate);

  // Submit booking
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTimeSlot || !selectedCallType || !selectedTool) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submissionId ? parseInt(submissionId) : null,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          bookingDate: selectedDate,
          timeSlot: selectedTimeSlot,
          callType: selectedCallType,
          preferredTool: selectedTool,
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book consultation");
      }

      const slotInfo = selectedTimeSlot === "morning"
        ? "10:30 AM - 11:00 AM"
        : "8:00 PM - 8:30 PM";

      setBookingResult({
        id: data.booking.id,
        date: selectedDayInfo?.formattedDate || selectedDate,
        time: slotInfo,
      });
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation helpers
  const goBack = () => {
    const steps: Step[] = ["date", "time", "type", "tool", "details", "confirm"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const goNext = () => {
    const steps: Step[] = ["date", "time", "type", "tool", "details", "confirm"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  // Validation for each step
  const canProceed = () => {
    switch (step) {
      case "date":
        return selectedDate !== null;
      case "time":
        return selectedTimeSlot !== null;
      case "type":
        return selectedCallType !== null;
      case "tool":
        return selectedTool !== null;
      case "details":
        return formData.name.trim() && formData.email.trim() && formData.phone.trim();
      default:
        return true;
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case "date":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
              <h2 className="text-2xl font-bold mb-2 text-foreground">Select a Date</h2>
              <p className="text-muted-foreground">
                Choose from available consultation days (Monday - Thursday)
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableSlots.map((day) => {
                  const hasAvailableSlots = day.slots.morning.available || day.slots.evening.available;
                  const isSelected = selectedDate === day.date;

                  return (
                    <button
                      key={day.date}
                      onClick={() => hasAvailableSlots && setSelectedDate(day.date)}
                      disabled={!hasAvailableSlots}
                      className={`p-4 rounded-lg border transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10"
                          : hasAvailableSlots
                          ? "border-border hover:border-muted-foreground/50 bg-secondary/50 dark:bg-zinc-800/50"
                          : "border-border bg-muted/50 dark:bg-zinc-900/50 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="text-sm text-muted-foreground">{day.dayName}</div>
                      <div className={`font-semibold text-foreground ${isSelected ? "text-emerald-500 dark:text-emerald-400" : ""}`}>
                        {day.formattedDate}
                      </div>
                      <div className="text-xs mt-1 text-muted-foreground/70">
                        {hasAvailableSlots
                          ? `${[day.slots.morning.available, day.slots.evening.available].filter(Boolean).length} slot(s)`
                          : "Fully booked"}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );

      case "time":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Clock className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
              <h2 className="text-2xl font-bold mb-2 text-foreground">Select Time Slot</h2>
              <p className="text-muted-foreground">
                {selectedDayInfo?.dayName}, {selectedDayInfo?.formattedDate}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">All times in PKT (Pakistan Standard Time)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
              {/* Morning Slot */}
              <button
                onClick={() => selectedDayInfo?.slots.morning.available && setSelectedTimeSlot("morning")}
                disabled={!selectedDayInfo?.slots.morning.available}
                className={`p-6 rounded-lg border transition-all ${
                  selectedTimeSlot === "morning"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : selectedDayInfo?.slots.morning.available
                    ? "border-border hover:border-muted-foreground/50 bg-secondary/50 dark:bg-zinc-800/50"
                    : "border-border bg-muted/50 dark:bg-zinc-900/50 opacity-50 cursor-not-allowed"
                }`}
              >
                <Sun className="w-8 h-8 mx-auto mb-3 text-amber-400" />
                <div className="font-semibold text-foreground">Morning</div>
                <div className="text-sm text-muted-foreground">10:30 AM - 11:00 AM</div>
                {!selectedDayInfo?.slots.morning.available && (
                  <Badge variant="outline" className="mt-2 text-red-500 dark:text-red-400 border-red-300 dark:border-red-800">
                    Booked
                  </Badge>
                )}
              </button>

              {/* Evening Slot */}
              <button
                onClick={() => selectedDayInfo?.slots.evening.available && setSelectedTimeSlot("evening")}
                disabled={!selectedDayInfo?.slots.evening.available}
                className={`p-6 rounded-lg border transition-all ${
                  selectedTimeSlot === "evening"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : selectedDayInfo?.slots.evening.available
                    ? "border-border hover:border-muted-foreground/50 bg-secondary/50 dark:bg-zinc-800/50"
                    : "border-border bg-muted/50 dark:bg-zinc-900/50 opacity-50 cursor-not-allowed"
                }`}
              >
                <Moon className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
                <div className="font-semibold text-foreground">Evening</div>
                <div className="text-sm text-muted-foreground">8:00 PM - 8:30 PM</div>
                {!selectedDayInfo?.slots.evening.available && (
                  <Badge variant="outline" className="mt-2 text-red-500 dark:text-red-400 border-red-300 dark:border-red-800">
                    Booked
                  </Badge>
                )}
              </button>
            </div>
          </div>
        );

      case "type":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Video className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
              <h2 className="text-2xl font-bold mb-2 text-foreground">Call Type</h2>
              <p className="text-muted-foreground">How would you like to connect?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
              <button
                onClick={() => setSelectedCallType("voice")}
                className={`p-6 rounded-lg border transition-all ${
                  selectedCallType === "voice"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-border hover:border-muted-foreground/50 bg-secondary/50 dark:bg-zinc-800/50"
                }`}
              >
                <Phone className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <div className="font-semibold text-foreground">Voice Only</div>
                <div className="text-sm text-muted-foreground">Audio call without video</div>
              </button>

              <button
                onClick={() => setSelectedCallType("video")}
                className={`p-6 rounded-lg border transition-all ${
                  selectedCallType === "video"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-border hover:border-muted-foreground/50 bg-secondary/50 dark:bg-zinc-800/50"
                }`}
              >
                <Video className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <div className="font-semibold text-foreground">Video Call</div>
                <div className="text-sm text-muted-foreground">Face-to-face video meeting</div>
              </button>
            </div>
          </div>
        );

      case "tool":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
              <h2 className="text-2xl font-bold mb-2 text-foreground">Preferred Platform</h2>
              <p className="text-muted-foreground">Where should we connect?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => setSelectedTool("phone")}
                className={`p-6 rounded-lg border transition-all ${
                  selectedTool === "phone"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-border hover:border-muted-foreground/50 bg-secondary/50 dark:bg-zinc-800/50"
                }`}
              >
                <Phone className="w-8 h-8 mx-auto mb-3 text-green-400" />
                <div className="font-semibold text-foreground">Phone Call</div>
                <div className="text-sm text-muted-foreground">Direct phone call</div>
              </button>

              <button
                onClick={() => setSelectedTool("whatsapp")}
                className={`p-6 rounded-lg border transition-all ${
                  selectedTool === "whatsapp"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-border hover:border-muted-foreground/50 bg-secondary/50 dark:bg-zinc-800/50"
                }`}
              >
                <MessageCircle className="w-8 h-8 mx-auto mb-3 text-green-500" />
                <div className="font-semibold text-foreground">WhatsApp</div>
                <div className="text-sm text-muted-foreground">
                  {selectedCallType === "video" ? "WhatsApp Video" : "WhatsApp Call"}
                </div>
              </button>

              <button
                onClick={() => setSelectedTool("zoom")}
                className={`p-6 rounded-lg border transition-all ${
                  selectedTool === "zoom"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-border hover:border-muted-foreground/50 bg-secondary/50 dark:bg-zinc-800/50"
                }`}
              >
                <Video className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                <div className="font-semibold text-foreground">Zoom</div>
                <div className="text-sm text-muted-foreground">Zoom meeting link</div>
              </button>
            </div>
          </div>
        );

      case "details":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
              <h2 className="text-2xl font-bold mb-2 text-foreground">Your Details</h2>
              <p className="text-muted-foreground">How can we reach you?</p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full bg-secondary dark:bg-zinc-800 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full bg-secondary dark:bg-zinc-800 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full bg-secondary dark:bg-zinc-800 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Anything you'd like to discuss or mention..."
                  rows={3}
                  className="w-full bg-secondary dark:bg-zinc-800 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        );

      case "confirm":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
              <h2 className="text-2xl font-bold mb-2 text-foreground">Confirm Booking</h2>
              <p className="text-muted-foreground">Please review your consultation details</p>
            </div>

            <div className="max-w-md mx-auto bg-secondary/50 dark:bg-zinc-800/50 rounded-lg border border-border p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">
                  {selectedDayInfo?.dayName}, {selectedDayInfo?.formattedDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-foreground">
                  {selectedTimeSlot === "morning" ? "10:30 AM - 11:00 AM" : "8:00 PM - 8:30 PM"} PKT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Call Type</span>
                <span className="font-medium capitalize text-foreground">{selectedCallType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform</span>
                <span className="font-medium capitalize text-foreground">{selectedTool}</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium text-foreground">{formData.name}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium text-foreground">{formData.phone}</span>
              </div>
              {formData.notes && (
                <div className="border-t border-border pt-4">
                  <span className="text-muted-foreground block mb-1">Notes</span>
                  <span className="text-sm text-foreground">{formData.notes}</span>
                </div>
              )}
            </div>

            {error && (
              <div className="max-w-md mx-auto bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400 text-center">
                {error}
              </div>
            )}
          </div>
        );

      case "success":
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-foreground">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-6">
              Your consultation has been scheduled successfully.
            </p>

            <div className="max-w-sm mx-auto bg-secondary/50 dark:bg-zinc-800/50 rounded-lg border border-border p-6 mb-8">
              <div className="text-sm text-muted-foreground mb-1">Booking Reference</div>
              <div className="text-2xl font-bold text-emerald-500 dark:text-emerald-400 mb-4">
                #{bookingResult?.id}
              </div>
              <div className="text-sm text-muted-foreground mb-1">Scheduled For</div>
              <div className="font-medium text-foreground">{bookingResult?.date}</div>
              <div className="text-emerald-500 dark:text-emerald-400">{bookingResult?.time} PKT</div>
            </div>

            <p className="text-sm text-muted-foreground/70 mb-6">
              You will receive a confirmation email with meeting details shortly.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Homepage
            </Link>
          </div>
        );
    }
  };

  // Progress indicator
  const steps: Step[] = ["date", "time", "type", "tool", "details", "confirm"];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            {/* Page header */}
            <div className="text-center mb-8">
              <Badge
                variant="outline"
                className="mb-4 text-emerald-500 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
              >
                Free Consultation
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Book Your{" "}
                <span className="text-emerald-500 dark:text-emerald-400">30-Minute</span>{" "}
                Consultation
              </h1>
              <p className="text-muted-foreground">
                Schedule a call to discuss your project and explore how we can work together.
              </p>
            </div>

            {/* Progress bar */}
            {step !== "success" && (
              <div className="mb-8">
                <div className="flex justify-between text-xs text-muted-foreground/70 mb-2">
                  <span>Date</span>
                  <span>Time</span>
                  <span>Type</span>
                  <span>Platform</span>
                  <span>Details</span>
                  <span>Confirm</span>
                </div>
                <div className="h-2 bg-secondary dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Step content */}
            <div className="bg-card/50 dark:bg-zinc-900/50 rounded-xl border border-border p-6 md:p-8">
              {renderStepContent()}
            </div>

            {/* Navigation buttons */}
            {step !== "success" && (
              <div className="flex justify-between mt-6">
                <button
                  onClick={goBack}
                  disabled={step === "date"}
                  className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-secondary dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                {step === "confirm" ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-muted dark:disabled:bg-zinc-700 disabled:text-muted-foreground rounded-lg flex items-center gap-2 transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={goNext}
                    disabled={!canProceed()}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-muted dark:disabled:bg-zinc-700 disabled:text-muted-foreground disabled:cursor-not-allowed rounded-lg flex items-center gap-2 transition-colors"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Page component with Suspense boundary
export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<BookingLoadingFallback />}>
      <BookingContent />
    </Suspense>
  );
}
