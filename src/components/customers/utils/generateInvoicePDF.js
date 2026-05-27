import { toast } from "sonner";

/**
 * Utility to generate and download dynamic customer invoices as PDFs
 * using html2canvas-pro and jsPDF.
 */
export async function generateInvoicePDF(invoice, elementId = "printable-customer-invoice") {
  if (!invoice) {
    toast.error("কোনো রশিদ পাওয়া যায়নি");
    return;
  }

  toast.info("পিডিএফ তৈরি হচ্ছে...");

  try {
    const html2canvas = (await import("html2canvas-pro")).default;
    const { jsPDF } = await import("jspdf");

    const element = document.getElementById(elementId);
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

    const imgWidth = 210;
    const pageHeight = 297;
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

    const invoiceId = invoice._id?.substring(18) || "NEW";
    pdf.save(`invoice_${invoiceId}.pdf`);
    toast.success("পিডিএফ ডাউনলোড সম্পন্ন হয়েছে!");
  } catch (error) {
    console.error("PDF generation error:", error);
    toast.error("পিডিএফ তৈরি করতে সমস্যা হয়েছে");
  }
}
