import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Import your components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Volunteer from './pages/Volunteer';
import Register from './pages/Register';
import Registry from './pages/Registry';

// 1. Generic Protection (Must be logged in)
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// 2. Role-Based Protection (Must have specific role)
const RoleRoute = ({ children, allowedRoles }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white selection:bg-rp-blue selection:text-white">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/volunteer" element={<Volunteer />} />

            {/* Dashboard: Accessible by all Staff, Executives, and Admins */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <>
                    {/* <Navbar />  */}
                    <Dashboard />
                  </>
                </ProtectedRoute>
              } 
            />

            {/* Register: STRICTLY Admin only */}
            <Route 
              path="/register" 
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <Register />
                </RoleRoute>
              } 
            />

                    <Route 
          path="/registry" 
          element={
            <ProtectedRoute>
              <>
                {/* <Navbar /> */}
                <Registry />
              </>
         </ProtectedRoute>
       } 
     />

            {/* Redirect any unknown routes to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}