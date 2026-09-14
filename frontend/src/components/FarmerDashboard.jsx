import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Package, ShoppingCart, DollarSign, Award, Calendar, Phone, CheckCircle2, Clock, MapPin, Truck } from 'lucide-react';
import axios from 'axios';

export const FarmerDashboard = ({ onOpenVoiceListing }) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('produce'); // 'produce', 'orders', 'earnings'
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmerData();
  }, [user]);

  const fetchFarmerData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [listRes, ordRes] = await Promise.all([
        axios.get(`/api/v1/produce/farmer/${user.id}`),
        axios.get(`/api/v1/orders/farmer-orders/${user.id}`)
      ]);
      setListings(listRes.data);
      setOrders(ordRes.data);
    } catch (err) {
      console.error('Error fetching farmer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalEarnings = () => {
    return orders
      .filter(o => o.status === 'ACCEPTED' || o.status === 'DELIVERED')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-400 text-emerald-950 text-xs font-black uppercase px-2.5 py-0.5 rounded-full">
              {t('farmerDashboard')}
            </span>
            <span className="text-xs text-emerald-200">
              {user?.location?.district}, {user?.location?.state}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1">
            नमस्ते, {user?.fullName || 'किसान भाई'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            अपनी फसल सीधे सत्यापित खरीदारों को बेचें और AI वॉइस असिस्टेंट के साथ फसल लिस्टिंग का आनंद लें।
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onOpenVoiceListing}
          className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition flex items-center space-x-2 text-base border-2 border-amber-300 animate-pulse"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
          <span>{t('listProduce')}</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('produce')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-sm transition ${
            activeTab === 'produce' ? 'bg-emerald-800 text-amber-300 shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>मेरी सूचीबद्ध फसलें ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-sm transition ${
            activeTab === 'orders' ? 'bg-emerald-800 text-amber-300 shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>सक्रिय ऑर्डर / सौदे ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-sm transition ${
            activeTab === 'earnings' ? 'bg-emerald-800 text-amber-300 shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{t('transactions')}</span>
        </button>
      </div>

      {/* TAB 1: PRODUCE LIST */}
      {activeTab === 'produce' && (
        <div>
          {listings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <Package className="w-16 h-16 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-700">कोई फसल लिस्ट नहीं है</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                "नया उत्पाद जोड़ें" बटन पर क्लिक करें और AI वॉइस असिस्टेंट के साथ अपनी फसल रिकॉर्ड करें।
              </p>
              <button
                onClick={onOpenVoiceListing}
                className="bg-emerald-800 text-amber-300 font-bold px-6 py-2.5 rounded-xl text-sm"
              >
                {t('listProduce')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition">
                  
                  {/* Photo Thumbnail */}
                  <div className="relative h-48 bg-slate-100">
                    <img
                      src={item.imageUrls?.[0] || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600"}
                      alt={item.cropName}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Grade Badge */}
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black text-white shadow-md ${
                      item.assignedGrade === 'GRADE_A' ? 'bg-emerald-600' :
                      item.assignedGrade === 'GRADE_B' ? 'bg-amber-500' : 'bg-red-500'
                    }`}>
                      {item.assignedGrade === 'GRADE_A' ? 'ग्रेड A (Organic)' :
                       item.assignedGrade === 'GRADE_B' ? 'ग्रेड B (Regulated)' : 'ग्रेड C (Standard)'}
                    </div>

                    {/* Image Count Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2.5 py-0.5 rounded-md text-xs font-bold">
                      📸 {item.imageUrls?.length || 4} Photos
                    </div>
                  </div>

                  {/* Info Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{item.cropName}</h3>
                        <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.location?.district}, {item.location?.state}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">अपेक्षित मूल्य</span>
                        <p className="text-lg font-black text-emerald-700">₹{item.pricePerQuintal}/क्विंटल</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">उपलब्ध मात्रा:</span>
                        <span className="font-bold text-slate-700">{item.quantityQuintals} क्विंटल</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">कीटनाशक प्रयोग:</span>
                        <span className="font-semibold text-slate-700">{item.pesticidesUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">कटाई तिथि:</span>
                        <span className="font-semibold text-slate-700">{item.harvestDate}</span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">अभी कोई सक्रिय ऑर्डर नहीं है</h3>
            </div>
          ) : (
            orders.map(ord => (
              <div key={ord.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      ord.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                      ord.status === 'REQUESTED' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {ord.status}
                    </span>
                    <span className="text-xs text-slate-400">ऑर्डर आईडी: #{ord.id?.substring(0, 8)}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">{ord.cropName} - {ord.quantityQuintals} क्विंटल</h4>
                  <p className="text-xs text-slate-500">
                    खरीदार: <span className="font-semibold text-slate-700">{ord.buyerName}</span> ({ord.buyerPhone})
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-xl font-black text-emerald-700">₹{ord.totalAmount}</p>
                  {ord.expectedDeliveryDate && (
                    <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                      संभावित डिलीवरी: {ord.expectedDeliveryDate}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: EARNINGS & TRANSACTIONS */}
      {activeTab === 'earnings' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">कुल स्वीकृत बिक्री</span>
            <p className="text-3xl font-extrabold text-emerald-700">₹{calculateTotalEarnings()}</p>
            <p className="text-xs text-slate-500">सीधे बैंक खाते में ट्रांसफर योग्य</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">बचत परिवहन लागत (Est. Savings)</span>
            <p className="text-3xl font-extrabold text-amber-600">₹{Math.round(calculateTotalEarnings() * 0.045)}</p>
            <p className="text-xs text-slate-500">मूल्य डायरेक्ट मैचमेकिंग द्वारा बचाई गई</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">किसान ट्रस्ट स्कोर</span>
            <p className="text-3xl font-extrabold text-blue-600">95 / 100</p>
            <p className="text-xs text-slate-500">सत्यापित आधार एवं उत्कृष्ट ग्रेड रिकॉर्ड</p>
          </div>
        </div>
      )}

    </div>
  );
};
