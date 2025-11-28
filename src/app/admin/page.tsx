"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2, RefreshCw } from "lucide-react";

// Define step response types
type StepResponses = {
  step1?: Record<string, unknown>;
  step2?: Record<string, unknown>;
  step3?: Record<string, unknown>;
  step4?: Record<string, unknown>;
  [key: string]: unknown;
};

interface Submission {
  id: number;
  userType: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  stepResponses: StepResponses;
  submissionType: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "developer" | "investor" | "entrepreneur"
  >("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user-submissions");
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else if (response.status === 401) {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchSubmissions();
    }
  }, [status, fetchSubmissions]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  const filteredSubmissions =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.userType === filter);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-pine-600" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="pt-20 pb-10">
        <section className="py-10">
          <div className="container px-4">
            <div className="max-w-6xl mx-auto">
              {/* Page Header with Auth Info */}
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                  <p className="text-muted-foreground">
                    View and manage user journey submissions
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">
                      {session?.user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Administrator
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-pine-600">
                      {submissions.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Submissions
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-blue-600">
                      {
                        submissions.filter((s) => s.userType === "developer")
                          .length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Developers
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-green-600">
                      {
                        submissions.filter((s) => s.userType === "investor")
                          .length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Investors
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-purple-600">
                      {
                        submissions.filter((s) => s.userType === "entrepreneur")
                          .length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Entrepreneurs
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Refresh */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filter === "all" ? "pine" : "outline"}
                    onClick={() => setFilter("all")}
                    size="sm"
                  >
                    All ({submissions.length})
                  </Button>
                  <Button
                    variant={filter === "developer" ? "pine" : "outline"}
                    onClick={() => setFilter("developer")}
                    size="sm"
                  >
                    Developers (
                    {
                      submissions.filter((s) => s.userType === "developer")
                        .length
                    }
                    )
                  </Button>
                  <Button
                    variant={filter === "investor" ? "pine" : "outline"}
                    onClick={() => setFilter("investor")}
                    size="sm"
                  >
                    Investors (
                    {
                      submissions.filter((s) => s.userType === "investor")
                        .length
                    }
                    )
                  </Button>
                  <Button
                    variant={filter === "entrepreneur" ? "pine" : "outline"}
                    onClick={() => setFilter("entrepreneur")}
                    size="sm"
                  >
                    Entrepreneurs (
                    {
                      submissions.filter((s) => s.userType === "entrepreneur")
                        .length
                    }
                    )
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchSubmissions}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>

              {/* Submissions List */}
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-pine-600 mx-auto mb-4" />
                  <div className="text-muted-foreground">
                    Loading submissions...
                  </div>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="text-muted-foreground">
                      No submissions found
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredSubmissions.map((submission) => (
                    <Card key={submission.id} className="overflow-hidden">
                      <CardHeader
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleExpand(submission.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-lg">
                                {submission.name}
                              </CardTitle>
                              <Badge
                                variant={
                                  submission.userType === "developer"
                                    ? "default"
                                    : submission.userType === "investor"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {submission.userType}
                              </Badge>
                              <Badge variant="outline">
                                {submission.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>📧 {submission.email}</div>
                              {submission.phone && (
                                <div>📱 {submission.phone}</div>
                              )}
                              <div className="text-xs">
                                🕐{" "}
                                {new Date(
                                  submission.createdAt
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            {expandedId === submission.id ? "▼" : "▶"}
                          </Button>
                        </div>
                      </CardHeader>

                      {expandedId === submission.id && (
                        <CardContent className="border-t bg-muted/20 p-6">
                          {submission.message && (
                            <div className="mb-4">
                              <div className="font-semibold mb-1">Message:</div>
                              <div className="text-sm text-muted-foreground">
                                {submission.message}
                              </div>
                            </div>
                          )}

                          <div className="mb-4">
                            <div className="font-semibold mb-2">
                              Journey Responses:
                            </div>
                            <div className="bg-background p-4 rounded-lg">
                              <pre className="text-xs overflow-x-auto">
                                {JSON.stringify(
                                  submission.stepResponses,
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            <div>
                              Submission Type: {submission.submissionType}
                            </div>
                            <div>ID: #{submission.id}</div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
