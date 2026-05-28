import Link from "next/link";

import {
  Boxes,
  Wallet,
  TriangleAlert,
  Plus,
  Package,
} from "lucide-react";

import EditInventoryModal from "@/components/dashboard/EditInventoryModal";
import DeleteModal from "@/components/dashboard/DeleteModal";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const InventoryPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const {token} = await auth.api.getToken({
    headers: await headers()
  })


  const isAdmin = session?.user?.role === "admin";

  let inventory = [];
  let errorMsg = "";

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/inventory`, {
      headers: {
        authorization: `Bearer ${token}`
      },
      next: { revalidate: 0 }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        inventory = data;
      } else {
        errorMsg = "স্টক ডেটা সঠিক ফরম্যাটে পাওয়া যায়নি।";
      }
    } else {
      errorMsg = `সার্ভার ত্রুটি কোড: ${res.status}`;
    }
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
    errorMsg = "সার্ভার থেকে স্টক লোড করা যায়নি। অনুগ্রহ করে সার্ভার কানেকশন অথবা NEXT_PUBLIC_SERVER_URL চেক করুন।";
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Inventory Management
          </h1>

          <p className="mt-2 text-gray-500">
            আপনার সকল পণ্যের স্টক এবং মূল্য দেখুন
          </p>
        </div>

        {isAdmin && (
          <Link
            href="/add-inventory"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-black px-6 text-sm font-semibold text-white transition hover:scale-[1.02]"
          >
            <Plus className="h-5 w-5" />

            <span>নতুন স্টক যোগ করুন</span>
          </Link>
        )}
      </div>

      {errorMsg ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center max-w-2xl mx-auto shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4 animate-bounce">
            <TriangleAlert className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-rose-900 mb-2">স্টক লোড করতে সমস্যা হয়েছে</h2>
          <p className="text-sm text-rose-700 leading-relaxed">{errorMsg}</p>
        </div>
      ) : inventory.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center max-w-2xl mx-auto shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600 mb-4">
            <Boxes className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">স্টক খালি</h2>
          <p className="text-sm text-gray-500 mb-6">আপনার ইনভেন্টরিতে কোনো পণ্য যোগ করা হয়নি।</p>
          {isAdmin && (
            <Link
              href="/add-inventory"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-black px-6 text-sm font-semibold text-white transition hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              <span>প্রথম স্টক যোগ করুন</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {inventory.map((item) => {
            const stock = Number(item.stock);

          const minimumStock = Number(item.minimumStock);

          const lowStock = stock <= minimumStock;

          return (
            <div
              key={item._id}
              className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.25),0_0_45px_rgba(59,130,246,0.25)]"
            >
              <div className="h-1 w-full bg-[linear-gradient(90deg,#8b5cf6,#06b6d4,#f59e0b,#ec4899,#3b82f6,#8b5cf6)] bg-[length:300%_100%] animate-gradient" />

              <div className="space-y-5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {item.category}
                    </span>

                    <h2 className="mt-4 line-clamp-2 break-words text-3xl font-bold text-gray-900">
                      {item.productName}
                    </h2>

                    <div className="mt-3 flex items-center gap-2 text-gray-500">
                      <p className="mt-2 text-xs text-gray-400">
                        যোগ হয়েছে:{" "}
                        {new Date(item.createdAt).toLocaleDateString("bn-BD")}
                      </p>

                      <p className="text-xs text-gray-400">
                        আপডেট:{" "}
                        {new Date(item.updatedAt).toLocaleDateString("bn-BD")}
                      </p>

                      <Package className="h-4 w-4" />

                      <span className="text-sm">ইউনিট: {item.unit}</span>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <EditInventoryModal item={item} />
                      <DeleteModal item={item} />
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-3 flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-500">বর্তমান স্টক</p>

                      <h3
                        className={`mt-1 text-2xl font-bold ${
                          stock === 0
                            ? "text-red-700"
                            : lowStock
                              ? "text-amber-600"
                              : "text-green-700"
                        }`}
                      >
                        {item.stock} {item.unit}
                      </h3>
                    </div>

                    <Boxes
                      className={`h-6 w-6 ${
                        stock === 0
                          ? "text-red-600"
                          : lowStock
                            ? "text-amber-500"
                            : "text-green-700"
                      }`}
                    />
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${
                        stock === 0
                          ? "bg-red-600"
                          : lowStock
                            ? "bg-amber-500"
                            : "bg-green-700"
                      }`}
                      style={{
                        width: stock === 0 ? "5%" : lowStock ? "35%" : "80%",
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">কেনার দাম</p>

                    <div className="mt-2 flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-gray-500" />

                      <h4 className="text-lg font-bold">৳ {item.buyPrice}</h4>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">বিক্রয় দাম</p>

                    <div className="mt-2 flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-gray-500" />

                      <h4 className="text-lg font-bold">৳ {item.sellPrice}</h4>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  {stock === 0 ? (
                    <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                      <TriangleAlert className="h-4 w-4" />
                      <span>স্টক শেষ</span>
                    </div>
                  ) : lowStock ? (
                    <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                      <TriangleAlert className="h-4 w-4" />
                      <span>কম স্টক</span>
                    </div>
                  ) : (
                    <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                      ✓ স্টক আছে
                    </div>
                  )}

                  {isAdmin && (
                    <Link
                      href="/add-inventory"
                      className="flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                      <span>স্টক যোগ</span>
                    </Link >
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};

export default InventoryPage;