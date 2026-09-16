import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { X, User, Lock, Phone, Mail, ShieldCheck, Building2, UserCheck, AlertCircle, Sparkles, CheckCircle, Sprout, ShoppingBag } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, registerFarmer, registerBuyer } = useAuth();
  const { t } = useLanguage();

  const [tab, setTab] = useState('login'); // 'login', 'farmer', 'buyer'
  const [buyerType, setBuyerType] = useState('INDIVIDUAL'); // 'INDIVIDUAL', 'BUSINESS'

  // Login form
  const [loginRole, setLoginRole] = useState('FARMER'); // 'FARMER', 'BUYER', 'ADMIN'
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Farmer form
  const [farmerData, setFarmerData] = useState({
    fullName: '',
    phone: '',
    password: '',
    state: 'Punjab',
    district: 'Ludhiana',
    aadhaar: ''
  });

  // Buyer form
  const [buyerData, setBuyerData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    businessName: '',
    gstId: '',
    state: 'Delhi',
    district: 'New Delhi'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = loginPhone.trim();
    const cleanPassword = loginPassword.trim();

    if (!cleanPhone || !cleanPassword) {
      setErrorMsg('कृपया मोबाइल नंबर/ईमेल और पासवर्ड दर्ज करें।');
      return;
    }

    setLoading(true);
    const res = await login(cleanPhone, cleanPassword);
    setLoading(false);

    if (res.success) {
      if (loginRole === 'ADMIN' && res.user?.role !== 'ROLE_ADMIN') {
        setErrorMsg('अस्वीकृत: यह खाता एडमिन रोल के रूप में पंजीकृत नहीं है। (Access Denied: Not an Admin user)');
        return;
      }
      onClose();
    } else {
      setErrorMsg(res.message || 'गलत विवरण! (Bad Credentials)');
    }
  };

  const handleFarmerSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Client-side Validation Checks
    if (!farmerData.fullName.trim()) {
      setErrorMsg('कृपया पूरा नाम भरें (Full Name required)');
      return;
    }
    if (!/^[0-9]{10}$/.test(farmerData.phone.trim())) {
      setErrorMsg('मोबाइल नंबर strictly 10 अंकों का होना चाहिए (e.g. 9812345678)।');
      return;
    }
    if (!/^[0-9]{12}$/.test(farmerData.aadhaar.trim())) {
      setErrorMsg('आधार नंबर (Aadhaar Number) strictly 12 अंकों का होना चाहिए (e.g. 123456789012)।');
      return;
    }
    if (farmerData.password.length < 6) {
      setErrorMsg('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }

    setLoading(true);
    const res = await registerFarmer({
      fullName: farmerData.fullName.trim(),
      phone: farmerData.phone.trim(),
      password: farmerData.password,
      state: farmerData.state.trim() || 'Punjab',
      district: farmerData.district.trim() || 'Ludhiana',
      aadhaar: farmerData.aadhaar.trim(),
      preferredLanguage: 'hi'
    });
    setLoading(false);

    if (res.success) {
      setSuccessMsg('किसान पंजीकरण सफल हुआ! किसान डैशबोर्ड में प्रवेश कर रहे हैं...');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleBuyerSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!/^[0-9]{10}$/.test(buyerData.phone.trim())) {
      setErrorMsg('Phone number must be 10 digits.');
      return;
    }
    if (buyerData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const res = await registerBuyer({
      fullName: buyerData.fullName.trim(),
      phone: buyerData.phone.trim(),
      email: buyerData.email.trim(),
      password: buyerData.password,
      buyerType,
      businessName: buyerData.businessName,
      gstId: buyerData.gstId,
      state: buyerData.state,
      district: buyerData.district
    });
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Buyer Registration Successful!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-5 flex justify-between items-center flex-shrink-0 border-b border-emerald-900">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1 rounded-2xl shadow border border-amber-400/60">
              <img src="/moolya-logo.jpg" alt="Moolya Logo" className="h-8 w-auto object-contain rounded-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-300">
                मूल्य (Moolya) ऑथेंटिकेशन
              </h2>
              <p className="text-xs text-emerald-200">
                किसान एवं खरीदार सुरक्षा पोर्टल
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-xs font-bold transition ${
              tab === 'login' ? 'border-b-2 border-emerald-800 text-emerald-900 bg-white' : 'text-slate-500'
            }`}
          >
            लॉगिन (Login)
          </button>
          <button
            onClick={() => { setTab('farmer'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-xs font-bold transition ${
              tab === 'farmer' ? 'border-b-2 border-emerald-800 text-emerald-900 bg-white' : 'text-slate-500'
            }`}
          >
            किसान रजिस्ट्रेशन
          </button>
          <button
            onClick={() => { setTab('buyer'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-xs font-bold transition ${
              tab === 'buyer' ? 'border-b-2 border-emerald-800 text-emerald-900 bg-white' : 'text-slate-500'
            }`}
          >
            खरीदार रजिस्ट्रेशन
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center space-x-2 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Role Selection Option */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  लॉगिन रोल चुनें (Select Login Role):
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => { setLoginRole('FARMER'); setErrorMsg(''); }}
                    className={`py-2 px-1.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-1 ${
                      loginRole === 'FARMER' ? 'bg-emerald-800 text-amber-300 shadow' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sprout className="w-3.5 h-3.5" />
                    <span>किसान</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginRole('BUYER'); setErrorMsg(''); }}
                    className={`py-2 px-1.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-1 ${
                      loginRole === 'BUYER' ? 'bg-emerald-800 text-amber-300 shadow' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>खरीदार</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('ADMIN');
                      setErrorMsg('');
                    }}
                    className={`py-2 px-1.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-1 ${
                      loginRole === 'ADMIN' ? 'bg-amber-400 text-emerald-950 shadow' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>एडमिन</span>
                  </button>
                </div>
              </div>

              {loginRole === 'ADMIN' && (
                <div className="bg-amber-50 border border-amber-300 p-3 rounded-2xl text-xs font-semibold text-amber-950 space-y-1">
                  <div className="flex items-center space-x-1.5 font-black text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    <span>सुरक्षित एडमिन लॉगिन (Admin Direct Login)</span>
                  </div>
                  <p className="text-[11px] text-slate-700">
                    सार्वजनिक पंजीकरण की आवश्यकता नहीं है। अपने सुरक्षित एडमिन विवरण से सीधे प्रवेश करें।
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {loginRole === 'ADMIN' ? 'एडमिन फोन / ई-मेल (Phone or Email):' : 'मोबाइल नंबर (Phone Number):'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder={loginRole === 'ADMIN' ? 'admin@moolya.com or 9999999999' : '9876543210'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  पासवर्ड (Password):
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 ${loginRole === 'ADMIN' ? 'bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black' : 'bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold'} rounded-xl text-sm transition shadow`}
              >
                {loading ? 'प्रोसेसिंग...' : loginRole === 'ADMIN' ? 'एडमिन पोर्टल में प्रवेश करें (Login as Admin)' : 'लॉगिन करें (Login)'}
              </button>
            </form>
          )}

          {/* FARMER REGISTRATION FORM */}
          {tab === 'farmer' && (
            <form onSubmit={handleFarmerSubmit} className="space-y-3">

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">पूरा नाम (Full Name):</label>
                <input
                  type="text"
                  required
                  value={farmerData.fullName}
                  onChange={(e) => setFarmerData({ ...farmerData, fullName: e.target.value })}
                  placeholder="Gurpreet Singh"
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">मोबाइल नंबर (10 Digit Phone):</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={farmerData.phone}
                  onChange={(e) => setFarmerData({ ...farmerData, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 rounded-xl border text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">राज्य (State):</label>
                  <input
                    type="text"
                    required
                    value={farmerData.state}
                    onChange={(e) => setFarmerData({ ...farmerData, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ज़िला (District):</label>
                  <input
                    type="text"
                    required
                    value={farmerData.district}
                    onChange={(e) => setFarmerData({ ...farmerData, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>12-अंकीय आधार नंबर (12-Digit Aadhaar):</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={12}
                  value={farmerData.aadhaar}
                  onChange={(e) => setFarmerData({ ...farmerData, aadhaar: e.target.value })}
                  placeholder="123456789012"
                  className="w-full px-3 py-2 rounded-xl border text-sm font-mono tracking-widest font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">पासवर्ड (Password):</label>
                <input
                  type="password"
                  required
                  value={farmerData.password}
                  onChange={(e) => setFarmerData({ ...farmerData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl text-sm transition shadow mt-2"
              >
                {loading ? 'प्रोसेसिंग...' : 'किसान खाता बनाएँ (Register Farmer)'}
              </button>
            </form>
          )}

          {/* BUYER REGISTRATION FORM */}
          {tab === 'buyer' && (
            <form onSubmit={handleBuyerSubmit} className="space-y-3">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Type:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBuyerType('INDIVIDUAL')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      buyerType === 'INDIVIDUAL' ? 'bg-emerald-800 text-amber-300 border-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Individual / Self
                  </button>
                  <button
                    type="button"
                    onClick={() => setBuyerType('BUSINESS')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      buyerType === 'BUSINESS' ? 'bg-emerald-800 text-amber-300 border-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Business / Enterprise
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  value={buyerData.fullName}
                  onChange={(e) => setBuyerData({ ...buyerData, fullName: e.target.value })}
                  placeholder="Priya Sharma"
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number:</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={buyerData.phone}
                    onChange={(e) => setBuyerData({ ...buyerData, phone: e.target.value })}
                    placeholder="9123456789"
                    className="w-full px-3 py-2 rounded-xl border text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email:</label>
                  <input
                    type="email"
                    required
                    value={buyerData.email}
                    onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
                    placeholder="buyer@corp.com"
                    className="w-full px-3 py-2 rounded-xl border text-sm"
                  />
                </div>
              </div>

              {buyerType === 'BUSINESS' && (
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name:</label>
                    <input
                      type="text"
                      value={buyerData.businessName}
                      onChange={(e) => setBuyerData({ ...buyerData, businessName: e.target.value })}
                      placeholder="AgroCorp Ltd"
                      className="w-full px-3 py-1.5 rounded border text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">GST / Tax ID:</label>
                    <input
                      type="text"
                      value={buyerData.gstId}
                      onChange={(e) => setBuyerData({ ...buyerData, gstId: e.target.value })}
                      placeholder="07AAAAA0000A1Z5"
                      className="w-full px-3 py-1.5 rounded border text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password:</label>
                <input
                  type="password"
                  required
                  value={buyerData.password}
                  onChange={(e) => setBuyerData({ ...buyerData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl text-sm transition shadow mt-2"
              >
                {loading ? 'Processing...' : 'Register Buyer Account'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
