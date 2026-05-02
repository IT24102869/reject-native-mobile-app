import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { DollarSign, ShoppingBag, Utensils, TrendingUp } from 'lucide-react';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, pendingOrders: 0, activeFoods: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, foodsRes] = await Promise.all([
          api.get('/orders/all'),
          api.get('/foods/owner')
        ]);
        
        const orders = ordersRes.data;
        const foods = foodsRes.data;

        const totalSales = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0);
        const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;

        setStats({
          totalSales,
          totalOrders: orders.length,
          pendingOrders,
          activeFoods: foods.length
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ padding: '1rem', background: `${color}15`, color: color, borderRadius: '1rem' }}>
        <Icon size={24} />
      </div>
      <div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>{title}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{value}</p>
      </div>
    </div>
  );

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Total Sales" value={`$${stats.totalSales.toFixed(2)}`} icon={DollarSign} color="#22c55e" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="#6366f1" />
        <StatCard title="Active Orders" value={stats.pendingOrders} icon={TrendingUp} color="#f59e0b" />
        <StatCard title="Food Items" value={stats.activeFoods} icon={Utensils} color="#ec4899" />
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Recent Performance</h2>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <TrendingUp size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
          <p>Sales analytics and trends will be displayed here as your canteen grows.</p>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
