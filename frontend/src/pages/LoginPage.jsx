import { Link } from 'react-router-dom'
import { login, getMe } from '../services/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()
  const { setUser } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await login({ email, password })
      const me = await getMe()
      setUser(me.firstName)
      setMessage('Connexion réussie !')
      setTimeout(() => navigate('/'), 2000)
    } catch (error) {
      setMessage('E : ' + error.message)
      setTimeout(() => setMessage(''), 2000)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Connexion</h1>

        <div className="auth-field">
          <label htmlFor="email">Courriel</label>
          <input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Mot de passe</label>
          <input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Se connecter</button>
        {message && (
          <div className="overlay">
            <div className="overlay-message">{message}</div>
          </div>
        )}
        <p className="auth-link">
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
