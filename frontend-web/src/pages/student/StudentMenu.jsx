import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { Plus, Info } from 'lucide-react';

const StudentMenu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await api.get('/foods');
        setFoods(res.data);
      } catch (err) {
        console.error('Failed to fetch foods');
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading menu...</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Delicious Food</h1>
        <p style={{ color: 'var(--text-muted)' }}>Choose your favorite meal from our canteen</p>
      </header>

      <div className="grid-menu">
        {foods.map((food) => (
          <div key={food._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <img 
              src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'} 
              alt={food.name} 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.75rem' }}
            />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{food.name}</h3>
                <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.125rem' }}>${food.price}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{food.description}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>
                  {food.ownerId?.name || 'Canteen Owner'}
                </span>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => addToCart(food)}
              >
                <Plus size={18} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      {foods.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Info size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>No food items available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default StudentMenu;
