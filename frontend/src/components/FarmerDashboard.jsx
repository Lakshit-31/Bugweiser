import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { speakText, createSpeechRecognizer } from '../services/voiceService';
import { parseSpokenDate, parseSpokenReason, parseSpokenDateAndReason } from '../utils/voiceParser';
import { OrderChatModal } from './OrderChatModal';
import { ProduceImageGallery } from './ProduceImageGallery';
import { ReportOrderModal } from './ReportOrderModal';
import { Plus, Package, ShoppingCart, DollarSign, Award, Calendar, Phone, CheckCircle2, Clock, MapPin, Truck, Bell, Volume2, Mic, MicOff, XCircle, AlertCircle, Sparkles, Receipt, CreditCard, RotateCcw, Square, SkipForward, MessageSquare, CloudRain, Wheat, Trash2, ShieldAlert } from 'lucide-react';
import axios from 'axios';

export const FarmerDashboard = ({ onOpenVoiceListing }) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const { refreshKey, triggerRefresh } = useWebSocket();

  const [activeTab, setActiveTab] = useState('produce'); // 'produce', 'orders', 'earnings'
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [farmerTransactions, setFarmerTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deliveryDates, setDeliveryDates] = useState({});
  const [delayReasons, setDelayReasons] = useState({});
  const [listeningOrderId, setListeningOrderId] = useState(null);
  const [activeChatOrder, setActiveChatOrder] = useState(null);
  const [reportingOrder, setReportingOrder] = useState(null);

  // Interactive Multi-Order Voice Wizard State
  const [isVoiceWizardOpen, setIsVoiceWizardOpen] = useState(false);
  const [wizardIndex, setWizardIndex] = useState(0);
  const [isListeningWizard, setIsListeningWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState('QUESTION'); // 'QUESTION' or 'MORE_TIME_DATE'
  const [wizardCustomDate, setWizardCustomDate] = useState('');
  const [wizardDelayReason, setWizardDelayReason] = useState('');
  const [wizardStatusText, setWizardStatusText] = useState('');

  useEffect(() => {
    if (!user) {
      setListings([]);
      setOrders([]);
      setFarmerTransactions([]);
      return;
    }
    fetchFarmerData();

    // Auto-refresh interval fallback to keep dashboard updated without page reloads
    const interval = setInterval(() => {
      fetchFarmerData();
    }, 4000);

    return () => clearInterval(interval);
  }, [user, activeTab, refreshKey]);

  const fetchFarmerData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [listRes, ordRes, txnRes] = await Promise.all([
        axios.get(`/api/v1/produce/farmer/${user.id}`),
        axios.get(`/api/v1/orders/farmer-orders/${user.id}`),
        axios.get(`/api/v1/orders/transactions/farmer/${user.id}`).catch(() => ({ data: [] }))
      ]);
      setListings(listRes.data);
      setOrders(ordRes.data);
      setFarmerTransactions(txnRes.data || []);

      // Pre-fill default delivery dates for requested orders
      const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const initialDates = {};
      ordRes.data.forEach(o => {
        initialDates[o.id] = o.expectedDeliveryDate || o.requestedDeliveryDate || defaultDate;
      });
      setDeliveryDates(initialDates);
    } catch (err) {
      console.error('Error fetching farmer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId, cropName = 'Produce') => {
    if (!window.confirm(t('deleteListingConfirm', { crop: cropName }))) {
      return;
    }
    try {
      await axios.delete(`/api/v1/produce/${listingId}`);
      speakText(`${cropName} -> ${t('deleteListingBtn')}`, lang);
      triggerRefresh();
      fetchFarmerData();
    } catch (err) {
      alert(t('errorOccurred'));
    }
  };

  const calculateTotalEarnings = () => {
    return orders
      .filter(o => o.status === 'ACCEPTED' || o.status === 'DELIVERED')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  };

  const handleDealReply = async (orderId, accepted, customDate = null, reasonParam = null) => {
    try {
      const targetDate = customDate || deliveryDates[orderId] || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const targetReason = reasonParam || delayReasons[orderId] || null;
      await axios.post('/api/v1/orders/deal-reply', {
        orderId,
        accepted,
        expectedDeliveryDate: accepted ? targetDate : null,
        delayReason: accepted ? targetReason : null,
        farmerVoiceNote: accepted ? 'Accepted via Farmer Dashboard' : 'Declined via Farmer Dashboard'
      });

      if (accepted) {
        speakText(`${t('acceptOrderBtn')}: ${targetDate}`, lang);
      } else {
        speakText(`${t('cancelOrderBtn')}`, lang);
      }

      triggerRefresh();
      fetchFarmerData();
    } catch (err) {
      alert(err.response?.data?.message || t('errorOccurred'));
    }
  };

  const handleReadAllPendingOrders = () => {
    handleStartVoiceWizard();
  };

  // INTERACTIVE SEQUENTIAL MULTI-ORDER VOICE ASSISTANT WIZARD
  const handleStartVoiceWizard = () => {
    const pendingList = orders.filter(o => o.status === 'REQUESTED');
    if (pendingList.length === 0) {
      speakText(t('noActiveOrders'), lang);
      return;
    }
    setIsVoiceWizardOpen(true);
    setWizardIndex(0);
    setWizardStep('QUESTION');
    processWizardStep(0, pendingList);
  };

  const processWizardStep = (index, queue = null) => {
    const pendingList = queue || orders.filter(o => o.status === 'REQUESTED');
    if (index >= pendingList.length) {
      speakText(t('success'), lang);
      setIsVoiceWizardOpen(false);
      setIsListeningWizard(false);
      triggerRefresh();
      fetchFarmerData();
      return;
    }

    setWizardIndex(index);
    setWizardStep('QUESTION');
    const ord = pendingList[index];
    const defaultTargetDate = ord.requestedDeliveryDate || ord.expectedDeliveryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setWizardCustomDate(defaultTargetDate);

    const displayQty = ord.displayQuantity || ord.quantityQuintals;
    const unitStr = ord.unit === 'KG' ? t('kgUnit') : t('quintalUnit');
    const promptText = `Order ${index + 1}: ${ord.buyerName} - ${displayQty} ${unitStr} ${ord.cropName}. ₹${ord.totalAmount}. Date: ${defaultTargetDate}.`;
    setWizardStatusText(promptText);

    speakText(promptText, lang, () => {
      startWizardSpeechRecognition(ord, index, pendingList);
    });
  };

  const startWizardSpeechRecognition = (ord, index, queue) => {
    setIsListeningWizard(true);
    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsListeningWizard(false);
        const lower = transcript.toLowerCase();

        const isMoreTime = lower.includes('more time') || lower.includes('और समय') || lower.includes('समय चाहिए') || lower.includes('ਸਮਾਂ') || lower.includes('वेळ') || lower.includes('સમય') || lower.includes('நேரம்') || lower.includes('3');
        const isDecline = lower.includes('cancel') || lower.includes('decline') || lower.includes('रद्द') || lower.includes('ਰੱਦ') || lower.includes('नाही') || lower.includes('ரத்து') || lower.includes('no');
        const isOption2 = lower.includes('agree') || lower.includes('सहमत') || lower.includes('ਸਹਿਮਤ') || lower.includes('સંમત') || lower.includes('ஒப்பு') || lower.includes('2');

        if (isMoreTime) {
          setWizardStep('MORE_TIME_DATE');
          const timePrompt = t('selectDeliveryDateLabel');
          setWizardStatusText(timePrompt);
          speakText(timePrompt, lang, () => {
            startCustomDateSpeechRecognition(ord, index, queue);
          });
        } else if (isDecline) {
          handleDealReply(ord.id, false);
          speakText(`Order ${index + 1} -> ${t('cancelOrderBtn')}`, lang, () => {
            processWizardStep(index + 1, queue);
          });
        } else if (isOption2) {
          const targetDate = ord.requestedDeliveryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          handleDealReply(ord.id, true, targetDate);
          speakText(`Order ${index + 1} -> ${t('presetVoiceOpt2')}`, lang, () => {
            processWizardStep(index + 1, queue);
          });
        } else {
          // Default to Option 1
          const targetDate = ord.requestedDeliveryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          handleDealReply(ord.id, true, targetDate);
          speakText(`Order ${index + 1} -> ${t('presetVoiceOpt1')}`, lang, () => {
            processWizardStep(index + 1, queue);
          });
        }
      },
      () => {
        setIsListeningWizard(false);
      },
      lang
    );

    if (recognizer) recognizer.start();
  };

  const startCustomDateSpeechRecognition = (ord, index, queue) => {
    setIsListeningWizard(true);
    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsListeningWizard(false);
        const parsed = parseSpokenDate(transcript);
        const finalDate = parsed || wizardCustomDate;
        setWizardCustomDate(finalDate);

        handleDealReply(ord.id, true, finalDate);
        speakText(`${t('scheduledDeliveryDateLabel', { date: finalDate })}`, lang, () => {
          processWizardStep(index + 1, queue);
        });
      },
      () => {
        setIsListeningWizard(false);
      },
      lang
    );

    if (recognizer) recognizer.start();
  };

  const handleWizardSelectOption = (optNumber) => {
    const pendingList = orders.filter(o => o.status === 'REQUESTED');
    if (wizardIndex >= pendingList.length) return;
    const ord = pendingList[wizardIndex];

    if (optNumber === 1 || optNumber === 2) {
      const msg = optNumber === 1 ? t('presetVoiceOpt1') : t('presetVoiceOpt2');
      const targetDate = ord.requestedDeliveryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      handleDealReply(ord.id, true, targetDate);
      speakText(`${msg}`, lang, () => {
        processWizardStep(wizardIndex + 1, pendingList);
      });
    } else if (optNumber === 3) {
      setWizardStep('MORE_TIME_DATE');
      const timePrompt = t('selectDeliveryDateLabel');
      setWizardStatusText(timePrompt);
      speakText(timePrompt, lang);
    }
  };

  const handleWizardSubmitCustomDate = (customDateVal) => {
    const pendingList = orders.filter(o => o.status === 'REQUESTED');
    if (wizardIndex >= pendingList.length) return;
    const ord = pendingList[wizardIndex];

    const targetDate = customDateVal || wizardCustomDate;
    handleDealReply(ord.id, true, targetDate);
    speakText(`${t('scheduledDeliveryDateLabel', { date: targetDate })}`, lang, () => {
      processWizardStep(wizardIndex + 1, pendingList);
    });
  };

  const handleListenAgainWizard = () => {
    processWizardStep(wizardIndex);
  };

  const handleStopVoiceWizard = () => {
    speakText(t('stopVoiceAssistantBtn'), lang);
    setIsVoiceWizardOpen(false);
    setIsListeningWizard(false);
  };

  const handleSpeakSingleOrderDetails = (order) => {
    const displayQty = order.displayQuantity || order.quantityQuintals;
    const unitStr = order.unit === 'KG' ? t('kgUnit') : t('quintalUnit');
    const text = `${order.buyerName}: ${displayQty} ${unitStr} ${order.cropName}. ₹${order.totalAmount}. Date: ${order.requestedDeliveryDate || ''}`;
    speakText(text, lang);
  };

  const handleVoiceRespondPendingOrder = (order) => {
    setListeningOrderId(order.id);
    speakText(t('presetVoiceOptionsTitle'), lang, () => {
      const recognizer = createSpeechRecognizer(
        (transcript) => {
          setListeningOrderId(null);
          const lower = transcript.toLowerCase();
          const isDecline = lower.includes('cancel') || lower.includes('decline') || lower.includes('रद्द') || lower.includes('ਮਨਾ') || lower.includes('नाही') || lower.includes('ரத்து');
          
          if (isDecline) {
            handleDealReply(order.id, false);
          } else {
            const targetDate = deliveryDates[order.id] || order.requestedDeliveryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            speakText(`${t('voiceRecordedAck', { text: transcript })}`, lang);
            handleDealReply(order.id, true, targetDate);
          }
        },
        () => {
          setListeningOrderId(null);
        },
        lang
      );

      if (recognizer) recognizer.start();
    });
  };

  const handleSpeakDailyReminder = (order) => {
    const displayQty = order.displayQuantity || order.quantityQuintals;
    const unitStr = order.unit === 'KG' ? t('kgUnit') : t('quintalUnit');
    const text = t('dailyNoticeText', {
      date: order.expectedDeliveryDate || '',
      buyer: order.buyerName,
      qty: displayQty,
      unit: unitStr,
      crop: order.cropName
    });
    speakText(text, lang);
  };

  const pendingOrders = orders.filter(o => o.status === 'REQUESTED');
  const acceptedOrders = orders.filter(o => o.status === 'ACCEPTED');

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
            {t('farmerGreeting', { name: user?.fullName || t('farmerRole') })}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            {t('farmerTagline')}
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

      {/* REAL-TIME NEW ORDER NOTIFICATION BANNER */}
      {pendingOrders.length > 0 && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-emerald-950 p-5 rounded-3xl shadow-xl border-2 border-amber-300 space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-950 text-amber-300 p-2.5 rounded-2xl shadow">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-emerald-950 tracking-wider">
                  {t('newOrderNotificationTitle', { count: pendingOrders.length })}
                </span>
                <h3 className="text-base sm:text-lg font-black text-emerald-950">
                  {t('newOrderNotificationMsg', {
                    buyer: pendingOrders[0].buyerName,
                    qty: pendingOrders[0].displayQuantity || pendingOrders[0].quantityQuintals,
                    unit: pendingOrders[0].unit === 'KG' ? t('kgUnit') : t('quintalUnit'),
                    crop: pendingOrders[0].cropName
                  })}
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <button
                type="button"
                onClick={handleReadAllPendingOrders}
                className="bg-emerald-950 hover:bg-emerald-900 text-amber-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow transition"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>{t('listenAllPendingOrders', { count: pendingOrders.length })}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSpeakSingleOrderDetails(pendingOrders[0])}
                className="bg-emerald-900/80 hover:bg-emerald-950 text-amber-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 shadow transition"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t('listenThisOrder')}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-1 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleVoiceRespondPendingOrder(pendingOrders[0])}
              className={`px-5 py-2.5 ${listeningOrderId === pendingOrders[0].id ? 'bg-red-600 animate-pulse text-white' : 'bg-emerald-950 hover:bg-emerald-900 text-amber-300'} font-extrabold text-xs rounded-xl shadow flex items-center space-x-2 border border-amber-300/40 transition`}
            >
              <Mic className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{listeningOrderId === pendingOrders[0].id ? t('voiceListeningState') : t('voiceReplyBtn')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleDealReply(pendingOrders[0].id, true)}
              className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-extrabold text-xs rounded-xl shadow flex items-center space-x-1.5 border border-amber-300/40 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t('acceptOrderBtn')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleDealReply(pendingOrders[0].id, false)}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center space-x-1.5 transition"
            >
              <XCircle className="w-4 h-4" />
              <span>{t('cancelOrderBtn')}</span>
            </button>
          </div>
        </div>
      )}

      {/* DAILY SUPPLY REMINDER SECTION (For Accepted Orders) */}
      {acceptedOrders.length > 0 && (
        <div className="bg-emerald-950 text-white p-6 rounded-3xl shadow-xl border border-emerald-800 space-y-4">
          <div className="flex justify-between items-center border-b border-emerald-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-400 text-emerald-950 p-2.5 rounded-2xl shadow">
                <Truck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-amber-300">
                  {t('dailySupplyRemindersTitle')}
                </h3>
                <p className="text-xs text-emerald-200">
                  {t('dailySupplyRemindersSub')}
                </p>
              </div>
            </div>
            <span className="bg-amber-400 text-emerald-950 text-xs font-black px-3 py-1 rounded-full shadow">
              {t('activeSupplyTasks', { count: acceptedOrders.length })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acceptedOrders.map(ord => (
              <div key={ord.id} className="bg-emerald-900/90 border border-emerald-700 p-4 rounded-2xl space-y-3 shadow-inner">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-amber-400 tracking-wider">
                      {t('expectedDeliveryDateLabel', { date: ord.expectedDeliveryDate || '2026-09-22' })}
                    </span>
                    <h4 className="text-base font-black text-white">{ord.cropName} - {ord.quantityQuintals} {t('quintalUnit')}</h4>
                    <p className="text-xs text-emerald-200">{t('buyerInfo', { name: ord.buyerName, phone: ord.buyerPhone })}</p>
                  </div>
                  <span className="text-base font-black text-amber-300">₹{ord.totalAmount}</span>
                </div>

                <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800 text-xs text-emerald-100 flex items-start space-x-2">
                  <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">{t('dailyNoticeTitle')}</span>
                    <p className="mt-0.5">
                      {t('dailyNoticeText', {
                        date: ord.expectedDeliveryDate || 'Scheduled Date',
                        buyer: ord.buyerName,
                        qty: ord.quantityQuintals,
                        unit: t('quintalUnit'),
                        crop: ord.cropName
                      })}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSpeakDailyReminder(ord)}
                  className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{t('listenDailyReminderBtn')}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('produce')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-sm transition ${
            activeTab === 'produce' ? 'bg-emerald-800 text-amber-300 shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t('tabMyProduce', { count: listings.length })}</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-sm transition ${
            activeTab === 'orders' ? 'bg-emerald-800 text-amber-300 shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{t('tabActiveOrders', { count: orders.length })}</span>
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-sm transition ${
            activeTab === 'earnings' ? 'bg-emerald-800 text-amber-300 shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{t('tabTransactions')}</span>
        </button>
      </div>

      {/* TAB 1: PRODUCE LIST */}
      {activeTab === 'produce' && (
        <div>
          {listings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <Package className="w-16 h-16 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-700">{t('noProduceListed')}</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                {t('noProduceListedDesc')}
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
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition p-4 space-y-3">
                  
                  {/* Multi-Picture Interactive Carousel & Gallery */}
                  <ProduceImageGallery
                    imageUrls={item.imageUrls}
                    cropName={item.cropName}
                    gradeBadge={
                      <div className={`px-3 py-1 rounded-full text-xs font-black text-white shadow-md ${
                        item.assignedGrade === 'GRADE_A' ? 'bg-emerald-600' :
                        item.assignedGrade === 'GRADE_B' ? 'bg-amber-500' : 'bg-red-500'
                      }`}>
                        {item.assignedGrade === 'GRADE_A' ? t('gradeA') :
                         item.assignedGrade === 'GRADE_B' ? t('gradeB') : t('gradeC')}
                      </div>
                    }
                  />

                  {/* Info Body */}
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{item.cropName}</h3>
                        <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.location?.district}, {item.location?.state}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">{t('expectedPrice')}</span>
                        <p className="text-lg font-black text-emerald-700">₹{item.pricePerQuintal}/{t('quintalUnit')}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{t('availableQuantity')}</span>
                        <span className="font-bold text-slate-700">{item.displayQuantity || item.quantityQuintals} {item.unit === 'KG' ? t('kgUnit') : t('quintalUnit')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{t('pesticidesUsed')}</span>
                        <span className="font-semibold text-slate-700">{item.pesticidesUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{t('harvestDate')}</span>
                        <span className="font-semibold text-slate-700">{item.harvestDate}</span>
                      </div>
                    </div>

                    {/* Delete Produce Listing Action */}
                    <button
                      type="button"
                      onClick={() => handleDeleteListing(item.id, item.cropName)}
                      className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs rounded-xl border border-red-200 shadow-sm transition flex items-center justify-center space-x-1.5"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                      <span>{t('deleteListingBtn')}</span>
                    </button>
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
          {pendingOrders.length > 0 && (
            <div className="bg-amber-100 border border-amber-300 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <span className="text-xs sm:text-sm font-bold text-amber-950">
                  {t('pendingOrdersBannerText', { count: pendingOrders.length })}
                </span>
              </div>
              <button
                type="button"
                onClick={handleReadAllPendingOrders}
                className="bg-emerald-800 hover:bg-emerald-900 text-amber-300 px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow transition shrink-0"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>{t('listenAllPendingOrders', { count: pendingOrders.length })}</span>
              </button>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">{t('noActiveOrders')}</h3>
            </div>
          ) : (
            orders.map(ord => (
              <div key={ord.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        ord.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        ord.status === 'REQUESTED' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-red-100 text-red-800'
                      }`}>
                        {ord.status === 'REQUESTED' ? t('pendingRequestBadge') : ord.status}
                      </span>
                      <span className="text-xs text-slate-400">{t('orderIdLabel', { id: ord.id?.substring(0, 8) })}</span>
                    </div>

                    <h4 className="text-xl font-extrabold text-slate-800">
                      {ord.cropName} - {ord.displayQuantity || ord.quantityQuintals} {ord.unit === 'KG' ? t('kgUnit') : t('quintalUnit')}
                    </h4>

                    {/* Phrasing & Requested Date Display */}
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 inline-block">
                        📢 {ord.buyerName} - {ord.displayQuantity || ord.quantityQuintals} {ord.unit === 'KG' ? t('kgUnit') : t('quintalUnit')} {ord.cropName}
                      </p>
                      {ord.requestedDeliveryDate && (
                        <p className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 inline-block ml-2">
                          {t('buyerRequestedDateLabel', { date: ord.requestedDeliveryDate })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-xs text-slate-400 block">{t('totalAmountLabel')}</span>
                    <p className="text-2xl font-black text-emerald-700">₹{ord.totalAmount}</p>
                    <button
                      type="button"
                      onClick={() => setReportingOrder(ord)}
                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-xl transition"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{t('reportIssueBtn')}</span>
                    </button>
                  </div>
                </div>

                {/* If REQUESTED -> ACCEPT / CANCEL / VOICE RESPOND BUTTONS */}
                {ord.status === 'REQUESTED' && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                    {/* Voice Actions Bar */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSpeakSingleOrderDetails(ord)}
                          className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition border border-emerald-300"
                        >
                          <Volume2 className="w-4 h-4 text-emerald-800" />
                          <span>{t('listenThisOrder')}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleVoiceRespondPendingOrder(ord)}
                          className={`px-4 py-2 ${listeningOrderId === ord.id ? 'bg-red-600 animate-pulse text-white' : 'bg-emerald-800 hover:bg-emerald-900 text-amber-300'} font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow transition`}
                        >
                          <Mic className="w-4 h-4 text-amber-300" />
                          <span>{listeningOrderId === ord.id ? t('voiceListeningState') : t('voiceReplyBtn')}</span>
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 font-medium">
                        {t('voiceReplyBtn')}
                      </div>
                    </div>

                    {/* Preset Voice Response Quick Buttons */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        {t('presetVoiceOptionsTitle')}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            speakText(t('presetVoiceOpt1'), lang);
                            handleDealReply(ord.id, true);
                          }}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-xl transition flex items-center space-x-1"
                        >
                          <span>{t('presetVoiceOpt1')}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            speakText(t('presetVoiceOpt2'), lang);
                            handleDealReply(ord.id, true);
                          }}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold rounded-xl transition flex items-center space-x-1"
                        >
                          <span>{t('presetVoiceOpt2')}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            speakText(t('presetVoiceOpt3'), lang);
                            handleDealReply(ord.id, false);
                          }}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 text-xs font-bold rounded-xl transition flex items-center space-x-1"
                        >
                          <span>{t('presetVoiceOpt3')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Estimated Delivery Date input & buttons */}
                    <div className="flex items-center space-x-3 pt-2 border-t border-slate-200">
                      <label className="text-xs font-bold text-slate-700 flex-shrink-0">
                        {t('selectDeliveryDateLabel')}
                      </label>
                      <input
                        type="date"
                        value={deliveryDates[ord.id] || ''}
                        onChange={(e) => setDeliveryDates(prev => ({ ...prev, [ord.id]: e.target.value }))}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="flex space-x-3 pt-1">
                      <button
                        type="button"
                        onClick={() => handleDealReply(ord.id, true)}
                        className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold text-xs rounded-xl shadow flex items-center space-x-1.5 transition"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-300" />
                        <span>{t('acceptOrderBtn')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDealReply(ord.id, false)}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center space-x-1.5 transition"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{t('cancelOrderBtn')}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* If ACCEPTED -> Daily Reminder, Payment Status & Details */}
                {ord.status === 'ACCEPTED' && (
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex flex-col space-y-3">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-emerald-800" />
                          <span className="text-xs font-bold text-emerald-900">
                            {t('scheduledDeliveryDateLabel', { date: ord.expectedDeliveryDate || '2026-09-22' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {t('dailyNoticeText', {
                            date: ord.expectedDeliveryDate || 'Scheduled Date',
                            buyer: ord.buyerName,
                            qty: ord.quantityQuintals,
                            unit: t('quintalUnit'),
                            crop: ord.cropName
                          })}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSpeakDailyReminder(ord)}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow transition shrink-0"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>{t('listenDailyReminderBtn')}</span>
                      </button>
                    </div>

                    {/* Payment Status Banner & Chat Button for Farmer */}
                    <div className="pt-2 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-700">{t('paymentStatusLabel')}</span>
                        {ord.paymentStatus === 'PAID' ? (
                          <span className="bg-emerald-700 text-white font-extrabold px-3 py-1 rounded-full shadow flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                            <span>{t('paymentReceivedBadge', { method: ord.paymentMethod, txn: ord.paymentTransactionId })}</span>
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-950 border border-amber-300 font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>{t('paymentPendingBadge')}</span>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveChatOrder(ord)}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold rounded-xl shadow flex items-center space-x-1.5 transition text-xs"
                      >
                        <MessageSquare className="w-4 h-4 text-amber-400" />
                        <span>{t('chatWithBuyerBtn')}</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: EARNINGS & TRANSACTIONS */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">{t('totalApprovedSales')}</span>
              <p className="text-3xl font-extrabold text-emerald-700">₹{calculateTotalEarnings()}</p>
              <p className="text-xs text-slate-500">{t('transferableToBank')}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">{t('estSavingsTransport')}</span>
              <p className="text-3xl font-extrabold text-amber-600">₹{Math.round(calculateTotalEarnings() * 0.045)}</p>
              <p className="text-xs text-slate-500">{t('savedByDirectMatch')}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">{t('farmerTrustScoreTitle')}</span>
              <p className="text-3xl font-extrabold text-blue-600">95 / 100</p>
              <p className="text-xs text-slate-500">{t('trustScoreDesc')}</p>
            </div>
          </div>

          {/* Farmer Transaction History Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Receipt className="w-5 h-5 text-emerald-700" />
                  <span>{t('farmerPaymentHistoryTitle')}</span>
                </h3>
                <p className="text-xs text-slate-500">{t('farmerPaymentHistorySub')}</p>
              </div>
              <span className="bg-emerald-100 text-emerald-900 font-black text-xs px-3 py-1 rounded-full border border-emerald-300">
                {t('totalTransactionsCount', { count: farmerTransactions.length })}
              </span>
            </div>

            {farmerTransactions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-semibold">
                {t('noTransactionsYet')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {farmerTransactions.map(txn => (
                  <div key={txn.id} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 space-y-2 text-xs">
                    <div className="flex justify-between items-start border-b border-emerald-200 pb-2">
                      <div>
                        <span className="bg-emerald-700 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          {txn.status || 'SUCCESSFUL'} ({txn.paymentMethod})
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900 mt-1">{txn.cropName} - {txn.quantityQuintals} {t('quintalUnit')}</h4>
                      </div>
                      <span className="text-lg font-black text-emerald-800">₹{txn.amount}</span>
                    </div>

                    <div className="space-y-1 text-slate-600">
                      <div className="flex justify-between">
                        <span>{t('buyerNameLabel')}</span>
                        <span className="font-bold text-slate-800">{txn.buyerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('transactionIdLabel')}</span>
                        <span className="font-mono text-slate-800 font-semibold">{txn.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('dateTimeLabel')}</span>
                        <span className="font-semibold text-slate-700">{txn.createdAt?.replace('T', ' ')?.substring(0, 19)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* INTERACTIVE SEQUENTIAL VOICE ASSISTANT MODAL */}
      {isVoiceWizardOpen && pendingOrders[wizardIndex] && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border-4 border-amber-400 animate-bounce-short space-y-4">
            
            {/* Header Toolbar */}
            <div className="bg-emerald-950 text-white p-5 flex justify-between items-center border-b border-emerald-800">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-400 text-emerald-950 p-2.5 rounded-2xl shadow animate-pulse">
                  <Mic className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                      {wizardIndex + 1} / {pendingOrders.length}
                    </span>
                    {isListeningWizard && (
                      <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">
                        🎙️ {t('voiceListeningState')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-amber-300 mt-0.5">
                    {t('voiceWizardTitle')}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStopVoiceWizard}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl text-xs font-bold flex items-center space-x-1 shadow"
                title="Stop Voice Assistant"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>{t('stopVoiceAssistantBtn')}</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">

              {/* Order Card Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-emerald-900 font-extrabold text-sm block">
                      {pendingOrders[wizardIndex].cropName} - {pendingOrders[wizardIndex].quantityQuintals} {t('quintalUnit')}
                    </span>
                    <span className="text-slate-500">
                      {t('buyerInfo', { name: pendingOrders[wizardIndex].buyerName, phone: pendingOrders[wizardIndex].buyerPhone })}
                    </span>
                  </div>
                  <span className="text-base font-black text-emerald-700">₹{pendingOrders[wizardIndex].totalAmount}</span>
                </div>

                <div className="bg-emerald-100/80 p-2.5 rounded-xl border border-emerald-300 text-emerald-950 font-bold flex justify-between items-center">
                  <span>{t('buyerRequestedDateLabel', { date: '' })}</span>
                  <span className="text-sm font-black">{pendingOrders[wizardIndex].requestedDeliveryDate || 'Scheduled Date'}</span>
                </div>
              </div>

              {/* Speech Question Display Box */}
              <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl space-y-1">
                <span className="text-[11px] font-black uppercase text-amber-800 tracking-wider block">
                  📢 {t('voiceAssistantTitle')}:
                </span>
                <p className="text-sm font-bold text-slate-900 leading-snug">
                  "{wizardStatusText}"
                </p>
              </div>

              {/* STEP 1: QUESTION -> 3 VOICE RESPONSE OPTIONS */}
              {wizardStep === 'QUESTION' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase block">
                    {t('presetVoiceOptionsTitle')}
                  </span>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleWizardSelectOption(1)}
                      className="w-full p-3.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold text-xs rounded-2xl shadow transition text-left flex items-center justify-between border border-amber-300"
                    >
                      <span>1. {t('presetVoiceOpt1')}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleWizardSelectOption(2)}
                      className="w-full p-3.5 bg-emerald-900 hover:bg-emerald-950 text-amber-200 font-extrabold text-xs rounded-2xl shadow transition text-left flex items-center justify-between border border-emerald-700"
                    >
                      <span>2. {t('presetVoiceOpt2')}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleWizardSelectOption(3)}
                      className="w-full p-3.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs rounded-2xl shadow transition text-left flex items-center justify-between border border-amber-300"
                    >
                      <span>3. {t('presetVoiceOpt3')}</span>
                      <Clock className="w-4 h-4 text-emerald-950" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: ASK NEW DELIVERY DATE (FOR OPTION 3) */}
              {wizardStep === 'MORE_TIME_DATE' && (
                <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-400 space-y-3">
                  <label className="block text-xs font-bold text-amber-950 uppercase">
                    {t('selectDeliveryDateLabel')}
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-emerald-800" />
                    <input
                      type="date"
                      value={wizardCustomDate}
                      onChange={(e) => setWizardCustomDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleWizardSubmitCustomDate(wizardCustomDate)}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>{t('scheduledDeliveryDateLabel', { date: wizardCustomDate })}</span>
                  </button>
                </div>
              )}

              {/* Wizard Control Actions Toolbar */}
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleListenAgainWizard}
                  className="flex-1 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 border border-emerald-300 transition"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-800" />
                  <span>{t('listenAgainBtn')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => processWizardStep(wizardIndex + 1)}
                  className="py-2.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl flex items-center space-x-1 transition"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>{t('nextStepBtn')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleStopVoiceWizard}
                  className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1 transition"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>{t('stopVoiceAssistantBtn')}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Real-time Order Chat Modal */}
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
