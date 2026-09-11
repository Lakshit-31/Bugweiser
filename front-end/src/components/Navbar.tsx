import { Sprout, User } from 'lucide-react';
import type { Farmer } from '@/types';

export type ScreenName = 'produce' | 'orders' | 'payments' | 'reviews' | 'profile';

interface NavbarProps {
  active: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  farmer: Farmer | null;
}

const navItems: { key: ScreenName; label: string }[] = [
  { key: 'produce', label: 'Produce' },
  { key: 'orders', label: 'Orders' },
  { key: 'payments', label: 'Payments' },
  { key: 'reviews', label: 'Reviews' },
];

export default function Navbar({ active, onNavigate, farmer }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        {/* Top row: logo + profile pill */}
        <div className="flex items-center justify-between py-3">
          <button
            onClick={() => onNavigate('produce')}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-500">
              <Sprout size={20} className="text-paper" />
            </div>
            <span className="font-serif text-xl font-semibold text-ink">Moolya</span>
          </button>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  active === item.key
                    ? 'bg-leaf-50 text-leaf-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Profile pill */}
          <button
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-2.5 rounded-full border py-1 pl-1 pr-3.5 transition-all ${
              active === 'profile'
                ? 'border-leaf-200 bg-leaf-50'
                : 'border-gray-200 bg-white hover:border-leaf-200 hover:bg-leaf-50'
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-100 text-leaf-500">
              {farmer?.profilePhoto ? (
                <img src={farmer.profilePhoto} alt={farmer.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                <User size={16} />
              )}
            </div>
            <span className="hidden text-sm font-medium text-ink sm:inline">
              {farmer?.name ?? 'Profile'}
            </span>
          </button>
        </div>

        {/* Mobile nav: scrollable pill row */}
        <nav className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-2.5 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                active === item.key
                  ? 'bg-leaf-500 text-paper'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
