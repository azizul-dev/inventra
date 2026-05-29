"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingCart, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

/**
 * ProductTable Component
 * Displays a table with fully manual inputs for product name, quantity, unit, and unit price.
 * Desktop: elegant responsive table.
 * Mobile: stackable beautiful input cards to prevent horizontal scroll issues.
 */
export default function ProductTable({
  items,
  addItemRow,
  removeItemRow,
  handleItemFieldChange,
}) {
  const handleRemove = (index) => {
    if (items.length > 1) {
      removeItemRow(index);
    } else {
      toast.error("কমপক্ষে একটি পণ্য থাকা আবশ্যক");
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-violet-600" />
          পণ্যের বিবরণ
        </h3>
        <button
          type="button"
          onClick={addItemRow}
          className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50/50 px-4 py-2 text-xs font-bold text-violet-700 hover:bg-violet-50 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          পণ্য যোগ করুন
        </button>
      </div>

      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100">
        <Table>
          <TableHeader className="bg-gray-50/70">
            <TableRow>
              <TableHead className="w-[45%] font-bold text-gray-700">পণ্যের নাম</TableHead>
              <TableHead className="w-[15%] font-bold text-gray-700">পরিমাণ</TableHead>
              <TableHead className="w-[15%] font-bold text-gray-700">ইউনিট</TableHead>
              <TableHead className="w-[20%] font-bold text-gray-700">একক মূল্য (৳)</TableHead>
              <TableHead className="w-[5%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id || index} className="align-middle hover:bg-gray-50/20">
                <TableCell className="align-middle">
                  <Input
                    placeholder="পণ্যের নাম লিখুন"
                    className="h-11 rounded-xl"
                    value={item.productName || ""}
                    onChange={(e) =>
                      handleItemFieldChange(index, "productName", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <Input
                    type="text"
                    className="h-11 rounded-xl text-center"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemFieldChange(index, "quantity", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <Input
                    placeholder="বস্তা, কেজি, পিস"
                    className="h-11 rounded-xl"
                    value={item.unit || ""}
                    onChange={(e) =>
                      handleItemFieldChange(index, "unit", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <Input
                    type="text"
                    placeholder="যেমন: ৫২০"
                    className="h-11 rounded-xl font-bold"
                    value={item.sellPrice}
                    onChange={(e) =>
                      handleItemFieldChange(index, "sellPrice", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell className="text-center">
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-gray-400 hover:text-rose-600 transition cursor-pointer"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List View - Visible on Mobile only */}
      <div className="block md:hidden space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="rounded-2xl border border-gray-200 bg-gray-50/30 p-4 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg">
                পণ্য #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer bg-rose-50 px-2.5 py-1 rounded-lg"
              >
                <Trash2 className="h-3.5 w-3.5" />
                মুছুন
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">
                  পণ্যের নাম <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="পণ্যের নাম লিখুন"
                  className="h-11 rounded-xl bg-white border-gray-200"
                  value={item.productName || ""}
                  onChange={(e) =>
                    handleItemFieldChange(index, "productName", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500 text-center">
                    পরিমাণ
                  </label>
                  <Input
                    type="text"
                    className="h-11 rounded-xl text-center bg-white border-gray-200"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemFieldChange(index, "quantity", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500">
                    ইউনিট
                  </label>
                  <Input
                    placeholder="বস্তা/পিস"
                    className="h-11 rounded-xl bg-white border-gray-200"
                    value={item.unit || ""}
                    onChange={(e) =>
                      handleItemFieldChange(index, "unit", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500">
                    মূল্য (৳)
                  </label>
                  <Input
                    type="text"
                    placeholder="৫২০"
                    className="h-11 rounded-xl bg-white border-gray-200 font-bold"
                    value={item.sellPrice}
                    onChange={(e) =>
                      handleItemFieldChange(index, "sellPrice", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
