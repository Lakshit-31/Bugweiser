import React, { useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useLanguage } from '../context/LanguageContext';
import { speakText, createSpeechRecognizer } from '../services/voiceService';
import { Bell, Volume2, Mic, CheckCircle, XCircle, Calendar, X } from 'lucide-react';
import axios from 'axios';

export const RealtimeDealModal = () => {
  const { dealNotification, clearDealNotification } = useWebSocket();
  const { lang, t } = useLanguage();

  const [deliveryDate, setDeliveryDate] = useState('2026-04-15');
  const [isListening, setIsListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!dealNotification) return null;

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

        // Simple regex to parse numbers/dates if spoken
        speakText(`प्राप्त जवाब: ${transcript}`, 'hi');
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
        farmerVoiceNote: voiceNote
      });
      setSubmitting(false);

      if (accepted) {
        speakText(`डीज स्वीकार कर ली गई है। संभावित डिलीवरी: ${deliveryDate}`, 'hi');
      } else {
        speakText(`डीज अस्वीकार कर दी गई है।`, 'hi');
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
