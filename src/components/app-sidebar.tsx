"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, Settings, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Issues",
    url: "/issues",
    icon: FileText,
  },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
];

export function AppSidebar({}: { role?: "client" | "developer" }) {
  const pathname = usePathname();
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center gap-3 overflow-hidden px-1 py-2"
        >
          <div className="flex items-center justify-center shrink-0 w-9 h-9 transition-all group-data-[collapsible=icon]:w-7 group-data-[collapsible=icon]:h-7">
            <Image
              src="/logo.jpg"
              alt="Help Drop Logo"
              width={36}
              height={36}
              className="rounded-xl shadow-sm shrink-0 w-9 h-9 transition-all group-data-[collapsible=icon]:w-7 group-data-[collapsible=icon]:h-7"
            />
          </div>
          <span className="font-bold text-xl tracking-tight group-data-[collapsible=icon]:hidden whitespace-nowrap">
            Help Drop
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  item.url === "/"
                    ? pathname === item.url
                    : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
