import React, { useState, useRef } from 'react';
import { useVillage } from '../context/VillageContext';
import { 
  Users, 
  Home, 
  LayoutDashboard, 
  BarChart3, 
  HeartPulse, 
  UserPlus, 
  Download, 
  Upload, 
  RotateCcw, 
  Menu, 
  X, 
  ChevronDown, 
  Trophy, 
  Building2, 
  FileSpreadsheet, 
  ShieldCheck, 
  Eye, 
  Lock, 
  Compass,
  Database,
  Cloud
} from 'lucide-react';
import { exportVillagersToCsv, downloadJsonFile } from '../utils/helpers';
import Link from './Link';

export default function Header() {
  const { 
    villageMeta, 
    villagers, 
    households, 
    activeTab, 
    setActiveTab, 
    openAddVillagerModal, 
    openAddHouseholdModal,
    setDonorModalOpen,
    resetToDefault,
    clearAllData,
    importJsonData,
    showToast,
    isAdmin,
    isViewer,
    switchToViewer,
    setAdminLoginModalOpen,
    setSupabaseModalOpen,
    isCloudConnected
  } = useVillage();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dataDropdownOpen, setDataDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);

  const totalAchievements = villagers.reduce((sum, v) => sum + (v.achievements?.length || 0), 0);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'villagers', label: isViewer ? 'Public Directory' : 'Villagers', icon: Users, count: villagers.length, path: '/villagers' },
    { id: 'households', label: 'Households', icon: Home, count: households.length, path: '/households' },
    { id: 'achievements', label: 'Hall of Fame', icon: Trophy, count: totalAchievements, path: '/hall-of-fame' },
    { id: 'analytics', label: 'Demographics', icon: BarChart3, path: '/demographics' },
  ];

  const currentNav = navItems.find((n) => n.id === activeTab) || (activeTab === 'not-found' ? { label: '404 - Not Found' } : navItems[0]);

  const handleExportJson = () => {
    downloadJsonFile({
      villageMeta,
      households,
      villagers,
      exportedAt: new Date().toISOString()
    }, `${villageMeta.villageName.replace(/\s+/g, '_')}_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    showToast('JSON Database backup downloaded!');
    setDataDropdownOpen(false);
  };

  const handleExportCsv = () => {
    exportVillagersToCsv(villagers, households);
    showToast('Census CSV downloaded successfully!');
    setDataDropdownOpen(false);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        importJsonData(parsed);
      } catch {
        showToast('Invalid JSON file format', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setDataDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-village-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-17 sm:h-18 py-2 gap-3">
          
          {/* Logo & Panchayat Title */}
          <Link 
            to="/dashboard"
            className="flex items-center space-x-3 cursor-pointer shrink-0" 
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-village-primary-dark via-village-primary to-village-accent flex items-center justify-center text-white shadow-soft shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg text-village-text tracking-tight whitespace-nowrap">
                  {villageMeta.villageName}
                </span>
                <span className={`hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md border shrink-0 ${
                  isAdmin 
                    ? 'bg-village-secondary-light text-village-primary-darker border-village-secondary' 
                    : 'bg-village-card text-village-muted border-village-border'
                }`}>
                  {isAdmin ? 'Admin' : 'Public'}
                </span>
                {isAdmin && isCloudConnected && (
                  <span className="hidden md:inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md border bg-emerald-50 text-emerald-800 border-emerald-300 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Supabase Live</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-village-muted whitespace-nowrap hidden sm:block">
                Taluka: {villageMeta.block} • Dist: {villageMeta.district} ({villageMeta.state})
              </p>
            </div>
          </Link>

          {/* Right Action Bar + Hamburger Menu Toggle */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Active Section Breadcrumb Badge (Shows where user is) */}
            <div 
              onClick={() => setMenuOpen(!menuOpen)}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-village-card border border-village-border text-village-text hover:bg-village-secondary-light/60 transition-colors text-xs font-semibold cursor-pointer"
              title="Click to open menu and switch section"
            >
              <Compass className="w-3.5 h-3.5 text-village-primary" />
              <span className="text-village-muted text-[11px]">Section:</span>
              <span className="font-bold text-village-text">{currentNav.label}</span>
              <ChevronDown className={`w-3 h-3 text-village-muted transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Quick Action: Emergency Blood Donors */}
            <Link
              to="/donors"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-2xs"
              title="Emergency Blood Donors Finder (/donors)"
            >
              <HeartPulse className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="hidden sm:inline">Donors</span>
            </Link>

            {/* Quick Action: Register Villager (Admin) */}
            {isAdmin && (
              <button
                onClick={() => openAddVillagerModal()}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs sm:text-sm shadow-soft transition-all duration-150 active:scale-95 whitespace-nowrap cursor-pointer"
                title="Register New Villager"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">+ Villager</span>
              </button>
            )}

            {/* Quick Action: Staff Login (Viewer) */}
            {isViewer && (
              <button
                onClick={() => setAdminLoginModalOpen(true)}
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs shadow-soft transition-all duration-150 whitespace-nowrap cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Staff Login</span>
              </button>
            )}

            {/* Data Hub Dropdown (Admin) */}
            {isAdmin && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setDataDropdownOpen(!dataDropdownOpen)}
                  className="flex items-center space-x-1 p-2 rounded-xl border border-village-border hover:bg-village-card text-village-muted hover:text-village-text transition-all cursor-pointer"
                  title="Data Hub & Export Options"
                >
                  <Download className="w-4 h-4 text-village-muted" />
                  <ChevronDown className="w-3 h-3 text-village-muted" />
                </button>

                {dataDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-village-border py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setDataDropdownOpen(false)}
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-village-muted uppercase tracking-wider">
                      Admin Data Hub
                    </div>
                    <button
                      onClick={() => {
                        setSupabaseModalOpen(true);
                        setDataDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-village-text hover:bg-emerald-50 transition-colors text-left font-bold cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Database className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Supabase Cloud DB</span>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    </button>
                    <hr className="my-1 border-village-border" />
                    <button
                      onClick={handleExportCsv}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-village-text hover:bg-village-card transition-colors text-left font-medium cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-village-primary" />
                      <span>Export Census (CSV)</span>
                    </button>
                    <button
                      onClick={handleExportJson}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-village-text hover:bg-village-card transition-colors text-left font-medium cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-village-primary" />
                      <span>Export Backup (JSON)</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-village-text hover:bg-village-card transition-colors text-left font-medium cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-village-primary" />
                      <span>Restore Data (JSON)</span>
                    </button>
                    <hr className="my-1 border-village-border" />
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete all villager and household records to start fresh?')) {
                          clearAllData();
                          setDataDropdownOpen(false);
                        }
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left font-bold cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-red-500" />
                      <span>Clear All Records</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* HAMBURGER MENU TOGGLE BUTTON (Prominent on all screens) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex items-center space-x-2 px-3 sm:px-3.5 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                menuOpen
                  ? 'bg-village-primary text-white border-village-primary shadow-soft font-bold'
                  : 'bg-white hover:bg-village-secondary-light/70 text-village-text border-village-border font-bold shadow-2xs'
              }`}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span className="text-xs sm:text-sm font-bold">
                {menuOpen ? 'Close' : 'Menu'}
              </span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* HAMBURGER STYLE MENU DRAWER (Matches Image 2, responsive for all screens) */}
        {menuOpen && (
          <div className="pb-5 pt-3 border-t border-village-border space-y-3 animate-in slide-in-from-top-2 duration-200">
            
            {/* 2-Column Navigation Grid matching Image 2 */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-village-primary text-white shadow-soft'
                        : 'bg-village-card text-village-text hover:bg-village-secondary-light border border-village-border'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        isActive 
                          ? 'bg-white/25 text-white' 
                          : 'bg-village-secondary-light text-village-primary-darker border border-village-secondary/60'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Quick Action Tools Stack (Matches Image 2) */}
            <div className="space-y-2 pt-1">
              
              {/* Emergency Blood Donors Finder (Red pill) */}
              <Link
                to="/donors"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 p-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs"
              >
                <HeartPulse className="w-4 h-4 text-red-500 animate-pulse" />
                <span>Emergency Blood Donors Finder</span>
              </Link>

              {/* Add Household Entity (Green pill for admin) */}
              {isAdmin && (
                <>
                  <button
                    onClick={() => {
                      openAddHouseholdModal();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 p-3 rounded-2xl bg-village-secondary-light hover:bg-village-secondary text-village-primary-darker font-bold text-xs sm:text-sm border border-village-secondary transition-colors cursor-pointer"
                  >
                    <Home className="w-4 h-4" />
                    <span>Add Household Entity</span>
                  </button>

                  <button
                    onClick={() => {
                      setSupabaseModalOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 font-bold text-xs sm:text-sm border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <span>Supabase Cloud Database</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-emerald-300">
                      {isCloudConnected ? 'Connected' : 'Configure'}
                    </span>
                  </button>
                </>
              )}

              {/* Download Census CSV (Viewer) */}
              {isViewer && (
                <button
                  onClick={() => {
                    handleExportCsv();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 rounded-2xl bg-village-secondary-light hover:bg-village-secondary text-village-primary-darker font-bold text-xs sm:text-sm border border-village-secondary transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-village-primary-dark" />
                  <span>Download Public Census Summary (CSV)</span>
                </button>
              )}

              {/* Switch to Public Viewer / Staff Login (White bordered pill) */}
              {isAdmin ? (
                <button
                  onClick={() => {
                    switchToViewer();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 rounded-2xl bg-white hover:bg-village-card border border-village-border text-xs sm:text-sm font-bold text-village-text transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-village-primary" />
                  <span>Switch to Public Viewer View</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAdminLoginModalOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 rounded-2xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs sm:text-sm shadow-soft transition-colors cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Panchayat Staff Login</span>
                </button>
              )}

            </div>
          </div>
        )}

      </div>
    </header>
  );
}
