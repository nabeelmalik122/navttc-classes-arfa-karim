import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('uc_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Verify token on mount / refresh
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('uc_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.data);
        localStorage.setItem('uc_user', JSON.stringify(data.data));
      } catch {
        // Token invalid or expired
        localStorage.removeItem('uc_token');
        localStorage.removeItem('uc_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { token, ...userData } = data.data;
    localStorage.setItem('uc_token', token);
    localStorage.setItem('uc_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    const { token, ...userData } = data.data;
    localStorage.setItem('uc_token', token);
    localStorage.setItem('uc_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('uc_token');
    localStorage.removeItem('uc_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem('uc_user', JSON.stringify(merged));
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
