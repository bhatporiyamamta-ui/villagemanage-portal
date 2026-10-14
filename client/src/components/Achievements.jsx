import React, { useState } from 'react';
import { useVillage } from '../context/VillageContext';
import { 
  Trophy, 
  Medal, 
  Award, 
  GraduationCap, 
  Sparkles, 
  Plus, 
  Search, 
  Trash2, 
  Calendar, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Flame,
  Star
} from 'lucide-react';
import { calculateAge, getInitials } from '../utils/helpers';
import { ACHIEVEMENT_CATEGORIES } from '../data/constants';

export default function Achievements() {
  const { 
    villagers, 
    households, 
    openAddAchievementModal, 
    deleteAchievement, 
    setIdCardModalVillager,
    isAdmin, 
    isViewer 
  } = useVillage();

  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('category') || 'all';
    }
    return 'all';
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('search') || p.get('q') || '';
    }
    return '';
  });

  const householdMap = new Map(households.map((h) => [h.id, h]));

  // Flatten all achievements paired with their villager
  const allAchievements = villagers.flatMap((v) =>
    (v.achievements || []).map((ach) => ({
      ...ach,
      villager: v
    }))
  );

  // Filter logic
  const filteredAchievements = allAchievements.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchName = item.villager?.name?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchLevel = item.level?.toLowerCase().includes(q);
      return matchTitle || matchName || matchDesc || matchLevel;
    }
    return true;
  });

  // Category counts
  const academicCount = allAchievements.filter((a) => a.category?.includes('Academic')).length;
  const sportsCount = allAchievements.filter((a) => a.category?.includes('Sports')).length;
  const stateOrNationalCount = allAchievements.filter(
    (a) => a.level?.includes('State') || a.level?.includes('National')
  ).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-village-primary-dark via-village-primary to-village-secondary p-6 sm:p-8 text-white shadow-soft">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-village-accent" />
            <span>Village Pride & Hall of Fame</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Celebrated Achievements & Honors
          </h1>

          <p className="text-white/90 text-sm leading-relaxed">
            Recognizing class toppers, sports champions, agricultural innovators, master artisans, and community heroes across the village.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            {isAdmin && (
              <button
                onClick={() => openAddAchievementModal()}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-village-primary-darker hover:bg-village-secondary-light font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-village-primary-dark" />
                <span>Award New Achievement</span>
              </button>
            )}

            <div className="flex items-center space-x-2 text-xs font-semibold bg-white/20 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-white/20">
              <Star className="w-4 h-4 text-amber-300" />
              <span>{allAchievements.length} Total Accolades Recorded</span>
            </div>
          </div>
        </div>

        {/* Soft background shape */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-village-accent/20 blur-2xl pointer-events-none" />
      </div>

      {/* KPI Counters (Exact match to Dashboard KPI cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Honors */}
        <div 
          onClick={() => setSelectedCategory('all')}
          className="bg-white p-5 rounded-2xl border border-village-border hover:border-village-primary hover:shadow-soft transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-village-muted">Total Honors</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-amber-200">
              <Trophy className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-village-text">{allAchievements.length}</div>
            <div className="text-xs text-village-muted mt-1">
              Village pride awards
            </div>
          </div>
        </div>

        {/* Class Toppers */}
        <div 
          onClick={() => setSelectedCategory('Academic & Class Topper')}
          className="bg-white p-5 rounded-2xl border border-village-border hover:border-village-primary hover:shadow-soft transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-village-muted">Class Toppers</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-blue-200">
              <GraduationCap className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-village-text">{academicCount}</div>
            <div className="text-xs text-village-muted mt-1">
              Academic merit ranks
            </div>
          </div>
        </div>

        {/* Sports Stars */}
        <div 
          onClick={() => setSelectedCategory('Sports & Athletics')}
          className="bg-white p-5 rounded-2xl border border-village-border hover:border-village-primary hover:shadow-soft transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-village-muted">Sports Stars</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-emerald-200">
              <Medal className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-village-text">{sportsCount}</div>
            <div className="text-xs text-village-muted mt-1">
              Athletics & tournaments
            </div>
          </div>
        </div>

        {/* State / National */}
        <div 
          onClick={() => setSelectedCategory('all')}
          className="bg-white p-5 rounded-2xl border border-village-border hover:border-village-primary hover:shadow-soft transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-village-muted">State / National</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-purple-200">
              <Flame className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-village-text">{stateOrNationalCount}</div>
            <div className="text-xs text-village-muted mt-1">
              High-level recognition
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-village-border shadow-xs space-y-3.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-village-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search achievements by topper name, sport, title, or rank..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-village-border bg-village-card/30 focus:bg-white text-xs sm:text-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-village-primary text-white font-bold shadow-xs'
                : 'bg-village-card hover:bg-village-secondary-light/70 text-village-text border border-village-border'
            }`}
          >
            All Accolades ({allAchievements.length})
          </button>

          {ACHIEVEMENT_CATEGORIES.map((cat) => {
            const count = allAchievements.filter((a) => a.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-village-primary text-white font-bold shadow-xs'
                    : 'bg-village-card hover:bg-village-secondary-light/70 text-village-text border border-village-border'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievements Grid */}
      {filteredAchievements.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-village-border space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-village-text">No Achievements Found</h3>
          <p className="text-xs text-village-muted max-w-sm mx-auto">
            No honors matched your current category or search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAchievements.map((item) => {
            const v = item.villager;
            const age = calculateAge(v.dob);
            const hh = householdMap.get(v.householdId);

            let badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
            if (item.level?.includes('National')) badgeColor = 'bg-purple-50 text-purple-800 border-purple-200';
            else if (item.level?.includes('State')) badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
            else if (item.level?.includes('District')) badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-village-border p-5 hover:border-village-primary hover:shadow-soft transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Level Badge & Year */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                      {item.level || 'Recognition'}
                    </span>
                    <span className="font-mono text-xs font-bold text-village-muted flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-village-muted" />
                      <span>{item.year}</span>
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h3 className="font-extrabold text-base text-village-text group-hover:text-village-primary-dark transition-colors leading-snug">
                    {item.title}
                  </h3>
                  
                  <div className="text-xs font-semibold text-village-primary-dark mt-1 flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>{item.category}</span>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs text-village-muted mt-2.5 leading-relaxed bg-village-card/60 p-2.5 rounded-xl border border-village-border">
                      {item.description}
                    </p>
                  )}

                  {/* Achiever Info Pill */}
                  <div className="mt-4 pt-3 border-t border-village-border flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-village-secondary-light text-village-primary-darker font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs border border-village-secondary">
                      {getInitials(v.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-village-text truncate">
                        {v.name}
                      </div>
                      <div className="text-[11px] text-village-muted truncate">
                        {v.occupation} • {age} yrs ({v.householdId || 'Resident'})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-village-border flex items-center justify-between">
                  <button
                    onClick={() => setIdCardModalVillager(v)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-village-border hover:bg-village-secondary-light text-village-text text-xs font-semibold transition-colors"
                  >
                    <span>Citizen Card</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Remove achievement "${item.title}"?`)) {
                          deleteAchievement(v.id, item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-village-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Achievement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
