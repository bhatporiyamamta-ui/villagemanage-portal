import React from 'react';
import { useVillage } from '../context/VillageContext';
import { 
  Users, 
  Home, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  UserCheck, 
  Calendar, 
  ArrowUpRight, 
  UserPlus, 
  Sparkles, 
  HeartPulse, 
  Award,
  FileSpreadsheet,
  Search,
  Trophy,
  Medal,
  Crown,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { calculateAge, getInitials, exportVillagersToCsv } from '../utils/helpers';
import Link from './Link';

export default function Dashboard() {
  const { 
    villagers, 
    households, 
    villageMeta, 
    setActiveTab, 
    setFilterValue, 
    openAddVillagerModal, 
    openAddHouseholdModal,
    setDonorModalOpen,
    openEditVillagerModal,
    setIdCardModalVillager,
    isAdmin,
    isViewer,
    showToast
  } = useVillage();

  // Statistical calculations
  const totalVillagers = villagers.length;
  const totalHouseholds = households.length;
  const avgHouseholdSize = totalHouseholds > 0 ? (totalVillagers / totalHouseholds).toFixed(1) : 0;

  // Gender counts
  const maleCount = villagers.filter((v) => v.gender === 'Male').length;
  const femaleCount = villagers.filter((v) => v.gender === 'Female').length;

  // Age demographics
  let childrenCount = 0; // < 18
  let seniorCount = 0; // 60+

  villagers.forEach((v) => {
    const age = calculateAge(v.dob);
    if (typeof age === 'number') {
      if (age < 18) childrenCount++;
      else if (age >= 60) seniorCount++;
    }
  });

  // Literacy calculation
  const educatedVillagers = villagers.filter(
    (v) => v.education && !v.education.toLowerCase().includes('illiterate')
  ).length;
  const literacyRate = totalVillagers > 0 ? Math.round((educatedVillagers / totalVillagers) * 100) : 0;

  // Occupation breakdown
  const occupationCounts = villagers.reduce((acc, v) => {
    const occ = v.occupation || 'Unspecified';
    acc[occ] = (acc[occ] || 0) + 1;
    return acc;
  }, {});

  const sortedOccupations = Object.entries(occupationCounts)
    .sort((a, b) => b[1] - a[1]);

  // Blood group breakdown
  const bloodGroupCounts = villagers.reduce((acc, v) => {
    const bg = v.bloodGroup || 'Unknown';
    acc[bg] = (acc[bg] || 0) + 1;
    return acc;
  }, {});

  const standardBloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];

  // Recent 5 villagers
  const recentVillagers = [...villagers].slice(0, 5);

  // Top Achievers with accolades
  const topAchievers = villagers
    .filter((v) => v.achievements && v.achievements.length > 0)
    .slice(0, 4);

  const handleFilterClick = (filterKey, filterValue, tab = 'villagers') => {
    setFilterValue(filterKey, filterValue);
    setActiveTab(tab);
  };

  const handleDownloadCsv = () => {
    exportVillagersToCsv(villagers, households);
    showToast('Census CSV downloaded successfully!');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-village-primary-dark via-village-primary to-village-secondary p-4 sm:p-6 lg:p-8 text-white shadow-soft">
        <div className="relative z-10 max-w-2xl space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] sm:text-xs font-semibold">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-village-accent" />
            <span>
              {isAdmin ? 'Panchayat Administration Portal' : 'Public Citizen & Transparency Portal'}
            </span>
          </div>
          
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight break-words">
            Welcome to {villageMeta.villageName}
          </h1>
          
          <p className="text-white/90 text-xs sm:text-sm leading-relaxed break-words">
            {isAdmin 
              ? 'Complete administrative authority for citizen registration, household groupings, and census demographic oversight.'
              : 'Public census portal providing open transparency into village demographics, education attainment, and healthcare donor registry.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 sm:gap-2.5">
            {isAdmin ? (
              <>
                <button
                  onClick={() => openAddVillagerModal()}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white text-village-primary-darker hover:bg-village-secondary-light font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-village-primary-dark" />
                  <span>Register Villager</span>
                </button>
                <button
                  onClick={() => openAddHouseholdModal()}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-village-primary-darker/60 hover:bg-village-primary-darker text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Add Household</span>
                </button>
                <Link
                  to="/donors"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-semibold text-xs sm:text-sm border border-red-300/30 transition-all cursor-pointer"
                >
                  <HeartPulse className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Blood Donors</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/villagers"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white text-village-primary-darker hover:bg-village-secondary-light font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-village-primary-dark" />
                  <span>Browse Citizens</span>
                </Link>
                <Link
                  to="/households"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-village-primary-darker/60 hover:bg-village-primary-darker text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Households</span>
                </Link>
                <Link
                  to="/donors"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-semibold text-xs sm:text-sm border border-red-300/30 transition-all cursor-pointer"
                >
                  <HeartPulse className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Blood Donors</span>
                </Link>
                <button
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs sm:text-sm border border-white/30 transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Census CSV</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-village-accent/20 blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid (Fluid 2-col on mobile, 4-col on lg) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Citizens */}
        <Link 
          to="/villagers"
          className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-village-border hover:border-village-primary hover:shadow-soft transition-all duration-200 cursor-pointer group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-village-muted truncate">Citizens</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-village-secondary-light text-village-primary-darker flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-village-text">{totalVillagers}</div>
            <div className="text-[10px] sm:text-xs text-village-muted mt-1 flex flex-wrap items-center gap-1">
              <span className="text-blue-600 font-semibold">{maleCount} M</span>
              <span>•</span>
              <span className="text-rose-500 font-semibold">{femaleCount} F</span>
            </div>
          </div>
        </Link>

        {/* Total Households */}
        <Link 
          to="/households"
          className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-village-border hover:border-village-primary hover:shadow-soft transition-all duration-200 cursor-pointer group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-village-muted truncate">Households</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-amber-200 shrink-0">
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-village-text">{totalHouseholds}</div>
            <div className="text-[10px] sm:text-xs text-village-muted mt-1 truncate">
              Avg {avgHouseholdSize} / home
            </div>
          </div>
        </Link>

        {/* Literacy Rate */}
        <Link 
          to="/demographics"
          className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-village-border hover:border-village-primary hover:shadow-soft transition-all duration-200 cursor-pointer group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-village-muted truncate">Literacy</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-emerald-200 shrink-0">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-village-text">{literacyRate}%</div>
            <div className="text-[10px] sm:text-xs text-village-primary-dark font-medium mt-1 truncate">
              {educatedVillagers} literate
            </div>
          </div>
        </Link>

        {/* Senior & Child Care */}
        <Link 
          to="/villagers?ageGroup=senior"
          className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-village-border hover:border-village-primary hover:shadow-soft transition-all duration-200 cursor-pointer group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-village-muted truncate">Elders 60+</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-purple-200 shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-village-text">{seniorCount}</div>
            <div className="text-[10px] sm:text-xs text-village-muted mt-1 truncate">
              {childrenCount} &lt;18
            </div>
          </div>
        </Link>
      </div>

      {/* Main Charts & Blood Donors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Occupation Breakdown */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-village-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-village-text flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-village-primary" />
                <span>Primary Occupations</span>
              </h2>
              <p className="text-xs text-village-muted mt-0.5">
                Economic activity across {villageMeta.villageName}
              </p>
            </div>
            <Link
              to="/villagers"
              className="text-xs font-bold text-village-primary-dark hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {sortedOccupations.length === 0 ? (
              <div className="py-8 text-center text-xs text-village-muted">
                No villagers registered yet. Occupation metrics will appear here.
              </div>
            ) : (
              sortedOccupations.slice(0, 5).map(([occ, count]) => {
                const percentage = totalVillagers > 0 ? Math.round((count / totalVillagers) * 100) : 0;
                return (
                  <Link 
                    key={occ}
                    to={`/villagers?occupation=${encodeURIComponent(occ)}`}
                    onClick={() => setFilterValue('occupation', occ)}
                    className="group cursor-pointer p-2.5 rounded-xl hover:bg-village-card transition-colors border border-transparent hover:border-village-border block"
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                      <span className="font-semibold text-village-text group-hover:text-village-primary-dark">
                        {occ}
                      </span>
                      <span className="font-mono text-xs font-bold text-village-text">
                        {count} <span className="text-village-muted font-normal">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-village-border/60 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-village-primary to-village-accent h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Blood Group Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-village-border shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-village-text flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Blood Donors</span>
                </h2>
                <p className="text-xs text-village-muted mt-0.5">
                  Emergency blood group availability
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 my-2">
              {standardBloodGroups.map((bg) => {
                const count = bloodGroupCounts[bg] || 0;
                return (
                  <Link
                    key={bg}
                    to={`/villagers?bloodGroup=${encodeURIComponent(bg)}`}
                    onClick={() => setFilterValue('bloodGroup', bg)}
                    className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border border-village-border hover:border-red-400 bg-village-card hover:bg-red-50 text-center transition-all group block cursor-pointer"
                  >
                    <div className="text-[11px] sm:text-xs font-black text-red-600 group-hover:scale-105 transition-transform">
                      {bg}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-village-text mt-0.5">
                      {count}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <Link
            to="/donors"
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Open Emergency Donor Finder</span>
          </Link>
        </div>

      </div>

      {/* Village Pride & Accolades Spotlight */}
      <div className="bg-white p-6 rounded-2xl border border-village-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-village-text flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Village Pride & Hall of Fame</span>
            </h2>
            <p className="text-xs text-village-muted mt-0.5">
              Class toppers, sports champions, and recognized community stars
            </p>
          </div>
          <Link
            to="/hall-of-fame"
            className="text-xs font-bold text-amber-700 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Explore Hall of Fame</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {topAchievers.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-village-card/40 border border-village-border space-y-2">
            <Trophy className="w-8 h-8 text-amber-500 mx-auto opacity-70" />
            <div className="text-xs font-bold text-village-text">No Honors or Achievements Recorded Yet</div>
            <p className="text-[11px] text-village-muted max-w-sm mx-auto">
              Once villagers are registered, you can record class toppers, sports trophies, and community awards.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
            {topAchievers.map((v) => {
              const ach = v.achievements[0];
              return (
                <Link
                  key={v.id}
                  to="/hall-of-fame"
                  className="p-3.5 rounded-xl border border-village-border bg-village-card/40 hover:bg-amber-50/50 hover:border-amber-300 transition-all cursor-pointer group flex flex-col justify-between space-y-3 block"
                >
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-village-primary text-white font-black flex items-center justify-center text-xs flex-shrink-0 shadow-xs border border-white">
                        {getInitials(v.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-village-text truncate group-hover:text-amber-800 transition-colors">
                          {v.name}
                        </div>
                        <div className="text-[10px] text-village-muted truncate">
                          {v.occupation}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-xs font-bold text-village-text line-clamp-2">
                      {ach.title}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {ach.level || 'Honored'}
                    </span>
                    <span className="text-village-muted font-mono">{ach.year}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Recently Registered Villagers */}
      <div className="bg-white p-6 rounded-2xl border border-village-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-village-text flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-village-primary" />
              <span>Recently Registered Villagers</span>
            </h2>
            <p className="text-xs text-village-muted mt-0.5">
              Latest additions to the Gram Panchayat census
            </p>
          </div>
          <Link
            to="/villagers"
            className="text-xs font-bold text-village-primary-dark hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Full Directory</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentVillagers.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-village-card/40 border border-village-border space-y-3">
            <Users className="w-8 h-8 text-village-primary mx-auto opacity-60" />
            <div className="text-xs font-bold text-village-text">No Villagers Registered Yet</div>
            <p className="text-[11px] text-village-muted max-w-sm mx-auto">
              Your database is clean and ready. Click "Register Villager" to add the first citizen.
            </p>
            {isAdmin && (
              <button
                onClick={() => openAddVillagerModal()}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-village-primary text-white font-bold text-xs shadow-soft hover:bg-village-primary-dark transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Register First Villager</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-village-border">
            {recentVillagers.map((v) => {
              const age = calculateAge(v.dob);
              return (
                <div
                  key={v.id}
                  className="py-3 flex items-center justify-between hover:bg-village-card/50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-village-secondary-light text-village-primary-darker font-bold flex items-center justify-center text-xs flex-shrink-0 border border-village-secondary">
                      {getInitials(v.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-village-text truncate">
                          {v.name}
                        </span>
                        <span className="text-[11px] font-mono text-village-muted">
                          {v.id}
                        </span>
                      </div>
                      <div className="text-xs text-village-muted flex items-center space-x-2 mt-0.5 truncate">
                        <span>{v.gender}, {age} yrs</span>
                        <span>•</span>
                        <span className="truncate">{v.occupation}</span>
                        <span>•</span>
                        <span className="text-village-primary-dark font-medium">{v.householdId || 'No Home'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => setIdCardModalVillager(v)}
                      className="px-2.5 py-1.5 rounded-lg border border-village-border hover:bg-village-secondary-light text-village-text text-xs font-medium transition-colors"
                    >
                      Citizen ID
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => openEditVillagerModal(v)}
                        className="px-2.5 py-1.5 rounded-lg bg-village-secondary-light text-village-primary-darker hover:bg-village-secondary text-xs font-bold transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Panch Leadership & Village Map Location */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leadership Council (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-village-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-village-text flex items-center space-x-2">
                <Crown className="w-4 h-4 text-amber-600" />
                <span>Panch Leadership & Executive Committee</span>
              </h2>
              <p className="text-xs text-village-muted mt-0.5">
                Designated community leaders of {villageMeta.villageName}
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-village-secondary-light text-village-primary-darker border border-village-secondary">
              Karobari Samiti
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Pramukh (President)</span>
                <div className="font-extrabold text-sm text-village-text">{villageMeta.pramukh || 'Maheshbhai Bhatporiya'}</div>
              </div>
              <span className="text-xs">👑</span>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">Up-Pramukh (Vice-President)</span>
                <div className="font-extrabold text-sm text-village-text">{villageMeta.upPramukh || 'Dineshbhai Bhandari'}</div>
              </div>
              <span className="text-xs">🎖️</span>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800">Mantri (Secretary)</span>
                <div className="font-extrabold text-sm text-village-text">{villageMeta.mantri || 'Vithalbhai Bhandari'}</div>
              </div>
              <span className="text-xs">📝</span>
            </div>

            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800">Treasurers (Tresars / Khajanchi)</span>
                <div className="font-extrabold text-xs sm:text-sm text-village-text space-y-0.5 mt-1">
                  <div>1. Hiteshbhai K Bhandari</div>
                  <div>2. Hiteshbhai C Bhandari</div>
                  <div>3. Dharmeshbhai k Bhandari</div>
                </div>
              </div>
              <span className="text-xs">💰</span>
            </div>
          </div>
        </div>

        {/* Village Geography & Google Maps (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-village-border shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-village-primary-dark">
              <MapPin className="w-4 h-4" />
              <h3 className="font-bold text-base text-village-text">Village Geography & Map</h3>
            </div>
            <p className="text-xs text-village-muted mt-1 leading-relaxed">
              Located in Choryasi Taluka, Surat District, Gujarat (PIN 394510).
            </p>

            <div className="mt-3 p-3 rounded-xl bg-village-card border border-village-border text-xs space-y-1.5 text-village-muted">
              <div><strong>Address:</strong> {villageMeta.address || "5PVX+G44, RJD Integrated Textile Park, Limla, Gujarat 394510"}</div>
              <div><strong>Taluka:</strong> {villageMeta.block}</div>
              <div><strong>District:</strong> {villageMeta.district} (Surat)</div>
              <div><strong>State:</strong> Gujarat • PIN {villageMeta.pincode}</div>
            </div>
          </div>

          <a
            href={villageMeta.mapUrl || "https://www.google.com/maps?q=21.193250,72.747722"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs shadow-soft transition-all duration-150 active:scale-95 cursor-pointer group"
          >
            <MapPin className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-white/80" />
          </a>
        </div>

      </div>

    </div>
  );
}
