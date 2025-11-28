import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatRooms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { pusherServer, getChannelName, CHAT_EVENTS } from "@/lib/pusher/server";

// POST - Send a message (ephemeral - goes through Pusher, NOT stored in DB)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, message, accessKey } = body;

    if (!roomId || !message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Room ID and message are required" },
        { status: 400 }
      );
    }

    // Verify access
    const session = await getServerSession(authOptions);
    let sender: "admin" | "client";

    if (session) {
      sender = "admin";
    } else if (accessKey) {
      // Verify client access
      const [room] = await db
        .select()
        .from(chatRooms)
        .where(eq(chatRooms.id, roomId));

      if (!room || room.accessKey !== accessKey || !room.isActive) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      sender = "client";
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create message object (NOT stored in database!)
    const chatMessage = {
      id: crypto.randomUUID(),
      content: message.trim(),
      sender,
      timestamp: Date.now(),
    };

    // Send through Pusher (ephemeral - only received by connected clients)
    await pusherServer.trigger(
      getChannelName(roomId),
      CHAT_EVENTS.MESSAGE,
      chatMessage
    );

    return NextResponse.json({ success: true, message: chatMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
