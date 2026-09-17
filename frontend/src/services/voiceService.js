// Cache voices
let cachedVoices = [];

const loadVoices = () => {
  if ('speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
};

if ('speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

// Web Audio API beep sound for audio cue fallback
const playAudioCue = (frequency = 440, duration = 0.15) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio context errors
  }
};

const getBcp47Lang = (lang) => {
  if (!lang) return 'hi-IN';
  if (lang.includes('-')) return lang;
  switch (lang) {
    case 'en': return 'en-IN';
    case 'hi': return 'hi-IN';
    case 'pa': return 'pa-IN';
    case 'mr': return 'mr-IN';
    case 'gu': return 'gu-IN';
    case 'ta': return 'ta-IN';
    default: return 'hi-IN';
  }
};

export const speakText = (text, lang = 'hi-IN', onEnd = null) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Browser does not support Speech Synthesis');
    playAudioCue(600, 0.2);
    if (onEnd) setTimeout(onEnd, 1000);
    return;
  }

  // Play subtle start cue
  playAudioCue(520, 0.1);

  // Resume synthesis if paused
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  // Cancel any stuck utterances
  window.speechSynthesis.cancel();

  // Small delay after cancel for browser audio engine stability
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set target language
    const targetLang = getBcp47Lang(lang);
    utterance.lang = targetLang;
    utterance.rate = 0.85; // Natural pace
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Refresh voices if empty
    if (cachedVoices.length === 0) {
      cachedVoices = window.speechSynthesis.getVoices();
    }

    const shortLang = targetLang.split('-')[0];
    // Find best voice match for the target language
    let preferredVoice = cachedVoices.find(v => v.lang === targetLang || v.lang.startsWith(shortLang));
    if (!preferredVoice && targetLang.startsWith('hi')) {
      preferredVoice = cachedVoices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'));
    }
    if (!preferredVoice && targetLang.startsWith('en')) {
      preferredVoice = cachedVoices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india'));
    }
    if (!preferredVoice) {
      // Fallback to any Indian voice or default system voice
      preferredVoice = cachedVoices.find(v => v.lang.includes('IN') || v.lang.startsWith('en')) || cachedVoices[0];
    }

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    let hasEnded = false;

    const cleanupAndEnd = () => {
      if (!hasEnded) {
        hasEnded = true;
        if (onEnd) onEnd();
      }
    };

    utterance.onend = () => {
      cleanupAndEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error event:', e);
      cleanupAndEnd();
    };

    // Safety timeout in case speech engine hangs
    const estimatedDuration = Math.max(3000, text.length * 120);
    setTimeout(() => {
      if (!hasEnded && window.speechSynthesis.speaking) {
        cleanupAndEnd();
      }
    }, estimatedDuration);

    try {
      window.speechSynthesis.speak(utterance);
      
      // Chrome workaround: resume if speech gets stuck
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (err) {
      console.error('Error executing speak:', err);
      cleanupAndEnd();
    }
  }, 50);
};

export const createSpeechRecognizer = (onResult, onError, lang = 'hi-IN') => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('Browser does not support Speech Recognition');
    if (onError) onError('Speech Recognition is not supported in this browser. You can type manually.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = getBcp47Lang(lang);

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (onResult) onResult(transcript);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    if (onError) onError(event.error);
  };

  return recognition;
};
