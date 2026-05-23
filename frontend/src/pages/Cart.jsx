import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Cart.css'

function Cart({ switchToProducts }) {
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        fetchCart()
    }, [])

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get('http://localhost:8080/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCart(response.data)
            calculateTotal(response.data)
        } catch (err) {
            alert('Failed to load cart')
        } finally {
            setLoading(false)
        }
    }

    const calculateTotal = (items) => {
        const sum = items.reduce((acc, item) => acc + (item.subtotal || 0), 0)
        setTotal(sum)
    }

    const removeFromCart = async (cartItemId) => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`http://localhost:8080/api/cart/${cartItemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchCart()
        } catch (err) {
            alert('Failed to remove item')
        }
    }

    const checkout = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post(
                'http://localhost:8080/api/payment/create-intent',
                { amount: total },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            alert(`Order created! ID: ${response.data.orderId}`)
        } catch (err) {
            alert('Checkout failed')
        }
    }

    if (loading) return <div className="container">Loading cart...</div>

    return (
        <div className="container">
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item-info">
                                <div className="cart-item-name">{item.productName}</div>
                                <div className="cart-item-price">Qty: {item.quantity} x ${item.productPrice}</div>
                            </div>
                            <div>${item.subtotal}</div>
                            <button onClick={() => removeFromCart(item.id)}>Remove</button>
                        </div>
                    ))}
                    <div className="cart-total">Total: ${total.toFixed(2)}</div>
                    <button onClick={checkout} style={{ marginTop: '20px', width: '100%', padding: '15px' }}>
                        Proceed to Checkout
                    </button>
                </>
            )}
        </div>
    )
}

export default Cart