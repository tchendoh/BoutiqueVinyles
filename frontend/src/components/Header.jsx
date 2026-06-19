import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { logout } from '../services/api'

function Header() {
  const { firstName, clearUser } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    clearUser()
    navigate('/')
  }

  return (
    <header className="site-header">
      <Link to="/" className="site-header__logo">Boutique Vinyles</Link>
      <nav className="site-header__nav">
        <Link to="/">// Albums</Link>
        {firstName && <Link to="/orders">// Commandes</Link>}
        {!firstName && <Link to="/login">// Connexion</Link>}
        {!firstName && <Link to="/register">// Inscription</Link>}
        <Link to="/cart">// Panier</Link>
      </nav>
      <div className="site-header__right">
        {firstName && (
          <span className="site-header__user">
            Bonjour, {firstName}
            <button className="site-header__logout" onClick={handleLogout}>✕</button>
          </span>
        )}
      </div>
    </header>
  )
}

export default Header
