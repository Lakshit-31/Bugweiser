import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { speakText, createSpeechRecognizer } from '../services/voiceService';
import { Mic, MicOff, Volume2, Upload, CheckCircle2, AlertCircle, X, Sparkles, ImagePlus, RefreshCw, VolumeX, Play } from 'lucide-react';
import axios from 'axios';

const questions = [
  { id: 'cropName', key: 'voicePrompt1', hi: "आप कौन सी फसल बेचना चाहते हैं?", en: "Which crop do you want to sell?", placeholder: "e.g., Wheat (गेहूँ)" },
  { id: 'quantityQuintals', key: 'voicePrompt2', hi: "कितनी मात्रा क्विंटल में उपलब्ध है?", en: "How much quantity in Quintals is available?", placeholder: "e.g., 50" },
  { id: 'district', key: 'voicePrompt3', hi: "आपकी लोकेशन या जिला कहाँ है?", en: "Where is your location or district?", placeholder: "District, State" },
  { id: 'harvestDate', key: 'voicePrompt4', hi: "फसल किस तारीख को काटी गई थी?", en: "When was the crop harvested?", placeholder: "YYYY-MM-DD" },
  { id: 'pesticidesUsed', key: 'voicePrompt5', hi: "उगाते समय कौन से कीटनाशक इस्तेमाल हुए?", en: "Which pesticides were used?", placeholder: "e.g., Organic Neem Oil, Zero" },
  { id: 'pricePerQuintal', key: 'voicePrompt6', hi: "आपका अपेक्षित मूल्य कितना रुपया प्रति क्विंटल है?", en: "What is your expected price per Quintal?", placeholder: "e.g., 2200" },
];

const samplePhotoPresets = [
  "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600",
  "https://images.unsplash.com/photo-1535242208474-9a279b23b514?w=600",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600",
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600",
  "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600"
];

