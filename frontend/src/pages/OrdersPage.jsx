import { useState, useEffect, Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getOrders } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function OrdersPage() {
  const { firstName, loading } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    if (loading) return
    if (!firstName) {
      navigate('/login')
      return
    }
    getOrders().then(data => setOrders(data))
  }, [loading, firstName])

  function toggleExpand(orderId) {
    setExpanded(prev => ({ ...prev, [orderId]: !prev[orderId] }))
  }

  if (orders.length === 0) return (
    <div className="page">
      <h1>Historique des commandes</h1>
      <p>Aucune commande.</p>
    </div>
  )

  return (
    <div className="page">
      <h1>Historique des commandes</h1>

      <table className="orders-table">
        <thead>
          <tr>
            <th># Commande</th>
            <th>Date</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <Fragment key={order.order_id}>
              <tr>
                <td>BV-{38400 + order.order_id}</td>
                <td>{new Date(order.created_at).toLocaleDateString('fr-CA')}</td>
                <td>{parseFloat(order.total_amount).toFixed(2)} $</td>
                <td>
                  <button onClick={() => toggleExpand(order.order_id)}>
                    {expanded[order.order_id] ? '−' : '+'}
                  </button>
                </td>
              </tr>
              {expanded[order.order_id] && order.items.map((item, i) => (
                <tr key={i} className="orders-table__item">
                  <td colSpan={2}><Link to={`/products/${item.product_id}`} className="orders-table__item-link">{item.title} — {item.artist}</Link></td>
                  <td>{item.quantity} × {parseFloat(item.unit_price).toFixed(2)} $</td>
                  <td></td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrdersPage
