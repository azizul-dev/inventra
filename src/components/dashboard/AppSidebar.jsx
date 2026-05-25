"use client";

import Link from "next/link";

import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Package,
  Users,
  ReceiptText,
  Settings,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  LogIn,
  LogOut,
  UserCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AppSidebar() {
  const [openSettings, setOpenSettings] = useState(false);

  const router = useRouter();

  const { data: session } = authClient.useSession();

  const isAdmin = session?.user?.role === "admin";

  const allItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },

    {
      title: "Add Inventory",
      url: "/add-inventory",
      icon: PlusCircle,
      adminOnly: true,
    },

    { title: "Inventory", url: "/inventory", icon: Package },

    { title: "Customers", url: "/customers", icon: Users },

    { title: "Billing", url: "/billing", icon: ReceiptText },
  ];

  const items = allItems.filter((item) => {
    if (item.adminOnly && !isAdmin) {
      return false;
    }

    return true;
  });

  const handleLogout = async () => {
    await authClient.signOut();

    toast.success("Logged out successfully");

    router.push("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3 px-2 py-4">
          <h1 className="text-3xl font-bold">Inventra</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />

                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mb-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <button
              onClick={() => setOpenSettings(!openSettings)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />

                <span>Settings</span>
              </div>

              {openSettings ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </SidebarMenuItem>

          {openSettings && (
            <>
              {session?.user ? (
                <>
                  <SidebarMenuItem>
                    <div className="ml-6 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700">
                      <UserCircle className="h-4 w-4 text-violet-600" />

                      <span className="max-w-[140px] truncate font-medium">
                        {session.user.name || session.user.email}
                      </span>
                    </div>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={handleLogout}
                        className="ml-6 flex w-[calc(100%-1.5rem)] items-center gap-2 text-red-500 hover:text-red-600"
                      >
                        <LogOut className="h-4 w-4" />

                        <span>Logout</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/login"
                      className="ml-6 flex items-center gap-2"
                    >
                      <LogIn className="h-4 w-4" />

                      <span>Login</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}