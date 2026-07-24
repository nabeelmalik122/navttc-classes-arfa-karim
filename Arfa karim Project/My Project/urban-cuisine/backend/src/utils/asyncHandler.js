/**
 * Wraps async route handlers to forward errors to Express error middleware
 * without try/catch boilerplate in every controller.
 * @param {Function} fn - async route handler
 * @returns {Function} wrapped handler
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
