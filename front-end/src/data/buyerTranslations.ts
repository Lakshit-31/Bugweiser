import type { LanguageCode } from '@/types';

export interface BuyerTranslations {
  // Navbar
  portalBadge: string;
  navDashboard: string;
  navMarketplace: string;
  navRequirements: string;
  navCompare: string;
  navChat: string;
  navOrders: string;
  navTransactions: string;
  navReviews: string;
  navMore: string;
  farmerMode: string;
  returnHome: string;
  enterpriseBuyer: string;
  escrowProtected: string;
  selectLanguage: string;
  profileSettings: string;
  logout: string;

  // Guided Flow Bar
  sihDemoGuide: string;
  sihFlowSub: string;
  prevStep: string;
  nextStep: string;
  flowSteps: {
    auth: string;
    dashboard: string;
    marketplace: string;
    filter: string;
    produceDetails: string;
    farmerProfile: string;
    matchScore: string;
    compare: string;
    chat: string;
    orderRequest: string;
    orders: string;
    transactions: string;
    feedback: string;
  };

  // Dashboard
  welcomeBack: string;
  dashboardSub: string;
  postRequirementBtn: string;
  browseMarketplaceBtn: string;
  kpiActiveRequirements: string;
  kpiProcuredVolume: string;
  kpiEscrowSpend: string;
  kpiAvgMatchScore: string;
  kpiFarmerBids: string;
  kpiVolumeTrend: string;
  kpiDisputeFree: string;
  kpiOptimalIndex: string;
  livePriceTicker: string;
  compareMatrixBtn: string;
  activeInTransit: string;
  trackTimelineBtn: string;
  topMatchesTitle: string;
  topMatchesSub: string;
  viewAllLotsBtn: string;
  activeDemandsTitle: string;
  activeDemandsSub: string;
  findMatchesBtn: string;
  manageAllReqsBtn: string;
  buyerToolkit: string;

  // Categories
  catAll: string;
  catGrains: string;
  catVegetables: string;
  catOilseeds: string;
  catCommercial: string;
  catPulses: string;
  catSpices: string;

  // Marketplace & Filter
  marketplaceTitle: string;
  marketplaceSub: string;
  filtersAndSorting: string;
  searchPlaceholder: string;
  showingLots: string;
  directFarmgateMsg: string;
  directPriceLabel: string;
  mandiRefLabel: string;
  savePercent: string;
  inspectDetailsBtn: string;
  orderRequestBtn: string;
  bestMatchBadge: string;
  highMatchBadge: string;

  // Price Compare
  priceCompareTitle: string;
  priceCompareSub: string;
  mandiSavingsMode: string;
  quantitySimulatorTitle: string;
  quantitySimulatorSub: string;
  landedCostTitle: string;
  baseFarmgatePrice: string;
  freightToWarehouse: string;
  totalLandedCost: string;
  savingsVsMandi: string;
  recommendedBestOffer: string;
  orderAtRateBtn: string;

  // Chat
  chatWorkspaceTitle: string;
  chatVerifiedBadge: string;
  activeNegotiations: string;
  onlineBadge: string;
  quickRepliesTitle: string;
  createOrderProposalBtn: string;
  chatInputPlaceholder: string;

  // Orders
  ordersTitle: string;
  ordersSub: string;
  milestonePlaced: string;
  milestoneAccepted: string;
  milestoneInspected: string;
  milestoneInTransit: string;
  milestoneDelivered: string;
  chatFarmerBtn: string;
  viewInvoiceBtn: string;
  rateReviewBtn: string;

  // Transactions
  transactionsTitle: string;
  transactionsSub: string;
  totalOutflow: string;
  activeEscrowTrust: string;
  disbursedToFarmers: string;
  netSavingsMandi: string;

  // Reviews
  ratingsTitle: string;
  ratingsSub: string;
  tabGivenReviews: string;
  tabReceivedReviews: string;
  avgQualityRating: string;
  onTimeEscrowRate: string;
  repeatFarmerSourcing: string;

  // Common
  currencyPerKg: string;
  availableStock: string;
  harvestDate: string;
  distanceAway: string;
}

