"use client";

import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getWeekDays() {
  const days = [];
  const labels = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(d.toDateString());
    labels.push(
      d.toLocaleDateString("bn-BD", { weekday: "short" })
    );
  }
  return { days, labels };
}

function getMonthLabels() {
  const labels = [];
  const now = new Date();
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleDateString("bn-BD", { month: "short" }));
  }
  return labels;
}

function calcDailyStats(billings, inventoryMap, days) {
  return days.map((day) => {
    const dayBills = billings.filter(
      (b) => new Date(b.createdAt).toDateString() === day
    );
    let revenue = 0;
    let cost = 0;
    dayBills.forEach((bill) => {
      bill.items?.forEach((item) => {
        const qty = Number(item.quantity) || 0;
        const sell = Number(item.sellPrice) || 0;
        const buy = Number(inventoryMap[item.productName]?.buyPrice) || 0;
        revenue += sell * qty;
        cost += buy * qty;
      });
    });
    return { revenue, cost, profit: revenue - cost };
  });
}

function calcMonthlyStats(billings, inventoryMap) {
  const now = new Date();
  return Array.from({ length: 5 }, (_, i) => {
    const target = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);
    const monthBills = billings.filter((b) => {
      const d = new Date(b.createdAt);
      return (
        d.getMonth() === target.getMonth() &&
        d.getFullYear() === target.getFullYear()
      );
    });
    let revenue = 0;
    let cost = 0;
    monthBills.forEach((bill) => {
      bill.items?.forEach((item) => {
        const qty = Number(item.quantity) || 0;
        const sell = Number(item.sellPrice) || 0;
        const buy = Number(inventoryMap[item.productName]?.buyPrice) || 0;
        revenue += sell * qty;
        cost += buy * qty;
      });
    });
    return { revenue, cost, profit: revenue - cost };
  });
}

function calcTopProducts(billings, period, inventoryMap) {
  const now = new Date();
  const filtered = billings.filter((b) => {
    const d = new Date(b.createdAt);
    if (period === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo;
    }
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const map = {};
  filtered.forEach((bill) => {
    bill.items?.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      if (!map[item.productName]) map[item.productName] = 0;
      map[item.productName] += qty;
    });
  });

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

function fmt(n) {
  return Math.round(n).toLocaleString("en-BD");
}

// ─────────────────────────────────────────────
// Chart renderer (vanilla Chart.js)
// ─────────────────────────────────────────────

function renderWeeklyChart(canvasRef, labels, data) {
  if (!canvasRef.current || !window.Chart) return;
  if (canvasRef.current._chartInstance) {
    canvasRef.current._chartInstance.destroy();
  }
  const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const labelColor = isDark ? "#aaa" : "#888";
  const instance = new window.Chart(canvasRef.current, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: data.map((d) => d.revenue),
          backgroundColor: "#7F77DD",
          borderRadius: 5,
          borderSkipped: false,
        },
        {
          label: "Cost",
          data: data.map((d) => d.cost),
          backgroundColor: "#E24B4A",
          borderRadius: 5,
          borderSkipped: false,
        },
        {
          label: "Profit",
          data: data.map((d) => d.profit),
          backgroundColor: "#1D9E75",
          borderRadius: 5,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: labelColor, font: { size: 11 } },
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: labelColor,
            font: { size: 11 },
            callback: (v) => "৳" + Math.round(v / 1000) + "k",
          },
        },
      },
    },
  });
  canvasRef.current._chartInstance = instance;
}

function renderMonthlyChart(canvasRef, labels, data) {
  if (!canvasRef.current || !window.Chart) return;
  if (canvasRef.current._chartInstance) {
    canvasRef.current._chartInstance.destroy();
  }
  const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const labelColor = isDark ? "#aaa" : "#888";
  const instance = new window.Chart(canvasRef.current, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: data.map((d) => d.revenue),
          borderColor: "#7F77DD",
          backgroundColor: "rgba(127,119,221,0.08)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#7F77DD",
        },
        {
          label: "Cost",
          data: data.map((d) => d.cost),
          borderColor: "#E24B4A",
          backgroundColor: "rgba(226,75,74,0.05)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#E24B4A",
        },
        {
          label: "Profit",
          data: data.map((d) => d.profit),
          borderColor: "#1D9E75",
          backgroundColor: "rgba(29,158,117,0.07)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#1D9E75",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: labelColor, font: { size: 11 } },
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: labelColor,
            font: { size: 11 },
            callback: (v) => Math.round(v / 1000) + "k",
          },
        },
      },
    },
  });
  canvasRef.current._chartInstance = instance;
}

