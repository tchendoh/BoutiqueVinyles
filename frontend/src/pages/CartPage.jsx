import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { getCart, updateCartItem, createOrder, paypalCreateOrder, paypalCaptureOrder } from '../services/api'

function CartPage() {
  const [cart, setCart] = useState([])
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getCart().then(data => setCart(data))
  }, [])

  async function handleQuantity(id, quantity) {
    const updated = await updateCartItem(id, quantity)
    setCart(updated)
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cart.length === 0) return (
    <div className="page">
      <h1>Panier</h1>
      <p>Votre panier est vide.</p>
    </div>
  )

  return (
    <div className="page">
      <h1>Panier</h1>

      <div className="cart-list">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <Link to={`/products/${item.id}`}>
              <img src={item.image_url} alt={item.title} className="cart-item__image" />
            </Link>
            <div className="cart-item__info">
              <Link to={`/products/${item.id}`} className="cart-item__title-link">
                <h3 className="cart-item__title">{item.title}</h3>
              </Link>
              <p className="cart-item__artist">{item.artist}</p>
            </div>
            <div className="cart-item__controls">
              <button onClick={() => handleQuantity(item.id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <span className="cart-item__price">{(item.price * item.quantity).toFixed(2)} $</span>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <span>Total</span>
        <span>{total.toFixed(2)} $</span>
      </div>

      <div className="cart-paypal">
      <PayPalScriptProvider options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: 'CAD',
        disableFunding: 'paylater,card'
      }}>
        <PayPalButtons
          style={{ layout: 'vertical', color: 'black' }}
          disableFunding={['paylater', 'card']}
          createOrder={async () => {
            const { orderID } = await paypalCreateOrder(total.toFixed(2))
            return orderID
          }}
          onApprove={async (data) => {
            const details = await paypalCaptureOrder(data.orderID)
            await createOrder(details.id)
            setTimeout(() => setMessage('Commande confirmée ! Merci pour ton argent !'), 500)
            setTimeout(() => navigate('/orders'), 2500)
          }}
          onError={(err) => {
            console.error('Erreur PayPal :', err)
          }}
        />
      </PayPalScriptProvider>
      </div>

      {message && (
        <div className="overlay">
          <div className="overlay-message">{message}</div>
        </div>
      )}
    </div>
  )
}

export default CartPage