export const buyerTranslations: Record<LanguageCode, BuyerTranslations> = {
  en: {
    portalBadge: 'Buyer Portal',
    navDashboard: 'Dashboard',
    navMarketplace: 'Marketplace',
    navRequirements: 'Requirements',
    navCompare: 'Price Compare',
    navChat: 'Farmer Chat',
    navOrders: 'Orders',
    navTransactions: 'Transactions',
    navReviews: 'Ratings',
    navMore: 'More',
    farmerMode: 'Farmer Mode',
    returnHome: '← Return to Homepage',
    enterpriseBuyer: 'Enterprise Buyer',
    escrowProtected: '✓ 100% Escrow Protected',
    selectLanguage: 'Select Language',
    profileSettings: 'Profile & KYC Settings',
    logout: 'Logout',

    sihDemoGuide: 'SIH Demo Guide',
    sihFlowSub: '13-Stage Verified Buyer Sourcing Journey',
    prevStep: '← Back',
    nextStep: 'Next Step →',
    flowSteps: {
      auth: '1. Auth',
      dashboard: '2. Dashboard',
      marketplace: '3. Marketplace',
      filter: '4. Filters',
      produceDetails: '5. Produce Details',
      farmerProfile: '6. Farmer Profile',
      matchScore: '7. Match Score',
      compare: '8. Price Compare',
      chat: '9. Chat',
      orderRequest: '10. Order Request',
      orders: '11. Orders',
      transactions: '12. Transactions',
      feedback: '13. Feedback',
    },

    welcomeBack: 'Welcome back',
    dashboardSub: 'Direct farmgate procurement across Rajasthan, Punjab & Haryana. Zero middlemen margins.',
    postRequirementBtn: '+ Post Requirement',
    browseMarketplaceBtn: 'Browse Marketplace',
    kpiActiveRequirements: 'Active Requirements',
    kpiProcuredVolume: 'Procured Volume',
    kpiEscrowSpend: 'Escrow Spend',
    kpiAvgMatchScore: 'Avg Match Score',
    kpiFarmerBids: '12 farmer bids matching',
    kpiVolumeTrend: '+24% vs last month',
    kpiDisputeFree: '100% dispute-free settlements',
    kpiOptimalIndex: 'Optimal price & logistics index',
    livePriceTicker: 'Live Mandi Benchmark vs Direct Farmgate Savings',
    compareMatrixBtn: 'Launch Comparison Matrix →',
    activeInTransit: 'Active In-Transit Shipment',
    trackTimelineBtn: 'Track Full Timeline →',
    topMatchesTitle: 'Top AI-Matched Lots for Your Profile',
    topMatchesSub: 'Algorithmically scored against your quality & location preferences',
    viewAllLotsBtn: 'View All Lots →',
    activeDemandsTitle: 'Active Procurement Demands',
    activeDemandsSub: 'demands currently matching',
    findMatchesBtn: 'Find Farmer Matches →',
    manageAllReqsBtn: 'Manage All Requirements →',
    buyerToolkit: 'Buyer Procurement Toolkit',

    catAll: 'All',
    catGrains: 'Grains',
    catVegetables: 'Vegetables',
    catOilseeds: 'Oilseeds',
    catCommercial: 'Commercial',
    catPulses: 'Pulses',
    catSpices: 'Spices',

    marketplaceTitle: 'Produce Marketplace',
    marketplaceSub: 'Browse active, verified produce lots directly from farmers. Filter by grade, distance & match score.',
    filtersAndSorting: 'Filters & Sorting',
    searchPlaceholder: 'Search crop, farmer, or city...',
    showingLots: 'Showing available lots',
    directFarmgateMsg: '✓ All prices are direct farmgate quotes',
    directPriceLabel: 'Direct Price',
    mandiRefLabel: 'Mandi Ref',
    savePercent: 'Save',
    inspectDetailsBtn: 'Inspect Details',
    orderRequestBtn: 'Order Request',
    bestMatchBadge: 'Best Match',
    highMatchBadge: 'High Match',

    priceCompareTitle: 'Price & Landed Cost Comparison',
    priceCompareSub: 'Compare active farmer quotes side-by-side. Calculate exact landed costs at your warehouse including freight.',
    mandiSavingsMode: 'APMC Mandi Savings Mode Active',
    quantitySimulatorTitle: 'Interactive Quantity Simulator',
    quantitySimulatorSub: 'Drag slider to recalculate total freight, total landed expenditure, and net savings vs Mandi.',
    landedCostTitle: 'Total Landed Cost',
    baseFarmgatePrice: 'Base Farmgate Price',
    freightToWarehouse: 'Freight to Warehouse',
    totalLandedCost: 'Total Landed Cost',
    savingsVsMandi: 'Savings vs Mandi',
    recommendedBestOffer: 'Recommended Best Value Offer',
    orderAtRateBtn: 'Order @',

    chatWorkspaceTitle: 'Farmer-Buyer Chat Workspace',
    chatVerifiedBadge: 'End-to-End Trade Verified',
    activeNegotiations: 'Active Negotiations',
    onlineBadge: 'Online',
    quickRepliesTitle: 'Quick Replies:',
    createOrderProposalBtn: 'Create Order Request',
    chatInputPlaceholder: 'Type your price offer, specifications inquiry, or logistics question...',

    ordersTitle: 'Orders & Shipment Tracking',
    ordersSub: 'Monitor orders through all 5 trade milestones from farmer confirmation to warehouse delivery.',
    milestonePlaced: '1. Order Placed',
    milestoneAccepted: '2. Farmer Accepted',
    milestoneInspected: '3. Quality Inspected',
    milestoneInTransit: '4. In Transit',
    milestoneDelivered: '5. Delivered & Settled',
    chatFarmerBtn: 'Chat Farmer',
    viewInvoiceBtn: 'Invoice',
    rateReviewBtn: 'Rate & Review',

    transactionsTitle: 'Transaction History & Settlements',
    transactionsSub: 'Complete audit trail of Agri-Escrow funds, farmgate disbursements, and logistics remittances.',
    totalOutflow: 'Total Trade Outflow',
    activeEscrowTrust: 'Active in Escrow Trust',
    disbursedToFarmers: 'Disbursed to Farmers',
    netSavingsMandi: 'Net Savings vs Mandi',

    ratingsTitle: 'Ratings, Feedback & Endorsements',
    ratingsSub: 'Build verifiable procurement trust through transparent multi-criteria evaluations.',
    tabGivenReviews: 'Reviews Given to Farmers',
    tabReceivedReviews: 'Farmer Endorsements for You',
    avgQualityRating: 'Average Quality Rating',
    onTimeEscrowRate: 'On-Time Escrow Clearance',
    repeatFarmerSourcing: 'Repeat Farmer Sourcing',

    currencyPerKg: '₹/kg',
    availableStock: 'Available Stock',
    harvestDate: 'Harvest Date',
    distanceAway: 'away',
  },

  hi: {
    portalBadge: 'खरीदार पोर्टल',
    navDashboard: 'डैशबोर्ड',
    navMarketplace: 'मंडी बाज़ार',
    navRequirements: 'मांग सूची',
    navCompare: 'मूल्य तुलना',
    navChat: 'किसान चैट',
    navOrders: 'ऑर्डर',
    navTransactions: 'लेन-देन',
    navReviews: 'रेटिंग्स',
    navMore: 'अन्य',
    farmerMode: 'किसान मोड',
    returnHome: '← होमपेज पर लौटें',
    enterpriseBuyer: 'प्रमाणित खरीदार',
    escrowProtected: '✓ १००% एस्क्रो सुरक्षित',
    selectLanguage: 'भाषा चुनें',
    profileSettings: 'प्रोफाइल एवं केवाईसी',
    logout: 'लॉग आउट',

    sihDemoGuide: 'एस.आई.एच प्रस्तुति गाइड',
    sihFlowSub: '१३-चरणीय सत्यापित खरीदार खरीद प्रक्रिया',
    prevStep: '← पिछला',
    nextStep: 'अगला चरण →',
    flowSteps: {
      auth: '१. लॉगिन',
      dashboard: '२. डैशबोर्ड',
      marketplace: '३. मंडी बाज़ार',
      filter: '४. फिल्टर',
      produceDetails: '५. फसल विवरण',
      farmerProfile: '६. किसान प्रोफाइल',
      matchScore: '७. मैच स्कोर',
      compare: '८. मूल्य तुलना',
      chat: '९. किसान चैट',
      orderRequest: '१०. ऑर्डर प्रस्ताव',
      orders: '११. ऑर्डर ट्रैकिंग',
      transactions: '१२. लेन-देन',
      feedback: '१३. रेटिंग व समीक्षा',
    },

    welcomeBack: 'स्वागत है',
    dashboardSub: 'राजस्थान, पंजाब और हरियाणा से सीधे खेत से खरीद। बिचौलियों का शून्य कमीशन।',
    postRequirementBtn: '+ नई मांग पोस्ट करें',
    browseMarketplaceBtn: 'मंडी बाज़ार देखें',
    kpiActiveRequirements: 'सक्रिय मांगें',
    kpiProcuredVolume: 'खरीदी गई मात्रा',
    kpiEscrowSpend: 'एस्क्रो व्यय',
    kpiAvgMatchScore: 'औसत मैच स्कोर',
    kpiFarmerBids: '१२ किसान प्रस्ताव उपलब्ध',
    kpiVolumeTrend: '+२४% पिछले माह से',
    kpiDisputeFree: '१००% विवाद-मुक्त भुगतान',
    kpiOptimalIndex: 'इष्टतम मूल्य व रसद सूचकांक',
    livePriceTicker: 'लाइव मंडी भाव बनाम सीधा खेत से बचत',
    compareMatrixBtn: 'मूल्य तुलना मैट्रिक्स खोलें →',
    activeInTransit: 'सक्रिय परिवहन में खेप',
    trackTimelineBtn: 'पूरी स्थिति ट्रैक करें →',
    topMatchesTitle: 'आपकी प्रोफाइल के लिए शीर्ष एआई मैच',
    topMatchesSub: 'गुणवत्ता और स्थान के आधार पर स्वचालित रूप से मिलाई गई फसलें',
    viewAllLotsBtn: 'सभी फसलें देखें →',
    activeDemandsTitle: 'सक्रिय खरीद मांगें',
    activeDemandsSub: 'मांगें वर्तमान में मेल खा रही हैं',
    findMatchesBtn: 'किसान मैच खोजें →',
    manageAllReqsBtn: 'सभी मांगें प्रबंधित करें →',
    buyerToolkit: 'खरीदार खरीद टूलकिट',

    catAll: 'सभी',
    catGrains: 'अनाज',
    catVegetables: 'सब्जियां',
    catOilseeds: 'तिलहन',
    catCommercial: 'व्यावसायिक',
    catPulses: 'दालें',
    catSpices: 'मसाले',

    marketplaceTitle: 'फसल मंडी बाज़ार',
    marketplaceSub: 'किसानों से सीधे सत्यापित फसल देखें। ग्रेड, दूरी और मैच स्कोर के अनुसार फ़िल्टर करें।',
    filtersAndSorting: 'फ़िल्टर एवं क्रमबद्ध करें',
    searchPlaceholder: 'फसल, किसान या शहर खोजें...',
    showingLots: 'उपलब्ध फसलें दिखाई जा रही हैं',
    directFarmgateMsg: '✓ सभी मूल्य सीधे खेत के भाव हैं',
    directPriceLabel: 'सीधा भाव',
    mandiRefLabel: 'मंडी संदर्भ',
    savePercent: 'बचत',
    inspectDetailsBtn: 'विवरण देखें',
    orderRequestBtn: 'ऑर्डर अनुरोध',
    bestMatchBadge: 'सर्वश्रेष्ठ मैच',
    highMatchBadge: 'उत्तम मैच',

    priceCompareTitle: 'मूल्य एवं कुल लागत तुलना',
    priceCompareSub: 'किसानों के प्रस्तावों की साथ-साथ तुलना करें। गोदाम तक भाड़ा जोड़कर सटीक लागत जानें।',
    mandiSavingsMode: 'मंडी बचत मोड सक्रिय',
    quantitySimulatorTitle: 'इंटरैक्टिव मात्रा सिम्युलेटर',
    quantitySimulatorSub: 'स्लाइडर चलाकर कुल भाड़ा, कुल खर्च और मंडी की तुलना में शुद्ध बचत देखें।',
    landedCostTitle: 'गोदाम तक कुल लागत',
    baseFarmgatePrice: 'खेत का आधार मूल्य',
    freightToWarehouse: 'गोदाम तक भाड़ा',
    totalLandedCost: 'कुल लागत',
    savingsVsMandi: 'मंडी से बचत',
    recommendedBestOffer: 'अनुशंसित सर्वश्रेष्ठ मूल्य प्रस्ताव',
    orderAtRateBtn: 'ऑर्डर करें @',

    chatWorkspaceTitle: 'किसान-खरीदार चैट कार्यक्षेत्र',
    chatVerifiedBadge: 'सत्यापित सुरक्षित व्यापार',
    activeNegotiations: 'सक्रिय बातचीत',
    onlineBadge: 'ऑनलाइन',
    quickRepliesTitle: 'त्वरित उत्तर:',
    createOrderProposalBtn: 'ऑर्डर अनुरोध बनाएं',
    chatInputPlaceholder: 'अपना भाव, गुणवत्ता प्रश्न या परिवहन विवरण लिखें...',

    ordersTitle: 'ऑर्डर एवं खेप ट्रैकिंग',
    ordersSub: 'किसान की स्वीकृति से लेकर गोदाम डिलीवरी तक सभी ५ चरणों की निगरानी करें।',
    milestonePlaced: '१. ऑर्डर दिया',
    milestoneAccepted: '२. किसान स्वीकृत',
    milestoneInspected: '३. गुणवत्ता जांच',
    milestoneInTransit: '४. परिवहन में',
    milestoneDelivered: '५. प्राप्त एवं भुगतान',
    chatFarmerBtn: 'किसान से चैट',
    viewInvoiceBtn: 'चालान (इनवॉइस)',
    rateReviewBtn: 'रेटिंग दें',

    transactionsTitle: 'लेन-देन इतिहास एवं भुगतान',
    transactionsSub: 'एग्री-एस्क्रो फंड, किसान भुगतान और रसद भुगतानों का संपूर्ण विवरण।',
    totalOutflow: 'कुल व्यापार भुगतान',
    activeEscrowTrust: 'एस्क्रो ट्रस्ट में सुरक्षित',
    disbursedToFarmers: 'किसानों को भुगतान',
    netSavingsMandi: 'मंडी की तुलना में बचत',

    ratingsTitle: 'रेटिंग, समीक्षा एवं विश्वास',
    ratingsSub: 'पारदर्शी बहु-मापदंड मूल्यांकन से खरीद विश्वसनीयता बनाएं।',
    tabGivenReviews: 'किसानों को दी गई समीक्षाएं',
    tabReceivedReviews: 'किसानों से मिली प्रशंसाएं',
    avgQualityRating: 'औसत गुणवत्ता रेटिंग',
    onTimeEscrowRate: 'समय पर एस्क्रो भुगतान',
    repeatFarmerSourcing: 'दोबारा जुड़े किसान',

    currencyPerKg: '₹/किग्रा',
    availableStock: 'उपलब्ध स्टॉक',
    harvestDate: 'कटाई की तिथि',
    distanceAway: 'दूर',
  },

  mr: {
    portalBadge: 'खरेदीदार पोर्टल',
    navDashboard: 'डॅशबोर्ड',
    navMarketplace: 'बाजारपेठ',
    navRequirements: 'मागणी यादी',
    navCompare: 'किंमत तुलना',
    navChat: 'शेतकरी चॅट',
    navOrders: 'ऑर्डर्स',
    navTransactions: 'व्यवहार',
    navReviews: 'रेटिंग्स',
    navMore: 'अधिक',
    farmerMode: 'शेतकरी मोड',
    returnHome: '← मुख्यपृष्ठावर परत जा',
    enterpriseBuyer: 'प्रमाणित खरेदीदार',
    escrowProtected: '✓ १००% एस्क्रो सुरक्षित',
    selectLanguage: 'भाषा निवडा',
    profileSettings: 'प्रोफाइल व केवायसी',
    logout: 'लॉगआउट',

    sihDemoGuide: 'एसआयएच सादरीकरण मार्गदर्शक',
    sihFlowSub: '१३-टप्प्यांची सत्यापित खरेदीदार खरेदी प्रक्रिया',
    prevStep: '← मागे',
    nextStep: 'पुढील टप्पा →',
    flowSteps: {
      auth: '१. लॉगिन',
      dashboard: '२. डॅशबोर्ड',
      marketplace: '३. बाजारपेठ',
      filter: '४. फिल्टर्स',
      produceDetails: '५. पीक तपशील',
      farmerProfile: '६. शेतकरी प्रोफाइल',
      matchScore: '७. मॅच स्कोअर',
      compare: '८. किंमत तुलना',
      chat: '९. शेतकरी चॅट',
      orderRequest: '१०. ऑर्डर विनंती',
      orders: '११. ऑर्डर्स ट्रॅकिंग',
      transactions: '१२. व्यवहार',
      feedback: '१३. अभिप्राय',
    },

    welcomeBack: 'स्वागत आहे',
    dashboardSub: 'शेतकऱ्यांकडून थेट शेतातून खरेदी. मध्यस्थांचे शून्य कमिशन.',
    postRequirementBtn: '+ नवीन मागणी नोंदवा',
    browseMarketplaceBtn: 'बाजारपेठ पहा',
    kpiActiveRequirements: 'सक्रिय मागण्या',
    kpiProcuredVolume: 'खरेदी केलेले प्रमाण',
    kpiEscrowSpend: 'एस्क्रो खर्च',
    kpiAvgMatchScore: 'सरासरी मॅच स्कोअर',
    kpiFarmerBids: '१२ शेतकरी प्रस्ताव उपलब्ध',
    kpiVolumeTrend: '+२४% मागील महिन्यापेक्षा',
    kpiDisputeFree: '१००% विवादमुक्त देयके',
    kpiOptimalIndex: 'उत्कृष्ट किंमत व वाहतूक निर्देशांक',
    livePriceTicker: 'थेट बाजार भाव विरुद्ध थेट शेत बचत',
    compareMatrixBtn: 'किंमत तुलना मॅट्रिक्स उघडा →',
    activeInTransit: 'वाहतुकीमध्ये सक्रिय माल',
    trackTimelineBtn: 'संपूर्ण ट्रॅकिंग पहा →',
    topMatchesTitle: 'तुमच्या प्रोफाइलसाठी सर्वोत्तम मॅच',
    topMatchesSub: 'गुणवत्ता आणि स्थानानुसार जुळवलेली पिके',
    viewAllLotsBtn: 'सर्व पिके पहा →',
    activeDemandsTitle: 'सक्रिय खरेदी मागण्या',
    activeDemandsSub: 'मागण्या सध्या जुळत आहेत',
    findMatchesBtn: 'शेतकरी मॅच शोधा →',
    manageAllReqsBtn: 'सर्व मागण्या व्यवस्थापित करा →',
    buyerToolkit: 'खरेदीदार टूलकिट',

    catAll: 'सर्व',
    catGrains: 'धान्य',
    catVegetables: 'भाज्या',
    catOilseeds: 'गळीत धान्ये',
    catCommercial: 'व्यावसायिक',
    catPulses: 'कडधान्ये',
    catSpices: 'मसाले',

    marketplaceTitle: 'पीक बाजारपेठ',
    marketplaceSub: 'शेतकऱ्यांकडून थेट उपलब्ध पिके पहा. प्रतवारी आणि अंतराप्रमाणे फिल्टर करा.',
    filtersAndSorting: 'फिल्टर्स व क्रमवारी',
    searchPlaceholder: 'पीक, शेतकरी किंवा शहर शोधा...',
    showingLots: 'उपलब्ध पिके दाखवत आहे',
    directFarmgateMsg: '✓ सर्व दर थेट शेतातील आहेत',
    directPriceLabel: 'थेट दर',
    mandiRefLabel: 'बाजार संदर्भ',
    savePercent: 'बचत',
    inspectDetailsBtn: 'तपशील पहा',
    orderRequestBtn: 'ऑर्डर विनंती',
    bestMatchBadge: 'उत्कृष्ट मॅच',
    highMatchBadge: 'चांगला मॅच',

    priceCompareTitle: 'किंमत आणि एकूण खर्च तुलना',
    priceCompareSub: 'शेतकऱ्यांच्या दरांची थेट तुलना करा. गोदामापर्यंत वाहतूक खर्चासह अचूक रक्कम जाणून घ्या.',
    mandiSavingsMode: 'बाजारपेठ बचत मोड सक्रिय',
    quantitySimulatorTitle: 'इंटरॅक्टिव्ह प्रमाण सिम्युलेटर',
    quantitySimulatorSub: 'स्लाइडर फिरवून एकूण वाहतूक, एकूण खर्च आणि निव्वळ बचत पहा.',
    landedCostTitle: 'गोदामापर्यंत एकूण किंमत',
    baseFarmgatePrice: 'शेतातील मूळ किंमत',
    freightToWarehouse: 'गोदामापर्यंत वाहतूक',
    totalLandedCost: 'एकूण खर्च',
    savingsVsMandi: 'बाजारपेठेपेक्षा बचत',
    recommendedBestOffer: 'शिफारस केलेली सर्वोत्तम ऑफर',
    orderAtRateBtn: 'ऑर्डर करा @',

    chatWorkspaceTitle: 'शेतकरी-खरेदीदार चॅट',
    chatVerifiedBadge: 'सत्यापित सुरक्षित व्यापार',
    activeNegotiations: 'सक्रिय चर्चा',
    onlineBadge: 'ऑनलाइन',
    quickRepliesTitle: 'जलद उत्तरे:',
    createOrderProposalBtn: 'ऑर्डर विनंती तयार करा',
    chatInputPlaceholder: 'तुमचा दर, प्रतवारी प्रश्न किंवा वाहतूक तपशील लिहा...',

    ordersTitle: 'ऑर्डर्स व माल ट्रॅकिंग',
    ordersSub: 'शेतकऱ्याच्या मंजुरीपासून ते गोदामात पोहचेपर्यंत सर्व ५ टप्प्यांचे निरीक्षण करा.',
    milestonePlaced: '१. ऑर्डर दिली',
    milestoneAccepted: '२. शेतकरी मंजूर',
    milestoneInspected: '३. गुणवत्ता तपासणी',
    milestoneInTransit: '४. वाहतुकीत',
    milestoneDelivered: '५. प्राप्त व अदा',
    chatFarmerBtn: 'शेतकऱ्याशी चॅट',
    viewInvoiceBtn: 'चलन (इनव्हॉइस)',
    rateReviewBtn: 'रेटिंग द्या',

    transactionsTitle: 'व्यवहार इतिहास व देयके',
    transactionsSub: 'एस्क्रो निधी, शेतकरी देयके आणि वाहतूक खर्चाचे संपूर्ण विवरण.',
    totalOutflow: 'एकूण व्यापार खर्च',
    activeEscrowTrust: 'एस्क्रो ट्रस्टमध्ये सुरक्षित',
    disbursedToFarmers: 'शेतकऱ्यांना अदा',
    netSavingsMandi: 'बाजारपेठेपेक्षा बचत',

    ratingsTitle: 'रेटिंग, अभिप्राय व विश्वास',
    ratingsSub: 'पारदर्शक बहु-निकष मूल्यांकनाद्वारे विश्वासार्हता निर्माण करा.',
    tabGivenReviews: 'शेतकऱ्यांना दिलेले अभिप्राय',
    tabReceivedReviews: 'शेतकऱ्यांकडून मिळालेली मते',
    avgQualityRating: 'सरासरी गुणवत्ता रेटिंग',
    onTimeEscrowRate: 'वेळेवर एस्क्रो पूर्तता',
    repeatFarmerSourcing: 'पुन्हा जोडलेले शेतकरी',

    currencyPerKg: '₹/किलो',
    availableStock: 'उपलब्ध साठा',
    harvestDate: 'कापणी तारीख',
    distanceAway: 'लांब',
  },

  pa: {
    portalBadge: 'ਖਰੀਦਦਾਰ ਪੋਰਟਲ',
    navDashboard: 'ਡੈਸ਼ਬੋਰਡ',
    navMarketplace: 'ਮੰਡੀ ਬਜ਼ਾਰ',
    navRequirements: 'ਮੰਗ ਸੂਚੀ',
    navCompare: 'ਮੁੱਲ ਤੁਲਨਾ',
    navChat: 'ਕਿਸਾਨ ਚੈਟ',
    navOrders: 'ਆਰਡਰ',
    navTransactions: 'ਲੈਣ-ਦੇਣ',
    navReviews: 'ਰੇਟਿੰਗਾਂ',
    navMore: 'ਹੋਰ',
    farmerMode: 'ਕਿਸਾਨ ਮੋਡ',
    returnHome: '← ਮੁੱਖ ਪੰਨੇ ਤੇ ਵਾਪਸ ਜਾਓ',
    enterpriseBuyer: 'ਪ੍ਰਮਾਣਿਤ ਖਰੀਦਦਾਰ',
    escrowProtected: '✓ ੧੦੦% ਐਸਕਰੋ ਸੁਰੱਖਿਅਤ',
    selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    profileSettings: 'ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਕੇਵਾਈਸੀ',
    logout: 'ਲਾਗਆਉਟ',

    sihDemoGuide: 'ਐਸ.ਆਈ.ਐਚ ਡੈਮੋ ਗਾਈਡ',
    sihFlowSub: '੧੩-ਪੜਾਵੀ ਪ੍ਰਮਾਣਿਤ ਖਰੀਦਦਾਰ ਖਰੀਦ ਪ੍ਰਕਿਰਿਆ',
    prevStep: '← ਪਿੱਛੇ',
    nextStep: 'ਅਗਲਾ ਪੜਾਅ →',
    flowSteps: {
      auth: '੧. ਲਾਗਇਨ',
      dashboard: '੨. ਡੈਸ਼ਬੋਰਡ',
      marketplace: '੩. ਮੰਡੀ ਬਜ਼ਾਰ',
      filter: '੪. ਫਿਲਟਰ',
      produceDetails: '੫. ਫ਼ਸਲ ਵੇਰਵਾ',
      farmerProfile: '੬. ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ',
      matchScore: '੭. ਮੈਚ ਸਕੋਰ',
      compare: '੮. ਮੁੱਲ ਤੁਲਨਾ',
      chat: '੯. ਕਿਸਾਨ ਚੈਟ',
      orderRequest: '੧੦. ਆਰਡਰ ਬੇਨਤੀ',
      orders: '੧੧. ਆਰਡਰ ਟਰੈਕਿੰਗ',
      transactions: '੧੨. ਲੈਣ-ਦੇਣ',
      feedback: '੧੩. ਫੀਡਬੈਕ',
    },

    welcomeBack: 'ਜੀ ਆਇਆਂ ਨੂੰ',
    dashboardSub: 'ਪੰਜਾਬ, ਹਰਿਆਣਾ ਅਤੇ ਰਾਜਸਥਾਨ ਦੇ ਕਿਸਾਨਾਂ ਤੋਂ ਸਿੱਧੀ ਖੇਤ-ਖਰੀਦ। ਜ਼ੀਰੋ ਵਿਚੋਲੀਆ ਕਮਿਸ਼ਨ।',
    postRequirementBtn: '+ ਨਵੀਂ ਮੰਗ ਪੋਸਟ ਕਰੋ',
    browseMarketplaceBtn: 'ਮੰਡੀ ਬਜ਼ਾਰ ਦੇਖੋ',
    kpiActiveRequirements: 'ਸਰਗਰਮ ਮੰਗਾਂ',
    kpiProcuredVolume: 'ਖਰੀਦੀ ਮਾਤਰਾ',
    kpiEscrowSpend: 'ਐਸਕਰੋ ਖਰਚਾ',
    kpiAvgMatchScore: 'ਔਸਤ ਮੈਚ ਸਕੋਰ',
    kpiFarmerBids: '੧੨ ਕਿਸਾਨ ਪ੍ਰਸਤਾਵ ਉਪਲਬਧ',
    kpiVolumeTrend: '+੨੪% ਪਿਛਲੇ ਮਹੀਨੇ ਨਾਲੋਂ',
    kpiDisputeFree: '੧੦੦% ਵਿਵਾਦ-ਮੁਕਤ ਭੁਗਤਾਨ',
    kpiOptimalIndex: 'ਵਧੀਆ ਮੁੱਲ ਤੇ ਢੋਆ-ਢੁਆਈ ਇੰਡੈਕਸ',
    livePriceTicker: 'ਮੰਡੀ ਭਾਅ ਬਨਾਮ ਸਿੱਧੀ ਖੇਤ ਬੱਚਤ',
    compareMatrixBtn: 'ਮੁੱਲ ਤੁਲਨਾ ਮੈਟ੍ਰਿਕਸ ਖੋਲ੍ਹੋ →',
    activeInTransit: 'ਢੋਆ-ਢੁਆਈ ਅਧੀਨ ਖੇਪ',
    trackTimelineBtn: 'ਪੂਰਾ ਵੇਰਵਾ ਟਰੈਕ ਕਰੋ →',
    topMatchesTitle: 'ਤੁਹਾਡੇ ਲਈ ਚੋਟੀ ਦੇ ਏਆਈ ਮੈਚ',
    topMatchesSub: 'ਗੁਣਵੱਤਾ ਅਤੇ ਸਥਾਨ ਅਨੁਸਾਰ ਮਿਲਾਈਆਂ ਗਈਆਂ ਫ਼ਸਲਾਂ',
    viewAllLotsBtn: 'ਸਾਰੀਆਂ ਫ਼ਸਲਾਂ ਦੇਖੋ →',
    activeDemandsTitle: 'ਸਰਗਰਮ ਖਰੀਦ ਮੰਗਾਂ',
    activeDemandsSub: 'ਮੰਗਾਂ ਵਰਤਮਾਨ ਵਿੱਚ ਮੇਲ ਖਾ ਰਹੀਆਂ ਹਨ',
    findMatchesBtn: 'ਕਿਸਾਨ ਮੈਚ ਲੱਭੋ →',
    manageAllReqsBtn: 'ਸਾਰੀਆਂ ਮੰਗਾਂ ਪ੍ਰਬੰਧਿਤ ਕਰੋ →',
    buyerToolkit: 'ਖਰੀਦਦਾਰ ਟੂਲਕਿੱਟ',

    catAll: 'ਸਾਰੇ',
    catGrains: 'ਅਨਾਜ',
    catVegetables: 'ਸਬਜ਼ੀਆਂ',
    catOilseeds: 'ਤੇਲ ਬੀਜ',
    catCommercial: 'ਵਪਾਰਕ',
    catPulses: 'ਦਾਲਾਂ',
    catSpices: 'ਮਸਾਲੇ',

    marketplaceTitle: 'ਫ਼ਸਲ ਮੰਡੀ ਬਜ਼ਾਰ',
    marketplaceSub: 'ਕਿਸਾਨਾਂ ਤੋਂ ਸਿੱਧੀਆਂ ਪ੍ਰਮਾਣਿਤ ਫ਼ਸਲਾਂ ਦੇਖੋ। ਦਰਜਾਬੰਦੀ ਅਤੇ ਦੂਰੀ ਅਨੁਸਾਰ ਫਿਲਟਰ ਕਰੋ।',
    filtersAndSorting: 'ਫਿਲਟਰ ਅਤੇ ਕ੍ਰਮਬੱਧ',
    searchPlaceholder: 'ਫ਼ਸਲ, ਕਿਸਾਨ ਜਾਂ ਸ਼ਹਿਰ ਖੋਜੋ...',
    showingLots: 'ਉਪਲਬਧ ਫ਼ਸਲਾਂ ਦਿਖਾਈਆਂ ਜਾ ਰਹੀਆਂ ਹਨ',
    directFarmgateMsg: '✓ ਸਾਰੇ ਰੇਟ ਸਿੱਧੇ ਖੇਤ ਦੇ ਹਨ',
    directPriceLabel: 'ਸਿੱਧਾ ਭਾਅ',
    mandiRefLabel: 'ਮੰਡੀ ਹਵਾਲਾ',
    savePercent: 'ਬੱਚਤ',
    inspectDetailsBtn: 'ਵੇਰਵੇ ਦੇਖੋ',
    orderRequestBtn: 'ਆਰਡਰ ਬੇਨਤੀ',
    bestMatchBadge: 'ਸਰਵੋਤਮ ਮੈਚ',
    highMatchBadge: 'ਚੰਗਾ ਮੈਚ',

    priceCompareTitle: 'ਮੁੱਲ ਅਤੇ ਕੁੱਲ ਲਾਗਤ ਤੁਲਨਾ',
    priceCompareSub: 'ਕਿਸਾਨਾਂ ਦੇ ਰੇਟਾਂ ਦੀ ਆਹਮੋ-ਸਾਹਮਣੇ ਤੁਲਨਾ ਕਰੋ। ਗੋਦਾਮ ਤੱਕ ਢੋਆ-ਢੁਆਈ ਸਮੇਤ ਅਸਲ ਲਾਗਤ ਜਾਣੋ।',
    mandiSavingsMode: 'ਮੰਡੀ ਬੱਚਤ ਮੋਡ ਚਾਲੂ',
    quantitySimulatorTitle: 'ਇੰਟਰਐਕਟਿਵ ਮਾਤਰਾ ਸਿਮੂਲੇਟਰ',
    quantitySimulatorSub: 'ਸਲਾਈਡਰ ਚਲਾ ਕੇ ਕੁੱਲ ਭਾੜਾ, ਕੁੱਲ ਖਰਚ ਅਤੇ ਮੰਡੀ ਨਾਲੋਂ ਸ਼ੁੱਧ ਬੱਚਤ ਦੇਖੋ।',
    landedCostTitle: 'ਗੋਦਾਮ ਤੱਕ ਕੁੱਲ ਲਾਗਤ',
    baseFarmgatePrice: 'ਖੇਤ ਦਾ ਮੁੱਢਲਾ ਮੁੱਲ',
    freightToWarehouse: 'ਗੋਦਾਮ ਤੱਕ ਭਾੜਾ',
    totalLandedCost: 'ਕੁੱਲ ਲਾਗਤ',
    savingsVsMandi: 'ਮੰਡੀ ਨਾਲੋਂ ਬੱਚਤ',
    recommendedBestOffer: 'ਸਭ ਤੋਂ ਵਧੀਆ ਮੁੱਲ ਦੀ ਪੇਸ਼ਕਸ਼',
    orderAtRateBtn: 'ਆਰਡਰ ਕਰੋ @',

    chatWorkspaceTitle: 'ਕਿਸਾਨ-ਖਰੀਦਦਾਰ ਚੈਟ ਖੇਤਰ',
    chatVerifiedBadge: 'ਪ੍ਰਮਾਣਿਤ ਸੁਰੱਖਿਅਤ ਵਪਾਰ',
    activeNegotiations: 'ਸਰਗਰਮ ਗੱਲਬਾਤ',
    onlineBadge: 'ਆਨਲਾਈਨ',
    quickRepliesTitle: 'ਤੁਰੰਤ ਜਵਾਬ:',
    createOrderProposalBtn: 'ਆਰਡਰ ਬੇਨਤੀ ਬਣਾਓ',
    chatInputPlaceholder: 'ਆਪਣਾ ਰੇਟ, ਪਰਖ ਸਵਾਲ ਜਾਂ ਢੋਆ-ਢੁਆਈ ਬਾਰੇ ਲਿਖੋ...',

    ordersTitle: 'ਆਰਡਰ ਅਤੇ ਖੇਪ ਟਰੈਕਿੰਗ',
    ordersSub: 'ਕਿਸਾਨ ਦੀ ਪ੍ਰਵਾਨਗੀ ਤੋਂ ਲੈ ਕੇ ਗੋਦਾਮ ਡਿਲੀਵਰੀ ਤੱਕ ਸਾਰੇ ੫ ਪੜਾਵਾਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ।',
    milestonePlaced: '੧. ਆਰਡਰ ਦਿੱਤਾ',
    milestoneAccepted: '੨. ਕਿਸਾਨ ਪ੍ਰਵਾਨਿਤ',
    milestoneInspected: '੩. ਗੁਣਵੱਤਾ ਪਰਖ',
    milestoneInTransit: '੪. ਰਸਤੇ ਵਿੱਚ',
    milestoneDelivered: '੫. ਪ੍ਰਾਪਤ ਅਤੇ ਅਦਾਇਗੀ',
    chatFarmerBtn: 'ਕਿਸਾਨ ਨਾਲ ਚੈਟ',
    viewInvoiceBtn: 'ਰਸੀਦ (ਇਨਵੌਇਸ)',
    rateReviewBtn: 'ਰੇਟਿੰਗ ਦਿਓ',

    transactionsTitle: 'ਲੈਣ-ਦੇਣ ਇਤਿਹਾਸ ਤੇ ਭੁਗਤਾਨ',
    transactionsSub: 'ਐਸਕਰੋ ਫੰਡ, ਕਿਸਾਨ ਭੁਗਤਾਨ ਅਤੇ ਢੋਆ-ਢੁਆਈ ਖਰਚਿਆਂ ਦਾ ਪੂਰਾ ਵੇਰਵਾ।',
    totalOutflow: 'ਕੁੱਲ ਵਪਾਰਕ ਖਰਚ',
    activeEscrowTrust: 'ਐਸਕਰੋ ਟਰੱਸਟ ਵਿੱਚ ਸੁਰੱਖਿਅਤ',
    disbursedToFarmers: 'ਕਿਸਾਨਾਂ ਨੂੰ ਭੁਗਤਾਨ',
    netSavingsMandi: 'ਮੰਡੀ ਨਾਲੋਂ ਬੱਚਤ',

    ratingsTitle: 'ਰੇਟਿੰਗਾਂ, ਫੀਡਬੈਕ ਤੇ ਭਰੋਸਾ',
    ratingsSub: 'ਪਾਰਦਰਸ਼ੀ ਬਹੁ-ਪੱਖੀ ਮੁਲਾਂਕਣ ਰਾਹੀਂ ਖਰੀਦ ਭਰੋਸੇਯੋਗਤਾ ਬਣਾਓ।',
    tabGivenReviews: 'ਕਿਸਾਨਾਂ ਨੂੰ ਦਿੱਤੀਆਂ ਰੇਟਿੰਗਾਂ',
    tabReceivedReviews: 'ਕਿਸਾਨਾਂ ਵੱਲੋਂ ਮਿਲੀ ਪ੍ਰਸ਼ੰਸਾ',
    avgQualityRating: 'ਔਸਤ ਗੁਣਵੱਤਾ ਰੇਟਿੰਗ',
    onTimeEscrowRate: 'ਸਮੇਂ ਸਿਰ ਐਸਕਰੋ ਕਲੀਅਰੈਂਸ',
    repeatFarmerSourcing: 'ਦੁਬਾਰਾ ਜੁੜੇ ਕਿਸਾਨ',

    currencyPerKg: '₹/ਕਿਲੋ',
    availableStock: 'ਉਪਲਬਧ ਸਟਾਕ',
    harvestDate: 'ਕਟਾਈ ਦੀ ਮਿਤੀ',
    distanceAway: 'ਦੂਰ',
  },
};
