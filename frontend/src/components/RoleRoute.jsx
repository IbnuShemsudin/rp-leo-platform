// src/components/RoleRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RoleRoute({ allowedRoles }) {
  const { user, token } = useAuth();

  // 1. Not logged in? Go to login.
  if (!token) return <Navigate to="/login" replace />;

  // 2. Logged in but wrong role? Go to dashboard.
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Authorized? Show the requested page.
  return <Outlet />;
}