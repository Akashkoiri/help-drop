"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react";
import { InferSelectModel } from "drizzle-orm";
import { issues } from "@/db/schema";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"]; // Green, Yellow, Red, Blue

type IssueType = InferSelectModel<typeof issues>;

interface DashboardMetrics {
  client: {
    total: number;
    resolved: number;
    pending: number;
    overdue: number;
    doneBeforeDeadline: number;
    issues: IssueType[];
  };
  developer: {
    total: number;
    resolved: number;
    pending: number;
    overdue: number;
    doneBeforeDeadline: number;
    issues: IssueType[];
  };
  openIssues: IssueType[];
}

function IssueList({
  issues,
  emptyMessage,
  title,
}: {
  issues: IssueType[];
  emptyMessage: string;
  title: string;
}) {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Recent issues</CardDescription>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <p className="text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div className="space-y-4">
            {issues.slice(0, 5).map((issue) => (
              <div
                key={issue.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-semibold">{issue.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Status: <span className="capitalize">{issue.status}</span>
                    {issue.deadline &&
                      ` • Deadline: ${format(new Date(issue.deadline), "PPp")}`}
                  </p>
                </div>
                <Link href={`/issues/${issue.id}`}>
                  <Button variant="outline">View</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardClient({
  metrics,
  role,
}: {
  metrics: DashboardMetrics;
  role: "client" | "developer";
}) {
  const closedClientIssues = metrics.client.issues.filter(
    (i) => i.status === "closed",
  );
  const closedDeveloperIssues = metrics.developer.issues.filter(
    (i) => i.status === "closed",
  );

  const clientData = [
    { name: "Resolved", value: metrics.client.resolved },
    { name: "Pending", value: metrics.client.pending },
    { name: "Overdue", value: metrics.client.overdue },
    { name: "Closed", value: closedClientIssues.length },
  ];

  const developerData = [
    { name: "Resolved", value: metrics.developer.resolved },
    { name: "Pending", value: metrics.developer.pending },
    { name: "Overdue", value: metrics.developer.overdue },
    { name: "Closed", value: closedDeveloperIssues.length },
  ];

  const activeData = role === "client" ? clientData : developerData;
  const activeMetrics = role === "client" ? metrics.client : metrics.developer;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={role === "client" ? "Total Submitted" : "Total Assigned"}
          value={activeMetrics.total}
          icon={FileText}
        />
        <StatCard
          title="Resolved"
          value={activeMetrics.resolved}
          icon={CheckCircle2}
        />
        <StatCard title="Pending" value={activeMetrics.pending} icon={Clock} />
        <StatCard
          title="Overdue"
          value={activeMetrics.overdue}
          icon={AlertCircle}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Status Overview (Distribution)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {activeData.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeData.filter((d) => d.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {activeData
                      .filter((d) => d.value > 0)
                      .map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data to display
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Issues by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {activeData.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {activeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data to display
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {role === "developer" && (
        <div className="mt-6">
          <IssueList
            title="Open Issues"
            issues={metrics.openIssues}
            emptyMessage="No open issues available to solve."
          />
        </div>
      )}
    </div>
  );
}
