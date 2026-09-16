import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, LayoutDashboard, Users, AlertTriangle, Package, AlertCircle, 
  MessageSquare, Mail, Receipt, History, LogOut, Search, Filter, CheckCircle2, 
  XCircle, Eye, UserX, UserCheck, RefreshCw, Star, Clock, MapPin, Send, ChevronRight
} from 'lucide-react';
import { useWebSocket } from '../context/WebSocketContext';
import axios from 'axios';

export const AdminLayout = ({ adminUser, onLogout }) => {
  const { refreshKey } = useWebSocket();
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, users, suspicious, orders, reports, feedback, contact, transactions, audit

  // Data States
  const [metrics, setMetrics] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reports, setReports] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters & Modals
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState('ALL');
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  
  const [suspendModalUser, setSuspendModalUser] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendNotes, setSuspendNotes] = useState('');

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  const [contactSearch, setContactSearch] = useState('');
  const [contactStatusFilter, setContactStatusFilter] = useState('ALL');
  const [selectedContactModal, setSelectedContactModal] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  const [selectedReportModal, setSelectedReportModal] = useState(null);
  const [reportActionNotes, setReportActionNotes] = useState('');

  useEffect(() => {
    fetchAdminData();

    // Auto-refresh interval fallback so Admin Dashboard metrics stay up-to-date without page reloads
    const interval = setInterval(() => {
      fetchAdminData();
    }, 4000);

    return () => clearInterval(interval);
  }, [activeTab, refreshKey]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const [mRes, aRes] = await Promise.all([
          axios.get('/api/v1/admin/dashboard'),
          axios.get('/api/v1/admin/activities')
        ]);
        setMetrics(mRes.data || {});
        setRecentActivities(aRes.data || []);
      } else if (activeTab === 'users' || activeTab === 'suspicious') {
        const res = await axios.get('/api/v1/admin/users');
        setUsers(res.data || []);
      } else if (activeTab === 'orders') {
        const res = await axios.get('/api/v1/admin/orders');
        setOrders(res.data || []);
      } else if (activeTab === 'reports') {
        const res = await axios.get('/api/v1/admin/order-reports');
        setReports(res.data || []);
      } else if (activeTab === 'feedback') {
        const res = await axios.get('/api/v1/admin/feedback');
        setFeedback(res.data || []);
      } else if (activeTab === 'contact') {
        const res = await axios.get('/api/v1/admin/contact-messages');
        setContactMessages(res.data || []);
      } else if (activeTab === 'transactions') {
        const res = await axios.get('/api/v1/admin/transactions');
        setTransactions(res.data || []);
      } else if (activeTab === 'audit') {
        const res = await axios.get('/api/v1/admin/audit-logs');
        setAuditLogs(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScanSuspicious = async () => {
    setLoading(true);
    try {
      await axios.post('/api/v1/admin/detect-suspicious');
      alert('संदिग्ध खाता स्कैन सफलतापूर्वक पूरा हुआ! (Suspicious activity scan completed).');
      fetchAdminData();
    } catch (err) {
      alert('स्कैन करने में त्रुटि हुई।');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userObj, newStatus) => {
    if (newStatus === 'SUSPENDED') {
      setSuspendModalUser(userObj);
      setSuspendReason('Suspicious activity / Marketplace policy violation');
      setSuspendNotes('');
    } else {
      if (!window.confirm(`क्या आप वाकई ${userObj.fullName} के खाते को पुनः सक्रिय (Reactivate) करना चाहते हैं?`)) return;
      try {
        await axios.patch(`/api/v1/admin/users/${userObj.id}/status`, {
          status: 'ACTIVE',
          reason: 'Admin reactivated account',
          notes: 'Reactivated by admin'
        });
        fetchAdminData();
      } catch (err) {
        alert('खाता अपडेट करने में त्रुटि हुई।');
      }
    }
  };

  const handleConfirmSuspend = async () => {
    if (!suspendModalUser) return;
    try {
      await axios.patch(`/api/v1/admin/users/${suspendModalUser.id}/status`, {
        status: 'SUSPENDED',
        reason: suspendReason,
        notes: suspendNotes
      });
      setSuspendModalUser(null);
      fetchAdminData();
    } catch (err) {
      alert('खाता निलंबित करने में त्रुटि हुई।');
    }
  };

  const handleUpdateReportStatus = async (reportId, newStatus) => {
    try {
      await axios.patch(`/api/v1/admin/order-reports/${reportId}/status`, {
        status: newStatus,
        notes: reportActionNotes
      });
      setSelectedReportModal(null);
      fetchAdminData();
    } catch (err) {
      alert('रिपोर्ट स्थिति अपडेट करने में त्रुटि हुई।');
    }
  };

  const handleUpdateContactMessage = async (msgId, newStatus) => {
    try {
      await axios.patch(`/api/v1/admin/contact-messages/${msgId}/status`, {
        status: newStatus,
        reply: adminReplyText,
        notes: 'Admin replied'
      });
      setSelectedContactModal(null);
      fetchAdminData();
    } catch (err) {
      alert('संदेश अपडेट करने में त्रुटि हुई।');
    }
  };

  const handleUpdateFeedbackStatus = async (feedbackId, newStatus) => {
    try {
      await axios.patch(`/api/v1/admin/feedback/${feedbackId}/status`, {
        status: newStatus,
        notes: 'Updated by admin'
      });
      fetchAdminData();
    } catch (err) {
      alert('प्रतिक्रिया अपडेट करने में त्रुटि हुई।');
    }
  };

  const handleViewUserDetail = async (userId) => {
    try {
      const res = await axios.get(`/api/v1/admin/users/${userId}`);
      setSelectedUserDetail(res.data);
    } catch (err) {
      alert('उपयोगकर्ता विवरण प्राप्त करने में त्रुटि हुई।');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-72 bg-emerald-950 text-white flex flex-col flex-shrink-0 border-r border-emerald-900 shadow-2xl">
        
        {/* Header Branding */}
        <div className="p-6 border-b border-emerald-900 flex items-center space-x-3 bg-emerald-900/40">
          <div className="bg-white p-1 rounded-2xl shadow-lg border border-amber-400">
            <img src="/moolya-logo.jpg" alt="Moolya Logo" className="w-10 h-10 object-contain rounded-xl" />
          </div>
          <div>
            <h1 className="text-xl font-black text-amber-300 tracking-wide">Moolya Admin</h1>
            <span className="text-[10px] font-bold uppercase text-emerald-300 tracking-wider">
              नियंत्रण एवं निगरानी प्रणाली
            </span>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition ${
              activeTab === 'dashboard' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>डैशबोर्ड विवरण (Dashboard)</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition ${
              activeTab === 'users' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>उपयोगकर्ता प्रबंधन (Users)</span>
          </button>

          <button
            onClick={() => setActiveTab('suspicious')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition ${
              activeTab === 'suspicious' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>संदिग्ध खाते (Suspicious Users)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition ${
              activeTab === 'orders' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>ऑर्डर निगरानी (Orders)</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition ${
              activeTab === 'reports' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <span>रिपोर्ट किए गए ऑर्डर (Reports)</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition ${
              activeTab === 'feedback' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>प्रतिक्रिया एवं समीक्षा (Feedback)</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition ${
              activeTab === 'contact' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span>संपर्क संदेश (Contact Messages)</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition ${
              activeTab === 'transactions' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <Receipt className="w-5 h-5" />
            <span>भुगतान लेनदेन (Transactions)</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition ${
              activeTab === 'audit' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <History className="w-5 h-5" />
            <span>ऑडिट लॉग (Audit Logs)</span>
          </button>
        </nav>

        {/* Footer Admin User Info & Logout */}
        <div className="p-4 border-t border-emerald-900 bg-emerald-900/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-amber-300 block">{adminUser?.fullName || 'System Admin'}</span>
            <span className="text-[10px] text-emerald-300 block font-mono">{adminUser?.phone || adminUser?.email}</span>
          </div>
          <button
            onClick={onLogout}
            className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
            title="लॉगआउट"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* SUBVIEW 1: DASHBOARD METRICS & SUMMARY */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900">प्रशासनिक डैशबोर्ड अवलोकन (Admin Overview)</h2>
                <p className="text-xs text-slate-500">MongoDB डेटाबेस से लाइव वास्तविक आँकड़े</p>
              </div>
              <button
                onClick={fetchAdminData}
                className="bg-emerald-800 hover:bg-emerald-900 text-amber-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>रिफ्रेश (Refresh Metrics)</span>
              </button>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>कुल पंजीकृत उपयोगकर्ता</span>
                  <Users className="w-5 h-5 text-emerald-700" />
                </div>
                <p className="text-3xl font-black text-emerald-900">{metrics.totalRegisteredUsers || 0}</p>
                <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span>किसान: <strong>{metrics.totalFarmers || 0}</strong></span>
                  <span>खरीदार: <strong>{metrics.totalBuyers || 0}</strong></span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>खाता स्थिति</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-3xl font-black text-slate-800">{metrics.activeUsers || 0}</p>
                <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span className="text-emerald-700 font-bold">सक्रिय: {metrics.activeUsers || 0}</span>
                  <span className="text-red-600 font-bold">निलंबित: {metrics.suspendedUsers || 0}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>ऑर्डर स्थिति</span>
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-3xl font-black text-emerald-800">{(metrics.pendingOrders || 0) + (metrics.completedOrders || 0)}</p>
                <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span className="text-amber-700 font-bold">पेंडिंग: {metrics.pendingOrders || 0}</span>
                  <span className="text-emerald-700 font-bold">पूर्ण: {metrics.completedOrders || 0}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>शिकायतें एवं संदेश</span>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-3xl font-black text-red-600">{(metrics.pendingComplaints || 0) + (metrics.unreadContactMessages || 0)}</p>
                <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span>रिपोर्ट्स: <strong>{metrics.pendingComplaints || 0}</strong></span>
                  <span>नये संदेश: <strong>{metrics.unreadContactMessages || 0}</strong></span>
                </div>
              </div>

            </div>

            {/* Recent Activities Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <History className="w-5 h-5 text-emerald-700" />
                <span>हाल की प्रशासनिक गतिविधियाँ (Recent Audit Activities)</span>
              </h3>

              {recentActivities.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">अभी कोई नई गतिविधि रिकॉर्ड नहीं है।</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {recentActivities.map((act) => (
                    <div key={act.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          {act.action}
                        </span>
                        <p className="text-slate-800 font-semibold mt-1">{act.reasonOrNote}</p>
                        <span className="text-[10px] text-slate-400">एडमिन: {act.adminName}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">{act.timestamp?.substring(0, 16)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* SUBVIEW 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">उपयोगकर्ता प्रबंधन (User Management)</h2>
                <p className="text-xs text-slate-500">सभी किसान एवं खरीदार खातों का पूर्ण विवरण तथा नियंत्रण</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="नाम, फोन या ईमेल से खोजें..."
                  className="p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none flex-1 sm:w-64"
                />
                
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="ALL">सभी रोल (All Roles)</option>
                  <option value="ROLE_FARMER">किसान (Farmers)</option>
                  <option value="ROLE_BUYER">खरीदार (Buyers)</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="ALL">सभी स्थिति</option>
                  <option value="ACTIVE">सक्रिय (Active)</option>
                  <option value="SUSPENDED">निलंबित (Suspended)</option>
                </select>
              </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users
                .filter(u => {
                  if (userRoleFilter !== 'ALL' && u.role?.name !== userRoleFilter) return false;
                  if (userStatusFilter !== 'ALL' && u.accountStatus !== userStatusFilter) return false;
                  if (userSearch.trim()) {
                    const q = userSearch.toLowerCase();
                    return u.fullName?.toLowerCase().includes(q) || u.phone?.includes(q) || u.email?.toLowerCase().includes(q);
                  }
                  return true;
                })
                .map((u) => (
                  <div key={u.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase ${
                            u.role === 'ROLE_FARMER' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                          }`}>
                            {u.role === 'ROLE_FARMER' ? 'किसान (Farmer)' : 'खरीदार (Buyer)'}
                          </span>
                          <h3 className="text-lg font-extrabold text-slate-900 mt-1">{u.fullName}</h3>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          u.accountStatus === 'SUSPENDED' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {u.accountStatus === 'SUSPENDED' ? '🚫 निलंबित' : '✅ सक्रिय'}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="flex justify-between">
                          <span>फोन नंबर:</span>
                          <span className="font-bold text-slate-800">{u.phone}</span>
                        </div>
                        {u.email && (
                          <div className="flex justify-between">
                            <span>ईमेल:</span>
                            <span className="font-semibold text-slate-800">{u.email}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>स्थान:</span>
                          <span className="font-semibold text-slate-700">{u.location?.district}, {u.location?.state}</span>
                        </div>
                        {u.suspiciousStatus === 'SUSPICIOUS' && (
                          <div className="pt-1 text-red-600 font-bold border-t border-slate-200 flex items-center space-x-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>⚠️ संदिग्ध पैटर्न चिह्नित</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleViewUserDetail(u.id)}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>विवरण</span>
                      </button>

                      {u.accountStatus === 'SUSPENDED' ? (
                        <button
                          onClick={() => handleToggleUserStatus(u, 'ACTIVE')}
                          className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>सक्रिय करें</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleUserStatus(u, 'SUSPENDED')}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>निलंबित करें</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* SUBVIEW 3: SUSPICIOUS USERS */}
        {activeTab === 'suspicious' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900">संदिग्ध गतिविधि वाले खाते (Suspicious Accounts)</h2>
                <p className="text-xs text-slate-500">डेटाबेस इंटेलिजेंस द्वारा संभावित फर्जी/संदिग्ध खातों का स्वचालित विश्लेषण</p>
              </div>

              <button
                onClick={handleScanSuspicious}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 shadow transition border border-amber-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span>स्वचालित स्कैन चलाएं (Run Auto-Scan)</span>
              </button>
            </div>

            <div className="space-y-4">
              {users.filter(u => u.suspiciousStatus === 'SUSPICIOUS' || u.suspiciousStatus === 'UNDER_REVIEW').length === 0 ? (
                <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">कोई संदिग्ध खाता नहीं मिला</h3>
                  <p className="text-xs text-slate-500">सभी पंजीकृत किसान एवं खरीदार मानक सुरक्षा मापदंडों का पालन कर रहे हैं।</p>
                </div>
              ) : (
                users
                  .filter(u => u.suspiciousStatus === 'SUSPICIOUS' || u.suspiciousStatus === 'UNDER_REVIEW')
                  .map(u => (
                    <div key={u.id} className="bg-white p-5 rounded-3xl border-2 border-amber-400 shadow-sm space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                            u.suspiciousStatus === 'SUSPICIOUS' ? 'bg-red-600 text-white' : 'bg-amber-400 text-emerald-950'
                          }`}>
                            ⚠️ {u.suspiciousStatus === 'SUSPICIOUS' ? 'HIGH RISK (संदिग्ध)' : 'UNDER REVIEW (समीक्षाधीन)'}
                          </span>
                          <h3 className="text-xl font-extrabold text-slate-900 mt-2">{u.fullName} ({u.role})</h3>
                          <span className="text-xs text-slate-500 font-mono">फोन: {u.phone} | आईडी: #{u.id?.substring(0, 8)}</span>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewUserDetail(u.id)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
                          >
                            पूर्ण जांच विवरण
                          </button>
                          
                          {u.accountStatus !== 'SUSPENDED' && (
                            <button
                              onClick={() => handleToggleUserStatus(u, 'SUSPENDED')}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition"
                            >
                              तुरंत निलंबित करें
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Suspicious Reasons Box */}
                      <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-xs space-y-1">
                        <span className="font-extrabold text-red-900 block">पहचाने गए संदिग्ध कारण (Detection Reasons):</span>
                        <p className="text-red-800 font-semibold">{u.suspiciousReason || 'Multiple order cancellations or reported cases'}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* SUBVIEW 4: ORDER MONITORING */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">ऑर्डर निगरानी (Order Monitoring)</h2>
                <p className="text-xs text-slate-500">बाज़ार के सभी सौदों एवं डिलीवरी तिथियों की विस्तृत निगरानी</p>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                >
                  <option value="ALL">सभी ऑर्डर स्थिति</option>
                  <option value="REQUESTED">पेंडिंग अनुरोध (Requested)</option>
                  <option value="ACCEPTED">स्वीकृत सौदे (Accepted)</option>
                  <option value="DECLINED">रद्द ऑर्डर (Declined)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {orders
                .filter(o => orderStatusFilter === 'ALL' || o.status === orderStatusFilter)
                .map(ord => (
                  <div key={ord.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 border-b border-slate-100 pb-3">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                          ord.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          ord.status === 'REQUESTED' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-red-100 text-red-800'
                        }`}>
                          {ord.status}
                        </span>
                        <h4 className="text-lg font-extrabold text-slate-900 mt-1">{ord.cropName} - {ord.quantityQuintals} क्विंटल</h4>
                      </div>
                      <span className="text-2xl font-black text-emerald-700">₹{ord.totalAmount}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                      <div>
                        <span>खरीदार: <strong className="text-slate-800">{ord.buyerName}</strong> ({ord.buyerPhone})</span>
                      </div>
                      <div>
                        <span>किसान: <strong className="text-slate-800">{ord.farmerName}</strong> ({ord.farmerPhone})</span>
                      </div>
                      <div>
                        <span>अपेक्षित डिलीवरी: <strong>{ord.expectedDeliveryDate || ord.requestedDeliveryDate}</strong></span>
                      </div>
                      <div>
                        <span>ऑनलाइन भुगतान: <strong className="text-emerald-700">{ord.paymentStatus || 'PENDING'}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* SUBVIEW 5: REPORTED ORDERS */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900">रिपोर्ट किए गए ऑर्डर (Reported Orders)</h2>
              <p className="text-xs text-slate-500">किसान या खरीदार द्वारा दर्ज की गई अनुचित ऑर्डर शिकायतें</p>
            </div>

            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl text-center border border-slate-200">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 mt-2">कोई पेंडिंग ऑर्डर रिपोर्ट नहीं है</p>
                </div>
              ) : (
                reports.map(rep => (
                  <div key={rep.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                          rep.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-950'
                        }`}>
                          {rep.status}
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 mt-1">ऑर्डर आईडी: #{rep.orderId?.substring(0, 8)}</h4>
                      </div>

                      <button
                        onClick={() => { setSelectedReportModal(rep); setReportActionNotes(rep.adminNotes || ''); }}
                        className="px-4 py-2 bg-emerald-800 text-amber-300 font-bold text-xs rounded-xl shadow"
                      >
                        कार्रवाई करें / स्थिति बदलें
                      </button>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1">
                      <p><strong>शिकायतकर्ता:</strong> {rep.reporterName} ({rep.reporterRole})</p>
                      <p><strong>कारण:</strong> <span className="text-red-700 font-bold">{rep.reason}</span></p>
                      <p><strong>विवरण:</strong> {rep.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SUBVIEW 6: FEEDBACK & REVIEWS */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900">प्रतिक्रिया एवं समीक्षा प्रबंधन (Feedback & Reviews)</h2>
              <p className="text-xs text-slate-500">उपयोगकर्ताओं द्वारा प्रस्तुत रेटिंग एवं सुझाव</p>
            </div>

            <div className="space-y-3">
              {feedback.map(fb => (
                <div key={fb.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 text-sm">{fb.userName}</span>
                      <span className="text-xs text-amber-500 font-bold flex items-center">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                        <span className="ml-1">{fb.rating} / 5</span>
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateFeedbackStatus(fb.id, 'RESOLVED')}
                        className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-lg"
                      >
                        स्वीकृत करें
                      </button>
                      <button
                        onClick={() => handleUpdateFeedbackStatus(fb.id, 'HIDDEN')}
                        className="px-3 py-1 bg-red-100 text-red-800 font-bold text-xs rounded-lg"
                      >
                        छिपाएं (Hide)
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium bg-slate-50 p-3 rounded-xl">{fb.reviewText}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBVIEW 7: CONTACT US MESSAGES */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900">संपर्क संदेश (Contact Us Messages)</h2>
              <p className="text-xs text-slate-500">वेबसाइट उपयोगकर्ताओं द्वारा भेजे गए सहायता संदेश</p>
            </div>

            <div className="space-y-3">
              {contactMessages.map(msg => (
                <div key={msg.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        msg.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-950'
                      }`}>
                        {msg.status}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1">{msg.subject}</h4>
                    </div>

                    <button
                      onClick={() => { setSelectedContactModal(msg); setAdminReplyText(msg.adminReply || ''); }}
                      className="px-4 py-2 bg-emerald-800 text-amber-300 font-bold text-xs rounded-xl shadow"
                    >
                      जवाब दें / स्टेटस बदलें
                    </button>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1">
                    <p><strong>भेजने वाला:</strong> {msg.name} ({msg.phoneOrEmail})</p>
                    <p><strong>संदेश:</strong> {msg.message}</p>
                    {msg.adminReply && (
                      <p className="text-emerald-900 font-bold pt-1 border-t border-slate-200">
                        <strong>एडमिन उत्तर:</strong> {msg.adminReply}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBVIEW 8: TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900">भुगतान एवं लेनदेन इतिहास (Transactions)</h2>
              <p className="text-xs text-slate-500">MongoDB में दर्ज सभी ऑनलाइन भुगतान रिकॉर्ड</p>
            </div>

            <div className="space-y-3">
              {transactions.map(txn => (
                <div key={txn.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <span className="bg-emerald-100 text-emerald-900 font-black px-2.5 py-0.5 rounded border border-emerald-300">
                      {txn.paymentMethod} • {txn.status}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900">{txn.cropName} - {txn.quantityQuintals} क्विंटल</h4>
                    <p className="text-slate-500 font-mono">खरीदार: {txn.buyerName} | किसान: {txn.farmerName} | Txn: {txn.transactionId}</p>
                  </div>
                  <span className="text-2xl font-black text-emerald-700">₹{txn.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBVIEW 9: ADMIN AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900">प्रशासनिक ऑडिट लॉग (Audit Logs)</h2>
              <p className="text-xs text-slate-500">सुरक्षा एवं जवाबदेही के लिए सभी एडमिन कार्रवाइयों का इतिहास</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <span className="font-extrabold text-amber-950 bg-amber-200 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <p className="text-slate-800 font-medium">{log.reasonOrNote}</p>
                    <span className="text-[10px] text-slate-400">एडमिन: {log.adminName} ({log.adminId})</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{log.timestamp?.substring(0, 19)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* USER DETAILS MODAL */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-slate-900">{selectedUserDetail.user?.fullName} का पूर्ण विवरण</h3>
              <button onClick={() => setSelectedUserDetail(null)} className="font-bold text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
              <p><strong>रोल:</strong> {selectedUserDetail.user?.role}</p>
              <p><strong>फोन:</strong> {selectedUserDetail.user?.phone}</p>
              <p><strong>ईमेल:</strong> {selectedUserDetail.user?.email || 'N/A'}</p>
              <p><strong>खाता स्थिति:</strong> {selectedUserDetail.user?.accountStatus}</p>
              <p><strong>संदिग्ध स्थिति:</strong> {selectedUserDetail.user?.suspiciousStatus}</p>
            </div>
          </div>
        </div>
      )}

      {/* SUSPEND USER MODAL */}
      {suspendModalUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border-2 border-red-500">
            <h3 className="text-lg font-black text-red-700">खाता निलंबित करें (Suspend User)</h3>
            <p className="text-xs text-slate-600">{suspendModalUser.fullName} ({suspendModalUser.phone})</p>

            <div className="space-y-2 text-xs">
              <label className="font-bold block">निलंबन का कारण (Reason):</label>
              <input
                type="text"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
              />

              <label className="font-bold block pt-2">आंतरिक एडमिन नोट्स (Notes):</label>
              <textarea
                value={suspendNotes}
                onChange={(e) => setSuspendNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold h-20"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button onClick={() => setSuspendModalUser(null)} className="flex-1 py-2.5 bg-slate-100 font-bold text-xs rounded-xl">रद्द करें</button>
              <button onClick={handleConfirmSuspend} className="flex-1 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl shadow">निलंबित करें</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
