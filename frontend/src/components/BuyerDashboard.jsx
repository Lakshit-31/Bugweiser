import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, ShieldCheck, MapPin, Phone, Truck, Send, Mic, Sparkles, ShoppingBag, CheckCircle, Award } from 'lucide-react';
import { speakText, createSpeechRecognizer } from '../services/voiceService';
import axios from 'axios';

export const BuyerDashboard = () => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('search'); // 'search', 'postRequirement', 'orders'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  // Post Requirement Voice/Text state
  const [requirementText, setRequirementText] = useState('');
  const [isListeningReq, setIsListeningReq] = useState(false);
  const [reqSuccessMsg, setReqSuccessMsg] = useState('');

  useEffect(() => {
    fetchProduceListings();
  }, [searchQuery, selectedGrade]);

  useEffect(() => {
    if (user && activeTab === 'orders') {
      fetchBuyerOrders();
    }
  }, [user, activeTab]);

  const fetchProduceListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.cropName = searchQuery;
      if (selectedGrade) params.grade = selectedGrade;
      if (user?.id) params.buyerId = user.id;

      const res = await axios.get('/api/v1/produce/search', { params });
      setResults(res.data);
    } catch (err) {
      console.error('Error fetching produce:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuyerOrders = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`/api/v1/orders/buyer-orders/${user.id}`);
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching buyer orders:', err);
    }
  };

  const handleRequestDeal = async (listing) => {
    if (!user) {
      alert('सौदा का अनुरोध करने के लिए कृपया लॉगिन करें। (Please login to request deal)');
      return;
    }

    try {
      await axios.post('/api/v1/orders/deal-request', {
        listingId: listing.id,
        buyerId: user.id,
        quantityQuintals: listing.quantityQuintals
      });
      alert(`अनुरोध किसान ${listing.farmerName} को भेज दिया गया है! रियल-टाइम नोटिफिकेशन भेजा गया।`);
      fetchProduceListings();
    } catch (err) {
      alert(err.response?.data?.message || 'ऑर्डर अनुरोध भेजने में विफल।');
    }
  };

  const handleVoiceRequirement = () => {
    setIsListeningReq(true);
    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsListeningReq(false);
        setRequirementText(transcript);
        speakText(`आवश्यकता प्राप्त हुई: ${transcript}`, lang);
      },
      () => setIsListeningReq(false),
      lang
    );
    if (recognizer) recognizer.start();
  };

  const handlePostRequirement = async (e) => {
    e.preventDefault();
    if (!requirementText) return;

    try {
      await axios.post('/api/v1/requirements', {
        buyerId: user?.id,
        buyerName: user?.fullName || 'Verified Buyer',
        buyerPhone: user?.phone || '9123456789',
        rawVoicePrompt: requirementText,
        cropName: requirementText.split(' ')[0] || 'Crop',
        quantityQuintals: 50.0
      });
      setReqSuccessMsg('आपकी आवश्यकता सफलतापूर्वक पोस्ट कर दी गई है! किसानों को मैच स्कोर के आधार पर सूचित किया जाएगा।');
      setRequirementText('');
    } catch (err) {
      alert('आवश्यकता सबमिट करने में विफल।');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-400 text-slate-950 text-xs font-black uppercase px-2.5 py-0.5 rounded-full">
              {t('buyerDashboard')}
            </span>
            {user?.buyerType === 'BUSINESS' && (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-2 py-0.5 rounded">
                Business: {user.businessName} (GST: {user.gstId})
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1">
            सत्यापित किसान उपज खोज (Verified Produce Discovery)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            गुणवत्ता ग्रेड A, B, C एवं विश्वास मैच स्कोर (Trust Match Score) के साथ सीधे किसानों से संपर्क करें।
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition ${
              activeTab === 'search' ? 'bg-amber-400 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            फसल खोजें (Search Matrix)
          </button>

          <button
            onClick={() => setActiveTab('postRequirement')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition ${
              activeTab === 'postRequirement' ? 'bg-amber-400 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {t('postRequirement')} (Voice/Chat)
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition ${
              activeTab === 'orders' ? 'bg-amber-400 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {t('myOrders')} ({orders.length})
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUCE SEARCH MATRIX */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          
          {/* Search Bar & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="फसल का नाम खोजें (उदा: गेहूँ, Wheat, Basmati Rice, Potato)..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm font-medium"
              />
            </div>

            {/* Quality Grade Filter */}
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-emerald-800" />
              <span className="text-xs font-bold text-slate-600">ग्रेड फ़िल्टर:</span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="">सभी ग्रेड (All Grades)</option>
                <option value="GRADE_A">Grade A (Organic / Fresh)</option>
                <option value="GRADE_B">Grade B (Standard Pesticides)</option>
                <option value="GRADE_C">Grade C (Chemical / Stored)</option>
              </select>
            </div>

          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-bold">खोज रहा है... (Searching listings...)</div>
          ) : results.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-700">कोई फसल मैच नहीं हुई</h3>
              <p className="text-xs text-slate-500">फिल्टर बदलें या अपनी आवश्यकता पोस्ट करें।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(({ listing, buyerTrustMatchScore, netEarningsBreakdown }) => (
                <div key={listing.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between">
                  
                  <div>
                    {/* Produce Image Header */}
                    <div className="relative h-48 bg-slate-100">
                      <img
                        src={listing.imageUrls?.[0] || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600"}
                        alt={listing.cropName}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Grade Badge */}
                      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black text-white shadow-md ${
                        listing.assignedGrade === 'GRADE_A' ? 'bg-emerald-600' :
                        listing.assignedGrade === 'GRADE_B' ? 'bg-amber-500' : 'bg-red-500'
                      }`}>
                        {listing.assignedGrade === 'GRADE_A' ? 'Grade A (Organic)' :
                         listing.assignedGrade === 'GRADE_B' ? 'Grade B (Standard)' : 'Grade C (Chemical)'}
                      </div>

                      {/* BUYER TRUST MATCH SCORE */}
                      <div className="absolute top-3 right-3 bg-emerald-950/90 text-amber-300 px-3 py-1 rounded-full text-xs font-extrabold shadow border border-amber-400/50 flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Trust Match: {buyerTrustMatchScore}%</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-4">
                      
                      {/* Crop Name & Location */}
                      <div>
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-xl font-bold text-slate-900">{listing.cropName}</h3>
                          <span className="text-lg font-black text-emerald-700">₹{listing.pricePerQuintal}/क्विंटल</span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{listing.location?.district}, {listing.location?.state}</span>
                        </p>
                      </div>

                      {/* Farmer Name & Direct Contact */}
                      <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-emerald-800 font-bold">{t('contactFarmer')}:</span>
                          <span className="font-extrabold text-slate-900">{listing.farmerName}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-emerald-800 font-bold">फोन नंबर:</span>
                          <span className="font-mono font-bold text-slate-900 flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-emerald-700 inline" />
                            <span>{listing.farmerPhone}</span>
                          </span>
                        </div>
                      </div>

                      {/* Transparency Net Earnings Breakdown */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                        <span className="font-bold text-slate-700 block border-b border-slate-200 pb-1">
                          पारदर्शिता निवल कमाई (Net Earnings Breakdown):
                        </span>
                        <div className="flex justify-between text-slate-600">
                          <span>कुल मूल्य (Gross Total):</span>
                          <span className="font-bold">₹{netEarningsBreakdown?.grossTotal}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>अनुमानित परिवहन लागत (Est. Transport):</span>
                          <span className="font-semibold text-amber-700">₹{netEarningsBreakdown?.estimatedTransportCost}</span>
                        </div>
                        <div className="flex justify-between text-slate-800 font-bold border-t border-slate-200 pt-1">
                          <span>किसान निवल आय (Net Profit):</span>
                          <span className="font-black text-emerald-700">₹{netEarningsBreakdown?.netFarmerEarnings}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Direct Deal Trigger Button */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => handleRequestDeal(listing)}
                      className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold rounded-2xl text-sm transition shadow flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>{t('requestDeal')}</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: POST REQUIREMENT VIA VOICE/CHAT */}
      {activeTab === 'postRequirement' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
            <div className="bg-amber-400 p-2.5 rounded-2xl text-slate-950">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">अपनी फसल आवश्यकता पोस्ट करें</h2>
              <p className="text-xs text-slate-500">वॉइस एआई या टेक्स्ट में लिखकर आवश्यकता साझा करें (उदा: 50 क्विंटल ग्रेड-ए गेहूँ)</p>
            </div>
          </div>

          {reqSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{reqSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handlePostRequirement} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  आवश्यकता विवरण (Voice / Text):
                </label>
                <button
                  type="button"
                  onClick={handleVoiceRequirement}
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 transition ${
                    isListeningReq ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isListeningReq ? 'सुन रहा है...' : 'बोलकर लिखें'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={requirementText}
                onChange={(e) => setRequirementText(e.target.value)}
                placeholder='उदा: "मुझे पंजाब में 50 क्विंटल ग्रेड-ए गेहूँ की आवश्यकता है। कटाई की तारीख 15 अप्रैल के बाद हो।"'
                className="w-full p-4 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold rounded-2xl text-sm transition shadow"
            >
              आवश्यकता सबमिट करें (Submit Requirement)
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">कोई ऑर्डर इतिहास नहीं है</h3>
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
                    <span className="text-xs text-slate-400">Order #{ord.id?.substring(0, 8)}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">{ord.cropName} - {ord.quantityQuintals} क्विंटल</h4>
                  <p className="text-xs text-slate-500">
                    किसान: <span className="font-semibold text-slate-700">{ord.farmerName}</span> ({ord.farmerPhone})
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-xl font-black text-emerald-700">₹{ord.totalAmount}</p>
                  {ord.expectedDeliveryDate && (
                    <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                      किसान द्वारा स्वीकृत डिलीवरी: {ord.expectedDeliveryDate}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
