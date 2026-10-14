import React, { useState } from 'react';
import { useVillage } from '../context/VillageContext';
import { ShieldCheck, X, Lock, KeyRound } from 'lucide-react';

export default function AdminLoginModal() {
  const { adminLoginModalOpen, setAdminLoginModalOpen, loginAsAdmin } = useVillage();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!adminLoginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the administrative password.');
      return;
    }
    const success = loginAsAdmin(password.trim());
    if (!success) {
      setError('Incorrect administrator password. Access denied.');
    } else {
      setError('');
      setPassword('');
    }
  };

  const handleClose = () => {
    setAdminLoginModalOpen(false);
    setError('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-village-text/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full border border-village-border shadow-elevated p-6 space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-village-primary text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-village-text">
                Administrator Login
              </h2>
              <p className="text-xs text-village-muted">
                Ichhapore-Bhatha Bhandari Panch Administration
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-village-muted hover:text-village-text hover:bg-village-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <p className="text-xs text-village-muted leading-relaxed">
            This section is protected. Please enter the authorized administrator password to manage citizen and household records.
          </p>

          <div>
            <label className="block font-semibold text-village-text text-xs uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-village-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-village-border bg-village-card/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-village-primary text-sm tracking-widest text-center font-bold"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-600 text-xs mt-1.5 font-medium">{error}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-sm shadow-soft transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Admin Access</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
