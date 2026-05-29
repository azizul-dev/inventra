import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { History, Phone, MapPin, Receipt, ArrowLeft, Printer, Download, Eye, FileText, CheckCircle2, ChevronRight } from "lucide-react";
import PrintableInvoice from "../invoice/PrintableInvoice";
import { formatCurrency } from "../utils/invoiceCalculations";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

/**
 * CustomerProfileModal Component
 * Overhauled into a premium CRM List-Detail Split Dashboard.
 * - Desktop: Split 2-column view (Left: Customer profile + Scrollable Invoice history list, Right: Live responsive active invoice details & print toolbar).
 * - Mobile: Unified stack layout with clean back-to-list slide-in states, fully responsive with zero horizontal scrolling.
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
    } else if (customer && customer.bills && customer.bills.length > 0) {
      // Auto-select the latest invoice on desktop viewports for premium experience
      if (window.innerWidth >= 768) {
        setActiveInvoice(customer.bills[0]);
      }
    }
  }, [isOpen, customer]);

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-6xl p-4 sm:p-6 overflow-y-auto max-h-[95vh] rounded-3xl dialog-print-container">
        <DialogHeader className="no-print border-b pb-3 mb-4">
          <DialogTitle className="text-2xl font-black flex items-center gap-2 text-gray-900">
            <History className="h-6 w-6 text-violet-600 animate-spin-slow" />
            <span>গ্রাহক রশিদ প্রোফাইল ও ইতিহাস</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            গ্রাহকের বিস্তারিত তথ্য এবং রশিদের তালিকা ও বিবরণ
          </DialogDescription>
        </DialogHeader>

        {/* 1. TOP SECTION: ALWAYS VISIBLE CUSTOMER SUMMARY CARD */}
        <div className="no-print bg-violet-50/40 p-4 sm:p-6 rounded-3xl border border-violet-100 grid gap-6 md:grid-cols-3 mb-6">
          {/* Customer Profile info */}
          <div className="space-y-3 md:border-r border-violet-100 pr-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-violet-600 text-white font-black flex items-center justify-center text-base shadow-sm">
                {customer.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-lg font-black text-gray-900 leading-tight">{customer.name}</h4>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-[10px] bg-violet-100 text-violet-800 px-2.5 py-0.5 rounded-full font-bold">
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

          {/* Spent Metrics */}
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

          {/* Balance Metrics */}
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

        {/* 2. DYNAMIC WORKSPACE BODY: DESKTOP SIDE-BY-SIDE SPLIT OR MOBILE ADAPTIVE VIEWS */}
        
        {/* MOBILE VIEW: Toggle active list or full invoice view inside a single responsive container */}
        <div className="block md:hidden">
          {!activeInvoice ? (
            <div className="space-y-4 no-print">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="h-4 w-4" />
                রশিদের তালিকা ({customer.bills.length})
              </h4>
              {customer.bills.length === 0 ? (
                <div className="text-center py-8 text-gray-400 italic bg-gray-50 rounded-2xl">
                  কোনো রশিদের ইতিহাস পাওয়া যায়নি।
                </div>
              ) : (
                <div className="space-y-3">
                  {customer.bills.map((bill, index) => {
                    const dateStr = new Date(bill.createdAt).toLocaleDateString("bn-BD");
                    return (
                      <div
                        key={bill._id || index}
                        onClick={() => setActiveInvoice(bill)}
                        className="p-4 rounded-2xl border border-gray-150 bg-white hover:bg-violet-50/20 active:bg-violet-50/40 transition cursor-pointer flex justify-between items-center"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-800">
                            রশিদ আইডি: #{bill._id?.substring(18) || "NEW"}
                          </p>
                          <p className="text-[10px] text-gray-500">তারিখ: {dateStr}</p>
                          <p className="text-xs font-bold text-violet-700 mt-1">
                            মোট: {formatCurrency(bill.total)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
                              bill.status === "Paid" ? "bg-green-150 text-green-700" : "bg-rose-150 text-rose-700"
                            }`}
                          >
                            {bill.status === "Paid" ? "Paid" : "Due"}
                          </span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Back controls */}
              <div className="flex justify-between items-center gap-3 no-print">
                <Button
                  variant="ghost"
                  onClick={() => setActiveInvoice(null)}
                  className="h-9 rounded-xl flex items-center gap-1 text-xs cursor-pointer text-gray-600 hover:text-violet-700 hover:bg-violet-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  তালিকায় ফিরুন
                </Button>
                
                <div className="flex gap-1.5">
                  <Button
                    variant="outline"
                    onClick={() => window.print()}
                    className="h-8 px-3 rounded-xl flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    প্রিন্ট
                  </Button>
                  <Button
                    onClick={() => onDownloadPDF(activeInvoice)}
                    className="h-8 px-3 rounded-xl flex items-center gap-1 text-[11px] bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    ডাউনলোড
                  </Button>
                </div>
              </div>

              {/* 100% Fluid mobile invoice preview */}
              <div className="border border-gray-150 rounded-2xl bg-white p-3">
                <PrintableInvoice invoice={activeInvoice} id="printable-customer-invoice-mobile" />
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP SPLIT VIEW: Left Panel scroll list, Right Panel selected bill detail */}
        <div className="hidden md:grid md:grid-cols-12 gap-6 items-start">
          {/* Left panel: List (Col Span 5) */}
          <div className="col-span-5 space-y-4 no-print border-r pr-6 border-gray-100 max-h-[550px] overflow-y-auto">
            <h4 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <FileText className="h-4.5 w-4.5 text-violet-500" />
              ক্রয় রশিদের তালিকা ({customer.bills.length})
            </h4>

            {customer.bills.length === 0 ? (
              <div className="text-center py-12 text-gray-400 italic bg-gray-50/50 rounded-3xl border border-gray-100">
                কোনো রশিদের ইতিহাস পাওয়া যায়নি।
              </div>
            ) : (
              <div className="space-y-3">
                {customer.bills.map((bill, index) => {
                  const isSelected = activeInvoice && activeInvoice._id === bill._id;
                  const dateStr = new Date(bill.createdAt).toLocaleDateString("bn-BD");
                  const timeStr = new Date(bill.createdAt).toLocaleTimeString("bn-BD", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={bill._id || index}
                      onClick={() => setActiveInvoice(bill)}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex justify-between items-start gap-4 ${
                        isSelected
                          ? "border-violet-600 bg-violet-50/40 shadow-sm ring-1 ring-violet-500"
                          : "border-gray-100 hover:border-violet-200 hover:bg-gray-50/30 bg-white"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-800">
                            #{bill._id?.substring(18) || "NEW"}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                              bill.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {bill.status === "Paid" ? "Paid" : "Due"}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">
                          {dateStr} • {timeStr}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px] mt-1">
                          {bill.items?.map((item) => `${item.productName} (${item.quantity} ${item.unit})`).join(", ")}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-sm text-gray-900 block">
                          {formatCurrency(bill.total)}
                        </span>
                        <Button
                          variant="ghost"
                          className="h-7 px-2 rounded-lg text-[10px] text-violet-600 hover:bg-violet-50 mt-1 cursor-pointer"
                        >
                          বিস্তারিত
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right panel: Detail Preview (Col Span 7) */}
          <div className="col-span-7 space-y-4">
            {activeInvoice ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Print Control Toolbar */}
                <div className="flex items-center justify-between gap-4 border-b pb-3 no-print">
                  <h4 className="text-sm font-extrabold text-violet-700 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-green-600" />
                    রশিদ আইডি: #{activeInvoice._id?.substring(18) || "NEW"}
                  </h4>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => window.print()}
                      className="h-9 rounded-xl flex items-center gap-1.5 text-xs cursor-pointer"
                    >
                      <Printer className="h-4 w-4" />
                      প্রিন্ট করুন
                    </Button>
                    <Button
                      onClick={() => onDownloadPDF(activeInvoice)}
                      className="h-9 rounded-xl flex items-center gap-1.5 text-xs bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      পিডিএফ ডাউনলোড
                    </Button>
                  </div>
                </div>

                {/* Printable Invoice (Fluid fluid scale on desktop viewports) */}
                <div className="border border-gray-150 rounded-2xl bg-white p-2">
                  <PrintableInvoice invoice={activeInvoice} id="printable-customer-invoice-desktop" />
                </div>
              </div>
            ) : (
              <div className="no-print h-[450px] flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <div className="h-16 w-16 rounded-full bg-violet-50 text-violet-400 flex items-center justify-center mb-4">
                  <Eye className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-800">রশিদ সিলেক্ট করুন</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-[280px]">
                  বামদিকের তালিকা থেকে যেকোনো বিক্রয় রশিদের উপর ক্লিক করে তার সম্পূর্ণ বিবরণ, ডাউনলোড এবং প্রিন্ট করার অপশনগুলো এখানে দেখুন।
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
