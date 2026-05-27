/**
 * Helper utility functions for currency, calculations, and date formatting.
 */

export function formatCurrency(amount = 0) {
  return `৳ ${Number(amount).toLocaleString("bn-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateString) {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return dateString;
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    const datePart = d.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timePart = d.toLocaleTimeString("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${datePart} (${timePart})`;
  } catch (error) {
    return dateString;
  }
}
