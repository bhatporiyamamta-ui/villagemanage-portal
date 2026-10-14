import React, { useState } from 'react';
import { useVillage } from '../context/VillageContext';
import { ShieldCheck, X, Lock, KeyRound, ArrowRight, Building2 } from 'lucide-react';

export default function AdminLoginModal() {
  const { adminLoginModalOpen, setAdminLoginModalOpen, loginAsAdmin } = useVillage();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!adminLoginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = loginAsAdmin(pin);
    if (!success) {
      setError('Invalid PIN code. Hint: Use 1234');
    } else {
      setError('');
      setPin('');
    }
  };

  const handleQuickLogin = () => {
    loginAsAdmin('1234');
    setError('');
    setPin('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-village-text/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full border border-village-border shadow-elevated p-6 space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-village-primary text-white flex items-center justify-center shadow-soft">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-village-text">
                Panchayat Staff Login
              </h2>
              <p className="text-xs text-village-muted">
                Administrative access for Pramukh, Committee & Panchayat officers
              </p>
            </div>
          </div>
          <button
            onClick={() => setAdminLoginModalOpen(false)}
            className="p-1.5 rounded-xl text-village-muted hover:text-village-text hover:bg-village-card"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <p className="text-xs text-village-muted leading-relaxed">
            Switch from public viewer mode to full administrative mode to add, update, and manage citizen and household records.
          </p>

          <div>
            <label className="block font-bold text-village-text text-xs uppercase tracking-wider mb-1.5">
              Staff Security PIN
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-village-muted" />
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Enter 4-digit PIN (Demo: 1234)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-village-border bg-village-card/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-village-primary text-sm font-mono tracking-widest text-center font-bold"
                autoFocus
              />
            </div>
            {error ? (
              <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>
            ) : (
              <p className="text-village-muted text-[11px] mt-1">
                Demo access code: <span className="font-mono font-bold text-village-primary-dark">1234</span>
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-sm shadow-soft transition-all duration-200 active:scale-95"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Admin Access</span>
            </button>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-village-secondary-light text-village-primary-darker hover:bg-village-secondary font-bold text-xs transition-colors border border-village-secondary"
            >
              <span>⚡ One-Click Demo Admin Login</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
