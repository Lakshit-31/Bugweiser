import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useLanguage } from '../context/LanguageContext';
import { speakText, createSpeechRecognizer } from '../services/voiceService';
import { Send, Mic, Volume2, X, MessageSquare, Sparkles, User, Calendar, CloudRain, Truck, Wheat } from 'lucide-react';
import axios from 'axios';

export const OrderChatModal = ({ order, currentUser, onClose }) => {
  const { stompClient } = useWebSocket();
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatBottomRef = useRef(null);

  const isFarmer = currentUser?.role === 'ROLE_FARMER';
  const otherPartyName = isFarmer ? order.buyerName : order.farmerName;
  const otherPartyRole = isFarmer ? t('buyerRole') : t('farmerRole');

  useEffect(() => {
    fetchChatHistory();
  }, [order.id]);

  useEffect(() => {
    if (!stompClient || !order.id) return;

    // Subscribe to order chat WebSocket topic for instant messaging updates
    const subscription = stompClient.subscribe(`/topic/order-chat/${order.id}`, (message) => {
      try {
        const newMsg = JSON.parse(message.body);
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });

        // Automatically speak incoming chat message aloud if sent by other party
        if (newMsg.senderId !== currentUser?.id) {
          speakText(`${newMsg.senderName}: ${newMsg.message}`, lang);
        }
      } catch (err) {
        console.error('Error parsing chat websocket message:', err);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, order.id, currentUser?.id, lang]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/orders/${order.id}/chat`);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (textToSend = null) => {
    const msgText = textToSend || inputText;
    if (!msgText || !msgText.trim()) return;

    const payload = {
      orderId: order.id,
      senderId: currentUser.id,
      senderName: currentUser.fullName || (isFarmer ? order.farmerName : order.buyerName),
      senderRole: currentUser.role,
      receiverId: isFarmer ? order.buyerId : order.farmerId,
      receiverName: otherPartyName,
      message: msgText.trim()
    };

    try {
      setInputText('');
      const res = await axios.post(`/api/v1/orders/${order.id}/chat`, payload);
      const savedMsg = res.data;
      setMessages((prev) => {
        if (prev.some((m) => m.id === savedMsg.id)) return prev;
        return [...prev, savedMsg];
      });
    } catch (err) {
      alert('Error sending message.');
    }
  };

  const handleMicClick = () => {
    setIsListening(true);
    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsListening(false);
        setInputText(transcript);
        speakText(transcript, lang);
      },
      (err) => {
        setIsListening(false);
      },
      lang
    );

    if (recognizer) recognizer.start();
  };

  const handleQuickPillClick = (presetMsg) => {
    setInputText(presetMsg);
    handleSendMessage(presetMsg);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full h-[88vh] flex flex-col overflow-hidden border-2 border-emerald-500">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-4 flex justify-between items-center border-b border-emerald-700">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-400 text-emerald-950 p-2.5 rounded-2xl">
              <MessageSquare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <span>{otherPartyName}</span>
                <span className="text-xs font-normal text-amber-300 bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-700">
                  {otherPartyRole}
                </span>
              </h3>
              <p className="text-xs text-emerald-200">
                {t('orderIdLabel', { id: order.id?.substring(0, 8) })}: <strong className="text-amber-300">{order.cropName}</strong> ({order.quantityQuintals} {t('quintalUnit')}) • ₹{order.totalAmount}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Order Info Subheader */}
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs flex justify-between items-center text-emerald-900">
          <div className="flex items-center space-x-1 font-semibold">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>{t('scheduledDeliveryDateLabel', { date: order.expectedDeliveryDate || order.requestedDeliveryDate || 'TBD' })}</span>
          </div>
          {order.delayReason && (
            <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-300">
              ⚠️ {order.delayReason}
            </span>
          )}
        </div>

        {/* Quick Voice Reason Pills (For Farmers) */}
        {isFarmer && (
          <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex space-x-2 overflow-x-auto text-xs scrollbar-none">
            <button
              onClick={() => handleQuickPillClick('🌧️ Delivery delayed by 2-3 days due to heavy rain.')}
              className="flex-shrink-0 bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 rounded-xl font-bold border border-blue-200 flex items-center space-x-1 transition"
            >
              <CloudRain className="w-3.5 h-3.5 text-blue-600" />
              <span>🌧️ Rain</span>
            </button>
            <button
              onClick={() => handleQuickPillClick('🚛 Delivery schedule updated due to transport/vehicle issue.')}
              className="flex-shrink-0 bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl font-bold border border-amber-200 flex items-center space-x-1 transition"
            >
              <Truck className="w-3.5 h-3.5 text-amber-700" />
              <span>🚛 Transport</span>
            </button>
            <button
              onClick={() => handleQuickPillClick('🌾 Harvesting in progress, produce will be dispatched shortly.')}
              className="flex-shrink-0 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl font-bold border border-emerald-200 flex items-center space-x-1 transition"
            >
              <Wheat className="w-3.5 h-3.5 text-emerald-700" />
              <span>🌾 Harvesting</span>
            </button>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-100/70">
          {loading ? (
            <div className="text-center py-10 text-slate-400 text-xs animate-pulse">
              {t('searchingListings')}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">{t('chatModalTitle', { id: order.id?.substring(0, 8) })}</p>
              <p className="text-xs text-slate-500">
                {t('typeMessagePlaceholder')}
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id || Math.random()} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                    isMe 
                      ? 'bg-emerald-800 text-white rounded-tr-none' 
                      : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                  }`}>
                    <div className="flex justify-between items-center mb-1 text-[11px] font-semibold opacity-90 space-x-3">
                      <span className={isMe ? 'text-amber-300' : 'text-emerald-700'}>{msg.senderName}</span>
                      <button
                        onClick={() => speakText(msg.message, lang)}
                        className={`p-1 rounded hover:opacity-80 transition ${isMe ? 'text-white' : 'text-slate-500'}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-white p-3 border-t border-slate-200 space-y-2">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleMicClick}
              className={`p-3 rounded-2xl transition border ${
                isListening 
                  ? 'bg-red-500 text-white border-red-600 animate-pulse' 
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? t('listeningText') : t('typeMessagePlaceholder')}
              className="flex-1 p-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-xs font-medium"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-amber-300 rounded-2xl transition shadow-md"
            >
              <Send className="w-5 h-5 stroke-[2.5]" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
