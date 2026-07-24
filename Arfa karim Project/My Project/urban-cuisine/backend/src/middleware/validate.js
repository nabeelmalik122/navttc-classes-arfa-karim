const { validationResult } = require('express-validator');

/**
 * Runs after express-validator chains.
 * Returns 400 with first validation error if any exist.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

module.exports = validate;
