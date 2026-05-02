import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const OwnerFood = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image: '', available: true });

  const fetchFoods = async () => {
    try {
      const res = await api.get('/foods/owner');
      setFoods(res.data);
    } catch (err) {
      console.error('Failed to fetch foods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        await api.put(`/foods/${editingFood._id}`, formData);
        showNotification('Food item updated successfully!', 'success');
      } else {
        await api.post('/foods', formData);
        showNotification('New food item added!', 'success');
      }
      fetchFoods();
      setShowModal(false);
      setEditingFood(null);
      setFormData({ name: '', description: '', price: '', image: '', available: true });
    } catch (err) {
      showNotification('Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/foods/${id}`);
      showNotification('Food item deleted', 'info');
      fetchFoods();
    } catch (err) {
      showNotification('Delete failed', 'error');
    }
  };

  const openEdit = (food) => {
    setEditingFood(food);
    setFormData({ name: food.name, description: food.description, price: food.price, image: food.image, available: food.available });
    setShowModal(true);
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading menu...</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Manage Food Menu</h1>
        <button className="btn btn-primary" onClick={() => { setEditingFood(null); setFormData({ name: '', description: '', price: '', image: '', available: true }); setShowModal(true); }}>
          <Plus size={20} />
          <span>Add New Item</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {foods.map((food) => (
          <div key={food._id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <img 
              src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'} 
              alt={food.name} 
              style={{ width: '80px', height: '80px', borderRadius: '0.5rem', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.125rem' }}>{food.name}</h3>
              <p style={{ fontWeight: '600', color: 'var(--primary)' }}>Rs. {food.price}</p>
              <span className={`badge ${food.available ? 'badge-ready' : 'badge-completed'}`} style={{ fontSize: '0.65rem' }}>
                {food.available ? 'Available' : 'Sold Out'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => openEdit(food)} style={{ color: 'var(--secondary)', background: 'none', border: 'none' }}>
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(food._id)} style={{ color: 'var(--danger)', background: 'none', border: 'none' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingFood ? 'Edit Food Item' : 'Add Food Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Price (Rs.)</label>
                <input type="number" step="0.01" className="form-input" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="text" className="form-input" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="available" checked={formData.available} onChange={(e) => setFormData({...formData, available: e.target.checked})} />
                <label htmlFor="available" className="form-label" style={{ marginBottom: 0 }}>Available for Order</label>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                {editingFood ? 'Update Item' : 'Add Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerFood;
