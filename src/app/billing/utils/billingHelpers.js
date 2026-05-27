/**
 * Format a numeric value into Bangladeshi Taka currency format.
 * @param {number|string} amount
 * @returns {string} Formatted amount with Taka symbol
 */
export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return `৳ ${num.toLocaleString()}`;
}

/**
 * Format a date string or object into Bengali locale date.
 * @param {string|Date} date
 * @returns {string} Formatted date (e.g. "২৭/৫/২০২৬")
 */
export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("bn-BD");
}

/**
 * Format a date string or object into Bengali locale date and time.
 * @param {string|Date} date
 * @returns {string} Formatted date-time (e.g. "২৭/৫/২০২৬, ১১:৪৫:০০ AM")
 */
export function formatDateTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("bn-BD");
}
