import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { issues } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { IssuesClient } from "./issues-client";

export default async function IssuesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const tab =
    typeof searchParams.tab === "string" ? searchParams.tab : undefined;

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

  return (
    <div className="container px-4 md:px-8 py-10 mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
        <p className="text-muted-foreground">
          View and manage all your issues in one place.
        </p>
      </div>

      <IssuesClient
        role={role}
        activeTab={tab}
        issuesData={{
          client: submittedIssues,
          developer: developerIssues,
          openIssues: openIssues,
        }}
      />
    </div>
  );
}
