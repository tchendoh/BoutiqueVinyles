require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { connectDB } = require('./db/mysql')

const app = express()
const port = 3000

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

// pour lire le contenu des requêtes POST
app.use(express.json())

const session = require('express-session')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized : false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }
}))

const productsRoutes = require('./routes/products')
const authRoutes = require('./routes/auth')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const paypalRoutes = require('./routes/paypal')

app.use('/api/products', productsRoutes)
app.use('/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/paypal', paypalRoutes)

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`http://localhost:${port}`))
  })
  .catch((err) => {
    console.error('Impossible de démarrer le serveur :', err.message)
    process.exit(1)
  })