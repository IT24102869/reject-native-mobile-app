import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { BookOpen, Search, Calendar, X, Clock } from 'lucide-react';

const LibraryHome = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books');
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      showNotification('Failed to fetch books', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      return showNotification('Please select start and end dates', 'error');
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      return showNotification('End date must be after start date', 'error');
    }

    try {
      await api.post('/borrows', {
        bookId: selectedBook._id,
        startDate,
        endDate
      });
      showNotification('Borrow request submitted successfully', 'success');
      setSelectedBook(null);
      setStartDate('');
      setEndDate('');
      fetchBooks(); // Refresh to potentially show availability changes if needed
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || 'Failed to submit request', 'error');
    }
  };

  const filteredBooks = books.filter(book => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Textbooks') return book.category === 'Textbook';
    if (activeTab === 'New Arrivals') return book.category === 'New Book';
    return true;
  });

  return (
    <div style={{ padding: '2rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Campus Library</h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse and borrow books for your studies</p>
        </div>
        <Link to="/library/requests" className="btn btn-outline">
          <Clock size={18} />
          <span>My Activity</span>
        </Link>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
        {['All', 'Textbooks', 'New Arrivals'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === tab ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading books...</div>
      ) : (
        <div className="grid-menu">
          {filteredBooks.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              No books found in this category.
            </div>
          ) : (
            filteredBooks.map(book => (
              <div key={book._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ height: '240px', overflow: 'hidden', borderRadius: '0.5rem', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {book.image ? (
                    <img src={book.image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <BookOpen size={64} style={{ color: '#cbd5e1' }} />
                  )}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>{book.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>By {book.author}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', marginBottom: '1rem' }}>
                    <span className="badge" style={{ backgroundColor: '#f8fafc', color: '#64748b' }}>{book.category}</span>
                    {book.isAvailable ? (
                      <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>✅ Available</span>
                    ) : (
                      <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>❌ Not Available</span>
                    )}
                  </div>

                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', opacity: book.isAvailable ? 1 : 0.5 }}
                    disabled={!book.isAvailable}
                    onClick={() => setSelectedBook(book)}
                  >
                    Request to Borrow
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Borrow Request Modal */}
      {selectedBook && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button 
              onClick={() => setSelectedBook(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '1.5rem' }}>Request Book</h2>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div style={{ width: '60px', height: '80px', backgroundColor: '#e2e8f0', borderRadius: '0.25rem', overflow: 'hidden' }}>
                {selectedBook.image && <img src={selectedBook.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div>
                <h4 style={{ fontWeight: '600' }}>{selectedBook.title}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{selectedBook.author}</p>
              </div>
            </div>

            <form onSubmit={handleRequestSubmit}>
              <div className="form-group">
                <label className="form-label">Borrow Start Date</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
                  <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Expected Return Date</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
                  <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryHome;
