import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { speakText, createSpeechRecognizer } from '../services/voiceService';
import { parseQuantityOrPrice, parseQuantityAndUnit, parseSpokenDate } from '../utils/voiceParser';
import { Mic, MicOff, Volume2, Upload, CheckCircle2, AlertCircle, X, Sparkles, ImagePlus, RefreshCw, VolumeX, Play, Lock } from 'lucide-react';
import axios from 'axios';

const questions = [
  { id: 'cropName', key: 'voicePrompt1', placeholder: "e.g., Wheat / Rice / Potato" },
  { id: 'quantityQuintals', key: 'voicePrompt2', placeholder: "e.g., 50" },
  { id: 'district', key: 'voicePrompt3', placeholder: "District, State" },
  { id: 'harvestDate', key: 'voicePrompt4', placeholder: "YYYY-MM-DD" },
  { id: 'pesticidesUsed', key: 'voicePrompt5', placeholder: "e.g., Organic Neem Oil, Zero" },
  { id: 'pricePerQuintal', key: 'voicePrompt6', placeholder: "e.g., 2200" },
];

export const VoiceListingModal = ({ isOpen, onClose, onOpenAuth, onListingCreated }) => {
  const { lang, supportedLanguages, t } = useLanguage();
  const { user } = useAuth();
  const { triggerRefresh } = useWebSocket();

  const [step, setStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [voiceLang, setVoiceLang] = useState(lang || 'hi');
  const [hasStartedVoice, setHasStartedVoice] = useState(false);

  const [formData, setFormData] = useState({
    cropName: '',
    quantityQuintals: '',
    unit: 'QUINTAL',
    displayQuantity: '',
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
    if (!isOpen || !user) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setHasStartedVoice(false);
    } else {
      setStep(0);
      setErrorMsg('');
      setVoiceLang(lang);
    }
  }, [isOpen, user, lang]);

  useEffect(() => {
    const pest = (formData.pesticidesUsed || '').toLowerCase();
    if (pest.includes('organic') || pest.includes('neem') || pest.includes('zero') || pest.includes('जैविक') || pest.includes('ਜੈਵਿਕ') || pest.includes('સજીવ') || pest.includes('இயற்கை')) {
      setCalculatedGrade('GRADE_A');
    } else if (pest.includes('heavy') || pest.includes('chemical') || pest.includes('रसायनिक') || pest.includes('ರసాయನ')) {
      setCalculatedGrade('GRADE_C');
    } else {
      setCalculatedGrade('GRADE_B');
    }
  }, [formData.pesticidesUsed, formData.harvestDate]);

  // Initial gesture trigger to start audio synthesis cleanly
  const handleStartSystemVoice = () => {
    if (!user) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (onOpenAuth) {
        onClose();
        onOpenAuth();
      }
      return;
    }
    setHasStartedVoice(true);
    const greeting = `${t('welcome')}, ${t('voiceAssistantTitle')}`;

    setIsSpeaking(true);
    speakText(greeting, voiceLang, () => {
      setIsSpeaking(false);
      startConversationalStep(0);
    });
  };

  const startConversationalStep = (stepIndex) => {
    if (!user) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }
    if (stepIndex >= questions.length) {
      const endText = t('uploadPhotosTitle');
      speakText(endText, voiceLang);
      return;
    }

    setStep(stepIndex);
    const q = questions[stepIndex];
    const textToSpeak = t(q.key);

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
    if (!user) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (onOpenAuth) {
        onClose();
        onOpenAuth();
      }
      return;
    }
    const q = questions[stepIndex];
    setIsListening(true);

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsListening(false);
        let parsedVal = transcript;
        let ackText = '';

        if (q.id === 'quantityQuintals') {
          const parsed = parseQuantityAndUnit(transcript);
          parsedVal = String(parsed.displayQuantity);
          const unitText = parsed.unit === 'KG' ? t('kgUnit') : t('quintalUnit');
          ackText = `${t('availableQuantity')} ${parsedVal} ${unitText}`;
          setFormData(prev => ({
            ...prev,
            quantityQuintals: parsed.quantityQuintals,
            displayQuantity: parsed.displayQuantity,
            unit: parsed.unit
          }));
        } else if (q.id === 'pricePerQuintal') {
          parsedVal = parseQuantityOrPrice(transcript);
          ackText = `${t('expectedPrice')}: ₹${parsedVal}`;
          setFormData(prev => ({ ...prev, [q.id]: parsedVal }));
        } else if (q.id === 'harvestDate') {
          parsedVal = parseSpokenDate(transcript);
          ackText = `${t('harvestDate')}: ${parsedVal}`;
          setFormData(prev => ({ ...prev, [q.id]: parsedVal }));
        } else {
          ackText = t('voiceRecordedAck', { text: transcript });
          setFormData(prev => ({ ...prev, [q.id]: parsedVal }));
        }
        setIsSpeaking(true);

        speakText(ackText, voiceLang, () => {
          setIsSpeaking(false);
          if (autoAdvance && stepIndex + 1 < questions.length) {
            startConversationalStep(stepIndex + 1);
          }
        });
      },
      () => {
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

  const [customUrl, setCustomUrl] = useState('');

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => {
          if (prev.imageUrls.length >= 5) return prev;
          return {
            ...prev,
            imageUrls: [...prev.imageUrls, reader.result]
          };
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddUrl = () => {
    if (!customUrl.trim()) return;
    setFormData((prev) => {
      if (prev.imageUrls.length >= 5) return prev;
      return {
        ...prev,
        imageUrls: [...prev.imageUrls, customUrl.trim()]
      };
    });
    setCustomUrl('');
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    if (formData.imageUrls.length < 4) {
      setErrorMsg(t('minPhotosRequiredAlert'));
      return;
    }

    const rawDispQty = formData.displayQuantity || formData.quantityQuintals;
    const cleanedQty = parseQuantityOrPrice(rawDispQty);
    const cleanedPrice = parseQuantityOrPrice(formData.pricePerQuintal);
    const cleanedDate = parseSpokenDate(formData.harvestDate);

    if (!formData.cropName || !cleanedQty || !cleanedPrice) {
      setErrorMsg(t('errorOccurred'));
      return;
    }

    const numDisp = parseFloat(cleanedQty);
    const selectedUnit = formData.unit || 'QUINTAL';
    const qtyQuintals = selectedUnit === 'KG' ? numDisp / 100.0 : numDisp;

    setSubmitting(true);
    try {
      const payload = {
        farmerId: user?.id,
        cropName: formData.cropName,
        quantityQuintals: qtyQuintals,
        unit: selectedUnit,
        displayQuantity: numDisp,
        pricePerQuintal: parseFloat(cleanedPrice),
        pesticidesUsed: formData.pesticidesUsed,
        harvestDate: cleanedDate,
        district: formData.district,
        state: formData.state,
        imageUrls: formData.imageUrls
      };

      const res = await axios.post('/api/v1/produce/create-voice', payload);
      setSubmitting(false);
      speakText(t('success'), voiceLang);
      triggerRefresh();
      if (onListingCreated) onListingCreated(res.data);
      onClose();
    } catch (err) {
      setSubmitting(false);
      setErrorMsg(err.response?.data?.message || t('errorOccurred'));
    }
  };

  if (!isOpen) return null;

  const currentQ = questions[step];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-5 flex justify-between items-center border-b border-emerald-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-400 p-2.5 rounded-2xl text-emerald-950 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold text-amber-300">
                  {t('voiceAssistantTitle')}
                </h2>
              </div>
              <p className="text-xs text-emerald-200">
                1-on-1 AI Voice Producer Assistant
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          
          {!user ? (
            <div className="bg-amber-50 border-2 border-amber-300 p-8 rounded-3xl text-center space-y-4 shadow-lg">
              <div className="bg-amber-400 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-emerald-950 shadow-inner">
                <Lock className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-emerald-950">{t('pleaseLogin')}</h3>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenAuth) onOpenAuth();
                }}
                className="w-full py-3.5 bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-black rounded-2xl text-sm shadow-xl flex items-center justify-center space-x-2 border border-amber-300/40"
              >
                <span>{t('loginRegister')}</span>
              </button>
            </div>
          ) : (
            <>
              {/* Audio Start Gesture Button */}
          {!hasStartedVoice ? (
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-6 rounded-3xl text-emerald-950 text-center space-y-3 shadow-lg border-2 border-amber-300 animate-pulse">
              <Volume2 className="w-12 h-12 mx-auto stroke-[2.5]" />
              <h3 className="text-xl font-black">{t('startAiVoice')}</h3>
              
              {/* Language Selection */}
              <div className="flex justify-center flex-wrap gap-2 pt-1">
                {supportedLanguages.map(item => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setVoiceLang(item.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition ${
                      voiceLang === item.code ? 'bg-emerald-950 text-amber-300 border-emerald-900 shadow' : 'bg-white/80 text-emerald-950 hover:bg-white'
                    }`}
                  >
                    {item.nativeName}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleStartSystemVoice}
                className="w-full py-3.5 bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-black rounded-2xl text-base shadow-xl flex items-center justify-center space-x-2 border border-amber-300/40 mt-2"
              >
                <Play className="w-5 h-5 fill-amber-300" />
                <span>{t('startAiVoice')}</span>
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-900">
                🎙️ {supportedLanguages.find(l => l.code === voiceLang)?.nativeName || voiceLang}
              </span>
              <button
                type="button"
                onClick={() => speakText(t(currentQ.key), voiceLang)}
                className="text-xs px-3 py-1 bg-amber-400 text-emerald-950 font-bold rounded-lg shadow flex items-center space-x-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{t('listenAgainBtn')}</span>
              </button>
            </div>
          )}

          {/* Stepper Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-6 rounded-3xl shadow-lg relative">
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                Step {step + 1} of {questions.length}
              </span>
              
              <div className="flex items-center space-x-2">
                {isSpeaking && (
                  <span className="text-xs text-amber-300 font-bold flex items-center space-x-1 animate-pulse">
                    <Volume2 className="w-4 h-4 text-amber-300" />
                    <span>AI Voice...</span>
                  </span>
                )}
                {isListening && (
                  <span className="text-xs text-red-300 font-bold flex items-center space-x-1 animate-pulse">
                    <Mic className="w-4 h-4 text-red-400" />
                    <span>{t('voiceListeningState')}</span>
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-4">
              {t(currentQ.key)}
            </h3>

            {/* Controls */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => startConversationalStep(step)}
                className="p-3 bg-emerald-800 hover:bg-emerald-700 text-amber-300 rounded-full transition"
                title="Listen again"
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
                title="Mic Control"
              >
                {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>

              <div className="w-10"></div>
            </div>

          </div>

          {/* Captured Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700">
                {t('availableQuantity')}
              </label>
              {currentQ.id === 'quantityQuintals' && (
                <div className="flex bg-slate-200 p-0.5 rounded-xl text-xs font-extrabold border border-slate-300">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, unit: 'QUINTAL' }))}
                    className={`px-3 py-1 rounded-lg transition ${
                      formData.unit === 'QUINTAL' ? 'bg-emerald-950 text-amber-300 shadow' : 'text-slate-700 hover:text-emerald-900'
                    }`}
                  >
                    {t('quintalUnit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, unit: 'KG' }))}
                    className={`px-3 py-1 rounded-lg transition ${
                      formData.unit === 'KG' ? 'bg-emerald-950 text-amber-300 shadow' : 'text-slate-700 hover:text-emerald-900'
                    }`}
                  >
                    {t('kgUnit')}
                  </button>
                </div>
              )}
            </div>
            <input
              type={currentQ.id === 'quantityQuintals' || currentQ.id === 'pricePerQuintal' ? 'number' : (currentQ.id === 'harvestDate' ? 'date' : 'text')}
              value={currentQ.id === 'quantityQuintals' ? (formData.displayQuantity || formData.quantityQuintals || '') : (formData[currentQ.id] || '')}
              onChange={(e) => {
                const val = e.target.value;
                if (currentQ.id === 'quantityQuintals') {
                  const num = parseFloat(val) || 0;
                  setFormData(prev => ({
                    ...prev,
                    displayQuantity: val,
                    quantityQuintals: prev.unit === 'KG' ? num / 100.0 : num
                  }));
                } else {
                  setFormData(prev => ({ ...prev, [currentQ.id]: val }));
                }
              }}
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
              ← {t('listenAgainBtn')}
            </button>
            <button
              type="button"
              disabled={step === questions.length - 1}
              onClick={() => startConversationalStep(step + 1)}
              className="px-5 py-2 text-xs font-bold bg-emerald-800 text-amber-300 rounded-xl hover:bg-emerald-900"
            >
              {t('nextStepBtn')} →
            </button>
          </div>

          {/* Mandatory Photos Upload */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl flex items-center space-x-2.5 text-xs font-black text-emerald-950 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 animate-pulse" />
              <span>{t('uploadPhotosTitle')}</span>
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-extrabold text-slate-800 flex items-center space-x-1">
                <Upload className="w-4 h-4 text-emerald-800" />
                <span>{t('uploadImagesTitle')}</span>
              </label>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                formData.imageUrls.length >= 4 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
              }`}>
                {formData.imageUrls.length} / 5 ({t('uploadImagesCount')})
              </span>
            </div>

            <div className="space-y-2">
              <label className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold py-2.5 px-4 rounded-xl border border-dashed border-emerald-400 flex items-center justify-center space-x-2 transition cursor-pointer">
                <ImagePlus className="w-4 h-4 text-emerald-700" />
                <span>{t('uploadImagesTitle')}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={formData.imageUrls.length >= 5}
                />
              </label>

              <div className="flex space-x-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="URL..."
                  className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:border-emerald-700"
                  disabled={formData.imageUrls.length >= 5}
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  disabled={!customUrl.trim() || formData.imageUrls.length >= 5}
                  className="px-4 py-2 bg-emerald-800 text-amber-300 text-xs font-bold rounded-xl disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

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
          </>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end space-x-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600">
            {t('cancelBtn')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || formData.imageUrls.length < 4}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-extrabold rounded-2xl text-sm transition shadow disabled:opacity-50 flex items-center space-x-2"
          >
            {submitting ? t('submittingListing') : t('submitListing')}
          </button>
        </div>

      </div>
    </div>
  );
};
