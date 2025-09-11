/**
 * Basic Payment Example
 */

const { SoccPay, Payment, Amount, Payer, Transaction, RedirectUrls } = require('../src/index');

// Initialize SoccPay SDK
const soccPay = new SoccPay();

async function createPayment() {
  try {
    // Create Payer Object
    const payer = soccPay.createPayer()
      .setPaymentMethod('SoccPay'); // preferably, your system name

    // Create Amount Object
    const amount = soccPay.createAmount()
      .setTotal(4.99)
      .setCurrency('USD'); // must give a valid currency code and must exist in merchant wallet list

    // Create Transaction Object
    const transaction = soccPay.createTransaction()
      .setAmount(amount);

    // Create RedirectUrls Object
    const redirectUrls = soccPay.createRedirectUrls()
      .setSuccessUrl('http://your-merchant-domain.com/success') // success url - the merchant domain page, to redirect after successful payment
      .setCancelUrl('http://your-merchant-domain.com/cancel') // cancel url - the merchant domain page, to redirect after cancellation of payment
      .setIpnWebhook('http://your-merchant-domain.com/ipn'); // ipn webhook url - the merchant domain page, to receive IPN notifications

    // Create Payment Object
    const payment = soccPay.createPayment()
      .setCredentials({
        client_id: process.env.SOCCPAY_CLIENT_ID || 'your_client_id',
        client_secret: process.env.SOCCPAY_CLIENT_SECRET || 'your_client_secret'
      })
      .setRedirectUrls(redirectUrls)
      .setPayer(payer)
      .setTransaction(transaction);

    // Create payment and get checkout URL
    const checkoutUrl = await payment.create();
    
    console.log('Payment created successfully!');
    console.log('Checkout URL:', checkoutUrl);
    console.log('Redirect user to this URL to complete payment');
    
    return checkoutUrl;
    
  } catch (error) {
    console.error('Payment creation failed:', error.message);
    throw error;
  }
}

// Execute the payment creation
if (require.main === module) {
  createPayment()
    .then(url => {
      console.log('\n=== Payment Process ===');
      console.log('1. Payment created successfully');
      console.log('2. Redirect user to:', url);
      console.log('3. User completes payment');
      console.log('4. User is redirected to success/cancel URL');
    })
    .catch(error => {
      console.error('\n=== Payment Failed ===');
      console.error('Error:', error.message);
      process.exit(1);
    });
}

module.exports = { createPayment };