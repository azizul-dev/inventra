"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Package,
  DollarSign,
  Boxes,
  FileText,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const AddInventoryPage = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      productName: "",
      category: "",
      unit: "",
      brand: "",
      buyPrice: "",
      sellPrice: "",
      stock: "",
      minimumStock: "",
      date: "",
      description: "",
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const addInventory = Object.fromEntries(
      formData.entries()
    );

    const {data:tokenData} = await authClient.token()

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/addInventory`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${tokenData?.token}`
        },
        body: JSON.stringify(addInventory),
      }
    );

    const data = await res.json();

     if (data.insertedId) {
      toast.success("Inventory added successfully");

      router.refresh();
    }
   
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
       
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900">
          Add Inventory
        </h1>

        <p className="mt-2 text-gray-500">
          নতুন পণ্য যোগ করুন এবং স্টক ম্যানেজ করুন
        </p>
      </div>

       
      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="h-1 bg-[linear-gradient(90deg,#8b5cf6,#06b6d4,#f59e0b,#ec4899,#3b82f6,#8b5cf6)] bg-[length:300%_100%] animate-gradient" />

        <div className="p-6 md:p-8">
          <Form {...form}>
            <form
              onSubmit={onSubmit}
              className="space-y-8"
            >
             
              <div>
                <div className="mb-5 flex items-center gap-2">
                  <Package className="h-5 w-5 text-violet-600" />

                  <h2 className="text-lg font-semibold">
                    Product Information
                  </h2>
                </div>

                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          পণ্যের নাম
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="যেমন: রড ১২মিমি"
                            className="h-12 rounded-xl"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            ক্যাটাগরি
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder="সিমেন্ট"
                              className="h-12 rounded-xl"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            ইউনিট
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder="বস্তা"
                              className="h-12 rounded-xl"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          ব্র্যান্ড
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="BSRM"
                            className="h-12 rounded-xl"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

               
              <div>
                <div className="mb-5 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-sky-600" />

                  <h2 className="text-lg font-semibold">
                    Pricing
                  </h2>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="buyPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          কেনার দাম
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="৳ ১০০০"
                            className="h-12 rounded-xl"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sellPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          বিক্রয় দাম
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="৳ ১২০০"
                            className="h-12 rounded-xl"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

               
              <div>
                <div className="mb-5 flex items-center gap-2">
                  <Boxes className="h-5 w-5 text-amber-600" />

                  <h2 className="text-lg font-semibold">
                    Stock Management
                  </h2>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          বর্তমান স্টক
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="৫০ বস্তা"
                            className="h-12 rounded-xl"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minimumStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          সর্বনিম্ন স্টক
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="১০ বস্তা"
                            className="h-12 rounded-xl"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              
              <div>
                <div className="mb-5 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-pink-600" />

                  <h2 className="text-lg font-semibold">
                    Inventory Date
                  </h2>
                </div>

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        তারিখ
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="date"
                          className="h-12 rounded-xl"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              
              <div>
                <div className="mb-5 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />

                  <h2 className="text-lg font-semibold">
                    Description
                  </h2>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        বিস্তারিত
                      </FormLabel>

                      <FormControl>
                        <Textarea
                          placeholder="পণ্যের বিস্তারিত লিখুন..."
                          className="min-h-[140px] rounded-2xl"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="h-12 rounded-xl px-8 cursor-pointer"
                >
                  Submit
                </Button>

                <Button
                  type="reset"
                  variant="outline"
                  className="h-12 rounded-xl px-8 cursor-pointer"
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddInventoryPage;