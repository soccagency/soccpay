/**
 * Success Handler Example
 * 
 * This example shows how to handle the success callback from SoccPay
 * when used in a Node.js/Express server environment
 */

/**
 * Decode and validate SoccPay success response
 * @param {Object} queryParams - Query parameters from the success URL
 * @returns {Object|null} Decoded response data or null if invalid
 */
function handleSoccPaySuccess(queryParams) {
  try {
    if (!queryParams || Object.keys(queryParams).length === 0) {
      console.log('No query parameters received');
      return null;
    }

    // Encode the query parameters to JSON
    const encoded = JSON.stringify(queryParams);
    console.log('Encoded data:', encoded);

    // Decode the base64 encoded data
    const decoded = JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'));
    console.log('Decoded data:', decoded);

    // Check if the payment was successful
    if (decoded.status === 200) {
      console.log('\n=== Payment Successful ===');
      console.log('Status:', decoded.status);
      console.log('Transaction ID:', decoded.transaction_id);
      console.log('Merchant:', decoded.merchant);
      
      // Uncomment these lines if you need additional information
      // console.log('Currency:', decoded.currency);
      // console.log('Amount:', decoded.amount);
      // console.log('Fee:', decoded.fee);
      // console.log('Total:', decoded.total);
      
      return decoded;
    } else {
      console.log('Payment was not successful. Status:', decoded.status);
      return null;
    }
    
  } catch (error) {
    console.error('Error processing SoccPay response:', error.message);
    return null;
  }
}

/**
 * Express.js route handler example
 * Use this in your Express.js application
 */
function createExpressSuccessHandler() {
  return (req, res) => {
    const result = handleSoccPaySuccess(req.query);
    
    if (result) {
      // Payment was successful - do something here
      // Examples:
      // - Update your database
      // - Send confirmation email
      // - Update user account
      // - Log the transaction
      
      res.json({
        success: true,
        message: 'Payment processed successfully',
        transactionId: result.transaction_id,
        merchant: result.merchant
      });
    } else {
      // Payment failed or invalid response
      res.status(400).json({
        success: false,
        message: 'Invalid payment response'
      });
    }
  };
}

/**
 * Example usage with sample data
 */
function exampleUsage() {
  // Example query parameters that would come from SoccPay
  const sampleQueryParams = {
    // This would be the actual encoded data from SoccPay
    // For demonstration purposes only
  };
  
  console.log('=== SoccPay Success Handler Example ===');
  console.log('This handler processes the success callback from SoccPay');
  console.log('\nIn a real application, you would:');
  console.log('1. Set up an Express.js route for your success URL');
  console.log('2. Use handleSoccPaySuccess() to process the response');
  console.log('3. Update your database with the transaction details');
  console.log('4. Show a success page to the user');
  
  console.log('\nExample Express.js setup:');
  console.log(`
const express = require('express');
const { createExpressSuccessHandler } = require('./success-handler');

const app = express();

// Set up the success route
app.get('/payment/success', createExpressSuccessHandler());

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
`);
}

// Run example if this file is executed directly
if (require.main === module) {
  exampleUsage();
}

module.exports = {
  handleSoccPaySuccess,
  createExpressSuccessHandler
};