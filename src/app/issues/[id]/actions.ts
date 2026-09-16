"use server";

import { db } from "@/db";
import { issues, issueRemarks } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addRemark(issueId: string, remarkText: string, documents: string[]) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.insert(issueRemarks).values({
    issueId,
    userId,
    remark: remarkText,
    documents,
  });

  revalidatePath(`/issues/${issueId}`);
}

export async function startSolving(issueId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.update(issues).set({ developerId: userId }).where(eq(issues.id, issueId));
  revalidatePath(`/issues/${issueId}`);
}

export async function markResolved(issueId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Optional: check if the user is the developer or client
  await db.update(issues).set({ 
    status: "resolved", 
    resolvedAt: new Date() 
  }).where(eq(issues.id, issueId));

  revalidatePath(`/issues/${issueId}`);
}

export async function closeIssue(issueId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.update(issues).set({ 
    status: "closed"
  }).where(eq(issues.id, issueId));

  revalidatePath(`/issues/${issueId}`);
}

export async function deleteIssue(issueId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.delete(issues).where(eq(issues.id, issueId));

  revalidatePath("/dashboard");
}
