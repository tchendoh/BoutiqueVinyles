import axios from 'axios'

const API_URL = 'http://localhost:3000'
axios.defaults.withCredentials = true

export async function getProducts() {
  const { data } = await axios.get(`${API_URL}/api/products`)
  return data
}

export async function getProduct(id) {
  const { data } = await axios.get(`${API_URL}/api/products/${id}`)
  return data
}

export async function register(userData) {
  const { data } = await axios.post(`${API_URL}/auth/register`, userData)
  return data
}

export async function login(userData) {
  const { data } = await axios.post(`${API_URL}/auth/login`, userData)
  return data
}

export async function logout() {
  const { data } = await axios.post(`${API_URL}/auth/logout`)
  return data
}

export async function getMe() {
  const { data } = await axios.get(`${API_URL}/auth/me`)
  return data
}

export async function getCart() {
  const { data } = await axios.get(`${API_URL}/api/cart`)
  return data
}

export async function addToCart(product) {
  const { data } = await axios.post(`${API_URL}/api/cart`, product)
  return data

}

export async function updateCartItem(id, quantity) {
  
  const { data } = await axios.put(`${API_URL}/api/cart/${id}`, { quantity } )
  return data

}

export async function createOrder(paypalTransactionId) {
  const { data } = await axios.post(`${API_URL}/api/orders`, { paypalTransactionId })
  return data
}

export async function getOrders() {
  const { data } = await axios.get(`${API_URL}/api/orders/`)
  return data
}
