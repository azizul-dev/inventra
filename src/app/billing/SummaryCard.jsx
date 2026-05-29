"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { formatCurrency } from "./utils/billingHelpers";
import { useRouter } from "next/navigation";

/**
 * DiscountTaxCard Component (Optional section in form)
 * Renders flat discount and VAT percent inputs.
 */
export function DiscountTaxCard({ discount, setDiscount, vatPercent, setVatPercent }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm p-6 space-y-4">
      <h4 className="font-semibold text-violet-900 flex items-center gap-1.5 text-base border-b pb-3">
        <PlusCircle className="h-4 w-4" />
        ডিসকাউন্ট ও ট্যাক্স (ঐচ্ছিক)
      </h4>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            ফ্ল্যাট ডিসকাউন্ট (৳)
          </label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            className="h-12 rounded-xl bg-white border-violet-200"
            value={discount || ""}
            onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            ভ্যাট / VAT (%)
          </label>
          <Input
            type="number"
            min="0"
            max="100"
            placeholder="0"
            className="h-12 rounded-xl bg-white border-violet-200"
            value={vatPercent || ""}
            onChange={(e) =>
              setVatPercent(Math.max(0, Math.min(100, Number(e.target.value) || 0)))
            }
          />
        </div>
      </div>
    </div>
  );
}

/**
 * SummaryCard Component
 * Renders the calculations summary card and submit/cancel action buttons.
 */
export default function SummaryCard({
  subtotal,
  discount,
  vatPercent,
  grandTotal,
  paidAmount,
  dueAmount,
  isSubmitting,
  editBill = null,
}) {
  const router = useRouter();

  const parsedVatAmount = (subtotal * (Number(vatPercent) || 0)) / 100;
  const parsedPaidAmount = paidAmount === "" ? grandTotal : Number(paidAmount) || 0;
  const parsedDueAmount = Number(dueAmount) || 0;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50/75 p-6 space-y-4 shadow-sm border-l-4 border-l-cyan-500">
      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
        বিল হিসাব বিবরণ
      </h4>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 font-medium">সাবটোটাল</span>
          <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
        </div>

        {Number(vatPercent) > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">ভ্যাট ({vatPercent}%)</span>
            <span className="font-bold text-gray-900">{formatCurrency(parsedVatAmount)}</span>
          </div>
        )}

        {Number(discount) > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium text-rose-600">ডিসকাউন্ট</span>
            <span className="font-bold text-rose-600">- {formatCurrency(discount)}</span>
          </div>
        )}

        <div className="h-px bg-gray-200 my-2" />

        <div className="flex justify-between items-center">
          <span className="text-base font-bold text-gray-900">সর্বমোট (Grand Total)</span>
          <span className="text-2xl font-extrabold text-violet-600">
            {formatCurrency(grandTotal)}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-gray-500">পরিশোধিত টাকা:</span>
          <span className="font-bold text-green-600">{formatCurrency(parsedPaidAmount)}</span>
        </div>

        {parsedDueAmount > 0 && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-rose-500 font-bold">বকেয়া টাকা:</span>
            <span className="font-extrabold text-rose-600">{formatCurrency(parsedDueAmount)}</span>
          </div>
        )}
      </div>

      {/* Submission and Reset actions */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          type="submit"
          className="w-full h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-200 cursor-pointer text-sm"
          disabled={isSubmitting}
        >
          {editBill
            ? (isSubmitting ? "বিলটি আপডেট হচ্ছে..." : "✓ বিলটি আপডেট করুন")
            : (isSubmitting ? "বিলটি সংরক্ষণ হচ্ছে..." : "✓ বিলটি সংরক্ষণ করুন")}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 rounded-2xl border-gray-300 text-gray-600 cursor-pointer text-sm"
          onClick={() => {
            router.push("/customers");
          }}
          disabled={isSubmitting}
        >
          বাতিল করুন
        </Button>
      </div>
    </div>
  );
}
