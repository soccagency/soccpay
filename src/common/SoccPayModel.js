const HttpClient = require('../http/HttpClient');

/**
 * Base model class for SoccPay SDK
 * Provides common functionality for all API entities
 */
class SoccPayModel {
  constructor(data = {}) {
    this.httpClient = new HttpClient();
    
    // Initialize properties from data if provided
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => {
        this[key] = data[key];
      });
    }
  }

  /**
   * Convert model to JSON object
   * @returns {Object} JSON representation of the model
   */
  toJSON() {
    const json = {};
    Object.keys(this).forEach(key => {
      if (key !== 'httpClient' && !key.startsWith('_')) {
        const value = this[key];
        if (value && typeof value.toJSON === 'function') {
          json[key] = value.toJSON();
        } else {
          json[key] = value;
        }
      }
    });
    return json;
  }

  /**
   * Set a property value with method chaining
   * @param {string} property - Property name
   * @param {*} value - Property value
   * @returns {SoccPayModel} This instance for chaining
   */
  set(property, value) {
    this[property] = value;
    return this;
  }

  /**
   * Get a property value
   * @param {string} property - Property name
   * @returns {*} Property value
   */
  get(property) {
    return this[property];
  }

  /**
   * Validate required properties
   * @param {Array<string>} requiredProps - Array of required property names
   * @throws {Error} If any required property is missing
   */
  validateRequired(requiredProps) {
    const missing = requiredProps.filter(prop => {
      const value = this[prop];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      throw new Error(`Missing required properties: ${missing.join(', ')}`);
    }
  }
}

module.exports = SoccPayModel;