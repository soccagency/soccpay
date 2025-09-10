const SoccPayModel = require('../common/SoccPayModel');

/**
 * Payer class for SoccPay SDK
 * Handles payment method configuration
 */
class Payer extends SoccPayModel {
  constructor(data = {}) {
    super(data);
    this.paymentMethod = data.paymentMethod || null;
  }

  /**
   * Set the payment method
   * @param {string} method - The payment method (e.g., 'SoccPay')
   * @returns {Payer} This instance for chaining
   */
  setPaymentMethod(method) {
    if (typeof method !== 'string' || method.trim() === '') {
      throw new Error('Payment method must be a non-empty string');
    }
    this.paymentMethod = method.trim();
    return this;
  }

  /**
   * Get the payment method
   * @returns {string} The payment method
   */
  getPaymentMethod() {
    return this.paymentMethod;
  }

  /**
   * Validate the payer object
   * @throws {Error} If validation fails
   */
  validate() {
    this.validateRequired(['paymentMethod']);
    
    if (typeof this.paymentMethod !== 'string' || this.paymentMethod.trim() === '') {
      throw new Error('Payment method must be a non-empty string');
    }
  }
}

module.exports = Payer;