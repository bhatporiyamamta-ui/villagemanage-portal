import React from 'react';
import { useVillage } from '../context/VillageContext';
import { 
  X, 
  Printer, 
  Download, 
  Building2, 
  QrCode, 
  ShieldCheck, 
  Phone, 
  Home, 
  GraduationCap, 
  Briefcase,
  Trophy 
} from 'lucide-react';
import { calculateAge, formatDate, getInitials } from '../utils/helpers';

export default function VillagerIdCardModal() {
  const { idCardModalVillager, setIdCardModalVillager, villageMeta, households } = useVillage();

  if (!idCardModalVillager) return null;

  const v = idCardModalVillager;
  const age = calculateAge(v.dob);
  const household = households.find((h) => h.id === v.householdId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-village-text/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-village-border shadow-elevated p-6 space-y-6 animate-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between no-print">
          <div>
            <h2 className="text-base font-bold text-village-text">Gram Panchayat Citizen ID Card</h2>
            <p className="text-xs text-village-muted">Official digital credential preview & print</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-village-primary text-white text-xs font-bold hover:bg-village-primary-dark transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Card</span>
            </button>
            <button
              onClick={() => setIdCardModalVillager(null)}
              className="p-1.5 rounded-xl text-village-muted hover:text-village-text hover:bg-village-card"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable ID Card Container */}
        <div className="print-card relative overflow-hidden rounded-2xl border-2 border-village-primary bg-gradient-to-br from-white via-village-card to-village-secondary-light/20 p-5 shadow-soft">
          
          {/* Card Header Strip */}
          <div className="flex items-center justify-between border-b-2 border-village-primary/30 pb-3 mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-village-primary text-white flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-extrabold tracking-wider text-village-primary-darker">
                  Gram Panchayat Citizen Card
                </div>
                <div className="text-sm font-black text-village-text leading-tight">
                  {villageMeta.villageName}
                </div>
                <div className="text-[10px] text-village-muted">
                  {villageMeta.block}, {villageMeta.district} ({villageMeta.state})
                </div>
              </div>
            </div>

            {/* Blood Group Highlight */}
            <div className="text-center px-2.5 py-1 rounded-xl bg-red-50 border border-red-200">
              <span className="text-[9px] uppercase font-bold text-red-500 block">Blood</span>
              <span className="text-sm font-black text-red-600">{v.bloodGroup}</span>
            </div>
          </div>

          {/* Card Content Grid */}
          <div className="grid grid-cols-3 gap-4 items-center">
            
            {/* Avatar / Photo */}
            <div className="col-span-1 flex flex-col items-center">
              <div className="w-24 h-28 rounded-xl bg-gradient-to-tr from-village-primary-dark via-village-primary to-village-secondary text-white font-black text-2xl flex items-center justify-center border-2 border-white shadow-md">
                {getInitials(v.name)}
              </div>
              <span className="mt-2 text-[10px] font-mono font-bold text-village-muted">
                {v.id}
              </span>
            </div>

            {/* Villager Attributes */}
            <div className="col-span-2 space-y-1.5 text-xs text-village-text">
              <div>
                <span className="text-[10px] uppercase font-bold text-village-muted block">Name</span>
                <span className="text-sm font-black text-village-text">{v.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-village-muted block">DOB / Age</span>
                  <span className="font-semibold">{formatDate(v.dob)} ({age}y)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-village-muted block">Gender</span>
                  <span className="font-semibold">{v.gender}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-village-muted block">Occupation</span>
                <span className="font-semibold text-village-text truncate block">{v.occupation}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-village-muted block">Education</span>
                <span className="font-semibold text-village-primary-darker truncate block">{v.education}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-village-muted block">Household / Address</span>
                <span className="font-semibold text-village-muted truncate block">
                  {v.householdId ? `${v.householdId} — #${household?.houseNumber || ''}, ${household?.street || ''}` : 'Unassigned'}
                </span>
              </div>
            </div>

          </div>

          {/* Honors & Accolades section if achiever */}
          {v.achievements && v.achievements.length > 0 && (
            <div className="mt-3 p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <div className="flex items-center space-x-1.5 text-amber-900 font-extrabold text-[11px]">
                <Trophy className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Panchayat Verified Honor & Accolade:</span>
              </div>
              <div className="font-bold text-village-text text-xs mt-0.5 truncate">
                {v.achievements[0].title}
              </div>
              <div className="text-[10px] text-amber-800 font-medium">
                {v.achievements[0].level} • {v.achievements[0].category} ({v.achievements[0].year})
              </div>
            </div>
          )}

          {/* Card Bottom Bar with QR & Verification */}
          <div className="mt-4 pt-3 border-t border-village-border flex items-center justify-between text-[10px] text-village-muted">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1 font-semibold text-village-primary-dark">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Panchayat Verified Record</span>
              </div>
              <div>Issue Date: {new Date().toLocaleDateString('en-IN')}</div>
              {v.phone && <div>Mobile: +91 {v.phone}</div>}
            </div>

            {/* QR Code Graphic placeholder */}
            <div className="p-1 rounded-lg bg-white border border-village-border flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm10 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm2-2h2v2h-2v-2zm-2-4h4v2h-4v-2z"/>
              </svg>
            </div>
          </div>

          {/* Watermark seal behind */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-5">
            <Building2 className="w-48 h-48" />
          </div>

        </div>

        {/* Modal Bottom buttons */}
        <div className="flex justify-between items-center no-print">
          <span className="text-xs text-village-muted">
            Card is compliant for local identity and ration authentication.
          </span>
          <button
            onClick={() => setIdCardModalVillager(null)}
            className="px-4 py-2 rounded-xl bg-village-card hover:bg-village-secondary-light text-village-text text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
