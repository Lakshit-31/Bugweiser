import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('moolya_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('moolya_token') || null;
  });

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await axios.post('/api/v1/auth/login', { username, password });
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('moolya_token', token);
      localStorage.setItem('moolya_user', JSON.stringify(user));
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'लॉगिन विफल हुआ। पासवर्ड या यूजरनेम चेक करें।';
      return { success: false, message: typeof msg === 'string' ? msg : JSON.stringify(msg) };
    }
  };

  const registerFarmer = async (formData) => {
    try {
      const res = await axios.post('/api/v1/auth/register-farmer', formData);
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('moolya_token', token);
      localStorage.setItem('moolya_user', JSON.stringify(user));
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'किसान पंजीकरण विफल हुआ। मोबाइल नंबर या आधार नंबर जांचें।';
      return { success: false, message: typeof msg === 'string' ? msg : JSON.stringify(msg) };
    }
  };

  const registerBuyer = async (formData) => {
    try {
      const res = await axios.post('/api/v1/auth/register-buyer', formData);
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('moolya_token', token);
      localStorage.setItem('moolya_user', JSON.stringify(user));
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'खरीदार पंजीकरण विफल हुआ। विवरण जांचें।';
      return { success: false, message: typeof msg === 'string' ? msg : JSON.stringify(msg) };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('moolya_token');
    localStorage.removeItem('moolya_user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, registerFarmer, registerBuyer, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
