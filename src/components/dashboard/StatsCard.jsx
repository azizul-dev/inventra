"use client";

import { BadgeDollarSign, Boxes, Clock3 } from "lucide-react";

const stats = [
  {
    title: "Today's Revenue",
    value: "৳ 12,450",
    description: "+8 bills completed",
    icon: BadgeDollarSign,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    borderColor: "border-t-violet-500",
    badgeBg: "bg-green-100",
    badgeText: "text-green-700",
  },
  {
    title: "Today's Sales",
    value: "14 Pieces",
    description: "Cement sold most",
    icon: Boxes,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    borderColor: "border-t-sky-500",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-700",
  },
  {
    title: "Total Due",
    value: "৳ 34,000",
    description: "3 customers 30+ days",
    icon: Clock3,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    borderColor: "border-t-amber-500",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
  },
];

const StatsCard = () => {
  return (
    <div className="max-w-7xl mx-auto grid gap-6 p-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-sky-500 to-amber-500 bg-[length:200%_200%] animate-gradient" />
           
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-500">
                  {item.title}
                </h3>

                <h2 className="mt-5 text-4xl font-bold text-gray-900">
                  {item.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconBg}`}
              >
                <Icon className={`h-7 w-7 ${item.iconColor}`} />
              </div>
            </div>

           
            <div className="mt-6">
              <span
                className={`rounded-full px-4 py-2 text-sm font-medium ${item.badgeBg} ${item.badgeText}`}
              >
                {item.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCard;
