const SoccPayModel = require('../common/SoccPayModel');

/**
 * RedirectUrls class for SoccPay SDK
 * Handles success and cancel URLs for payment redirection
 */
class RedirectUrls extends SoccPayModel {
  constructor(data = {}) {
    super(data);
    this.successUrl = data.successUrl || null;
    this.cancelUrl = data.cancelUrl || null;
  }

  /**
   * Set the ipn webhook URL
   * @param {string} url - The ipn webhook URL
   * @returns {RedirectUrls} This instance for chaining
   */
  setIpnWebhook(url) {
    if (!this.isValidUrl(url)) {
      throw new Error('Success URL must be a valid HTTP/HTTPS URL');
    }
    this.ipnWebhook = url;
    return this;
  }

  /**
   * Get the ipn webhook URL
   * @returns {string} The ipn webhook URL
   */
  getIpnWebhook() {
    return this.ipnWebhook;
  }

  /**
   * Set the success URL
   * @param {string} url - The success redirect URL
   * @returns {RedirectUrls} This instance for chaining
   */
  setSuccessUrl(url) {
    if (!this.isValidUrl(url)) {
      throw new Error('Success URL must be a valid HTTP/HTTPS URL');
    }
    this.successUrl = url;
    return this;
  }

  /**
   * Get the success URL
   * @returns {string} The success URL
   */
  getSuccessUrl() {
    return this.successUrl;
  }

  /**
   * Set the cancel URL
   * @param {string} url - The cancel redirect URL
   * @returns {RedirectUrls} This instance for chaining
   */
  setCancelUrl(url) {
    if (!this.isValidUrl(url)) {
      throw new Error('Cancel URL must be a valid HTTP/HTTPS URL');
    }
    this.cancelUrl = url;
    return this;
  }

  /**
   * Get the cancel URL
   * @returns {string} The cancel URL
   */
  getCancelUrl() {
    return this.cancelUrl;
  }

  /**
   * Validate if a string is a valid URL
   * @param {string} url - The URL to validate
   * @returns {boolean} True if valid URL
   * @private
   */
  isValidUrl(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  /**
   * Validate the redirect URLs object
   * @throws {Error} If validation fails
   */
  validate() {
    this.validateRequired(['successUrl', 'cancelUrl']);
    
    if (!this.isValidUrl(this.successUrl)) {
      throw new Error('Success URL must be a valid HTTP/HTTPS URL');
    }
    
    if (!this.isValidUrl(this.cancelUrl)) {
      throw new Error('Cancel URL must be a valid HTTP/HTTPS URL');
    }
  }
}

module.exports = RedirectUrls;