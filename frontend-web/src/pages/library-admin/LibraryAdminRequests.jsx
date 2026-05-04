import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Check, X, Calendar, Clock, Edit } from 'lucide-react';

const LibraryAdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRequest, setEditingRequest] = useState(null);
  const [dates, setDates] = useState({ startDate: '', endDate: '' });
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/borrows/admin');
      setRequests(res.data);
    } catch (err) {
      showNotification('Failed to fetch requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/borrows/${id}`, { status });
      showNotification(`Request ${status.toLowerCase()} successfully`, 'success');
      fetchRequests();
    } catch (err) {
      showNotification('Failed to update request', 'error');
    }
  };

  const handleOpenEditDates = (req) => {
    setEditingRequest(req);
    setDates({
      startDate: req.startDate.split('T')[0],
      endDate: req.endDate.split('T')[0]
    });
  };

  const handleSaveDates = async () => {
    try {
      await api.put(`/borrows/${editingRequest._id}`, dates);
      showNotification('Dates updated successfully', 'success');
      setEditingRequest(null);
      fetchRequests();
    } catch (err) {
      showNotification('Failed to update dates', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading requests...</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Borrow Requests</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage incoming book borrow requests</p>
      </header>

      {requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Clock size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No pending requests</h3>
          <p>You don't have any incoming borrow requests at the moment.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {requests.map(req => (
            <div key={req._id} className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {req.bookId?.title || 'Unknown Book'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Student: {req.studentId?.name} ({req.studentId?.email})</p>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} />
                    <span>Start: {formatDate(req.startDate)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} />
                    <span>End: {formatDate(req.endDate)}</span>
                  </div>
                  <button 
                    onClick={() => handleOpenEditDates(req)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Edit size={14} /> Edit Dates
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ minWidth: '100px', textAlign: 'center' }}>
                  {req.status === 'Pending' ? (
                    <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>Pending</span>
                  ) : req.status === 'Approved' ? (
                    <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>Approved</span>
                  ) : (
                    <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>Rejected</span>
                  )}
                </div>

                {req.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleUpdateStatus(req._id, 'Approved')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Check size={16} /> Approve
                    </button>
                    <button onClick={() => handleUpdateStatus(req._id, 'Rejected')} className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#ef4444' }}>
                      <X size={16} /> Reject
                    </button>
                  </div>
                )}
                {req.status === 'Approved' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                     <button onClick={() => handleUpdateStatus(req._id, 'Returned')} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                       Mark Returned
                     </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dates Modal */}
      {editingRequest && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Edit Dates</h2>
            <div className="form-group">
              <label className="form-label">Borrow Start Date</label>
              <input 
                type="date" 
                className="form-input"
                value={dates.startDate}
                onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Expected Return Date</label>
              <input 
                type="date" 
                className="form-input"
                value={dates.endDate}
                onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSaveDates}>Save</button>
              <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditingRequest(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryAdminRequests;
