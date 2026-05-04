import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Plus, Edit, Trash2, X, BookOpen } from 'lucide-react';

const LibraryAdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    title: '', author: '', category: 'Textbook', image: '', isAvailable: true, quantity: 1
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books/admin');
      setBooks(res.data);
    } catch (err) {
      showNotification('Failed to fetch books', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        category: book.category,
        image: book.image || '',
        isAvailable: book.isAvailable,
        quantity: book.quantity || 1
      });
    } else {
      setEditingBook(null);
      setFormData({ title: '', author: '', category: 'Textbook', image: '', isAvailable: true, quantity: 1 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, formData);
        showNotification('Book updated successfully', 'success');
      } else {
        await api.post('/books', formData);
        showNotification('Book added successfully', 'success');
      }
      setIsModalOpen(false);
      fetchBooks();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        showNotification('Book deleted successfully', 'success');
        fetchBooks();
      } catch (err) {
        showNotification('Failed to delete book', 'error');
      }
    }
  };

  const toggleAvailability = async (book) => {
    try {
      await api.put(`/books/${book._id}`, { ...book, isAvailable: !book.isAvailable });
      fetchBooks();
    } catch (err) {
      showNotification('Failed to update availability', 'error');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading books...</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Manage Books</h1>
          <p style={{ color: 'var(--text-muted)' }}>Add, edit, or remove books in your collection</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          <span>Add New Book</span>
        </button>
      </header>

      <div style={{ backgroundColor: 'var(--surface)', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Book</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Category</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No books added yet.</td></tr>
            ) : (
              books.map(book => (
                <tr key={book._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '56px', backgroundColor: '#e2e8f0', borderRadius: '0.25rem', overflow: 'hidden' }}>
                        {book.image ? <img src={book.image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <BookOpen size={20} style={{ margin: 'auto' }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600' }}>{book.title}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}><span className="badge" style={{ backgroundColor: '#f1f5f9' }}>{book.category}</span></td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => toggleAvailability(book)}
                      style={{ 
                        border: 'none', background: 'none', cursor: 'pointer',
                        color: book.isAvailable ? '#10b981' : '#ef4444',
                        fontWeight: '600'
                      }}
                    >
                      {book.isAvailable ? 'Available' : 'Borrowed / Unavailable'}
                    </button>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleOpenModal(book)} className="btn btn-outline" style={{ padding: '0.5rem' }}><Edit size={16} /></button>
                      <button onClick={() => handleDelete(book._id)} className="btn btn-outline" style={{ padding: '0.5rem', color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} color="var(--text-muted)" />
            </button>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" className="form-input" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Author</label>
                <input type="text" className="form-input" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="Textbook">Textbook</option>
                  <option value="New Book">New Book</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="url" className="form-input" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://example.com/image.jpg" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Quantity</label>
                  <input type="number" min="1" className="form-input" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                  <input type="checkbox" id="isAvailable" checked={formData.isAvailable} onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})} />
                  <label htmlFor="isAvailable" style={{ cursor: 'pointer' }}>Is Available</label>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {editingBook ? 'Save Changes' : 'Add Book'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryAdminBooks;
