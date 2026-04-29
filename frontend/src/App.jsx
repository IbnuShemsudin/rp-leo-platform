import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Page Imports...
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Volunteer from './pages/Volunteer';
import Register from './pages/Register';
import Registry from './pages/Registry';
import EARoad from './pages/EARoad';
import InitiateMoU from './pages/InitiateMoU'; 
import Opportunities from './pages/Opportunities';
import Projects from './pages/Projects';
import GlobalFooter from './components/Footer';
import Settings from './pages/Settings';

// 1. Generic Protection: Just checks if logged in
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// 2. Role-Based Protection: Checks specific clearance
const RoleRoute = ({ children, allowedRoles }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  
  // If role isn't allowed, send them to /settings (safe zone) instead of dashboard
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/settings" replace />;
  }
  return children;
};

const FooterWrapper = () => {
  const location = useLocation();
  const hiddenRoutes = ['/dashboard', '/initiate', '/registry', '/projects', '/settings', '/register'];
  if (hiddenRoutes.includes(location.pathname)) return null;
  return <GlobalFooter />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-space-portal text-slate-100 selection:bg-rp-gold selection:text-white transition-colors duration-500 relative flex flex-col">
          <div className="scanline opacity-10 pointer-events-none fixed inset-0 z-0"></div>

          <div className="flex-grow relative z-10">
            <Routes>
              {/* --- Public Access --- */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/ea-road" element={<EARoad />} />
              <Route path="Register" element={<Register />} />
              {/* <Route path="/initiate" element={<InitiateMoU />} /> */}

              {/* --- Executive & Admin Territory --- */}
              {/* Staff are now strictly blocked from these */}
              <Route path="/dashboard" element={
                <RoleRoute allowedRoles={['admin', 'executive']}>
                  <Dashboard />
                </RoleRoute>
              } />
              
              <Route path="/registry" element={
                <RoleRoute allowedRoles={['admin', 'executive']}>
                  <Registry />
                </RoleRoute>
              } />

              <Route path="/projects" element={
                <RoleRoute allowedRoles={['admin', 'executive']}>
                  <Projects />
                </RoleRoute>
              } />

              <Route path="/initiate" element={
                <RoleRoute allowedRoles={['admin', 'executive']}>
                  <InitiateMoU />
                </RoleRoute>
              } />

              {/* --- Super User Only: Register new nodes --- */}
              <Route path="/register" element={
                <RoleRoute allowedRoles={['admin']}>
                  <Register />
                </RoleRoute>
              } />

              {/* --- Universal Protected (Staff included) --- */}
              <Route path="/settings" element={
                <ProtectedRoute>
                  <InitiateMoU />
                  <Settings />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          <FooterWrapper />
        </div>
      </Router>
    </AuthProvider>
  );
}