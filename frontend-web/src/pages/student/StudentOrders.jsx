import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Package, Clock, User } from 'lucide-react';

const StudentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/myorders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const classes = `badge badge-${status}`;
    return <span className={classes}>{status}</span>;
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your orders...</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Order History</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map((order) => (
          <div key={order._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order ID</p>
                  <p style={{ fontWeight: '600' }}>#{order._id.slice(-6)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</p>
                  {getStatusBadge(order.status)}
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Canteen</p>
                  <p style={{ fontWeight: '500' }}>{order.ownerId?.name || 'Unknown'}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</p>
                <p style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--primary)' }}>Rs. {order.totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Items</h4>
                <ul style={{ listStyle: 'none' }}>
                  {order.items.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                      <span>{item.food?.name} x{item.quantity}</span>
                      <span style={{ color: 'var(--text-muted)' }}>Rs. {(item.food?.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                  <Clock size={18} />
                  <span>Pickup: {order.pickupTime}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                  <Package size={18} />
                  <span>Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
            <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentOrders;
