import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { issues } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = user.publicMetadata.role as "client" | "developer" | undefined;

  if (!role) {
    redirect("/onboarding");
  }

  // Fetch metrics for client
  const submittedIssues = await db.query.issues.findMany({
    where: eq(issues.clientId, userId),
  });

  // Fetch metrics for developer
  const developerIssues = await db.query.issues.findMany({
    where: eq(issues.developerId, userId),
  });

  // Open issues available to solve
  const openIssues = await db.query.issues.findMany({
    where: and(isNull(issues.developerId), eq(issues.status, "pending")),
  });

  // Calculate Client Metrics
  const submittedTotal = submittedIssues.length;
  const submittedResolved = submittedIssues.filter(
    (i) => i.status === "resolved",
  ).length;
  const submittedPending = submittedIssues.filter(
    (i) => i.status === "pending",
  ).length;
  const submittedOverdue = submittedIssues.filter((i) => {
    return (
      i.status !== "resolved" && i.deadline && new Date(i.deadline) < new Date()
    );
  }).length;
  const submittedDoneBeforeDeadline = submittedIssues.filter((i) => {
    return (
      i.status === "resolved" &&
      i.deadline &&
      i.resolvedAt &&
      new Date(i.resolvedAt) <= new Date(i.deadline)
    );
  }).length;

  // Calculate Developer Metrics
  const developerTotal = developerIssues.length;
  const developerPending = developerIssues.filter(
    (i) => i.status === "pending",
  ).length;
  const developerResolved = developerIssues.filter(
    (i) => i.status === "resolved",
  ).length;
  const developerDoneBeforeDeadline = developerIssues.filter((i) => {
    return (
      i.status === "resolved" &&
      i.deadline &&
      i.resolvedAt &&
      new Date(i.resolvedAt) <= new Date(i.deadline)
    );
  }).length;
  const developerOverdue = developerIssues.filter((i) => {
    return (
      i.status !== "resolved" && i.deadline && new Date(i.deadline) < new Date()
    );
  }).length;

  return (
    <div className="container px-4 md:px-8 py-10 mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your submitted issues and help resolve others.
        </p>
      </div>

      <DashboardClient
        role={role}
        metrics={{
          client: {
            total: submittedTotal,
            resolved: submittedResolved,
            pending: submittedPending,
            overdue: submittedOverdue,
            doneBeforeDeadline: submittedDoneBeforeDeadline,
            issues: submittedIssues,
          },
          developer: {
            total: developerTotal,
            resolved: developerResolved,
            pending: developerPending,
            overdue: developerOverdue,
            doneBeforeDeadline: developerDoneBeforeDeadline,
            issues: developerIssues,
          },
          openIssues: openIssues,
        }}
      />
    </div>
  );
}
