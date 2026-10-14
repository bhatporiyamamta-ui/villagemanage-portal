import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { initialVillagers, initialHouseholds, initialVillageMeta } from '../data/defaultData';
import { generateVillagerId, generateHouseholdId } from '../utils/helpers';
import { 
  ROUTES, 
  TAB_TO_PATH, 
  pathToTab, 
  tabToPath, 
  getPageTitle, 
  parseQueryParams, 
  buildUrl 
} from '../utils/routes';
import Link from '../components/Link';
import { 
  isSupabaseConfigured,
  fetchVillagersFromSupabase,
  upsertVillagerToSupabase,
  deleteVillagerFromSupabase,
  fetchHouseholdsFromSupabase,
  upsertHouseholdToSupabase,
  deleteHouseholdFromSupabase,
  fetchVillageMetaFromSupabase,
  upsertVillageMetaToSupabase,
  subscribeToSupabaseRealtime
} from '../services/supabaseClient';

const VillageContext = createContext(null);

const STORAGE_KEYS = {
  VILLAGERS: 'villagemanage_villagers_v3',
  HOUSEHOLDS: 'villagemanage_households_v3',
  META: 'villagemanage_meta_v2',
  ROLE: 'villagemanage_role_v1'
};

// Cleanup old legacy sample storage keys from prior versions
try {
  localStorage.removeItem('villagemanage_villagers_v1');
  localStorage.removeItem('villagemanage_villagers_v2');
  localStorage.removeItem('villagemanage_households_v1');
  localStorage.removeItem('villagemanage_households_v2');
} catch (e) {
  // ignore
}

