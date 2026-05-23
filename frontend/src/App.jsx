import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Profile from './pages/Profile'

function App() {
    const [currentPage, setCurrentPage] = useState('login')
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [cartTotal, setCartTotal] = useState(0)

    const handleLoginSuccess = (newToken) => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setCurrentPage('products')
    }

    const handleRegisterSuccess = () => {
        setCurrentPage('login')
    }

    const renderPage = () => {
        if (!token) {
            if (currentPage === 'login') {
                return <Login onSuccess={handleLoginSuccess} onSwitchToRegister={() => setCurrentPage('register')} />
            } else {
                return <Register onSuccess={handleRegisterSuccess} onSwitchToLogin={() => setCurrentPage('login')} />
            }
        } else {
            if (currentPage === 'products') {
                return <Products switchToCart={() => setCurrentPage('cart')} setCartTotal={setCartTotal} />
            } else if (currentPage === 'cart') {
                return <Cart switchToProducts={() => setCurrentPage('products')} />
            } else if (currentPage === 'profile') {
                return <Profile switchToProducts={() => setCurrentPage('products')} />
            }
        }
    }

    return (
        <div className="app">
            {token && (
                <nav className="navbar">
                    <button onClick={() => setCurrentPage('products')}>Products</button>
                    <button onClick={() => setCurrentPage('cart')}>🛒 Cart ({cartTotal})</button>
                    <button onClick={() => setCurrentPage('profile')}>👤 Profile</button>
                    <button onClick={() => {
                        localStorage.removeItem('token')
                        setToken(null)
                        setCurrentPage('login')
                    }}>Logout</button>
                </nav>
            )}
            {renderPage()}
        </div>
    )
}

export default App