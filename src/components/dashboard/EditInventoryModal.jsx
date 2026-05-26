"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const EditInventoryModal = ({ item }) => {
  const router = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const inventoryUpdate = {
      ...Object.fromEntries(formData.entries()),
      updatedAt: new Date(),
    };

    const {data:tokenData} = await authClient.token()
    const res = await fetch(
      `http://localhost:8000/inventoryUpdate/${item._id}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${tokenData?.token}`
        },
        body: JSON.stringify(inventoryUpdate),
      },
    );

    const data = await res.json();

    if (data.modifiedCount > 0) {
      toast.success("Product updated successfully");
      router.refresh();
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-gray-600 transition hover:bg-blue-50 hover:text-blue-600">
            <Pencil className="h-4 w-4" />
          </button>
        </DialogTrigger>

        <DialogContent className="h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit Inventory
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Product Name
              </label>

              <Input
                name="productName"
                defaultValue={item.productName}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <Input
                  name="category"
                  defaultValue={item.category}
                  className="h-12 rounded-xl"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Unit</label>

                <Input
                  name="unit"
                  defaultValue={item.unit}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Buy Price
                </label>

                <Input
                  name="buyPrice"
                  defaultValue={item.buyPrice}
                  className="h-12 rounded-xl"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Sell Price
                </label>

                <Input
                  name="sellPrice"
                  defaultValue={item.sellPrice}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            {/* STOCK */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Current Stock
                </label>

                <Input
                  name="stock"
                  defaultValue={item.stock}
                  className="h-12 rounded-xl"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Minimum Stock
                </label>

                <Input
                  name="minimumStock"
                  defaultValue={item.minimumStock}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            {/* DATE */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Inventory Date
              </label>

              <Input
                name="date"
                type="date"
                defaultValue={
                  item.date
                    ? new Date(item.date).toISOString().split("T")[0]
                    : ""
                }
                className="h-12 rounded-xl"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <Textarea
                name="description"
                defaultValue={item.description}
                className="min-h-[120px] rounded-2xl"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button type="submit" className="rounded-xl">
                Update Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditInventoryModal;
