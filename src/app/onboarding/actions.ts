"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function setRole(role: "client" | "developer") {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
    },
  });
}
