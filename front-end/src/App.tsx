import React, { useState, useEffect } from 'react';
import type { Farmer, UserRole, LanguageCode, Produce } from '@/types';
import type {
  BuyerScreenName,
  BuyerRequirement,
  BuyerOrder,
  BuyerTransaction,
  BuyerReviewItem,
  PriceComparisonItem,
} from '@/types/buyer';
import { getFarmer } from '@/data/api';
import Navbar, { ScreenName } from '@/components/Navbar';
import HomepageNavbar, { NavTarget } from '@/components/HomepageNavbar';
import Homepage from '@/screens/Homepage';
import ProduceScreen from '@/screens/Produce';
import MatchesScreen from '@/screens/Matches';
import OrdersScreen from '@/screens/Orders';
import PaymentsScreen from '@/screens/Payments';
import ReviewsScreen from '@/screens/Reviews';
import ProfileScreen from '@/screens/Profile';
import Login from '@/screens/Login';
import Register from '@/screens/Register';
import AdminDashboard from '@/screens/AdminDashboard';
import { translations } from '@/data/translations';
import { buyerTranslations } from '@/data/buyerTranslations';

// Buyer Components & Screens
import BuyerNavbar from '@/components/buyer/BuyerNavbar';
import GuidedFlowBar, { FlowStepKey } from '@/components/buyer/GuidedFlowBar';
import BuyerProduceDetailModal from '@/components/buyer/BuyerProduceDetailModal';
import FarmerProfileModal from '@/components/buyer/FarmerProfileModal';
import OrderRequestModal from '@/components/buyer/OrderRequestModal';
import FeedbackModal from '@/components/buyer/FeedbackModal';

import BuyerDashboardScreen from '@/screens/buyer/BuyerDashboardScreen';
import BuyerMarketplaceScreen from '@/screens/buyer/BuyerMarketplaceScreen';
import BuyerRequirementsScreen from '@/screens/buyer/BuyerRequirementsScreen';
import PriceComparisonScreen from '@/screens/buyer/PriceComparisonScreen';
import BuyerChatScreen from '@/screens/buyer/BuyerChatScreen';
import BuyerOrdersScreen from '@/screens/buyer/BuyerOrdersScreen';
import BuyerTransactionsScreen from '@/screens/buyer/BuyerTransactionsScreen';
import BuyerReviewsScreen from '@/screens/buyer/BuyerReviewsScreen';
import BuyerProfileScreen from '@/screens/buyer/BuyerProfileScreen';

// Buyer Mock Data
import {
  initialBuyerRequirements,
  marketplaceProduceListings,
  initialBuyerOrders,
  initialBuyerTransactions,
  initialBuyerReviews,
  mockBuyerProfile,
} from '@/data/buyerMockData';

export type MainView =
  | 'home'
  | 'produce'
  | 'dashboard'
  | 'marketplace'
  | 'orders'
  | 'payments'
  | 'reviews'
  | 'profile'
  | 'matches'
  | 'login'
  | 'register'
  | 'admin'
  | 'buyer';

