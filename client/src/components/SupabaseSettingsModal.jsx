import React, { useState, useEffect } from 'react';
import { useVillage } from '../context/VillageContext';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  testSupabaseConnection, 
  isSupabaseConfigured,
  syncAllToSupabase 
} from '../services/supabaseClient';
import { 
  Database, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  UploadCloud, 
  ShieldCheck, 
  Key, 
  Globe 
} from 'lucide-react';

export default function SupabaseSettingsModal({ isOpen, onClose }) {
  const { villagers, households, villageMeta, showToast, refreshFromCloud } = useVillage();

  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState('connect'); // 'connect' | 'schema'

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setUrl(cfg.url || '');
      setAnonKey(cfg.anonKey || '');
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConnected = isSupabaseConfigured();

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(url, anonKey);
    setTestResult(res);
    setTesting(false);
  };

  const handleSave = async () => {
    if (!url.trim() || !anonKey.trim()) {
      showToast('Please enter both Supabase URL and Anon Key.', 'error');
      return;
    }

    setTesting(true);
    const res = await testSupabaseConnection(url, anonKey);
    setTesting(false);
    setTestResult(res);

    if (res.success) {
      saveSupabaseConfig(url, anonKey);
      showToast('Supabase connected successfully! Real-time cloud sync active.', 'success');
      if (refreshFromCloud) refreshFromCloud();
      onClose();
    } else {
      // If user still wants to save despite schema warning
      if (res.needsSchema) {
        saveSupabaseConfig(url, anonKey);
        showToast('Credentials saved! Please run the SQL schema in Supabase.', 'info');
        setActiveTab('schema');
      } else {
        showToast(res.message || 'Failed to connect to Supabase', 'error');
      }
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Disconnect Supabase and switch back to local file storage mode?')) {
      saveSupabaseConfig('', '');
      setUrl('');
      setAnonKey('');
      setTestResult(null);
      showToast('Switched back to local storage mode.', 'info');
      onClose();
    }
  };

  const handlePushData = async () => {
    setSyncing(true);
    try {
      await syncAllToSupabase(villagers, households, villageMeta);
      showToast(`Uploaded ${villagers.length} villagers & ${households.length} households to Supabase!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  const sqlSchemaSnippet = `-- Copy and run in Supabase -> SQL Editor -> New Query -> Run
create table if not exists public.households (
  id text primary key,
  house_number text,
  street text,
  ward text,
  ration_card_number text,
  head_of_household_id text,
  annual_income text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.villagers (
  id text primary key,
  name text not null,
  dob text,
  gender text,
  phone text,
  blood_group text,
  occupation text,
  education text,
  household_id text,
  relationship text,
  health_data jsonb default '{"vaccinations": [], "conditions": ""}'::jsonb,
  ongoing_education jsonb default '{"isEnrolled": false, "course": "", "institution": "", "yearOfStudy": ""}'::jsonb,
  achievements jsonb default '[]'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.village_meta (
  id text primary key default 'default',
  village_name text not null default 'Ichhapore-Bhatha Bhandari Panch',
  block text default 'Choryasi',
  district text default 'Surat',
  state text default 'Gujarat',
  pincode text default '394510',
  address text,
  pramukh text,
  up_pramukh text,
  mantri text,
  treasurer text,
  panchayat_office_phone text,
  email text,
  map_url text,
  updated_at timestamptz default now() not null
);

alter table public.households enable row level security;
alter table public.villagers enable row level security;
alter table public.village_meta enable row level security;

create policy "Allow public read on households" on public.households for select using (true);
create policy "Allow write on households" on public.households for all using (true);

create policy "Allow public read on villagers" on public.villagers for select using (true);
create policy "Allow write on villagers" on public.villagers for all using (true);

create policy "Allow public read on village_meta" on public.village_meta for select using (true);
create policy "Allow write on village_meta" on public.village_meta for all using (true);

alter publication supabase_realtime add table public.villagers, public.households, public.village_meta;`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
    showToast('SQL schema copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-village-text/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-village-border shadow-elevated p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-village-border pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-2xs">
              <Database className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-village-text">
                  Supabase Cloud Database
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  isConnected 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                  {isConnected ? 'Cloud Connected' : 'Local Mode'}
                </span>
              </div>
              <p className="text-xs text-village-muted">
                Save & synchronize all villager, household, and panchayat data in real time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-village-card text-village-muted hover:text-village-text cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Connection vs SQL Schema */}
        <div className="flex items-center space-x-2 border-b border-village-border pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('connect')}
            className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'connect'
                ? 'bg-village-primary text-white shadow-2xs'
                : 'text-village-muted hover:text-village-text bg-village-card'
            }`}
          >
            Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-village-primary text-white shadow-2xs'
                : 'text-village-muted hover:text-village-text bg-village-card'
            }`}
          >
            Database SQL Schema
          </button>
        </div>

        {/* Tab 1: Connection Form */}
        {activeTab === 'connect' && (
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            <div className="p-3.5 rounded-2xl bg-village-card border border-village-border text-xs text-village-muted space-y-1.5">
              <div className="flex items-center justify-between text-village-text font-bold">
                <span>How to get your Supabase keys:</span>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-village-primary hover:underline inline-flex items-center space-x-1"
                >
                  <span>Open Supabase Dashboard</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p>
                1. Sign in to Supabase & select your project.
                <br />
                2. Navigate to <strong>Project Settings → API</strong>.
                <br />
                3. Copy your <strong>Project URL</strong> and <strong>Project API key (anon / public)</strong>.
              </p>
            </div>

            {/* Input: Project URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-village-text flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-village-primary" />
                <span>Supabase Project URL</span>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-project-id.supabase.co"
                className="w-full px-3.5 py-2.5 rounded-xl border border-village-border bg-white text-xs text-village-text focus:outline-none focus:ring-2 focus:ring-village-primary/20 focus:border-village-primary font-mono shadow-2xs"
              />
            </div>

            {/* Input: Anon Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-village-text flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-village-primary" />
                <span>Supabase Anon Public API Key</span>
              </label>
              <textarea
                rows={3}
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2 rounded-xl border border-village-border bg-white text-xs text-village-text focus:outline-none focus:ring-2 focus:ring-village-primary/20 focus:border-village-primary font-mono shadow-2xs resize-none"
              />
            </div>

            {/* Test result feedback banner */}
            {testResult && (
              <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                testResult.success 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                  : testResult.needsSchema 
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-red-50 border-red-300 text-red-900'
              }`}>
                <div className="flex items-center space-x-2 font-bold">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>{testResult.success ? 'Connection Successful' : 'Notice'}</span>
                </div>
                <p className="text-[11px] leading-relaxed pl-6">
                  {testResult.message}
                </p>
                {testResult.needsSchema && (
                  <div className="pl-6 pt-1">
                    <button
                      onClick={() => setActiveTab('schema')}
                      className="text-xs font-bold text-amber-800 underline hover:text-amber-950"
                    >
                      Click here to view and copy the SQL schema →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action to Migrate local data to Supabase */}
            {isConnected && (
              <div className="p-3.5 rounded-2xl bg-village-secondary-light/60 border border-village-secondary flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-village-primary-darker">
                    Sync Current Local Data to Supabase
                  </div>
                  <div className="text-[11px] text-village-muted">
                    Upload {villagers.length} villagers and {households.length} households to the cloud.
                  </div>
                </div>
                <button
                  onClick={handlePushData}
                  disabled={syncing}
                  className="px-3.5 py-2 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{syncing ? 'Uploading...' : 'Sync Now'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: SQL Schema Script View */}
        {activeTab === 'schema' && (
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            <div className="flex items-center justify-between text-xs text-village-muted">
              <span>Run this script in your Supabase SQL Editor:</span>
              <button
                onClick={copySqlToClipboard}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs shadow-2xs cursor-pointer transition-all"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied!' : 'Copy SQL Schema'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-2xl bg-village-text text-white font-mono text-[11px] overflow-x-auto max-h-64 leading-relaxed border border-village-border selection:bg-village-primary">
              {sqlSchemaSnippet}
            </pre>

            <p className="text-[11px] text-village-muted">
              Also saved in the root folder as <code className="font-bold font-mono">supabase_schema.sql</code>.
            </p>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="pt-3 border-t border-village-border flex flex-wrap items-center justify-between gap-2.5">
          <div>
            {isConnected && (
              <button
                onClick={handleDisconnect}
                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
              >
                Disconnect Cloud
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleTest}
              disabled={testing || !url.trim()}
              className="px-4 py-2.5 rounded-xl border border-village-border hover:bg-village-card text-village-text text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={handleSave}
              disabled={testing || !url.trim()}
              className="px-4.5 py-2.5 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white text-xs font-bold shadow-soft transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              Save & Connect
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
