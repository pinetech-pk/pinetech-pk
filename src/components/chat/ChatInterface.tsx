"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PresenceChannel } from "pusher-js";
import {
  createPusherClient,
  getChannelName,
  CHAT_EVENTS,
  ChatMessage,
  PresenceMember,
} from "@/lib/pusher/client";
import { Send, Loader2 } from "lucide-react";

// Web Audio API for notification sound (no external file needed)
const createNotificationSound = () => {
  if (typeof window === "undefined") return null;

  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    return () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };
  } catch {
    return null;
  }
};

interface ChatInterfaceProps {
  roomId: string;
  role: "admin" | "client";
  accessKey?: string;
}

export default function ChatInterface({
  roomId,
  role,
  accessKey,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const channelRef = useRef<PresenceChannel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playNotificationRef = useRef<(() => void) | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Initialize notification sound
  useEffect(() => {
    playNotificationRef.current = createNotificationSound();
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (playNotificationRef.current) {
      try {
        playNotificationRef.current();
      } catch {
        // Ignore audio errors
      }
    }
  }, []);

  // Connect to Pusher channel
  useEffect(() => {
    // Create Pusher client with access key for auth
    const pusher = createPusherClient(accessKey);

    const channelName = getChannelName(roomId);
    const channel = pusher.subscribe(channelName) as PresenceChannel;
    channelRef.current = channel;

    // Connection events
    channel.bind("pusher:subscription_succeeded", (members: { count: number; members: Record<string, { role: string }> }) => {
      setIsConnected(true);
      // Check if other user is already online
      const otherRole = role === "admin" ? "client" : "admin";
      const hasOtherUser = Object.values(members.members).some(
        (m) => m.role === otherRole
      );
      setOtherUserOnline(hasOtherUser);
    });

    channel.bind("pusher:member_added", (member: PresenceMember) => {
      const otherRole = role === "admin" ? "client" : "admin";
      if (member.info.role === otherRole) {
        setOtherUserOnline(true);
        playNotificationSound();
      }
    });

    channel.bind("pusher:member_removed", (member: PresenceMember) => {
      const otherRole = role === "admin" ? "client" : "admin";
      if (member.info.role === otherRole) {
        setOtherUserOnline(false);
        setOtherUserTyping(false);
      }
    });

    // Message events
    channel.bind(CHAT_EVENTS.MESSAGE, (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
      // Play sound for incoming messages from other user
      if (message.sender !== role) {
        playNotificationSound();
      }
      setTimeout(scrollToBottom, 100);
    });

    // Typing events (client events - start with "client-")
    channel.bind(CHAT_EVENTS.TYPING_START, (data: { role: string }) => {
      if (data.role !== role) {
        setOtherUserTyping(true);
      }
    });

    channel.bind(CHAT_EVENTS.TYPING_STOP, (data: { role: string }) => {
      if (data.role !== role) {
        setOtherUserTyping(false);
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [roomId, role, accessKey, playNotificationSound, scrollToBottom]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.trigger(CHAT_EVENTS.TYPING_START, { role });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of no input
      typingTimeoutRef.current = setTimeout(() => {
        if (channelRef.current) {
          channelRef.current.trigger(CHAT_EVENTS.TYPING_STOP, { role });
        }
      }, 2000);
    }
  }, [role]);

  // Send message
  const sendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);

    try {
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          message: inputValue.trim(),
          accessKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setInputValue("");

      // Stop typing indicator
      if (channelRef.current) {
        channelRef.current.trigger(CHAT_EVENTS.TYPING_STOP, { role });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const otherRoleLabel = role === "admin" ? "Client" : "Admin";

  return (
    <div className="flex h-full flex-col bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
      {/* Connection status bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-yellow-500 animate-pulse"
            }`}
          />
          <span className="text-sm text-zinc-400">
            {isConnected ? "Connected" : "Connecting..."}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              otherUserOnline ? "bg-green-500" : "bg-zinc-600"
            }`}
          />
          <span className="text-sm text-zinc-400">
            {otherRoleLabel}: {otherUserOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === role ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === role
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-700 text-zinc-100"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === role
                      ? "text-emerald-200"
                      : "text-zinc-400"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-700 rounded-lg px-4 py-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <span className="text-xs text-zinc-400 ml-2">
                  {otherRoleLabel} is typing...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Warning banner */}
      <div className="px-4 py-2 bg-amber-900/30 border-t border-amber-800/50">
        <p className="text-xs text-amber-400 text-center">
          Messages are not saved. They will disappear when you close or refresh
          this page.
        </p>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-zinc-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            disabled={!isConnected || isSending}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || !isConnected || isSending}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
