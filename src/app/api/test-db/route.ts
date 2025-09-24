import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testSubmissions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET - Fetch all test records
export async function GET() {
  try {
    const records = await db
      .select()
      .from(testSubmissions)
      .orderBy(testSubmissions.createdAt);
    return NextResponse.json(records);
  } catch (error) {
    console.error("Database GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

// POST - Create new test record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const newRecord = await db
      .insert(testSubmissions)
      .values({
        name,
        email,
        message,
      })
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Database POST error:", error);
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 }
    );
  }
}

// DELETE - Remove test record
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Record ID is required" },
        { status: 400 }
      );
    }

    await db
      .delete(testSubmissions)
      .where(eq(testSubmissions.id, parseInt(id)));

    return NextResponse.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Database DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete record" },
      { status: 500 }
    );
  }
}
// This API route handles GET, POST, and DELETE requests to manage test records in the database.
