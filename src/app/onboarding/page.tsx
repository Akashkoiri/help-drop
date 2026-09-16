"use client";

import { useState } from "react";
import { setRole } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, UserCircle2, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [role, setSelectedRole] = useState<"client" | "developer" | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit() {
    if (!role) return;
    setLoading(true);
    try {
      await setRole(role);
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Help Drop</CardTitle>
          <CardDescription>
            How will you be using this platform?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedRole("client")}
            className={cn(
              "flex flex-col items-center justify-center gap-3 p-6 border-2 rounded-xl transition-all",
              role === "client"
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/50 hover:bg-muted",
            )}
          >
            <UserCircle2
              className={cn(
                "w-12 h-12",
                role === "client" ? "text-primary" : "text-muted-foreground",
              )}
            />
            <div className="font-semibold">Client</div>
            <p className="text-xs text-center text-muted-foreground">
              I want to raise issues and get them resolved.
            </p>
          </button>

          <button
            onClick={() => setSelectedRole("developer")}
            className={cn(
              "flex flex-col items-center justify-center gap-3 p-6 border-2 rounded-xl transition-all",
              role === "developer"
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/50 hover:bg-muted",
            )}
          >
            <Code2
              className={cn(
                "w-12 h-12",
                role === "developer" ? "text-primary" : "text-muted-foreground",
              )}
            />
            <div className="font-semibold">Developer</div>
            <p className="text-xs text-center text-muted-foreground">
              I want to solve issues and help others.
            </p>
          </button>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={!role || loading}
            onClick={onSubmit}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
