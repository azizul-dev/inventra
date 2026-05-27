import React from "react";
import { formatCurrency, formatDate } from "../utils/invoiceCalculations";

/**
 * PrintableInvoice Component
 * Renders a pixel-perfect, clean A4 printable invoice sheet.
 * Includes absolute decorators, branding, item tables, summary totals, and stamp signatures.
 */
export default function PrintableInvoice({ invoice }) {
  if (!invoice) return null;

  const dateStr = formatDate(invoice.createdAt);
  const subtotal = invoice.items?.reduce((sum, item) => sum + (item.quantity * item.sellPrice), 0) || 0;
  const discount = Math.max(0, subtotal - (invoice.total || 0));

  return (
    <div
      id="printable-customer-invoice"
      className="border border-gray-100 rounded-2xl bg-white p-4 sm:p-8 shadow-sm flex flex-col justify-between min-h-[550px] relative overflow-hidden font-sans no-print-shadow text-gray-900"
    >
      {/* Invoice Watermark Decorator */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-violet-50/30 -mr-20 -mt-20 pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b pb-6 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">INVENTRA STORE</h1>
            <p className="text-sm text-gray-500 mt-1">প্রফেশনাল ইনভেন্টরি ও বিলিং সিস্টেম</p>
            <p className="text-xs text-gray-400 mt-2">ঢাকা, বাংলাদেশ</p>
            <p className="text-xs text-gray-400">মোবাইল: +৮৮০১৭১২-৩৪৫৬৭৮</p>
          </div>

          <div className="text-left md:text-right">
            <h2 className="text-2xl font-black text-violet-600 tracking-wider">INVOICE</h2>
            <p className="text-sm font-semibold text-gray-700 mt-2">
              ইনভয়েস নং: <span className="font-mono text-xs text-gray-500">#{invoice._id?.substring(18) || "NEW"}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">তারিখ: {dateStr}</p>
            <span
              className={`inline-flex items-center rounded-full mt-3 px-3 py-0.5 text-xs font-bold ${
                invoice.status === "Paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {invoice.status === "Paid" ? "Paid (পরিশোধিত)" : "Due (বকেয়া)"}
            </span>
          </div>
        </div>

        {/* Bill To */}
        <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b py-4">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">গ্রাহকের বিবরণ</h4>
            <div className="mt-2 space-y-1">
              <p className="text-base font-bold text-gray-900">{invoice.customerName}</p>
              {invoice.customerPhone && (
                <p className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span className="font-semibold text-gray-500">মোবাইল:</span> {invoice.customerPhone}
                </p>
              )}
              {invoice.customerAddress && (
                <p className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-500">ঠিকানা:</span> {invoice.customerAddress}
                </p>
              )}
            </div>
          </div>
          <div className="flex md:justify-end md:items-end">
            <div className="text-left md:text-right text-xs text-gray-500 space-y-1">
              <p>
                <span className="font-semibold text-gray-600">বিল তৈরি:</span>{" "}
                {new Date(invoice.createdAt).toLocaleString("bn-BD")}
              </p>
              {invoice.updatedAt && (
                <p>
                  <span className="font-semibold text-gray-500">সর্বশেষ আপডেট:</span>{" "}
                  {new Date(invoice.updatedAt).toLocaleString("bn-BD")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Items Table - Highly readable on PDF */}
        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-left font-bold text-gray-700">
                <th className="p-3 text-center w-12">#</th>
                <th className="p-3">পণ্যের বিবরণ</th>
                <th className="p-3 text-center">পরিমাণ</th>
                <th className="p-3 text-center">ইউনিট</th>
                <th className="p-3 text-right">একক মূল্য</th>
                <th className="p-3 text-right w-32">মোট মূল্য</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.items?.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="p-3 text-center text-gray-500 font-mono">{idx + 1}</td>
                  <td className="p-3 font-semibold text-gray-900">{item.productName}</td>
                  <td className="p-3 text-center text-gray-700">{item.quantity}</td>
                  <td className="p-3 text-center text-gray-600">{item.unit}</td>
                  <td className="p-3 text-right text-gray-700">{formatCurrency(item.sellPrice)}</td>
                  <td className="p-3 text-right font-bold text-gray-900">
                    {formatCurrency(item.quantity * item.sellPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations Summary */}
        <div className="mt-8 flex justify-end">
          <div className="w-72 space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between items-center text-gray-500">
              <span>সাবটোটাল</span>
              <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between items-center text-rose-600">
                <span>ডিসকাউন্ট</span>
                <span className="font-bold">- {formatCurrency(discount)}</span>
              </div>
            )}
            <div className="h-px bg-gray-100 my-1" />
            <div className="flex justify-between items-center text-base font-bold">
              <span className="text-gray-800">সর্বমোট বিল</span>
              <span className="text-violet-600 font-black text-lg">{formatCurrency(invoice.total)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-green-600">
              <span>পরিশোধিত টাকা</span>
              <span className="font-bold">{formatCurrency(invoice.paidAmount)}</span>
            </div>
            {invoice.dueAmount > 0 && (
              <div className="flex justify-between items-center text-xs text-rose-600 font-bold animate-pulse">
                <span>বকেয়া টাকা</span>
                <span className="font-bold">{formatCurrency(invoice.dueAmount)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Signature */}
      <div className="mt-16 flex justify-between items-end border-t pt-12">
        <div className="text-xs text-gray-400">
          <p className="font-semibold text-gray-500">নোট / শর্তাবলি:</p>
          <p className="mt-1">১. বিক্রিত মাল ফেরত নেওয়া হয় না।</p>
          <p>২. বিলটি সিস্টেমে স্বয়ংক্রিয়ভাবে জেনারেট করা হয়েছে।</p>
        </div>

        <div className="text-center w-48 font-semibold">
          <div className="h-px bg-gray-300 w-full mb-2" />
          <p className="text-xs font-bold text-gray-700">অনুমোদিত স্বাক্ষর</p>
          <p className="text-[10px] text-gray-400">ইনভেন্ট্রা স্টোর</p>
        </div>
      </div>
    </div>
  );
}
