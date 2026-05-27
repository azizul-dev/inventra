"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { toast } from "sonner";
import InvoicePreview from "./InvoicePreview";

/**
 * InvoiceModal Component
 * Dialog modal that renders the printable invoice and provides print/PDF download actions.
 */
export default function InvoiceModal({ isOpen, onOpenChange, selectedInvoice }) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async (invoice) => {
    if (!invoice) return;
    toast.info("পিডিএফ তৈরি হচ্ছে...");

    // Give React time to render the DOM if not already open
    setTimeout(async () => {
      try {
        const html2canvas = (await import("html2canvas-pro")).default;
        const { jsPDF } = await import("jspdf");

        const element = document.getElementById("printable-invoice");
        if (!element) {
          toast.error("ইনভয়েস এলিমেন্ট পাওয়া যায়নি");
          return;
        }

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const imgWidth = 210; // A4 Width in mm
        const pageHeight = 297; // A4 Height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const fallbackId = invoice._id ? invoice._id.substring(18) : "invoice";
        pdf.save(`invoice_${fallbackId}.pdf`);
        toast.success("পিডিএফ ডাউনলোড সম্পন্ন হয়েছে!");
      } catch (error) {
        console.error("PDF generation error:", error);
        toast.error("পিডিএফ তৈরি করতে সমস্যা হয়েছে");
      }
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-4 sm:p-6 overflow-y-auto max-h-[95vh] rounded-3xl">
        <DialogHeader className="no-print">
          <DialogTitle className="text-xl font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span>ইনভয়েস প্রিভিউ</span>
            <div className="flex gap-2 sm:mr-6">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="h-9 rounded-xl flex items-center gap-1 text-xs cursor-pointer flex-1 sm:flex-initial"
              >
                <Printer className="h-4 w-4" />
                প্রিন্ট করুন
              </Button>
              <Button
                onClick={() => handleDownloadPDF(selectedInvoice)}
                className="h-9 rounded-xl flex items-center gap-1 text-xs bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer flex-1 sm:flex-initial"
              >
                <Download className="h-4 w-4" />
                পিডিএফ ডাউনলোড
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            বিল বা ইনভয়েস প্রিভিউ এবং প্রিন্ট/ডাউনলোড অপশন
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto p-1 bg-gray-100/50 rounded-2xl border border-gray-100">
          <div className="min-w-[700px] md:min-w-0">
            {selectedInvoice && <InvoicePreview isLivePreview={false} invoiceData={selectedInvoice} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
