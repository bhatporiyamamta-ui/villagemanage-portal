import { createClient } from '@supabase/supabase-js';

const SUPABASE_STORAGE_KEY = 'villagemanage_supabase_config';

function sanitizeSupabaseUrl(rawUrl) {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  url = url.replace(/\/rest\/v1\/?$/, '');
  url = url.replace(/\/+$/, '');
  return url;
}

/**
 * Retrieve active Supabase credentials from either:
 * 1. Environment variables (.env)
 * 2. In-browser Cloud Settings (localStorage)
 */
export function getSupabaseConfig() {
  const envUrl = sanitizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || '');
  const envKey = (
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    ''
  ).trim();

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey, source: 'env' };
  }

  try {
    const stored = localStorage.getItem(SUPABASE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.url && parsed.anonKey) {
        return { url: sanitizeSupabaseUrl(parsed.url), anonKey: parsed.anonKey.trim(), source: 'local' };
      }
    }
  } catch (e) {
    console.error('Error reading saved Supabase credentials', e);
  }

  return { url: '', anonKey: '', source: 'none' };
}

/**
 * Save browser-configured Supabase credentials
 */
export function saveSupabaseConfig(url, anonKey) {
  if (!url || !anonKey) {
    localStorage.removeItem(SUPABASE_STORAGE_KEY);
    supabaseInstance = null;
    return;
  }
  localStorage.setItem(
    SUPABASE_STORAGE_KEY,
    JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() })
  );
  supabaseInstance = null; // force re-instantiation
}

let supabaseInstance = null;

/**
 * Get or initialize the Supabase client
 */
export function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return null;

  try {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
}

/**
 * Check if valid Supabase connection parameters are present
 */
export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http'));
}

/**
 * Tests connection to the Supabase backend
 */
export async function testSupabaseConnection(overrideUrl, overrideKey) {
  const url = overrideUrl || getSupabaseConfig().url;
  const key = overrideKey || getSupabaseConfig().anonKey;

  if (!url || !key) {
    return { success: false, message: 'URL and Anon API Key are required.' };
  }

  try {
    const tempClient = createClient(url.trim(), key.trim());
    // Query village_meta or check health
    const { data, error } = await tempClient
      .from('village_meta')
      .select('id')
      .limit(1);

    if (error) {
      // If table doesn't exist yet, explain
      if (error.code === '42P01') {
        return {
          success: false,
          needsSchema: true,
          message: 'Connected to Supabase, but the database tables are not created yet. Run supabase_schema.sql in your Supabase SQL Editor.'
        };
      }
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Successfully connected to Supabase cloud database!' };
  } catch (err) {
    return { success: false, message: err.message || 'Connection failed' };
  }
}

/* =========================================================================
   Data Model Adapters (CamelCase JS <---> SnakeCase Database)
   ========================================================================= */

export function mapVillagerToDb(v) {
  return {
    id: v.id,
    name: v.name,
    dob: v.dob || null,
    gender: v.gender || null,
    phone: v.phone || null,
    blood_group: v.bloodGroup || null,
    occupation: v.occupation || null,
    education: v.education || null,
    household_id: v.householdId || null,
    relationship: v.relationship || null,
    health_data: v.healthData || { vaccinations: [], conditions: '' },
    ongoing_education: v.ongoingEducation || { isEnrolled: false, course: '', institution: '', yearOfStudy: '' },
    achievements: v.achievements || [],
    updated_at: new Date().toISOString()
  };
}

export function mapVillagerFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    dob: row.dob || '',
    gender: row.gender || '',
    phone: row.phone || '',
    bloodGroup: row.blood_group || '',
    occupation: row.occupation || '',
    education: row.education || '',
    householdId: row.household_id || '',
    relationship: row.relationship || '',
    healthData: row.health_data || { vaccinations: [], conditions: '' },
    ongoingEducation: row.ongoing_education || { isEnrolled: false, course: '', institution: '', yearOfStudy: '' },
    achievements: row.achievements || []
  };
}

export function mapHouseholdToDb(h) {
  return {
    id: h.id,
    house_number: h.houseNumber || null,
    street: h.street || null,
    ward: h.ward || null,
    ration_card_number: h.rationCardNumber || null,
    head_of_household_id: h.headOfHouseholdId || null,
    annual_income: h.annualIncome || null,
    updated_at: new Date().toISOString()
  };
}

export function mapHouseholdFromDb(row) {
  return {
    id: row.id,
    houseNumber: row.house_number || '',
    street: row.street || '',
    ward: row.ward || '',
    rationCardNumber: row.ration_card_number || '',
    headOfHouseholdId: row.head_of_household_id || '',
    annualIncome: row.annual_income || ''
  };
}

