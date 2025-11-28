import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { consultationBookings } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

// Time slot configuration
export const TIME_SLOTS = {
  morning: {
    label: "Morning",
    time: "10:30 AM - 11:00 AM",
    startTime: "10:30",
    endTime: "11:00",
  },
  evening: {
    label: "Evening",
    time: "8:00 PM - 8:30 PM",
    startTime: "20:00",
    endTime: "20:30",
  },
} as const;

// Available days (0 = Sunday, 1 = Monday, etc.)
const AVAILABLE_DAYS = [1, 2, 3, 4]; // Monday to Thursday

// Generate available dates for the next N weeks
function getAvailableDates(weeks: number = 2): string[] {
  const dates: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start from tomorrow
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() + 1);

  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + weeks * 7);

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();

    if (AVAILABLE_DAYS.includes(dayOfWeek)) {
      dates.push(currentDate.toISOString().split("T")[0]);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// GET - Get available slots for the next 2 weeks
export async function GET() {
  try {
    const availableDates = getAvailableDates(2);

    if (availableDates.length === 0) {
      return NextResponse.json({ slots: [] });
    }

    // Get existing bookings for these dates
    const existingBookings = await db
      .select({
        bookingDate: consultationBookings.bookingDate,
        timeSlot: consultationBookings.timeSlot,
      })
      .from(consultationBookings)
      .where(
        and(
          gte(consultationBookings.bookingDate, availableDates[0]),
          lte(
            consultationBookings.bookingDate,
            availableDates[availableDates.length - 1]
          ),
          // Only count non-cancelled bookings
          eq(consultationBookings.status, "pending")
        )
      );

    // Create a set of booked slots for quick lookup
    const bookedSlots = new Set(
      existingBookings.map((b) => `${b.bookingDate}-${b.timeSlot}`)
    );

    // Build available slots response
    const slots = availableDates.map((dateStr) => {
      const date = new Date(dateStr + "T00:00:00");
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return {
        date: dateStr,
        dayName,
        formattedDate,
        slots: {
          morning: {
            ...TIME_SLOTS.morning,
            available: !bookedSlots.has(`${dateStr}-morning`),
          },
          evening: {
            ...TIME_SLOTS.evening,
            available: !bookedSlots.has(`${dateStr}-evening`),
          },
        },
      };
    });

    return NextResponse.json({
      slots,
      timeZone: "PKT (Pakistan Standard Time)",
    });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}
