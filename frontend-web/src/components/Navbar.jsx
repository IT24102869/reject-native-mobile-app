import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Utensils, LayoutDashboard, LogOut, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <Utensils size={24} />
          <span>CanteenHub</span>
        </Link>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {user ? (
            <>
              {user.role === 'student' && (
                <>
                  <Link to="/dashboard" className="btn btn-outline" style={{ border: 'none' }}>
                    <LayoutDashboard size={20} />
                  </Link>
                  <Link to="/menu" className="btn btn-outline" style={{ border: 'none' }}>Menu</Link>
                  <Link to="/orders" className="btn btn-outline" style={{ border: 'none' }}>
                    <ClipboardList size={20} />
                  </Link>
                  <Link to="/cart" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                    <ShoppingCart size={20} />
                  </Link>
                </>
              )}
              {user.role === 'owner' && (
                <>
                  <Link to="/owner/dashboard" className="btn btn-outline" style={{ border: 'none' }}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/owner/food" className="btn btn-outline" style={{ border: 'none' }}>Food</Link>
                  <Link to="/owner/orders" className="btn btn-outline" style={{ border: 'none' }}>Orders</Link>
                </>
              )}
              {user.role === 'library_admin' && (
                <>
                  <Link to="/library-admin/dashboard" className="btn btn-outline" style={{ border: 'none' }}>
                    <LayoutDashboard size={20} />
                    <span>Library</span>
                  </Link>
                  <Link to="/library-admin/books" className="btn btn-outline" style={{ border: 'none' }}>Books</Link>
                  <Link to="/library-admin/requests" className="btn btn-outline" style={{ border: 'none' }}>Requests</Link>
                </>
              )}
              <button onClick={handleLogout} className="btn btn-outline" style={{ color: 'var(--danger)', border: 'none' }}>
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
