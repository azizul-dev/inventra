import React from "react";
import { Users, DollarSign, AlertCircle, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";
import { formatCurrency } from "../utils/invoiceCalculations";

/**
 * CRMStats Component
 * Renders the responsive grid containing four premium stats indicator cards.
 * Mobile: 1 column
 * Small: 2 columns
 * Large: 4 columns
 */
export default function CRMStats({ stats }) {
  const { totalCustomers = 0, totalSales = 0, totalDue = 0, topSpender = null } = stats;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8 no-print">
      {/* Total Customers */}
      <StatCard
        title="মোট গ্রাহক"
        value={`${totalCustomers} জন`}
        accentColor="bg-violet-600"
        icon={<Users className="h-5 w-5 text-violet-600" />}
      />

      {/* Total Sales */}
      <StatCard
        title="মোট বিক্রয়"
        value={formatCurrency(totalSales)}
        accentColor="bg-cyan-500"
        icon={<DollarSign className="h-5 w-5 text-cyan-600" />}
      />

      {/* Total Dues */}
      <StatCard
        title="মোট বকেয়া"
        value={formatCurrency(totalDue)}
        accentColor="bg-rose-500"
        icon={<AlertCircle className="h-5 w-5 text-rose-600" />}
      />

      {/* Highest Spender */}
      <StatCard
        title="সর্বোচ্চ ক্রেতা"
        accentColor="bg-amber-500"
        icon={<TrendingUp className="h-5 w-5 text-amber-600" />}
      >
        {topSpender ? (
          <div className="mt-3">
            <h4 className="text-lg font-bold text-gray-900 truncate">
              {topSpender.name}
            </h4>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">
              ক্রয়: {formatCurrency(topSpender.totalSpent)}
            </p>
          </div>
        ) : (
          <h3 className="mt-4 text-3xl font-extrabold text-gray-900">N/A</h3>
        )}
      </StatCard>
    </div>
  );
}
