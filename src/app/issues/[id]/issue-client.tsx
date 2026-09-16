"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  startSolving,
  markResolved,
  addRemark,
  deleteIssue,
  closeIssue,
} from "./actions";
import { createClient } from "@supabase/supabase-js";
import {
  ExternalLink,
  Paperclip,
  CheckCircle2,
  Trash2,
  XCircle,
  ArrowLeft,
  Loader2,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { InferSelectModel } from "drizzle-orm";
import { issues, issueRemarks } from "@/db/schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type IssueType = InferSelectModel<typeof issues>;
type RemarkType = InferSelectModel<typeof issueRemarks>;

export function IssueClient({
  issue,
  remarks,
  userMap,
  isClient,
  isDeveloper,
  canSolve,
}: {
  issue: IssueType;
  remarks: RemarkType[];
  userMap: Record<string, string>;
  isClient: boolean;
  isDeveloper: boolean;
  canSolve: boolean;
}) {
  const [remarkText, setRemarkText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolveNote, setResolveNote] = useState("");
  const [resolveFiles, setResolveFiles] = useState<File[]>([]);
  const router = useRouter();

  const handleAddRemark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkText.trim()) return;

    setSubmitting(true);
    try {
      const documentUrls: string[] = [];
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("documents")
          .getPublicUrl(filePath);
        documentUrls.push(data.publicUrl);
      }

      await addRemark(issue.id, remarkText, documentUrls);
      setRemarkText("");
      setFiles([]);
    } catch (error) {
      console.error(error);
      alert("Failed to add remark");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartSolving = async () => {
    setSubmitting(true);
    await startSolving(issue.id);
    setSubmitting(false);
  };

  const handleMarkResolved = () => {
    setResolveModalOpen(true);
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (resolveNote.trim() || resolveFiles.length > 0) {
        const documentUrls: string[] = [];
        for (const file of resolveFiles) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("documents")
            .upload(filePath, file);
          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from("documents")
            .getPublicUrl(filePath);
          documentUrls.push(data.publicUrl);
        }

        await addRemark(
          issue.id,
          resolveNote || "Issue marked as resolved.",
          documentUrls,
        );
      }

      await markResolved(issue.id);
      setResolveModalOpen(false);
      setResolveNote("");
      setResolveFiles([]);
    } catch (error) {
      console.error(error);
      alert("Failed to mark as resolved");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this issue? This cannot be undone.",
      )
    )
      return;
    setSubmitting(true);
    await deleteIssue(issue.id);
    router.push("/dashboard");
  };

  const handleClose = async () => {
    if (!confirm("Are you sure you want to close this issue?")) return;
    setSubmitting(true);
    await closeIssue(issue.id);
    setSubmitting(false);
  };

  return (
    <div className="space-y-8 pt-12 md:pt-0">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="absolute top-4 left-4 md:top-6 md:left-6 z-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="mt-2 md:mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <div className="lg:col-span-2 space-y-8">
          {/* Issue Details Card */}
          <Card className="h-full min-h-87.5 flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{issue.title}</CardTitle>
                <CardDescription className="mt-4 flex flex-col gap-1.5">
                  <div>
                    Client:{" "}
                    <span className="font-medium text-foreground">
                      {userMap[issue.clientId]}
                    </span>
                  </div>
                  <div>
                    Date:{" "}
                    <span className="font-medium text-foreground">
                      {format(new Date(issue.createdAt), "PPp")}
                    </span>
                  </div>
                  {issue.deadline && (
                    <div>
                      Deadline:{" "}
                      <span className="font-medium text-foreground">
                        {format(new Date(issue.deadline), "PPp")}
                      </span>
                    </div>
                  )}
                </CardDescription>
              </div>
              <div className="flex shrink-0">
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full h-fit ${
                    issue.status === "resolved"
                      ? `bg-green-100 text-green-800 ${"dark:bg-green-900 dark:text-green-200"}`
                      : issue.status === "pending"
                        ? `bg-yellow-100 text-yellow-800 ${"dark:bg-yellow-900 dark:text-yellow-200"}`
                        : `bg-red-100 text-red-800 ${"dark:bg-red-900 dark:text-red-200"}`
                  }`}
                >
                  {issue.status.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 flex-1">
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {issue.description}
                </p>
              </div>

              {issue.developerId && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center space-x-4">
                  <UserCircle className="w-8 h-8 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">
                      Assigned Developer
                    </p>
                    <p className="text-lg font-bold text-foreground leading-none">
                      {userMap[issue.developerId]}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 mt-auto">
              {isClient && (
                <Button
                  onClick={handleDelete}
                  disabled={submitting}
                  variant="destructive"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete
                </Button>
              )}
              {isClient && issue.status === "resolved" && (
                <Button
                  onClick={handleClose}
                  disabled={submitting}
                  variant="secondary"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Close Issue
                </Button>
              )}
              {canSolve && issue.status === "pending" && (
                <Button onClick={handleStartSolving} disabled={submitting}>
                  {submitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Start
                </Button>
              )}
              {(isClient || isDeveloper) && issue.status === "pending" && (
                <Button
                  onClick={handleMarkResolved}
                  disabled={submitting}
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  Mark as Resolved
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8 h-full">
          {issue.documents && issue.documents.length > 0 && (
            <Card className="h-full min-h-87.5 flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">Related Documents</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto max-h-87.5 pr-2">
                <div className="flex flex-col gap-2">
                  {issue.documents.map((doc: string, idx: number) => (
                    <a
                      key={idx}
                      href={doc}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-2 border rounded-md hover:bg-muted text-sm transition-colors"
                    >
                      <div className="flex items-center">
                        <Paperclip className="w-4 h-4 mr-2 shrink-0" />
                        <span className="truncate">Document {idx + 1}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 ml-2 text-muted-foreground shrink-0" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div
        className={`grid grid-cols-1 gap-5 items-start mt-8 ${
          issue.status === "pending" && (isClient || isDeveloper)
            ? "lg:grid-cols-2"
            : ""
        }`}
      >
        {/* Remarks Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Remarks & Updates</h3>

          {remarks.length === 0 ? (
            <p className="text-muted-foreground italic">No remarks yet.</p>
          ) : (
            <div className="space-y-4 max-h-150 overflow-y-auto pr-2">
              {remarks.map((r) => (
                <Card key={r.id}>
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold">
                        {userMap[r.userId]}{" "}
                        {r.userId === issue.clientId
                          ? "(Client)"
                          : r.userId === issue.developerId
                            ? "(Developer)"
                            : ""}
                      </span>
                      <span className="text-muted-foreground">
                        {format(new Date(r.createdAt), "PPp")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="whitespace-pre-wrap">{r.remark}</p>
                    {r.documents && r.documents.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {r.documents.map((doc: string, idx: number) => (
                          <a
                            key={idx}
                            href={doc}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center p-2 border rounded-md hover:bg-muted text-xs transition-colors"
                          >
                            <Paperclip className="w-3 h-3 mr-1" /> Document{" "}
                            {idx + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add Remark Form */}
        {issue.status === "pending" && (isClient || isDeveloper) && (
          <div className="sticky top-6 lg:mt-11">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add a Remark</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddRemark} className="space-y-4">
                  <div>
                    <Label className="mb-2 block">
                      Remark <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      placeholder="Type your update here..."
                      value={remarkText}
                      onChange={(e) => setRemarkText(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Attach Documents</Label>
                    <FileUpload value={files} onChange={setFiles} />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting || !remarkText.trim()}
                  >
                    {submitting && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {submitting ? "Posting..." : "Post Remark"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={resolveModalOpen} onOpenChange={setResolveModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Mark as Resolved</DialogTitle>
            <DialogDescription>
              Add an optional note and files before marking this issue as
              resolved.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResolveSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Closing Note</Label>
              <Textarea
                placeholder="Type your resolution note here..."
                value={resolveNote}
                onChange={(e) => setResolveNote(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Attach Documents</Label>
              <FileUpload value={resolveFiles} onChange={setResolveFiles} />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setResolveModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Confirm Resolve
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
