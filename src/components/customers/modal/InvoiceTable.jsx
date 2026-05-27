import React from "react";
import { Eye, Download, FileText, Calendar, Receipt } from "lucide-react";
import { formatCurrency } from "../utils/invoiceCalculations";

/**
 * InvoiceTable Component
 * Renders list of invoices inside the customer profile.
 * Desktop: elegant responsive table.
 * Mobile: stack of receipt cards to prevent horizontal overflow inside modals.
 */
export default function InvoiceTable({ bills = [], onViewInvoice, onDownloadPDF }) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <FileText className="h-5 w-5 text-violet-500" />
        রশিদের তালিকা
      </h4>

      {/* DESKTOP TABLE VIEW - Hidden on Mobile */}
      <div className="hidden md:block overflow-hidden border border-gray-100 rounded-2xl max-h-[350px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-700 font-bold">
              <th className="p-3">তারিখ ও সময়</th>
              <th className="p-3">রশিদ আইডি</th>
              <th className="p-3">পণ্যের বিবরণ</th>
              <th className="p-3 text-right">মোট বিল</th>
              <th className="p-3 text-center">স্ট্যাটাস</th>
              <th className="p-3 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bills.map((bill, index) => {
              const dateStr = new Date(bill.createdAt).toLocaleDateString("bn-BD");
              const timeStr = new Date(bill.createdAt).toLocaleTimeString("bn-BD", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <tr key={bill._id || index} className="hover:bg-gray-50/50">
                  <td className="p-3">
                    <p className="font-semibold text-gray-800">{dateStr}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{timeStr}</p>
                  </td>
                  <td className="p-3 font-mono text-xs text-gray-500">
                    #{bill._id?.substring(18) || "NEW"}
                  </td>
                  <td className="p-3 text-xs text-gray-600 max-w-[200px] truncate">
                    {bill.items?.map((item) => `${item.productName} (${item.quantity} ${item.unit})`).join(", ")}
                  </td>
                  <td className="p-3 text-right font-bold text-gray-900">
                    {formatCurrency(bill.total)}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        bill.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {bill.status === "Paid" ? "Paid" : "Due"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onViewInvoice(bill)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition cursor-pointer"
                        title="বিল দেখুন"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDownloadPDF(bill)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition cursor-pointer"
                        title="পিডিএফ ডাউনলোড"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE LIST VIEW - Visible on Mobile only */}
      <div className="block md:hidden max-h-[350px] overflow-y-auto space-y-3 pr-1">
        {bills.map((bill, index) => {
          const dateStr = new Date(bill.createdAt).toLocaleDateString("bn-BD");
          const timeStr = new Date(bill.createdAt).toLocaleTimeString("bn-BD", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={bill._id || index}
              className="rounded-2xl border border-gray-200 bg-gray-50/20 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                  <Receipt className="h-3 w-3" />
                  #{bill._id?.substring(18) || "NEW"}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    bill.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {bill.status === "Paid" ? "Paid" : "Due"}
                </span>
              </div>

              <div className="text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>তারিখ: {dateStr} ({timeStr})</span>
                </div>
                
                <div className="text-gray-600 font-medium line-clamp-2">
                  <span className="font-bold text-gray-500">পণ্য:</span>{" "}
                  {bill.items?.map((item) => `${item.productName} (${item.quantity} ${item.unit})`).join(", ")}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                  <div className="text-sm font-extrabold text-gray-900">
                    মোট বিল: {formatCurrency(bill.total)}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewInvoice(bill)}
                      className="h-8 px-3 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      দেখুন
                    </button>
                    <button
                      onClick={() => onDownloadPDF(bill)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition cursor-pointer"
                      title="পিডিএফ"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
