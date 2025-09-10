const axios = require('axios');
const config = require('../config/Config');

/**
 * HTTP Client class for SoccPay SDK
 * Handles all HTTP requests using axios
 */
class HttpClient {
  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Execute HTTP request
   * @param {string} url - The endpoint URL
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {Object} data - Request payload
   * @param {Object} headers - Additional headers
   * @returns {Promise<Object>} Response data
   */
  async execute(url, method = 'GET', data = null, headers = {}) {
    try {
      const fullUrl = url.startsWith('http') ? url : `${config.baseUrl}${url}`;
      
      const requestConfig = {
        method: method.toUpperCase(),
        url: fullUrl,
        headers: { ...this.client.defaults.headers, ...headers }
      };

      if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
        requestConfig.data = data;
      }

      const response = await this.client.request(requestConfig);
      return response.data;
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        throw new Error(`HTTP ${error.response.status}: ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error: No response received from server');
      } else {
        // Something else happened
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  /**
   * Make GET request
   * @param {string} url - The endpoint URL
   * @param {Object} headers - Additional headers
   * @returns {Promise<Object>} Response data
   */
  async get(url, headers = {}) {
    return this.execute(url, 'GET', null, headers);
  }

  /**
   * Make POST request
   * @param {string} url - The endpoint URL
   * @param {Object} data - Request payload
   * @param {Object} headers - Additional headers
   * @returns {Promise<Object>} Response data
   */
  async post(url, data, headers = {}) {
    return this.execute(url, 'POST', data, headers);
  }
}

module.exports = HttpClient;