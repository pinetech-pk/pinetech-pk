import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatRooms } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

// GET - List all chat rooms (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rooms = await db
      .select()
      .from(chatRooms)
      .orderBy(desc(chatRooms.createdAt));

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat rooms" },
      { status: 500 }
    );
  }
}

// POST - Create a new chat room (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, adminNote } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const [newRoom] = await db
      .insert(chatRooms)
      .values({
        title: title.trim(),
        description: description?.trim() || null,
        adminNote: adminNote?.trim() || null,
      })
      .returning();

    return NextResponse.json({ room: newRoom }, { status: 201 });
  } catch (error) {
    console.error("Error creating chat room:", error);
    return NextResponse.json(
      { error: "Failed to create chat room" },
      { status: 500 }
    );
  }
}
