import { Link } from 'react-router-dom'
import { register } from '../services/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await register({ firstName, lastName, email, password })
      setMessage('Inscription réussie !')
      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      setMessage('E : ' + error.message)
      setTimeout(() => setMessage(''), 2000)
      
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Inscription</h1>

        <div className="auth-field">
          <label htmlFor="firstName">Prénom</label>
          <input 
            id="firstName" 
            type="text" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="lastName">Nom</label>
          <input 
            id="lastName" 
            type="text" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

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

        <button type="submit">Créer un compte</button>
        {message && (
          <div className="overlay">
            <div className="overlay-message">{message}</div>
          </div>
        )}
        <p className="auth-link">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
