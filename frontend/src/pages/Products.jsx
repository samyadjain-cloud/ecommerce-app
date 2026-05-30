import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Products.css'

function Products({ switchToCart, setCartTotal }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
            setProducts(response.data)
        } catch (err) {
            setError('Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem('token')
            await axios.post(
                'http://localhost:8080/api/cart/add',
                { productId, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            alert('Added to cart!')
            setCartTotal(prev => prev + 1)
        } catch (err) {
            alert('Failed to add to cart')
        }
    }

    if (loading) return <div className="container">Loading products...</div>
    if (error) return <div className="container error">{error}</div>

    return (
        <div className="container">
            <h2>Products</h2>
            <div className="products-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                        <div className="product-info">
                            <div className="product-name">{product.name}</div>
                            <div className="product-price">${product.price}</div>
                            <button onClick={() => addToCart(product.id)}>Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Products