export function mapMetaToDb(m) {
  return {
    id: 'default',
    village_name: m.villageName,
    block: m.block || '',
    district: m.district || '',
    state: m.state || 'Gujarat',
    pincode: m.pincode || '394510',
    address: m.address || '',
    pramukh: m.pramukh || '',
    up_pramukh: m.upPramukh || '',
    mantri: m.mantri || '',
    treasurer: m.treasurer || '',
    panchayat_office_phone: m.panchayatOfficePhone || '',
    email: m.email || '',
    map_url: m.mapUrl || '',
    updated_at: new Date().toISOString()
  };
}

export function mapMetaFromDb(row) {
  return {
    villageName: row.village_name,
    block: row.block || '',
    district: row.district || '',
    state: row.state || 'Gujarat',
    pincode: row.pincode || '394510',
    address: row.address || '',
    pramukh: row.pramukh || '',
    upPramukh: row.up_pramukh || '',
    mantri: row.mantri || '',
    treasurer: row.treasurer || '',
    panchayatOfficePhone: row.panchayat_office_phone || '',
    email: row.email || '',
    mapUrl: row.map_url || ''
  };
}

/* =========================================================================
   Supabase Database Operations
   ========================================================================= */

export async function fetchVillagersFromSupabase() {
  const client = getSupabase();
  if (!client) return null;
  const { data, error } = await client
    .from('villagers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(mapVillagerFromDb);
}

export async function upsertVillagerToSupabase(villager) {
  const client = getSupabase();
  if (!client) return null;
  const record = mapVillagerToDb(villager);
  const { data, error } = await client
    .from('villagers')
    .upsert(record, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;
  return mapVillagerFromDb(data);
}

export async function deleteVillagerFromSupabase(id) {
  const client = getSupabase();
  if (!client) return null;
  const { error } = await client
    .from('villagers')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function fetchHouseholdsFromSupabase() {
  const client = getSupabase();
  if (!client) return null;
  const { data, error } = await client
    .from('households')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data.map(mapHouseholdFromDb);
}

export async function upsertHouseholdToSupabase(household) {
  const client = getSupabase();
  if (!client) return null;
  const record = mapHouseholdToDb(household);
  const { data, error } = await client
    .from('households')
    .upsert(record, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;
  return mapHouseholdFromDb(data);
}

export async function deleteHouseholdFromSupabase(id) {
  const client = getSupabase();
  if (!client) return null;
  const { error } = await client
    .from('households')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function fetchVillageMetaFromSupabase() {
  const client = getSupabase();
  if (!client) return null;
  const { data, error } = await client
    .from('village_meta')
    .select('*')
    .eq('id', 'default')
    .maybeSingle();

  if (error) throw error;
  return data ? mapMetaFromDb(data) : null;
}

export async function upsertVillageMetaToSupabase(meta) {
  const client = getSupabase();
  if (!client) return null;
  const record = mapMetaToDb(meta);
  const { data, error } = await client
    .from('village_meta')
    .upsert(record, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;
  return mapMetaFromDb(data);
}

/**
 * One-click migration: upload local records to Supabase
 */
export async function syncAllToSupabase(villagers, households, villageMeta) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase is not configured.');

  // 1. Households
  if (Array.isArray(households) && households.length > 0) {
    const dbHouseholds = households.map(mapHouseholdToDb);
    const { error: hErr } = await client
      .from('households')
      .upsert(dbHouseholds, { onConflict: 'id' });
    if (hErr) throw new Error(`Failed to upload households: ${hErr.message}`);
  }

  // 2. Villagers
  if (Array.isArray(villagers) && villagers.length > 0) {
    const dbVillagers = villagers.map(mapVillagerToDb);
    const { error: vErr } = await client
      .from('villagers')
      .upsert(dbVillagers, { onConflict: 'id' });
    if (vErr) throw new Error(`Failed to upload villagers: ${vErr.message}`);
  }

  // 3. Meta
  if (villageMeta && villageMeta.villageName) {
    const dbMeta = mapMetaToDb(villageMeta);
    const { error: mErr } = await client
      .from('village_meta')
      .upsert(dbMeta, { onConflict: 'id' });
    if (mErr) throw new Error(`Failed to upload village meta: ${mErr.message}`);
  }

  return { success: true, villagersCount: villagers.length, householdsCount: households.length };
}

/**
 * Subscribe to Supabase Realtime WebSocket changes
 */
export function subscribeToSupabaseRealtime(onSync) {
  const client = getSupabase();
  if (!client) return () => {};

  const channel = client
    .channel('public-db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'villagers' }, () => {
      if (onSync) onSync('villagers');
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'households' }, () => {
      if (onSync) onSync('households');
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'village_meta' }, () => {
      if (onSync) onSync('village_meta');
    })
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}
