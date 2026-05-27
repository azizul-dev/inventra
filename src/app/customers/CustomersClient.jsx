"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Search,
  DollarSign,
  Calendar,
  User,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  Printer,
  MapPin,
  Phone,
  ArrowRight,
  TrendingUp,
  History,
} from "lucide-react";

export default function CustomersClient({
  session,
  token,
  initialBillingList = [],
}) {
  const router = useRouter();
  const [billingList, setBillingList] = useState(initialBillingList);
  const [searchQuery, setSearchQuery] = useState("");

  // Customer Detail Drawer State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // Invoice Details Dialog State (Reuse from Billing client)
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Group invoices by customer
  const customersData = useMemo(() => {
    const groups = {};
    billingList.forEach((bill) => {
      const phone = bill.customerPhone?.trim() || "";
      const name = bill.customerName?.trim() || "";
      // Unique key by phone if present, otherwise lowercase name
      const key = phone ? phone : name.toLowerCase();

      if (!groups[key]) {
        groups[key] = {
          name: bill.customerName,
          phone: bill.customerPhone || "",
          address: bill.customerAddress || "",
          bills: [],
          totalSpent: 0,
          totalPaid: 0,
          totalDue: 0,
          latestBillDate: bill.createdAt,
        };
      }

      groups[key].bills.push(bill);
      groups[key].totalSpent += bill.total || 0;
      if (bill.status === "Paid") {
        groups[key].totalPaid += bill.total || 0;
      } else {
        groups[key].totalDue += bill.total || 0;
      }

      // Keep latest details
      if (new Date(bill.createdAt) > new Date(groups[key].latestBillDate)) {
        groups[key].latestBillDate = bill.createdAt;
        if (bill.customerAddress) groups[key].address = bill.customerAddress;
        if (bill.customerPhone) groups[key].phone = bill.customerPhone;
      }
    });

    return Object.values(groups).sort(
      (a, b) => new Date(b.latestBillDate) - new Date(a.latestBillDate)
    );
  }, [billingList]);

  // Search Filter
  const filteredCustomers = useMemo(() => {
    return customersData.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customersData, searchQuery]);

  // Premium CRM Statistics
  const crmStats = useMemo(() => {
    const totalCustomers = customersData.length;
    const totalSales = billingList.reduce((sum, bill) => sum + (bill.total || 0), 0);
    const totalDue = billingList
      .filter((bill) => bill.status === "Due")
      .reduce((sum, bill) => sum + (bill.total || 0), 0);

    // Find highest spender
    let topSpender = null;
    if (customersData.length > 0) {
      topSpender = customersData.reduce((prev, current) =>
        prev.totalSpent > current.totalSpent ? prev : current
      );
    }

    return { totalCustomers, totalSales, totalDue, topSpender };
  }, [customersData, billingList]);

  // Print invoice helper
  const handlePrint = () => {
    window.print();
  };

  // PDF Generator (Reused from BillingClient)
  const handleDownloadPDF = async (invoice) => {
    setSelectedInvoice(invoice);
    const isAlreadyOpen = isInvoiceModalOpen;
    if (!isAlreadyOpen) {
      setIsInvoiceModalOpen(true);
    }

    toast.info("পিডিএফ তৈরি হচ্ছে...");

    setTimeout(async () => {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const element = document.getElementById("printable-customer-invoice");
      if (!element) {
        toast.error("ইনভয়েস এলিমেন্ট পাওয়া যায়নি");
        return;
      }

      try {
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

        pdf.save(`invoice_${invoice._id.substring(18)}.pdf`);
        toast.success("পিডিএফ ডাউনলোড সম্পন্ন হয়েছে!");
      } catch (error) {
        console.error("PDF generation error:", error);
        toast.error("পিডিএফ তৈরি করতে সমস্যা হয়েছে");
      }
    }, isAlreadyOpen ? 50 : 350);
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50/50">
      {/* Styles for print */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-customer-invoice, #printable-customer-invoice * {
            visibility: visible;
          }
          #printable-customer-invoice {
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
            <Users className="h-8 w-8 text-violet-600 animate-pulse" />
            Customers & CRM
          </h1>
          <p className="mt-1 text-gray-500">
            গ্রাহকদের বিবরণ, মোট ক্রয় হিসাব, বকেয়া এবং রশিদ ইতিহাস।
          </p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8 no-print">
        <Card className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
          <div className="h-1 bg-violet-600" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">মোট গ্রাহক</p>
              <div className="rounded-2xl bg-violet-50 p-2 text-violet-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <h3 className="mt-4 text-3xl font-extrabold text-gray-900">
              {crmStats.totalCustomers} জন
            </h3>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
          <div className="h-1 bg-cyan-500" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">মোট বিক্রয়</p>
              <div className="rounded-2xl bg-cyan-50 p-2 text-cyan-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <h3 className="mt-4 text-3xl font-extrabold text-gray-900">
              ৳ {crmStats.totalSales.toLocaleString()}
            </h3>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
          <div className="h-1 bg-rose-500" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">মোট বকেয়া</p>
              <div className="rounded-2xl bg-rose-50 p-2 text-rose-600">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
            <h3 className="mt-4 text-3xl font-extrabold text-gray-900">
              ৳ {crmStats.totalDue.toLocaleString()}
            </h3>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
          <div className="h-1 bg-amber-500" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">সর্বোচ্চ ক্রেতা</p>
              <div className="rounded-2xl bg-amber-50 p-2 text-amber-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            {crmStats.topSpender ? (
              <div className="mt-3">
                <h4 className="text-lg font-bold text-gray-900 truncate">
                  {crmStats.topSpender.name}
                </h4>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  ৳ {crmStats.topSpender.totalSpent.toLocaleString()}
                </p>
              </div>
            ) : (
              <h3 className="mt-4 text-3xl font-extrabold text-gray-900">N/A</h3>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CUSTOMERS LIST SECTION */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm no-print">
        <div className="h-1 bg-[linear-gradient(90deg,#8b5cf6,#06b6d4,#f59e0b)] bg-[length:300%_100%]" />
        <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-gray-900">গ্রাহকদের তালিকা</h2>
          <div className="relative w-full max-w-sm">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="গ্রাহকের নাম, মোবাইল বা ঠিকানা দিয়ে খুঁজুন..."
              className="pl-11 h-11 rounded-2xl border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="py-4 font-bold text-gray-700">গ্রাহকের নাম</TableHead>
                <TableHead className="font-bold text-gray-700">মোবাইল নম্বর</TableHead>
                <TableHead className="font-bold text-gray-700">ঠিকানা</TableHead>
                <TableHead className="font-bold text-gray-700 text-center">মোট রশিদ</TableHead>
                <TableHead className="font-bold text-gray-700 text-right">মোট ক্রয় (৳)</TableHead>
                <TableHead className="font-bold text-gray-700 text-center">স্ট্যাটাস</TableHead>
                <TableHead className="font-bold text-gray-700 text-center">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    কোনো গ্রাহক পাওয়া যায়নি।
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <TableRow key={index} className="hover:bg-gray-50/50">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-violet-100 text-violet-700 font-extrabold flex items-center justify-center text-sm shrink-0">
                          {customer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{customer.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            শেষ রশিদ: {new Date(customer.latestBillDate).toLocaleDateString("bn-BD")}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">
                      {customer.phone || (
                        <span className="text-gray-300 italic text-xs">অজানা</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {customer.address || (
                        <span className="text-gray-300 italic text-xs">অজানা</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-bold text-gray-800">
                      {customer.bills.length} টি
                    </TableCell>
                    <TableCell className="text-right font-extrabold text-gray-900 text-base">
                      ৳ {customer.totalSpent.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {customer.totalDue > 0 ? (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-rose-100 text-rose-700">
                          Due (বকেয়া: ৳{customer.totalDue.toLocaleString()})
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
                          Paid (পরিশোধিত)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsCustomerModalOpen(true);
                          }}
                          className="h-9 rounded-xl border-violet-200 text-violet-700 hover:bg-violet-50 transition font-bold text-xs gap-1 cursor-pointer"
                        >
                          রশিদ ইতিহাস
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          onClick={() => {
                            router.push(
                              `/billing?customerName=${encodeURIComponent(customer.name)}&customerPhone=${encodeURIComponent(customer.phone)}&customerAddress=${encodeURIComponent(customer.address)}`
                            );
                          }}
                          className="h-9 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs gap-1 cursor-pointer shadow-sm"
                        >
                          নতুন রশিদ
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* CUSTOMER PROFILE & INVOICE HISTORY DRAWER */}
      <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
        <DialogContent className="max-w-4xl p-6 overflow-y-auto max-h-[90vh] rounded-3xl no-print">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <History className="h-6 w-6 text-violet-600 animate-spin-slow" />
              <span>গ্রাহক রশিদ প্রোফাইল</span>
            </DialogTitle>
            <DialogDescription className="sr-only">
              গ্রাহকের তথ্য এবং সম্পূর্ণ ক্রয় রশিদের ইতিহাস
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6">
              {/* Profile details summary card */}
              <div className="grid gap-6 md:grid-cols-3 bg-violet-50/40 p-6 rounded-3xl border border-violet-100">
                <div className="space-y-3 md:border-r border-violet-100 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-violet-200 text-violet-800 font-black flex items-center justify-center text-base">
                      {selectedCustomer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-gray-900">{selectedCustomer.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-violet-100 text-violet-800 px-2 py-0.5 rounded-full font-bold">
                          নিয়মিত গ্রাহক
                        </span>
                        <button
                          onClick={() => {
                            setIsCustomerModalOpen(false);
                            router.push(
                              `/billing?customerName=${encodeURIComponent(selectedCustomer.name)}&customerPhone=${encodeURIComponent(selectedCustomer.phone)}&customerAddress=${encodeURIComponent(selectedCustomer.address)}`
                            );
                          }}
                          className="text-[10px] bg-violet-600 hover:bg-violet-700 text-white px-2 py-0.5 rounded-full font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          নতুন রশিদ তৈরি
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <p className="text-xs text-gray-600 flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-violet-500" />
                      <span className="font-semibold">মোবাইল:</span>{" "}
                      <span className="font-mono">{selectedCustomer.phone || "অজানা"}</span>
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-violet-500" />
                      <span className="font-semibold">ঠিকানা:</span>{" "}
                      <span>{selectedCustomer.address || "অজানা"}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 md:border-r border-violet-100 pr-4 flex flex-col justify-center whitespace-nowrap">
                  <div className="flex justify-between items-center text-xs gap-4">
                    <span className="text-gray-500 font-medium">মোট রশিদ সংখ্যা:</span>
                    <span className="font-bold text-gray-800">{selectedCustomer.bills.length} টি</span>
                  </div>
                  <div className="flex justify-between items-center text-xs gap-4">
                    <span className="text-gray-500 font-medium">মোট ক্রয় মূল্য:</span>
                    <span className="font-black text-gray-900 text-sm">৳ {selectedCustomer.totalSpent.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3 flex flex-col justify-center whitespace-nowrap">
                  <div className="flex justify-between items-center text-xs gap-4">
                    <span className="text-gray-500 font-medium">পরিশোধিত টাকা:</span>
                    <span className="font-bold text-green-700">৳ {selectedCustomer.totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs gap-4">
                    <span className="text-gray-500 font-medium">বকেয়া টাকা:</span>
                    <span className={`font-bold ${selectedCustomer.totalDue > 0 ? "text-rose-600 font-extrabold animate-pulse" : "text-gray-600"}`}>
                      ৳ {selectedCustomer.totalDue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bills history timeline / table */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-violet-500" />
                  রশিদের তালিকা
                </h4>

                <div className="overflow-hidden border border-gray-100 rounded-2xl max-h-[350px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-700 font-bold">
                        <th className="p-3">তারিখ ও সময়</th>
                        <th className="p-3">রশিদ আইডি</th>
                        <th className="p-3">পণ্যের বিবরণ</th>
                        <th className="p-3 text-right">মোট বিল</th>
                        <th className="p-3 text-center">স্ট্যাটাস</th>
                        <th className="p-3 text-center">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedCustomer.bills.map((bill, index) => (
                        <tr key={bill._id || index} className="hover:bg-gray-50/50">
                          <td className="p-3">
                            <p className="font-semibold text-gray-800">
                              {new Date(bill.createdAt).toLocaleDateString("bn-BD")}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {new Date(bill.createdAt).toLocaleTimeString("bn-BD", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </td>
                          <td className="p-3 font-mono text-xs text-gray-500">
                            #{bill._id.substring(18)}
                          </td>
                          <td className="p-3 text-xs text-gray-600 max-w-[200px] truncate">
                            {bill.items?.map((item) => `${item.productName} (${item.quantity} ${item.unit})`).join(", ")}
                          </td>
                          <td className="p-3 text-right font-bold text-gray-900">
                            ৳ {bill.total?.toLocaleString()}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                bill.status === "Paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {bill.status === "Paid" ? "Paid" : "Due"}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedInvoice(bill);
                                  setIsInvoiceModalOpen(true);
                                }}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition"
                                title="বিল দেখুন"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDownloadPDF(bill)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition"
                                title="পিডিএফ ডাউনলোড"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DETAIL INVOICE PREVIEW MODAL */}
      <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
        <DialogContent className="max-w-4xl p-6 overflow-y-auto max-h-[95vh] rounded-3xl">
          <DialogHeader className="no-print">
            <DialogTitle className="text-xl font-bold flex items-center justify-between">
              <span>ইনভয়েস প্রিভিউ</span>
              <div className="flex gap-2 mr-6">
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="h-9 rounded-xl flex items-center gap-1 text-xs cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  প্রিন্ট করুন
                </Button>
                <Button
                  onClick={() => handleDownloadPDF(selectedInvoice)}
                  className="h-9 rounded-xl flex items-center gap-1 text-xs bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer"
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

          {selectedInvoice && (
            <div className="border border-gray-100 rounded-2xl bg-white p-8 shadow-sm flex flex-col justify-between min-h-[550px] relative overflow-hidden font-sans">
              <div id="printable-customer-invoice">
                {/* Invoice Watermark Decorator */}
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-violet-50/30 -mr-20 -mt-20 pointer-events-none" />
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start border-b pb-6 gap-6">
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">INVENTRA STORE</h1>
                    <p className="text-sm text-gray-500 mt-1">প্রফেশনাল ইনভেন্টরি ও বিলিং সিস্টেম</p>
                    <p className="text-xs text-gray-400 mt-2">ঢাকা, বাংলাদেশ</p>
                    <p className="text-xs text-gray-400">মোবাইল: +৮৮০১৭১২-৩৪৫৬৭৮</p>
                  </div>

                  <div className="text-left md:text-right">
                    <h2 className="text-2xl font-black text-violet-600 tracking-wider">INVOICE</h2>
                    <p className="text-sm font-semibold text-gray-700 mt-2">
                      ইনভয়েস নং: <span className="font-mono text-xs text-gray-500">#{selectedInvoice._id.substring(18)}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      তারিখ: {new Date(selectedInvoice.createdAt).toLocaleDateString("bn-BD")}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full mt-3 px-3 py-0.5 text-xs font-bold ${
                        selectedInvoice.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {selectedInvoice.status === "Paid" ? "Paid (পরিশোধিত)" : "Due (বকেয়া)"}
                    </span>
                  </div>
                </div>

                {/* Bill To */}
                <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b py-4 my-6">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">গ্রাহকের বিবরণ</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-base font-bold text-gray-900">{selectedInvoice.customerName}</p>
                      {selectedInvoice.customerPhone && (
                        <p className="text-xs text-gray-600 flex items-center gap-1.5">
                          <span className="font-semibold text-gray-500">মোবাইল:</span> {selectedInvoice.customerPhone}
                        </p>
                      )}
                      {selectedInvoice.customerAddress && (
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold text-gray-500">ঠিকানা:</span> {selectedInvoice.customerAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex md:justify-end md:items-end">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-600">বিল তৈরি:</span>{" "}
                        {new Date(selectedInvoice.createdAt).toLocaleString("bn-BD")}
                      </p>
                      {selectedInvoice.updatedAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          <span className="font-semibold text-gray-500">সর্বশেষ আপডেট:</span>{" "}
                          {new Date(selectedInvoice.updatedAt).toLocaleString("bn-BD")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-left font-bold text-gray-700">
                        <th className="p-3 text-center w-12">#</th>
                        <th className="p-3">পণ্যের বিবরণ</th>
                        <th className="p-3 text-center">পরিমাণ</th>
                        <th className="p-3 text-center">ইউনিট</th>
                        <th className="p-3 text-right">একক মূল্য</th>
                        <th className="p-3 text-right w-32">মোট মূল্য</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedInvoice.items?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="p-3 text-center text-gray-500 font-mono">{idx + 1}</td>
                          <td className="p-3 font-semibold text-gray-900">{item.productName}</td>
                          <td className="p-3 text-center text-gray-700">{item.quantity}</td>
                          <td className="p-3 text-center text-gray-600">{item.unit}</td>
                          <td className="p-3 text-right text-gray-700">৳ {item.sellPrice?.toLocaleString()}</td>
                          <td className="p-3 text-right font-bold text-gray-900">
                            ৳ {(item.quantity * item.sellPrice).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculations Summary */}
                <div className="mt-8 flex justify-end">
                  <div className="w-72 space-y-2 text-sm border-t pt-4">
                    {(() => {
                      const sub = selectedInvoice.items?.reduce((sum, item) => sum + item.quantity * item.sellPrice, 0) || 0;
                      const disc = Math.max(0, sub - (selectedInvoice.total || 0));
                      return (
                        <>
                          <div className="flex justify-between items-center text-gray-500">
                            <span>সাবটোটাল</span>
                            <span className="font-semibold text-gray-900">৳ {sub.toLocaleString()}</span>
                          </div>
                          {disc > 0 && (
                            <div className="flex justify-between items-center text-rose-600">
                              <span>ডিসকাউন্ট</span>
                              <span className="font-bold">- ৳ {disc.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="h-px bg-gray-100 my-1" />
                          <div className="flex justify-between items-center text-base font-bold">
                            <span className="text-gray-800">সর্বমোট বিল</span>
                            <span className="text-violet-600 font-black text-lg">৳ {selectedInvoice.total?.toLocaleString()}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="mt-16 flex justify-between items-end border-t pt-12">
                  <div className="text-xs text-gray-400">
                    <p className="font-semibold text-gray-500">নোট / শর্তাবলি:</p>
                    <p className="mt-1">১. বিক্রিত মাল ফেরত নেওয়া হয় না।</p>
                    <p>২. বিলটি সিস্টেমে স্বয়ংক্রিয়ভাবে জেনারেট করা হয়েছে।</p>
                  </div>

                  <div className="text-center w-48">
                    <div className="h-px bg-gray-300 w-full mb-2" />
                    <p className="text-xs font-bold text-gray-700">অনুমোদিত স্বাক্ষর</p>
                    <p className="text-[10px] text-gray-400">ইনভেন্ট্রা স্টোর</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
