import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { consultationBookings } from "@/lib/db/schema";
import { desc, eq, and } from "drizzle-orm";

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      submissionId,
      name,
      email,
      phone,
      bookingDate,
      timeSlot,
      callType,
      preferredTool,
      notes,
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !bookingDate || !timeSlot || !callType || !preferredTool) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate slot values
    if (!["morning", "evening"].includes(timeSlot)) {
      return NextResponse.json(
        { error: "Invalid time slot" },
        { status: 400 }
      );
    }

    if (!["voice", "video"].includes(callType)) {
      return NextResponse.json(
        { error: "Invalid call type" },
        { status: 400 }
      );
    }

    if (!["phone", "whatsapp", "zoom"].includes(preferredTool)) {
      return NextResponse.json(
        { error: "Invalid preferred tool" },
        { status: 400 }
      );
    }

    // Check if slot is already booked
    const existingBooking = await db
      .select()
      .from(consultationBookings)
      .where(
        and(
          eq(consultationBookings.bookingDate, bookingDate),
          eq(consultationBookings.timeSlot, timeSlot),
          eq(consultationBookings.status, "pending")
        )
      );

    if (existingBooking.length > 0) {
      return NextResponse.json(
        { error: "This slot is no longer available. Please choose another." },
        { status: 409 }
      );
    }

    // Create the booking
    const [newBooking] = await db
      .insert(consultationBookings)
      .values({
        submissionId: submissionId || null,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        bookingDate,
        timeSlot,
        callType,
        preferredTool,
        notes: notes?.trim() || null,
        status: "pending",
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        booking: newBooking,
        message: "Consultation booked successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// GET - List all bookings (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await db
      .select()
      .from(consultationBookings)
      .orderBy(desc(consultationBookings.bookingDate));

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
