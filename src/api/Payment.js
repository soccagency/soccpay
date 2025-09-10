const SoccPayModel = require('../common/SoccPayModel');

/**
 * Payment class for SoccPay SDK
 * Main class that handles payment creation and processing
 */
class Payment extends SoccPayModel {
  constructor(data = {}) {
    super(data);
    this.payer = data.payer || null;
    this.transaction = data.transaction || null;
    this.redirectUrls = data.redirectUrls || null;
    this.credentials = data.credentials || null;
    this.approvedUrl = data.approvedUrl || null;
  }

  /**
   * Set the payer for this payment
   * @param {Payer} payer - The Payer object
   * @returns {Payment} This instance for chaining
   */
  setPayer(payer) {
    if (!payer || typeof payer.getPaymentMethod !== 'function') {
      throw new Error('Payer must be a valid Payer object');
    }
    this.payer = payer;
    return this;
  }

  /**
   * Get the payer for this payment
   * @returns {Payer} The Payer object
   */
  getPayer() {
    return this.payer;
  }

  /**
   * Set the transaction for this payment
   * @param {Transaction} transaction - The Transaction object
   * @returns {Payment} This instance for chaining
   */
  setTransaction(transaction) {
    if (!transaction || typeof transaction.getAmount !== 'function') {
      throw new Error('Transaction must be a valid Transaction object');
    }
    this.transaction = transaction;
    return this;
  }

  /**
   * Get the transaction for this payment
   * @returns {Transaction} The Transaction object
   */
  getTransaction() {
    return this.transaction;
  }

  /**
   * Set the redirect URLs for this payment
   * @param {RedirectUrls} redirectUrls - The RedirectUrls object
   * @returns {Payment} This instance for chaining
   */
  setRedirectUrls(redirectUrls) {
    if (!redirectUrls || typeof redirectUrls.getSuccessUrl !== 'function') {
      throw new Error('RedirectUrls must be a valid RedirectUrls object');
    }
    this.redirectUrls = redirectUrls;
    return this;
  }

  /**
   * Get the redirect URLs for this payment
   * @returns {RedirectUrls} The RedirectUrls object
   */
  getRedirectUrls() {
    return this.redirectUrls;
  }

  /**
   * Set the credentials for API authentication
   * @param {Object} credentials - Object containing client_id and client_secret
   * @returns {Payment} This instance for chaining
   */
  setCredentials(credentials) {
    if (!credentials || !credentials.client_id || !credentials.client_secret) {
      throw new Error('Credentials must contain client_id and client_secret');
    }
    this.credentials = credentials;
    return this;
  }

  /**
   * Get the credentials
   * @returns {Object} The credentials object
   */
  getCredentials() {
    return this.credentials;
  }

  /**
   * Set the approved URL
   * @param {string} url - The approved URL
   * @returns {Payment} This instance for chaining
   */
  setApprovedUrl(url) {
    this.approvedUrl = url;
    return this;
  }

  /**
   * Get the approved URL
   * @returns {string} The approved URL
   */
  getApprovedUrl() {
    return this.approvedUrl;
  }

  /**
   * Create the payment
   * This method handles the complete payment flow:
   * 1. Get access token
   * 2. Send transaction info
   * 3. Set approved URL
   * @returns {Promise<string>} The approved URL for payment
   */
  async create() {
    try {
      // Validate all required components
      this.validate();
      
      // Get access token
      const accessToken = await this.getAccessToken();
      
      // Send transaction info and get approved URL
      const approvedUrl = await this.sendTransactionInfo(accessToken);
      
      // Set the approved URL
      this.setApprovedUrl(approvedUrl);
      
      return approvedUrl;
    } catch (error) {
      throw new Error(`Payment creation failed: ${error.message}`);
    }
  }

  /**
   * Get access token from SoccPay API
   * @returns {Promise<string>} The access token
   * @private
   */
  async getAccessToken() {
    const payload = {
      client_id: this.credentials.client_id,
      client_secret: this.credentials.client_secret
    };

    try {
      const response = await this.httpClient.post('merchant/api/verify', payload);
      
      if (!response) {
        throw new Error('Please check your client ID or client secret again');
      }
      
      if (response.status === 'error') {
        throw new Error(response.message || 'Authentication failed');
      }
      
      return response.data.access_token;
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Send transaction information to SoccPay API
   * @param {string} token - The access token
   * @returns {Promise<string>} The approved URL
   * @private
   */
  async sendTransactionInfo(token) {
    const amount = this.transaction.getAmount();
    const paymentMethod = this.payer.getPaymentMethod();
    const successUrl = this.redirectUrls.getSuccessUrl();
    const cancelUrl = this.redirectUrls.getCancelUrl();

    const payload = {
      payer: paymentMethod,
      amount: amount.getTotal(),
      currency: amount.getCurrency(),
      successUrl: successUrl,
      cancelUrl: cancelUrl
    };

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await this.httpClient.post('merchant/api/transaction-info', payload, headers);
      
      if (!response) {
        throw new Error('Please check your transaction details again!');
      }
      
      if (response.status === 'error') {
        throw new Error(response.message || 'Transaction creation failed');
      }
      
      return response.data.approvedUrl;
    } catch (error) {
      throw new Error(`Transaction creation failed: ${error.message}`);
    }
  }

  /**
   * Validate the payment object
   * @throws {Error} If validation fails
   */
  validate() {
    this.validateRequired(['payer', 'transaction', 'redirectUrls', 'credentials']);
    
    // Validate individual components
    if (typeof this.payer.validate === 'function') {
      this.payer.validate();
    }
    
    if (typeof this.transaction.validate === 'function') {
      this.transaction.validate();
    }
    
    if (typeof this.redirectUrls.validate === 'function') {
      this.redirectUrls.validate();
    }
    
    if (!this.credentials.client_id || !this.credentials.client_secret) {
      throw new Error('Credentials must contain client_id and client_secret');
    }
  }
}

module.exports = Payment;