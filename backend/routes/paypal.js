const express = require('express')
const router = express.Router()
const { Client, Environment, OrdersController, CheckoutPaymentIntent } = require('@paypal/paypal-server-sdk')

// Source : https://developer.paypal.com/docs/api/orders/sdk/v2/

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
    const { result } = await ordersController.createOrder({
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
    res.json({ orderID: result.id })
  } catch (error) {
    res.status(500).json({ erreur: error.message })
  }
})

// POST /api/paypal/capture-order
router.post('/capture-order', async (req, res) => {
  const { orderID } = req.body

  try {
    const { result } = await ordersController.captureOrder({
      id: orderID,
      body: {},
    })
    res.json(result)
  } catch (error) {
    res.status(500).json({ erreur: error.message })
  }
})

module.exports = router
