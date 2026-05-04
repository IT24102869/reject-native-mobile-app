import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, BookOpen } from 'lucide-react';

const StudentDashboard = () => {
  return (
    <div style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>Welcome to Campus Hub</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>What would you like to do today?</p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Food Section */}
        <Link to="/menu" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '3rem 2rem',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(59, 130, 246, 0.1)', 
              color: 'var(--primary)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <Utensils size={40} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text)' }}>Food & Canteen</h2>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Browse menus, order meals, and track your food deliveries.</p>
          </div>
        </Link>

        {/* Library Section */}
        <Link to="/library" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '3rem 2rem',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              color: '#10b981',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <BookOpen size={40} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text)' }}>Library</h2>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Browse books, request textbooks, and check new arrivals.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
