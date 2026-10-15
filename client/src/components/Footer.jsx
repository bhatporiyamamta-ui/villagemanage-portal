import React from 'react';
import { useVillage } from '../context/VillageContext';
import { 
  MapPin, 
  ExternalLink, 
  PhoneCall, 
  Mail
} from 'lucide-react';
import villageIcon from '../assets/Images/icon.jpeg';

export default function Footer() {
  const { villageMeta } = useVillage();
  const mapUrl = villageMeta.mapUrl || "https://www.google.com/maps?q=21.193250,72.747722";

  return (
    <footer className="mt-auto border-t border-village-border bg-white text-village-text">
      
      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          {/* Organization Details & Contacts */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-soft shrink-0 border border-village-primary/30 bg-white">
                <img src={villageIcon} alt="Panchayat Icon" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-village-text tracking-tight">
                  {villageMeta.villageName}
                </h3>
                <p className="text-xs text-village-muted">
                  Taluka: {villageMeta.block} | District: {villageMeta.district} ({villageMeta.state})
                </p>
              </div>
            </div>

            <p className="text-xs text-village-muted leading-relaxed">
              Official community trust portal serving citizen records, demographic administration, and emergency health assistance.
            </p>

            {/* Address & Contacts */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-village-muted pt-1">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-village-primary shrink-0" />
                <span>{villageMeta.address || "5PVX+G44, RJD Integrated Textile Park, Limla, Gujarat 394510"}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-village-primary shrink-0" />
                <span>{villageMeta.panchayatOfficePhone}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-village-primary shrink-0" />
                <span>{villageMeta.email || 'office@ichhaporebhathapanch.org'}</span>
              </div>
            </div>
          </div>

          {/* Map Link Action */}
          <div className="shrink-0 pt-2 md:pt-0">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs shadow-soft transition-all duration-150 active:scale-95 group cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 text-white/80" />
            </a>
          </div>

        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-village-border bg-village-card/60 py-3.5 text-xs text-village-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px]">
          <div>
            © {new Date().getFullYear()} <strong>{villageMeta.villageName}</strong>. All rights reserved.
          </div>
          <div className="text-village-muted">
            PIN: {villageMeta.pincode || '394510'} • Taluka: {villageMeta.block} • District: {villageMeta.district}
          </div>
        </div>
      </div>

    </footer>
  );
}
