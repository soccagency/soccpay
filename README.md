# SoccPay JavaScript SDK

[![npm version](https://badge.fury.io/js/soccpay.svg)](https://badge.fury.io/js/soccpay)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive JavaScript SDK for integrating SoccPay payment processing into your web applications and Node.js projects.

## 🚀 Features

- 💻 **Universal**: Works in both browser and Node.js environments
- 🔒 **Secure**: Secure payment processing with SoccPay API
- 📱 **Mobile-friendly**: Responsive checkout experience
- 🛠️ **Easy Integration**: Simple and intuitive API
- 📦 **Lightweight**: Minimal dependencies
- 🌐 **Multi-currency**: Support for multiple currencies
- 📖 **Well Documented**: Comprehensive documentation and examples

## 📦 Installation

### NPM (Recommended)
```bash
npm install @soccagency/soccpay
```

### Yarn
```bash
yarn add @soccagency/soccpay
```

### CDN
```html
<script src="https://unpkg.com/@soccagency/soccpay@latest/dist/index.min.js"></script>
```

## ⚡ Quick Start

### Node.js
```javascript
const { SoccPay } = require('soccpay');

// Initialize SoccPay
const soccPay = new SoccPay();

// Create a payment
const payment = soccPay.createPayment()
    .setCredentials({
        client_id: 'your_client_id',
        client_secret: 'your_client_secret'
    })
    .setPayer(
        soccPay.createPayer().setPaymentMethod('SoccPay')
    )
    .setTransaction(
        soccPay.createTransaction()
            .setAmount(
                soccPay.createAmount()
                    .setTotal(49.99)
                    .setCurrency('USD')
            )
            .setDescription('Premium Product - Annual License')
    )
    .setRedirectUrls(
        soccPay.createRedirectUrls()
            .setSuccessUrl('https://yoursite.com/payment/success')
            .setCancelUrl('https://yoursite.com/payment/cancel')
    );

// Process the payment
payment.create().then(checkoutUrl => {
    console.log('✅ Payment created! Redirect user to:', checkoutUrl);
}).catch(error => {
    console.error('❌ Payment failed:', error);
});
```

### Browser (CDN)
```html
<!DOCTYPE html>
<html>
<head>
    <title>SoccPay Integration</title>
</head>
<body>
    <button id="payBtn">💳 Pay with SoccPay</button>
    
    <script src="https://unpkg.com/soccpay@latest/dist/index.min.js"></script>
    <script>
        const soccPay = new SoccPay.SoccPay();
        
        document.getElementById('payBtn').onclick = async function() {
            try {
                const payment = soccPay.createPayment()
                    .setCredentials({
                        client_id: 'your_client_id',
                        client_secret: 'your_client_secret'
                    })
                    .setPayer(
                        soccPay.createPayer().setPaymentMethod('SoccPay')
                    )
                    .setTransaction(
                        soccPay.createTransaction()
                            .setAmount(
                                soccPay.createAmount()
                                    .setTotal(49.99)
                                    .setCurrency('USD')
                            )
                            .setDescription('Premium Product')
                    )
                    .setRedirectUrls(
                        soccPay.createRedirectUrls()
                            .setSuccessUrl(window.location.origin + '/success')
                            .setCancelUrl(window.location.origin + '/cancel')
                    );
                
                const checkoutUrl = await payment.create();
                window.location.href = checkoutUrl;
            } catch (error) {
                alert('Payment failed: ' + error.message);
            }
        };
    </script>
</body>
</html>
```

### Browser (ES6 Modules)
```javascript
import { SoccPay } from 'soccpay';

const soccPay = new SoccPay();
// ... rest of the code
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
SOCCPAY_BASE_URL=https://api.soccpay.com/
SOCCPAY_CLIENT_ID=your_client_id
SOCCPAY_CLIENT_SECRET=your_client_secret
```

### Getting Credentials

1. Access your SoccPay dashboard
2. Go to **Merchants** → **Settings** (gear icon)
3. Copy your `Client ID` and `Client Secret`

## 🔧 Basic Usage

### Node.js

```javascript
const { SoccPay } = require('soccpay');

// Initialize SDK
const soccPay = new SoccPay();

async function createPayment() {
  try {
    // Create payment objects
    const payer = soccPay.createPayer()
      .setPaymentMethod('SoccPay');

    const amount = soccPay.createAmount()
      .setTotal(4.99)
      .setCurrency('USD');

    const transaction = soccPay.createTransaction()
      .setAmount(amount);

    const redirectUrls = soccPay.createRedirectUrls()
      .setSuccessUrl('https://yourdomain.com/success')
      .setCancelUrl('https://yourdomain.com/cancel');

    const payment = soccPay.createPayment()
      .setCredentials({
        client_id: process.env.SOCCPAY_CLIENT_ID,
        client_secret: process.env.SOCCPAY_CLIENT_SECRET
      })
      .setRedirectUrls(redirectUrls)
      .setPayer(payer)
      .setTransaction(transaction);

    // Create payment and get checkout URL
    const checkoutUrl = await payment.create();
    console.log('Checkout URL:', checkoutUrl);
    
    return checkoutUrl;
  } catch (error) {
    console.error('Error creating payment:', error.message);
  }
}

createPayment();
```

### Express.js

```javascript
const express = require('express');
const { SoccPay } = require('soccpay');

const app = express();
const soccPay = new SoccPay();

app.use(express.json());

// Create payment
app.post('/create-payment', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    const payment = soccPay.createPayment()
      .setCredentials({
        client_id: process.env.SOCCPAY_CLIENT_ID,
        client_secret: process.env.SOCCPAY_CLIENT_SECRET
      })
      .setPayer(soccPay.createPayer().setPaymentMethod('SoccPay'))
      .setTransaction(
        soccPay.createTransaction()
          .setAmount(
            soccPay.createAmount()
              .setTotal(amount)
              .setCurrency(currency)
          )
      )
      .setRedirectUrls(
        soccPay.createRedirectUrls()
          .setSuccessUrl('https://yourdomain.com/payment/success')
          .setCancelUrl('https://yourdomain.com/payment/cancel')
      );

    const checkoutUrl = await payment.create();
    res.json({ checkoutUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle successful response
app.get('/payment/success', (req, res) => {
  // Decode SoccPay response
  const encoded = JSON.stringify(req.query);
  const decoded = JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'));
  
  if (decoded.status === 200) {
    // Successful payment - update database, send email, etc.
    res.json({
      success: true,
      transactionId: decoded.transaction_id,
      merchant: decoded.merchant
    });
  } else {
    res.status(400).json({ success: false, message: 'Payment failed' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### Browser

```html
<!DOCTYPE html>
<html>
<head>
    <title>SoccPay Example</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://unpkg.com/soccpay/dist/index.min.js"></script>
</head>
<body>
    <button onclick="createPayment()">Pay Now</button>

    <script>
        async function createPayment() {
            try {
                // Configure SoccPay
        window.SOCCPAY_BASE_URL = 'https://api.soccpay.com';
        const soccPay = new SoccPay.SoccPay();
                
                // Create payment (in production, credentials should be on server)
                const checkoutUrl = await soccPay.createPayment({
                    credentials: {
                        client_id: 'your_client_id',
                        client_secret: 'your_client_secret'
                    },
                    amount: 4.99,
                    currency: 'USD',
                    successUrl: 'https://yourdomain.com/success',
                    cancelUrl: 'https://yourdomain.com/cancel'
                });
                
                // Redirect to checkout
                window.location.href = checkoutUrl;
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    </script>
</body>
</html>
```

## 📚 API Reference

### SoccPay

Main SDK class.

```javascript
const soccPay = new SoccPay({
    baseUrl: 'https://api.soccpay.com' // Optional
});
```

#### Methods

- `createPayment(data)` - Create Payment instance
- `createAmount(data)` - Create Amount instance
- `createPayer(data)` - Create Payer instance
- `createTransaction(data)` - Create Transaction instance
- `createRedirectUrls(data)` - Create RedirectUrls instance
- `setBaseUrl(url)` - Set base URL
- `getBaseUrl()` - Get current base URL

### Payment

Main class for handling payments.

```javascript
const payment = soccPay.createPayment()
  .setCredentials({ client_id: 'xxx', client_secret: 'xxx' })
  .setPayer(payer)
  .setTransaction(transaction)
  .setRedirectUrls(redirectUrls);

const checkoutUrl = await payment.create();
```

### Amount

Handles transaction amount and currency.

```javascript
const amount = soccPay.createAmount()
  .setTotal(4.99)
  .setCurrency('USD');
```

### Payer

Defines the payment method.

```javascript
const payer = soccPay.createPayer()
    .setPaymentMethod('SoccPay');
```

### Transaction

Contains transaction information.

```javascript
const transaction = soccPay.createTransaction()
  .setAmount(amount);
```

### RedirectUrls

Handles redirect URLs.

```javascript
const redirectUrls = soccPay.createRedirectUrls()
  .setSuccessUrl('https://yourdomain.com/success')
  .setCancelUrl('https://yourdomain.com/cancel');
```

## 🔄 Response Handling

### Successful Response

When payment is successful, SoccPay redirects to your `successUrl` with encrypted parameters:

```javascript
function handleSuccess(queryParams) {
  const encoded = JSON.stringify(queryParams);
  const decoded = JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'));
  
  if (decoded.status === 200) {
    console.log('Transaction ID:', decoded.transaction_id);
    console.log('Merchant:', decoded.merchant);
    // Update database, send confirmation, etc.
  }
}
```

### Cancellation Response

When user cancels, they are redirected to your `cancelUrl`.

## 🛠️ Development

### Clone Repository

```bash
git clone https://github.com/soccagency/soccpay.git
cd soccpay
npm install
```

### Available Scripts

```bash
# Build for production
npm run build

# Development with watch
npm run dev

# Run examples
node examples/basic-payment.js
node examples/express-server.js
```

### Project Structure

```
soccpay/
├── src/
│   ├── api/              # API classes
│   ├── common/           # Base classes
│   ├── config/           # Configuration
│   ├── http/             # HTTP client
│   └── index.js          # Entry point
├── examples/             # Usage examples
├── dist/                 # Built files
└── README.md
```

## 🔒 Security

### Best Practices

1. **Never expose credentials in frontend**
2. **Use HTTPS in production**
3. **Validate server responses**
4. **Implement transaction logging**
5. **Use environment variables for configuration**

### Environment Variables

```env
# Required
SOCCPAY_BASE_URL=https://soccpay.yourdomain.com/
SOCCPAY_CLIENT_ID=your_client_id
SOCCPAY_CLIENT_SECRET=your_client_secret

# Optional
NODE_ENV=production
PORT=3000
```

## 🐛 Troubleshooting

### Common Errors

#### "Please check your client ID or client secret again"
- Verify your credentials are correct
- Make sure the merchant is active

#### "Network error: No response received from server"
- Verify SoccPay base URL
- Check network connectivity

#### "Currency must be a valid 3-letter currency code"
- Use ISO 4217 currency codes (USD, EUR, GBP, etc.)
- Verify the currency is enabled in your account

### Debug

```javascript
// Enable detailed logs
process.env.DEBUG = 'soccpay:*';

// Capture detailed errors
try {
  await payment.create();
} catch (error) {
  console.error('Full error:', error);
  console.error('Stack trace:', error.stack);
}
```

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

- 📧 Email: support@soccpay.com
- 📖 Documentación: [https://docs.soccpay.com](https://soccpay.com/docs)
- 🐛 Issues: [GitHub Issues](https://github.com/soccagency/soccpay/issues)

## 📋 Changelog

### v1.0.0
- ✅ Lanzamiento inicial
- ✅ Soporte para Node.js y navegadores
- ✅ API completa de SoccPay
- ✅ Ejemplos y documentación

---

**¡Hecho con ❤️ para la comunidad de desarrolladores!**