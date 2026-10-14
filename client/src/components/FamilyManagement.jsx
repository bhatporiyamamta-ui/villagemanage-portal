import React, { useState } from 'react';
import { useVillage } from '../context/VillageContext';
import { 
  Home, 
  Users, 
  MapPin, 
  Plus, 
  Search, 
  UserPlus, 
  Edit3, 
  Trash2, 
  X, 
  Printer, 
  ChevronRight,
  CreditCard
} from 'lucide-react';
import { calculateAge, getInitials } from '../utils/helpers';

export default function FamilyManagement() {
  const { 
    households, 
    villagers, 
    openAddHouseholdModal, 
    openEditHouseholdModal, 
    deleteHousehold,
    openAddVillagerModal,
    openEditVillagerModal,
    selectedHouseholdDetail,
    setSelectedHouseholdDetail,
    setIdCardModalVillager,
    isAdmin,
    isViewer
  } = useVillage();

  const [householdSearch, setHouseholdSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('search') || p.get('q') || '';
    }
    return '';
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const membersByHousehold = villagers.reduce((acc, v) => {
    if (v.householdId) {
      if (!acc[v.householdId]) acc[v.householdId] = [];
      acc[v.householdId].push(v);
    }
    return acc;
  }, {});

  const villagerMap = new Map(villagers.map((v) => [v.id, v]));

  const filteredHouseholds = households.filter((h) => {
    if (!householdSearch.trim()) return true;
    const q = householdSearch.toLowerCase();
    const matchId = h.id?.toLowerCase().includes(q);
    const matchStreet = h.street?.toLowerCase().includes(q);
    const matchWard = h.ward?.toLowerCase().includes(q);
    const matchRation = h.rationCardNumber?.toLowerCase().includes(q);
    
    const head = villagerMap.get(h.headOfHouseholdId);
    const matchHead = head?.name?.toLowerCase().includes(q);

    const members = membersByHousehold[h.id] || [];
    const matchMember = members.some((m) => m.name?.toLowerCase().includes(q));

    return matchId || matchStreet || matchWard || matchRation || matchHead || matchMember;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-village-text tracking-tight">
              {isViewer ? 'Public Household & Family Records' : 'Family & Households'}
            </h1>
            <span className="px-3 py-1 bg-village-secondary-light text-village-primary-darker font-bold rounded-full text-xs border border-village-secondary">
              {households.length} Homes
            </span>
            {isViewer && (
              <span className="px-2.5 py-0.5 bg-village-card text-village-muted font-bold rounded-full text-[10px] border border-village-border">
                Read-Only
              </span>
            )}
          </div>
          <p className="text-sm text-village-muted mt-1">
            {isViewer
              ? 'Public registry of residential homes, family structures, and civic ward allocations.'
              : 'Track residential dwellings, family heads, ration identifiers and member relationships.'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => openAddHouseholdModal()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-sm shadow-soft transition-all duration-200 self-start sm:self-auto active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Add New Household</span>
          </button>
        )}
      </div>

      {/* Household Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-village-border shadow-xs flex items-center space-x-3">
        <Search className="w-4 h-4 text-village-muted" />
        <input
          type="text"
          value={householdSearch}
          onChange={(e) => setHouseholdSearch(e.target.value)}
          placeholder="Search by Household ID, Street, Ward, Head of Family name, or Ration Card..."
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-village-muted"
        />
        {householdSearch && (
          <button
            onClick={() => setHouseholdSearch('')}
            className="text-xs font-bold text-village-muted hover:text-village-text p-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredHouseholds.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-village-border space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-village-card flex items-center justify-center text-village-muted">
            <Home className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-village-text">No Households Registered Yet</h3>
            <p className="text-sm text-village-muted mt-1 max-w-sm mx-auto">
              Create household entities to organize village residents by street address, house number, and family heads.
            </p>
          </div>
          {isAdmin && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => openAddHouseholdModal()}
                className="px-4 py-2.5 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs shadow-soft flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Register First Household</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Households Grid */}
      {filteredHouseholds.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHouseholds.map((h) => {
          const members = membersByHousehold[h.id] || [];
          const head = villagerMap.get(h.headOfHouseholdId) || members.find((m) => m.relationship === 'Head of Household');
          const isSelected = selectedHouseholdDetail?.id === h.id;

          return (
            <div
              key={h.id}
              className={`bg-white rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between hover:shadow-soft ${
                isSelected ? 'border-village-primary ring-2 ring-village-primary/20' : 'border-village-border hover:border-village-primary'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-village-secondary-light text-village-primary-darker font-bold flex items-center justify-center border border-village-secondary">
                      <Home className="w-5 h-5 text-village-primary" />
                    </div>
                    <div>
                      <span className="font-extrabold text-base text-village-text">
                        {h.id}
                      </span>
                      {h.ward && (
                        <div className="text-[11px] font-semibold text-village-muted">
                          {h.ward}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-village-card text-village-primary-darker font-bold text-xs border border-village-border flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{members.length} {members.length === 1 ? 'member' : 'members'}</span>
                  </span>
                </div>

                {/* Head of Family */}
                <div className="mt-4 p-3 rounded-xl bg-village-card/70 border border-village-border">
                  <span className="text-[10px] uppercase font-bold text-village-muted tracking-wider block">
                    Head of Household
                  </span>
                  {head ? (
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-sm text-village-text truncate">
                        {head.name}
                      </span>
                      <span className="text-xs font-mono text-village-primary-dark font-semibold">
                        {head.phone ? `+91 ${head.phone.slice(-5)}` : head.bloodGroup}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-village-muted italic mt-1 block">
                      No head designated
                    </span>
                  )}
                </div>

                {/* Address Details */}
                <div className="mt-3 space-y-1.5 text-xs text-village-text">
                  <div className="flex items-start space-x-2 text-village-muted">
                    <MapPin className="w-3.5 h-3.5 text-village-muted mt-0.5 flex-shrink-0" />
                    <span className="truncate">
                      House #{h.houseNumber}, {h.street}
                      {h.landmark ? ` (${h.landmark})` : ''}
                    </span>
                  </div>

                  {h.rationCardNumber && (
                    <div className="flex items-center space-x-2 text-village-muted">
                      <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="font-mono text-[11px]">Ration: {h.rationCardNumber}</span>
                    </div>
                  )}
                </div>

                {/* Members Avatars */}
                <div className="mt-4 pt-3 border-t border-village-border">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-village-muted uppercase">
                      Family Members:
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => openAddVillagerModal(h.id)}
                        className="text-xs font-bold text-village-primary-dark hover:underline flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Member</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center -space-x-1.5 mt-2 overflow-hidden py-1">
                    {members.slice(0, 5).map((m) => (
                      <div
                        key={m.id}
                        className="w-7 h-7 rounded-full bg-village-secondary border-2 border-white text-village-text font-bold text-[10px] flex items-center justify-center shadow-xs"
                        title={`${m.name} (${m.relationship || 'Member'})`}
                      >
                        {getInitials(m.name)}
                      </div>
                    ))}
                    {members.length > 5 && (
                      <div className="w-7 h-7 rounded-full bg-village-border border-2 border-white text-village-muted font-bold text-[10px] flex items-center justify-center">
                        +{members.length - 5}
                      </div>
                    )}
                    {members.length === 0 && (
                      <span className="text-xs text-village-muted italic">No villagers attached yet.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-village-border flex items-center justify-between">
                <button
                  onClick={() => setSelectedHouseholdDetail(h)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-village-secondary-light hover:bg-village-secondary text-village-primary-darker font-bold text-xs transition-colors"
                >
                  <span>View Family</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {isAdmin && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditHouseholdModal(h)}
                      className="p-1.5 rounded-lg hover:bg-village-secondary-light text-village-primary-dark transition-colors"
                      title="Edit Address"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {deleteConfirmId === h.id ? (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            deleteHousehold(h.id);
                            setDeleteConfirmId(null);
                            if (selectedHouseholdDetail?.id === h.id) {
                              setSelectedHouseholdDetail(null);
                            }
                          }}
                          className="px-2 py-1 rounded bg-red-600 text-white text-[10px] font-bold"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-1 rounded bg-village-card text-[10px] text-village-muted"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(h.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-village-muted hover:text-red-500 transition-colors"
                        title="Delete Household"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          );
        })}
        </div>
      )}

      {/* Household Detail Modal */}
      {selectedHouseholdDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-village-text/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-village-border shadow-elevated p-6 space-y-6 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between border-b border-village-border pb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="font-extrabold text-xl text-village-text">
                    Household: {selectedHouseholdDetail.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-village-secondary-light text-village-primary-darker text-xs font-bold border border-village-secondary">
                    {selectedHouseholdDetail.ward || 'Panchayat Area'}
                  </span>
                </div>
                <p className="text-xs text-village-muted mt-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    House #{selectedHouseholdDetail.houseNumber}, {selectedHouseholdDetail.street}
                    {selectedHouseholdDetail.landmark ? `, Landmark: ${selectedHouseholdDetail.landmark}` : ''}
                  </span>
                </p>
                {selectedHouseholdDetail.rationCardNumber && (
                  <p className="text-xs text-village-muted font-mono mt-0.5">
                    Ration Card: {selectedHouseholdDetail.rationCardNumber}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl border border-village-border hover:bg-village-card text-village-text"
                  title="Print Family Register"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedHouseholdDetail(null)}
                  className="p-2 rounded-xl hover:bg-village-card text-village-muted hover:text-village-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-village-muted flex items-center space-x-2">
                  <Users className="w-4 h-4 text-village-primary" />
                  <span>
                    Family Members ({(membersByHousehold[selectedHouseholdDetail.id] || []).length})
                  </span>
                </h3>

                {isAdmin && (
                  <button
                    onClick={() => openAddVillagerModal(selectedHouseholdDetail.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs shadow-soft transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Add Relative</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-village-border border rounded-2xl border-village-border overflow-hidden">
                {(membersByHousehold[selectedHouseholdDetail.id] || []).length === 0 ? (
                  <div className="p-8 text-center text-xs text-village-muted">
                    No family members registered yet.
                  </div>
                ) : (
                  (membersByHousehold[selectedHouseholdDetail.id] || []).map((m) => {
                    const age = calculateAge(m.dob);
                    const isHead = m.relationship === 'Head of Household';

                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isHead ? 'bg-amber-50/50' : 'bg-white hover:bg-village-card/60'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-village-secondary-light text-village-primary-darker font-bold flex items-center justify-center text-xs flex-shrink-0 border border-village-secondary">
                            {getInitials(m.name)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-village-text">
                                {m.name}
                              </span>
                              {isHead && (
                                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                  Head of Family
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-village-muted flex flex-wrap items-center gap-2 mt-0.5">
                              <span className="font-semibold text-village-primary-darker">
                                {m.relationship || 'Member'}
                              </span>
                              <span>•</span>
                              <span>{m.gender}, {age} yrs</span>
                              <span>•</span>
                              <span className="px-1.5 py-0.2 rounded bg-red-50 text-red-600 font-bold text-[10px]">
                                {m.bloodGroup}
                              </span>
                              <span>•</span>
                              <span>{m.occupation}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end sm:self-auto">
                          <button
                            onClick={() => setIdCardModalVillager(m)}
                            className="px-2.5 py-1.5 rounded-lg border border-village-border hover:bg-village-secondary-light text-village-text text-xs font-medium"
                          >
                            Citizen ID
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => openEditVillagerModal(m)}
                              className="px-2.5 py-1.5 rounded-lg bg-village-secondary-light text-village-primary-darker font-bold text-xs"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-village-border">
              {isAdmin ? (
                <button
                  onClick={() => openEditHouseholdModal(selectedHouseholdDetail)}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-village-border hover:bg-village-card text-village-text text-xs font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5 text-village-primary" />
                  <span>Edit Address</span>
                </button>
              ) : (
                <span className="text-xs text-village-muted">
                  Official Household Roster
                </span>
              )}

              <button
                onClick={() => setSelectedHouseholdDetail(null)}
                className="px-4 py-2 rounded-xl bg-village-primary text-white text-xs font-bold hover:bg-village-primary-dark transition-all"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
