"use client";

import { useState, useEffect } from "react";
import { BadgeDollarSign, CalendarDays, CalendarRange } from "lucide-react";
import { authClient } from "@/lib/auth-client";

// ─────────────────────────────────────────────
// Helper: নির্দিষ্ট period অনুযায়ী billing filter
// ─────────────────────────────────────────────
function filterByPeriod(billings, period) {
  const now = new Date();
  return billings.filter((bill) => {
    const created = new Date(bill.createdAt);
    if (period === "today") {
      return created.toDateString() === now.toDateString();
    }
    if (period === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return created >= weekAgo;
    }
    if (period === "month") {
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    }
    return false;
  });
}

// ─────────────────────────────────────────────
// Helper: filtered billing থেকে stats বের করা
// ─────────────────────────────────────────────
function calcStats(filtered) {
  const revenue = filtered.reduce((sum, b) => sum + (b.total || 0), 0);
  const memoCount = filtered.length;
  const due = filtered.reduce((sum, b) => sum + (b.dueAmount || 0), 0);

  // সর্বোচ্চ বিক্রি হওয়া পণ্য বের করা
  const productMap = {};
  filtered.forEach((bill) => {
    bill.items?.forEach((item) => {
      if (item.productName) {
        productMap[item.productName] =
          (productMap[item.productName] || 0) + (item.quantity || 0);
      }
    });
  });

  const topProduct =
    Object.entries(productMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return { revenue, memoCount, due, topProduct };
}

// ─────────────────────────────────────────────
// Helper: বাংলা সংখ্যায় format করা
// ─────────────────────────────────────────────
function formatBDT(amount) {
  return amount.toLocaleString("en-BD");
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const StatsCard = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillings = async () => {
      try {
        // token নেওয়া — BillingClient-এর মতোই
        const { data: tokenData } = await authClient.token();

        const baseUrl =
          !process.env.NEXT_PUBLIC_SERVER_URL ||
          process.env.NEXT_PUBLIC_SERVER_URL.includes("localhost:8000")
            ? "/api"
            : process.env.NEXT_PUBLIC_SERVER_URL;

        const res = await fetch(`${baseUrl}/billing`, {
          headers: {
            Authorization: `Bearer ${tokenData?.token}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setBillings(data);
        }
      } catch (error) {
        console.error("Stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillings();
  }, []);

  // ─── Period অনুযায়ী stats calculate ───
  const todayStats = calcStats(filterByPeriod(billings, "today"));
  const weekStats = calcStats(filterByPeriod(billings, "week"));
  const monthStats = calcStats(filterByPeriod(billings, "month"));

  // ─── Card config ───
  const stats = [
    {
      title: "আজকের আয়",
      value: `৳ ${formatBDT(todayStats.revenue)}`,
      memoCount: todayStats.memoCount,
      topProduct: todayStats.topProduct,
      due: todayStats.due,
      icon: BadgeDollarSign,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      borderColor: "border-t-violet-500",
      badgeBg: "bg-green-100",
      badgeText: "text-green-700",
    },
    {
      title: "এই সপ্তাহের আয়",
      value: `৳ ${formatBDT(weekStats.revenue)}`,
      memoCount: weekStats.memoCount,
      topProduct: weekStats.topProduct,
      due: weekStats.due,
      icon: CalendarDays,
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
      borderColor: "border-t-sky-500",
      badgeBg: "bg-sky-100",
      badgeText: "text-sky-700",
    },
    {
      title: "এই মাসের আয়",
      value: `৳ ${formatBDT(monthStats.revenue)}`,
      memoCount: monthStats.memoCount,
      topProduct: monthStats.topProduct,
      due: monthStats.due,
      icon: CalendarRange,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      borderColor: "border-t-emerald-500",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-700",
    },
  ];

  // ─── Loading skeleton ───
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto grid gap-6 p-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-8 w-36 rounded bg-gray-200" />
              </div>
              <div className="h-14 w-14 rounded-2xl bg-gray-200" />
            </div>
            <div className="mt-6 h-8 w-32 rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  // ─── Main Render ───
  return (
    <div className="max-w-7xl mx-auto grid gap-6 p-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-t-4 ${item.borderColor}`}
          >
            {/* Top Section: Title + Icon */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {item.title}
                </h3>
                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                  {item.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconBg}`}
              >
                <Icon className={`h-7 w-7 ${item.iconColor}`} />
              </div>
            </div>

            {/* Memo Count Badge */}
            <div className="mt-5">
              <span
                className={`rounded-full px-4 py-2 text-sm font-medium ${item.badgeBg} ${item.badgeText}`}
              >
                +{item.memoCount} মেমো
              </span>
            </div>

            {/* Divider */}
            <div className="mt-4 border-t border-gray-100" />

            {/* Bottom Details: Top Product + Due */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">সর্বোচ্চ বিক্রি</span>
                <span className="font-medium text-gray-700">
                  {item.topProduct}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">মোট বাকি</span>
                <span className="font-medium text-red-500">
                  ৳ {formatBDT(item.due)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCard;