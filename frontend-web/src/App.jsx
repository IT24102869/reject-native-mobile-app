import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';

// Pages (to be created)
import Login from './pages/Login';
import Register from './pages/Register';
import StudentMenu from './pages/student/StudentMenu';
import StudentCart from './pages/student/StudentCart';
import StudentOrders from './pages/student/StudentOrders';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerFood from './pages/owner/OwnerFood';
import OwnerOrders from './pages/owner/OwnerOrders';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          {/* Default Route */}
          <Route path="/" element={
            user ? (
              user.role === 'owner' ? <Navigate to="/owner/dashboard" /> : <Navigate to="/menu" />
            ) : <Navigate to="/login" />
          } />

          {/* Student Routes */}
          <Route path="/menu" element={
            <ProtectedRoute role="student">
              <StudentMenu />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute role="student">
              <StudentCart />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute role="student">
              <StudentOrders />
            </ProtectedRoute>
          } />

          {/* Owner Routes */}
          <Route path="/owner/dashboard" element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/owner/food" element={
            <ProtectedRoute role="owner">
              <OwnerFood />
            </ProtectedRoute>
          } />
          <Route path="/owner/orders" element={
            <ProtectedRoute role="owner">
              <OwnerOrders />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
