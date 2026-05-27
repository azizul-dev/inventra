import React from "react";
import { Users } from "lucide-react";

/**
 * CustomersHeader Component
 * Renders the top title bar and subtitle for the Customers & CRM dashboard page.
 */
export default function CustomersHeader() {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between no-print">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8 text-violet-600 animate-pulse" />
          Customers & CRM
        </h1>
        <p className="mt-1 text-gray-500">
          গ্রাহকদের বিবরণ, মোট ক্রয় হিসাব, বকেয়া এবং রশিদ ইতিহাস।
        </p>
      </div>
    </div>
  );
}
