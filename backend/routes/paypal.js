const express = require('express')
const router = express.Router()
const { Client, Environment, OrdersController, CheckoutPaymentIntent } = require('@paypal/paypal-server-sdk')

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_SECRET,
  },
  environment: Environment.Sandbox,
})

const ordersController = new OrdersController(client)

// POST /api/paypal/create-order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body

  try {
    const { body: rawOrder } = await ordersController.createOrder({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: 'CAD',
              value: amount,
            },
          },
        ],
      },
    })
    const order = typeof rawOrder === 'string' ? JSON.parse(rawOrder) : rawOrder
    res.json({ orderID: order.id })
  } catch (error) {
    res.status(500).json({ erreur: error.message })
  }
})

// POST /api/paypal/capture-order
router.post('/capture-order', async (req, res) => {
  const { orderID } = req.body

  try {
    const { body: rawCapture } = await ordersController.captureOrder({
      id: orderID,
      body: {},
    })
    const capture = typeof rawCapture === 'string' ? JSON.parse(rawCapture) : rawCapture
    res.json(capture)
  } catch (error) {
    res.status(500).json({ erreur: error.message })
  }
})

module.exports = router
