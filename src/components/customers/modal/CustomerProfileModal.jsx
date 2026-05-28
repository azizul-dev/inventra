import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { History, Phone, MapPin, Receipt, ArrowLeft, Printer, Download } from "lucide-react";
import InvoiceTable from "./InvoiceTable";
import PrintableInvoice from "../invoice/PrintableInvoice";
import { formatCurrency } from "../utils/invoiceCalculations";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

/**
 * CustomerProfileModal Component
 * Displays customer's detailed contact information and invoice history.
 * If an invoice is selected, inline replaces the view with PrintableInvoice preview and printing/download options.
 * Unified single modal design ensures maximum mobile usability.
 */
export default function CustomerProfileModal({
  isOpen,
  onOpenChange,
  customer,
  onDownloadPDF,
}) {
  const router = useRouter();
  const [activeInvoice, setActiveInvoice] = useState(null);

  // Reset active invoice selection when modal is opened or closed
  useEffect(() => {
    if (!isOpen) {
      setActiveInvoice(null);
    }
  }, [isOpen]);

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-4 sm:p-6 overflow-y-auto max-h-[90vh] rounded-3xl dialog-print-container">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <History className="h-6 w-6 text-violet-600 animate-spin-slow" />
            <span>{activeInvoice ? "বিক্রয় রশিদ বিবরণ" : "গ্রাহক রশিদ প্রোফাইল"}</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            গ্রাহকের তথ্য এবং সম্পূর্ণ ক্রয় রশিদের ইতিহাস
          </DialogDescription>
        </DialogHeader>

        {/* Unified View Panel Switcher */}
        {!activeInvoice ? (
          <div className="space-y-6">
            {/* Profile details summary card - Responsive Flex/Grid */}
            <div className="grid gap-6 md:grid-cols-3 bg-violet-50/40 p-4 sm:p-6 rounded-3xl border border-violet-100">
              {/* Contact Information */}
              <div className="space-y-3 md:border-r border-violet-100 pr-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-violet-200 text-violet-800 font-black flex items-center justify-center text-base">
                    {customer.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900 leading-tight">{customer.name}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] bg-violet-100 text-violet-800 px-2 py-0.5 rounded-full font-bold">
                        নিয়মিত গ্রাহক
                      </span>
                      <button
                        onClick={() => {
                          onOpenChange(false);
                          router.push(
                            `/billing?customerName=${encodeURIComponent(customer.name)}&customerPhone=${encodeURIComponent(customer.phone || "")}&customerAddress=${encodeURIComponent(customer.address || "")}`
                          );
                        }}
                        className="text-[10px] bg-violet-600 hover:bg-violet-700 text-white px-2 py-0.5 rounded-full font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        নতুন রশিদ
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 pt-2">
                  <p className="text-xs text-gray-600 flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                    <span className="font-semibold text-gray-500">মোবাইল:</span>{" "}
                    <span className="font-mono text-gray-800">{customer.phone || "অজানা"}</span>
                  </p>
                  <p className="text-xs text-gray-600 flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-violet-500 shrink-0 mt-0.5" />
                    <span className="font-semibold text-gray-500 shrink-0">ঠিকানা:</span>{" "}
                    <span className="text-gray-800">{customer.address || "অজানা"}</span>
                  </p>
                </div>
              </div>

              {/* Spent Summary */}
              <div className="space-y-3 md:border-r border-violet-100 pr-4 flex flex-col justify-center whitespace-nowrap">
                <div className="flex justify-between items-center text-xs gap-4">
                  <span className="text-gray-500 font-semibold">মোট রশিদ সংখ্যা:</span>
                  <span className="font-bold text-gray-800 flex items-center gap-1">
                    <Receipt className="h-3.5 w-3.5 text-gray-400" />
                    {customer.bills.length} টি
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs gap-4">
                  <span className="text-gray-500 font-semibold">মোট ক্রয় মূল্য:</span>
                  <span className="font-black text-gray-900 text-sm">
                    {formatCurrency(customer.totalSpent)}
                  </span>
                </div>
              </div>

              {/* Balances summary */}
              <div className="space-y-3 flex flex-col justify-center whitespace-nowrap">
                <div className="flex justify-between items-center text-xs gap-4">
                  <span className="text-gray-500 font-semibold">পরিশোধিত টাকা:</span>
                  <span className="font-bold text-green-700">
                    {formatCurrency(customer.totalPaid)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs gap-4">
                  <span className="text-gray-500 font-semibold">বকেয়া টাকা:</span>
                  <span
                    className={`font-bold ${
                      customer.totalDue > 0 ? "text-rose-600 font-extrabold animate-pulse" : "text-gray-600"
                    }`}
                  >
                    {formatCurrency(customer.totalDue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Invoices Table list */}
            <InvoiceTable
              bills={customer.bills}
              onViewInvoice={(bill) => setActiveInvoice(bill)}
              onDownloadPDF={onDownloadPDF}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header controls for printable view */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3 no-print">
              <Button
                variant="ghost"
                onClick={() => setActiveInvoice(null)}
                className="h-9 rounded-xl flex items-center gap-1.5 text-xs cursor-pointer text-gray-600 hover:text-violet-700 hover:bg-violet-50 border border-transparent hover:border-violet-100 shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                রশিদ তালিকায় ফিরে যান
              </Button>
              
              <div className="flex gap-2 sm:mr-6 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="h-9 rounded-xl flex items-center gap-1.5 text-xs cursor-pointer flex-1 sm:flex-initial"
                >
                  <Printer className="h-4 w-4" />
                  প্রিন্ট করুন
                </Button>
                <Button
                  onClick={() => onDownloadPDF(activeInvoice)}
                  className="h-9 rounded-xl flex items-center gap-1.5 text-xs bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer flex-1 sm:flex-initial"
                >
                  <Download className="h-4 w-4" />
                  পিডিএফ ডাউনলোড
                </Button>
              </div>
            </div>

            {/* Real printable template inside a responsive wrapper */}
            <div className="overflow-x-auto p-1 bg-gray-100/50 rounded-2xl border border-gray-100">
              <div className="min-w-[700px] md:min-w-0">
                <PrintableInvoice invoice={activeInvoice} />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
