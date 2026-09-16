"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/theme-toggle";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

// Wrapper for clerk's Show component which is a server component normally?
// Wait, Clerk's <Show> can be used in Client components? Wait, no, we can just check if user is signed in.
import { useAuth } from "@clerk/nextjs";

export function ClientLayout({ 
  children, 
  role 
}: { 
  children: React.ReactNode; 
  role?: string;
}) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
  
  const isHomePage = pathname === "/";
  const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up") || pathname?.startsWith("/onboarding");

  if (isHomePage || isAuthPage) {
    return (
      <main className="flex-1 w-full h-full flex flex-col">
        {isHomePage && (
          <header className="flex justify-end items-center p-4 h-16 shrink-0 absolute top-0 right-0 w-full">
            <div className="flex items-center gap-4">
              <ModeToggle />
              {isLoaded && !isSignedIn && (
                <>
                  <SignInButton />
                  <SignUpButton />
                </>
              )}
              {isLoaded && isSignedIn && (
                <>
                  {role && (
                    <span className="text-sm font-medium text-muted-foreground capitalize">
                      {role}
                    </span>
                  )}
                  <UserButton />
                </>
              )}
            </div>
          </header>
        )}
        {children}
      </main>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role as "client" | "developer" | undefined} />
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <header className="flex justify-between items-center p-4 h-16 border-b shrink-0">
          <SidebarTrigger />
          <div className="flex items-center gap-4">
            <ModeToggle />
            {isLoaded && !isSignedIn && (
              <>
                <SignInButton />
                <SignUpButton />
              </>
            )}
            {isLoaded && isSignedIn && (
              <>
                {role && (
                  <span className="text-sm font-medium text-muted-foreground capitalize">
                    {role}
                  </span>
                )}
                <UserButton />
              </>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
