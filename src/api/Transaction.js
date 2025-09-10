const SoccPayModel = require('../common/SoccPayModel');

/**
 * Transaction class for SoccPay payments
 * Handles transaction information including amount
 */
class Transaction extends SoccPayModel {
  constructor(data = {}) {
    super(data);
    this.amount = data.amount || null;
  }

  /**
   * Set the amount for this transaction
   * @param {Amount} amount - The Amount object
   * @returns {Transaction} This instance for chaining
   */
  setAmount(amount) {
    if (!amount || typeof amount.getTotal !== 'function') {
      throw new Error('Amount must be a valid Amount object');
    }
    this.amount = amount;
    return this;
  }

  /**
   * Get the amount for this transaction
   * @returns {Amount} The Amount object
   */
  getAmount() {
    return this.amount;
  }

  /**
   * Validate the transaction object
   * @throws {Error} If validation fails
   */
  validate() {
    this.validateRequired(['amount']);
    
    if (!this.amount || typeof this.amount.getTotal !== 'function') {
      throw new Error('Transaction must have a valid Amount object');
    }
    
    // Validate the amount object
    if (typeof this.amount.validate === 'function') {
      this.amount.validate();
    }
  }
}

module.exports = Transaction;