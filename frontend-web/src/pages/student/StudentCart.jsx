import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { Trash2, Clock, CheckCircle, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentCart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { showNotification } = useNotification();
  const [pickupTime, setPickupTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!pickupTime) {
      alert('Please select a pickup time');
      return;
    }
    setLoading(true);
    try {
      // Group items by ownerId
      const ordersByOwner = cart.reduce((acc, item) => {
        const ownerId = item.ownerId?._id || item.ownerId;
        if (!ownerId) {
          console.warn(`Item ${item.name} is missing an ownerId and will be skipped.`);
          return acc;
        }
        if (!acc[ownerId]) acc[ownerId] = [];
        acc[ownerId].push(item);
        return acc;
      }, {});

      // Create an order for each owner
      const promises = Object.entries(ordersByOwner).map(([ownerId, items]) => {
        const orderTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return api.post('/orders', {
          items: items.map(i => ({ food: i._id, quantity: i.quantity })),
          totalAmount: orderTotal,
          pickupTime,
          ownerId
        });
      });

      await Promise.all(promises);
      clearCart();
      setSuccess(true);
      showNotification('Order placed successfully!', 'success');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      console.error('Checkout failed', err);
      showNotification('Checkout failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '1rem' }} />
        <h2>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Redirecting to your orders...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Go back to the menu and add some delicious items!</p>
        <button onClick={() => navigate('/menu')} className="btn btn-primary">Browse Menu</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Your Shopping Cart</h1>
      
      <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.map((item) => (
            <div key={item._id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img 
                src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'} 
                alt={item.name} 
                style={{ width: '80px', height: '80px', borderRadius: '0.5rem', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem' }}>{item.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button 
                    onClick={() => updateQuantity(item._id, -1)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontWeight: '600' }}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, 1)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: '600' }}>Rs. {(item.price * item.quantity).toFixed(2)}</p>
                <button 
                  onClick={() => removeFromCart(item._id)} 
                  style={{ color: 'var(--danger)', background: 'none', border: 'none', marginTop: '0.5rem' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="card" style={{ position: 'sticky', top: '6rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Total Amount</span>
              <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>Rs. {total.toFixed(2)}</span>
            </div>
            
            <div className="form-group">
              <label className="form-label">Pickup Time</label>
              <div style={{ position: 'relative' }}>
                <Clock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="time" 
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem' }}
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCart;