export const VoiceListingModal = ({ isOpen, onClose, onListingCreated }) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [voiceLang, setVoiceLang] = useState('hi'); // 'hi' or 'en'
  const [hasStartedVoice, setHasStartedVoice] = useState(false);

  const [formData, setFormData] = useState({
    cropName: '',
    quantityQuintals: '',
    district: user?.location?.district || 'Ludhiana',
    state: user?.location?.state || 'Punjab',
    harvestDate: new Date().toISOString().split('T')[0],
    pesticidesUsed: 'Organic Neem Oil',
    pricePerQuintal: '',
    imageUrls: []
  });

  const [calculatedGrade, setCalculatedGrade] = useState('GRADE_A');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis.cancel();
      setHasStartedVoice(false);
    } else {
      setStep(0);
      setErrorMsg('');
      setVoiceLang(lang);
    }
  }, [isOpen]);

  useEffect(() => {
    const pest = (formData.pesticidesUsed || '').toLowerCase();
    if (pest.includes('organic') || pest.includes('neem') || pest.includes('zero') || pest.includes('जैविक')) {
      setCalculatedGrade('GRADE_A');
    } else if (pest.includes('heavy') || pest.includes('chemical')) {
      setCalculatedGrade('GRADE_C');
    } else {
      setCalculatedGrade('GRADE_B');
    }
  }, [formData.pesticidesUsed, formData.harvestDate]);

  // Initial gesture trigger to start audio synthesis cleanly
  const handleStartSystemVoice = () => {
    setHasStartedVoice(true);
    const greeting = voiceLang === 'hi' 
      ? "नमस्ते किसान भाई, मैं आपका मूल्य एआई वॉइस असिस्टेंट हूँ। चलिए फसल की जानकारी दर्ज करते हैं।" 
      : "Hello, I am your Moolya AI Voice Assistant. Let's record your crop details.";

    setIsSpeaking(true);
    speakText(greeting, voiceLang, () => {
      setIsSpeaking(false);
      startConversationalStep(0);
    });
  };

  const startConversationalStep = (stepIndex) => {
    if (stepIndex >= questions.length) {
      const endText = voiceLang === 'hi' 
        ? "धन्यवाद! सभी प्रश्न पूरे हो गए हैं। कृपया 4 तस्वीरें जोड़कर लिस्टिंग सबमिट करें।"
        : "Thank you! All questions completed. Please add photos to submit listing.";
      speakText(endText, voiceLang);
      return;
    }

    setStep(stepIndex);
    const q = questions[stepIndex];
    const textToSpeak = voiceLang === 'hi' ? q.hi : q.en;

    setIsSpeaking(true);
    setIsListening(false);

    speakText(textToSpeak, voiceLang, () => {
      setIsSpeaking(false);
      if (autoAdvance) {
        activateMicForCurrentStep(stepIndex);
      }
    });
  };

  const activateMicForCurrentStep = (stepIndex) => {
    const q = questions[stepIndex];
    setIsListening(true);

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsListening(false);
        setFormData(prev => ({ ...prev, [q.id]: transcript }));

        const ackText = voiceLang === 'hi' ? `प्राप्त हुआ: ${transcript}` : `Recorded: ${transcript}`;
        setIsSpeaking(true);

        speakText(ackText, voiceLang, () => {
          setIsSpeaking(false);
          if (autoAdvance && stepIndex + 1 < questions.length) {
            startConversationalStep(stepIndex + 1);
          }
        });
      },
      (err) => {
        setIsListening(false);
      },
      voiceLang
    );

    if (recognizer) {
      recognizer.start();
    }
  };

  const handleManualMicClick = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      activateMicForCurrentStep(step);
    }
  };

  const handleAddSamplePhotos = () => {
    setFormData(prev => ({
      ...prev,
      imageUrls: [...samplePhotoPresets]
    }));
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    if (formData.imageUrls.length < 4) {
      setErrorMsg('सुरक्षा नियम: लिस्टिंग के लिए कम से कम 4 से 5 तस्वीरें अपलोड करना अनिवार्य है! (Strict Rule: 4-5 photos required)');
      return;
    }

    if (!formData.cropName || !formData.quantityQuintals || !formData.pricePerQuintal) {
      setErrorMsg('कृपया फसल का नाम, मात्रा और मूल्य भरें।');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        farmerId: user?.id,
        cropName: formData.cropName,
        quantityQuintals: parseFloat(formData.quantityQuintals),
        pricePerQuintal: parseFloat(formData.pricePerQuintal),
        pesticidesUsed: formData.pesticidesUsed,
        harvestDate: formData.harvestDate,
        district: formData.district,
        state: formData.state,
        imageUrls: formData.imageUrls
      };

      const res = await axios.post('/api/v1/produce/create-voice', payload);
      setSubmitting(false);
      speakText("आपकी फसल सफलतापूर्वक लिस्ट कर दी गई है।", voiceLang);
      if (onListingCreated) onListingCreated(res.data);
      onClose();
    } catch (err) {
      setSubmitting(false);
      setErrorMsg(err.response?.data?.message || 'उत्पाद जोड़ने में त्रुटि हुई।');
    }
  };

  if (!isOpen) return null;

  const currentQ = questions[step];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-5 flex justify-between items-center border-b border-emerald-800">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-400 p-2.5 rounded-2xl text-emerald-950 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold text-amber-300">
                  1-on-1 AI सिस्टम आवाज असिस्टेंस (System Voice AI)
                </h2>
              </div>
              <p className="text-xs text-emerald-200">
                हिंदी / English सिस्टम बोलकर मार्गदर्शन करेगा
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Audio Start Gesture Button */}
          {!hasStartedVoice ? (
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-6 rounded-3xl text-emerald-950 text-center space-y-3 shadow-lg border-2 border-amber-300 animate-pulse">
              <Volume2 className="w-12 h-12 mx-auto stroke-[2.5]" />
              <h3 className="text-xl font-black">सिस्टम आवाज (System Voice) चालू करें</h3>
              <p className="text-xs font-bold max-w-md mx-auto">
                ब्राउज़र ऑडियो सुरक्षा चालू करने के लिए नीचे दिए गए बटन पर क्लिक करें। एआई तुरंत हिंदी में बोलेगा।
              </p>
              
              {/* Language Selection */}
              <div className="flex justify-center space-x-3 pt-1">
                <button
                  type="button"
                  onClick={() => setVoiceLang('hi')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold border ${
                    voiceLang === 'hi' ? 'bg-emerald-950 text-amber-300 border-emerald-900' : 'bg-white/80 text-emerald-950'
                  }`}
                >
                  हिंदी आवाज (Hindi Voice)
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceLang('en')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold border ${
                    voiceLang === 'en' ? 'bg-emerald-950 text-amber-300 border-emerald-900' : 'bg-white/80 text-emerald-950'
                  }`}
                >
                  English Voice
                </button>
              </div>

              <button
                type="button"
                onClick={handleStartSystemVoice}
                className="w-full py-3.5 bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-black rounded-2xl text-base shadow-xl flex items-center justify-center space-x-2 border border-amber-300/40"
              >
                <Play className="w-5 h-5 fill-amber-300" />
                <span>सिस्टम आवाज शुरू करें (Start System Voice Speech)</span>
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-900">
                🎙️ सिस्टम आवाज active: {voiceLang === 'hi' ? 'हिंदी (Hindi)' : 'English'}
              </span>
              <button
                type="button"
                onClick={() => speakText(voiceLang === 'hi' ? currentQ.hi : currentQ.en, voiceLang)}
                className="text-xs px-3 py-1 bg-amber-400 text-emerald-950 font-bold rounded-lg shadow flex items-center space-x-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>फिर से सुनें</span>
              </button>
            </div>
          )}

          {/* Stepper Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-6 rounded-3xl shadow-lg relative">
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                प्रश्न {step + 1} of {questions.length}
              </span>
              
              <div className="flex items-center space-x-2">
                {isSpeaking && (
                  <span className="text-xs text-amber-300 font-bold flex items-center space-x-1 animate-pulse">
                    <Volume2 className="w-4 h-4 text-amber-300" />
                    <span>सिस्टम आवाज बोल रही है...</span>
                  </span>
                )}
                {isListening && (
                  <span className="text-xs text-red-300 font-bold flex items-center space-x-1 animate-pulse">
                    <Mic className="w-4 h-4 text-red-400" />
                    <span>माइक चालू है (Listening)...</span>
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-4">
              {voiceLang === 'hi' ? currentQ.hi : currentQ.en}
            </h3>

            {/* Controls */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => startConversationalStep(step)}
                className="p-3 bg-emerald-800 hover:bg-emerald-700 text-amber-300 rounded-full transition"
                title="फिर से प्रश्न सुनें"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleManualMicClick}
                className={`p-4 rounded-full shadow-2xl transition flex items-center justify-center ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-400/40'
                    : 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
                }`}
                title="माइक कंट्रोल"
              >
                {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>

              <div className="w-10"></div>
            </div>

          </div>

          {/* Captured Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              रिकॉर्ड किया गया उत्तर (Spoken Value / Edit):
            </label>
            <input
              type={currentQ.id === 'quantityQuintals' || currentQ.id === 'pricePerQuintal' ? 'number' : 'text'}
              value={formData[currentQ.id] || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
              placeholder={currentQ.placeholder}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 text-base font-semibold"
            />
          </div>

          {/* Stepper Nav */}
          <div className="flex justify-between space-x-2">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => startConversationalStep(step - 1)}
              className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-700 rounded-xl disabled:opacity-40"
            >
              ← पिछला प्रश्न
            </button>
            <button
              type="button"
              disabled={step === questions.length - 1}
              onClick={() => startConversationalStep(step + 1)}
              className="px-5 py-2 text-xs font-bold bg-emerald-800 text-amber-300 rounded-xl hover:bg-emerald-900"
            >
              अगला प्रश्न →
            </button>
          </div>

          {/* Mandatory Photos Upload */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-extrabold text-slate-800 flex items-center space-x-1">
                <Upload className="w-4 h-4 text-emerald-800" />
                <span>{t('uploadImages')}</span>
              </label>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                formData.imageUrls.length >= 4 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
              }`}>
                {formData.imageUrls.length} / 5 तस्वीरें (कम से कम 4 आवश्यक)
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddSamplePhotos}
              className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold py-2.5 px-4 rounded-xl border border-emerald-300 flex items-center justify-center space-x-2 transition"
            >
              <ImagePlus className="w-4 h-4 text-emerald-700" />
              <span>ऑटो 5 फसल तस्वीरें जोड़ें (Auto Add 5 Quality Crop Photos)</span>
            </button>

            <div className="grid grid-cols-5 gap-2">
              {formData.imageUrls.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-300">
                  <img src={img} alt={`Crop ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      imageUrls: prev.imageUrls.filter((_, i) => i !== idx)
                    }))}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 text-xs font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600">
            रद्द करें
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || formData.imageUrls.length < 4}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold rounded-2xl text-sm transition shadow disabled:opacity-50 flex items-center space-x-2"
          >
            {submitting ? 'सबमिट हो रहा है...' : t('submitListing')}
          </button>
        </div>

      </div>
    </div>
  );
};
