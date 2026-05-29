import { useState, useMemo, useEffect } from "react";

// Helper to normalize Bangla and English digits to standard English float
export const parseNum = (val) => {
  if (val === null || val === undefined) return 0;
  const s = String(val).trim();
  if (s === "") return 0;
  const banglaDigits = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9"
  };
  const normalized = s.replace(/[০-৯]/g, (match) => banglaDigits[match]);
  return parseFloat(normalized) || 0;
};

// Helper to convert standard English numbers back to Bangla digits
export const englishToBanglaDigits = (val) => {
  if (val === null || val === undefined) return "";
  const s = String(val);
  const banglaDigits = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
  };
  return s.replace(/[0-9]/g, (match) => banglaDigits[match]);
};

// Check if string contains any Bangla digits
export const hasBanglaDigits = (str) => /[০-৯]/.test(String(str));

/**
 * Custom hook to handle all billing calculations, form states, and manual overrides.
 */
export default function useBillingCalculations({
  prefillName = "",
  prefillPhone = "",
  prefillAddress = "",
  editBill = null,
} = {}) {
  const [customerName, setCustomerName] = useState(editBill ? editBill.customerName : prefillName);
  const [customerPhone, setCustomerPhone] = useState(editBill ? editBill.customerPhone : prefillPhone);
  const [customerAddress, setCustomerAddress] = useState(editBill ? editBill.customerAddress : prefillAddress);

  // Default to manual inputs from the start as requested by the user.
  const [items, setItems] = useState(
    editBill && editBill.items && editBill.items.length > 0
      ? editBill.items.map((item, idx) => ({
          id: String(idx + 1),
          productName: item.productName || "",
          quantity: String(item.quantity),
          unit: item.unit || "pcs",
          sellPrice: String(item.sellPrice),
        }))
      : [
          {
            id: "1",
            productName: "",
            quantity: "1",
            unit: "pcs",
            sellPrice: "",
          },
        ]
  );

  // Calculate initial subtotal and discount if editing
  const initialSubtotal = editBill
    ? editBill.items.reduce((sum, item) => sum + parseNum(item.quantity) * parseNum(item.sellPrice), 0)
    : 0;
  const initialDiscount = editBill ? Math.max(0, initialSubtotal - editBill.total) : 0;

  const [discount, setDiscount] = useState(initialDiscount > 0 ? String(initialDiscount) : "");
  const [vatPercent, setVatPercent] = useState("");

  // Keep paidAmount and dueAmount fully editable manual states.
  const [paidAmount, setPaidAmountState] = useState(editBill ? String(editBill.paidAmount) : "");
  const [dueAmount, setDueAmountState] = useState(editBill ? String(editBill.dueAmount) : "");

  // Sync prefill or editBill values if they change
  useEffect(() => {
    if (editBill) {
      setCustomerName(editBill.customerName || "");
      setCustomerPhone(editBill.customerPhone || "");
      setCustomerAddress(editBill.customerAddress || "");
      if (editBill.items && editBill.items.length > 0) {
        setItems(
          editBill.items.map((item, idx) => ({
            id: String(idx + 1),
            productName: item.productName || "",
            quantity: String(item.quantity),
            unit: item.unit || "pcs",
            sellPrice: String(item.sellPrice),
          }))
        );
      }
      const sub = editBill.items.reduce((sum, item) => sum + parseNum(item.quantity) * parseNum(item.sellPrice), 0);
      const disc = Math.max(0, sub - editBill.total);
      setDiscount(disc > 0 ? String(disc) : "");
      setVatPercent("");
      setPaidAmountState(String(editBill.paidAmount));
      setDueAmountState(String(editBill.dueAmount));
    } else {
      if (prefillName) setCustomerName(prefillName);
      if (prefillPhone) setCustomerPhone(prefillPhone);
      if (prefillAddress) setCustomerAddress(prefillAddress);
    }
  }, [editBill, prefillName, prefillPhone, prefillAddress]);

  // Subtotal Calculation using parseNum to support Bangla digits
  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + parseNum(item.quantity) * parseNum(item.sellPrice),
      0
    );
  }, [items]);

  // Grand Total Calculation using parseNum to support Bangla digits
  const grandTotal = useMemo(() => {
    const vatAmount = (subtotal * parseNum(vatPercent)) / 100;
    return Math.max(0, subtotal + vatAmount - parseNum(discount));
  }, [subtotal, discount, vatPercent]);

  // Automatically calculate outstanding due amount based on grandTotal and paidAmount
  useEffect(() => {
    if (paidAmount === "") {
      // If no paid amount is written, outstanding is the grand total
      const containsBangla = hasBanglaDigits(discount) || hasBanglaDigits(vatPercent) || items.some(item => hasBanglaDigits(item.sellPrice) || hasBanglaDigits(item.quantity));
      setDueAmountState(containsBangla ? englishToBanglaDigits(grandTotal) : String(grandTotal));
    } else {
      const paid = parseNum(paidAmount);
      const computedDue = Math.max(0, grandTotal - paid);
      // Keep output digit system aligned with the paid amount's digit system
      setDueAmountState(hasBanglaDigits(paidAmount) ? englishToBanglaDigits(computedDue) : String(computedDue));
    }
  }, [grandTotal, paidAmount, discount, vatPercent, items]);

  // Direct state setters that act as custom handlers
  const handlePaidAmountChange = (val) => {
    setPaidAmountState(val);
  };

  const handleDueAmountChange = (val) => {
    setDueAmountState(val);
  };

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        productName: "",
        quantity: "1",
        unit: "pcs",
        sellPrice: "",
      },
    ]);
  };

  const removeItemRow = (index) => {
    setItems((prev) => {
      if (prev.length > 1) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  };

  const handleItemFieldChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      if (field === "quantity" || field === "sellPrice") {
        updated[index][field] = value;
      } else {
        updated[index][field] = value;
      }
      return updated;
    });
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setItems([
      {
        id: "1",
        productName: "",
        quantity: "1",
        unit: "pcs",
        sellPrice: "",
      },
    ]);
    setDiscount("");
    setVatPercent("");
    setPaidAmountState("");
    setDueAmountState("");
  };

  return {
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerAddress,
    setCustomerAddress,
    items,
    setItems,
    discount,
    setDiscount,
    vatPercent,
    setVatPercent,
    paidAmount,
    setPaidAmount: handlePaidAmountChange,
    dueAmount,
    setDueAmount: handleDueAmountChange,
    subtotal,
    grandTotal,
    addItemRow,
    removeItemRow,
    handleItemFieldChange,
    resetForm,
  };
}
