"use client";

import React from "react";
import { User } from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "./utils/billingHelpers";

/**
 * InvoicePreview Component
 * Renders either a live sidebar preview or a full-blown detailed invoice preview for printing/PDF.
 */
export default function InvoicePreview({
  customerName = "",
  customerPhone = "",
  customerAddress = "",
  items = [],
  subtotal = 0,
  discount = 0,
  vatPercent = 0,
  grandTotal = 0,
  paidAmount = "",
  dueAmount = "",
  isLivePreview = false,
  invoiceData = null, // Used when rendering a saved invoice in the modal
}) {
  // Extract values depending on whether it's active live state or saved database record
  const name = invoiceData ? invoiceData.customerName : customerName;
  const phone = invoiceData ? invoiceData.customerPhone : customerPhone;
  const address = invoiceData ? invoiceData.customerAddress : customerAddress;
  const listItems = invoiceData ? invoiceData.items : items;
  const tot = invoiceData ? invoiceData.total : grandTotal;
  
  const rawPaid = invoiceData ? invoiceData.paidAmount : paidAmount;
  const paid = rawPaid === "" ? tot : Number(rawPaid) || 0;
  
  const due = invoiceData ? invoiceData.dueAmount : (dueAmount === "" ? 0 : Number(dueAmount));
  const status = invoiceData ? invoiceData.status : (due === 0 ? "Paid" : "Due");
  const createdAt = invoiceData ? invoiceData.createdAt : new Date();
  const invoiceId = invoiceData ? invoiceData._id?.substring(18) : "NEW";

  const sub = invoiceData
    ? listItems?.reduce((sum, item) => sum + (item.quantity * item.sellPrice), 0)
    : subtotal;

  const disc = invoiceData ? Math.max(0, sub - tot) : discount;

  // Filter out items with blank names for the live preview to keep it clean
  const activeItems = listItems.filter((item) => item.productName && item.productName.trim());

  if (isLivePreview) {
    return (
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md p-6 relative font-sans border-t-4 border-t-violet-600">
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-violet-600">
              রশিদ লাইভ প্রিভিউ
            </h4>
            <h3 className="text-xl font-extrabold text-gray-900 mt-1">INVENTRA STORE</h3>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              due === 0 ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"
            }`}
          >
            {due === 0 ? "Paid (পরিশোধিত)" : "Due (বকেয়া)"}
          </span>
        </div>

        {/* Customer Info Card Inside Live Receipt */}
        <div className="bg-gray-50/50 rounded-2xl p-4 border border-dashed border-gray-200 space-y-2 mb-4">
          <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <User className="h-4 w-4 text-gray-400" />
            <span>গ্রাহক: {name.trim() || "(নাম লিখুন)"}</span>
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1.5">
            <span className="font-semibold text-gray-400">মোবাইল:</span>{" "}
            <span>{phone.trim() || "(মোবাইল নম্বর লিখুন)"}</span>
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1.5">
            <span className="font-semibold text-gray-400">ঠিকানা:</span>{" "}
            <span>{address.trim() || "(ঠিকানা লিখুন)"}</span>
          </p>
        </div>

        {/* Live Receipt Items list */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            পণ্যের তালিকা
          </h5>

          <div className="max-h-[220px] overflow-y-auto pr-1 space-y-2.5">
            {activeItems.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-4">
                কোনো পণ্য যোগ করা হয়নি
              </p>
            ) : (
              activeItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex justify-between items-start text-xs border-b border-gray-100 pb-2"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-gray-900">{item.productName}</p>
                    <p className="text-[10px] text-gray-500">
                      {item.quantity} {item.unit} × {formatCurrency(item.sellPrice)}
                    </p>
                  </div>
                  <span className="font-bold text-gray-800">
                    {formatCurrency(item.quantity * item.sellPrice)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full A4 Invoice View
  return (
    <div
      id="printable-invoice"
      className="border border-gray-100 rounded-2xl bg-white p-8 shadow-sm flex flex-col justify-between min-h-[550px] relative overflow-hidden font-sans"
    >
      {/* Invoice Watermark Decorator */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-violet-50/30 -mr-20 -mt-20 pointer-events-none" />

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
            ইনভয়েস নং: <span className="font-mono text-xs text-gray-500">#{invoiceId}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">তারিখ: {formatDate(createdAt)}</p>
          <span
            className={`inline-flex items-center rounded-full mt-3 px-3 py-0.5 text-xs font-bold ${
              status === "Paid" ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"
            }`}
          >
            {status === "Paid" ? "Paid (পরিশোধিত)" : "Due (বকেয়া)"}
          </span>
        </div>
      </div>

      {/* Bill To */}
      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b py-4 my-6">
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
            গ্রাহকের বিবরণ
          </h4>
          <div className="mt-2 space-y-1">
            <p className="text-base font-bold text-gray-900">{name || "(নামহীন গ্রাহক)"}</p>
            {phone && (
              <p className="text-xs text-gray-600 flex items-center gap-1.5">
                <span className="font-semibold text-gray-500">মোবাইল:</span> {phone}
              </p>
            )}
            {address && (
              <p className="text-xs text-gray-600">
                <span className="font-semibold text-gray-500">ঠিকানা:</span> {address}
              </p>
            )}
          </div>
        </div>
        <div className="flex md:justify-end md:items-end">
          <div className="text-left md:text-right">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-600">বিল তৈরি:</span>{" "}
              {formatDateTime(createdAt)}
            </p>
            {invoiceData?.updatedAt && (
              <p className="text-xs text-gray-400 mt-1">
                <span className="font-semibold text-gray-500">সর্বশেষ আপডেট:</span>{" "}
                {formatDateTime(invoiceData.updatedAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
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
            {activeItems.map((item, idx) => (
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
            {activeItems.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                  কোনো পণ্যের বিবরণ দেওয়া হয়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Calculations Summary */}
      <div className="mt-8 flex justify-end">
        <div className="w-72 space-y-2 text-sm border-t pt-4">
          <div className="flex justify-between items-center text-gray-500">
            <span>সাবটোটাল</span>
            <span className="font-semibold text-gray-900">{formatCurrency(sub)}</span>
          </div>
          {disc > 0 && (
            <div className="flex justify-between items-center text-rose-600">
              <span>ডিসকাউন্ট</span>
              <span className="font-bold">- {formatCurrency(disc)}</span>
            </div>
          )}
          {Number(vatPercent) > 0 && !invoiceData && (
            <div className="flex justify-between items-center text-gray-500">
              <span>ভ্যাট ({vatPercent}%)</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency((sub * vatPercent) / 100)}
              </span>
            </div>
          )}
          <div className="h-px bg-gray-100 my-1" />
          <div className="flex justify-between items-center text-base font-bold">
            <span className="text-gray-800">সর্বমোট বিল</span>
            <span className="text-violet-600 font-black text-lg">{formatCurrency(tot)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-green-600">
            <span>পরিশোধিত টাকা</span>
            <span className="font-bold">{formatCurrency(paid)}</span>
          </div>
          {due > 0 && (
            <div className="flex justify-between items-center text-xs text-rose-600 font-bold">
              <span>বকেয়া টাকা</span>
              <span className="font-bold">{formatCurrency(due)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Signature */}
      <div className="mt-16 flex justify-between items-end border-t pt-12">
        <div className="text-xs text-gray-400">
          <p className="font-semibold text-gray-500">নোট / শর্তাবলি:</p>
          <p className="mt-1">১. বিক্রিত মাল ফেরত নেওয়া হয় না।</p>
          <p>২. বিলটি সিস্টেমে স্বয়ংক্রিয়ভাবে জেনারেট করা হয়েছে।</p>
        </div>

        <div className="text-center w-48">
          <div className="h-px bg-gray-300 w-full mb-2" />
          <p className="text-xs font-bold text-gray-700">অনুমোদিত স্বাক্ষর</p>
          <p className="text-[10px] text-gray-400">ইনভেন্ট্রা স্টোর</p>
        </div>
      </div>
    </div>
  );
}