export default function App() {
  const [currentView, setCurrentView] = useState<MainView>('home');
  const [userRole, setUserRole] = useState<UserRole>('farmer');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [selectedProduceId, setSelectedProduceId] = useState<string | null>(null);
  const [registerRole, setRegisterRole] = useState<UserRole>('farmer');

  // Buyer State
  const [buyerScreen, setBuyerScreen] = useState<BuyerScreenName>('buyer-dashboard');
  const [requirements, setRequirements] = useState<BuyerRequirement[]>(initialBuyerRequirements);
  const [marketplaceLots, setMarketplaceLots] = useState<Produce[]>(marketplaceProduceListings);
  const [orders, setOrders] = useState<BuyerOrder[]>(initialBuyerOrders);
  const [transactions, setTransactions] = useState<BuyerTransaction[]>(initialBuyerTransactions);
  const [reviews, setReviews] = useState<BuyerReviewItem[]>(initialBuyerReviews);
  const [activeFlowStep, setActiveFlowStep] = useState<FlowStepKey>('dashboard');

  // Buyer Modals & Interactivity State
  const [activeProduceModal, setActiveProduceModal] = useState<Produce | null>(null);
  const [activeFarmerModalId, setActiveFarmerModalId] = useState<string | null>(null);
  const [activeOrderModalProduce, setActiveOrderModalProduce] = useState<Produce | null>(null);
  const [activeFeedbackModalOrder, setActiveFeedbackModalOrder] = useState<BuyerOrder | null>(null);
  const [isPostRequirementModalOpen, setIsPostRequirementModalOpen] = useState(false);
  const [chatTargetFarmer, setChatTargetFarmer] = useState<string>('');
  const [compareTargetCrop, setCompareTargetCrop] = useState<string>('wheat');
  const [marketplaceFilterQuery, setMarketplaceFilterQuery] = useState<string>('');

  const t = translations[currentLang] || translations.en;
  const bt = buyerTranslations[currentLang] || buyerTranslations.en;

  useEffect(() => {
    if (isLoggedIn && userRole === 'farmer' && !farmer) {
      getFarmer().then(setFarmer);
    }
  }, [isLoggedIn, userRole, farmer]);

  const handleHomepageNav = (target: NavTarget) => {
    setCurrentView('home');
    setActiveSection(target);
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (role: UserRole) => {
    setIsLoggedIn(true);
    setUserRole(role);
    if (role === 'admin') {
      setCurrentView('admin');
    } else if (role === 'farmer') {
      setCurrentView('produce');
    } else {
      // Buyer role
      setCurrentView('buyer');
      setBuyerScreen('buyer-dashboard');
      setActiveFlowStep('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFarmer(null);
    setCurrentView('home');
    setUserRole('farmer');
  };

  const handleViewMatches = (produceId: string) => {
    setSelectedProduceId(produceId);
    setCurrentView('matches');
  };

  // Switch between farmer and buyer portals seamlessly
  const handleSwitchToBuyer = () => {
    setIsLoggedIn(true);
    setUserRole('buyer');
    setCurrentView('buyer');
    setBuyerScreen('buyer-dashboard');
    setActiveFlowStep('dashboard');
  };

  const handleSwitchToFarmer = () => {
    setIsLoggedIn(true);
    setUserRole('farmer');
    setCurrentView('produce');
  };

  // Handle Flow Step Selection from GuidedFlowBar
  const handleSelectFlowStep = (stepKey: FlowStepKey) => {
    setActiveFlowStep(stepKey);
    switch (stepKey) {
      case 'login':
        setCurrentView('login');
        break;
      case 'dashboard':
        setCurrentView('buyer');
        setBuyerScreen('buyer-dashboard');
        break;
      case 'marketplace':
        setCurrentView('buyer');
        setBuyerScreen('buyer-marketplace');
        break;
      case 'filter':
        setCurrentView('buyer');
        setBuyerScreen('buyer-marketplace');
        break;
      case 'produce_details':
        setCurrentView('buyer');
        setBuyerScreen('buyer-marketplace');
        setActiveProduceModal(marketplaceLots[0]);
        break;
      case 'farmer_details':
        setCurrentView('buyer');
        setActiveFarmerModalId('f-gurpreet');
        break;
      case 'match_score':
        setCurrentView('buyer');
        setBuyerScreen('buyer-marketplace');
        setActiveProduceModal(marketplaceLots[0]);
        break;
      case 'compare':
        setCurrentView('buyer');
        setBuyerScreen('buyer-compare');
        break;
      case 'chat':
        setCurrentView('buyer');
        setBuyerScreen('buyer-chat');
        break;
      case 'order_request':
        setCurrentView('buyer');
        setActiveOrderModalProduce(marketplaceLots[0]);
        break;
      case 'orders':
        setCurrentView('buyer');
        setBuyerScreen('buyer-orders');
        break;
      case 'transactions':
        setCurrentView('buyer');
        setBuyerScreen('buyer-transactions');
        break;
      case 'feedback':
        setCurrentView('buyer');
        setBuyerScreen('buyer-reviews');
        break;
    }
  };

  // Order submission
  const handleAddOrder = (newOrder: BuyerOrder) => {
    setOrders([newOrder, ...orders]);
    // Also create corresponding transaction
    const newTxn: BuyerTransaction = {
      transactionId: `TXN-BUY-${Math.floor(8000 + Math.random() * 1999)}`,
      orderId: newOrder.orderId,
      farmerName: newOrder.farmerName,
      cropName: newOrder.cropName,
      quantity: newOrder.quantity,
      unit: newOrder.unit,
      amount: newOrder.totalAmount,
      date: newOrder.orderDate,
      type: 'Escrow Deposit',
      paymentMode: 'Agri-Escrow Wallet',
      paymentStatus: 'Settled',
      receiptUrl: '#',
    };
    setTransactions([newTxn, ...transactions]);
    setBuyerScreen('buyer-orders');
    setActiveFlowStep('orders');
  };

  // Review submission
  const handleAddReview = (newReview: BuyerReviewItem) => {
    setReviews([newReview, ...reviews]);
    setBuyerScreen('buyer-reviews');
    setActiveFlowStep('feedback');
  };

  // Determine active screen for top navbar highlighting (Farmer)
  const getActiveScreenName = (): ScreenName => {
    if (currentView === 'matches' || currentView === 'dashboard' || currentView === 'marketplace') {
      return 'produce';
    }
    if (
      currentView === 'produce' ||
      currentView === 'orders' ||
      currentView === 'payments' ||
      currentView === 'reviews' ||
      currentView === 'profile'
    ) {
      return currentView;
    }
    return 'produce';
  };

  const isBuyerView = currentView === 'buyer';

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col selection:bg-leaf-200 selection:text-leaf-800">

      {/* 
        NAVBAR SEPARATION:
        - Homepage navbar rendered on the Home page (currentView === 'home').
        - BuyerNavbar rendered when viewing the Buyer portal (currentView === 'buyer').
        - Original farmer navbar rendered for farmer portal views.
      */}
      {currentView === 'home' ? (
        <HomepageNavbar
          activeSection={activeSection}
          currentLang={currentLang}
          onSelectLanguage={setCurrentLang}
          onNavigateSection={handleHomepageNav}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setCurrentView('login')}
          onSignupClick={() => setCurrentView('register')}
          onLogoutClick={handleLogout}
          farmer={farmer}
          onOpenDashboard={() => setCurrentView('produce')}
        />
      ) : isBuyerView ? (
        <>
          <BuyerNavbar
            activeScreen={buyerScreen}
            onNavigate={(screen) => {
              setBuyerScreen(screen);
              if (screen === 'buyer-dashboard') setActiveFlowStep('dashboard');
              if (screen === 'buyer-marketplace') setActiveFlowStep('marketplace');
              if (screen === 'buyer-compare') setActiveFlowStep('compare');
              if (screen === 'buyer-chat') setActiveFlowStep('chat');
              if (screen === 'buyer-orders') setActiveFlowStep('orders');
              if (screen === 'buyer-transactions') setActiveFlowStep('transactions');
              if (screen === 'buyer-reviews') setActiveFlowStep('feedback');
            }}
            currentLang={currentLang}
            onSelectLanguage={setCurrentLang}
            onSwitchToFarmer={handleSwitchToFarmer}
            onLogout={handleLogout}
          />

          {/* Interactive SIH Guided Presentation Stepper Bar */}
          <GuidedFlowBar
            currentStep={activeFlowStep}
            onSelectStep={handleSelectFlowStep}
            currentLang={currentLang}
          />

          {/* Quick link back to Homepage */}
          <div className="bg-white/80 border-b border-black/5 backdrop-blur-xs py-1.5 px-4">
            <div className="mx-auto max-w-content flex items-center justify-between text-xs font-semibold">
              <button
                onClick={() => { setCurrentView('home'); setActiveSection('home'); }}
                className="rounded-lg px-3 py-1 transition-colors text-leaf-700 hover:bg-leaf-50 flex items-center gap-1 font-bold border border-leaf-200"
              >
                ← {bt.returnHome}
              </button>
              <div className="flex items-center gap-3 text-gray-500 font-medium">
                <span>{bt.enterpriseBuyer}: <strong>{mockBuyerProfile.businessName}</strong></span>
                <span className="hidden sm:inline text-emerald-600 font-bold">✓ {bt.escrowProtected}</span>
              </div>
            </div>
          </div>
        </>
      ) : currentView !== 'admin' && currentView !== 'login' && currentView !== 'register' ? (
        <>
          <Navbar
            active={getActiveScreenName()}
            onNavigate={(screen) => setCurrentView(screen as MainView)}
            farmer={farmer}
            currentLang={currentLang}
            onSelectLanguage={setCurrentLang}
          />

          {/* Quick link back to Homepage & Switch to Buyer */}
          <div className="bg-white/80 border-b border-black/5 backdrop-blur-xs py-2 px-4">
            <div className="mx-auto max-w-content flex items-center justify-between text-xs font-semibold">
              <button
                onClick={() => { setCurrentView('home'); setActiveSection('home'); }}
                className="rounded-lg px-3 py-1 transition-colors text-leaf-700 hover:bg-leaf-50 flex items-center gap-1 font-bold border border-leaf-200"
              >
                {t.portalReturn}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSwitchToBuyer}
                  className="rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-800 font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  Switch to Buyer Portal →
                </button>
                <span className="text-gray-500 font-medium hidden sm:inline">
                  {t.portalTitle}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Main Content Router */}
      <main className="flex-1 mx-auto max-w-content px-4 py-6 sm:px-6 sm:py-8 w-full">

        {/* HOMEPAGE VIEW */}
        {currentView === 'home' && (
          <Homepage
            currentLang={currentLang}
            onNavigateSection={(sec) => {
              setActiveSection(sec);
              const el = document.getElementById(sec);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onRoleSelect={(role) => {
              if (role === 'farmer') {
                setCurrentView('produce');
                setUserRole('farmer');
              } else {
                handleSwitchToBuyer();
              }
            }}
            onOpenDashboard={() => setCurrentView('produce')}
            onOpenMarketplace={handleSwitchToBuyer}
          />
        )}

        {/* ================= BUYER PORTAL VIEWS ================= */}
        {isBuyerView && (
          <>
            {buyerScreen === 'buyer-dashboard' && (
              <BuyerDashboardScreen
                onNavigate={(screen) => {
                  setBuyerScreen(screen);
                  if (screen === 'buyer-marketplace') setActiveFlowStep('marketplace');
                  if (screen === 'buyer-requirements') setActiveFlowStep('dashboard');
                  if (screen === 'buyer-chat') setActiveFlowStep('chat');
                  if (screen === 'buyer-orders') setActiveFlowStep('orders');
                  if (screen === 'buyer-transactions') setActiveFlowStep('transactions');
                }}
                requirements={requirements}
                marketplaceLots={marketplaceLots}
                orders={orders}
                onOpenRequirementModal={() => setIsPostRequirementModalOpen(true)}
                onSelectProduce={(p) => {
                  setActiveProduceModal(p);
                  setActiveFlowStep('produce_details');
                }}
                onOpenPriceComparison={(crop) => {
                  if (crop) setCompareTargetCrop(crop);
                  setBuyerScreen('buyer-compare');
                  setActiveFlowStep('compare');
                }}
                currentLang={currentLang}
              />
            )}

            {buyerScreen === 'buyer-marketplace' && (
              <BuyerMarketplaceScreen
                produceLots={marketplaceLots}
                initialSearchQuery={marketplaceFilterQuery}
                onSelectProduce={(p) => {
                  setActiveProduceModal(p);
                  setActiveFlowStep('produce_details');
                }}
                onOpenFarmerProfile={(name) => {
                  setActiveFarmerModalId('f-gurpreet');
                  setActiveFlowStep('farmer_details');
                }}
                onOpenPriceComparison={(crop) => {
                  setCompareTargetCrop(crop);
                  setBuyerScreen('buyer-compare');
                  setActiveFlowStep('compare');
                }}
                onOpenChat={(farmerName, produce) => {
                  setChatTargetFarmer(farmerName);
                  setBuyerScreen('buyer-chat');
                  setActiveFlowStep('chat');
                }}
                onOpenOrderRequest={(produce) => {
                  setActiveOrderModalProduce(produce);
                  setActiveFlowStep('order_request');
                }}
                currentLang={currentLang}
              />
            )}

            {buyerScreen === 'buyer-requirements' && (
              <BuyerRequirementsScreen
                requirements={requirements}
                onAddRequirement={(newReq) => setRequirements([newReq, ...requirements])}
                onNavigate={(s) => setBuyerScreen(s)}
                onFilterMarketplaceForCrop={(cropName) => {
                  setMarketplaceFilterQuery(cropName.split(' ')[0]);
                  setBuyerScreen('buyer-marketplace');
                  setActiveFlowStep('marketplace');
                }}
                isPostModalOpen={isPostRequirementModalOpen}
                onSetPostModalOpen={setIsPostRequirementModalOpen}
                currentLang={currentLang}
              />
            )}

            {buyerScreen === 'buyer-compare' && (
              <PriceComparisonScreen
                initialCrop={compareTargetCrop}
                onOpenChat={(farmerName) => {
                  setChatTargetFarmer(farmerName);
                  setBuyerScreen('buyer-chat');
                  setActiveFlowStep('chat');
                }}
                onOpenOrderFromComparison={(item, qty) => {
                  const matchedProduce = marketplaceLots.find((p) => p.cropName.includes(item.cropName.split(' ')[0])) || marketplaceLots[0];
                  setActiveOrderModalProduce({ ...matchedProduce, expectedPrice: item.basePrice, availableQuantity: item.quantityAvailable });
                  setActiveFlowStep('order_request');
                }}
                currentLang={currentLang}
              />
            )}

            {buyerScreen === 'buyer-chat' && (
              <BuyerChatScreen
                selectedFarmerName={chatTargetFarmer}
                onOpenOrderFromChat={(cropName, farmerName) => {
                  const matched = marketplaceLots.find((p) => p.cropName.toLowerCase().includes(cropName.toLowerCase())) || marketplaceLots[0];
                  setActiveOrderModalProduce(matched);
                  setActiveFlowStep('order_request');
                }}
                currentLang={currentLang}
              />
            )}

            {buyerScreen === 'buyer-orders' && (
              <BuyerOrdersScreen
                orders={orders}
                onOpenChat={(farmerName) => {
                  setChatTargetFarmer(farmerName);
                  setBuyerScreen('buyer-chat');
                  setActiveFlowStep('chat');
                }}
                onOpenFeedback={(order) => {
                  setActiveFeedbackModalOrder(order);
                }}
                currentLang={currentLang}
              />
            )}

            {buyerScreen === 'buyer-transactions' && (
              <BuyerTransactionsScreen
                transactions={transactions}
                currentLang={currentLang}
              />
            )}

            {buyerScreen === 'buyer-reviews' && (
              <BuyerReviewsScreen
                reviews={reviews}
                onOpenNewFeedbackModal={() => {
                  const completedOrder = orders.find((o) => o.status === 'Completed') || orders[3];
                  setActiveFeedbackModalOrder(completedOrder);
                }}
                currentLang={currentLang}
              />
            )}

            {buyerScreen === 'buyer-profile' && (
              <BuyerProfileScreen
                onSwitchToFarmer={handleSwitchToFarmer}
                onLogout={handleLogout}
                currentLang={currentLang}
              />
            )}
          </>
        )}

        {/* ================= FARMER PORTAL VIEWS ================= */}
        {!isBuyerView && (
          <>
            {/* FARMER PRODUCE / DASHBOARD VIEW */}
            {(currentView === 'produce' || currentView === 'dashboard') && (
              <ProduceScreen onViewMatches={handleViewMatches} currentLang={currentLang} />
            )}

            {/* MATCHES VIEW */}
            {currentView === 'matches' && selectedProduceId && (
              <MatchesScreen
                produceId={selectedProduceId}
                onBack={() => setCurrentView('produce')}
                currentLang={currentLang}
              />
            )}

            {/* ORDERS VIEW */}
            {currentView === 'orders' && <OrdersScreen currentLang={currentLang} />}

            {/* PAYMENTS VIEW */}
            {currentView === 'payments' && <PaymentsScreen currentLang={currentLang} />}

            {/* REVIEWS VIEW */}
            {currentView === 'reviews' && <ReviewsScreen currentLang={currentLang} />}

            {/* PROFILE VIEW */}
            {currentView === 'profile' && (
              <ProfileScreen onLogout={handleLogout} currentLang={currentLang} />
            )}
          </>
        )}

        {/* LOGIN SCREEN */}
        {currentView === 'login' && (
          <Login
            onLogin={handleLoginSuccess}
            onGoRegister={(role) => {
              setRegisterRole(role);
              setCurrentView('register');
            }}
            onGoHome={() => {
              setCurrentView('home');
              setActiveSection('home');
            }}
          />
        )}

        {/* REGISTER SCREEN */}
        {currentView === 'register' && (
          <Register
            onRegister={handleLoginSuccess}
            onGoLogin={() => setCurrentView('login')}
            initialRole={registerRole}
            onGoHome={() => {
              setCurrentView('home');
              setActiveSection('home');
            }}
          />
        )}

        {/* ADMIN DASHBOARD VIEW */}
        {currentView === 'admin' && (
          <AdminDashboard onLogout={handleLogout} />
        )}

      </main>

      {/* ================= SHARED BUYER MODALS ================= */}
      {/* 1. Produce Detail Modal */}
      {activeProduceModal && (
        <BuyerProduceDetailModal
          produce={activeProduceModal}
          onClose={() => setActiveProduceModal(null)}
          onOpenOrderRequest={(prod) => {
            setActiveProduceModal(null);
            setActiveOrderModalProduce(prod);
            setActiveFlowStep('order_request');
          }}
          onOpenChat={(fName, prod) => {
            setActiveProduceModal(null);
            setChatTargetFarmer(fName);
            setBuyerScreen('buyer-chat');
            setActiveFlowStep('chat');
          }}
          onOpenFarmerProfile={(fId) => {
            setActiveProduceModal(null);
            setActiveFarmerModalId(fId);
            setActiveFlowStep('farmer_details');
          }}
          onOpenPriceComparison={(crop) => {
            setActiveProduceModal(null);
            setCompareTargetCrop(crop);
            setBuyerScreen('buyer-compare');
            setActiveFlowStep('compare');
          }}
        />
      )}

      {/* 2. Farmer Profile Modal */}
      {activeFarmerModalId && (
        <FarmerProfileModal
          farmerId={activeFarmerModalId}
          onClose={() => setActiveFarmerModalId(null)}
          onOpenChat={(fName) => {
            setActiveFarmerModalId(null);
            setChatTargetFarmer(fName);
            setBuyerScreen('buyer-chat');
            setActiveFlowStep('chat');
          }}
          onSelectProduce={(p) => {
            setActiveFarmerModalId(null);
            setActiveProduceModal(p);
            setActiveFlowStep('produce_details');
          }}
        />
      )}

      {/* 3. Order Request Modal */}
      {activeOrderModalProduce && (
        <OrderRequestModal
          produce={activeOrderModalProduce}
          onClose={() => setActiveOrderModalProduce(null)}
          onSubmitOrder={handleAddOrder}
        />
      )}

      {/* 4. Feedback & Rating Modal */}
      {activeFeedbackModalOrder && (
        <FeedbackModal
          order={activeFeedbackModalOrder}
          isOpen={!!activeFeedbackModalOrder}
          onClose={() => setActiveFeedbackModalOrder(null)}
          onSubmitReview={handleAddReview}
        />
      )}

    </div>
  );
}
