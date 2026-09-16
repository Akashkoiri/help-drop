"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { RaiseIssueDialog } from "@/components/raise-issue-dialog";
import { InferSelectModel } from "drizzle-orm";
import { issues } from "@/db/schema";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type IssueType = InferSelectModel<typeof issues>;

interface IssuesData {
  client: IssueType[];
  developer: IssueType[];
  openIssues: IssueType[];
}

function IssueList({
  issues,
  emptyMessage,
}: {
  issues: IssueType[];
  emptyMessage: string;
  title?: string;
}) {
  return (
    <div className="pt-2">
      {issues.length === 0 ? (
        <p className="text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="w-[100px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">{issue.title}</TableCell>
                  <TableCell className="capitalize">{issue.status}</TableCell>
                  <TableCell>
                    {issue.deadline
                      ? format(new Date(issue.deadline), "PPp")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/issues/${issue.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

import { CircleDashed, Clock, CheckCircle2, XCircle } from "lucide-react";

export function IssuesClient({
  issuesData,
  role,
  activeTab,
}: {
  issuesData: IssuesData;
  role: "client" | "developer";
  activeTab?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const resolvedIssues = issuesData.client.filter(
    (i) => i.status === "resolved",
  );
  const pendingIssues = issuesData.client.filter(
    (i) => i.status !== "closed" && i.status !== "resolved",
  );
  const closedClientIssues = issuesData.client.filter(
    (i) => i.status === "closed",
  );

  const pendingAssignedIssues = issuesData.developer.filter(
    (i) => i.status !== "closed" && i.status !== "resolved",
  );
  const resolvedAssignedIssues = issuesData.developer.filter(
    (i) => i.status === "resolved",
  );
  const closedDeveloperIssues = issuesData.developer.filter(
    (i) => i.status === "closed",
  );

  // default tab
  const tab = activeTab || (role === "client" ? "pending" : "open");

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-4 border-b">
          <TabsList variant="line" className="h-auto p-0 bg-transparent">
            {role === "client" ? (
              <>
                <TabsTrigger
                  value="pending"
                  className="px-4 py-2 after:-bottom-px"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="resolved"
                  className="px-4 py-2 after:-bottom-px"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Resolved
                </TabsTrigger>
                <TabsTrigger
                  value="closed"
                  className="px-4 py-2 after:-bottom-px"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Closed
                </TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger
                  value="open"
                  className="px-4 py-2 after:-bottom-px"
                >
                  <CircleDashed className="mr-2 h-4 w-4" />
                  Open
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="px-4 py-2 after:-bottom-px"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="resolved"
                  className="px-4 py-2 after:-bottom-px"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Resolved
                </TabsTrigger>
                <TabsTrigger
                  value="closed"
                  className="px-4 py-2 after:-bottom-px"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Closed
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {role === "client" && (
            <RaiseIssueDialog>
              <Button>Raise New Issue</Button>
            </RaiseIssueDialog>
          )}
        </div>

        {role === "client" && (
          <>
            <TabsContent value="pending">
              <IssueList
                title="Pending Issues"
                issues={pendingIssues}
                emptyMessage="You haven't submitted any pending issues yet."
              />
            </TabsContent>
            <TabsContent value="resolved">
              <IssueList
                title="Resolved Issues"
                issues={resolvedIssues}
                emptyMessage="You don't have any resolved issues to review."
              />
            </TabsContent>
            <TabsContent value="closed">
              <IssueList
                title="Closed Issues"
                issues={closedClientIssues}
                emptyMessage="You don't have any closed issues yet."
              />
            </TabsContent>
          </>
        )}

        {role === "developer" && (
          <>
            <TabsContent value="open">
              <IssueList
                title="Open Issues"
                issues={issuesData.openIssues}
                emptyMessage="No pending issues available to solve."
              />
            </TabsContent>
            <TabsContent value="pending">
              <IssueList
                title="Pending Issues"
                issues={pendingAssignedIssues}
                emptyMessage="You aren't assigned to solve any active issues yet."
              />
            </TabsContent>
            <TabsContent value="resolved">
              <IssueList
                title="Resolved Issues"
                issues={resolvedAssignedIssues}
                emptyMessage="You don't have any resolved issues yet."
              />
            </TabsContent>
            <TabsContent value="closed">
              <IssueList
                title="Closed Issues"
                issues={closedDeveloperIssues}
                emptyMessage="You haven't closed any issues yet."
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
