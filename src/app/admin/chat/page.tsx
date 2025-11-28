"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  MessageSquare,
  Copy,
  Trash2,
  ExternalLink,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
} from "lucide-react";

interface ChatRoom {
  id: string;
  title: string;
  description: string | null;
  adminNote: string | null;
  clientNote: string | null;
  accessKey: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminChatDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoom, setNewRoom] = useState({
    title: "",
    description: "",
    adminNote: "",
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chat/rooms");
      if (!response.ok) throw new Error("Failed to fetch rooms");
      const data = await response.json();
      setRooms(data.rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
      return;
    }
    fetchRooms();
  }, [session, status, router, fetchRooms]);

  // Create room
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.title.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });

      if (!response.ok) throw new Error("Failed to create room");

      setNewRoom({ title: "", description: "", adminNote: "" });
      setShowCreateForm(false);
      fetchRooms();
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room");
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle room active status
  const toggleRoomStatus = async (roomId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update room");
      fetchRooms();
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  // Delete room
  const deleteRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this chat room?")) return;

    try {
      const response = await fetch(`/api/chat/rooms/${roomId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete room");
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  // Copy client link
  const copyClientLink = async (room: ChatRoom) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/chat/${room.id}?key=${room.accessKey}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(room.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Secure Chat Rooms</h1>
              <p className="text-zinc-400 text-sm">
                Manage private chat rooms with your clients
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchRooms}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Room
            </button>
          </div>
        </div>

        {/* Create Room Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-lg p-6 max-w-md w-full border border-zinc-800">
              <h2 className="text-xl font-bold mb-4">Create New Chat Room</h2>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">
                    Room Title *
                  </label>
                  <input
                    type="text"
                    value={newRoom.title}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, title: e.target.value })
                    }
                    placeholder="e.g., Client ABC Project"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newRoom.description}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, description: e.target.value })
                    }
                    placeholder="Brief description of this chat room"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">
                    Pinned Note (Always visible to client)
                  </label>
                  <textarea
                    value={newRoom.adminNote}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, adminNote: e.target.value })
                    }
                    placeholder="e.g., Available on Wednesday at 3:30 PM PKT"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 h-20 resize-none"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !newRoom.title.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700 rounded-lg transition-colors"
                  >
                    {isCreating ? "Creating..." : "Create Room"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rooms List */}
        {rooms.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-400 mb-2">
              No chat rooms yet
            </h3>
            <p className="text-zinc-500 text-sm mb-4">
              Create your first secure chat room to start communicating with
              clients
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create First Room
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`bg-zinc-900 rounded-lg border p-4 ${
                  room.isActive ? "border-zinc-800" : "border-red-900/50 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{room.title}</h3>
                      {!room.isActive && (
                        <span className="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded">
                          Disabled
                        </span>
                      )}
                    </div>
                    {room.description && (
                      <p className="text-zinc-400 text-sm mb-2">
                        {room.description}
                      </p>
                    )}
                    {room.adminNote && (
                      <p className="text-emerald-400 text-sm">
                        📌 {room.adminNote}
                      </p>
                    )}
                    {room.clientNote && (
                      <p className="text-blue-400 text-sm">
                        💬 Client: {room.clientNote}
                      </p>
                    )}
                    <p className="text-zinc-600 text-xs mt-2">
                      Created:{" "}
                      {new Date(room.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyClientLink(room)}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors group relative"
                      title="Copy client link"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedId === room.id && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-xs px-2 py-1 rounded whitespace-nowrap">
                          Copied!
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => toggleRoomStatus(room.id, room.isActive)}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                      title={room.isActive ? "Disable room" : "Enable room"}
                    >
                      {room.isActive ? (
                        <ToggleRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-zinc-500" />
                      )}
                    </button>

                    <button
                      onClick={() => deleteRoom(room.id)}
                      className="p-2 bg-zinc-800 hover:bg-red-900/50 rounded-lg transition-colors"
                      title="Delete room"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>

                    <Link
                      href={`/admin/chat/${room.id}`}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Enter
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info card */}
        <div className="mt-8 bg-zinc-900/50 rounded-lg border border-zinc-800 p-4">
          <h4 className="font-medium mb-2 text-zinc-300">How it works:</h4>
          <ul className="text-sm text-zinc-500 space-y-1">
            <li>
              • Create a room for each client with a title and optional pinned
              note
            </li>
            <li>
              • Click &quot;Copy Link&quot; to get the secure URL for your
              client
            </li>
            <li>
              • Messages are ephemeral - they disappear when you close the page
            </li>
            <li>• Only pinned notes are saved permanently in the database</li>
            <li>• Disable a room to prevent client access without deleting it</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
