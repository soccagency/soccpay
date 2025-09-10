/**
 * Configuration class for SoccPay SDK
 * Handles environment variables and base URL configuration
 */
class Config {
  constructor() {
    // Load environment variables if in Node.js environment
    if (typeof process !== 'undefined' && process.env) {
      try {
        require('dotenv').config();
      } catch (e) {
        // dotenv not available in browser environment
      }
    }
    
    this.baseUrl = this.getBaseUrl();
  }

  /**
   * Get base URL from environment variables or use default
   * @returns {string} Base URL for SoccPay API
   */
  getBaseUrl() {
    // Try to get from environment variables
    if (typeof process !== 'undefined' && process.env && process.env.SOCCPAY_BASE_URL) {
      return process.env.SOCCPAY_BASE_URL;
    }
    
    // Try to get from window object (browser environment)
    if (typeof window !== 'undefined' && window.SOCCPAY_BASE_URL) {
      return window.SOCCPAY_BASE_URL;
    }
    
    // Default fallback (should be configured by user)
    return 'http://your-domain.com/';
  }

  /**
   * Set base URL manually
   * @param {string} url - The base URL to set
   */
  setBaseUrl(url) {
    this.baseUrl = url;
  }
}

// Export singleton instance
module.exports = new Config();