function renderTopChart(canvasRef, labels, data) {
  if (!canvasRef.current || !window.Chart) return;
  if (canvasRef.current._chartInstance) {
    canvasRef.current._chartInstance.destroy();
  }
  const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const labelColor = isDark ? "#aaa" : "#888";
  const instance = new window.Chart(canvasRef.current, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "বিক্রি",
          data,
          backgroundColor: ["#7F77DD", "#1D9E75", "#378ADD", "#BA7517", "#D4537E"],
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: labelColor, font: { size: 11 } },
        },
        y: {
          grid: { display: false },
          ticks: { color: labelColor, font: { size: 11 }, autoSkip: false },
        },
      },
    },
  });
  canvasRef.current._chartInstance = instance;
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

const DashboardCharts = () => {
  const [billings, setBillings] = useState([]);
  const [inventoryMap, setInventoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [topPeriod, setTopPeriod] = useState("month");

  const weeklyRef = useRef(null);
  const monthlyRef = useRef(null);
  const topRef = useRef(null);

  // ── Load Chart.js once
  useEffect(() => {
    if (window.Chart) return;
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // ── Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tokenData } = await authClient.token();
        const baseUrl =
          !process.env.NEXT_PUBLIC_SERVER_URL ||
          process.env.NEXT_PUBLIC_SERVER_URL.includes("localhost:8000")
            ? "/api"
            : process.env.NEXT_PUBLIC_SERVER_URL;
        const headers = { Authorization: `Bearer ${tokenData?.token}` };

        const [billingRes, inventoryRes] = await Promise.all([
          fetch(`${baseUrl}/billing`, { headers }),
          fetch(`${baseUrl}/inventory`, { headers }),
        ]);

        const billingData = await billingRes.json();
        const inventoryData = await inventoryRes.json();

        if (Array.isArray(billingData)) setBillings(billingData);

        if (Array.isArray(inventoryData)) {
          const map = {};
          inventoryData.forEach((item) => {
            map[item.productName] = {
              buyPrice: Number(item.buyPrice) || 0,
              sellPrice: Number(item.sellPrice) || 0,
            };
          });
          setInventoryMap(map);
        }
      } catch (error) {
        console.error("DashboardCharts fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Draw charts after data loads
  useEffect(() => {
    if (loading || !billings.length) return;

    const tryDraw = () => {
      if (!window.Chart) {
        setTimeout(tryDraw, 100);
        return;
      }

      const { days, labels: dayLabels } = getWeekDays();
      const monthLabels = getMonthLabels();
      const weeklyData = calcDailyStats(billings, inventoryMap, days);
      const monthlyData = calcMonthlyStats(billings, inventoryMap);
      const topData = calcTopProducts(billings, topPeriod, inventoryMap);
      const topLabels = topData.map((d) => d[0]);
      const topValues = topData.map((d) => d[1]);

      renderWeeklyChart(weeklyRef, dayLabels, weeklyData);
      renderMonthlyChart(monthlyRef, monthLabels, monthlyData);
      renderTopChart(topRef, topLabels, topValues);
    };

    tryDraw();
  }, [loading, billings, inventoryMap, topPeriod]);

  // ── Summary metrics
  const { days } = getWeekDays();
  const weeklyData = calcDailyStats(billings, inventoryMap, days);
  const monthlyData = calcMonthlyStats(billings, inventoryMap);

  const weekProfit = weeklyData.reduce((s, d) => s + d.profit, 0);
  const monthProfit = monthlyData[4]?.profit || 0;
  const monthRevenue = monthlyData[4]?.revenue || 0;
  const monthCost = monthlyData[4]?.cost || 0;
  const isLoss = monthProfit < 0;

  // ── Loading skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-4 animate-pulse">
        <div className="h-20 rounded-3xl bg-gray-100" />
        <div className="h-64 rounded-3xl bg-gray-100" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-56 rounded-3xl bg-gray-100" />
          <div className="h-56 rounded-3xl bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-5">

      {/* ── Summary metric cards ── */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          {
            label: "এই সপ্তাহে লাভ",
            value: `৳ ${fmt(weekProfit)}`,
            color: weekProfit >= 0 ? "text-green-700" : "text-red-600",
            bg: weekProfit >= 0 ? "bg-green-50" : "bg-red-50",
          },
          {
            label: "এই মাসে Revenue",
            value: `৳ ${fmt(monthRevenue)}`,
            color: "text-violet-700",
            bg: "bg-violet-50",
          },
          {
            label: "এই মাসে Cost",
            value: `৳ ${fmt(monthCost)}`,
            color: "text-red-600",
            bg: "bg-red-50",
          },
          {
            label: isLoss ? "এই মাসে লস" : "এই মাসে লাভ",
            value: `৳ ${fmt(Math.abs(monthProfit))}`,
            color: isLoss ? "text-red-600" : "text-green-700",
            bg: isLoss ? "bg-red-50" : "bg-green-50",
          },
        ].map((m, i) => (
          <div
            key={i}
            className={`rounded-3xl ${m.bg} border border-gray-200 px-5 py-4`}
          >
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* ── Weekly bar chart ── */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1 bg-gradient-to-r from-violet-500 via-green-500 to-red-400 bg-[length:200%_200%] animate-gradient" />
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">সাপ্তাহিক লাভ / লস</h2>
            <p className="mt-1 text-sm text-gray-500">গত ৭ দিনের Revenue vs Cost vs Profit</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {[
              { color: "bg-violet-500", label: "Revenue" },
              { color: "bg-red-500", label: "Cost" },
              { color: "bg-green-600", label: "Profit" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
        <div className="px-6 py-5">
          <div style={{ position: "relative", height: "240px" }}>
            <canvas
              ref={weeklyRef}
              role="img"
              aria-label="সাপ্তাহিক Revenue, Cost এবং Profit bar chart"
            />
          </div>
        </div>
      </div>

      {/* ── Monthly line + Top products ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Monthly line chart */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="h-1 bg-gradient-to-r from-violet-500 via-sky-400 to-green-500 bg-[length:200%_200%] animate-gradient" />
          <div className="px-6 py-5 border-b flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">মাসিক ট্রেন্ড</h2>
              <p className="mt-1 text-sm text-gray-500">গত ৫ মাসের Revenue / Cost / Profit</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {[
                { color: "bg-violet-500", label: "Revenue" },
                { color: "bg-red-500", label: "Cost" },
                { color: "bg-green-600", label: "Profit" },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          <div className="px-6 py-5">
            <div style={{ position: "relative", height: "220px" }}>
              <canvas
                ref={monthlyRef}
                role="img"
                aria-label="মাসিক Revenue Cost এবং Profit line chart"
              />
            </div>
          </div>
        </div>

        {/* Top products */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="h-1 bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 bg-[length:200%_200%] animate-gradient" />
          <div className="px-6 py-5 border-b flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">সর্বোচ্চ বিক্রি</h2>
              <p className="mt-1 text-sm text-gray-500">Top 5 পণ্য</p>
            </div>
            <div className="flex gap-1">
              {["week", "month"].map((p) => (
                <button
                  key={p}
                  onClick={() => setTopPeriod(p)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    topPeriod === p
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p === "week" ? "সপ্তাহ" : "মাস"}
                </button>
              ))}
            </div>
          </div>
          <div className="px-6 py-5">
            <div style={{ position: "relative", height: "220px" }}>
              <canvas
                ref={topRef}
                role="img"
                aria-label="সর্বোচ্চ বিক্রি পণ্যের horizontal bar chart"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardCharts;