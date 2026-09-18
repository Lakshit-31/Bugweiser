import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('moolya_user');

    try {
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to parse saved user:', error);
      localStorage.removeItem('moolya_user');
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('moolya_token') || null;
  });

  // Add JWT token to all authenticated API requests
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Extract a useful error message from backend response
  const extractErrorMessage = (err, defaultMsg) => {
    console.error('Authentication error:', err);

    if (err.response) {
      const data = err.response.data;

      if (data) {
        // Backend returned a plain-text error
        if (
          typeof data === 'string' &&
          !data.trim().startsWith('<')
        ) {
          return data;
        }

        // Backend returned { message: "..." }
        if (
          data.message &&
          typeof data.message === 'string'
        ) {
          return data.message;
        }

        // Backend returned { error: "..." }
        if (
          data.error &&
          typeof data.error === 'string'
        ) {
          return data.error;
        }
      }

      // Unauthorized / forbidden
      if (
        err.response.status === 401 ||
        err.response.status === 403
      ) {
        return 'गलत क्रेडेंशियल्स या अनधिकृत अनुरोध (Unauthorized/Invalid credentials).';
      }

      // Duplicate user information
      if (err.response.status === 409) {
        return 'यह फ़ोन नंबर, ईमेल या आधार नंबर पहले से पंजीकृत है (Already registered).';
      }

      // Bad request
      if (err.response.status === 400) {
        return 'दर्ज की गई जानकारी सही नहीं है। कृपया सभी विवरण जांचें (Invalid request).';
      }

      // Server error
      if (err.response.status >= 500) {
        return 'सर्वर में समस्या है। कृपया थोड़ी देर बाद पुनः प्रयास करें (Server error).';
      }
    }

    // Network / connection error
    if (
      err.code === 'ERR_NETWORK' ||
      !err.response
    ) {
      return 'सर्वर से संपर्क नहीं हो सका। कृपया बैकएंड या इंटरनेट कनेक्शन जांचें (Unable to connect to server).';
    }

    return defaultMsg;
  };

  // =========================
  // LOGIN
  // =========================

  const login = async (username, password) => {
    try {
      const res = await api.post(
        '/api/v1/auth/login',
        {
          username,
          password,
        }
      );

      const { token, user } = res.data;

      // Validate response
      if (!token || !user) {
        console.error('Invalid login response:', res.data);

        return {
          success: false,
          message: 'सर्वर से अमान्य प्रतिक्रिया प्राप्त हुई।',
        };
      }

      // Save authentication state
      setToken(token);
      setUser(user);

      localStorage.setItem('moolya_token', token);
      localStorage.setItem(
        'moolya_user',
        JSON.stringify(user)
      );

      return {
        success: true,
        user,
      };
    } catch (err) {
      const msg = extractErrorMessage(
        err,
        'लॉगिन विफल हुआ। पासवर्ड या यूजरनेम चेक करें।'
      );

      return {
        success: false,
        message: msg,
      };
    }
  };

  // =========================
  // FARMER REGISTRATION
  // =========================

  const registerFarmer = async (formData) => {
    try {
      const res = await api.post(
        '/api/v1/auth/register-farmer',
        formData
      );

      const { token, user } = res.data;

      // Validate response
      if (!token || !user) {
        console.error(
          'Invalid farmer registration response:',
          res.data
        );

        return {
          success: false,
          message: 'सर्वर से अमान्य प्रतिक्रिया प्राप्त हुई।',
        };
      }

      // Save authentication state
      setToken(token);
      setUser(user);

      localStorage.setItem('moolya_token', token);
      localStorage.setItem(
        'moolya_user',
        JSON.stringify(user)
      );

      return {
        success: true,
        user,
      };
    } catch (err) {
      const msg = extractErrorMessage(
        err,
        'किसान पंजीकरण विफल हुआ। मोबाइल नंबर या आधार नंबर जांचें।'
      );

      return {
        success: false,
        message: msg,
      };
    }
  };

  // =========================
  // BUYER REGISTRATION
  // =========================

  const registerBuyer = async (formData) => {
    try {
      const res = await api.post(
        '/api/v1/auth/register-buyer',
        formData
      );

      const { token, user } = res.data;

      // Validate response
      if (!token || !user) {
        console.error(
          'Invalid buyer registration response:',
          res.data
        );

        return {
          success: false,
          message: 'सर्वर से अमान्य प्रतिक्रिया प्राप्त हुई।',
        };
      }

      // Save authentication state
      setToken(token);
      setUser(user);

      localStorage.setItem('moolya_token', token);
      localStorage.setItem(
        'moolya_user',
        JSON.stringify(user)
      );

      return {
        success: true,
        user,
      };
    } catch (err) {
      const msg = extractErrorMessage(
        err,
        'खरीदार पंजीकरण विफल हुआ। विवरण जांचें।'
      );

      return {
        success: false,
        message: msg,
      };
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem('moolya_token');
    localStorage.removeItem('moolya_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        registerFarmer,
        registerBuyer,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);