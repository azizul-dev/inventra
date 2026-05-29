import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { groupCustomers } from "../utils/groupCustomers";

/**
 * Custom React hook to manage CRM customer data, search filters, and delete operations.
 */
export function useCustomersData(initialBillingList = [], token) {
  const router = useRouter();
  const [billingList, setBillingList] = useState(initialBillingList);
  const [searchQuery, setSearchQuery] = useState("");

  // Keep billingList synchronized with incoming props when page re-renders/navigates
  useEffect(() => {
    setBillingList(initialBillingList);
  }, [initialBillingList]);

  // Process and group customer profiles dynamically from billing invoices
  const customersData = useMemo(() => {
    return groupCustomers(billingList);
  }, [billingList]);

  // Enhanced search filtering: partial matches for Name, Phone, or Address
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customersData;

    return customersData.filter((customer) => {
      const nameMatch = (customer.name || "").toLowerCase().includes(q);
      const phoneMatch = (customer.phone || "").toLowerCase().includes(q);
      const addressMatch = (customer.address || "").toLowerCase().includes(q);
      return nameMatch || phoneMatch || addressMatch;
    });
  }, [customersData, searchQuery]);

  /**
   * Deletes a customer permanently by deleting all invoices associated with them.
   */
  const deleteCustomer = async (customer) => {
    if (!customer || !customer.bills || customer.bills.length === 0) {
      toast.error("মুছার জন্য কোনো বিল পাওয়া যায়নি।");
      return false;
    }

    const toastId = toast.loading(`${customer.name} এর ${customer.bills.length} টি রশিদ স্থায়ীভাবে মুছা হচ্ছে...`);

    try {
      const baseUrl = (!process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL.includes("localhost:8000"))
        ? "/api"
        : process.env.NEXT_PUBLIC_SERVER_URL;

      // Loop over invoices and dispatch DELETE calls
      const deletePromises = customer.bills.map(async (bill) => {
        const res = await fetch(`${baseUrl}/billing/${bill._id}`, {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          let errMsg = `রশিদ #${bill._id.substring(18)} মুছতে সমস্যা হয়েছে`;
          try {
            const errData = await res.json();
            if (errData && errData.error) {
              errMsg = `${errMsg} (${errData.error})`;
            }
          } catch (e) {}
          throw new Error(errMsg);
        }
        return res.json();
      });

      await Promise.all(deletePromises);

      // Successfully deleted all bills. Update local state.
      const deletedIds = customer.bills.map((b) => b._id);
      setBillingList((prev) => prev.filter((b) => !deletedIds.includes(b._id)));
      
      toast.success(`${customer.name} এর সকল তথ্য ও রশিদ স্থায়ীভাবে ডিলিট করা হয়েছে!`, {
        id: toastId,
      });

      router.refresh();
      return true;
    } catch (error) {
      console.error("Batch invoice deletion error:", error);
      toast.error(error.message || "গ্রাহকের তথ্য মুছতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।", {
        id: toastId,
      });
      return false;
    }
  };

  return {
    billingList,
    setBillingList,
    searchQuery,
    setSearchQuery,
    customersData,
    filteredCustomers,
    deleteCustomer,
  };
}
