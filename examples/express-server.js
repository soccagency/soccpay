/**
 * Ejemplo completo de servidor Express con SoccPay SDK
 * Muestra cómo integrar pagos en una aplicación Node.js real
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const { SoccPay } = require('../src/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Inicializar SoccPay SDK
const soccPay = new SoccPay();

// Página principal con formulario de pago
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SoccPay - Demo de Integración</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 50px auto; 
                padding: 20px;
                background: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            input, select {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
            }
            button {
                background: #007bff;
                color: white;
                padding: 12px 30px;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
            }
            button:hover {
                background: #0056b3;
            }
            .status {
                margin-top: 20px;
                padding: 10px;
                border-radius: 5px;
                display: none;
            }
            .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 SoccPay SDK - Demo</h1>
            <p>Ejemplo de integración completa con Node.js + Express</p>
            
            <form id="paymentForm">
                <div class="form-group">
                    <label for="amount">Monto:</label>
                    <input type="number" id="amount" name="amount" value="29.99" step="0.01" min="0.01" required>
                </div>
                
                <div class="form-group">
                    <label for="currency">Moneda:</label>
                    <select id="currency" name="currency">
                        <option value="USD">USD - Dólar Americano</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="MXN">MXN - Peso Mexicano</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="description">Descripción:</label>
                    <input type="text" id="description" name="description" value="Producto de ejemplo" required>
                </div>
                
                <button type="submit">💳 Procesar Pago</button>
            </form>
            
            <div id="status" class="status"></div>
            
            <hr style="margin: 30px 0;">
            <h3>📋 Estado de Configuración:</h3>
            <ul>
                <li><strong>Client ID:</strong> ${process.env.SOCCPAY_CLIENT_ID ? '✅ Configurado' : '❌ No configurado'}</li>
                <li><strong>Client Secret:</strong> ${process.env.SOCCPAY_CLIENT_SECRET ? '✅ Configurado' : '❌ No configurado'}</li>
                <li><strong>Base URL:</strong> ${process.env.SOCCPAY_BASE_URL || 'Usando default'}</li>
            </ul>
            
            ${!process.env.SOCCPAY_CLIENT_ID || !process.env.SOCCPAY_CLIENT_SECRET ? 
                '<p style="color: red;"><strong>⚠️ Configura las variables de entorno para probar pagos reales</strong></p>' : 
                '<p style="color: green;"><strong>✅ Configuración completa - Listo para pagos reales</strong></p>'
            }
        </div>
        
        <script>
            document.getElementById('paymentForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData);
                const statusDiv = document.getElementById('status');
                const submitBtn = e.target.querySelector('button');
                
                // Mostrar loading
                submitBtn.textContent = '⏳ Procesando...';
                submitBtn.disabled = true;
                statusDiv.style.display = 'none';
                
                try {
                    const response = await fetch('/create-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        statusDiv.className = 'status success';
                        statusDiv.innerHTML = '✅ Pago creado exitosamente. Redirigiendo...';
                        statusDiv.style.display = 'block';
                        
                        // Redirigir después de 2 segundos
                        setTimeout(() => {
                            window.location.href = result.checkout_url;
                        }, 2000);
                    } else {
                        throw new Error(result.error || 'Error desconocido');
                    }
                } catch (error) {
                    statusDiv.className = 'status error';
                    statusDiv.innerHTML = '❌ Error: ' + error.message;
                    statusDiv.style.display = 'block';
                } finally {
                    submitBtn.textContent = '💳 Procesar Pago';
                    submitBtn.disabled = false;
                }
            });
        </script>
    </body>
    </html>
    `);
});

// API endpoint para crear pagos
app.post('/create-payment', async (req, res) => {
    try {
        const { amount, currency = 'USD', description = 'Pago' } = req.body;
        
        // Validar datos
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Monto inválido'
            });
        }
        
        // Verificar credenciales
        if (!process.env.SOCCPAY_CLIENT_ID || !process.env.SOCCPAY_CLIENT_SECRET) {
            return res.status(500).json({
                success: false,
                error: 'Credenciales de SoccPay no configuradas. Configura SOCCPAY_CLIENT_ID y SOCCPAY_CLIENT_SECRET en tu archivo .env'
            });
        }
        
        console.log(`🔄 Creando pago: ${amount} ${currency} - ${description}`);
        
        // Crear pago con SoccPay SDK
        const payment = soccPay.createPayment()
            .setCredentials({
                client_id: process.env.SOCCPAY_CLIENT_ID,
                client_secret: process.env.SOCCPAY_CLIENT_SECRET
            })
            .setPayer(
                soccPay.createPayer()
                    .setPaymentMethod('SoccPay')
            )
            .setTransaction(
                soccPay.createTransaction()
                    .setAmount(
                        soccPay.createAmount()
                            .setTotal(parseFloat(amount))
                            .setCurrency(currency)
                    )
                    .setDescription(description)
            )
            .setRedirectUrls(
                soccPay.createRedirectUrls()
                    .setSuccessUrl(`${req.protocol}://${req.get('host')}/success?amount=${amount}&currency=${currency}`)
                    .setCancelUrl(`${req.protocol}://${req.get('host')}/cancel`)
            );
        
        // Ejecutar creación del pago
        const checkoutUrl = await payment.create();
        
        console.log(`✅ Pago creado exitosamente: ${checkoutUrl}`);
        
        res.json({
            success: true,
            checkout_url: checkoutUrl,
            amount: amount,
            currency: currency,
            description: description
        });
        
    } catch (error) {
        console.error('❌ Error al crear pago:', error);
        
        res.status(500).json({
            success: false,
            error: error.message || 'Error interno del servidor'
        });
    }
});

// Página de éxito
app.get('/success', (req, res) => {
    const { amount, currency } = req.query;
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pago Exitoso - SoccPay</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 50px auto; 
                padding: 20px;
                background: #f5f5f5;
                text-align: center;
            }
            .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .success-icon {
                font-size: 64px;
                color: #28a745;
                margin-bottom: 20px;
            }
            .amount {
                font-size: 24px;
                color: #28a745;
                font-weight: bold;
                margin: 20px 0;
            }
            .back-btn {
                background: #007bff;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success-icon">✅</div>
            <h1>¡Pago Exitoso!</h1>
            <p>Tu pago ha sido procesado correctamente.</p>
            ${amount && currency ? `<div class="amount">${amount} ${currency}</div>` : ''}
            <p>Recibirás un email de confirmación en breve.</p>
            <a href="/" class="back-btn">← Volver al inicio</a>
        </div>
    </body>
    </html>
    `);
});

// Página de cancelación
app.get('/cancel', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pago Cancelado - SoccPay</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 50px auto; 
                padding: 20px;
                background: #f5f5f5;
                text-align: center;
            }
            .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .cancel-icon {
                font-size: 64px;
                color: #dc3545;
                margin-bottom: 20px;
            }
            .back-btn {
                background: #007bff;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="cancel-icon">❌</div>
            <h1>Pago Cancelado</h1>
            <p>El pago fue cancelado por el usuario.</p>
            <p>No se realizó ningún cargo.</p>
            <a href="/" class="back-btn">← Intentar de nuevo</a>
        </div>
    </body>
    </html>
    `);
});

// Endpoint de salud para verificar que el servidor funciona
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        sdk_version: require('../package.json').version,
        environment: {
            client_id_configured: !!process.env.SOCCPAY_CLIENT_ID,
            client_secret_configured: !!process.env.SOCCPAY_CLIENT_SECRET,
            base_url: process.env.SOCCPAY_BASE_URL || 'default'
        }
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send(`
    <h1>404 - Página no encontrada</h1>
    <p><a href="/">← Volver al inicio</a></p>
    `);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🚀 Servidor SoccPay Demo iniciado');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🔧 Health check: http://localhost:${PORT}/health`);
    console.log('');
    console.log('📋 Configuración:');
    console.log(`   Client ID: ${process.env.SOCCPAY_CLIENT_ID ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`   Client Secret: ${process.env.SOCCPAY_CLIENT_SECRET ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`   Base URL: ${process.env.SOCCPAY_BASE_URL || 'Default'}`);
    console.log('');
    
    if (!process.env.SOCCPAY_CLIENT_ID || !process.env.SOCCPAY_CLIENT_SECRET) {
        console.log('⚠️  Para probar pagos reales, configura:');
        console.log('   SOCCPAY_CLIENT_ID=tu_client_id');
        console.log('   SOCCPAY_CLIENT_SECRET=tu_client_secret');
        console.log('   en tu archivo .env');
    } else {
        console.log('✅ ¡Listo para procesar pagos reales!');
    }
    console.log('');
});

module.exports = app;