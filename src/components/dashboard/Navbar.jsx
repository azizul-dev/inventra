"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { Menu } from "lucide-react";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* MOBILE MENU */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <div className="border-b p-5">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/logo.png"
                      alt="logo"
                      width={50}
                      height={50}
                    />

                    <h1
                      className={`${greatVibes.className} text-4xl text-gray-900`}
                    >
                      Inventra
                    </h1>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="logo" width={100} height={100} />

            <h1 className={`${greatVibes.className} text-4xl text-gray-900`}>
              Inventra
            </h1>
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block"></div>

          <div
            className={`${greatVibes.className} flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-700`}
          >
            A
          </div>
        </div>
      </div>
    </header>
  );
}
