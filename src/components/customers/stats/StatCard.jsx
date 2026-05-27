import React from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Premium StatCard Component
 * Displays individual key CRM metrics with unique top accent borders.
 */
export default function StatCard({ title, value, icon, accentColor = "bg-violet-600", children }) {
  return (
    <Card className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className={`h-1 ${accentColor}`} />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <div className="rounded-2xl bg-gray-50 p-2.5 text-gray-700">
            {icon}
          </div>
        </div>
        {children ? (
          children
        ) : (
          <h3 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
            {value}
          </h3>
        )}
      </CardContent>
    </Card>
  );
}
