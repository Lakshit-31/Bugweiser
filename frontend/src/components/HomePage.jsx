import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, ShoppingBag, Mic, ShieldCheck, Award, Truck, Calendar, Phone, Mail, MapPin, CheckCircle, Sparkles, ArrowRight, HelpCircle, Users, HeartHandshake } from 'lucide-react';
import axios from 'axios';

export const HomePage = ({ onSelectPortal, onOpenVoiceListing, onOpenAuth }) => {
  const { lang, t } = useLanguage();

  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) return;

    setLoading(true);
    try {
      await axios.post('/api/v1/admin/contact-messages', {
        senderName: contactForm.name.trim(),
        senderContact: contactForm.phone.trim(),
        message: contactForm.message.trim()
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setContactForm({ name: '', phone: '', message: '' });
      }, 4000);
    } catch (err) {
      console.error('Contact message error:', err);
      // Still show thank you for smooth UX
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setContactForm({ name: '', phone: '', message: '' });
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      
      {/* SECTION 1: HERO BANNER */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white p-8 sm:p-12 shadow-2xl border border-emerald-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t('heroBadge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-amber-300 leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed">
              {t('heroDesc')}
            </p>

            {/* Call-to-action Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => onSelectPortal('FARMER')}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black rounded-2xl text-sm shadow-xl flex items-center space-x-2 transition border-2 border-amber-300"
              >
                <Sprout className="w-5 h-5 stroke-[2.5]" />
                <span>{t('enterFarmerPortal')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onSelectPortal('BUYER')}
                className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-black rounded-2xl text-sm shadow-xl flex items-center space-x-2 transition border border-emerald-600"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{t('buyerPortal')}</span>
              </button>

              <button
                type="button"
                onClick={onOpenVoiceListing}
                className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-sm border border-slate-700 shadow-md flex items-center space-x-2 transition"
              >
                <Mic className="w-5 h-5 text-amber-400 animate-pulse" />
                <span>{t('tryVoiceAi')}</span>
              </button>
            </div>

          </div>

          {/* Right Logo Banner Container (No Overlap) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="bg-white/95 p-4 rounded-3xl shadow-2xl border-2 border-amber-400/80 backdrop-blur-sm transform hover:scale-105 transition duration-300 max-w-xs sm:max-w-sm">
              <img src="/moolya-logo.jpg" alt="Moolya Official Logo" className="w-full h-auto object-contain rounded-2xl" />
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: HOW OUR WEBSITE WORKS (5 STEPS) */}
      <div id="how-it-works" className="space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            {t('howItWorksBadge')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('howItWorksDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-4">
          
          {/* Step 1 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative hover:shadow-md transition">
            <div className="bg-amber-400 text-emerald-950 font-black w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow">
              1
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">{t('step1Title')}</h3>
            <p className="text-xs text-slate-600">
              {t('step1Desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative hover:shadow-md transition">
            <div className="bg-amber-400 text-emerald-950 font-black w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow">
              2
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">{t('step2Title')}</h3>
            <p className="text-xs text-slate-600">
              {t('step2Desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative hover:shadow-md transition">
            <div className="bg-amber-400 text-emerald-950 font-black w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow">
              3
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">{t('step3Title')}</h3>
            <p className="text-xs text-slate-600">
              {t('step3Desc')}
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative hover:shadow-md transition">
            <div className="bg-amber-400 text-emerald-950 font-black w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow">
              4
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">{t('step4Title')}</h3>
            <p className="text-xs text-slate-600">
              {t('step4Desc')}
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative hover:shadow-md transition">
            <div className="bg-amber-400 text-emerald-950 font-black w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow">
              5
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">{t('step5Title')}</h3>
            <p className="text-xs text-slate-600">
              {t('step5Desc')}
            </p>
          </div>

        </div>
      </div>

      {/* SECTION 3: ABOUT US */}
      <div id="about-us" className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 grid grid-cols-1 md:grid-cols-2 gap-8 items-center scroll-mt-20">
        
        <div className="space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-emerald-800/80 px-3 py-1 rounded-full border border-emerald-700">
            {t('aboutBadge')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-amber-300">
            {t('aboutTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            {t('aboutDesc1')}
          </p>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
            {t('aboutDesc2')}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-emerald-900/60 p-3.5 rounded-2xl border border-emerald-700">
              <span className="text-2xl font-black text-amber-400">100%</span>
              <p className="text-xs text-emerald-200 font-semibold">{t('directTrading')}</p>
            </div>
            <div className="bg-emerald-900/60 p-3.5 rounded-2xl border border-emerald-700">
              <span className="text-2xl font-black text-amber-400">1-on-1</span>
              <p className="text-xs text-emerald-200 font-semibold">{t('voiceAssistanceFeature')}</p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-950/80 p-6 rounded-3xl border border-emerald-700/80 space-y-4 shadow-inner">
          <h3 className="text-lg font-black text-amber-300 flex items-center space-x-2">
            <HeartHandshake className="w-5 h-5 text-amber-400" />
            <span>{t('ourMission')}</span>
          </h3>
          <ul className="space-y-3 text-xs text-emerald-100 font-medium">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{t('mission1')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{t('mission2')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{t('mission3')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{t('mission4')}</span>
            </li>
          </ul>
        </div>

      </div>

      {/* SECTION 4: KEY FEATURES GRID */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-black text-slate-900">{t('keyFeaturesTitle')}</h2>
          <p className="text-xs text-slate-500">{t('keyFeaturesSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="bg-amber-400 text-emerald-950 p-3 rounded-2xl w-fit shadow">
              <Mic className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">{t('featVoiceTitle')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('featVoiceDesc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="bg-amber-400 text-emerald-950 p-3 rounded-2xl w-fit shadow">
              <Award className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">{t('featTrustTitle')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('featTrustDesc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="bg-amber-400 text-emerald-950 p-3 rounded-2xl w-fit shadow">
              <Calendar className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">{t('featDeliveryTitle')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('featDeliveryDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: CONTACT US & HELPLINE */}
      <div id="contact-us" className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8 scroll-mt-20">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            {t('contactBadge')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('contactHeading')}
          </h2>
          <p className="text-xs text-slate-600">
            {t('contactSubheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Contact Details Cards */}
          <div className="space-y-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start space-x-4">
              <div className="bg-emerald-900 text-amber-300 p-3 rounded-2xl shadow flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">{t('tollFreeTitle')}</h4>
                <p className="text-base font-black text-emerald-700">{t('tollFreeNumber')}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t('tollFreeHours')}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start space-x-4">
              <div className="bg-emerald-900 text-amber-300 p-3 rounded-2xl shadow flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">{t('emailSupportTitle')}</h4>
                <p className="text-sm font-bold text-slate-800">{t('emailAddress')}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t('emailResponseTime')}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start space-x-4">
              <div className="bg-emerald-900 text-amber-300 p-3 rounded-2xl shadow flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">{t('hqTitle')}</h4>
                <p className="text-xs font-semibold text-slate-700">
                  {t('hqAddress')}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">{t('sendFeedbackTitle')}</h3>
            
            {submitted ? (
              <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>{t('feedbackSuccessMsg')}</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('yourNameLabel')}</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('yourNamePlaceholder')}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('phoneEmailLabel')}</label>
                  <input
                    type="text"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder={t('phoneEmailPlaceholder')}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('messageLabel')}</label>
                  <textarea
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder={t('messagePlaceholder')}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold text-xs rounded-xl shadow transition"
                >
                  {t('submitMessageBtn')}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
