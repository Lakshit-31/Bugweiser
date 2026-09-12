import React, { useState } from 'react';
import {
  Send,
  Paperclip,
  CheckCheck,
  Phone,
  User,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Scale,
} from 'lucide-react';
import type { ChatConversation, ChatMessage } from '@/types/buyer';
import { initialChatConversations } from '@/data/buyerMockData';
import type { LanguageCode } from '@/types';
import { buyerTranslations } from '@/data/buyerTranslations';

interface BuyerChatScreenProps {
  onOpenOrderFromChat: (cropName: string, farmerName: string) => void;
  selectedFarmerName?: string;
  currentLang?: LanguageCode;
}

export default function BuyerChatScreen({
  onOpenOrderFromChat,
  selectedFarmerName,
  currentLang = 'en',
}: BuyerChatScreenProps) {
  const bt = buyerTranslations[currentLang] || buyerTranslations.en;
  const [conversations, setConversations] = useState<ChatConversation[]>(initialChatConversations);
  const [activeConvId, setActiveConvId] = useState<string>(
    selectedFarmerName
      ? conversations.find((c) => c.farmerName.toLowerCase().includes(selectedFarmerName.toLowerCase()))?.id || conversations[0].id
      : conversations[0].id
  );
  const [inputText, setInputText] = useState('');
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);

  const quickReplies = currentLang === 'hi'
    ? ['क्या आप थोक में ₹24.00/किग्रा कर सकते हैं?', 'कृपया नमी परीक्षण का वीडियो साझा करें', 'हम एस्क्रो के साथ ₹24.50/किग्रा स्वीकार करते हैं', 'क्या कल सुबह 8 बजे पिकअप हो सकता है?']
    : currentLang === 'mr'
    ? ['तुम्ही ₹24.00/किलो करू शकता का?', 'कृपया ओलावा चाचणी व्हिडिओ पाठवा', 'आम्ही एस्क्रोसह ₹24.50/किलो स्वीकारतो', 'उद्या सकाळी 8 वाजता गाडी पाठवू का?']
    : currentLang === 'pa'
    ? ['ਕੀ ਤੁਸੀਂ ₹24.00/ਕਿਲੋ ਕਰ ਸਕਦੇ ਹੋ?', 'ਨਮੀ ਜਾਂਚ ਦਾ ਵੀਡੀਓ ਸਾਂਝਾ ਕਰੋ ਜੀ', 'ਅਸੀਂ ਐਸਕਰੋ ਨਾਲ ₹24.50/ਕਿਲੋ ਮੰਨਦੇ ਹਾਂ', 'ਕੀ ਕੱਲ੍ਹ ਸਵੇਰੇ 8 ਵਜੇ ਟਰੱਕ ਭਰ ਸਕਦਾ ਹੈ?']
    : [
        'Can you do ₹24.00/kg for bulk?',
        'Please share moisture testing video',
        'We accept ₹24.50/kg with Escrow',
        'Can you arrange pickup tomorrow 8 AM?',
        'Will trucks be loaded directly at farmgate?',
      ];

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (textToSend?: string) => {
    const msgText = textToSend || inputText;
    if (!msgText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };

    const updatedConvs = conversations.map((conv) => {
      if (conv.id === activeConv.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          lastMessage: msgText,
          lastMessageTime: 'Just now',
        };
      }
      return conv;
    });

    setConversations(updatedConvs);
    setInputText('');

    // Simulate farmer reply
    setTimeout(() => {
      const farmerReplies = [
        'Haan ji Vikram bhai, quality test passed. We will coordinate loading.',
        'Done deal! Please lock through Moolya Escrow and we will hold the lot.',
        'Received. Moisture slip and bag count will be handed over to your truck driver.',
      ];
      const replyText = farmerReplies[Math.floor(Math.random() * farmerReplies.length)];

      const farmerMsg: ChatMessage = {
        id: `msg-rep-${Date.now()}`,
        sender: 'farmer',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConv.id
            ? {
                ...c,
                messages: [...c.messages, farmerMsg],
                lastMessage: replyText,
                lastMessageTime: 'Just now',
              }
            : c
        )
      );
    }, 1200);
  };

  const handleAcceptOffer = (crop: string, farmerName: string) => {
    onOpenOrderFromChat(crop, farmerName);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-leaf-700">
            Direct Trade Communications
          </span>
          <h1 className="font-serif text-2xl font-bold text-ink">
            {bt.chatWorkspaceTitle}
          </h1>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-600" /> {bt.chatVerifiedBadge}
        </span>
      </div>

      {/* Main Chat Workspace Container */}
      <div className="h-[74vh] rounded-3xl border border-gray-200/90 bg-white shadow-xs overflow-hidden flex">
        {/* Left Conversation List */}
        <div
          className={`w-full md:w-80 border-r border-gray-200 flex flex-col bg-paper/40 ${
            isMobileListOpen ? 'block' : 'hidden md:flex'
          }`}
        >
          <div className="p-4 border-b border-gray-200/80 bg-white">
            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
              Active Negotiations ({conversations.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {conversations.map((conv) => {
              const isActive = conv.id === activeConv.id;
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => {
                    setActiveConvId(conv.id);
                    setIsMobileListOpen(false);
                  }}
                  className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
                    isActive ? 'bg-white border-l-4 border-l-leaf-600 shadow-2xs' : 'hover:bg-white/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.farmerAvatar}
                      alt={conv.farmerName}
                      className="h-11 w-11 rounded-2xl object-cover border border-gray-200"
                    />
                    {conv.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-ink truncate">{conv.farmerName}</h4>
                      <span className="text-[10px] text-gray-400 shrink-0">{conv.lastMessageTime}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-leaf-700 truncate mt-0.5">
                      {conv.cropTopic}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Pane */}
        <div className={`flex-1 flex flex-col bg-white ${isMobileListOpen ? 'hidden md:flex' : 'flex'}`}>
          {/* Active Conversation Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-paper/30">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileListOpen(true)}
                className="md:hidden rounded-lg p-1 text-gray-500 hover:bg-gray-100"
              >
                <ArrowLeft size={18} />
              </button>
              <img
                src={activeConv.farmerAvatar}
                alt={activeConv.farmerName}
                className="h-10 w-10 rounded-2xl object-cover border border-leaf-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-ink">{activeConv.farmerName}</h3>
                  <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                    {bt.onlineBadge}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium">
                  Negotiating: <strong>{activeConv.cropTopic}</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAcceptOffer(activeConv.cropTopic, activeConv.farmerName)}
              className="rounded-xl bg-leaf-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-leaf-700 transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag size={14} /> {bt.createOrderProposalBtn}
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-paper/20 to-white">
            {activeConv.messages.map((msg) => {
              const isBuyer = msg.sender === 'buyer';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md rounded-2xl p-3.5 text-xs shadow-2xs ${
                      isBuyer
                        ? 'bg-leaf-600 text-white rounded-br-xs'
                        : 'bg-gray-100 text-ink rounded-bl-xs border border-gray-200/70'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>

                    {/* Embedded Price Offer Card */}
                    {msg.type === 'offer' && msg.offerDetails && (
                      <div className="mt-2.5 rounded-xl bg-white p-3 text-ink border border-emerald-200 shadow-xs">
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 border-b border-gray-100 pb-1.5 mb-1.5">
                          <span>Official Formal Price Proposal</span>
                          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px]">
                            {msg.offerDetails.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Commodity:</span>
                            <span className="font-bold">{msg.offerDetails.crop}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Volume:</span>
                            <span className="font-bold">{msg.offerDetails.quantity} {msg.offerDetails.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Rate Offered:</span>
                            <span className="font-extrabold text-emerald-800">
                              ₹{msg.offerDetails.pricePerUnit} / {msg.offerDetails.unit}
                            </span>
                          </div>
                          <div className="pt-1.5 border-t border-gray-100 flex justify-between font-black text-ink">
                            <span>Total Value:</span>
                            <span>₹{msg.offerDetails.totalAmount.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {!isBuyer && (
                          <div className="mt-2.5 flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleAcceptOffer(msg.offerDetails?.crop || '', activeConv.farmerName)}
                              className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                            >
                              Accept & Generate Order
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                        isBuyer ? 'text-leaf-200' : 'text-gray-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isBuyer && <CheckCheck size={12} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Reply Chips Bar */}
          <div className="px-4 py-2 bg-gray-50/70 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto scrollbar-hide text-xs">
            <span className="text-[10px] font-bold uppercase text-gray-400 shrink-0">{bt.quickRepliesTitle}</span>
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(reply)}
                className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 border border-gray-200 hover:border-leaf-400 hover:bg-leaf-50 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 border-t border-gray-100 flex items-center gap-2"
          >
            <button
              type="button"
              className="rounded-xl p-2.5 text-gray-400 hover:bg-gray-100 hover:text-ink transition-colors"
              title="Attach File or Lab Report"
              aria-label="Attach File or Lab Report"
            >
              <Paperclip size={18} />
            </button>
            <input
              type="text"
              placeholder={bt.chatInputPlaceholder}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 rounded-2xl border border-gray-200 bg-gray-50/60 px-4 py-2.5 text-xs text-ink focus:border-leaf-500 focus:bg-white focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="rounded-2xl bg-leaf-600 p-2.5 text-white shadow-xs hover:bg-leaf-700 transition-colors"
              title="Send Message"
              aria-label="Send Message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
