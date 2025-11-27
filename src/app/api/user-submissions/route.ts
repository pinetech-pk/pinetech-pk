import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { userSubmissions } from "@/lib/db/schema";
import { authOptions } from "@/lib/auth";

// POST - Create new user submission (public - no auth required)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userType,
      name,
      email,
      phone,
      message,
      stepResponses,
      submissionType,
    } = body;

    // Validate required fields
    if (!userType || !name || !email) {
      return NextResponse.json(
        { error: "User type, name, and email are required" },
        { status: 400 }
      );
    }

    // Validate user type
    if (!["developer", "investor", "entrepreneur"].includes(userType)) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Insert into database
    const newSubmission = await db
      .insert(userSubmissions)
      .values({
        userType,
        name,
        email,
        phone: phone || "",
        message: message || "",
        stepResponses: stepResponses || {},
        submissionType: submissionType || "form",
        status: "new",
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        id: newSubmission[0].id,
        message: "Submission recorded successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("User submission error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}

// GET - Fetch all user submissions (protected - admin only)
export async function GET() {
  try {
    // Server-side authentication check
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to access this resource." },
        { status: 401 }
      );
    }

    const submissions = await db
      .select()
      .from(userSubmissions)
      .orderBy(userSubmissions.createdAt);
    
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Database GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
