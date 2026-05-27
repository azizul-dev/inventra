import { useState, useMemo, useEffect } from "react";

/**
 * Custom hook to handle all billing calculations, form states, and manual overrides.
 */
export default function useBillingCalculations({
  prefillName = "",
  prefillPhone = "",
  prefillAddress = "",
} = {}) {
  const [customerName, setCustomerName] = useState(prefillName);
  const [customerPhone, setCustomerPhone] = useState(prefillPhone);
  const [customerAddress, setCustomerAddress] = useState(prefillAddress);

  // Default to manual inputs from the start as requested by the user.
  const [items, setItems] = useState([
    {
      id: "1",
      productName: "",
      quantity: 1,
      unit: "pcs",
      sellPrice: 0,
    },
  ]);

  const [discount, setDiscount] = useState(0);
  const [vatPercent, setVatPercent] = useState(0);

  // Keep paidAmount and dueAmount fully editable states.
  const [paidAmount, setPaidAmountState] = useState("");
  const [dueAmount, setDueAmountState] = useState("");

  // Sync prefill values if they change
  useEffect(() => {
    if (prefillName) setCustomerName(prefillName);
    if (prefillPhone) setCustomerPhone(prefillPhone);
    if (prefillAddress) setCustomerAddress(prefillAddress);
  }, [prefillName, prefillPhone, prefillAddress]);

  // Subtotal Calculation
  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.sellPrice) || 0),
      0
    );
  }, [items]);

  // Grand Total Calculation
  const grandTotal = useMemo(() => {
    const vatAmount = (subtotal * (Number(vatPercent) || 0)) / 100;
    return Math.max(0, subtotal + vatAmount - (Number(discount) || 0));
  }, [subtotal, discount, vatPercent]);

  // Intelligent syncing that doesn't block manual overrides:
  // Whenever the grandTotal changes, we recalculate dueAmount based on paidAmount.
  // If paidAmount is empty, we assume full payment is yet to be configured (or paid is grandTotal).
  useEffect(() => {
    if (paidAmount === "") {
      setDueAmountState("0");
    } else {
      const paid = Number(paidAmount) || 0;
      setDueAmountState(String(Math.max(0, grandTotal - paid)));
    }
  }, [grandTotal, paidAmount]);

  // Direct state setters that act as custom handlers
  const handlePaidAmountChange = (val) => {
    setPaidAmountState(val);
    // Automatically update due amount as a starting point, but user can override it
    if (val === "") {
      setDueAmountState("0");
    } else {
      const paid = Number(val) || 0;
      setDueAmountState(String(Math.max(0, grandTotal - paid)));
    }
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
        quantity: 1,
        unit: "pcs",
        sellPrice: 0,
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
      if (field === "quantity") {
        updated[index].quantity = Math.max(0, Number(value) || 0);
      } else if (field === "sellPrice") {
        updated[index].sellPrice = Math.max(0, Number(value) || 0);
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
        quantity: 1,
        unit: "pcs",
        sellPrice: 0,
      },
    ]);
    setDiscount(0);
    setVatPercent(0);
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
