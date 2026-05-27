import { useMemo } from "react";

/**
 * Custom React hook to calculate CRM dashboard summary statistics
 */
export function useCRMStats(customersData = [], billingList = []) {
  return useMemo(() => {
    const totalCustomers = customersData.length;
    
    // Sum total sales (subtotal or grand totals)
    const totalSales = billingList.reduce((sum, bill) => sum + (bill.total || 0), 0);
    
    // Sum total dues
    const totalDue = billingList
      .filter((bill) => bill.status === "Due")
      .reduce((sum, bill) => sum + (bill.dueAmount !== undefined ? bill.dueAmount : (bill.total || 0)), 0);

    // Find highest spender
    let topSpender = null;
    if (customersData.length > 0) {
      topSpender = customersData.reduce((prev, current) =>
        prev.totalSpent > current.totalSpent ? prev : current
      );
    }

    return {
      totalCustomers,
      totalSales,
      totalDue,
      topSpender,
    };
  }, [customersData, billingList]);
}
