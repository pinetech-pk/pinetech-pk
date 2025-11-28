import Pusher from "pusher";

// Server-side Pusher instance (for triggering events)
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Channel naming conventions
export const getChannelName = (roomId: string) => `presence-chat-${roomId}`;

// Event types
export const CHAT_EVENTS = {
  MESSAGE: "chat-message",
  TYPING_START: "client-typing-start",
  TYPING_STOP: "client-typing-stop",
  NOTE_UPDATED: "note-updated",
} as const;
