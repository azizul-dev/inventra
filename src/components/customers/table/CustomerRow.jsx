import React from "react";
import { ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "../utils/invoiceCalculations";

/**
 * CustomerRow Component
 * Renders a single desktop table row for a customer profile.
 */
export default function CustomerRow({ customer, onViewHistory, onCreateInvoice, onDeleteCustomer, isAdmin = false }) {
  const latestDateStr = customer.latestBillDate
    ? new Date(customer.latestBillDate).toLocaleDateString("bn-BD")
    : "অজানা";

  return (
    <tr className="hover:bg-gray-50/50 border-b border-gray-100 transition-colors">
      <td className="py-4 px-4 align-middle">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-violet-100 text-violet-700 font-extrabold flex items-center justify-center text-sm shrink-0">
            {customer.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900">{customer.name}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              শেষ রশিদ: {latestDateStr}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 font-mono text-sm text-gray-600 align-middle">
        {customer.phone || <span className="text-gray-300 italic text-xs">অজানা</span>}
      </td>
      <td className="px-4 text-sm text-gray-600 align-middle max-w-[200px] truncate">
        {customer.address || <span className="text-gray-300 italic text-xs">অজানা</span>}
      </td>
      <td className="px-4 text-center font-bold text-gray-800 align-middle">
        {customer.bills.length} টি
      </td>
      <td className="px-4 text-right font-extrabold text-gray-900 text-base align-middle">
        {formatCurrency(customer.totalSpent)}
      </td>
      <td className="px-4 text-center align-middle">
        {customer.totalDue > 0 ? (
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-rose-100 text-rose-700">
            বকেয়া: {formatCurrency(customer.totalDue)}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
            Paid (পরিশোধিত)
          </span>
        )}
      </td>
      <td className="px-4 text-center align-middle">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={onViewHistory}
            className="h-9 rounded-xl border-violet-200 text-violet-700 hover:bg-violet-50 transition font-bold text-xs gap-1 cursor-pointer"
          >
            ইতিহাস
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            onClick={onCreateInvoice}
            className="h-9 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs gap-1 cursor-pointer shadow-sm"
          >
            নতুন রশিদ
          </Button>

          {isAdmin && (
            <Button
              variant="ghost"
              onClick={onDeleteCustomer}
              className="h-9 w-9 p-0 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="গ্রাহক মুছুন"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
