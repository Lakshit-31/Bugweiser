import { useState } from 'react';
import { Sprout, ArrowRight, Phone, Shield, Loader2, ShoppingBag, ShieldCheck } from 'lucide-react';
import type { UserRole } from '@/types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
  onGoRegister: (role: UserRole) => void;
}

const ADMIN_PHONE = '9000000000';

export default function Login({ onLogin, onGoRegister }: LoginProps) {
  const [role, setRole] = useState<UserRole>('farmer');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdminPhone = phone.replace(/\D/g, '') === ADMIN_PHONE;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length !== 10) {
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
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
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
      onLogin(isAdminPhone ? 'admin' : role);
    }, 600);
  };

  const roleTabs: { key: UserRole; label: string; icon: typeof Sprout }[] = [
    { key: 'farmer', label: 'Farmer', icon: Sprout },
    { key: 'buyer', label: 'Buyer', icon: ShoppingBag },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-leaf-500 shadow-lg shadow-leaf-500/20">
            <Sprout size={32} className="text-paper" />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Moolya</h1>
          <p className="mt-1 text-sm text-gray-500">Sell your produce directly to buyers. No middlemen.</p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-[0_4px_24px_rgba(30,43,31,0.06)]">
          {/* Role selector tabs */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-1">
            {roleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setRole(tab.key);
                    setStep('phone');
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

          {step === 'phone' ? (
            <>
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2 text-leaf-500">
                  <Phone size={18} />
                  <span className="text-sm font-semibold text-leaf-600">Step 1 of 2</span>
                </div>
                <h2 className="font-serif text-xl font-semibold text-ink">
                  {isAdminPhone ? 'Admin Login' : `Enter your phone number`}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {isAdminPhone
                    ? 'Demo admin account detected. Continue to verify.'
                    : "We'll send you a verification code via SMS."}
                </p>
              </div>
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <span className="flex h-11 w-14 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-600">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="input-field h-11 flex-1 tracking-wider"
                      autoFocus
                    />
                  </div>
                  {isAdminPhone && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-dusk-500">
                      <ShieldCheck size={14} /> Demo admin account recognized
                    </p>
                  )}
                  {error && <p className="mt-2 text-sm text-rust-500">{error}</p>}
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full h-11">
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>Send OTP <ArrowRight size={16} /></>
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
                <h2 className="font-serif text-xl font-semibold text-ink">Enter the OTP</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Sent to +91 {phone}.{' '}
                  <button
                    onClick={() => setStep('phone')}
                    className="font-medium text-leaf-600 underline underline-offset-2"
                  >
                    Change number
                  </button>
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
                      id={`otp-${index}`}
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
                <button type="submit" disabled={loading} className="btn-primary w-full h-11">
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>Verify & Continue <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          By continuing, you agree to Moolya's Terms of Service and Privacy Policy.
        </p>

        <p className="mt-4 text-center text-sm text-gray-500">
          New here?{' '}
          <button
            onClick={() => onGoRegister(role)}
            className="font-semibold text-dusk-500 transition-colors hover:text-dusk-600"
          >
            Create an account
          </button>
        </p>

        <p className="mt-3 text-center text-xs text-gray-400">
          Demo admin: use phone 9000000000 — any 4-digit OTP works.
        </p>
      </div>
    </div>
  );
}
