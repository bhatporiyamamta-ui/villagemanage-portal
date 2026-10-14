import React, { useState, useEffect } from 'react';
import { useVillage } from '../context/VillageContext';
import { Trophy, X, Award, Medal, Check } from 'lucide-react';
import { ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_LEVELS } from '../data/constants';

export default function AchievementModal() {
  const { 
    achievementModalOpen, 
    setAchievementModalOpen, 
    villagers, 
    selectedAchieverId, 
    addAchievement 
  } = useVillage();

  const [villagerId, setVillagerId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic & Class Topper');
  const [level, setLevel] = useState('District Level');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedAchieverId) {
      setVillagerId(selectedAchieverId);
    } else if (villagers.length > 0) {
      setVillagerId(villagers[0].id);
    }
    setTitle('');
    setDescription('');
    setErrors({});
  }, [selectedAchieverId, achievementModalOpen, villagers]);

  if (!achievementModalOpen) return null;

  const validate = () => {
    const errs = {};
    if (!villagerId) errs.villagerId = 'Please select a villager';
    if (!title.trim()) errs.title = 'Achievement title is required (e.g. Class 10 Topper, Sports Gold)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addAchievement(villagerId, {
      title: title.trim(),
      category,
      level,
      year: year.trim() || new Date().getFullYear().toString(),
      description: description.trim()
    });

    setAchievementModalOpen(false);
  };

  const selectedVillager = villagers.find((v) => v.id === villagerId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-village-text/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-village-border shadow-elevated p-6 space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-village-border pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200 shadow-xs">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-village-text">
                Award Village Honor / Achievement
              </h2>
              <p className="text-xs text-village-muted">
                Recognize academic toppers, sports champions, and community stars
              </p>
            </div>
          </div>
          <button
            onClick={() => setAchievementModalOpen(false)}
            className="p-1.5 rounded-xl text-village-muted hover:text-village-text hover:bg-village-card"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          {/* Select Villager */}
          <div>
            <label className="block font-bold text-village-text mb-1">
              Select Villager / Resident <span className="text-red-500">*</span>
            </label>
            {villagers.length === 0 ? (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                No villagers registered yet. Please register a villager first before granting an achievement.
              </div>
            ) : (
              <select
                value={villagerId}
                onChange={(e) => setVillagerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-village-border bg-village-card/40 focus:bg-white text-xs sm:text-sm font-semibold"
              >
                <option value="">-- Select Villager --</option>
                {villagers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.id} • {v.occupation})
                  </option>
                ))}
              </select>
            )}
            {errors.villagerId && <p className="text-red-500 text-[10px] mt-1">{errors.villagerId}</p>}
          </div>

          {/* Achievement Title */}
          <div>
            <label className="block font-bold text-village-text mb-1">
              Achievement / Honor Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Class 10 Board Topper (98%), District Kabbadi Gold"
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.title ? 'border-red-500' : 'border-village-border'
              } bg-white text-xs sm:text-sm`}
            />
            {errors.title && <p className="text-red-500 text-[10px] mt-1">{errors.title}</p>}
          </div>

          {/* Category & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-village-text mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-village-border bg-white text-xs font-medium"
              >
                {ACHIEVEMENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-village-text mb-1">
                Level of Recognition
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-village-border bg-white text-xs font-medium"
              >
                {ACHIEVEMENT_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Year & Description */}
          <div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="col-span-1">
                <label className="block font-bold text-village-text mb-1">
                  Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                  className="w-full px-3 py-2 rounded-xl border border-village-border bg-white text-xs font-mono text-center font-bold"
                />
              </div>
              <div className="col-span-2 flex items-end">
                <div className="p-2 rounded-xl bg-village-card border border-village-border text-[11px] text-village-muted w-full">
                  Will appear in village Hall of Fame
                </div>
              </div>
            </div>

            <label className="block font-bold text-village-text mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Secured highest marks in Math and Science; or Scored winning points in district finals."
              className="w-full px-3 py-2 rounded-xl border border-village-border bg-white text-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-village-border flex items-center justify-between">
            <button
              type="button"
              onClick={() => setAchievementModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-village-border text-village-text text-xs hover:bg-village-card"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs shadow-soft transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Record Achievement</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
