/**
 * Groups raw billing list into individual customer objects.
 * Aggregates spendings, paid amounts, dues, and maintains reference to invoices.
 */
export function groupCustomers(billingList = []) {
  const groups = {};
  
  billingList.forEach((bill) => {
    const phone = bill.customerPhone?.trim() || "";
    const name = bill.customerName?.trim() || "";
    
    // Unique key by phone if present, otherwise lowercase name
    const key = phone ? phone : name.toLowerCase();
    
    if (!key) return; // Skip invalid records

    if (!groups[key]) {
      groups[key] = {
        name: bill.customerName || "অজানা গ্রাহক",
        phone: phone,
        address: bill.customerAddress?.trim() || "",
        bills: [],
        totalSpent: 0,
        totalPaid: 0,
        totalDue: 0,
        latestBillDate: bill.createdAt,
      };
    }

    groups[key].bills.push(bill);
    groups[key].totalSpent += bill.total || 0;
    
    // Check payment status or safe dues sum
    if (bill.status === "Paid") {
      groups[key].totalPaid += bill.total || 0;
    } else {
      groups[key].totalDue += bill.dueAmount !== undefined ? bill.dueAmount : (bill.total || 0);
      groups[key].totalPaid += bill.paidAmount !== undefined ? bill.paidAmount : 0;
    }

    // Keep latest customer details
    if (new Date(bill.createdAt) > new Date(groups[key].latestBillDate)) {
      groups[key].latestBillDate = bill.createdAt;
      if (bill.customerAddress?.trim()) groups[key].address = bill.customerAddress.trim();
      if (bill.customerPhone?.trim()) groups[key].phone = bill.customerPhone.trim();
    }
  });

  return Object.values(groups).sort(
    (a, b) => new Date(b.latestBillDate) - new Date(a.latestBillDate)
  );
}
