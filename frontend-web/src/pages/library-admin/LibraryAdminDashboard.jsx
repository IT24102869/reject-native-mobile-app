import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BookOpen, Users, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const LibraryAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    activeRequests: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [booksRes, requestsRes] = await Promise.all([
          api.get('/books/admin'),
          api.get('/borrows/admin')
        ]);

        const books = booksRes.data;
        const requests = requestsRes.data;

        setStats({
          totalBooks: books.length,
          availableBooks: books.filter(b => b.isAvailable).length,
          borrowedBooks: books.filter(b => !b.isAvailable).length,
          activeRequests: requests.filter(r => r.status === 'Approved').length,
          pendingRequests: requests.filter(r => r.status === 'Pending').length
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Library Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Overview of your books and requests</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', color: '#3b82f6' }}>
            <BookOpen size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Books</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.totalBooks}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', color: '#10b981' }}>
            <CheckCircle size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Available / Borrowed</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.availableBooks} / {stats.borrowedBooks}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem', color: '#f59e0b' }}>
            <Clock size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Pending Requests</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.pendingRequests}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: '0.5rem', color: '#8b5cf6' }}>
            <Users size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Borrows</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.activeRequests}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/library-admin/books" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Manage Books</Link>
            <Link to="/library-admin/requests" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>View Requests</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryAdminDashboard;
