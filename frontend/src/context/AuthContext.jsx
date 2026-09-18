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

  const extractErrorMessage = (err, defaultMsg) => {
    if (err.response) {
      const data = err.response.data;
      if (data) {
        if (typeof data === 'string' && !data.trim().startsWith('<')) {
          return data;
        }
        if (data.message && typeof data.message === 'string') {
          return data.message;
        }
        if (data.error && typeof data.error === 'string') {
          return data.error;
        }
      }
      if (err.response.status === 401 || err.response.status === 403) {
        return 'गलत क्रेडेंशियल्स या अनधिकृत अनुरोध (Unauthorized/Invalid credentials).';
      }
      if (err.response.status === 409) {
        return 'यह फ़ोन नंबर, ईमेल या आधार नंबर पहले से पंजीकृत है (Already registered).';
      }
    }
    if (err.code === 'ERR_NETWORK' || !err.response) {
      return 'सर्वर से संपर्क नहीं हो सका। कृपया इंटरनेट कनेक्शन या बैकएंड जांचें (Unable to connect to server).';
    }
    return defaultMsg;
  };

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
      const msg = extractErrorMessage(err, 'लॉगिन विफल हुआ। पासवर्ड या यूजरनेम चेक करें।');
      return { success: false, message: msg };
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
      const msg = extractErrorMessage(err, 'किसान पंजीकरण विफल हुआ। मोबाइल नंबर या आधार नंबर जांचें।');
      return { success: false, message: msg };
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
      const msg = extractErrorMessage(err, 'खरीदार पंजीकरण विफल हुआ। विवरण जांचें।');
      return { success: false, message: msg };
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
