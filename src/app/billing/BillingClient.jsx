"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { ReceiptText } from "lucide-react";

// Subcomponents
import CustomerForm from "./CustomerForm";
import ProductTable from "./ProductTable";
import SummaryCard, { DiscountTaxCard } from "./SummaryCard";
import InvoicePreview from "./InvoicePreview";
import InvoiceModal from "./InvoiceModal";

// Hooks & Utilities
import useBillingCalculations, {
  parseNum,
} from "./hooks/useBillingCalculations";

export default function BillingClient({
  session,
  token,
  initialInventory = [],
  initialBillingList = [],
  prefillName = "",
  prefillPhone = "",
  prefillAddress = "",
  editBill = null,
}) {
    console.log("📦 inventory:", initialInventory); // ✅ এই লাইনটা যোগ করুন

  const router = useRouter();
  const [billingList, setBillingList] = useState(initialBillingList);

  // Invoice Details Modal State (used for rendering printing layout and downloading PDF)
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize custom hook
  const {
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerAddress,
    setCustomerAddress,
    items,
    discount,
    setDiscount,
    vatPercent,
    setVatPercent,
    paidAmount,
    setPaidAmount,
    dueAmount,
    setDueAmount,
    subtotal,
    grandTotal,
    addItemRow,
    removeItemRow,
    handleItemFieldChange,
    resetForm,
  } = useBillingCalculations({
    prefillName,
    prefillPhone,
    prefillAddress,
    editBill,
  });

  // Extract unique customers for auto-populate lookup
  const uniqueCustomers = useMemo(() => {
    const map = {};
    billingList.forEach((bill) => {
      const phone = bill.customerPhone?.trim() || "";
      const name = bill.customerName?.trim() || "";
      const key = phone ? phone : name.toLowerCase();

      if (!map[key]) {
        map[key] = {
          name: bill.customerName,
          phone: bill.customerPhone || "",
          address: bill.customerAddress || "",
        };
      }
    });
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  }, [billingList]);

  // Submit Invoice Handler
  const handleCreateInvoice = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error("গ্রাহকের নাম আবশ্যক");
      return;
    }

    const invalidItem = items.find((item) => !item.productName.trim());
    if (invalidItem) {
      toast.error("সবগুলো পণ্যের নাম সঠিক হতে হবে");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: tokenData } = await authClient.token();
      const payload = {
        customerName: customerName.trim(),
        customerAddress: customerAddress.trim(),
        customerPhone: customerPhone.trim(),
        status: parseNum(dueAmount) === 0 ? "Paid" : "Due",
        items: items.map((item) => ({
          productName: item.productName.trim(),
          quantity: parseNum(item.quantity) || 1,
          unit: item.unit.trim() || "pcs",
          sellPrice: parseNum(item.sellPrice) || 0,
        })),
        total: grandTotal,
        paidAmount: paidAmount === "" ? grandTotal : parseNum(paidAmount),
        dueAmount: parseNum(dueAmount) || 0,
      };

      const baseUrl =
        !process.env.NEXT_PUBLIC_SERVER_URL ||
        process.env.NEXT_PUBLIC_SERVER_URL.includes("localhost:8000")
          ? "/api"
          : process.env.NEXT_PUBLIC_SERVER_URL;

      const url = editBill ? `${baseUrl}/billing/${editBill._id}` : `${baseUrl}/addBilling`;
      const method = editBill ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(editBill ? "বিলটি সফলভাবে আপডেট করা হয়েছে!" : "বিলটি সফলভাবে তৈরি করা হয়েছে!");

        // Reset form
        resetForm();

        // Refresh Server Page data and redirect
        router.refresh();
        router.push("/customers");
      } else {
        toast.error(data.error || "বিল সেভ করতে ব্যর্থ হয়েছে");
      }
    } catch (error) {
      console.error("Add billing error:", error);
      toast.error("সার্ভার ত্রুটি, বিল তৈরি করা যায়নি");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50/50">
      {/* Dynamic invoice styles for print */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice,
          #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin: 0;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between no-print">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <ReceiptText className="h-8 w-8 text-violet-600 animate-pulse" />
            {editBill ? `Edit Bill & Invoice #${editBill._id.substring(18)}` : "Create Bill & Invoice"}
          </h1>
          <p className="mt-1 text-gray-500">
            {editBill
              ? "রশিদের তথ্য এবং পণ্যের বিবরণ পরিবর্তন করে বিলটি আপডেট করুন।"
              : "গ্রাহকের তথ্য এবং পণ্যের বিবরণ পূরণ করে নতুন রশিদ তৈরি করুন।"}
          </p>
        </div>
      </div>

      {/* CREATE INVOICE FORM */}
      <div className="no-print">
        <form onSubmit={handleCreateInvoice} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Input Fields (Col Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              {/* CARD 1: Customer Details & Lookup */}
              <CustomerForm
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                customerAddress={customerAddress}
                setCustomerAddress={setCustomerAddress}
                paidAmount={paidAmount}
                setPaidAmount={setPaidAmount}
                dueAmount={dueAmount}
                setDueAmount={setDueAmount}
                grandTotal={grandTotal}
                uniqueCustomers={uniqueCustomers}
              />

              {/* CARD 2: Product Items */}
              <ProductTable
                items={items}
                inventory={initialInventory}
                addItemRow={addItemRow}
                removeItemRow={removeItemRow}
                handleItemFieldChange={handleItemFieldChange}
              />

              {/* CARD 3: Discount and Taxes */}
              <DiscountTaxCard
                discount={discount}
                setDiscount={setDiscount}
                vatPercent={vatPercent}
                setVatPercent={setVatPercent}
              />
            </div>

            {/* RIGHT COLUMN: Real-time Previews (Col Span 5) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
              {/* PREVIEW CARD 1: Live Invoice Details */}
              <InvoicePreview
                customerName={customerName}
                customerPhone={customerPhone}
                customerAddress={customerAddress}
                items={items}
                subtotal={subtotal}
                discount={discount}
                vatPercent={vatPercent}
                grandTotal={grandTotal}
                paidAmount={paidAmount}
                dueAmount={dueAmount}
                isLivePreview={true}
              />

              {/* PREVIEW CARD 2: Live Calculation summary */}
              <SummaryCard
                subtotal={subtotal}
                discount={discount}
                vatPercent={vatPercent}
                grandTotal={grandTotal}
                paidAmount={paidAmount}
                dueAmount={dueAmount}
                isSubmitting={isSubmitting}
                editBill={editBill}
              />
            </div>
          </div>
        </form>
      </div>

      {/* DETAIL INVOICE PREVIEW MODAL */}
      <InvoiceModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        selectedInvoice={selectedInvoice}
      />
    </div>
  );
}
