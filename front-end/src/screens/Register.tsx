import { useState } from 'react';
import { Sprout, ArrowRight, Shield, Loader2, User, ShoppingBag, MapPin, ArrowLeft } from 'lucide-react';
import type { UserRole } from '@/types';
import { MoolyaFullLogo } from '@/components/MoolyaLogo';

interface RegisterProps {
  onRegister: (role: UserRole) => void;
  onGoLogin: () => void;
  initialRole: UserRole;
  onGoHome?: () => void;
}

interface FarmerForm {
  name: string;
  phone: string;
  state: string;
  district: string;
  village: string;
  farmSize: string;
  cropsGrown: string;
}

interface BuyerForm {
  name: string;
  phone: string;
  businessName: string;
  state: string;
  district: string;
  city: string;
  gstNumber: string;
}

export default function Register({ onRegister, onGoLogin, initialRole, onGoHome }: RegisterProps) {
  const [role, setRole] = useState<UserRole>(initialRole === 'admin' ? 'farmer' : initialRole);
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [farmerForm, setFarmerForm] = useState<FarmerForm>({
    name: '', phone: '', state: '', district: '', village: '', farmSize: '', cropsGrown: '',
  });
  const [buyerForm, setBuyerForm] = useState<BuyerForm>({
    name: '', phone: '', businessName: '', state: '', district: '', city: '', gstNumber: '',
  });
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const phone = role === 'farmer' ? farmerForm.phone : buyerForm.phone;

  const updateFarmer = (field: keyof FarmerForm, value: string) => {
    setFarmerForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateBuyer = (field: keyof BuyerForm, value: string) => {
    setBuyerForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = role === 'farmer' ? farmerForm.name : buyerForm.name;
    const ph = role === 'farmer' ? farmerForm.phone : buyerForm.phone;

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (ph.replace(/\D/g, '').length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      const nextInput = document.getElementById(`reg-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`reg-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((d) => d === '')) {
      setError('Please enter all 4 digits of the OTP');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRegister(role);
    }, 600);
  };

  const roleTabs: { key: UserRole; label: string; icon: typeof Sprout }[] = [
    { key: 'farmer', label: 'Farmer', icon: Sprout },
    { key: 'buyer', label: 'Buyer', icon: ShoppingBag },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-8">
      <div className="w-full max-w-[520px]">
        {/* Back to Home link */}
        {onGoHome && (
          <div className="mb-4">
            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-leaf-600"
            >
              <ArrowLeft size={16} /> Back to Home
            </button>
          </div>
        )}

        {/* Centered Full Logo Header */}
        <div className="mb-8 text-center">
          <MoolyaFullLogo />
          <p className="mt-2 text-sm text-gray-500">Join Moolya to reach verified buyers directly.</p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-[0_4px_24px_rgba(30,43,31,0.06)]">
          {/* Role selector tabs */}
          <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-1">
            {roleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setRole(tab.key);
                    setStep('details');
                    setError('');
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                    role === tab.key
                      ? 'bg-white text-leaf-600 shadow-sm'
                      : 'text-gray-400 hover:text-gray-500'
                  }`}
                >
                  <Icon size={16} /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* 1-Click SIH Auto-fill for registration demo */}
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-center">
            <button
              type="button"
              onClick={() => {
                if (role === 'buyer') {
                  setBuyerForm({
                    name: 'Vikram Sharma',
                    phone: '9876501234',
                    businessName: 'Ajmer Grain Mandi Co-op Ltd.',
                    state: 'Rajasthan',
                    district: 'Ajmer',
                    city: 'Ajmer',
                    gstNumber: '08ABCDE1234F1Z5',
                  });
                } else {
                  setFarmerForm({
                    name: 'Rameshwar Lal Jat',
                    phone: '9876543210',
                    state: 'Rajasthan',
                    district: 'Ajmer',
                    village: 'Gegal',
                    farmSize: '12 acres',
                    cropsGrown: 'Wheat, Mustard, Gram',
                  });
                }
              }}
              className="w-full rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>⚡ Auto-fill SIH Demo {role === 'buyer' ? 'Enterprise Buyer' : 'Farmer'} Data</span>
            </button>
          </div>

          {step === 'details' ? (
            <>
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2 text-leaf-500">
                  <User size={18} />
                  <span className="text-sm font-semibold text-leaf-600">Step 1 of 2</span>
                </div>
                <h2 className="font-serif text-xl font-semibold text-ink">
                  {role === 'farmer' ? 'Farm details' : 'Business details'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {role === 'farmer'
                    ? 'Tell us about yourself and your farm.'
                    : 'Tell us about yourself and your business.'}
                </p>
              </div>
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                {/* Full name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Full Name</label>
                  <input
                    type="text"
                    value={role === 'farmer' ? farmerForm.name : buyerForm.name}
                    onChange={(e) =>
                      role === 'farmer'
                        ? updateFarmer('name', e.target.value)
                        : updateBuyer('name', e.target.value)
                    }
                    placeholder={role === 'farmer' ? 'e.g. Rameshwar Lal' : 'e.g. Vikram Sharma'}
                    className="input-field"
                    autoFocus
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <span className="flex h-[42px] w-14 items-center justify-center rounded-[9px] border-[1.5px] border-gray-200 bg-gray-50 text-sm font-semibold text-gray-600">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        role === 'farmer'
                          ? updateFarmer('phone', e.target.value)
                          : updateBuyer('phone', e.target.value)
                      }
                      placeholder="98765 43210"
                      maxLength={10}
                      className="input-field h-[42px] flex-1 tracking-wider"
                    />
                  </div>
                </div>

                {role === 'farmer' ? (
                  <>
                    {/* State / District */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-ink">State</label>
                        <input
                          type="text"
                          value={farmerForm.state}
                          onChange={(e) => updateFarmer('state', e.target.value)}
                          placeholder="e.g. Rajasthan"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-ink">District</label>
                        <input
                          type="text"
                          value={farmerForm.district}
                          onChange={(e) => updateFarmer('district', e.target.value)}
                          placeholder="e.g. Ajmer"
                          className="input-field"
                        />
                      </div>
                    </div>

                    {/* Village / Farm size */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-ink">Village</label>
                        <input
                          type="text"
                          value={farmerForm.village}
                          onChange={(e) => updateFarmer('village', e.target.value)}
                          placeholder="e.g. Gegal"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-ink">Farm Size</label>
                        <input
                          type="text"
                          value={farmerForm.farmSize}
                          onChange={(e) => updateFarmer('farmSize', e.target.value)}
                          placeholder="e.g. 8 acres"
                          className="input-field"
                        />
                      </div>
                    </div>

                    {/* Crops grown */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-ink">Crops Grown</label>
                      <input
                        type="text"
                        value={farmerForm.cropsGrown}
                        onChange={(e) => updateFarmer('cropsGrown', e.target.value)}
                        placeholder="e.g. Wheat, Mustard, Bajra"
                        className="input-field"
                      />
                      <p className="mt-1.5 text-xs text-gray-400">Separate multiple crops with commas.</p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Business name */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-ink">Business Name</label>
                      <input
                        type="text"
                        value={buyerForm.businessName}
                        onChange={(e) => updateBuyer('businessName', e.target.value)}
                        placeholder="e.g. Ajmer Grain Mandi Co-op"
                        className="input-field"
                      />
                    </div>

                    {/* State / District */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-ink">State</label>
                        <input
                          type="text"
                          value={buyerForm.state}
                          onChange={(e) => updateBuyer('state', e.target.value)}
                          placeholder="e.g. Rajasthan"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-ink">District</label>
                        <input
                          type="text"
                          value={buyerForm.district}
                          onChange={(e) => updateBuyer('district', e.target.value)}
                          placeholder="e.g. Ajmer"
                          className="input-field"
                        />
                      </div>
                    </div>

                    {/* City / GST */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-ink">City</label>
                        <input
                          type="text"
                          value={buyerForm.city}
                          onChange={(e) => updateBuyer('city', e.target.value)}
                          placeholder="e.g. Ajmer"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-ink">GST Number</label>
                        <input
                          type="text"
                          value={buyerForm.gstNumber}
                          onChange={(e) => updateBuyer('gstNumber', e.target.value)}
                          placeholder="e.g. 08ABCDE1234F1Z5"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </>
                )}

                {error && <p className="text-sm text-rust-500">{error}</p>}

                <button type="submit" disabled={loading} className="btn-primary w-full h-11">
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>Continue to OTP <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2 text-leaf-500">
                  <Shield size={18} />
                  <span className="text-sm font-semibold text-leaf-600">Step 2 of 2</span>
                </div>
                <h2 className="font-serif text-xl font-semibold text-ink">Verify your phone</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the 4-digit code sent to <span className="font-semibold text-ink">+91 {phone}</span>.
                </p>
                <p className="mt-2 text-xs text-marigold-600 bg-marigold-50 rounded-lg px-3 py-2">
                  Demo mode: enter any 4 digits to continue.
                </p>
              </div>
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`reg-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="h-14 w-12 rounded-xl border-2 border-gray-200 bg-white text-center font-serif text-2xl font-bold text-ink transition-all focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                {error && <p className="text-center text-sm text-rust-500">{error}</p>}
                <div className="space-y-3">
                  <button type="submit" disabled={loading} className="btn-primary w-full h-11">
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>Verify & create account <ArrowRight size={16} /></>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setOtp(['', '', '', '']);
                      setStep('details');
                    }}
                    className="w-full text-center text-sm font-medium text-dusk-500 transition-colors hover:text-dusk-600"
                  >
                    Edit details
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already registered?{' '}
          <button onClick={onGoLogin} className="font-semibold text-dusk-500 transition-colors hover:text-dusk-600">
            Log in
          </button>
        </p>

        {/* Footnote */}
        <p className="mt-3 text-center text-xs text-gray-400">
          Any 4-digit code works in this preview build.
        </p>
      </div>
    </div>
  );
}
