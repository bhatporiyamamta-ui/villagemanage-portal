import React, { useState } from 'react';
import { useVillage } from '../context/VillageContext';
import { 
  HeartPulse, 
  X, 
  Phone, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  Users
} from 'lucide-react';
import { BLOOD_GROUPS } from '../data/constants';
import { calculateAge } from '../utils/helpers';

export default function BloodDonorFinderModal() {
  const { donorModalOpen, setDonorModalOpen, villagers, households } = useVillage();

  const [selectedGroup, setSelectedGroup] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('group') || params.get('bloodGroup') || 'O+';
    }
    return 'O+';
  });
  const [donorSearch, setDonorSearch] = useState('');

  if (!donorModalOpen) return null;

  const householdMap = new Map(households.map((h) => [h.id, h]));

  const donors = villagers.filter((v) => {
    if (selectedGroup && v.bloodGroup !== selectedGroup) return false;
    if (donorSearch.trim()) {
      const q = donorSearch.toLowerCase();
      return v.name?.toLowerCase().includes(q) || v.phone?.includes(q) || v.householdId?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-village-text/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-village-border shadow-elevated p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-village-border pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center border border-red-200 animate-pulse">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-village-text">
                Emergency Blood Donor Finder
              </h2>
              <p className="text-xs text-village-muted">
                Quickly locate compatible donors in the village for medical emergencies
              </p>
            </div>
          </div>
          <button
            onClick={() => setDonorModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-village-card text-village-muted hover:text-village-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Blood Group Selectors */}
        <div>
          <label className="block text-xs font-bold text-village-muted uppercase tracking-wider mb-2">
            Select Required Blood Group:
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {BLOOD_GROUPS.map((bg) => {
              const isSelected = selectedGroup === bg;
              const count = villagers.filter((v) => v.bloodGroup === bg).length;
              return (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  className={`p-2 rounded-xl text-center font-bold text-xs transition-all ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-md scale-105'
                      : 'bg-village-card hover:bg-red-50 text-village-text border border-village-border'
                  }`}
                >
                  <div className="text-sm font-black">{bg}</div>
                  <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-village-muted'}`}>
                    {count}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Donor Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-village-muted" />
          <input
            type="text"
            value={donorSearch}
            onChange={(e) => setDonorSearch(e.target.value)}
            placeholder={`Filter ${selectedGroup} donors by name, phone...`}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-village-border text-xs focus:ring-1 focus:ring-red-400 bg-village-card/40 focus:bg-white"
          />
        </div>

        {/* Donor Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-village-border border rounded-2xl border-village-border">
          {donors.length === 0 ? (
            <div className="p-8 text-center text-xs text-village-muted">
              No registered villagers found with blood group <span className="font-bold text-red-600">{selectedGroup}</span>.
            </div>
          ) : (
            donors.map((d) => {
              const age = calculateAge(d.dob);
              const hh = householdMap.get(d.householdId);
              const isEligibleAge = typeof age === 'number' && age >= 18 && age <= 60;

              return (
                <div key={d.id} className="p-3.5 flex items-center justify-between hover:bg-village-card/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-village-text">{d.name}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        {d.bloodGroup}
                      </span>
                      {isEligibleAge ? (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Eligible Age ({age}y)
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          {age}y (Check doctor)
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-village-muted flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-village-muted" />
                      <span>{hh ? `#${hh.houseNumber}, ${hh.street}` : 'Panchayat Area'}</span>
                      <span>•</span>
                      <span>{d.occupation}</span>
                    </div>

                    {d.healthData?.emergencyContact && (
                      <div className="text-[11px] text-village-muted">
                        Emergency Contact: {d.healthData.emergencyContact}
                      </div>
                    )}
                  </div>

                  <div>
                    {d.phone ? (
                      <a
                        href={`tel:${d.phone}`}
                        className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call {d.phone}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-village-muted italic">No Phone</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-village-border text-xs">
          <span className="text-village-muted">
            Found {donors.length} registered donors
          </span>
          <button
            onClick={() => setDonorModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-village-card text-village-text font-bold hover:bg-village-secondary-light"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
