const express = require('express')
const router = express.Router()

// Route /api/cart

// ajoute un produit
router.post('/', async (req, res) => {
    const { id, title, price, image_url } = req.body
    const cart = req.session.cart || []

    const item = cart.find(item => item.id === id)
    if (item) {
        item.quantity++
    } else {
        cart.push({ id, title, price, image_url, quantity: 1 })
    }
    
    // On save la session + on retourne le cart
    req.session.cart = cart
    res.json(cart)

})

// retourn le panier
router.get('/', async (req, res) => {
    res.json(req.session.cart || [])
})

router.put('/:id', async (req, res) => {
    if (!req.session.cart) {
        return res.status(404).json({ message: 'Panier inexistant' })
    }
    
    let cart = req.session.cart || []
    const item = cart.find(item => item.id === parseInt(req.params.id))
    if (item) {
        item.quantity = req.body.quantity
        if (parseInt(item.quantity) <= 0) {
            req.session.cart = cart.filter(item => item.id !== parseInt(req.params.id))
        } else {
            req.session.cart = cart
        }
        res.json(req.session.cart)
        return
    } else {
        return res.status(404).json({ message: 'Item inexistant' })
    }
    
})

module.exports = router
