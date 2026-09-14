import React, { createContext, useContext, useState } from 'react';

const translations = {
  hi: {
    appName: "मूल्य",
    tagline: "किसानों और खरीदारों को जोड़ने का स्मार्ट मंच",
    farmerDashboard: "किसान डैशबोर्ड",
    buyerDashboard: "खरीदार डैशबोर्ड",
    listProduce: "नया उत्पाद जोड़ें",
    searchProduce: "फसल खोजें",
    myOrders: "मेरे ऑर्डर",
    transactions: "लेन-देन / आय",
    ratings: "रेटिंग और फीडबैक",
    postRequirement: "आवश्यकता पोस्ट करें",
    logout: "लॉगआउट",
    login: "लॉगिन",
    register: "पंजीकरण करें",
    farmerRole: "किसान",
    buyerRole: "खरीदार",
    
    // Voice Assistant Modal
    voiceAssistantTitle: "एआई वॉइस फसल लिस्टिंग असिस्टेंट",
    voicePrompt1: "कौन सी फसल बेचना चाहते हैं?",
    voicePrompt2: "कितनी मात्रा (क्विंटल) उपलब्ध है?",
    voicePrompt3: "आपकी लोकेशन/गाँव कहाँ है? (जिला और राज्य)",
    voicePrompt4: "फसल कब काटी गई थी (कटाई की तारीख)?",
    voicePrompt5: "फसल उगाते समय कौन से कीटनाशक (Pesticides) इस्तेमाल हुए?",
    voicePrompt6: "आपका अपेक्षित मूल्य (रु/क्विंटल) क्या है?",
    
    uploadImages: "फसल की 4 से 5 तस्वीरें अपलोड करें (अनिवार्य)",
    uploadImagesCount: "तस्वीरें (कम से कम 4 आवश्यक)",
    submitListing: "उत्पाद जोड़ें",
    qualityGrade: "गुणवत्ता ग्रेड",
    gradeA: "ग्रेड A (जैविक / ताजा)",
    gradeB: "ग्रेड B (मानक कीटनाशक)",
    gradeC: "ग्रेड C (रासायनिक / पुराना)",
    
    // Deal workflow
    requestDeal: "सीधा संपर्क / ऑर्डर अनुरोध",
    acceptDeal: "स्वीकार करें और तारीख तय करें",
    declineDeal: "अस्वीकार करें",
    incomingDealAlert: "नया खरीदार ऑर्डर अनुरोध!",
    speakReply: "आवाज में जवाब दें (जैसे: मैं 15 अप्रैल तक दे दूँगा)",

    // Buyer discovery
    trustScore: "विश्वास व मैच स्कोर",
    netEarnings: "निवल कमाई का विवरण",
    grossTotal: "कुल मूल्य",
    estimatedTransport: "अनुमानित परिवहन लागत",
    netProfit: "किसान निवल आय",
    contactFarmer: "किसान से संपर्क",
  },
  en: {
    appName: "Moolya",
    tagline: "Smart Direct Farmer-to-Buyer Marketplace",
    farmerDashboard: "Farmer Dashboard",
    buyerDashboard: "Buyer Dashboard",
    listProduce: "List New Product",
    searchProduce: "Search Produce",
    myOrders: "My Orders",
    transactions: "Payment & Earnings",
    ratings: "Ratings & Feedback",
    postRequirement: "Post Requirement",
    logout: "Logout",
    login: "Login",
    register: "Register",
    farmerRole: "Farmer",
    buyerRole: "Buyer",

    // Voice Assistant Modal
    voiceAssistantTitle: "AI Voice Produce Listing Assistant",
    voicePrompt1: "Which crop do you want to sell?",
    voicePrompt2: "How much quantity (in Quintals) is available?",
    voicePrompt3: "Where is your location/village? (District & State)",
    voicePrompt4: "When was the crop harvested (Harvest Date)?",
    voicePrompt5: "Which pesticides and how much were used?",
    voicePrompt6: "What is your expected price (Rs per Quintal)?",

    uploadImages: "Upload 4 to 5 photos of produce (Mandatory)",
    uploadImagesCount: "Photos (Min 4 required)",
    submitListing: "Add Product",
    qualityGrade: "Quality Grade",
    gradeA: "Grade A (Organic / Fresh)",
    gradeB: "Grade B (Standard Pesticides)",
    gradeC: "Grade C (Chemical / Stored)",

    // Deal workflow
    requestDeal: "Direct Interest / Order Request",
    acceptDeal: "Accept & Set Harvest/Delivery Date",
    declineDeal: "Decline",
    incomingDealAlert: "New Buyer Order Request!",
    speakReply: "Reply via Voice (e.g., I will deliver by April 15)",

    // Buyer discovery
    trustScore: "Trust & Match Score",
    netEarnings: "Net Earnings Breakdown",
    grossTotal: "Gross Value",
    estimatedTransport: "Est. Transport Cost",
    netProfit: "Net Farmer Profit",
    contactFarmer: "Contact Farmer",
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('hi'); // Default Hindi for Farmer

  const toggleLanguage = () => {
    setLang(prev => prev === 'hi' ? 'en' : 'hi');
  };

  const t = (key) => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
