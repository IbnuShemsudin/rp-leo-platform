import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Import your components
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Volunteer from './pages/Volunteer';
import Register from './pages/Register';
import Registry from './pages/Registry';
import EARoad from './pages/EARoad';
import InitiateMoU from './pages/InitiateMoU'; 
import Opportunities from './pages/Opportunities';
import GlobalFooter from './components/Footer'; // Import the footer
import Settings from './pages/Settings';

// 1. Generic Protection
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// 2. Role-Based Protection
const RoleRoute = ({ children, allowedRoles }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

// 3. Footer Wrapper Component
// This hides the footer on specific high-intensity app pages
const FooterWrapper = () => {
  const location = useLocation();
  const hiddenRoutes = ['/dashboard', '/initiate', '/registry'];
  
  if (hiddenRoutes.includes(location.pathname)) return null;
  return <GlobalFooter />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Global Dark Theme Wrapper */}
        <div className="min-h-screen bg-space-portal text-slate-100 selection:bg-rp-gold selection:text-white transition-colors duration-500 relative flex flex-col">
          
          {/* Subtle Global Scanline */}
          <div className="scanline opacity-10 pointer-events-none fixed inset-0 z-0"></div>

          {/* Main Content Area */}
          <div className="flex-grow relative z-10">
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/ea-road" element={<EARoad />} />

              {/* --- Protected Staff Routes --- */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/registry" element={
                <ProtectedRoute>
                  <Registry />
                </ProtectedRoute>
              } />

              <Route path="/initiate" element={
                <ProtectedRoute>
                  <InitiateMoU />
                </ProtectedRoute>
              } />

              {/* --- Admin Only Routes --- */}
              <Route path="/register" element={
                <RoleRoute allowedRoles={['admin']}>
                  <Register />
                </RoleRoute>
              } />

              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          {/* Global Footer stays at the bottom of the stack */}
          <FooterWrapper />
        </div>
      </Router>
    </AuthProvider>
  );
}