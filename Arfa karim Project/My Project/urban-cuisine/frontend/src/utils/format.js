/**
 * Format a number as USD currency string.
 * @param {number} value
 * @returns {string}  e.g. "$24.00"
 */
export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

/**
 * Format a date string or Date object as a readable date.
 * @param {string|Date} date
 * @returns {string}  e.g. "Wednesday, July 16, 2026"
 */
export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

/**
 * Format a date string or Date object as a short date.
 * @param {string|Date} date
 * @returns {string}  e.g. "Jul 16, 2026"
 */
export const formatDateShort = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

/**
 * Truncate a string to a max length and append ellipsis.
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
export const truncate = (str, max = 100) =>
  str?.length > max ? `${str.slice(0, max)}…` : str;

/**
 * Capitalize first letter of every word.
 * @param {string} str
 * @returns {string}
 */
export const titleCase = (str) =>
  str?.replace(/\b\w/g, (c) => c.toUpperCase()) ?? '';
