import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { issues } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const deadlineString = formData.get("deadline") as string;
    const documentsString = formData.get("documents") as string;

    const documents = documentsString ? JSON.parse(documentsString) : [];
    const deadline = deadlineString ? new Date(deadlineString) : null;

    const [issue] = await db.insert(issues).values({
      title,
      description,
      deadline,
      documents,
      clientId: userId,
    }).returning();

    return NextResponse.json(issue);
  } catch (error) {
    console.error("[ISSUES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
