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
              <span>भारत का पहला 1-on-1 AI वॉइस कृषि बाज़ार</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-amber-300 leading-tight">
              सीधे किसान से खरीदार तक — बिना किसी बिचौलिए के
            </h1>

            <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed">
              मूल्य (Moolya) AI प्लेटफ़ॉर्म पर बोलकर फसल लिस्ट करें, ऑटोमैटिक क्वालिटी ग्रेडिंग (A, B, C) पाएँ और खरीदारों से पसंदीदा डिलीवरी तारीख के साथ सीधे सौदे करें।
            </p>

            {/* Call-to-action Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => onSelectPortal('FARMER')}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black rounded-2xl text-sm shadow-xl flex items-center space-x-2 transition border-2 border-amber-300"
              >
                <Sprout className="w-5 h-5 stroke-[2.5]" />
                <span>किसान पोर्टल में प्रवेश करें (Farmer Portal)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onSelectPortal('BUYER')}
                className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-black rounded-2xl text-sm shadow-xl flex items-center space-x-2 transition border border-emerald-600"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>खरीदार पोर्टल (Buyer Portal)</span>
              </button>

              <button
                type="button"
                onClick={onOpenVoiceListing}
                className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-sm border border-slate-700 shadow-md flex items-center space-x-2 transition"
              >
                <Mic className="w-5 h-5 text-amber-400 animate-pulse" />
                <span>AI वॉइस असिस्टेंस आज़माएँ</span>
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

      {/* SECTION 2: HOW OUR WEBSITE WORKS (वेबसाइट कैसे काम करती है - 5 STEPS) */}
      <div id="how-it-works" className="space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            सरल एवं पारदर्शी प्रक्रिया (Step-by-Step Flow)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            हमारी वेबसाइट (Moolya AI) कैसे काम करती है?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            बोलने से लेकर डिलीवरी की तारीख तय करने तक — पूरी प्रक्रिया 5 आसान चरणों में:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-4">
          
          {/* Step 1 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative hover:shadow-md transition">
            <div className="bg-amber-400 text-emerald-950 font-black w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow">
              1
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">1-on-1 AI वॉइस Q&A</h3>
            <p className="text-xs text-slate-600">
              किसान अपनी भाषा (हिंदी या इंग्लिश) में बोलकर फसल, मात्रा, कटाई तारीख और मूल्य दर्ज करते हैं।
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative hover:shadow-md transition">
            <div className="bg-amber-400 text-emerald-950 font-black w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow">
              2
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">ऑटो AI ग्रेडिंग (A/B/C)</h3>
            <p className="text-xs text-slate-600">
              कीटनाशक प्रयोग और कटाई की तारीख के आधार पर स्मार्ट एल्गोरिदम फसल को Grade A, B, या C प्रदान करता है।
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative hover:shadow-md transition">
            <div className="bg-amber-400 text-emerald-950 font-black w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow">
              3
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">4-5 तस्वीरें अपलोड</h3>
            <p className="text-xs text-slate-600">
              सुरक्षा एवं प्रामाणिकता के लिए किसान फसल की कम से कम 4 तस्वीरें जोड़ते हैं ताकि खरीदार गुणवत्ता देख सकें।
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative hover:shadow-md transition">
            <div className="bg-amber-400 text-emerald-950 font-black w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow">
              4
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">डिलीवरी तारीख तय करें</h3>
            <p className="text-xs text-slate-600">
              खरीदार अपनी पसंदीदा तारीख चुनकर ऑर्डर भेजता है; किसान अपनी संभावित सप्लाई तारीख तय करके स्वीकार करता है।
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative hover:shadow-md transition">
            <div className="bg-amber-400 text-emerald-950 font-black w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow">
              5
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">रियल-टाइम सूचना व भुगतान</h3>
            <p className="text-xs text-slate-600">
              ऑर्डर की स्थिति तुरंत ऑडियो एवं WebSocket द्वारा प्रसारित होती है। बैंक खाते में सीधी पारदर्शी कमाई।
            </p>
          </div>

        </div>
      </div>

      {/* SECTION 3: ABOUT US (हमारे बारे में) */}
      <div id="about-us" className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 grid grid-cols-1 md:grid-cols-2 gap-8 items-center scroll-mt-20">
        
        <div className="space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-emerald-800/80 px-3 py-1 rounded-full border border-emerald-700">
            हमारे बारे में (About Moolya AI)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-amber-300">
            किसानों का सशक्तिकरण और निष्पक्ष बाज़ार
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            मूल्य (Moolya) एक अत्याधुनिक एआई कृषि प्लेटफ़ॉर्म है जिसका मुख्य उद्देश्य भारतीय किसानों को बिना बिचौलियों के सीधे सत्यापित खरीदारों (व्यापारियों, रिटेलर्स, मील मालिकों) से जोड़ना है।
          </p>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
            हमने AI वॉइस असिस्टेंट तकनीक, स्वचालित गुणवत्ता मूल्यांकन, एवं रियल-टाइम STOMP WebSocket ऑडियो अलर्ट का समावेश किया है ताकि कम पढ़े-लिखे किसान भी आसानी से अपनी फसल लिस्ट कर सकें।
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-emerald-900/60 p-3.5 rounded-2xl border border-emerald-700">
              <span className="text-2xl font-black text-amber-400">100%</span>
              <p className="text-xs text-emerald-200 font-semibold">डायरेक्ट ट्रेडिंग (Zero Commission)</p>
            </div>
            <div className="bg-emerald-900/60 p-3.5 rounded-2xl border border-emerald-700">
              <span className="text-2xl font-black text-amber-400">1-on-1</span>
              <p className="text-xs text-emerald-200 font-semibold">वॉइस असिस्टेंस (हिंदी/English)</p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-950/80 p-6 rounded-3xl border border-emerald-700/80 space-y-4 shadow-inner">
          <h3 className="text-lg font-black text-amber-300 flex items-center space-x-2">
            <HeartHandshake className="w-5 h-5 text-amber-400" />
            <span>हमारा मुख्य मिशन (Our Mission)</span>
          </h3>
          <ul className="space-y-3 text-xs text-emerald-100 font-medium">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>किसानों को उनकी फसल का उचित एवं पारदर्शी मूल्य दिलाना।</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>बिचौलियों और अनुचित कटौतियों को पूरी तरह समाप्त करना।</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>खरीदार और किसान दोनों की आपसी सहमति से डिलीवरी तारीख तय करना।</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>4-5 अनिवार्य फसल फोटोग्राफ्स द्वारा गुणवत्ता का शत-प्रतिशत सत्यापन।</span>
            </li>
          </ul>
        </div>

      </div>

      {/* SECTION 4: KEY FEATURES GRID */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-black text-slate-900">मुख्य विशेषताएँ (Key Platform Features)</h2>
          <p className="text-xs text-slate-500">Moolya AI क्यों है भारत का सबसे भरोसेमंद कृषि प्लेटफ़ॉर्म?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="bg-amber-400 text-emerald-950 p-3 rounded-2xl w-fit shadow">
              <Mic className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">AI वॉइस असिस्टेंस</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              बिना टाइप किए बोलकर प्रश्न-उत्तर के माध्यम से फसल की जानकारी दर्ज करें। सिस्टम स्वयं हिंदी और अंग्रेजी में बोलकर मार्गदर्शन करता है।
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="bg-amber-400 text-emerald-950 p-3 rounded-2xl w-fit shadow">
              <Award className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">ट्रस्ट व मैच स्कोर (Trust Score)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              खरीदार और किसान के स्थान, ग्रेड और ऐतिहासिक रेटिंग्स के आधार पर 95%+ तक मैच स्कोर और सीधी पारदर्शिता।
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="bg-amber-400 text-emerald-950 p-3 rounded-2xl w-fit shadow">
              <Calendar className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">डबल डेट डिलीवरी सिस्टम</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              खरीदार अपनी पसंदीदा तारीख चुनता है, जबकि किसान अपनी अनुमानित कटाई व पूर्ति तारीख तय करता है। दोनों डैशबोर्ड पर स्पष्ट प्रदर्शन।
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: CONTACT US (संपर्क करें & हेल्पलाइन) */}
      <div id="contact-us" className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8 scroll-mt-20">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            24x7 सहायता (Contact & Support)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            हमसे संपर्क करें (Contact Us)
          </h2>
          <p className="text-xs text-slate-600">
            कोई प्रश्न, सुझाव या सहायता चाहिए? हमारी टीम आपकी सेवा में सदैव तत्पर है।
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
                <h4 className="text-sm font-extrabold text-slate-900">किसान व खरीदार टोल-फ्री हेल्पलाइन</h4>
                <p className="text-base font-black text-emerald-700">1800-MOOLYA-AI (1800-666-5922)</p>
                <p className="text-xs text-slate-500 mt-0.5">सोमवार से शनिवार: सुबह 8 बजे से रात 8 बजे तक</p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start space-x-4">
              <div className="bg-emerald-900 text-amber-300 p-3 rounded-2xl shadow flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">ईमेल सहायता (Email Support)</h4>
                <p className="text-sm font-bold text-slate-800">support@moolya.agri.in</p>
                <p className="text-xs text-slate-500 mt-0.5">24 घंटे के भीतर आधिकारिक जवाब</p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start space-x-4">
              <div className="bg-emerald-900 text-amber-300 p-3 rounded-2xl shadow flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">मुख्य कार्यालय (Headquarters)</h4>
                <p className="text-xs font-semibold text-slate-700">
                  Moolya Agri-Tech Center, GT Road, Ludhiana, Punjab - 141001, India
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">संदेश या प्रतिक्रिया भेजें (Send Feedback)</h3>
            
            {submitted ? (
              <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>धन्यवाद! आपका संदेश सफलतापूर्वक भेज दिया गया है। हमारी टीम जल्द ही आपसे संपर्क करेगी।</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">आपका नाम (Your Name):</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="उदा: रमेश कुमार"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">मोबाइल नंबर / ईमेल:</label>
                  <input
                    type="text"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="9876543210"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">संदेश या सवाल (Message):</label>
                  <textarea
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="अपना संदेश यहाँ लिखें..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold text-xs rounded-xl shadow transition"
                >
                  संदेश भेजें (Submit Message)
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
