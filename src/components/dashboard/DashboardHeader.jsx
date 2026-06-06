"use client";

import React, { useEffect, useState } from "react";
import {
  Sunrise,
  Sun,
  Sunset,
  MoonStar,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

// Helper to normalize Bangla and English digits to standard English float
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

const DashboardHeader = () => {
  const [currentTime, setCurrentTime] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data: tokenData } = await authClient.token();
        const baseUrl =
          !process.env.NEXT_PUBLIC_SERVER_URL ||
          process.env.NEXT_PUBLIC_SERVER_URL.includes("localhost:8000")
            ? "/api"
            : process.env.NEXT_PUBLIC_SERVER_URL;

        const res = await fetch(`${baseUrl}/inventory`, {
          headers: {
            Authorization: `Bearer ${tokenData?.token}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          const low = data.filter((item) => {
            const stock = parseNum(item.stock);
            const minimumStock = parseNum(item.minimumStock);
            return stock <= minimumStock;
          });
          setLowStockProducts(low);
        }
      } catch (error) {
        console.error("DashboardHeader fetch inventory error:", error);
      }
    };

    fetchInventory();
  }, []);

  if (!currentTime) {
    return null;
  }

  const hour = currentTime.getHours();

  let greeting = "";
  let icon = null;

  if (hour >= 5 && hour < 12) {
    greeting = "শুভ সকাল";
    icon = <Sunrise className="h-10 w-10 text-orange-500" />;
  } else if (hour >= 12 && hour < 17) {
    greeting = "শুভ অপরাহ্ন";
    icon = <Sun className="h-10 w-10 text-yellow-500" />;
  } else if (hour >= 17 && hour < 20) {
    greeting = "শুভ সন্ধ্যা";
    icon = <Sunset className="h-10 w-10 text-pink-500" />;
  } else {
    greeting = "শুভ রাত্রি";
    icon = <MoonStar className="h-10 w-10 text-indigo-500" />;
  }

  const formattedDate = currentTime.toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("bn-BD");

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="text-center md:text-left">
          <h2 className="flex items-center justify-center gap-3 text-3xl font-bold md:justify-start">
            {icon}
            <span>{greeting}</span>
          </h2>

          <p className="mt-2 text-gray-500">
            আজকের ব্যবসার সারসংক্ষেপ
          </p>
        </div>

        <div className="rounded-2xl border bg-white px-5 py-3 shadow-sm text-center md:text-left">
          <h2 className="text-lg font-semibold">
            {formattedDate}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {formattedTime}
          </p>
        </div>
      </div>

      {/* Low Stock Banner Alert */}
      {lowStockProducts.length > 0 && (
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 shadow-sm animate-pulse-slow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <TriangleAlert className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-base">স্টক সতর্কতা!</h4>
              <p className="text-sm text-amber-700">
                আপনার ইনভেন্টরিতে {lowStockProducts.length} টি পণ্যের স্টক কম বা শেষ হয়ে গেছে।
              </p>
            </div>
          </div>
          <Link
            href="/inventory"
            className="inline-flex h-9 items-center justify-center rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white transition hover:bg-amber-700 text-center"
          >
            স্টক চেক করুন
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;