import React from 'react';
import { useVillage } from '../context/VillageContext';
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  PhoneCall, 
  Mail, 
  ShieldCheck, 
  Crown, 
  Award, 
  FileText, 
  Wallet, 
  HeartPulse, 
  LayoutDashboard, 
  Users, 
  Home, 
  Trophy, 
  FileSpreadsheet,
  Eye,
  Lock
} from 'lucide-react';
import { exportVillagersToCsv } from '../utils/helpers';
import Link from './Link';

export default function Footer() {
  const { 
    villageMeta, 
    villagers, 
    households, 
    setActiveTab, 
    setDonorModalOpen, 
    isAdmin, 
    isViewer, 
    switchToViewer, 
    setAdminLoginModalOpen 
  } = useVillage();

  const mapUrl = villageMeta.mapUrl || "https://www.google.com/maps?q=21.193250,72.747722";

  const handleDownloadCsv = () => {
    exportVillagersToCsv(villagers, households);
  };

  const leaders = [
    {
      role: 'Pramukh (President)',
      name: villageMeta.pramukh || 'Rameshbhai Bhandari',
      icon: Crown,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      role: 'Up-Pramukh (Vice-President)',
      name: villageMeta.upPramukh || 'Dineshbhai Bhandari',
      icon: Award,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      role: 'Mantri (Secretary)',
      name: villageMeta.mantri || 'Sureshbhai Bhandari',
      icon: FileText,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      role: 'Treasurer (Tresars / Khajanchi)',
      name: villageMeta.treasurer || 'Pravinbhai Bhandari',
      icon: Wallet,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
    }
  ];

  return (
    <footer className="mt-auto border-t border-village-border bg-white text-village-text">
      
      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Organization & Google Maps Link (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-village-primary-dark via-village-primary to-village-accent flex items-center justify-center text-white shadow-soft shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-village-text tracking-tight">
                  {villageMeta.villageName}
                </h3>
                <p className="text-xs text-village-muted">
                  Official Community Panch & Citizen Governance Portal
                </p>
              </div>
            </div>

            <p className="text-xs text-village-muted leading-relaxed">
              Serving the rural welfare, demographic records, education advancement, and health assistance of the community.
            </p>

            {/* Address & Contacts */}
            <div className="space-y-2 text-xs text-village-muted pt-1">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-village-primary shrink-0 mt-0.5" />
                <span>
                  {villageMeta.address || "5PVX+G44, RJD Integrated Textile Park, Limla, Gujarat 394510"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-village-primary shrink-0" />
                <span>Office: {villageMeta.panchayatOfficePhone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-village-primary shrink-0" />
                <span>Email: {villageMeta.email || 'office@ichhaporebhathapanch.org'}</span>
              </div>
            </div>

            {/* Google Map Link Button */}
            <div className="pt-2">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs shadow-soft transition-all duration-150 active:scale-95 group cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>View Village on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/80" />
              </a>
            </div>
          </div>

          {/* Column 2: Leadership / Executive Committee (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-village-muted">
              <ShieldCheck className="w-4 h-4 text-village-primary" />
              <span>Panch Leadership & Committee</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {leaders.map((leader) => {
                const LeaderIcon = leader.icon;
                return (
                  <div 
                    key={leader.role}
                    className="p-3 rounded-2xl bg-village-card border border-village-border flex items-center justify-between hover:border-village-primary transition-colors"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-xl bg-white border border-village-border flex items-center justify-center shrink-0 shadow-2xs">
                        <LeaderIcon className="w-4 h-4 text-village-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold text-village-muted truncate">
                          {leader.role}
                        </div>
                        <div className="font-extrabold text-xs sm:text-sm text-village-text truncate">
                          {leader.name}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border shrink-0 ${leader.badgeColor}`}>
                      Official
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Quick Navigation & Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-village-muted">
              Portal Services
            </div>

            <ul className="space-y-2 text-xs font-semibold text-village-muted">
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 hover:text-village-primary transition-colors cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-village-primary" />
                  <span>Dashboard Overview</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/villagers"
                  className="flex items-center space-x-2 hover:text-village-primary transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-village-primary" />
                  <span>Citizens Directory ({villagers.length})</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/households"
                  className="flex items-center space-x-2 hover:text-village-primary transition-colors cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-village-primary" />
                  <span>Households Registry ({households.length})</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/hall-of-fame"
                  className="flex items-center space-x-2 hover:text-village-primary transition-colors cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Village Hall of Fame</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/donors"
                  className="flex items-center space-x-2 hover:text-red-600 transition-colors cursor-pointer text-red-600 font-bold"
                >
                  <HeartPulse className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span>Emergency Blood Donors</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleDownloadCsv}
                  className="flex items-center space-x-2 hover:text-village-primary transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-village-primary" />
                  <span>Download Census (CSV)</span>
                </button>
              </li>
            </ul>

            {/* Portal Mode Box */}
            <div className="pt-3 border-t border-village-border">
              <div className="p-3 rounded-xl bg-village-card border border-village-border space-y-1.5">
                <div className="text-[11px] font-bold text-village-muted">
                  Current Access Mode:
                </div>
                <div className="font-extrabold text-xs text-village-text flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-village-primary' : 'bg-emerald-500'}`} />
                  <span>{isAdmin ? 'Panchayat Admin Mode' : 'Public Citizen View'}</span>
                </div>
                {isAdmin ? (
                  <button
                    onClick={switchToViewer}
                    className="text-[11px] font-bold text-village-primary hover:underline flex items-center space-x-1 pt-0.5 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Switch to Public Viewer →</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setAdminLoginModalOpen(true)}
                    className="text-[11px] font-bold text-village-primary hover:underline flex items-center space-x-1 pt-0.5 cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Panchayat Staff Login →</span>
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-village-border bg-village-card/60 py-4 text-xs text-village-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left text-[11px]">
          <div>
            © {new Date().getFullYear()} <strong>{villageMeta.villageName}</strong>. All rights reserved.
          </div>
          <div className="flex items-center space-x-3">
            <span>Taluka: {villageMeta.block}</span>
            <span>•</span>
            <span>District: {villageMeta.district} (Gujarat)</span>
            <span>•</span>
            <a 
              href={mapUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-village-primary hover:underline font-bold inline-flex items-center space-x-1"
            >
              <span>Map Link</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}
