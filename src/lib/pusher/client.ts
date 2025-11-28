import PusherClient from "pusher-js";

// Create Pusher client with optional access key for auth
export const createPusherClient = (accessKey?: string) => {
  return new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: "/api/pusher/auth",
    auth: {
      headers: accessKey ? { "x-access-key": accessKey } : {},
    },
  });
};

// Channel naming conventions (same as server)
export const getChannelName = (roomId: string) => `presence-chat-${roomId}`;

// Event types (same as server)
export const CHAT_EVENTS = {
  MESSAGE: "chat-message",
  TYPING_START: "client-typing-start",
  TYPING_STOP: "client-typing-stop",
  NOTE_UPDATED: "note-updated",
} as const;

// Message type
export interface ChatMessage {
  id: string;
  content: string;
  sender: "admin" | "client";
  timestamp: number;
}

// Presence member type
export interface PresenceMember {
  id: string;
  info: {
    role: "admin" | "client";
  };
}
