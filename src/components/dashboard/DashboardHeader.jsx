"use client";

import React, { useEffect, useState } from "react";
import {
  Sunrise,
  Sun,
  Sunset,
  MoonStar,
} from "lucide-react";
const DashboardHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();

  let greeting = "";
  let icon = "";

  if (hour >= 5 && hour < 12) {
    greeting = "শুভ সকাল";
    icon = <Sunrise className="h-10 w-10 text-orange-500" />;
  } else if (hour >= 12 && hour < 5) {
    greeting = "শুভ অপরাহ্ন";
    icon = <Sun className="h-10 w-10 text-yellow-500" />;
  } else if (hour >= 5 && hour < 8) {
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
    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 space-y-4 p-4 md:flex-row md:items-center">
      <div className="text-center md:text-left">
        <h2 className="flex items-center gap-2 text-3xl font-bold">
          <span>{icon}</span>

          <span>{greeting}</span>
        </h2>

        <p className="mt-1 text-gray-500">
          আজকের ব্যবসার সারসংক্ষেপ
        </p>
      </div>

      <div className="rounded-2xl border bg-white px-5 py-3 shadow-sm">
        <h2 className="text-lg font-semibold">
          {formattedDate}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {formattedTime}
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;