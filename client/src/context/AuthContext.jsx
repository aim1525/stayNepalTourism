import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('staynepal_user');
    return saved ? JSON.parse(saved) : { id: 1, name: 'Aim Tourist Demo', role: 'tourist', email: 'tourist@staynepal.com' };
  });
  const [token, setToken] = useState(() => localStorage.getItem('staynepal_token') || 'demo_jwt_token_123');

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('staynepal_user', JSON.stringify(userData));
    localStorage.setItem('staynepal_token', userToken);
  };

  const loginWithApi = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data && res.data.token) {
        login(res.data.user, res.data.token);
        return { success: true, user: res.data.user };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  const registerWithApi = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      if (res.data && res.data.token) {
        login(res.data.user, res.data.token);
        return { success: true, user: res.data.user };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('staynepal_user');
    localStorage.removeItem('staynepal_token');
  };

  const switchRoleDemo = async (role) => {
    let email;
    if (role === 'admin') {
      email = 'admin@staynepal.gov.np';
    } else if (role === 'host') {
      email = 'host.karsang@staynepal.com';
    } else {
      email = 'tourist@staynepal.com';
    }
    return await loginWithApi(email, 'Password123!');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginWithApi, registerWithApi, logout, switchRoleDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

