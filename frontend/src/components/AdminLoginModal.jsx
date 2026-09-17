import React, { useState } from 'react';
import { ShieldCheck, Lock, Phone, Mail, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMsg('Please enter phone/email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.post('/api/v1/auth/login', {
        username: identifier.trim(),
        password: password.trim()
      });

      const { token, user } = res.data;

      if (user?.role !== 'ROLE_ADMIN') {
        setErrorMsg('Access Denied: Not an Admin user.');
        setLoading(false);
        return;
      }

      // Store Auth Token and User Details
      localStorage.setItem('moolya_token', token);
      localStorage.setItem('moolya_user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      onLoginSuccess(user, token);
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed! Please check your admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-emerald-600">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white p-6 flex justify-between items-center border-b border-emerald-800">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1 rounded-2xl shadow-lg border border-amber-400 shrink-0">
              <img src="/moolya-logo.jpg" alt="Moolya Logo" className="h-9 w-9 object-contain rounded-xl shrink-0" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                {t('adminLoginHeader')}
              </span>
              <h3 className="text-xl font-extrabold text-white">
                {t('adminLoginTitle')}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-300 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="bg-amber-50 border border-amber-300 p-3 rounded-2xl text-xs font-bold text-amber-950 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-900 font-extrabold">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>{t('adminOnlyNotice')}</span>
            </div>
            <p className="text-[11px] text-amber-900 font-normal">
              {t('adminOnlyDesc')}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-2xl flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Identifier Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              {t('adminPhoneEmailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@moolya.com or 9999999999"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm font-semibold"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              {t('adminPasswordLabel')}
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm font-semibold"
                required
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black text-base rounded-2xl shadow-xl transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            <span>{loading ? t('adminVerifying') : t('adminLoginBtn')}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
