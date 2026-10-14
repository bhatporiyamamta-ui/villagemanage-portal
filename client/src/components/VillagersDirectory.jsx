import React, { useState } from 'react';
import { useVillage } from '../context/VillageContext';
import { 
  Search, 
  Users,
  SlidersHorizontal, 
  RotateCcw, 
  UserPlus, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Home, 
  Edit3, 
  Trash2, 
  Grid, 
  List, 
  Award,
  ChevronDown,
  ChevronUp,
  X,
  Eye,
  ShieldCheck,
  Trophy
} from 'lucide-react';
import { OCCUPATIONS, EDUCATION_LEVELS, BLOOD_GROUPS, GENDERS } from '../data/constants';
import { calculateAge, formatDate, getInitials } from '../utils/helpers';

export default function VillagersDirectory() {
  const { 
    villagers, 
    households, 
    searchQuery, 
    setSearchQuery, 
    filters, 
    setFilterValue, 
    resetAllFilters, 
    openAddVillagerModal, 
    openEditVillagerModal, 
    deleteVillager,
    setIdCardModalVillager,
    setSelectedHouseholdDetail,
    setActiveTab,
    setDonorModalOpen,
    openAddAchievementModal,
    isAdmin,
    isViewer
  } = useVillage();

  const [viewMode, setViewMode] = useState('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const householdMap = new Map(households.map((h) => [h.id, h]));
  const [activePreset, setActivePreset] = useState('all');

  const handlePresetClick = (presetKey) => {
    setActivePreset(presetKey);
    resetAllFilters();
    if (presetKey === 'farmers') {
      setFilterValue('occupation', 'Farmer / Agriculture');
    } else if (presetKey === 'jobs') {
      setFilterValue('occupation', 'Job');
    } else if (presetKey === 'students') {
      setFilterValue('occupation', 'Student');
    } else if (presetKey === 'business') {
      setFilterValue('occupation', 'Small Business Owner');
    } else if (presetKey === 'seniors') {
      setFilterValue('ageGroup', 'senior');
    } else if (presetKey === 'children') {
      setFilterValue('ageGroup', 'child');
    }
  };

  const filteredVillagers = villagers.filter((v) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = v.name?.toLowerCase().includes(q);
      const matchId = v.id?.toLowerCase().includes(q);
      const matchPhone = v.phone?.includes(q);
      const matchHousehold = v.householdId?.toLowerCase().includes(q);
      const matchOcc = v.occupation?.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchPhone && !matchHousehold && !matchOcc) {
        return false;
      }
    }

    if (filters.occupation && v.occupation !== filters.occupation) return false;
    if (filters.education && v.education !== filters.education) return false;
    if (filters.bloodGroup && v.bloodGroup !== filters.bloodGroup) return false;
    if (filters.gender && v.gender !== filters.gender) return false;
    if (filters.householdId && v.householdId !== filters.householdId) return false;

    if (filters.ageGroup) {
      const age = calculateAge(v.dob);
      if (typeof age === 'number') {
        if (filters.ageGroup === 'child' && age >= 18) return false;
        if (filters.ageGroup === 'youth' && (age < 18 || age > 35)) return false;
        if (filters.ageGroup === 'middle' && (age < 36 || age > 59)) return false;
        if (filters.ageGroup === 'senior' && age < 60) return false;
      }
    }

    return true;
  });

  const activeAdvancedFilterCount = Object.values(filters).filter(Boolean).length;

  const handleHouseholdClick = (householdId) => {
    const hh = householdMap.get(householdId);
    if (hh) {
      setSelectedHouseholdDetail(hh);
      setActiveTab('households');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-village-text tracking-tight">
              {isViewer ? 'Public Citizen Directory' : 'Villagers Directory'}
            </h1>
            <span className="px-3 py-1 bg-village-secondary-light text-village-primary-darker font-bold rounded-full text-xs border border-village-secondary">
              {filteredVillagers.length} of {villagers.length}
            </span>
            {isViewer && (
              <span className="px-2.5 py-0.5 bg-village-card text-village-muted font-bold rounded-full text-[10px] border border-village-border">
                Read-Only
              </span>
            )}
          </div>
          <p className="text-sm text-village-muted mt-1">
            {isViewer
              ? 'Public search and verification registry for village citizens and digital ID credentials.'
              : 'Browse, search, edit citizen records and print government citizen identification cards.'}
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          {/* Grid / Table Switch */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-village-border shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-village-primary text-white shadow-xs'
                  : 'text-village-muted hover:text-village-text'
              }`}
              title="Card Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-village-primary text-white shadow-xs'
                  : 'text-village-muted hover:text-village-text'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Villager (Admin only) */}
          {isAdmin && (
            <button
              onClick={() => openAddVillagerModal()}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-sm shadow-soft transition-all duration-200 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Villager</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-village-border shadow-xs space-y-3.5">
        
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-village-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, mobile number, occupation, household..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-village-border bg-village-card/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-village-primary focus:border-village-primary text-sm transition-all placeholder:text-village-muted"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-village-muted hover:text-village-text rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              showAdvancedFilters || activeAdvancedFilterCount > 0
                ? 'bg-village-secondary-light border-village-secondary text-village-primary-darker'
                : 'bg-white border-village-border text-village-text hover:bg-village-card'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-village-primary" />
            <span>Filters</span>
            {activeAdvancedFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-village-primary text-white text-[10px] font-black flex items-center justify-center">
                {activeAdvancedFilterCount}
              </span>
            )}
            {showAdvancedFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {(activeAdvancedFilterCount > 0 || searchQuery || activePreset !== 'all') && (
            <button
              onClick={() => {
                resetAllFilters();
                setActivePreset('all');
              }}
              className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-colors"
              title="Clear all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Clear</span>
            </button>
          )}
        </div>

        {/* Quick Category Preset Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 text-xs no-scrollbar">
          {[
            { id: 'all', label: `All (${villagers.length})` },
            { id: 'farmers', label: '🌾 Farmers' },
            { id: 'jobs', label: '💼 Job' },
            { id: 'students', label: '🎓 Students' },
            { id: 'business', label: '🏬 Business' },
            { id: 'seniors', label: '👴 Seniors (60+)' },
            { id: 'children', label: '👶 Children (<18)' },
          ].map((preset) => {
            const isSelected = activePreset === preset.id && !filters.bloodGroup;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset.id)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-village-primary text-white font-bold shadow-xs'
                    : 'bg-village-card hover:bg-village-secondary-light/70 text-village-text border border-village-border'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
          
          <button
            onClick={() => setDonorModalOpen(true)}
            className="px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all flex items-center space-x-1"
          >
            <span>🩸 Blood Donors</span>
          </button>
        </div>

        {/* Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-village-border grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 animate-in slide-in-from-top-1 duration-150">
            <div>
              <label className="block text-[11px] font-bold text-village-muted uppercase tracking-wider mb-1">
                Occupation
              </label>
              <select
                value={filters.occupation}
                onChange={(e) => {
                  setFilterValue('occupation', e.target.value);
                  setActivePreset('custom');
                }}
                className="w-full text-xs py-2 px-2.5 rounded-xl border border-village-border bg-white text-village-text focus:outline-none focus:ring-1 focus:ring-village-primary font-medium"
              >
                <option value="">All Occupations</option>
                {OCCUPATIONS.map((occ) => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-village-muted uppercase tracking-wider mb-1">
                Education Level
              </label>
              <select
                value={filters.education}
                onChange={(e) => {
                  setFilterValue('education', e.target.value);
                  setActivePreset('custom');
                }}
                className="w-full text-xs py-2 px-2.5 rounded-xl border border-village-border bg-white text-village-text focus:outline-none focus:ring-1 focus:ring-village-primary font-medium"
              >
                <option value="">All Education</option>
                {EDUCATION_LEVELS.map((edu) => (
                  <option key={edu} value={edu}>{edu}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-village-muted uppercase tracking-wider mb-1">
                Blood Group
              </label>
              <select
                value={filters.bloodGroup}
                onChange={(e) => {
                  setFilterValue('bloodGroup', e.target.value);
                  setActivePreset('custom');
                }}
                className="w-full text-xs py-2 px-2.5 rounded-xl border border-village-border bg-white text-village-text focus:outline-none focus:ring-1 focus:ring-village-primary font-medium"
              >
                <option value="">All Blood Groups</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-village-muted uppercase tracking-wider mb-1">
                Gender
              </label>
              <select
                value={filters.gender}
                onChange={(e) => {
                  setFilterValue('gender', e.target.value);
                  setActivePreset('custom');
                }}
                className="w-full text-xs py-2 px-2.5 rounded-xl border border-village-border bg-white text-village-text focus:outline-none focus:ring-1 focus:ring-village-primary font-medium"
              >
                <option value="">All Genders</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-village-muted uppercase tracking-wider mb-1">
                Age Demographic
              </label>
              <select
                value={filters.ageGroup}
                onChange={(e) => {
                  setFilterValue('ageGroup', e.target.value);
                  setActivePreset('custom');
                }}
                className="w-full text-xs py-2 px-2.5 rounded-xl border border-village-border bg-white text-village-text focus:outline-none focus:ring-1 focus:ring-village-primary font-medium"
              >
                <option value="">All Ages</option>
                <option value="child">Children (&lt;18)</option>
                <option value="youth">Youth (18 - 35)</option>
                <option value="middle">Middle-aged (36 - 59)</option>
                <option value="senior">Senior Citizens (60+)</option>
              </select>
            </div>
          </div>
        )}

      </div>

      {/* Empty State */}
      {filteredVillagers.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-village-border space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-village-card flex items-center justify-center text-village-muted">
            {villagers.length === 0 ? <Users className="w-8 h-8 text-village-primary" /> : <Search className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-village-text">
              {villagers.length === 0 ? 'No Villagers Registered Yet' : 'No Villagers Found'}
            </h3>
            <p className="text-sm text-village-muted mt-1 max-w-sm mx-auto">
              {villagers.length === 0 
                ? 'Your village directory is clean and ready. Click below to register the first resident.' 
                : 'No citizen records matched your current query or filters.'}
            </p>
          </div>
          <div className="flex justify-center space-x-3 pt-2">
            {villagers.length > 0 && (
              <button
                onClick={() => {
                  resetAllFilters();
                  setActivePreset('all');
                }}
                className="px-4 py-2 rounded-xl bg-village-card text-village-text hover:bg-village-secondary-light font-bold text-xs border border-village-border cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => openAddVillagerModal()}
                className="px-4 py-2 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs shadow-soft cursor-pointer"
              >
                + Register {villagers.length === 0 ? 'First ' : ''}Villager
              </button>
            )}
          </div>
        </div>
      )}

      {/* Card Grid View */}
      {viewMode === 'grid' && filteredVillagers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVillagers.map((v) => {
            const age = calculateAge(v.dob);
            const isHead = v.relationship === 'Head of Household';
            const ongoing = v.ongoingEducation;

            return (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-village-border p-5 hover:border-village-primary hover:shadow-soft transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-village-secondary-light text-village-primary-darker font-black flex items-center justify-center text-sm flex-shrink-0 border border-village-secondary">
                        {getInitials(v.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-village-text truncate group-hover:text-village-primary-dark transition-colors">
                          {v.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-[11px] font-mono text-village-muted">
                            {v.id}
                          </span>
                          {isHead && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              Head
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span 
                      onClick={() => setFilterValue('bloodGroup', v.bloodGroup)}
                      className="px-2.5 py-1 rounded-xl bg-red-50 text-red-600 font-black text-xs border border-red-200 cursor-pointer hover:bg-red-100 transition-colors flex-shrink-0"
                      title="Filter blood group"
                    >
                      {v.bloodGroup}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-village-text">
                    <div className="flex items-center space-x-2 text-village-muted">
                      <span className="font-semibold text-village-text">{v.gender}</span>
                      <span>•</span>
                      <span>{age} years old ({formatDate(v.dob)})</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-village-muted flex-shrink-0" />
                      {v.phone ? (
                        <a href={`tel:${v.phone}`} className="font-medium text-village-primary-dark hover:underline">
                          +91 {v.phone}
                        </a>
                      ) : (
                        <span className="text-village-muted italic">No phone listed</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-3.5 h-3.5 text-village-muted flex-shrink-0" />
                      <span className="font-medium truncate">{v.occupation || 'Unspecified'}</span>
                    </div>

                    <div className="flex items-start space-x-2">
                      <GraduationCap className="w-3.5 h-3.5 text-village-muted mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="font-medium truncate block">{v.education || 'Unspecified'}</span>
                        {ongoing?.isEnrolled && (
                          <div className="mt-1 p-1.5 rounded-lg bg-village-secondary-light/50 text-[11px] text-village-primary-darker font-semibold border border-village-secondary">
                            Studying: {ongoing.gradeOrYear || ''}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-village-border flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <Home className="w-3.5 h-3.5 text-village-muted flex-shrink-0" />
                        {v.householdId ? (
                          <button
                            onClick={() => handleHouseholdClick(v.householdId)}
                            className="font-bold text-village-primary-dark hover:underline flex items-center space-x-1 truncate"
                          >
                            <span>{v.householdId}</span>
                            <span className="text-village-muted font-normal">({v.relationship || 'Member'})</span>
                          </button>
                        ) : (
                          <span className="text-village-muted italic">No Household</span>
                        )}
                      </div>
                    </div>

                    {/* Honors & Achievements Pill */}
                    {v.achievements && v.achievements.length > 0 && (
                      <div
                        onClick={() => setActiveTab('achievements')}
                        className="mt-1 flex items-center justify-between p-1.5 rounded-lg bg-amber-50 text-[11px] text-amber-900 font-bold border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
                        title="Click to view in Village Hall of Fame"
                      >
                        <div className="flex items-center space-x-1.5 min-w-0">
                          <Trophy className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span className="truncate">{v.achievements[0].title}</span>
                        </div>
                        {v.achievements.length > 1 && (
                          <span className="text-[10px] text-amber-800 bg-amber-200/80 px-1 rounded-full font-black flex-shrink-0 ml-1">
                            +{v.achievements.length - 1}
                          </span>
                        )}
                      </div>
                    )}

                  </div>
                </div>

                {/* Actions: In Viewer mode, only "Citizen ID" is available */}
                <div className="mt-4 pt-3 border-t border-village-border flex items-center justify-between">
                  <button
                    onClick={() => setIdCardModalVillager(v)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-village-border hover:bg-village-secondary-light text-village-text text-xs font-semibold transition-colors"
                  >
                    <Award className="w-3.5 h-3.5 text-village-primary" />
                    <span>Citizen ID</span>
                  </button>

                  {isAdmin && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openAddAchievementModal(v.id)}
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 hover:text-amber-700 transition-colors"
                        title="Award Achievement / Honor"
                      >
                        <Trophy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openEditVillagerModal(v)}
                        className="p-1.5 rounded-lg hover:bg-village-secondary-light text-village-primary-dark transition-colors"
                        title="Edit Profile"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      
                      {deleteConfirmId === v.id ? (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              deleteVillager(v.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 rounded bg-red-600 text-white text-[11px] font-bold"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-1.5 py-1 rounded bg-village-card text-[11px] text-village-muted"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(v.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-village-muted hover:text-red-500 transition-colors"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {isViewer && (
                    <span className="text-[11px] text-village-muted font-medium">
                      Verified Record
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredVillagers.length > 0 && (
        <div className="bg-white rounded-2xl border border-village-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-village-card/80 border-b border-village-border uppercase text-[11px] font-bold text-village-muted tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Citizen</th>
                  <th className="py-3.5 px-4">Gender & Age</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Blood</th>
                  <th className="py-3.5 px-4">Occupation</th>
                  <th className="py-3.5 px-4">Education</th>
                  <th className="py-3.5 px-4">Household</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-village-border">
                {filteredVillagers.map((v) => {
                  const age = calculateAge(v.dob);
                  return (
                    <tr key={v.id} className="hover:bg-village-card/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-village-secondary-light text-village-primary-darker font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {getInitials(v.name)}
                          </div>
                          <div>
                            <div className="font-bold text-village-text">{v.name}</div>
                            <div className="font-mono text-[10px] text-village-muted">{v.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-village-text">{v.gender}</div>
                        <div className="text-village-muted">{age} yrs</div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {v.phone || <span className="text-village-muted">-</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-red-50 text-red-600 font-bold border border-red-200">
                          {v.bloodGroup}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-village-text">
                        {v.occupation || '-'}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium truncate">{v.education || '-'}</div>
                      </td>
                      <td className="py-3 px-4">
                        {v.householdId ? (
                          <button
                            onClick={() => handleHouseholdClick(v.householdId)}
                            className="font-bold text-village-primary-dark hover:underline"
                          >
                            {v.householdId}
                          </button>
                        ) : (
                          <span className="text-village-muted italic">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setIdCardModalVillager(v)}
                            className="p-1.5 rounded-lg border border-village-border hover:bg-village-secondary-light text-village-text transition-colors"
                            title="Citizen Card"
                          >
                            <Award className="w-4 h-4 text-village-primary" />
                          </button>
                          
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => openEditVillagerModal(v)}
                                className="p-1.5 rounded-lg hover:bg-village-secondary-light text-village-primary-dark transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete villager ${v.name}?`)) {
                                    deleteVillager(v.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-village-muted hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
