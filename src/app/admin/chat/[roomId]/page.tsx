"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Edit3, Save, X } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";

interface ChatRoom {
  id: string;
  title: string;
  description: string | null;
  adminNote: string | null;
  clientNote: string | null;
  accessKey: string;
  isActive: boolean;
}

export default function AdminChatRoom({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedNote, setEditedNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Fetch room data
  const fetchRoom = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat/rooms/${roomId}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch room");
      }

      const data = await response.json();
      setRoom(data.room);
      setEditedNote(data.room.adminNote || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
      return;
    }
    fetchRoom();
  }, [session, status, router, fetchRoom]);

  // Save admin note
  const saveAdminNote = async () => {
    if (!room) return;

    setIsSavingNote(true);
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: editedNote }),
      });

      if (!response.ok) throw new Error("Failed to save note");

      const data = await response.json();
      setRoom(data.room);
      setIsEditingNote(false);
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note");
    } finally {
      setIsSavingNote(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            href="/admin/chat"
            className="text-emerald-500 hover:underline"
          >
            ← Back to rooms
          </Link>
        </div>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/chat"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold">{room.title}</h1>
              {room.description && (
                <p className="text-zinc-500 text-sm">{room.description}</p>
              )}
            </div>
          </div>
          <div
            className={`text-xs px-2 py-1 rounded ${
              room.isActive
                ? "bg-emerald-900/50 text-emerald-400"
                : "bg-red-900/50 text-red-400"
            }`}
          >
            {room.isActive ? "Active" : "Disabled"}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 flex flex-col lg:flex-row gap-4">
        {/* Sidebar - Notes */}
        <div className="lg:w-80 space-y-4 shrink-0">
          {/* Admin Note */}
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm text-zinc-400">
                Your Pinned Note
              </h3>
              {!isEditingNote && (
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>

            {isEditingNote ? (
              <div className="space-y-2">
                <textarea
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                  placeholder="Add a note that will always be visible to the client..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 h-24 resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setIsEditingNote(false);
                      setEditedNote(room.adminNote || "");
                    }}
                    className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={saveAdminNote}
                    disabled={isSavingNote}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700 rounded transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-emerald-400 text-sm">
                {room.adminNote || (
                  <span className="text-zinc-600 italic">
                    No note set. Click edit to add one.
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Client Note */}
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
            <h3 className="font-medium text-sm text-zinc-400 mb-2">
              Client&apos;s Note
            </h3>
            <p className="text-blue-400 text-sm">
              {room.clientNote || (
                <span className="text-zinc-600 italic">
                  No note from client yet.
                </span>
              )}
            </p>
          </div>

          {/* Quick info */}
          <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-4 text-xs text-zinc-500">
            <p>💡 Pinned notes are saved permanently.</p>
            <p className="mt-1">
              💬 Chat messages are ephemeral and not stored.
            </p>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 min-h-[500px] lg:min-h-0">
          <ChatInterface roomId={roomId} role="admin" />
        </div>
      </div>
    </div>
  );
}
