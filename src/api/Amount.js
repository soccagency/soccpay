const SoccPayModel = require('../common/SoccPayModel');

/**
 * Amount class for SoccPay SDK
 * Handles transaction amount and currency
 */
class Amount extends SoccPayModel {
  constructor(data = {}) {
    super(data);
    this.totalAmount = data.totalAmount || null;
    this.currency = data.currency || null;
  }

  /**
   * Set the total amount
   * @param {number} amount - The total amount
   * @returns {Amount} This instance for chaining
   */
  setTotal(amount) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Amount must be a positive number');
    }
    this.totalAmount = amount;
    return this;
  }

  /**
   * Get the total amount
   * @returns {number} The total amount
   */
  getTotal() {
    return this.totalAmount;
  }

  /**
   * Set the currency code
   * @param {string} currency - The currency code (e.g., 'USD', 'EUR')
   * @returns {Amount} This instance for chaining
   */
  setCurrency(currency) {
    if (typeof currency !== 'string' || currency.length !== 3) {
      throw new Error('Currency must be a valid 3-letter currency code');
    }
    this.currency = currency.toUpperCase();
    return this;
  }

  /**
   * Get the currency code
   * @returns {string} The currency code
   */
  getCurrency() {
    return this.currency;
  }

  /**
   * Validate the amount object
   * @throws {Error} If validation fails
   */
  validate() {
    this.validateRequired(['totalAmount', 'currency']);
    
    if (this.totalAmount <= 0) {
      throw new Error('Total amount must be greater than 0');
    }
    
    if (!/^[A-Z]{3}$/.test(this.currency)) {
      throw new Error('Currency must be a valid 3-letter currency code');
    }
  }
}

module.exports = Amount;