import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * CustomerSearch Component
 * Renders the filter input field inside the CRM customer table header.
 */
export default function CustomerSearch({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="গ্রাহকের নাম, মোবাইল বা ঠিকানা দিয়ে খুঁজুন..."
        className="pl-11 h-11 rounded-2xl border-gray-200 focus-visible:ring-violet-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
