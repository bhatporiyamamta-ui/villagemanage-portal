import React, { useState } from 'react';
import { useVillage } from '../context/VillageContext';
import Link from './Link';
import { 
  Compass, 
  Home, 
  Users, 
  HeartPulse, 
  Search, 
  ArrowLeft, 
  FileQuestion, 
  Building2, 
  CornerDownRight,
  Trophy,
  BarChart3
} from 'lucide-react';

export default function NotFound() {
  const { villageMeta, navigateTo, setSearchQuery } = useVillage();
  const [searchInput, setSearchInput] = useState('');

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      navigateTo(`/villagers?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigateTo('/villagers');
    }
  };

  const quickLinks = [
    {
      title: 'Dashboard Overview',
      desc: 'Summary statistics, recent registrations & Panch leadership',
      path: '/dashboard',
      icon: Home,
      badge: 'Home'
    },
    {
      title: 'Citizens Directory',
      desc: 'Browse, search, and verify all registered village citizens',
      path: '/villagers',
      icon: Users,
      badge: 'Registry'
    },
    {
      title: 'Households Registry',
      desc: 'Family records, street allocations & ration numbers',
      path: '/households',
      icon: Building2,
      badge: 'Housing'
    },
    {
      title: 'Emergency Blood Donors',
      desc: 'Instant compatible donor lookup by blood group',
      path: '/donors',
      icon: HeartPulse,
      badge: 'Emergency',
      badgeColor: 'bg-red-50 text-red-600 border-red-200'
    },
    {
      title: 'Hall of Fame & Pride',
      desc: 'Top scholars, sports champions & community honorees',
      path: '/hall-of-fame',
      icon: Trophy,
      badge: 'Accolades'
    },
    {
      title: 'Demographics & Stats',
      desc: 'Literacy charts, occupation distribution & age brackets',
      path: '/demographics',
      icon: BarChart3,
      badge: 'Analytics'
    }
  ];

  return (
    <div className="py-8 sm:py-12 animate-in fade-in duration-200 max-w-4xl mx-auto space-y-8">
      
      {/* 404 Hero Card */}
      <div className="bg-white rounded-3xl border border-village-border shadow-xs p-6 sm:p-10 text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-village-secondary-light/40 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
            <FileQuestion className="w-3.5 h-3.5 text-red-500" />
            <span>HTTP 404 • Resource Not Found</span>
          </div>

          {/* Large Clean 404 Graphic */}
          <div className="flex items-center justify-center space-x-3 pt-2">
            <span className="text-6xl sm:text-7xl font-black text-village-primary-dark tracking-tight">
              404
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-village-text tracking-tight">
            Page Not Found
          </h1>

          <p className="text-sm text-village-muted leading-relaxed">
            The requested web address{' '}
            <code className="px-2 py-0.5 rounded-md bg-village-card border border-village-border font-mono text-village-primary-darker text-xs font-bold break-all">
              {currentPath}
            </code>{' '}
            is not a valid route in the {villageMeta.villageName} portal. It may have been mistyped, renamed, or moved.
          </p>

          {/* Search Box on 404 page */}
          <form onSubmit={handleSearchSubmit} className="pt-2 max-w-md mx-auto">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-village-muted absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search citizen name or household ID..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-village-border bg-village-card/60 focus:bg-white text-xs sm:text-sm text-village-text focus:outline-none focus:ring-2 focus:ring-village-primary/20 focus:border-village-primary transition-all shadow-2xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs sm:text-sm shadow-soft transition-all active:scale-95 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </Link>

            <button
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  navigateTo('/dashboard');
                }
              }}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-village-card border border-village-border text-village-text font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Directory Quick Navigation Grid */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-village-muted">
          <Compass className="w-4 h-4 text-village-primary" />
          <span>Available Official Sections</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="p-4 rounded-2xl bg-white border border-village-border hover:border-village-primary hover:shadow-soft transition-all duration-200 group flex flex-col justify-between space-y-3 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-village-secondary-light text-village-primary-darker flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                    item.badgeColor || 'bg-village-card text-village-muted border-village-border'
                  }`}>
                    {item.badge}
                  </span>
                </div>

                <div>
                  <div className="font-extrabold text-sm text-village-text group-hover:text-village-primary-dark transition-colors flex items-center justify-between">
                    <span>{item.title}</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-village-muted group-hover:text-village-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-village-muted mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Support & Contact Footer Banner */}
      <div className="p-4 rounded-2xl bg-village-card border border-village-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-village-muted">
        <div>
          <strong>Need administrative assistance?</strong> Contact Panchayat office at {villageMeta.panchayatOfficePhone}.
        </div>
        <Link
          to="/dashboard"
          className="font-bold text-village-primary hover:underline whitespace-nowrap cursor-pointer"
        >
          {villageMeta.villageName} Official Portal →
        </Link>
      </div>

    </div>
  );
}
