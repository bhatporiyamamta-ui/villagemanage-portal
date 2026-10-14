import React from 'react';
import { VillageProvider, useVillage } from './context/VillageContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import VillagersDirectory from './components/VillagersDirectory';
import FamilyManagement from './components/FamilyManagement';
import Analytics from './components/Analytics';
import Achievements from './components/Achievements';
import VillagerFormModal from './components/VillagerFormModal';
import HouseholdFormModal from './components/HouseholdFormModal';
import VillagerIdCardModal from './components/VillagerIdCardModal';
import BloodDonorFinderModal from './components/BloodDonorFinderModal';
import AdminLoginModal from './components/AdminLoginModal';
import AchievementModal from './components/AchievementModal';
import SupabaseSettingsModal from './components/SupabaseSettingsModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import NotFound from './components/NotFound';

function AppContent() {
  const { activeTab, supabaseModalOpen, setSupabaseModalOpen } = useVillage();

  return (
    <div className="min-h-screen w-full bg-village-bg text-village-text flex flex-col font-sans selection:bg-village-secondary selection:text-village-text overflow-x-hidden">
      {/* Top Navbar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-x-hidden">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'villagers' && <VillagersDirectory />}
        {activeTab === 'households' && <FamilyManagement />}
        {activeTab === 'achievements' && <Achievements />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'not-found' && <NotFound />}
      </main>

      {/* Modals & Overlays */}
      <VillagerFormModal />
      <HouseholdFormModal />
      <VillagerIdCardModal />
      <BloodDonorFinderModal />
      <AdminLoginModal />
      <AchievementModal />
      <SupabaseSettingsModal 
        isOpen={supabaseModalOpen} 
        onClose={() => setSupabaseModalOpen(false)} 
      />
      <Toast />

      {/* Dedicated Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <VillageProvider>
      <AppContent />
    </VillageProvider>
  );
}
