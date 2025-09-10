/**
 * SoccPay JavaScript SDK
 * Main entry point for the SDK
 */

// Import all API classes
const Payment = require('./api/Payment');
const Amount = require('./api/Amount');
const Payer = require('./api/Payer');
const Transaction = require('./api/Transaction');
const RedirectUrls = require('./api/RedirectUrls');

// Import utilities
const Config = require('./config/Config');
const HttpClient = require('./http/HttpClient');
const SoccPayModel = require('./common/SoccPayModel');

/**
 * SoccPay SDK class
 * Provides a convenient interface to create and manage payments
 */
class SoccPay {
  /**
   * Create a new SoccPay SDK instance
   * @param {Object} config - Configuration options
   * @param {string} config.baseUrl - Base URL for SoccPay API (optional)
   */
  constructor(config = {}) {
    if (config.baseUrl) {
      Config.setBaseUrl(config.baseUrl);
    }
  }

  /**
   * Create a new Payment instance
   * @param {Object} data - Initial payment data
   * @returns {Payment} New Payment instance
   */
  createPayment(data = {}) {
    return new Payment(data);
  }

  /**
   * Create a new Amount instance
   * @param {Object} data - Initial amount data
   * @returns {Amount} New Amount instance
   */
  createAmount(data = {}) {
    return new Amount(data);
  }

  /**
   * Create a new Payer instance
   * @param {Object} data - Initial payer data
   * @returns {Payer} New Payer instance
   */
  createPayer(data = {}) {
    return new Payer(data);
  }

  /**
   * Create a new Transaction instance
   * @param {Object} data - Initial transaction data
   * @returns {Transaction} New Transaction instance
   */
  createTransaction(data = {}) {
    return new Transaction(data);
  }

  /**
   * Create a new RedirectUrls instance
   * @param {Object} data - Initial redirect URLs data
   * @returns {RedirectUrls} New RedirectUrls instance
   */
  createRedirectUrls(data = {}) {
    return new RedirectUrls(data);
  }

  /**
   * Set the base URL for the API
   * @param {string} url - The base URL
   */
  setBaseUrl(url) {
    Config.setBaseUrl(url);
  }

  /**
   * Get the current base URL
   * @returns {string} The current base URL
   */
  getBaseUrl() {
    return Config.baseUrl;
  }
}

// Export individual classes for direct use
module.exports = {
  SoccPay,
  Payment,
  Amount,
  Payer,
  Transaction,
  RedirectUrls,
  Config,
  HttpClient,
  SoccPayModel
};

// Also export SoccPay as default for convenience
module.exports.default = SoccPay;