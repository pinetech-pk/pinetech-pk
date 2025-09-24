"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TestRecord {
  id: number;
  name: string;
  email: string;
  message: string | null;
  createdAt: string;
}

export function DatabaseTest() {
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  // Fetch all records
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-db");
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
        setMessage("Records fetched successfully");
      } else {
        setMessage("Error fetching records");
      }
    } catch (error) {
      setMessage("Network error");
    }
    setLoading(false);
  };

  // Create test record
  const createTestRecord = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "test@pinetech.pk",
          message: "Database connection test - " + new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setMessage("Record created successfully");
        fetchRecords(); // Refresh list
      } else {
        setMessage("Error creating record");
      }
    } catch (error) {
      setMessage("Network error");
    }
    setLoading(false);
  };

  // Delete record
  const deleteRecord = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/test-db?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Record deleted successfully");
        fetchRecords(); // Refresh list
      } else {
        setMessage("Error deleting record");
      }
    } catch (error) {
      setMessage("Network error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Database Connection Test
          <Badge variant={records.length > 0 ? "default" : "secondary"}>
            {records.length > 0 ? "Connected" : "Testing"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status message */}
        {message && (
          <div className="p-3 bg-muted rounded-lg text-sm">{message}</div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button onClick={createTestRecord} disabled={loading} variant="pine">
            Create Test Record
          </Button>
          <Button onClick={fetchRecords} disabled={loading} variant="outline">
            Refresh Records
          </Button>
        </div>

        {/* Records list */}
        <div className="space-y-2">
          <h4 className="font-medium">Test Records ({records.length})</h4>
          {loading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading...
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No records found
            </div>
          ) : (
            <div className="space-y-2">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">
                      {record.name} ({record.email})
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {record.message}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(record.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteRecord(record.id)}
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
// This component provides a UI to test database connectivity by creating, fetching, and deleting test records.
