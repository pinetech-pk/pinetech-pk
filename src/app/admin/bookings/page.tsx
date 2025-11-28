"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Calendar,
  Clock,
  Phone,
  Video,
  MessageCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";

interface Booking {
  id: number;
  submissionId: number | null;
  name: string;
  email: string;
  phone: string;
  bookingDate: string;
  timeSlot: "morning" | "evening";
  callType: "voice" | "video";
  preferredTool: "phone" | "whatsapp" | "zoom";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string | null;
  createdAt: string;
}

const statusColors = {
  pending: "bg-yellow-900/50 text-yellow-400 border-yellow-800",
  confirmed: "bg-blue-900/50 text-blue-400 border-blue-800",
  completed: "bg-green-900/50 text-green-400 border-green-800",
  cancelled: "bg-red-900/50 text-red-400 border-red-800",
};

const toolIcons = {
  phone: Phone,
  whatsapp: MessageCircle,
  zoom: Video,
};

export default function AdminBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/bookings");
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
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
    fetchBookings();
  }, [session, status, router, fetchBookings]);

  // Update booking status
  const updateStatus = async (bookingId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update booking");
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  // Delete booking
  const deleteBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete booking");
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  // Filter bookings
  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  // Group bookings by date
  const groupedBookings = filteredBookings.reduce((acc, booking) => {
    const date = booking.bookingDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedBookings).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

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
              <h1 className="text-2xl font-bold">Consultation Bookings</h1>
              <p className="text-zinc-400 text-sm">
                Manage scheduled consultation calls
              </p>
            </div>
          </div>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize whitespace-nowrap ${
                filter === f
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {f === "all" ? "All Bookings" : f}
              {f !== "all" && (
                <span className="ml-2 opacity-60">
                  ({bookings.filter((b) => b.status === f).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
            <div className="text-2xl font-bold">{bookings.length}</div>
            <div className="text-sm text-zinc-400">Total Bookings</div>
          </div>
          <div className="bg-zinc-900 rounded-lg border border-yellow-800/50 p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {bookings.filter((b) => b.status === "pending").length}
            </div>
            <div className="text-sm text-zinc-400">Pending</div>
          </div>
          <div className="bg-zinc-900 rounded-lg border border-blue-800/50 p-4">
            <div className="text-2xl font-bold text-blue-400">
              {bookings.filter((b) => b.status === "confirmed").length}
            </div>
            <div className="text-sm text-zinc-400">Confirmed</div>
          </div>
          <div className="bg-zinc-900 rounded-lg border border-green-800/50 p-4">
            <div className="text-2xl font-bold text-green-400">
              {bookings.filter((b) => b.status === "completed").length}
            </div>
            <div className="text-sm text-zinc-400">Completed</div>
          </div>
        </div>

        {/* Bookings list */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-400 mb-2">
              No bookings found
            </h3>
            <p className="text-zinc-500 text-sm">
              {filter === "all"
                ? "No consultation bookings yet"
                : `No ${filter} bookings`}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map((dateStr) => {
              const date = new Date(dateStr + "T00:00:00");
              const isToday = new Date().toDateString() === date.toDateString();
              const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

              return (
                <div key={dateStr}>
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-semibold">
                      {date.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </h3>
                    {isToday && (
                      <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded">
                        Today
                      </span>
                    )}
                    {isPast && !isToday && (
                      <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
                        Past
                      </span>
                    )}
                  </div>

                  <div className="grid gap-4">
                    {groupedBookings[dateStr]
                      .sort((a, b) =>
                        a.timeSlot === "morning" ? -1 : 1
                      )
                      .map((booking) => {
                        const ToolIcon = toolIcons[booking.preferredTool];

                        return (
                          <div
                            key={booking.id}
                            className={`bg-zinc-900 rounded-lg border p-4 ${
                              booking.status === "cancelled"
                                ? "border-red-900/50 opacity-60"
                                : "border-zinc-800"
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              {/* Time and type */}
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  {booking.timeSlot === "morning" ? (
                                    <Sun className="w-5 h-5 text-amber-400" />
                                  ) : (
                                    <Moon className="w-5 h-5 text-indigo-400" />
                                  )}
                                  <div>
                                    <div className="font-medium">
                                      {booking.timeSlot === "morning"
                                        ? "10:30 AM"
                                        : "8:00 PM"}
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                      30 min
                                    </div>
                                  </div>
                                </div>

                                <div className="h-8 w-px bg-zinc-700" />

                                <div className="flex items-center gap-2">
                                  <ToolIcon className="w-4 h-4 text-zinc-400" />
                                  <span className="text-sm text-zinc-400 capitalize">
                                    {booking.preferredTool}
                                  </span>
                                  <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded capitalize">
                                    {booking.callType}
                                  </span>
                                </div>
                              </div>

                              {/* Client info */}
                              <div className="flex-1">
                                <div className="font-medium">{booking.name}</div>
                                <div className="text-sm text-zinc-400">
                                  {booking.email} • {booking.phone}
                                </div>
                                {booking.notes && (
                                  <div className="text-xs text-zinc-500 mt-1">
                                    Note: {booking.notes}
                                  </div>
                                )}
                              </div>

                              {/* Status and actions */}
                              <div className="flex items-center gap-2">
                                <select
                                  value={booking.status}
                                  onChange={(e) =>
                                    updateStatus(booking.id, e.target.value)
                                  }
                                  className={`px-3 py-1.5 rounded border text-sm font-medium ${
                                    statusColors[booking.status]
                                  } bg-transparent cursor-pointer`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>

                                <button
                                  onClick={() => deleteBooking(booking.id)}
                                  className="p-2 bg-zinc-800 hover:bg-red-900/50 rounded transition-colors"
                                  title="Delete booking"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </div>

                            {/* Quick actions for pending */}
                            {booking.status === "pending" && (
                              <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-800">
                                <button
                                  onClick={() =>
                                    updateStatus(booking.id, "confirmed")
                                  }
                                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Confirm
                                </button>
                                <button
                                  onClick={() =>
                                    updateStatus(booking.id, "cancelled")
                                  }
                                  className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-red-900/50 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 bg-zinc-900/50 rounded-lg border border-zinc-800 p-4">
          <h4 className="font-medium mb-3 text-zinc-300">Time Slots (PKT)</h4>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Morning: 10:30 AM - 11:00 AM</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Evening: 8:00 PM - 8:30 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
