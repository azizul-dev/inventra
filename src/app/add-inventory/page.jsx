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

import { Package, DollarSign, Boxes, FileText } from "lucide-react";

const AddInventoryPage = () => {
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
      description: "",
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const addInventory = Object.fromEntries(formData.entries());

    const res = await fetch("http://localhost:8000/addInventory", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(addInventory),
    });
    const data = await res.json();

    console.log(data);
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
     
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900">Add Inventory</h1>

        <p className="mt-2 text-gray-500">
          নতুন পণ্য যোগ করুন এবং স্টক ম্যানেজ করুন
        </p>
      </div>


      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="h-1 bg-gradient-to-r from-violet-500 via-sky-500 to-amber-500 bg-[length:200%_200%] animate-gradient" />

        <div className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8">
             
              <div>
                <div className="mb-5 flex items-center gap-2">
                  <Package className="h-5 w-5 text-violet-600" />

                  <h2 className="text-lg font-semibold">Product Information</h2>
                </div>

                <div className="space-y-5">
                 
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পণ্যের নাম / Product Name</FormLabel>

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
                          <FormLabel>ক্যাটাগরি / Category</FormLabel>

                          <FormControl>
                            <Input
                              placeholder="সিমেন্ট, লোহা"
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
                          <FormLabel>ইউনিট / Unit</FormLabel>

                          <FormControl>
                            <Input
                              placeholder="কেজি, পিস"
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
                        <FormLabel>ব্র্যান্ড / Brand</FormLabel>

                        <FormControl>
                          <Input
                            placeholder="যেমন: BSRM"
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

                  <h2 className="text-lg font-semibold">Pricing</h2>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                 
                  <FormField
                    control={form.control}
                    name="buyPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>কেনার দাম / Buy Price</FormLabel>

                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
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
                        <FormLabel>বিক্রয় দাম / Sell Price</FormLabel>

                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
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

                  <h2 className="text-lg font-semibold">Stock Management</h2>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
               
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>বর্তমান স্টক / Current Stock</FormLabel>

                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
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
                        <FormLabel>সর্বনিম্ন স্টক / Minimum Stock</FormLabel>

                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
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
                  <FileText className="h-5 w-5 text-emerald-600" />

                  <h2 className="text-lg font-semibold">Description</h2>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>বিস্তারিত / Description</FormLabel>

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
                <Button type="submit" className="h-12 rounded-xl px-8 cursor-pointer">
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
