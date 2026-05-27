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
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm p-6 space-y-6">
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

      <div className="overflow-x-auto rounded-2xl border border-gray-100">
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
              <TableRow key={item.id} className="align-middle hover:bg-gray-50/20">
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
                    type="number"
                    min="1"
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
                    type="number"
                    min="0"
                    className="h-11 rounded-xl"
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
    </div>
  );
}
