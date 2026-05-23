import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Profile.css'

function Profile({ switchToProducts }) {
    const [profile, setProfile] = useState(null)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({})

    useEffect(() => {
        fetchProfile()
        fetchOrders()
    }, [])

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get('http://localhost:8080/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setProfile(response.data)
            setFormData(response.data)
        } catch (err) {
            alert('Failed to load profile')
        }
    }

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get('http://localhost:8080/api/payment/orders', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setOrders(response.data)
            setLoading(false)
        } catch (err) {
            alert('Failed to load orders')
            setLoading(false)
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            await axios.put('http://localhost:8080/api/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            alert('Profile updated successfully!')
            setEditing(false)
            fetchProfile()
        } catch (err) {
            alert('Failed to update profile')
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    if (loading) return <div className="container">Loading...</div>

    return (
        <div className="container">
            <h2>My Profile</h2>

            <div className="profile-section">
                <h3>Account Information</h3>
                {editing ? (
                    <form onSubmit={handleUpdateProfile}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setEditing(false)}>Cancel</button>
                    </form>
                ) : (
                    <div className="profile-info">
                        <p><strong>Name:</strong> {profile?.name}</p>
                        <p><strong>Email:</strong> {profile?.email}</p>
                        <p><strong>Phone:</strong> {profile?.phone || 'Not set'}</p>
                        <p><strong>Address:</strong> {profile?.address || 'Not set'}</p>
                        <p><strong>City:</strong> {profile?.city || 'Not set'}</p>
                        <p><strong>State:</strong> {profile?.state || 'Not set'}</p>
                        <p><strong>Zip Code:</strong> {profile?.zipCode || 'Not set'}</p>
                        <p><strong>Country:</strong> {profile?.country || 'Not set'}</p>
                        <button onClick={() => setEditing(true)}>Edit Profile</button>
                    </div>
                )}
            </div>

            <div className="orders-section">
                <h3>Order History</h3>
                {orders.length === 0 ? (
                    <p>No orders yet</p>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <h4>Order #{order.id}</h4>
                                    <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                                </div>
                                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>

                                <div className="order-items">
                                    <h5>Items:</h5>
                                    {order.items && order.items.map((item, idx) => (
                                        <div key={idx} className="order-item">
                                            <span>{item.productName}</span>
                                            <span>Qty: {item.quantity}</span>
                                            <span>${item.subtotal.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile