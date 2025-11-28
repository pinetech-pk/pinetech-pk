"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw, Lock, Edit3, Save, X, AlertTriangle } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";

interface ChatRoom {
  id: string;
  title: string;
  description: string | null;
  adminNote: string | null;
  clientNote: string | null;
  isActive: boolean;
}

export default function ClientChatRoom({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const searchParams = useSearchParams();
  const accessKey = searchParams.get("key");

  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedNote, setEditedNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Fetch room data
  const fetchRoom = useCallback(async () => {
    if (!accessKey) {
      setError("Access key is required");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/chat/rooms/${roomId}?key=${accessKey}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Access denied");
      }

      const data = await response.json();
      setRoom(data.room);
      setEditedNote(data.room.clientNote || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [roomId, accessKey]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  // Save client note
  const saveClientNote = async () => {
    if (!room || !accessKey) return;

    setIsSavingNote(true);
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}?key=${accessKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientNote: editedNote }),
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-zinc-400 mb-4">{error}</p>
          <p className="text-zinc-500 text-sm">
            Please check your link or contact the admin for a valid access link.
          </p>
        </div>
      </div>
    );
  }

  if (!room || !accessKey) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">{room.title}</h1>
          {room.description && (
            <p className="text-zinc-400 text-sm mt-1">{room.description}</p>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 flex flex-col gap-4">
        {/* Notes section */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Admin Note */}
          {room.adminNote && (
            <div className="bg-emerald-900/20 rounded-lg border border-emerald-800/50 p-4">
              <h3 className="font-medium text-sm text-emerald-400 mb-2">
                📌 Pinned Message from Admin
              </h3>
              <p className="text-emerald-100 text-sm whitespace-pre-wrap">
                {room.adminNote}
              </p>
            </div>
          )}

          {/* Client Note */}
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm text-zinc-400">
                📝 Your Note
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
                  placeholder="Add a note for the admin (e.g., your availability, questions, etc.)"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 h-20 resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setIsEditingNote(false);
                      setEditedNote(room.clientNote || "");
                    }}
                    className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={saveClientNote}
                    disabled={isSavingNote}
                    className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 rounded transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-blue-400 text-sm">
                {room.clientNote || (
                  <span className="text-zinc-600 italic">
                    No note yet. Click edit to add one.
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Security notice */}
        <div className="bg-amber-900/20 rounded-lg border border-amber-800/30 p-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-amber-200 font-medium">Secure Chat Session</p>
            <p className="text-amber-400/70">
              Messages in this chat are not stored anywhere and will disappear
              when you close or refresh this page. Only pinned notes are saved.
            </p>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 min-h-[400px]">
          <ChatInterface roomId={roomId} role="client" accessKey={accessKey} />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 px-4 py-3 text-center text-zinc-600 text-xs">
        Secure chat powered by PineTech
      </div>
    </div>
  );
}