export function VillageProvider({ children }) {
  const [userRole, setUserRole] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return saved === 'admin' ? 'admin' : 'viewer';
    } catch {
      return 'viewer';
    }
  });

  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);

  // Synchronous initialization from localStorage so there is zero flicker on refresh
  const [villagers, setVillagers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VILLAGERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((v) => ({
            ...v,
            achievements: v.achievements || []
          }));
        }
      }
      return initialVillagers;
    } catch (e) {
      console.error('Failed reading villagers from storage', e);
      return initialVillagers;
    }
  });

  const [households, setHouseholds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOUSEHOLDS);
      return saved ? JSON.parse(saved) : initialHouseholds;
    } catch (e) {
      console.error('Failed reading households from storage', e);
      return initialHouseholds;
    }
  });

  const [villageMeta, setVillageMeta] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.META);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          !parsed.villageName || 
          parsed.villageName.includes('Sundarpur') || 
          parsed.villageName.includes('Bhndari') || 
          !parsed.pramukh ||
          parsed.pramukh === 'Rameshbhai Bhandari'
        ) {
          return initialVillageMeta;
        }
        return { ...initialVillageMeta, ...parsed };
      }
      return initialVillageMeta;
    } catch (e) {
      console.error('Failed reading meta from storage', e);
      return initialVillageMeta;
    }
  });

  const [toasts, setToasts] = useState([]);

  // URL route parsing on initial load
  const initialPath = typeof window !== 'undefined' ? window.location.pathname : '/dashboard';
  const initialRouteTab = pathToTab(initialPath);
  const initialParams = typeof window !== 'undefined' ? parseQueryParams(window.location.search) : {};

  const [activeTab, setActiveTabState] = useState(
    initialRouteTab === 'donors' ? 'dashboard' : initialRouteTab
  );
  
  // Search & Filter state initialized from URL parameters if provided
  const [searchQuery, setSearchQuery] = useState(initialParams.search || initialParams.q || '');
  const [filters, setFilters] = useState({
    occupation: initialParams.occupation || '',
    education: initialParams.education || '',
    bloodGroup: initialParams.bloodGroup || '',
    gender: initialParams.gender || '',
    ageGroup: initialParams.ageGroup || '',
    householdId: initialParams.householdId || '',
    achievementCategory: initialParams.category || ''
  });

  // Modal controls
  const [villagerModalOpen, setVillagerModalOpen] = useState(false);
  const [editingVillager, setEditingVillager] = useState(null);
  const [prefilledHouseholdId, setPrefilledHouseholdId] = useState('');

  const [householdModalOpen, setHouseholdModalOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState(null);

  const [idCardModalVillager, setIdCardModalVillagerState] = useState(null);
  const [selectedHouseholdDetail, setSelectedHouseholdDetailState] = useState(null);
  const [donorModalOpen, setDonorModalOpenState] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path === '/donors' || path === '/blood-donors';
    }
    return false;
  });

  // Achievement modal controls
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [selectedAchieverId, setSelectedAchieverId] = useState('');

  // Supabase Cloud Settings Modal
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  // Ref to track latest state for async server sync
  const stateRef = useRef({ villagers, households, villageMeta });
  useEffect(() => {
    stateRef.current = { villagers, households, villageMeta };
  }, [villagers, households, villageMeta]);

  // Real-time server file sync helper (writes to data/db.json on disk)
  const saveToServer = useCallback(async (vList, hList, meta) => {
    try {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          villagers: vList !== undefined ? vList : stateRef.current.villagers,
          households: hList !== undefined ? hList : stateRef.current.households,
          villageMeta: meta !== undefined ? meta : stateRef.current.villageMeta
        })
      });
    } catch (err) {
      // In offline/static environments, localStorage provides resilience
      console.warn('Real-time server sync warning (using localStorage):', err);
    }
  }, []);

  // Synchronous atomic persistence function (writes immediately to localStorage + server file)
  const persistAll = useCallback((vList, hList, meta) => {
    try {
      if (vList !== undefined) {
        localStorage.setItem(STORAGE_KEYS.VILLAGERS, JSON.stringify(vList));
      }
      if (hList !== undefined) {
        localStorage.setItem(STORAGE_KEYS.HOUSEHOLDS, JSON.stringify(hList));
      }
      if (meta !== undefined) {
        localStorage.setItem(STORAGE_KEYS.META, JSON.stringify(meta));
      }
    } catch (e) {
      console.error('LocalStorage persist error:', e);
    }

    saveToServer(vList, hList, meta);
  }, [saveToServer]);

  // On page load/refresh: verify and sync with backend data/db.json file on disk
  useEffect(() => {
    let isMounted = true;
    const syncFromDisk = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            // If disk file has villagers, synchronize
            if (Array.isArray(data.villagers) && data.villagers.length > 0) {
              setVillagers(data.villagers);
              localStorage.setItem(STORAGE_KEYS.VILLAGERS, JSON.stringify(data.villagers));
            } else {
              // If disk file is empty but localStorage has records, sync to disk!
              const localSaved = localStorage.getItem(STORAGE_KEYS.VILLAGERS);
              if (localSaved) {
                const parsed = JSON.parse(localSaved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setVillagers(parsed);
                  saveToServer(parsed, stateRef.current.households, stateRef.current.villageMeta);
                }
              }
            }

            // If disk file has households, synchronize
            if (Array.isArray(data.households) && data.households.length > 0) {
              setHouseholds(data.households);
              localStorage.setItem(STORAGE_KEYS.HOUSEHOLDS, JSON.stringify(data.households));
            } else {
              const localH = localStorage.getItem(STORAGE_KEYS.HOUSEHOLDS);
              if (localH) {
                const parsedH = JSON.parse(localH);
                if (Array.isArray(parsedH) && parsedH.length > 0) {
                  setHouseholds(parsedH);
                  saveToServer(stateRef.current.villagers, parsedH, stateRef.current.villageMeta);
                }
              }
            }

            if (data.villageMeta && data.villageMeta.villageName) {
              setVillageMeta(data.villageMeta);
              localStorage.setItem(STORAGE_KEYS.META, JSON.stringify(data.villageMeta));
            }
          }
        }
      } catch (e) {
        console.log('Operating in local storage mode');
      }
    };

    syncFromDisk();

    return () => {
      isMounted = false;
    };
  }, [saveToServer]);

  // Supabase Cloud real-time data hydration helper
  const refreshFromCloud = useCallback(async () => {
    if (!isSupabaseConfigured()) return false;
    try {
      const [vCloud, hCloud, mCloud] = await Promise.all([
        fetchVillagersFromSupabase(),
        fetchHouseholdsFromSupabase(),
        fetchVillageMetaFromSupabase()
      ]);

      let hasCloudData = false;

      if (Array.isArray(vCloud) && vCloud.length > 0) {
        setVillagers(vCloud);
        localStorage.setItem(STORAGE_KEYS.VILLAGERS, JSON.stringify(vCloud));
        hasCloudData = true;
      }
      if (Array.isArray(hCloud) && hCloud.length > 0) {
        setHouseholds(hCloud);
        localStorage.setItem(STORAGE_KEYS.HOUSEHOLDS, JSON.stringify(hCloud));
        hasCloudData = true;
      }
      if (mCloud && mCloud.villageName) {
        setVillageMeta(mCloud);
        localStorage.setItem(STORAGE_KEYS.META, JSON.stringify(mCloud));
      }

      if (hasCloudData) {
        saveToServer(vCloud, hCloud, mCloud);
      }
      return true;
    } catch (err) {
      console.warn('Supabase cloud fetch warning (falling back to local):', err);
      return false;
    }
  }, [saveToServer]);

  // Initial cloud sync & Realtime WebSocket subscription
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // Fetch initial data from cloud
    refreshFromCloud();

    // Subscribe to live postgres_changes WebSocket updates
    const unsubscribe = subscribeToSupabaseRealtime((table) => {
      console.log(`[Supabase Realtime] Live change detected on table: ${table}`);
      refreshFromCloud();
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [refreshFromCloud]);

  // Cross-tab real-time sync (when multiple tabs/windows are open)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.VILLAGERS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setVillagers(parsed);
        } catch {}
      }
      if (e.key === STORAGE_KEYS.HOUSEHOLDS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setHouseholds(parsed);
        } catch {}
      }
      if (e.key === STORAGE_KEYS.ROLE && e.newValue) {
        setUserRole(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync Role
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, userRole);
    } catch (e) {
      console.error('Could not save role', e);
    }
  }, [userRole]);

  // Fallback safety synchronization
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VILLAGERS, JSON.stringify(villagers));
    } catch (e) {
      console.error('Could not save villagers', e);
    }
  }, [villagers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOUSEHOLDS, JSON.stringify(households));
    } catch (e) {
      console.error('Could not save households', e);
    }
  }, [households]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.META, JSON.stringify(villageMeta));
    } catch (e) {
      console.error('Could not save meta', e);
    }
  }, [villageMeta]);

  // Toast handler
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Role helpers
  const isAdmin = userRole === 'admin';
  const isViewer = userRole === 'viewer';

  const switchToViewer = () => {
    setUserRole('viewer');
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, 'viewer');
    } catch (e) {}
    showToast('Switched to Public Viewer Mode (Read-Only).', 'info');
  };

  const loginAsAdmin = (password) => {
    if (password === '19760606') {
      setUserRole('admin');
      try {
        localStorage.setItem(STORAGE_KEYS.ROLE, 'admin');
      } catch (e) {}
      setAdminLoginModalOpen(false);
      showToast('Administrator access unlocked.', 'success');
      return true;
    } else {
      showToast('Incorrect password. Access denied.', 'error');
      return false;
    }
  };

  // CRUD for Villagers with real-time synchronous persistence
  const addVillager = (villagerData) => {
    if (isViewer) {
      showToast('Action restricted: Viewer mode is read-only.', 'error');
      return null;
    }

    const newId = villagerData.id || generateVillagerId(villagers);
    const newVillager = {
      ...villagerData,
      id: newId,
      achievements: villagerData.achievements || []
    };

    const updatedVillagers = [newVillager, ...villagers];
    setVillagers(updatedVillagers);

    let updatedHouseholds = households;
    if (villagerData.relationship === 'Head of Household' && villagerData.householdId) {
      updatedHouseholds = households.map((h) =>
        h.id === villagerData.householdId ? { ...h, headOfHouseholdId: newId } : h
      );
      setHouseholds(updatedHouseholds);
    }

    // Atomic synchronous save to localStorage + real-time save to server file on disk
    persistAll(updatedVillagers, updatedHouseholds, villageMeta);

    // Real-time Cloud Save (Supabase)
    if (isSupabaseConfigured()) {
      upsertVillagerToSupabase(newVillager).catch((err) =>
        console.error('Supabase addVillager error:', err)
      );
      if (villagerData.relationship === 'Head of Household' && villagerData.householdId) {
        const h = updatedHouseholds.find((item) => item.id === villagerData.householdId);
        if (h) upsertHouseholdToSupabase(h).catch(() => {});
      }
    }

    showToast(`Villager "${newVillager.name}" (${newId}) registered successfully!`);
    return newVillager;
  };

  const updateVillager = (id, updatedData) => {
    if (isViewer) {
      showToast('Action restricted: Viewer mode is read-only.', 'error');
      return;
    }

    const updatedVillagers = villagers.map((v) => (v.id === id ? { ...v, ...updatedData } : v));
    setVillagers(updatedVillagers);

    let updatedHouseholds = households;
    if (updatedData.relationship === 'Head of Household' && updatedData.householdId) {
      updatedHouseholds = households.map((h) =>
        h.id === updatedData.householdId ? { ...h, headOfHouseholdId: id } : h
      );
      setHouseholds(updatedHouseholds);
    }

    persistAll(updatedVillagers, updatedHouseholds, villageMeta);

    // Real-time Cloud Update (Supabase)
    if (isSupabaseConfigured()) {
      const updatedV = updatedVillagers.find((v) => v.id === id);
      if (updatedV) {
        upsertVillagerToSupabase(updatedV).catch((err) =>
          console.error('Supabase updateVillager error:', err)
        );
      }
      if (updatedData.relationship === 'Head of Household' && updatedData.householdId) {
        const h = updatedHouseholds.find((item) => item.id === updatedData.householdId);
        if (h) upsertHouseholdToSupabase(h).catch(() => {});
      }
    }

    showToast(`Villager profile updated successfully!`);
  };

  const deleteVillager = (id) => {
    if (isViewer) {
      showToast('Action restricted: Viewer mode is read-only.', 'error');
      return;
    }

    const villager = villagers.find((v) => v.id === id);
    const updatedVillagers = villagers.filter((v) => v.id !== id);
    setVillagers(updatedVillagers);
    
    const updatedHouseholds = households.map((h) =>
      h.headOfHouseholdId === id ? { ...h, headOfHouseholdId: '' } : h
    );
    setHouseholds(updatedHouseholds);

    persistAll(updatedVillagers, updatedHouseholds, villageMeta);

    // Real-time Cloud Delete (Supabase)
    if (isSupabaseConfigured()) {
      deleteVillagerFromSupabase(id).catch((err) =>
        console.error('Supabase deleteVillager error:', err)
      );
    }

    showToast(`Villager "${villager?.name || id}" removed.`, 'info');
  };

  // Achievement Management with real-time persistence
  const addAchievement = (villagerId, achievementData) => {
    if (isViewer) {
      showToast('Action restricted: Viewer mode is read-only.', 'error');
      return;
    }

    const newAchId = `ACH-${Date.now().toString().slice(-4)}`;
    const newAchievement = {
      ...achievementData,
      id: newAchId
    };

    const updatedVillagers = villagers.map((v) => {
      if (v.id === villagerId) {
        const current = v.achievements || [];
        return { ...v, achievements: [newAchievement, ...current] };
      }
      return v;
    });

    setVillagers(updatedVillagers);
    persistAll(updatedVillagers, households, villageMeta);

    // Real-time Cloud Update (Supabase)
    if (isSupabaseConfigured()) {
      const targetVillager = updatedVillagers.find((v) => v.id === villagerId);
      if (targetVillager) {
        upsertVillagerToSupabase(targetVillager).catch((err) =>
          console.error('Supabase achievement sync error:', err)
        );
      }
    }

    const targetVillager = villagers.find((v) => v.id === villagerId);
    showToast(`Achievement "${newAchievement.title}" awarded to ${targetVillager?.name || villagerId}!`);
  };

  const deleteAchievement = (villagerId, achievementId) => {
    if (isViewer) {
      showToast('Action restricted: Viewer mode is read-only.', 'error');
      return;
    }

    const updatedVillagers = villagers.map((v) => {
      if (v.id === villagerId) {
        const filtered = (v.achievements || []).filter((a) => a.id !== achievementId);
        return { ...v, achievements: filtered };
      }
      return v;
    });

    setVillagers(updatedVillagers);
    persistAll(updatedVillagers, households, villageMeta);

    // Real-time Cloud Update (Supabase)
    if (isSupabaseConfigured()) {
      const targetVillager = updatedVillagers.find((v) => v.id === villagerId);
      if (targetVillager) {
        upsertVillagerToSupabase(targetVillager).catch((err) =>
          console.error('Supabase achievement removal sync error:', err)
        );
      }
    }

    showToast('Achievement removed.', 'info');
  };

  const openAddAchievementModal = (villagerId = '') => {
    if (isViewer) {
      showToast('Adding achievements is restricted to Admin staff.', 'info');
      return;
    }
    setSelectedAchieverId(villagerId || (villagers[0]?.id || ''));
    setAchievementModalOpen(true);
  };

  // CRUD for Households with real-time persistence
  const addHousehold = (householdData) => {
    if (isViewer) {
      showToast('Action restricted: Viewer mode is read-only.', 'error');
      return null;
    }

    const newId = householdData.id || generateHouseholdId(households);
    const newHousehold = {
      ...householdData,
      id: newId
    };
    const updatedHouseholds = [...households, newHousehold];
    setHouseholds(updatedHouseholds);

    persistAll(villagers, updatedHouseholds, villageMeta);

    // Real-time Cloud Save (Supabase)
    if (isSupabaseConfigured()) {
      upsertHouseholdToSupabase(newHousehold).catch((err) =>
        console.error('Supabase addHousehold error:', err)
      );
    }

    showToast(`Household "${newId}" added successfully!`);
    return newHousehold;
  };

  const updateHousehold = (id, updatedData) => {
    if (isViewer) {
      showToast('Action restricted: Viewer mode is read-only.', 'error');
      return;
    }

    const updatedHouseholds = households.map((h) => (h.id === id ? { ...h, ...updatedData } : h));
    setHouseholds(updatedHouseholds);

    persistAll(villagers, updatedHouseholds, villageMeta);

    // Real-time Cloud Update (Supabase)
    if (isSupabaseConfigured()) {
      const updatedH = updatedHouseholds.find((h) => h.id === id);
      if (updatedH) {
        upsertHouseholdToSupabase(updatedH).catch((err) =>
          console.error('Supabase updateHousehold error:', err)
        );
      }
    }

    showToast(`Household details updated!`);
  };

  const deleteHousehold = (id) => {
    if (isViewer) {
      showToast('Action restricted: Viewer mode is read-only.', 'error');
      return;
    }

    const memberCount = villagers.filter((v) => v.householdId === id).length;
    let updatedVillagers = villagers;
    if (memberCount > 0) {
      updatedVillagers = villagers.map((v) => (v.householdId === id ? { ...v, householdId: '', relationship: '' } : v));
      setVillagers(updatedVillagers);
    }
    const updatedHouseholds = households.filter((h) => h.id !== id);
    setHouseholds(updatedHouseholds);

    persistAll(updatedVillagers, updatedHouseholds, villageMeta);

    // Real-time Cloud Delete (Supabase)
    if (isSupabaseConfigured()) {
      deleteHouseholdFromSupabase(id).catch((err) =>
        console.error('Supabase deleteHousehold error:', err)
      );
    }

    showToast(`Household "${id}" deleted (${memberCount} villagers unassigned).`, 'info');
  };

  // Reset / Clear database
  const resetToDefault = () => {
    if (isViewer) {
      showToast('Action restricted: Viewer mode is read-only.', 'error');
      return;
    }
    setVillagers([]);
    setHouseholds([]);
    setVillageMeta(initialVillageMeta);
    persistAll([], [], initialVillageMeta);
    showToast('Database reset to clean state ready for your data!', 'info');
  };

  const clearAllData = () => {
    if (isViewer) {
      showToast('Action restricted: Viewer mode is read-only.', 'error');
      return;
    }
    setVillagers([]);
    setHouseholds([]);
    persistAll([], [], villageMeta);
    showToast('All villagers and households cleared successfully!', 'info');
  };

  // Import JSON backup
  const importJsonData = (data) => {
    if (isViewer) {
      showToast('Action restricted: Viewer mode is read-only.', 'error');
      return;
    }
    try {
      let newVillagers = villagers;
      let newHouseholds = households;
      let newMeta = villageMeta;
      if (data.villagers && Array.isArray(data.villagers)) {
        newVillagers = data.villagers;
        setVillagers(newVillagers);
      }
      if (data.households && Array.isArray(data.households)) {
        newHouseholds = data.households;
        setHouseholds(newHouseholds);
      }
      if (data.villageMeta) {
        newMeta = data.villageMeta;
        setVillageMeta(newMeta);
      }
      persistAll(newVillagers, newHouseholds, newMeta);
      showToast('Database imported successfully!', 'success');
    } catch {
      showToast('Invalid JSON backup file.', 'error');
    }
  };

  // Helpers to open modals with context
  const openAddVillagerModal = (householdId = '') => {
    if (isViewer) {
      showToast('Administrator login required to register citizens.', 'info');
      setAdminLoginModalOpen(true);
      return;
    }
    setEditingVillager(null);
    setPrefilledHouseholdId(householdId);
    setVillagerModalOpen(true);
  };

  const openEditVillagerModal = (villager) => {
    if (isViewer) {
      showToast('Administrator login required to edit citizen records.', 'info');
      setAdminLoginModalOpen(true);
      return;
    }
    setEditingVillager(villager);
    setPrefilledHouseholdId(villager.householdId || '');
    setVillagerModalOpen(true);
  };

  const openAddHouseholdModal = () => {
    if (isViewer) {
      showToast('Administrator login required to add households.', 'info');
      setAdminLoginModalOpen(true);
      return;
    }
    setEditingHousehold(null);
    setHouseholdModalOpen(true);
  };

  const openEditHouseholdModal = (household) => {
    if (isViewer) {
      showToast('Administrator login required to edit households.', 'info');
      setAdminLoginModalOpen(true);
      return;
    }
    setEditingHousehold(household);
    setHouseholdModalOpen(true);
  };

  const setFilterValue = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setFilters({
      occupation: '',
      education: '',
      bloodGroup: '',
      gender: '',
      ageGroup: '',
      householdId: '',
      achievementCategory: ''
    });
  };

  // Centralized Navigation function
  const navigateTo = useCallback((target, { replace = false } = {}) => {
    if (typeof window === 'undefined') return;

    let targetPath = '';
    let targetTab = '';

    if (typeof target === 'string' && target.startsWith('/')) {
      targetPath = target;
      targetTab = pathToTab(target);
    } else {
      if (target === 'donors') {
        targetPath = '/donors';
        targetTab = 'dashboard';
      } else {
        targetTab = target;
        targetPath = tabToPath(target);
      }
    }

    if (targetTab === 'donors' || targetPath.startsWith('/donors')) {
      setDonorModalOpenState(true);
      setActiveTabState('dashboard');
    } else {
      setDonorModalOpenState(false);
      setActiveTabState(targetTab);
    }

    const title = getPageTitle(targetPath.startsWith('/donors') ? 'donors' : targetTab, villageMeta.villageName);
    document.title = title;

    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== targetPath) {
      if (replace) {
        window.history.replaceState({ path: targetPath, tab: targetTab }, '', targetPath);
      } else {
        window.history.pushState({ path: targetPath, tab: targetTab }, '', targetPath);
      }
    }
  }, [villageMeta.villageName]);

  const setActiveTab = useCallback((tab, options = {}) => {
    navigateTo(tab, options);
  }, [navigateTo]);

  // Modal setters with synchronized clean URLs
  const setDonorModalOpen = useCallback((open) => {
    setDonorModalOpenState(open);
    if (typeof window === 'undefined') return;
    if (open) {
      if (!window.location.pathname.startsWith('/donors')) {
        window.history.pushState({ modal: 'donors' }, '', '/donors');
        document.title = getPageTitle('donors', villageMeta.villageName);
      }
    } else {
      if (window.location.pathname.startsWith('/donors')) {
        const fallback = tabToPath(activeTab);
        window.history.pushState({ tab: activeTab }, '', fallback);
        document.title = getPageTitle(activeTab, villageMeta.villageName);
      }
    }
  }, [activeTab, villageMeta.villageName]);

  const setIdCardModalVillager = useCallback((v) => {
    setIdCardModalVillagerState(v);
    if (typeof window === 'undefined') return;
    if (v && v.id) {
      const url = `/villagers?id=${encodeURIComponent(v.id)}`;
      window.history.replaceState({ id: v.id }, '', url);
    } else if (!v && window.location.pathname === '/villagers' && window.location.search.includes('id=')) {
      window.history.replaceState({}, '', '/villagers');
    }
  }, []);

  const setSelectedHouseholdDetail = useCallback((h) => {
    setSelectedHouseholdDetailState(h);
    if (typeof window === 'undefined') return;
    if (h && h.id) {
      const url = `/households?id=${encodeURIComponent(h.id)}`;
      window.history.replaceState({ householdId: h.id }, '', url);
    } else if (!h && window.location.pathname === '/households' && window.location.search.includes('id=')) {
      window.history.replaceState({}, '', '/households');
    }
  }, []);

  // Normalize initial URL and update document title on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname === '' || window.location.pathname === '/') {
      window.history.replaceState({ path: '/dashboard', tab: 'dashboard' }, '', '/dashboard');
    }
    const currentTab = pathToTab(window.location.pathname);
    document.title = getPageTitle(window.location.pathname.startsWith('/donors') ? 'donors' : currentTab, villageMeta.villageName);
  }, [villageMeta.villageName]);

  // Browser back/forward button (popstate) listener
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      const targetTab = pathToTab(pathname);
      const params = parseQueryParams(window.location.search);

      if (targetTab === 'donors' || pathname.startsWith('/donors')) {
        setDonorModalOpenState(true);
        setActiveTabState('dashboard');
      } else {
        setDonorModalOpenState(false);
        setActiveTabState(targetTab);
      }

      if (params.search || params.q) {
        setSearchQuery(params.search || params.q || '');
      }

      if (params.id) {
        if (targetTab === 'villagers' && villagers.length > 0) {
          const v = villagers.find((item) => item.id.toLowerCase() === params.id.toLowerCase());
          if (v) setIdCardModalVillagerState(v);
        } else if (targetTab === 'households' && households.length > 0) {
          const h = households.find((item) => item.id.toLowerCase() === params.id.toLowerCase());
          if (h) setSelectedHouseholdDetailState(h);
        }
      } else {
        setIdCardModalVillagerState(null);
        setSelectedHouseholdDetailState(null);
      }

      document.title = getPageTitle(pathname.startsWith('/donors') ? 'donors' : targetTab, villageMeta.villageName);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [villagers, households, villageMeta.villageName]);

  // Deep-link query hydration on data load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = parseQueryParams(window.location.search);
    const tab = pathToTab(window.location.pathname);

    if (params.id) {
      if (tab === 'villagers' && villagers.length > 0) {
        const v = villagers.find((item) => item.id.toLowerCase() === params.id.toLowerCase());
        if (v) setIdCardModalVillagerState(v);
      } else if (tab === 'households' && households.length > 0) {
        const h = households.find((item) => item.id.toLowerCase() === params.id.toLowerCase());
        if (h) setSelectedHouseholdDetailState(h);
      }
    }

    if (params.action === 'new') {
      if (tab === 'villagers') setVillagerModalOpen(true);
      else if (tab === 'households') setHouseholdModalOpen(true);
      else if (tab === 'achievements') setAchievementModalOpen(true);
    }
  }, [villagers, households]);

  // Synchronize search & filters to URL when on /villagers tab
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (activeTab !== 'villagers') return;

    const queryParams = {};
    if (searchQuery.trim()) queryParams.search = searchQuery.trim();
    if (filters.occupation) queryParams.occupation = filters.occupation;
    if (filters.education) queryParams.education = filters.education;
    if (filters.bloodGroup) queryParams.bloodGroup = filters.bloodGroup;
    if (filters.gender) queryParams.gender = filters.gender;
    if (filters.ageGroup) queryParams.ageGroup = filters.ageGroup;
    if (filters.householdId) queryParams.householdId = filters.householdId;
    if (idCardModalVillager?.id) queryParams.id = idCardModalVillager.id;

    const newUrl = buildUrl('/villagers', queryParams);
    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== newUrl && !window.location.pathname.startsWith('/donors')) {
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, [activeTab, searchQuery, filters, idCardModalVillager]);

  // Synchronize household detail to URL when on /households tab
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (activeTab !== 'households') return;

    const queryParams = {};
    if (selectedHouseholdDetail?.id) queryParams.id = selectedHouseholdDetail.id;

    const newUrl = buildUrl('/households', queryParams);
    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== newUrl && !window.location.pathname.startsWith('/donors')) {
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, [activeTab, selectedHouseholdDetail]);

  return (
    <VillageContext.Provider
      value={{
        userRole,
        setUserRole,
        isAdmin,
        isViewer,
        switchToViewer,
        loginAsAdmin,
        adminLoginModalOpen,
        setAdminLoginModalOpen,
        villagers,
        households,
        villageMeta,
        setVillageMeta,
        addVillager,
        updateVillager,
        deleteVillager,
        addHousehold,
        updateHousehold,
        deleteHousehold,
        addAchievement,
        deleteAchievement,
        openAddAchievementModal,
        achievementModalOpen,
        setAchievementModalOpen,
        selectedAchieverId,
        setSelectedAchieverId,
        resetToDefault,
        clearAllData,
        importJsonData,
        toasts,
        showToast,
        removeToast,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        filters,
        setFilterValue,
        resetAllFilters,
        // Modal states & openers
        villagerModalOpen,
        setVillagerModalOpen,
        editingVillager,
        prefilledHouseholdId,
        openAddVillagerModal,
        openEditVillagerModal,
        householdModalOpen,
        setHouseholdModalOpen,
        editingHousehold,
        openAddHouseholdModal,
        openEditHouseholdModal,
        idCardModalVillager,
        setIdCardModalVillager,
        selectedHouseholdDetail,
        setSelectedHouseholdDetail,
        donorModalOpen,
        setDonorModalOpen,
        // Supabase Cloud states & controls
        supabaseModalOpen,
        setSupabaseModalOpen,
        isCloudConnected: isSupabaseConfigured(),
        refreshFromCloud,
        // Routing utilities
        navigateTo,
        ROUTES,
        TAB_TO_PATH
      }}
    >
      {children}
    </VillageContext.Provider>
  );
}

export { Link };

export function useVillage() {
  const context = useContext(VillageContext);
  if (!context) {
    throw new Error('useVillage must be used within a VillageProvider');
  }
  return context;
}
