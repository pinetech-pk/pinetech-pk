"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "developer" | "investor" | "entrepreneur"
  >("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user-submissions");
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
    setLoading(false);
  };

  const filteredSubmissions =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.userType === filter);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="pt-20 pb-10">
        <section className="py-10">
          <div className="container px-4">
            <div className="max-w-6xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  View and manage user journey submissions
                </p>
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

              {/* Filters */}
              <div className="flex gap-2 mb-6">
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
                  {submissions.filter((s) => s.userType === "developer").length}
                  )
                </Button>
                <Button
                  variant={filter === "investor" ? "pine" : "outline"}
                  onClick={() => setFilter("investor")}
                  size="sm"
                >
                  Investors (
                  {submissions.filter((s) => s.userType === "investor").length})
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

              {/* Submissions List */}
              {loading ? (
                <div className="text-center py-12">
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
