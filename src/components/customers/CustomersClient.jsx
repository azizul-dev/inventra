"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomersData } from "./hooks/useCustomersData";
import { useCRMStats } from "./hooks/useCRMStats";
import { generateInvoicePDF } from "./utils/generateInvoicePDF";

// Subcomponents
import CustomersHeader from "./header/CustomersHeader";
import CRMStats from "./stats/CRMStats";
import CustomersTable from "./table/CustomersTable";
import CustomerProfileModal from "./modal/CustomerProfileModal";

/**
 * CustomersClient Component
 * Integrates all modular CRM subcomponents, custom hooks, and modal controllers.
 */
export default function CustomersClient({
  session,
  token,
  initialBillingList = [],
}) {
  const router = useRouter();
  const isAdmin = session?.user?.role === "admin";

  // Custom hook managing state, search filters, and delete operations
  const {
    searchQuery,
    setSearchQuery,
    filteredCustomers,
    deleteCustomer,
    deleteBill,
    billingList,
  } = useCustomersData(initialBillingList, token);

  // Custom hook aggregating key stats indicators for top summary cards
  const stats = useCRMStats(filteredCustomers, billingList);

  // Modal drawer state controls (tracked by reactive lookup key)
  const [selectedCustomerKey, setSelectedCustomerKey] = useState(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // Compute selected customer details reactively from the current filtered list
  const currentCustomer = useMemo(() => {
    if (!selectedCustomerKey) return null;
    return filteredCustomers.find((c) => {
      const key = c.phone ? c.phone : c.name.toLowerCase();
      return key === selectedCustomerKey;
    });
  }, [filteredCustomers, selectedCustomerKey]);

  const handleViewHistory = (customer) => {
    const key = customer.phone ? customer.phone : customer.name.toLowerCase();
    setSelectedCustomerKey(key);
    setIsCustomerModalOpen(true);
  };

  const handleCreateInvoice = (customer) => {
    router.push(
      `/billing?customerName=${encodeURIComponent(customer.name)}&customerPhone=${encodeURIComponent(
        customer.phone || ""
      )}&customerAddress=${encodeURIComponent(customer.address || "")}`
    );
  };

  const handleDownloadPDF = async (invoice) => {
    await generateInvoicePDF(invoice, "printable-customer-invoice");
  };

  const handleEditBill = (bill) => {
    setIsCustomerModalOpen(false);
    router.push(`/billing?editBillId=${bill._id}`);
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50/50">
      {/* Styles injected specifically for A4 printing. 
          dangerouslySetInnerHTML is used here to bypass styled-jsx and avoid SSR/Client class mismatches. */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          /* Keep the Radix Portal, dialog container and print content visible */
          [data-radix-portal],
          [data-radix-portal] *,
          .dialog-print-container,
          .dialog-print-container * {
            visibility: visible;
          }
          #printable-customer-invoice,
          #printable-customer-invoice * {
            visibility: visible;
          }
          
          /* Style the dialog content container for clean paper print */
          .dialog-print-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            max-height: none !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
          }
          
          #printable-customer-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
          }

          /* Hide modal close buttons, backdrop overlays, and other UI controls */
          button[aria-label="Close"],
          [data-radix-el-close],
          [class*="DialogOverlay"],
          [class*="backdrop"],
          .no-print {
            display: none !important;
            opacity: 0 !important;
          }
        }
      `}} />

      {/* Title Header Section */}
      <CustomersHeader />

      {/* CRM Statistics Indicators Cards */}
      <CRMStats stats={stats} />

      {/* Grouped Customers Table (Desktop/Mobile layouts with confirmation flows) */}
      <CustomersTable
        filteredCustomers={filteredCustomers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onViewHistory={handleViewHistory}
        onCreateInvoice={handleCreateInvoice}
        onDeleteCustomer={deleteCustomer}
        isAdmin={isAdmin}
      />

      {/* Client Profile and Bill Timeline Drawer Modal (Unified single modal details preview) */}
      <CustomerProfileModal
        isOpen={isCustomerModalOpen}
        onOpenChange={(open) => {
          setIsCustomerModalOpen(open);
          if (!open) setSelectedCustomerKey(null);
        }}
        customer={currentCustomer}
        onDownloadPDF={handleDownloadPDF}
        onDeleteBill={deleteBill}
        onEditBill={handleEditBill}
        isAdmin={isAdmin}
      />
    </div>
  );
}
