"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { TriangleAlert } from "lucide-react";

function parseNum(val) {
  if (val === null || val === undefined) return 0;
  const s = String(val).trim();
  if (s === "") return 0;
  const banglaDigits = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9"
  };
  const normalized = s.replace(/[০-৯]/g, (match) => banglaDigits[match]);
  return parseFloat(normalized) || 0;
}

// ─────────────────────────────────────────────
// Helper: সর্বোচ্চ stock value বের করা (progress bar এর জন্য)
// ─────────────────────────────────────────────
function getStockPercent(stock, maxStock) {
  if (!maxStock || maxStock === 0) return 0;
  const percent = (stock / maxStock) * 100;
  return Math.min(Math.max(percent, 0), 100);
}

// ─────────────────────────────────────────────
// Helper: stock এর পরিমাণ অনুযায়ী color ঠিক করা
// ─────────────────────────────────────────────
function getStockColor(percent) {
  if (percent <= 15) return { bar: "bg-red-500", text: "text-red-600" };
  if (percent <= 35) return { bar: "bg-orange-500", text: "text-orange-600" };
  if (percent <= 60) return { bar: "bg-yellow-500", text: "text-yellow-700" };
  return { bar: "bg-green-600", text: "text-green-700" };
}

// ─────────────────────────────────────────────
// Helper: আজকের বিল filter করা
// ─────────────────────────────────────────────
function getTodayBillings(billings) {
  const today = new Date().toDateString();
  return billings.filter(
    (bill) => new Date(bill.createdAt).toDateString() === today
  );
}

// ─────────────────────────────────────────────
// Helper: বিলের সব পণ্যের নাম একসাথে দেখানো
// ─────────────────────────────────────────────
function getProductSummary(items = []) {
  if (items.length === 0) return "—";
  return items
    .slice(0, 2)
    .map((i) => `${i.productName} ${i.quantity} ${i.unit}`)
    .join(", ");
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const DashboardTables = () => {
  const [todayBillings, setTodayBillings] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tokenData } = await authClient.token();

        const baseUrl =
          !process.env.NEXT_PUBLIC_SERVER_URL ||
          process.env.NEXT_PUBLIC_SERVER_URL.includes("localhost:8000")
            ? "/api"
            : process.env.NEXT_PUBLIC_SERVER_URL;

        const headers = {
          Authorization: `Bearer ${tokenData?.token}`,
        };

        // দুইটা API একসাথে call করা
        const [billingRes, inventoryRes] = await Promise.all([
          fetch(`${baseUrl}/billing`, { headers }),
          fetch(`${baseUrl}/inventory`, { headers }),
        ]);

        const billingData = await billingRes.json();
        const inventoryData = await inventoryRes.json();

        if (Array.isArray(billingData)) {
          setTodayBillings(getTodayBillings(billingData));
        }
        if (Array.isArray(inventoryData)) {
          setInventory(inventoryData);
        }
      } catch (error) {
        console.error("DashboardTables fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ─── Stock এর সর্বোচ্চ মান বের করা (progress bar scale এর জন্য)
  const maxStock = Math.max(...inventory.map((i) => parseNum(i.stock)), 1);

  // ─── কতটা কম stock পণ্য আছে (stock <= minimumStock)
  const lowStockCount = inventory.filter((item) => {
    const stock = parseNum(item.stock);
    const minStock = parseNum(item.minimumStock);
    return stock <= minStock;
  }).length;

  // ─── Loading skeleton ───
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 p-4 max-w-7xl mx-auto">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm animate-pulse"
          >
            <div className="h-1 bg-gray-200" />
            <div className="px-6 py-5 border-b">
              <div className="h-6 w-40 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-24 rounded bg-gray-100" />
            </div>
            <div className="divide-y">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center justify-between px-6 py-5">
                  <div className="space-y-2">
                    <div className="h-4 w-28 rounded bg-gray-200" />
                    <div className="h-3 w-20 rounded bg-gray-100" />
                  </div>
                  <div className="h-6 w-20 rounded-full bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─── Main Render ───
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 p-4 max-w-7xl mx-auto">

      {/* ── RECENT SALES ── */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1 bg-gradient-to-r from-violet-500 via-sky-500 to-amber-500 bg-[length:200%_200%] animate-gradient" />

        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              আজকের বিক্রি
            </h2>
            <p className="mt-1 text-sm text-gray-500">Today's invoices</p>
          </div>

          <div className="rounded-full bg-violet-100 px-4 py-1 text-sm font-semibold text-violet-700">
            {todayBillings.length} Items
          </div>
        </div>

        {todayBillings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-lg font-medium">আজ কোনো বিল নেই</p>
            <p className="mt-1 text-sm">নতুন বিল তৈরি করুন</p>
          </div>
        ) : (
          <div className="divide-y">
            {todayBillings.map((bill, index) => {
              const isPaid = bill.status === "Paid";
              return (
                <div
                  key={bill._id || index}
                  className="flex items-center justify-between px-6 py-5 transition-all duration-300 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        isPaid ? "bg-green-600" : "bg-red-600"
                      }`}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {bill.customerName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getProductSummary(bill.items)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      ৳ {Number(bill.total || 0).toLocaleString("en-BD")}
                    </h2>
                    <span
                      className={`rounded-full px-4 py-1 text-sm font-semibold ${
                        isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isPaid ? "Paid" : "Due"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── STOCK STATUS ── */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1 bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-[length:200%_200%] animate-gradient" />

        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Stock Status</h2>
            <p className="mt-1 text-sm text-gray-500">Low stock alert</p>
          </div>

          <div className="rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-700">
            {lowStockCount} Low
          </div>
        </div>

        {inventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-lg font-medium">কোনো পণ্য নেই</p>
            <p className="mt-1 text-sm">ইনভেন্টরিতে পণ্য যোগ করুন</p>
          </div>
        ) : (
          <div className="space-y-6 px-6 py-6">
            {inventory.map((item, index) => {
              const stock = parseNum(item.stock);
              const minStock = parseNum(item.minimumStock);
              const percent = getStockPercent(stock, maxStock);
              
              // Determine stock status and style
              const isOutOfStock = stock === 0;
              const isLowStock = stock <= minStock;
              
              let barColor = "bg-gradient-to-r from-blue-500 to-indigo-600";
              let textColor = "text-green-700";
              let statusText = "স্টক আছে";
              let badgeBg = "bg-green-100 text-green-700";
              
              if (isOutOfStock) {
                barColor = "bg-red-600";
                textColor = "text-red-600";
                statusText = "স্টক শেষ";
                badgeBg = "bg-red-100 text-red-700";
              } else if (isLowStock) {
                barColor = "bg-amber-500";
                textColor = "text-amber-600";
                statusText = "কম স্টক";
                badgeBg = "bg-amber-100 text-amber-700";
              }

              return (
                <div key={item._id || index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.productName}
                      </h3>
                      {isLowStock && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold mt-1 ${badgeBg}`}>
                          <TriangleAlert className="h-3 w-3" />
                          {statusText}
                        </span>
                      )}
                    </div>
                    <span className={`font-bold text-lg ${textColor}`}>
                      {stock} {item.unit || ""}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTables;