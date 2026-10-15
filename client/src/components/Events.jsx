import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft,
  X, 
  Award, 
  Heart, 
  CheckCircle2, 
  Info,
  ExternalLink,
  Camera
} from 'lucide-react';
import { STATIC_EVENTS, EVENT_CATEGORIES } from '../data/staticEvents';

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Upcoming' | 'Past'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Filter events based on status, category, and search query
  const filteredEvents = STATIC_EVENTS.filter((evt) => {
    const matchesStatus = 
      statusFilter === 'All' ? true : evt.status === statusFilter;
    const matchesCategory = 
      selectedCategory === 'All' ? true : evt.category === selectedCategory;
    const matchesSearch = 
      !searchQuery.trim() || 
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.gujaratiTitle && evt.gujaratiTitle.includes(searchQuery)) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.organizer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const upcomingCount = STATIC_EVENTS.filter((e) => e.status === 'Upcoming').length;
  const pastCount = STATIC_EVENTS.filter((e) => e.status === 'Past').length;

  const openEventModal = (evt) => {
    setActiveModalEvent(evt);
    setActiveGalleryIndex(0);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-village-primary-dark via-village-primary to-village-secondary p-5 sm:p-7 lg:p-8 text-white shadow-soft">
        <div className="relative z-10 max-w-3xl space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-village-accent" />
            <span>Official Community Celebrations &amp; Gatherings</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Village Events &amp; Festivals (ગ્રામ્ય ઉત્સવો અને આયોજન)
          </h1>

          <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
            Preserving our vibrant village cultural heritage, annual Gram Sabhas, temple Patotsavs, health drives, and youth sports tournaments of Ichhapore-Bhatha Bhandari Panch.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-3 py-1 rounded-xl bg-white/20 backdrop-blur-xs font-bold">
              🗓️ {STATIC_EVENTS.length} Curated Events
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/30 border border-emerald-300/40 text-emerald-100 font-bold">
              ✨ {upcomingCount} Upcoming
            </span>
            <span className="px-3 py-1 rounded-xl bg-amber-500/30 border border-amber-300/40 text-amber-100 font-bold">
              🏆 {pastCount} Past Milestones
            </span>
          </div>
        </div>

        {/* Decorative blur backdrop */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-village-accent/25 blur-3xl pointer-events-none" />
      </div>

      {/* Static Imagery Notice (Clarification for users & admins) */}
      <div className="p-3.5 sm:p-4 rounded-2xl border border-village-border bg-white text-xs text-village-muted flex items-start space-x-3 shadow-2xs">
        <Info className="w-4 h-4 text-village-primary shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-village-text font-bold">Static Community Archive: </strong>
          All event photography, banners, and festival archives in this section are statically curated on the development side for maximum speed, security, and offline reliability.
        </div>
      </div>

      {/* Search, Status Tabs & Category Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-village-border shadow-xs space-y-4">
        
        {/* Row 1: Search + Status Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-village-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title, Gujarati name, venue, organizer..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-village-border bg-village-card/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-village-primary text-xs sm:text-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-village-muted hover:text-village-text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Tabs (All / Upcoming / Past) */}
          <div className="flex items-center bg-village-card p-1 rounded-xl border border-village-border shrink-0 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'All'
                  ? 'bg-village-primary text-white shadow-2xs'
                  : 'text-village-muted hover:text-village-text'
              }`}
            >
              All ({STATIC_EVENTS.length})
            </button>
            <button
              onClick={() => setStatusFilter('Upcoming')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'Upcoming'
                  ? 'bg-village-primary text-white shadow-2xs'
                  : 'text-village-muted hover:text-village-text'
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              onClick={() => setStatusFilter('Past')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'Past'
                  ? 'bg-village-primary text-white shadow-2xs'
                  : 'text-village-muted hover:text-village-text'
              }`}
            >
              Past ({pastCount})
            </button>
          </div>
        </div>

        {/* Row 2: Category Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <span className="text-village-muted font-bold shrink-0 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-village-primary" />
            <span>Category:</span>
          </span>
          {EVENT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl border whitespace-nowrap font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-village-secondary-light border-village-secondary text-village-primary-darker shadow-2xs'
                    : 'bg-white border-village-border text-village-muted hover:text-village-text hover:bg-village-card'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-village-border p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-village-secondary-light flex items-center justify-center text-village-primary-dark">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-village-text">No Events Found</h3>
          <p className="text-xs text-village-muted max-w-sm mx-auto">
            No events match your current filter criteria. Try resetting the category or search query.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setStatusFilter('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-village-primary text-white text-xs font-bold hover:bg-village-primary-dark transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => {
            const isUpcoming = evt.status === 'Upcoming';
            return (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-village-border hover:border-village-primary hover:shadow-soft transition-all duration-200 overflow-hidden flex flex-col group"
              >
                {/* Event Image Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-village-card border-b border-village-border">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/icon.jpeg';
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs ${
                      isUpcoming
                        ? 'bg-emerald-600/90 text-white shadow-xs'
                        : 'bg-zinc-800/80 text-zinc-200'
                    }`}>
                      {evt.badge || evt.status}
                    </span>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-village-text backdrop-blur-xs">
                      {evt.category}
                    </span>
                  </div>

                  {/* Event Title on Image Bottom */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-extrabold text-sm sm:text-base leading-snug drop-shadow-sm">
                      {evt.title}
                    </h3>
                    {evt.gujaratiTitle && (
                      <p className="text-emerald-200 text-xs font-semibold drop-shadow-xs">
                        {evt.gujaratiTitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Event Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                  
                  {/* Meta Items (Date, Time, Venue) */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-village-text font-bold">
                      <Calendar className="w-3.5 h-3.5 text-village-primary shrink-0" />
                      <span>{evt.date}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-village-muted">
                      <Clock className="w-3.5 h-3.5 text-village-primary shrink-0" />
                      <span>{evt.time}</span>
                    </div>

                    <div className="flex items-start space-x-2 text-village-muted">
                      <MapPin className="w-3.5 h-3.5 text-village-primary shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{evt.venue}</span>
                    </div>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-village-muted line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Key Highlights Pill Tags */}
                  {evt.highlights && evt.highlights.length > 0 && (
                    <div className="pt-2 border-t border-village-border/60">
                      <div className="text-[11px] font-bold text-village-text mb-1.5 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Key Program Highlights:</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-village-muted">
                        {evt.highlights.slice(0, 2).map((h, i) => (
                          <div key={i} className="flex items-start space-x-1.5">
                            <span className="text-village-primary font-bold">•</span>
                            <span className="line-clamp-1">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => openEventModal(evt)}
                      className="w-full py-2 px-3 rounded-xl bg-village-card hover:bg-village-secondary-light border border-village-border hover:border-village-secondary text-village-text font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer group-hover:bg-village-primary group-hover:text-white group-hover:border-village-primary"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>View Event &amp; Photo Gallery</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EVENT DETAIL & STATIC GALLERY MODAL */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-village-text/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-village-border shadow-elevated animate-in zoom-in-95 duration-150 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-village-border bg-village-card/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-village-primary-dark">
                  {activeModalEvent.category} • {activeModalEvent.status}
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-village-text leading-tight">
                  {activeModalEvent.title}
                </h2>
                {activeModalEvent.gujaratiTitle && (
                  <p className="text-xs text-village-primary-darker font-bold">
                    {activeModalEvent.gujaratiTitle}
                  </p>
                )}
              </div>
              <button
                onClick={() => setActiveModalEvent(null)}
                className="p-2 rounded-xl text-village-muted hover:text-village-text hover:bg-village-border/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm">
              
              {/* Featured Static Image Display */}
              <div className="relative rounded-2xl overflow-hidden border border-village-border shadow-xs bg-village-card group">
                <img
                  src={
                    activeModalEvent.gallery && activeModalEvent.gallery[activeGalleryIndex]
                      ? activeModalEvent.gallery[activeGalleryIndex].url
                      : activeModalEvent.image
                  }
                  alt={activeModalEvent.title}
                  className="w-full h-64 sm:h-80 object-cover"
                />

                {/* Left/Right controls if gallery has multiple photos */}
                {activeModalEvent.gallery && activeModalEvent.gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveGalleryIndex((prev) =>
                          prev === 0 ? activeModalEvent.gallery.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all shadow-md cursor-pointer"
                      title="Previous Photo"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveGalleryIndex((prev) =>
                          prev === activeModalEvent.gallery.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all shadow-md cursor-pointer"
                      title="Next Photo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-bold backdrop-blur-xs">
                      {activeGalleryIndex + 1} / {activeModalEvent.gallery.length} Photos
                    </div>
                  </>
                )}
                
                {/* Caption Strip */}
                {activeModalEvent.gallery && activeModalEvent.gallery[activeGalleryIndex]?.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 text-white text-xs font-semibold">
                    📸 {activeModalEvent.gallery[activeGalleryIndex].caption}
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails (if multiple) */}
              {activeModalEvent.gallery && activeModalEvent.gallery.length > 1 && (
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {activeModalEvent.gallery.map((g, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveGalleryIndex(idx)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeGalleryIndex === idx
                          ? 'border-village-primary ring-2 ring-village-secondary'
                          : 'border-village-border opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={g.url} alt={g.caption} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Schedule Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-village-card border border-village-border text-xs">
                <div>
                  <span className="text-village-muted font-bold block mb-0.5">Date &amp; Schedule:</span>
                  <div className="font-bold text-village-text flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-village-primary" />
                    <span>{activeModalEvent.date}</span>
                  </div>
                  <div className="text-village-muted flex items-center space-x-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-village-primary" />
                    <span>{activeModalEvent.time}</span>
                  </div>
                </div>

                <div>
                  <span className="text-village-muted font-bold block mb-0.5">Venue &amp; Location:</span>
                  <div className="font-bold text-village-text flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-village-primary" />
                    <span>{activeModalEvent.venue}</span>
                  </div>
                  <div className="text-village-muted mt-0.5">
                    Organizer: {activeModalEvent.organizer}
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-sm text-village-text">About this Gathering</h4>
                <p className="text-village-muted leading-relaxed text-xs sm:text-sm">
                  {activeModalEvent.description}
                </p>
              </div>

              {/* Highlights */}
              {activeModalEvent.highlights && activeModalEvent.highlights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-village-text flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Key Features &amp; Program Details</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeModalEvent.highlights.map((h, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-village-card/60 border border-village-border flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-village-primary shrink-0 mt-0.5" />
                        <span className="text-village-text font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coordinator & Help Contact */}
              {activeModalEvent.coordinator && (
                <div className="p-3 rounded-xl bg-village-secondary-light/40 border border-village-secondary text-xs text-village-primary-darker">
                  <strong>Panchayat Coordination: </strong> {activeModalEvent.coordinator}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-village-border bg-white flex items-center justify-between">
              <span className="text-[11px] text-village-muted">
                Official village announcement &amp; static archive.
              </span>
              <button
                type="button"
                onClick={() => setActiveModalEvent(null)}
                className="px-4 py-2 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white text-xs font-bold transition-all"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
