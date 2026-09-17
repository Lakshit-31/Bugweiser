import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

export const ReportOrderModal = ({ isOpen, onClose, order, user }) => {
  const { t } = useLanguage();
  const [reason, setReason] = useState('NON_PAYMENT');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please enter complaint details.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const isFarmer = user?.role === 'ROLE_FARMER';
      const payload = {
        orderId: order.id,
        cropName: order.cropName || 'Produce',
        reporterId: user?.id,
        reporterName: user?.fullName || 'User',
        reporterRole: user?.role,
        targetUserId: isFarmer ? order.buyerId : order.farmerId,
        targetUserName: isFarmer ? order.buyerName : order.farmerName,
        reason: reason,
        description: description.trim()
      };

      await axios.post('/api/v1/admin/order-reports', payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Unable to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-red-500">
        
        {/* Modal Header */}
        <div className="bg-red-700 text-white p-5 flex justify-between items-center border-b border-red-800">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-400 text-red-950 p-2.5 rounded-2xl shadow">
              <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                {t('reportOrderSub')}
              </span>
              <h3 className="text-lg font-extrabold text-white">
                {t('reportOrderTitle')}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-red-200 hover:text-white p-1 rounded-full hover:bg-red-800 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-slate-900">{t('reportSuccessTitle')}</h4>
            <p className="text-xs text-slate-600 font-medium">
              {t('reportSuccessDesc', { id: order.id?.substring(0, 8) })}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            <div className="bg-red-50 border border-red-200 p-3 rounded-2xl text-xs font-semibold text-red-950 space-y-1">
              <span className="font-extrabold text-red-800 block">{t('orderDetailsSummary')}:</span>
              <p>🌾 {order.cropName} | {order.quantityQuintals} {t('quintalUnit')}</p>
              <p>💰 ₹{order.totalAmount} | {order.status}</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-100 text-red-900 border border-red-300 text-xs font-bold rounded-xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('reportReasonLabel')}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-300 font-bold text-xs text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="NON_PAYMENT">{t('reportReasonNonPayment')}</option>
                <option value="NON_DELIVERY">{t('reportReasonDelivery')}</option>
                <option value="QUALITY_MISMATCH">{t('reportReasonQuality')}</option>
                <option value="FRAUD_ATTEMPT">{t('reportReasonFraud')}</option>
                <option value="OTHER">{t('reportReasonOther')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('reportDetailsLabel')}
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('reportDetailsPlaceholder')}
                className="w-full p-3 rounded-2xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition"
              >
                {t('cancelBtn')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 py-3 bg-red-700 hover:bg-red-800 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center space-x-1 disabled:opacity-50"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{loading ? t('submittingReportBtn') : t('submitReportBtn')}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
