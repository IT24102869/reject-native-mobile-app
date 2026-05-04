import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Clock, Calendar, BookOpen } from 'lucide-react';

const LibraryRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/borrows/student');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      showNotification('Failed to fetch requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved':
        return <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>Approved</span>;
      case 'Rejected':
        return <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>Rejected</span>;
      default:
        return <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>Pending</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading your requests...</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>My Library Activity</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track your borrow requests and history</p>
      </header>

      {requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No activity yet</h3>
          <p>You haven't made any book requests. Visit the library to find books to read.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {requests.map(req => (
            <div key={req._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, minWidth: '250px' }}>
                <div style={{ width: '50px', height: '70px', backgroundColor: '#f1f5f9', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                   {req.bookId?.image ? (
                     <img src={req.bookId.image} alt={req.bookId.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   ) : (
                     <BookOpen size={24} style={{ color: '#cbd5e1' }} />
                   )}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{req.bookId?.title || 'Unknown Book'}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>By {req.bookId?.author || 'Unknown'}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Library Admin: {req.adminId?.name || 'N/A'}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <Calendar size={14} />
                    <span>From: {formatDate(req.startDate)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <Clock size={14} />
                    <span>To: {formatDate(req.endDate)}</span>
                  </div>
                </div>
                
                <div style={{ minWidth: '100px', textAlign: 'right' }}>
                  {getStatusBadge(req.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryRequests;
