import { useState, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('ssgi_user')));
  const [token, setToken] = useState(() => localStorage.getItem('ssgi_token'));

  const login = (userData, tokenData) => {
    localStorage.setItem('ssgi_token', tokenData);
    localStorage.setItem('ssgi_user', JSON.stringify(userData));
    setToken(tokenData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ssgi_token');
    localStorage.removeItem('ssgi_user');
    setUser(null);
    setToken(null);
  };

  // Helper to check permissions globally
  const isExecutive = user?.role === 'executive' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isExecutive }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};