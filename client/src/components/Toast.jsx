import React from 'react';
import { useVillage } from '../context/VillageContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useVillage();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let bgStyle = 'bg-white border-village-primary text-village-text';
        let iconColor = 'text-village-primary-dark';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          bgStyle = 'bg-white border-red-400 text-village-text';
          iconColor = 'text-red-500';
        } else if (toast.type === 'info') {
          Icon = Info;
          bgStyle = 'bg-white border-village-secondary text-village-text';
          iconColor = 'text-village-primary';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-3.5 rounded-xl border shadow-elevated transition-all duration-300 transform translate-y-0 ${bgStyle}`}
          >
            <Icon className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${iconColor}`} />
            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-village-muted hover:text-village-text p-1 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
