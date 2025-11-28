import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatRooms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ roomId: string }>;
}

// GET - Get a single room (admin: by roomId, client: by roomId + accessKey)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { roomId } = await params;
    const { searchParams } = new URL(request.url);
    const accessKey = searchParams.get("key");

    const session = await getServerSession(authOptions);

    const [room] = await db
      .select()
      .from(chatRooms)
      .where(eq(chatRooms.id, roomId));

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Admin can access any room
    if (session) {
      return NextResponse.json({ room, role: "admin" });
    }

    // Client must provide valid access key
    if (accessKey && room.accessKey === accessKey) {
      if (!room.isActive) {
        return NextResponse.json(
          { error: "This chat room is no longer active" },
          { status: 403 }
        );
      }
      // Don't expose the accessKey back to the client
      const { accessKey: _, ...safeRoom } = room;
      return NextResponse.json({ room: safeRoom, role: "client" });
    }

    return NextResponse.json(
      { error: "Invalid or missing access key" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}

// PATCH - Update room (admin: all fields, client: only clientNote)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { roomId } = await params;
    const { searchParams } = new URL(request.url);
    const accessKey = searchParams.get("key");
    const body = await request.json();

    const session = await getServerSession(authOptions);

    const [existingRoom] = await db
      .select()
      .from(chatRooms)
      .where(eq(chatRooms.id, roomId));

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Admin can update all fields
    if (session) {
      const { title, description, adminNote, isActive } = body;

      const [updatedRoom] = await db
        .update(chatRooms)
        .set({
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(adminNote !== undefined && { adminNote }),
          ...(isActive !== undefined && { isActive }),
          updatedAt: new Date(),
        })
        .where(eq(chatRooms.id, roomId))
        .returning();

      return NextResponse.json({ room: updatedRoom });
    }

    // Client can only update their note (with valid access key)
    if (accessKey && existingRoom.accessKey === accessKey) {
      if (!existingRoom.isActive) {
        return NextResponse.json(
          { error: "This chat room is no longer active" },
          { status: 403 }
        );
      }

      const { clientNote } = body;

      const [updatedRoom] = await db
        .update(chatRooms)
        .set({
          clientNote,
          updatedAt: new Date(),
        })
        .where(eq(chatRooms.id, roomId))
        .returning();

      // Don't expose the accessKey
      const { accessKey: _, ...safeRoom } = updatedRoom;
      return NextResponse.json({ room: safeRoom });
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { error: "Failed to update room" },
      { status: 500 }
    );
  }
}

// DELETE - Delete room (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { roomId } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.delete(chatRooms).where(eq(chatRooms.id, roomId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 }
    );
  }
}
