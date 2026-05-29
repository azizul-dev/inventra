"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

/**
 * CustomerForm Component
 * Renders customer details inputs and manual payment/due amounts.
 */
export default function CustomerForm({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerAddress,
  setCustomerAddress,
  paidAmount,
  setPaidAmount,
  dueAmount,
  setDueAmount,
  grandTotal,
  uniqueCustomers = [],
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm p-6 space-y-6">
      <div className="border-b pb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <User className="h-5 w-5 text-violet-600" />
          গ্রাহকের তথ্য
        </h3>

        {/* Past Customer Autocomplete Dropdown */}
        {uniqueCustomers.length > 0 && (
          <div className="w-full md:w-72">
            <select
              className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs focus:outline-none"
              onChange={(e) => {
                const val = e.target.value;
                if (val === "new") {
                  setCustomerName("");
                  setCustomerPhone("");
                  setCustomerAddress("");
                } else {
                  const cust = uniqueCustomers.find(
                    (c) => (c.phone || c.name.toLowerCase()) === val
                  );
                  if (cust) {
                    setCustomerName(cust.name);
                    setCustomerPhone(cust.phone || "");
                    setCustomerAddress(cust.address || "");
                  }
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>
                -- পূর্ববর্তী গ্রাহক সিলেক্ট করুন --
              </option>
              <option value="new">+ নতুন গ্রাহক</option>
              {uniqueCustomers.map((cust, idx) => (
                <option key={idx} value={cust.phone || cust.name.toLowerCase()}>
                  {cust.name} {cust.phone ? `(${cust.phone})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            গ্রাহকের নাম <span className="text-rose-500">*</span>
          </label>
          <Input
            placeholder="যেমন: জনাব করিম উদ্দিন"
            className="h-12 rounded-xl border-gray-200 focus:border-violet-500"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            মোবাইল নম্বর
          </label>
          <Input
            placeholder="যেমন: 017XXXXXXXX"
            className="h-12 rounded-xl border-gray-200 focus:border-violet-500"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            ঠিকানা
          </label>
          <Input
            placeholder="যেমন: মিরপুর, ঢাকা"
            className="h-12 rounded-xl border-gray-200 focus:border-violet-500"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
          />
        </div>

        {/* Fully Manual Payments Setup */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              পরিশোধিত টাকা (৳)
            </label>
            <Input
              type="text"
              placeholder="৳ যেমন: ৫২০"
              className="h-12 rounded-xl border-gray-200 focus:border-violet-500 text-green-700 font-bold"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              বকেয়া টাকা (৳)
            </label>
            <Input
              type="text"
              placeholder="৳ যেমন: ০"
              className="h-12 rounded-xl border-gray-200 focus:border-violet-500 text-rose-600 font-bold bg-white"
              value={dueAmount}
              onChange={(e) => setDueAmount(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
