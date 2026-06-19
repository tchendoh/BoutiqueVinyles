const express = require('express')
const router = express.Router()
const { pool } = require('../db/mysql')

// Le POST qui reçoit le numéro de transaction
router.post('/', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Pas connecté!' })
  }

  const cart = req.session.cart
  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: 'Panier vide!' })
  }

  const { paypalTransactionId } = req.body

  let total = 0
  for (const item of cart) {
    total += item.price * item.quantity
  }
  const conn = await pool.getConnection()
  await conn.beginTransaction()

  try {
    const [orderResult] = await conn.execute(
      'INSERT INTO orders (user_id, status, total_amount) VALUES (?, ?, ?)',
      [req.session.userId, 'paid', total.toFixed(2)]
    )
    const orderId = orderResult.insertId

    for (const item of cart) {
      await conn.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      )
    }

    await conn.execute(
      'INSERT INTO payments (order_id, paypal_transaction_id, amount, status, paid_at) VALUES (?, ?, ?, ?, NOW())',
      [orderId, paypalTransactionId, total.toFixed(2), 'paid']
    )

    req.session.cart = []
    await conn.commit()

    res.status(201).json({ orderId })

  } catch (error) {
    await conn.rollback()
    res.status(500).json({ erreur: error.message })
  } finally {
    conn.release()
  }
})

// le get pour la liste des commandes
router.get('/', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Pas connecté!' })
  }

  try {
    const [rows] = await pool.execute(
      `SELECT o.id AS order_id, o.created_at, o.total_amount,
              p.id AS product_id, p.title, p.artist, p.image_url,
              oi.quantity, oi.unit_price
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN products p ON p.id = oi.product_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [req.session.userId]
    )

    const groupedOrders = {}
    for (const row of rows) {
      if (!groupedOrders[row.order_id]) {
        groupedOrders[row.order_id] = {
          order_id: row.order_id,
          created_at: row.created_at,
          total_amount: row.total_amount,
          items: []
        }
      }
      groupedOrders[row.order_id].items.push({
        product_id: row.product_id,
        title: row.title,
        artist: row.artist,
        image_url: row.image_url,
        quantity: row.quantity,
        unit_price: row.unit_price
      })
    }

    res.json(Object.values(groupedOrders))
  } catch (error) {
    res.status(500).json({ erreur: error.message })
  }
})

module.exports = router