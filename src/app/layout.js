import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/dashboard/AppSidebar";

const hind = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Inventra",
  description: "Professional Inventory Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
       className={`${hind.className} antialiased`}
      >
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />

            <main className="w-full">
              {/* <div className="p-4">
                <SidebarTrigger />
              </div> */}

              {children}
            </main>
          </SidebarProvider>

          <Toaster richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}