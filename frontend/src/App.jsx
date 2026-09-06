import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import { AuthProvider, useAuth } from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Volunteer from './pages/Volunteer';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Registry from './pages/Registry';
import EARoad from './pages/EARoad';
import InitiateMoU from './pages/InitiateMoU';
import Opportunities from './pages/Opportunities';
import Projects from './pages/Projects';
import GlobalFooter from './components/Footer';
import Settings from './pages/Settings';
import Inbox from './pages/Inbox';
import Messages from './pages/Messages';
import AuditLog from './pages/AuditLog';

/* =========================
   AUTH GUARDS
========================= */

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/* =========================
   FOOTER CONTROL
========================= */

const FooterWrapper = () => {
  const location = useLocation();

  const hiddenRoutes = [
    '/dashboard',
    '/registry',
    '/projects',
    '/initiate',
    '/settings',
    '/register',
    '/messages'
  ];

  const shouldHideFooter = hiddenRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  if (shouldHideFooter) return null;

  return <GlobalFooter />;
};

/* =========================
   APP
========================= */

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-space-portal text-slate-100 selection:bg-rp-gold selection:text-white transition-colors duration-500 relative flex flex-col">

          <div className="scanline opacity-10 pointer-events-none fixed inset-0 z-0"></div>

          <div className="flex-grow relative z-10">

            <Routes>

              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/ea-road" element={<EARoad />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />


              {/* SETTINGS - ALL AUTHENTICATED USERS */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* MESSAGES - ALL AUTHENTICATED USERS */}
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Inbox />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/messages/:mouId"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />

              {/* DASHBOARD - ADMIN + EXECUTIVE */}
              <Route
                path="/dashboard"
                element={
                  <RoleRoute allowedRoles={['admin', 'executive']}>
                    <Dashboard />
                  </RoleRoute>
                }
              />

              {/* REGISTRY - ADMIN + EXECUTIVE */}
              <Route
                path="/registry"
                element={
                  <RoleRoute allowedRoles={['admin', 'executive']}>
                    <Registry />
                  </RoleRoute>
                }
              />

              {/* PROJECTS - ADMIN + EXECUTIVE */}
              <Route
                path="/projects"
                element={
                  <RoleRoute allowedRoles={['admin', 'executive']}>
                    <Projects />
                  </RoleRoute>
                }
              />

              {/* INITIATE MOU - ADMIN + EXECUTIVE + STAFF */}
              <Route
                path="/initiate"
                element={
                  <RoleRoute
                    allowedRoles={[
                      'admin',
                      'executive',
                      'staff'
                    ]}
                  >
                    <InitiateMoU />
                  </RoleRoute>
                }
              />

              {/* REGISTER - ADMIN ONLY */}
              <Route
                path="/register"
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <Register />
                  </RoleRoute>
                }
              />

              {/* AUDIT LOG - ADMIN ONLY */}
              <Route
                path="/audit"
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AuditLog />
                  </RoleRoute>
                }
              />

              {/* FALLBACK */}
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />

            </Routes>
          </div>

          <FooterWrapper />
        </div>
      </Router>
    </AuthProvider>
  );
}
