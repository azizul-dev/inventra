import React, { useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Users, Phone, MapPin, ArrowRight, Trash2, Calendar, ShoppingBag, Receipt, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import CustomerSearch from "./CustomerSearch";
import CustomerRow from "./CustomerRow";
import { formatCurrency } from "../utils/invoiceCalculations";

/**
 * CustomersTable Component
 * Orchestrates customer search, desktop table view, mobile responsive cards, and deletion confirmations.
 */
export default function CustomersTable({
  filteredCustomers,
  searchQuery,
  setSearchQuery,
  onViewHistory,
  onCreateInvoice,
  onDeleteCustomer,
}) {
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const triggerDeleteConfirm = (customer) => {
    setCustomerToDelete(customer);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      setIsConfirmOpen(false);
      await onDeleteCustomer(customerToDelete);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm no-print">
      {/* Dynamic top brand bar */}
      <div className="h-1 bg-[linear-gradient(90deg,#8b5cf6,#06b6d4,#f59e0b)] bg-[length:300%_100%]" />
      
      {/* Table Title and Search Field */}
      <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-6 w-6 text-violet-600" />
          গ্রাহকদের তালিকা
        </h2>
        <CustomerSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* DESKTOP TABLE VIEW - Hidden on Mobile */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="py-4 px-4 font-bold text-gray-700 w-[25%]">গ্রাহকের নাম</TableHead>
              <TableHead className="font-bold text-gray-700 w-[15%]">মোবাইল নম্বর</TableHead>
              <TableHead className="font-bold text-gray-700 w-[20%]">ঠিকানা</TableHead>
              <TableHead className="font-bold text-gray-700 text-center w-[10%]">মোট রশিদ</TableHead>
              <TableHead className="font-bold text-gray-700 text-right w-[12%]">মোট ক্রয়</TableHead>
              <TableHead className="font-bold text-gray-700 text-center w-[10%]">স্ট্যাটাস</TableHead>
              <TableHead className="font-bold text-gray-700 text-center w-[8%]">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-400 italic">
                  কোনো গ্রাহক পাওয়া যায়নি।
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer, index) => (
                <CustomerRow
                  key={index}
                  customer={customer}
                  onViewHistory={() => onViewHistory(customer)}
                  onCreateInvoice={() => onCreateInvoice(customer)}
                  onDeleteCustomer={() => triggerDeleteConfirm(customer)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE PREMIUM RESPONSIVE CARDS VIEW - Visible on Mobile only */}
      <div className="block md:hidden p-4 space-y-4 bg-gray-50/50">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12 text-gray-400 italic bg-white rounded-2xl border border-gray-100">
            কোনো গ্রাহক পাওয়া যায়নি।
          </div>
        ) : (
          filteredCustomers.map((customer, index) => {
            const latestDateStr = customer.latestBillDate
              ? new Date(customer.latestBillDate).toLocaleDateString("bn-BD")
              : "অজানা";

            return (
              <div
                key={index}
                className="rounded-3xl border border-gray-200 bg-white p-5 space-y-4 shadow-sm hover:shadow-md transition duration-300"
              >
                {/* Mobile Header: Initial Avatar + Name + Dues badge */}
                <div className="flex items-start justify-between gap-2 border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-violet-100 text-violet-700 font-extrabold flex items-center justify-center text-sm shrink-0">
                      {customer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{customer.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        শেষ রশিদ: {latestDateStr}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  {customer.totalDue > 0 ? (
                    <span className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold bg-rose-100 text-rose-700 animate-pulse">
                      বকেয়া: {formatCurrency(customer.totalDue)}
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold bg-green-100 text-green-700">
                      Paid
                    </span>
                  )}
                </div>

                {/* Mobile Details: Contact + Address */}
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-gray-400 font-mono" />
                    <span className="font-semibold text-gray-500">মোবাইল:</span>
                    <span className="font-mono text-gray-800">{customer.phone || "অজানা"}</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="font-semibold text-gray-500 shrink-0">ঠিকানা:</span>
                    <span className="text-gray-800 break-words">{customer.address || "অজানা"}</span>
                  </div>
                </div>

                {/* Mobile KPI Grid */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div className="text-center border-r border-gray-200">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">মোট রশিদ</p>
                    <h5 className="font-extrabold text-sm text-gray-700 mt-0.5 flex items-center justify-center gap-1">
                      <Receipt className="h-3.5 w-3.5 text-violet-500" />
                      {customer.bills.length} টি
                    </h5>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">মোট ক্রয়</p>
                    <h5 className="font-extrabold text-sm text-violet-700 mt-0.5 flex items-center justify-center gap-1">
                      <ShoppingBag className="h-3.5 w-3.5 text-violet-500" />
                      {formatCurrency(customer.totalSpent)}
                    </h5>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={() => onViewHistory(customer)}
                    className="flex-1 h-10 rounded-xl border-violet-200 text-violet-700 hover:bg-violet-50 transition font-bold text-xs gap-1 cursor-pointer"
                  >
                    ইতিহাস
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                  
                  <Button
                    onClick={() => onCreateInvoice(customer)}
                    className="flex-1 h-10 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs gap-1 cursor-pointer shadow-sm"
                  >
                    নতুন রশিদ
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => triggerDeleteConfirm(customer)}
                    className="h-10 w-10 p-0 rounded-xl text-rose-500 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
                    title="গ্রাহক মুছুন"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CONFIRM PERMANENT DELETE DIALOG */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-6 w-6 text-rose-600 animate-bounce" />
              <span>গ্রাহক স্থায়ীভাবে মুছুন?</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 leading-relaxed pt-2">
              আপনি কি নিশ্চিত যে আপনি গ্রাহক <strong className="text-gray-900">{customerToDelete?.name}</strong> কে স্থায়ীভাবে ডিলিট করতে চান?
              <br /><br />
              <span className="text-rose-600 font-bold block bg-rose-50 border border-rose-100 p-3 rounded-xl text-xs">
                ⚠️ সতর্কবার্তা: এর মাধ্যমে গ্রাহকের সাথে যুক্ত সকল ({customerToDelete?.bills.length} টি) বিক্রয় রশিদ স্থায়ীভাবে ডেটাবেজ থেকে মুছে ফেলা হবে। এই কাজটি আর ফিরিয়ে আনা সম্ভব নয়।
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-3 mt-6 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmOpen(false);
                setCustomerToDelete(null);
              }}
              className="flex-1 sm:flex-initial h-11 rounded-2xl cursor-pointer"
            >
              বাতিল
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="flex-1 sm:flex-initial h-11 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
            >
              হ্যাঁ, মুছুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
