import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useLanguage } from '../context/LanguageContext';
import { speakText, createSpeechRecognizer } from '../services/voiceService';
import { parseSpokenDate, parseSpokenReason, parseSpokenDateAndReason } from '../utils/voiceParser';
import { Bell, Volume2, Mic, CheckCircle, XCircle, Calendar, X, CloudRain, Truck, Wheat, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export const RealtimeDealModal = () => {
  const { dealNotification, clearDealNotification } = useWebSocket();
  const { lang, t } = useLanguage();

  const [deliveryDate, setDeliveryDate] = useState('');
  const [delayReason, setDelayReason] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (dealNotification?.type === 'PAYMENT_RECEIVED') {
      const speech = dealNotification.spokenHindiText || `आपको ${dealNotification.buyerName} से ₹${dealNotification.amount} का पूरा भुगतान प्राप्त हुआ है।`;
      speakText(speech, 'hi');
    } else if (dealNotification?.requestedDeliveryDate) {
      setDeliveryDate(dealNotification.requestedDeliveryDate);
    } else {
      setDeliveryDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }
  }, [dealNotification]);

  if (!dealNotification) return null;

  // Handle PAYMENT_RECEIVED Modal UI
  if (dealNotification.type === 'PAYMENT_RECEIVED') {
    const speechTextToPlay = dealNotification.spokenHindiText || `आपको ${dealNotification.buyerName} से ₹${dealNotification.amount} का पूरा भुगतान प्राप्त हुआ है।`;
    return (
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-emerald-500 animate-bounce-short space-y-4">
          <div className="bg-emerald-800 text-amber-300 p-5 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-400 text-emerald-950 p-2.5 rounded-2xl animate-pulse">
                <CheckCircle className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  🎉 पूरा भुगतान प्राप्त हुआ (Payment Received)
                </span>
                <h3 className="text-base font-extrabold text-white">
                  ₹{dealNotification.amount} का सफल पूरा भुगतान!
                </h3>
              </div>
            </div>
            <button onClick={clearDealNotification} className="text-amber-300 hover:text-amber-100 p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-5 space-y-3">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center space-y-1">
              <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider">वॉइस सूचना (Voice Announcement):</span>
              <p className="text-base font-black text-emerald-950">
                "{speechTextToPlay}"
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">खरीदार:</span>
                <span className="font-bold text-slate-800">{dealNotification.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">भुगतान माध्यम:</span>
                <span className="font-bold text-emerald-700">{dealNotification.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ट्रांजैक्शन आईडी:</span>
                <span className="font-mono text-slate-700 font-bold">{dealNotification.transactionId}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                <span className="font-bold text-slate-700">प्राप्त पूरा भुगतान:</span>
                <span className="font-black text-emerald-700 text-base">₹{dealNotification.amount}</span>
              </div>
            </div>

            <button
              onClick={() => speakText(speechTextToPlay, 'hi')}
              className="w-full py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>🔊 पूरा भुगतान ऑडियो फिर से सुनें (Replay Voice)</span>
            </button>

            <button
              onClick={clearDealNotification}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold rounded-2xl text-sm shadow transition"
            >
              समझ गया / ठीक है (Acknowledge)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSpeakAlertAgain = () => {
    if (dealNotification.spokenHindiText) {
      speakText(dealNotification.spokenHindiText, 'hi');
    }
  };

  const handleVoiceReply = () => {
    setIsListening(true);
    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsListening(false);
        setVoiceNote(transcript);

        const { date: detectedDate, reason: detectedReason } = parseSpokenDateAndReason(transcript);
        if (detectedDate) {
          setDeliveryDate(detectedDate);
        }
        if (detectedReason) {
          setDelayReason(detectedReason);
        }

        let feedback = `प्राप्त जवाब: ${transcript}।`;
        if (detectedReason) feedback += ` कारण: ${detectedReason}।`;
        if (detectedDate) feedback += ` संभावित डिलीवरी तारीख: ${detectedDate}।`;

        speakText(feedback, 'hi');
      },
      (err) => {
        setIsListening(false);
      },
      'hi'
    );

    if (recognizer) {
      recognizer.start();
    }
  };

  const handleRespond = async (accepted) => {
    setSubmitting(true);
    try {
      await axios.post('/api/v1/orders/deal-reply', {
        orderId: dealNotification.orderId,
        accepted,
        expectedDeliveryDate: accepted ? deliveryDate : null,
        delayReason: accepted ? delayReason : null,
        farmerVoiceNote: voiceNote
      });
      setSubmitting(false);

      if (accepted) {
        const reasonText = delayReason ? ` (कारण: ${delayReason})` : '';
        speakText(`डील स्वीकार कर ली गई है${reasonText}। संभावित डिलीवरी: ${deliveryDate}`, 'hi');
      } else {
        speakText(`डील अस्वीकार कर दी गई है।`, 'hi');
      }

      clearDealNotification();
    } catch (err) {
      setSubmitting(false);
      alert('प्रतिक्रिया भेजने में त्रुटि हुई।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-amber-400 animate-bounce-short">
        
        {/* Header Notification Banner */}
        <div className="bg-amber-500 text-emerald-950 p-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-900 text-amber-300 p-2.5 rounded-2xl animate-pulse">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                {t('incomingDealAlert')}
              </span>
              <h3 className="text-lg font-bold">
                {dealNotification.spokenHindiText}
              </h3>
            </div>
          </div>
          <button onClick={clearDealNotification} className="text-emerald-900 hover:text-emerald-950 p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          
          {/* TTS Audio Replay Button */}
          <button
            onClick={handleSpeakAlertAgain}
            className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 py-2 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm font-semibold border border-emerald-300 transition"
          >
            <Volume2 className="w-5 h-5 text-emerald-700" />
            <span>ऑडियो सूचना फिर से सुनें (Replay Hindi Audio Alert)</span>
          </button>

          {/* Deal Summary Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">खरीदार का नाम:</span>
              <span className="font-bold text-slate-800">{dealNotification.buyerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">मांगी गई फसल:</span>
              <span className="font-bold text-emerald-800">{dealNotification.cropName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">मात्रा (Quintals):</span>
              <span className="font-bold text-slate-800">{dealNotification.quantityQuintals} क्विंटल</span>
            </div>
            {dealNotification.requestedDeliveryDate && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">खरीदार पसंदीदा डिलीवरी तारीख:</span>
                <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {dealNotification.requestedDeliveryDate}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm border-t border-slate-200 pt-2">
              <span className="text-slate-600 font-semibold">कुल सौदा राशि:</span>
              <span className="font-extrabold text-emerald-700 text-base">₹{dealNotification.totalAmount}</span>
            </div>
          </div>

          {/* Delivery Date Selection & Voice Response */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              डिलीवरी / कटाई की तारीख तय करें:
            </label>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm font-semibold"
              />
            </div>

            {/* Optional Delay Reason Selection */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600 uppercase flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>यदि देरी की कोई वजह है तो चुनें (Optional Reason):</span>
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDelayReason('Heavy Rain / भारी बारिश')}
                  className={`p-2 rounded-xl font-bold border flex items-center space-x-1.5 transition ${
                    delayReason === 'Heavy Rain / भारी बारिश' 
                      ? 'bg-blue-600 text-white border-blue-700 shadow' 
                      : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <CloudRain className="w-4 h-4" />
                  <span>🌧️ भारी बारिश</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDelayReason('Transportation Problem / परिवहन समस्या')}
                  className={`p-2 rounded-xl font-bold border flex items-center space-x-1.5 transition ${
                    delayReason === 'Transportation Problem / परिवहन समस्या' 
                      ? 'bg-amber-600 text-white border-amber-700 shadow' 
                      : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>🚛 ट्रांसपोर्ट समस्या</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDelayReason('Harvesting Delay / फसल कटाई में समय')}
                  className={`p-2 rounded-xl font-bold border flex items-center space-x-1.5 transition ${
                    delayReason === 'Harvesting Delay / फसल कटाई में समय' 
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow' 
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <Wheat className="w-4 h-4" />
                  <span>🌾 कटाई देरी</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDelayReason('')}
                  className={`p-2 rounded-xl font-bold border flex items-center justify-center transition ${
                    !delayReason 
                      ? 'bg-slate-700 text-white border-slate-800' 
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>सामान्य (No Delay)</span>
                </button>
              </div>
            </div>

            {/* Voice Reply Mic Button */}
            <div className="pt-2">
              <button
                onClick={handleVoiceReply}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition border ${
                  isListening ? 'bg-red-500 text-white border-red-600 animate-pulse' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                <Mic className="w-4 h-4 text-emerald-800" />
                <span>{voiceNote ? `वॉइस रिकॉर्डेड: "${voiceNote}"` : t('speakReply')}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex space-x-3">
          <button
            onClick={() => handleRespond(false)}
            disabled={submitting}
            className="flex-1 py-3 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-2xl text-sm transition flex items-center justify-center space-x-1"
          >
            <XCircle className="w-4 h-4" />
            <span>{t('declineDeal')}</span>
          </button>
          
          <button
            onClick={() => handleRespond(true)}
            disabled={submitting}
            className="flex-2 py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold rounded-2xl text-sm transition shadow-lg flex items-center justify-center space-x-2 px-6"
          >
            <CheckCircle className="w-5 h-5 text-amber-300" />
            <span>{t('acceptDeal')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
