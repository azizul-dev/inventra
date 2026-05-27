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

  // Custom hook managing state, search filters, and delete operations
  const {
    searchQuery,
    setSearchQuery,
    filteredCustomers,
    deleteCustomer,
    billingList,
  } = useCustomersData(initialBillingList, token);

  // Custom hook aggregating key stats indicators for top summary cards
  const stats = useCRMStats(filteredCustomers, billingList);

  // Modal drawer state controls
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const handleViewHistory = (customer) => {
    setSelectedCustomer(customer);
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

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50/50">
      {/* Styles injected specifically for A4 printing. 
          dangerouslySetInnerHTML is used here to bypass styled-jsx and avoid SSR/Client class mismatches. */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-customer-invoice,
          #printable-customer-invoice * {
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
      />

      {/* Client Profile and Bill Timeline Drawer Modal (Unified single modal details preview) */}
      <CustomerProfileModal
        isOpen={isCustomerModalOpen}
        onOpenChange={setIsCustomerModalOpen}
        customer={selectedCustomer}
        onDownloadPDF={handleDownloadPDF}
      />
    </div>
  );
}
