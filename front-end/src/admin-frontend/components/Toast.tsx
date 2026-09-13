import { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastContextType {
  addToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, description?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md animate-slide-up transition-all ${
              toast.type === 'success'
                ? 'border-leaf-200 bg-leaf-50/95 text-leaf-800'
                : toast.type === 'error'
                ? 'border-rust-200 bg-rust-50/95 text-rust-800'
                : 'border-dusk-200 bg-dusk-50/95 text-dusk-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 size={20} className="text-leaf-600 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle size={20} className="text-rust-600 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info size={20} className="text-dusk-600 shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-snug">{toast.title}</p>
              {toast.description && <p className="text-xs opacity-80 mt-0.5 leading-relaxed">{toast.description}</p>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded-lg"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
