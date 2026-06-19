const express = require('express')
const router = express.Router()
const { pool } = require('../db/mysql')


router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products ORDER BY RAND()')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ erreur: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ erreur: 'Produit introuvable' })
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ erreur: error.message })
  }
})

module.exports = router  