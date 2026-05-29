"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  Plus,
  Trash2,
  ChevronDown,
  PackageSearch,
} from "lucide-react";
import { toast } from "sonner";

/**
 * ProductDropdown - Searchable dropdown for inventory products
 */
function ProductDropdown({ value, inventory, index, handleItemFieldChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value || "");
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sync search text if value changes externally
  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  const filtered = inventory.filter(
    (p) =>
      !search.trim() ||
      p.productName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (product) => {
    handleItemFieldChange(index, "productName", product.productName);
    handleItemFieldChange(index, "sellPrice", product.sellPrice);
    handleItemFieldChange(index, "unit", product.unit);
    setSearch(product.productName);
    setOpen(false);
  };

  const stockColor = (stock, min) => {
    if (stock === 0) return "text-red-600";
    if (stock <= min) return "text-amber-600";
    return "text-green-600";
  };

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <Input
          placeholder="পণ্য খুঁজুন বা বেছে নিন..."
          className="h-11 rounded-xl pr-8"
          value={search}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
            // If user clears the field, clear the selection
            if (!e.target.value) {
              handleItemFieldChange(index, "productName", "");
            }
          }}
        />
        <ChevronDown
          className={`absolute right-2.5 top-3 h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-gray-400">
              <PackageSearch className="h-6 w-6" />
              <span>কোনো পণ্য পাওয়া যায়নি</span>
            </div>
          ) : (
            <ul className="max-h-52 overflow-y-auto divide-y divide-gray-50">
              {filtered.map((product) => {
                const outOfStock = Number(product.stock) === 0;
                return (
                  <li
                    key={product._id}
                    onClick={() => !outOfStock && handleSelect(product)}
                    className={`flex items-center justify-between gap-3 px-4 py-3 transition
                      ${
                        outOfStock
                          ? "cursor-not-allowed opacity-50 bg-gray-50"
                          : "cursor-pointer hover:bg-violet-50/60"
                      }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {product.productName}
                      </p>
                      <p className="text-xs text-gray-400">
                        বিক্রয় মূল্য: ৳{product.sellPrice} · ইউনিট:{" "}
                        {product.unit}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span
                        className={`text-xs font-bold ${stockColor(
                          Number(product.stock),
                          Number(product.minimumStock),
                        )}`}
                      >
                        {outOfStock
                          ? "স্টক শেষ"
                          : `${product.stock} ${product.unit}`}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * ProductTable Component
 * Desktop: elegant responsive table with inventory dropdown.
 * Mobile: stackable card view.
 */
export default function ProductTable({
  items,
  inventory = [],
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
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-4 md:p-6 space-y-6">
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

      {/* Desktop Table View */}
      <div
        className="hidden md:block rounded-2xl border border-gray-100"
        style={{ overflowX: "visible", overflow: "visible" }}
      >
        <Table style={{ overflow: "visible" }}>
          <TableHeader className="bg-gray-50/70">
            <TableRow>
              <TableHead className="w-[40%] font-bold text-gray-700">
                পণ্যের নাম
              </TableHead>
              <TableHead className="w-[15%] font-bold text-gray-700">
                পরিমাণ
              </TableHead>
              <TableHead className="w-[15%] font-bold text-gray-700">
                ইউনিট
              </TableHead>
              <TableHead className="w-[20%] font-bold text-gray-700">
                একক মূল্য (৳)
              </TableHead>
              <TableHead className="w-[5%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={item.id || index}
                className="align-middle hover:bg-gray-50/20"
              >
                <TableCell className="align-middle">
                  <ProductDropdown
                    value={item.productName}
                    inventory={inventory}
                    index={index}
                    handleItemFieldChange={handleItemFieldChange}
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

      {/* Mobile Card View */}
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
                <ProductDropdown
                  value={item.productName}
                  inventory={inventory}
                  index={index}
                  handleItemFieldChange={handleItemFieldChange}
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
