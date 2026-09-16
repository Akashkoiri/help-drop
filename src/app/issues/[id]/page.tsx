import { db } from "@/db";
import { issues, issueRemarks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { IssueClient } from "./issue-client";

export default async function IssueDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const issueId = params.id;

  const issue = await db.query.issues.findFirst({
    where: eq(issues.id, issueId),
  });

  if (!issue) return notFound();

  const remarks = await db.query.issueRemarks.findMany({
    where: eq(issueRemarks.issueId, issueId),
    orderBy: [desc(issueRemarks.createdAt)],
  });

  // Fetch usernames for display (this can be optimized but works for now)
  const client = await clerkClient();
  const allUserIds = Array.from(
    new Set(
      [
        issue.clientId,
        issue.developerId,
        ...remarks.map((r) => r.userId),
      ].filter(Boolean) as string[],
    ),
  );

  const userMap: Record<string, string> = {};

  if (allUserIds.length > 0) {
    try {
      const users = await client.users.getUserList({ userId: allUserIds });
      users.data.forEach((u) => {
        userMap[u.id] = u.firstName
          ? `${u.firstName} ${u.lastName || ""}`.trim()
          : u.emailAddresses[0]?.emailAddress || "Unknown User";
      });
    } catch (e) {
      console.error("Failed to fetch clerk users", e);
    }
  }

  const isClient = userId === issue.clientId;
  const isDeveloper = userId === issue.developerId;
  const canSolve = !issue.developerId && !isClient;

  return (
    <div className="relative min-h-full">
      <div className="container px-4 md:px-8 max-w-6xl pt-16 md:pt-24 pb-10 mx-auto">
        <IssueClient
          issue={issue}
          remarks={remarks}
          userMap={userMap}
          isClient={isClient}
          isDeveloper={isDeveloper}
          canSolve={canSolve}
        />
      </div>
    </div>
  );
}
