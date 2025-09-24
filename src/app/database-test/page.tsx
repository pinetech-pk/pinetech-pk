import { DatabaseTest } from "@/components/database-test";

export default function DatabaseTestPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Database Connection Test</h1>
          <p className="text-muted-foreground">
            Testing Neon PostgreSQL integration with Next.js
          </p>
        </div>

        <DatabaseTest />

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            This page will be removed after database verification
          </p>
        </div>
      </div>
    </div>
  );
}
