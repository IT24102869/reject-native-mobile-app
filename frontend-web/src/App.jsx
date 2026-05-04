import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';

// Pages (to be created)
import Login from './pages/Login';
import Register from './pages/Register';
import StudentMenu from './pages/student/StudentMenu';
import StudentCart from './pages/student/StudentCart';
import StudentOrders from './pages/student/StudentOrders';
import StudentDashboard from './pages/student/StudentDashboard';
import LibraryHome from './pages/student/LibraryHome';
import LibraryRequests from './pages/student/LibraryRequests';

import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerFood from './pages/owner/OwnerFood';
import OwnerOrders from './pages/owner/OwnerOrders';

import LibraryAdminDashboard from './pages/library-admin/LibraryAdminDashboard';
import LibraryAdminBooks from './pages/library-admin/LibraryAdminBooks';
import LibraryAdminRequests from './pages/library-admin/LibraryAdminRequests';

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
              user.role === 'owner' ? <Navigate to="/owner/dashboard" /> :
              user.role === 'library_admin' ? <Navigate to="/library-admin/dashboard" /> :
              <Navigate to="/dashboard" />
            ) : <Navigate to="/login" />
          } />

          {/* Student Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />
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
          <Route path="/library" element={
            <ProtectedRoute role="student">
              <LibraryHome />
            </ProtectedRoute>
          } />
          <Route path="/library/requests" element={
            <ProtectedRoute role="student">
              <LibraryRequests />
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

          {/* Library Admin Routes */}
          <Route path="/library-admin/dashboard" element={
            <ProtectedRoute role="library_admin">
              <LibraryAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/library-admin/books" element={
            <ProtectedRoute role="library_admin">
              <LibraryAdminBooks />
            </ProtectedRoute>
          } />
          <Route path="/library-admin/requests" element={
            <ProtectedRoute role="library_admin">
              <LibraryAdminRequests />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </Router>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
