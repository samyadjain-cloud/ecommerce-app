import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../styles/Checkout.css';

const stripePromise = loadStripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE');

export default function Checkout({ total, switchToCart, switchToProducts }) {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm total={total} switchToCart={switchToCart} switchToProducts={switchToProducts} />
        </Elements>
    );
}

function CheckoutForm({ total, switchToCart, switchToProducts }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Step 1: Create payment intent on backend
            const intentResponse = await fetch('${import.meta.env.VITE_API_URL}/api/payment/create-intent', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: total })
            });

            if (!intentResponse.ok) {
                throw new Error('Failed to create payment intent');
            }

            const { clientSecret, orderId } = await intentResponse.json();

            // Step 2: Confirm payment with Stripe
            const cardElement = elements.getElement(CardElement);
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: { name: 'Customer' }
                }
            });

            if (stripeError) {
                setError(stripeError.message);
            } else if (paymentIntent.status === 'succeeded') {
                // Step 3: Complete payment on backend
                const completeResponse = await fetch('http://localhost:8080/api/payment/complete', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ orderId })
                });

                if (completeResponse.ok) {
                    setSuccess(true);
                    setTimeout(() => {
                        switchToProducts();
                    }, 2000);
                }
            }
        } catch (err) {
            setError('Payment failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="checkout-container">
                <div className="checkout-card success">
                    <div className="success-icon">✅</div>
                    <h2>Payment Successful!</h2>
                    <p>Your order has been placed successfully.</p>
                    <p className="amount">Total Paid: ${total.toFixed(2)}</p>
                    <p className="message">Redirecting to home...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-card">
                <h2>💳 Checkout</h2>
                <div className="order-summary">
                    <h3>Order Total: ${total.toFixed(2)}</h3>
                    <p className="info">Test card: 4242 4242 4242 4242</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card-element-container">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                    </div>

                    {error && <div className="error">{error}</div>}

                    <button
                        type="submit"
                        disabled={!stripe || loading}
                        className="pay-btn"
                    >
                        {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                    </button>
                </form>

                <button className="back-btn" onClick={switchToCart}>
                    ← Back to Cart
                </button>
            </div>
        </div>
    );
}