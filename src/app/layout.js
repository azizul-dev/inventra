import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/dashboard/AppSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Inventra",
  description: "Professional Inventory Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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