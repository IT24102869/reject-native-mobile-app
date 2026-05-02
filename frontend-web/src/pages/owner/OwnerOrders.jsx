import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Clock, User, Phone, Mail, CheckCircle, Package, Send } from 'lucide-react';

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/all');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      showNotification(`Order status updated to ${status}`, 'success');
      fetchOrders();
    } catch (err) {
      showNotification('Status update failed', 'error');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading orders...</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Manage Orders</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map((order) => (
          <div key={order._id} className="card" style={{ borderLeft: `6px solid ${order.status === 'pending' ? '#f59e0b' : order.status === 'preparing' ? '#6366f1' : '#22c55e'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>Order #{order._id.slice(-6)}</h3>
                  <span className={`badge badge-${order.status}`}>{order.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} />
                    <span>{order.student?.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={16} />
                    <span>{order.student?.email}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pickup Time</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', fontWeight: '600', color: 'var(--accent)' }}>
                  <Clock size={18} />
                  <span>{order.pickupTime}</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Order Items</h4>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                  <span>{item.food?.name} x{item.quantity}</span>
                  <span style={{ fontWeight: '500' }}>${(item.food?.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {order.status === 'pending' && (
                <button onClick={() => updateStatus(order._id, 'preparing')} className="btn btn-primary" style={{ background: '#6366f1' }}>
                  <Package size={18} />
                  <span>Start Preparing</span>
                </button>
              )}
              {order.status === 'preparing' && (
                <button onClick={() => updateStatus(order._id, 'ready')} className="btn btn-primary" style={{ background: '#22c55e' }}>
                  <Send size={18} />
                  <span>Mark as Ready</span>
                </button>
              )}
              {order.status === 'ready' && (
                <button onClick={() => updateStatus(order._id, 'completed')} className="btn btn-outline" style={{ borderColor: '#22c55e', color: '#22c55e' }}>
                  <CheckCircle size={18} />
                  <span>Complete Order</span>
                </button>
              )}
              <button onClick={() => updateStatus(order._id, 'cancelled')} className="btn btn-outline" style={{ color: 'var(--danger)', marginLeft: 'auto' }}>
                Cancel
              </button>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <p>No orders assigned to you yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerOrders;
