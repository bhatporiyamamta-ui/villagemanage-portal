import React from 'react';
import { useVillage } from '../context/VillageContext';
import { 
  BarChart3, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  BookOpen, 
  PieChart as PieChartIcon,
  Activity,
  ArrowRight
} from 'lucide-react';
import { calculateAge } from '../utils/helpers';
import Link from './Link';

export default function Analytics() {
  const { villagers, households, setFilterValue, setActiveTab } = useVillage();

  const total = villagers.length;

  // Occupations
  const occupationCounts = villagers.reduce((acc, v) => {
    const o = v.occupation || 'Unspecified';
    acc[o] = (acc[o] || 0) + 1;
    return acc;
  }, {});

  const sortedOccupations = Object.entries(occupationCounts).sort((a, b) => b[1] - a[1]);

  // Education
  const educationCounts = villagers.reduce((acc, v) => {
    const e = v.education || 'Unspecified';
    acc[e] = (acc[e] || 0) + 1;
    return acc;
  }, {});

  const sortedEducations = Object.entries(educationCounts).sort((a, b) => b[1] - a[1]);

  // Blood groups
  const bloodCounts = villagers.reduce((acc, v) => {
    const b = v.bloodGroup || 'Unspecified';
    acc[b] = (acc[b] || 0) + 1;
    return acc;
  }, {});

  // Age groups
  let age0_10 = 0;
  let age11_18 = 0;
  let age19_35 = 0;
  let age36_50 = 0;
  let age51_65 = 0;
  let age66_plus = 0;

  villagers.forEach((v) => {
    const age = calculateAge(v.dob);
    if (typeof age === 'number') {
      if (age <= 10) age0_10++;
      else if (age <= 18) age11_18++;
      else if (age <= 35) age19_35++;
      else if (age <= 50) age36_50++;
      else if (age <= 65) age51_65++;
      else age66_plus++;
    }
  });

  const ageGroups = [
    { label: '0-10 Yrs (Early Childhood)', count: age0_10 },
    { label: '11-18 Yrs (School/Adolescents)', count: age11_18 },
    { label: '19-35 Yrs (Youth & Higher Ed)', count: age19_35 },
    { label: '36-50 Yrs (Prime Working Age)', count: age36_50 },
    { label: '51-65 Yrs (Mature Adults)', count: age51_65 },
    { label: '66+ Yrs (Elders & Pensioners)', count: age66_plus }
  ];

  // Gender
  const male = villagers.filter((v) => v.gender === 'Male').length;
  const female = villagers.filter((v) => v.gender === 'Female').length;
  const other = total - male - female;

  // Ongoing education count
  const ongoing = villagers.filter((v) => v.ongoingEducation?.isEnrolled).length;

  const navigateToDirectoryWithFilter = (key, val) => {
    setFilterValue(key, val);
    setActiveTab('villagers');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-village-text tracking-tight flex items-center space-x-2">
          <span>Demographics & Analytics Reports</span>
        </h1>
        <p className="text-xs sm:text-sm text-village-muted mt-1">
          Detailed statistical distribution of education attainment, economic livelihoods, blood donor pool, and age brackets.
        </p>
      </div>

      {/* Top Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-village-border shadow-sm">
          <div className="text-xs font-bold uppercase text-village-muted tracking-wider">Total Population</div>
          <div className="text-3xl font-black text-village-text mt-2">{total}</div>
          <div className="text-xs text-village-muted mt-1">Spread across {households.length} households</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-village-border shadow-sm">
          <div className="text-xs font-bold uppercase text-village-muted tracking-wider">Gender Balance</div>
          <div className="text-3xl font-black text-village-primary-dark mt-2">
            {total > 0 ? ((female / total) * 100).toFixed(0) : 0}% <span className="text-sm font-semibold text-village-muted">Female</span>
          </div>
          <div className="text-xs text-village-muted mt-1">{male} Males • {female} Females</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-village-border shadow-sm">
          <div className="text-xs font-bold uppercase text-village-muted tracking-wider">Active Learners</div>
          <div className="text-3xl font-black text-village-primary mt-2">{ongoing}</div>
          <div className="text-xs text-village-muted mt-1">Currently in school or university</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-village-border shadow-sm">
          <div className="text-xs font-bold uppercase text-village-muted tracking-wider">Senior Citizens</div>
          <div className="text-3xl font-black text-amber-700 mt-2">{age66_plus}</div>
          <div className="text-xs text-village-muted mt-1">Elders 66+ requiring healthcare</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Occupation Breakdown Chart */}
        <div className="bg-white p-6 rounded-2xl border border-village-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-village-border pb-3">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-village-primary" />
              <h2 className="text-base font-bold text-village-text">Occupations & Livelihood</h2>
            </div>
            <span className="text-xs text-village-muted">Click to inspect</span>
          </div>

          <div className="space-y-3">
            {sortedOccupations.map(([occ, count]) => {
              const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
              return (
                <div
                  key={occ}
                  onClick={() => navigateToDirectoryWithFilter('occupation', occ)}
                  className="group cursor-pointer p-2 rounded-xl hover:bg-village-card transition-colors"
                >
                  <div className="flex justify-between text-xs font-semibold text-village-text mb-1">
                    <span className="group-hover:text-village-primary-dark transition-colors">{occ}</span>
                    <span className="font-mono">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-village-border/60 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-village-primary to-village-accent h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(parseFloat(pct), 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education Attainment Chart */}
        <div className="bg-white p-6 rounded-2xl border border-village-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-village-border pb-3">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-village-primary" />
              <h2 className="text-base font-bold text-village-text">Highest Education Levels</h2>
            </div>
            <span className="text-xs text-village-muted">Click to inspect</span>
          </div>

          <div className="space-y-3">
            {sortedEducations.map(([edu, count]) => {
              const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
              return (
                <div
                  key={edu}
                  onClick={() => navigateToDirectoryWithFilter('education', edu)}
                  className="group cursor-pointer p-2 rounded-xl hover:bg-village-card transition-colors"
                >
                  <div className="flex justify-between text-xs font-semibold text-village-text mb-1">
                    <span className="group-hover:text-village-primary-dark transition-colors truncate pr-2">{edu}</span>
                    <span className="font-mono whitespace-nowrap">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-village-border/60 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-village-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(parseFloat(pct), 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Second Row: Age Groups Pyramid & Blood Group Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Age Groups */}
        <div className="bg-white p-6 rounded-2xl border border-village-border shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-village-border pb-3">
            <Users className="w-5 h-5 text-village-primary" />
            <h2 className="text-base font-bold text-village-text">Age Distribution Brackets</h2>
          </div>

          <div className="space-y-3">
            {ageGroups.map((grp) => {
              const pct = total > 0 ? Math.round((grp.count / total) * 100) : 0;
              return (
                <div key={grp.label} className="p-2 rounded-xl bg-village-card border border-village-border">
                  <div className="flex justify-between text-xs font-bold text-village-text mb-1">
                    <span>{grp.label}</span>
                    <span className="font-mono">{grp.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-village-border/60 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-village-secondary-dark h-full rounded-full"
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blood Donors Pool & Health Tracking */}
        <div className="bg-white p-6 rounded-2xl border border-village-border shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-village-border pb-3">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <h2 className="text-base font-bold text-village-text">Blood Group Availability</h2>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-bold border border-red-200">
                Life Saving Network
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 my-4">
              {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map((bg) => {
                const count = bloodCounts[bg] || 0;
                const isRare = bg.includes('-');
                return (
                  <button
                    key={bg}
                    onClick={() => navigateToDirectoryWithFilter('bloodGroup', bg)}
                    className="p-3 rounded-2xl border border-village-border hover:border-red-400 bg-village-card hover:bg-red-50/50 text-center transition-all group"
                  >
                    <div className="text-base font-black text-red-600 group-hover:scale-110 transition-transform">
                      {bg}
                    </div>
                    <div className="text-xs font-bold text-village-text mt-1">
                      {count} <span className="text-[10px] text-village-muted">persons</span>
                    </div>
                    {isRare && (
                      <span className="text-[9px] uppercase font-bold text-amber-600 block mt-1">
                        Rare
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-village-secondary-light/60 border border-village-secondary text-xs text-village-text space-y-1">
              <div className="font-bold text-village-primary-darker flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-village-primary" />
                <span>Panchayat Health Resilience Protocol</span>
              </div>
              <p className="text-village-muted leading-relaxed">
                Emergency blood group listings allow swift mobilization of donors for maternity emergencies, road incidents, or chronic thalassemia care.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/villagers"
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs shadow-soft transition-all cursor-pointer"
            >
              <span>Explore Villagers Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
