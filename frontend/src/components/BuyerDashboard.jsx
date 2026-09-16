import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { Search, Filter, ShieldCheck, MapPin, Phone, Truck, Send, Mic, Sparkles, ShoppingBag, CheckCircle, Award, CreditCard, QrCode, Receipt, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react';
import { speakText, createSpeechRecognizer } from '../services/voiceService';
import { parseQuantityOrPrice, parseQuantityAndUnit } from '../utils/voiceParser';
import { OrderChatModal } from './OrderChatModal';
import { ProduceImageGallery } from './ProduceImageGallery';
import { ReportOrderModal } from './ReportOrderModal';
import axios from 'axios';

export const BuyerDashboard = ({ onOpenAuth }) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const { refreshKey, triggerRefresh } = useWebSocket();

  const [activeTab, setActiveTab] = useState('search'); // 'search', 'postRequirement', 'orders', 'transactions'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeChatOrder, setActiveChatOrder] = useState(null);
  const [reportingOrder, setReportingOrder] = useState(null);

  // Post Requirement Voice/Text state
  const [requirementText, setRequirementText] = useState('');
  const [isListeningReq, setIsListeningReq] = useState(false);
  const [reqSuccessMsg, setReqSuccessMsg] = useState('');

  // Deal Request Date & Quantity Modal state
  const [selectedDealListing, setSelectedDealListing] = useState(null);
  const [buyerRequestedQuantity, setBuyerRequestedQuantity] = useState(50);
  const [buyerRequestedUnit, setBuyerRequestedUnit] = useState('QUINTAL');
  const [buyerRequestedDate, setBuyerRequestedDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [submittingDeal, setSubmittingDeal] = useState(false);

  // Payment Modal state
  const [payModalOrder, setPayModalOrder] = useState(null);
  const [payMethod, setPayMethod] = useState('UPI'); // 'UPI', 'CARD'
  const [cardNumber, setCardNumber] = useState('4532 8921 7843 9012');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('321');
  const [cardHolder, setCardHolder] = useState(user?.fullName || 'Verified Buyer');
  const [upiId, setUpiId] = useState(user?.phone ? `${user.phone}@upi` : 'buyer@upi');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchProduceListings();
    if (user) {
      fetchBuyerOrders();
      fetchBuyerTransactions();
    }

    // Auto-refresh interval fallback so Buyer Dashboard is always up-to-date without page reloads
    const interval = setInterval(() => {
      fetchProduceListings();
      if (user) {
        fetchBuyerOrders();
        fetchBuyerTransactions();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [user, activeTab, searchQuery, selectedGrade, refreshKey]);

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

  const fetchBuyerTransactions = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`/api/v1/orders/transactions/buyer/${user.id}`);
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching buyer transactions:', err);
    }
  };

  const handleOpenDealModal = (listing) => {
    if (!user) {
      alert('सौदा का अनुरोध करने के लिए कृपया लॉगिन करें। (Please login to request deal)');
      if (onOpenAuth) onOpenAuth();
      return;
    }
    setSelectedDealListing(listing);
    setBuyerRequestedUnit(listing.unit || 'QUINTAL');
    setBuyerRequestedQuantity(listing.displayQuantity || listing.quantityQuintals || 50);
    setBuyerRequestedDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  };

  const handleConfirmDealRequest = async () => {
    if (!selectedDealListing || !user) return;
    const qty = parseFloat(buyerRequestedQuantity) || selectedDealListing.quantityQuintals;
    const unit = buyerRequestedUnit || 'QUINTAL';
    const qtyQuintals = unit === 'KG' ? (qty / 100.0) : qty;
    setSubmittingDeal(true);

    try {
      await axios.post('/api/v1/orders/deal-request', {
        listingId: selectedDealListing.id,
        buyerId: user.id,
        unit: unit,
        displayQuantity: qty,
        quantityQuintals: qtyQuintals,
        requestedDeliveryDate: buyerRequestedDate
      });
      alert(`अनुरोध किसान ${selectedDealListing.farmerName} को भेज दिया गया है! मात्रा: ${qty} ${unit === 'KG' ? 'Kg (किलो)' : 'क्विंटल'}, आपकी पसंदीदा डिलीवरी तारीख: ${buyerRequestedDate}`);
      setSelectedDealListing(null);
      triggerRefresh();
      fetchProduceListings();
    } catch (err) {
      alert(err.response?.data?.message || 'ऑर्डर अनुरोध भेजने में विफल।');
    } finally {
      setSubmittingDeal(false);
    }
  };

  const handleExecutePayment = async () => {
    if (!payModalOrder || !user) return;
    setPaying(true);

    try {
      const res = await axios.post('/api/v1/orders/pay', {
        orderId: payModalOrder.id,
        buyerId: user.id,
        paymentMethod: payMethod,
        cardNumber: payMethod === 'CARD' ? cardNumber : null,
        upiId: payMethod === 'UPI' ? upiId : null,
        amount: payModalOrder.totalAmount
      });

      const amountVal = payModalOrder.totalAmount;
      speakText(`भुगतान सफल रहा! ₹${amountVal} किसान ${payModalOrder.farmerName} को भेज दिए गए हैं।`, 'hi');
      alert(`🎉 डेमो भुगतान सफल हुआ! ₹${amountVal} किसान ${payModalOrder.farmerName} को हस्तांतरित कर दिए गए। (Txn: ${res.data.transactionId})`);

      setPayModalOrder(null);
      triggerRefresh();
      fetchBuyerOrders();
      fetchBuyerTransactions();
    } catch (err) {
      alert(err.response?.data?.message || 'भुगतान प्रक्रिया में त्रुटि हुई।');
    } finally {
      setPaying(false);
    }
  };

  const handleVoiceRequirement = () => {
    if (!user) {
      alert('कृपया वॉइस असिस्टेंट का उपयोग करने के लिए लॉगिन करें! (Please login to use Voice Assistant)');
      if (onOpenAuth) onOpenAuth();
      return;
    }
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
      const parsed = parseQuantityAndUnit(requirementText);
      await axios.post('/api/v1/requirements', {
        buyerId: user?.id,
        buyerName: user?.fullName || 'Verified Buyer',
        buyerPhone: user?.phone || '9123456789',
        rawVoicePrompt: requirementText,
        cropName: requirementText.split(' ')[0] || 'Crop',
        quantityQuintals: parsed.quantityQuintals,
        unit: parsed.unit,
        displayQuantity: parsed.displayQuantity
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
        <div className="flex space-x-2 flex-wrap gap-y-2">
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

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center space-x-1.5 ${
              activeTab === 'transactions' ? 'bg-amber-400 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>लेनदेन इतिहास ({transactions.length})</span>
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
                <div key={listing.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between p-4 space-y-3">
                  
                  <div>
                    {/* Produce Image Gallery Carousel & Thumbnails */}
                    <div className="relative">
                      <ProduceImageGallery
                        imageUrls={listing.imageUrls}
                        cropName={listing.cropName}
                        gradeBadge={
                          <div className={`px-3 py-1 rounded-full text-xs font-black text-white shadow-md ${
                            listing.assignedGrade === 'GRADE_A' ? 'bg-emerald-600' :
                            listing.assignedGrade === 'GRADE_B' ? 'bg-amber-500' : 'bg-red-500'
                          }`}>
                            {listing.assignedGrade === 'GRADE_A' ? 'Grade A (Organic)' :
                             listing.assignedGrade === 'GRADE_B' ? 'Grade B (Standard)' : 'Grade C (Chemical)'}
                          </div>
                        }
                      />

                      {/* BUYER TRUST MATCH SCORE OVERLAY */}
                      <div className="absolute top-3 right-3 z-10 bg-emerald-950/90 text-amber-300 px-3 py-1 rounded-full text-xs font-extrabold shadow border border-amber-400/50 flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Trust Match: {buyerTrustMatchScore}%</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="space-y-4 pt-2">
                      
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
                      onClick={() => handleOpenDealModal(listing)}
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
              <div key={ord.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      ord.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      ord.status === 'REQUESTED' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-red-100 text-red-800'
                    }`}>
                      {ord.status === 'ACCEPTED' ? 'स्वीकृत (Confirmed Deal)' : ord.status}
                    </span>
                    <span className="text-xs text-slate-400">Order #{ord.id?.substring(0, 8)}</span>

                    {ord.paymentStatus === 'PAID' && (
                      <span className="bg-emerald-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>भुगतान संपन्न ({ord.paymentMethod})</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-extrabold text-slate-800">{ord.cropName} - {ord.displayQuantity || ord.quantityQuintals} {ord.unit === 'KG' ? 'Kg (किलो)' : 'क्विंटल'}</h4>
                  <p className="text-xs text-slate-600">
                    किसान: <span className="font-bold text-slate-800">{ord.farmerName}</span> ({ord.farmerPhone})
                  </p>
                  
                  {/* Delivery Dates & Delay Reason Display */}
                  <div className="flex flex-wrap gap-2 pt-1 text-xs">
                    {ord.requestedDeliveryDate && (
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200">
                        📅 आपकी पसंदीदा तारीख: <strong>{ord.requestedDeliveryDate}</strong>
                      </span>
                    )}
                    {ord.expectedDeliveryDate && (
                      <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                        🚚 किसान स्वीकृत डिलीवरी तारीख: <strong>{ord.expectedDeliveryDate}</strong>
                      </span>
                    )}
                    {ord.delayReason && (
                      <span className="bg-amber-100 text-amber-950 font-extrabold px-2.5 py-1 rounded-lg border border-amber-300">
                        ⚠️ देरी की वजह: {ord.delayReason}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right space-y-2 w-full md:w-auto flex flex-col md:items-end">
                  <p className="text-2xl font-black text-emerald-700">₹{ord.totalAmount}</p>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveChatOrder(ord)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow transition flex items-center space-x-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                      <span>💬 चैट करें</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReportingOrder(ord)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                      <span>🚨 रिपोर्ट</span>
                    </button>

                    {/* Payment Button / Status Badge */}
                    {ord.status === 'ACCEPTED' && (
                      <div>
                        {ord.paymentStatus === 'PAID' ? (
                          <div className="bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-900 text-right space-y-0.5">
                            <span className="text-emerald-700 block">✅ भुगतान पूर्ण</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setPayModalOrder(ord);
                              setPayMethod('UPI');
                            }}
                            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1 border border-amber-300 animate-pulse"
                          >
                            <CreditCard className="w-4 h-4 stroke-[2.5]" />
                            <span>💳 भुगतान (Pay ₹{ord.totalAmount})</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: TRANSACTIONS HISTORY */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900">भुगतान एवं लेनदेन इतिहास (Transaction History)</h3>
              <p className="text-xs text-slate-500">खरीदार द्वारा किसान को किए गए सभी सफल भुगतान रिकॉर्ड</p>
            </div>
            <span className="bg-emerald-100 text-emerald-900 font-black text-xs px-3 py-1 rounded-full border border-emerald-300">
              कुल {transactions.length} सफल भुगतान
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">कोई लेनदेन इतिहास नहीं है</h3>
              <p className="text-xs text-slate-500">ऑर्डर स्वीकार होने के बाद भुगतान पूरा करने पर इतिहास यहाँ दिखाई देगा।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transactions.map(txn => (
                <div key={txn.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md border border-emerald-300">
                        {txn.status || 'SUCCESSFUL'} ({txn.paymentMethod})
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1">{txn.cropName} - {txn.quantityQuintals} क्विंटल</h4>
                    </div>
                    <span className="text-xl font-black text-emerald-700">₹{txn.amount}</span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">किसान प्राप्तकर्ता:</span>
                      <span className="font-bold text-slate-800">{txn.farmerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ट्रांजैक्शन आईडी:</span>
                      <span className="font-mono text-slate-800 font-semibold">{txn.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">दिनांक एवं समय:</span>
                      <span className="font-semibold text-slate-700">{txn.createdAt?.replace('T', ' ')?.substring(0, 19)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BUYER DEAL REQUEST DATE & QUANTITY MODAL */}
      {selectedDealListing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-5 sm:p-6 space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">सौदा अनुरोध (Deal Request)</h3>
                <p className="text-xs text-slate-500">किसान {selectedDealListing.farmerName} - {selectedDealListing.cropName}</p>
              </div>
              <button onClick={() => setSelectedDealListing(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
                ✕
              </button>
            </div>

            {/* Quantity Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700 uppercase">
                  मात्रा दर्ज करें:
                </label>
                <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-bold border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setBuyerRequestedUnit('QUINTAL')}
                    className={`px-2.5 py-0.5 rounded transition ${
                      buyerRequestedUnit === 'QUINTAL' ? 'bg-emerald-800 text-amber-300 shadow' : 'text-slate-600'
                    }`}
                  >
                    क्विंटल (Quintal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBuyerRequestedUnit('KG')}
                    className={`px-2.5 py-0.5 rounded transition ${
                      buyerRequestedUnit === 'KG' ? 'bg-emerald-800 text-amber-300 shadow' : 'text-slate-600'
                    }`}
                  >
                    किलो (Kg)
                  </button>
                </div>
              </div>
              <input
                type="number"
                min="0.1"
                step="1"
                value={buyerRequestedQuantity}
                onChange={(e) => setBuyerRequestedQuantity(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
              <span className="text-slate-500 text-[11px] block text-right">
                किसान उपलब्ध: {selectedDealListing.displayQuantity || selectedDealListing.quantityQuintals} {selectedDealListing.unit === 'KG' ? 'Kg' : 'क्विंटल'}
              </span>
            </div>

            {/* Requested Delivery Date Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                अपेक्षित डिलीवरी तारीख चुनें (Expected Delivery Date):
              </label>
              <input
                type="date"
                value={buyerRequestedDate}
                onChange={(e) => setBuyerRequestedDate(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* Calculated Total Deal Value */}
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-500 font-bold block">कुल अनुमानित सौदा मूल्य:</span>
                <span className="text-slate-600 font-semibold">
                  {buyerRequestedQuantity || 0} {buyerRequestedUnit === 'KG' ? 'Kg' : 'क्विंटल'} × ₹{selectedDealListing.pricePerQuintal}/क्विंटल
                </span>
              </div>
              <span className="text-xl font-black text-emerald-800">
                ₹{Math.round(
                  buyerRequestedUnit === 'KG'
                    ? ((parseFloat(buyerRequestedQuantity || 0) / 100.0) * (selectedDealListing.pricePerQuintal || 0))
                    : (parseFloat(buyerRequestedQuantity || 0) * (selectedDealListing.pricePerQuintal || 0))
                ).toLocaleString()}
              </span>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDealListing(null)}
                className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleConfirmDealRequest}
                disabled={submittingDeal}
                className="flex-2 py-3 px-6 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold text-xs rounded-xl shadow"
              >
                {submittingDeal ? 'अनुरोध भेजा जा रहा है...' : 'सौदा का अनुरोध भेजें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEMO PAYMENT MODAL (CARD & UPI) */}
      {payModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 my-auto">
            
            {/* Fixed Modal Header */}
            <div className="flex-shrink-0 bg-emerald-950 text-white p-4 sm:p-5 flex justify-between items-center border-b border-emerald-800">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-400 text-emerald-950 p-2.5 rounded-2xl shadow">
                  <CreditCard className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-amber-300">
                    Moolya सुरक्षित पेमेंट गेटवे (Demo)
                  </h3>
                  <p className="text-xs text-emerald-200">
                    किसान {payModalOrder.farmerName} को सीधी ऑनलाइन भुगतान राशि
                  </p>
                </div>
              </div>
              <button onClick={() => setPayModalOrder(null)} className="text-emerald-300 hover:text-white text-lg font-bold p-1">
                ✕
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
              
              {/* Summary Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold block">ऑर्डर विवरण</span>
                  <h4 className="text-base font-extrabold text-slate-800">{payModalOrder.cropName} - {payModalOrder.quantityQuintals} क्विंटल</h4>
                  <span className="text-xs text-slate-500">किसान: {payModalOrder.farmerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase font-bold block">भुगतान कुल राशि</span>
                  <span className="text-2xl font-black text-emerald-700">₹{payModalOrder.totalAmount}</span>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase block">भुगतान माध्यम चुनें (Select Payment Method):</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayMethod('UPI')}
                    className={`py-3 px-4 rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 border transition ${
                      payMethod === 'UPI' ? 'bg-emerald-800 text-amber-300 border-emerald-800 shadow' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>📱 UPI (GPay / PhonePe / BHIM)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMethod('CARD')}
                    className={`py-3 px-4 rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 border transition ${
                      payMethod === 'CARD' ? 'bg-emerald-800 text-amber-300 border-emerald-800 shadow' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>💳 Debit / Credit Card</span>
                  </button>
                </div>
              </div>

              {/* UPI Form */}
              {payMethod === 'UPI' && (
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">आपकी UPI ID दर्ज करें:</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="buyer@upi or 9876543210@paytm"
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center space-x-2">
                    <QrCode className="w-8 h-8 text-emerald-700 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 block">डेमो क्यूआर कोड सक्रिय</span>
                      <span>एक-क्लिक डेमो पेमेंट बिना असली पैसों के तुरंत पूरा हो जाएगा।</span>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD Form */}
              {payMethod === 'CARD' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">कार्ड संख्या (Card Number):</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">एक्सपायरी (MM/YY):</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">CVV:</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">कार्डधारक का नाम (Cardholder Name):</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Fixed Sticky Footer - Always Visible Submit Payment Action */}
            <div className="flex-shrink-0 p-4 bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={paying}
                className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold text-base rounded-2xl shadow-xl transition flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-6 h-6 text-amber-300" />
                <span>{paying ? 'पेमेंट प्रोसेस हो रहा है...' : `पेमेंट पूरा करें (Pay ₹${payModalOrder.totalAmount} Demo)`}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Real-time Order Chat Modal for Buyer */}
      {activeChatOrder && (
        <OrderChatModal
          order={activeChatOrder}
          currentUser={user}
          onClose={() => setActiveChatOrder(null)}
        />
      )}

      {/* Admin Escalation Report Order Modal */}
      <ReportOrderModal
        isOpen={!!reportingOrder}
        onClose={() => setReportingOrder(null)}
        order={reportingOrder}
        user={user}
      />

    </div>
  );
};
