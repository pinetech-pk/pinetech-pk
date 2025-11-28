import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatRooms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { pusherServer } from "@/lib/pusher/server";

// POST - Authenticate Pusher channel subscription
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const socketId = formData.get("socket_id") as string;
    const channelName = formData.get("channel_name") as string;

    if (!socketId || !channelName) {
      return NextResponse.json(
        { error: "Missing socket_id or channel_name" },
        { status: 400 }
      );
    }

    // Extract roomId from channel name (format: presence-chat-{roomId})
    const roomIdMatch = channelName.match(/^presence-chat-(.+)$/);
    if (!roomIdMatch) {
      return NextResponse.json(
        { error: "Invalid channel name" },
        { status: 400 }
      );
    }
    const roomId = roomIdMatch[1];

    // Check authorization
    const session = await getServerSession(authOptions);

    // Get accessKey from custom header (set by client)
    const accessKey = request.headers.get("x-access-key");

    let role: "admin" | "client";
    let userId: string;

    if (session) {
      role = "admin";
      userId = "admin";
    } else if (accessKey) {
      // Verify client access
      const [room] = await db
        .select()
        .from(chatRooms)
        .where(eq(chatRooms.id, roomId));

      if (!room || room.accessKey !== accessKey || !room.isActive) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      role = "client";
      userId = `client-${accessKey.substring(0, 8)}`;
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Authorize presence channel with user data
    const presenceData = {
      user_id: userId,
      user_info: {
        role,
      },
    };

    const authResponse = pusherServer.authorizeChannel(
      socketId,
      channelName,
      presenceData
    );

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
