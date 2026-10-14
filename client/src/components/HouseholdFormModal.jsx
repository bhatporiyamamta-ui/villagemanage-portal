import React, { useState, useEffect } from 'react';
import { useVillage } from '../context/VillageContext';
import { Home, X, MapPin, CreditCard, UserCheck } from 'lucide-react';
import { generateHouseholdId } from '../utils/helpers';

export default function HouseholdFormModal() {
  const { 
    householdModalOpen, 
    setHouseholdModalOpen, 
    editingHousehold, 
    households, 
    villagers, 
    addHousehold, 
    updateHousehold 
  } = useVillage();

  const [formData, setFormData] = useState({
    id: '',
    houseNumber: '',
    street: '',
    landmark: '',
    ward: 'Ward 1',
    rationCardNumber: '',
    headOfHouseholdId: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingHousehold) {
      setFormData(editingHousehold);
    } else {
      setFormData({
        id: generateHouseholdId(households),
        houseNumber: '',
        street: '',
        landmark: '',
        ward: 'Ward 1',
        rationCardNumber: '',
        headOfHouseholdId: '',
        notes: ''
      });
    }
    setErrors({});
  }, [editingHousehold, householdModalOpen]);

  if (!householdModalOpen) return null;

  // Potential heads (villagers belonging to this household, or all villagers if new)
  const householdVillagers = editingHousehold
    ? villagers.filter((v) => v.householdId === editingHousehold.id)
    : villagers;

  const validate = () => {
    const errs = {};
    if (!formData.id.trim()) errs.id = 'Household ID is required';
    if (!formData.street.trim()) errs.street = 'Street / Faliya name is required';
    if (!formData.houseNumber.trim()) errs.houseNumber = 'House number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingHousehold) {
      updateHousehold(editingHousehold.id, formData);
    } else {
      addHousehold(formData);
    }
    setHouseholdModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-village-text/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-village-border shadow-elevated p-6 space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-village-border pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-village-secondary-light text-village-primary-darker flex items-center justify-center border border-village-secondary">
              <Home className="w-5 h-5 text-village-primary" />
            </div>
            <div>
              <h2 className="text-lg font-black text-village-text">
                {editingHousehold ? `Edit Household (${editingHousehold.id})` : 'Register Household Entity'}
              </h2>
              <p className="text-xs text-village-muted">
                Residential address & ration identifier for family grouping
              </p>
            </div>
          </div>
          <button
            onClick={() => setHouseholdModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-village-card text-village-muted hover:text-village-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          {/* Household ID */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-village-text mb-1">
                Household ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                disabled={!!editingHousehold}
                placeholder="e.g., HH-008"
                className={`w-full px-3 py-2 rounded-xl border ${
                  errors.id ? 'border-red-500' : 'border-village-border'
                } bg-village-card/40 focus:bg-white text-xs font-mono font-bold`}
              />
              {errors.id && <p className="text-red-500 text-[10px] mt-1">{errors.id}</p>}
            </div>

            <div>
              <label className="block font-bold text-village-text mb-1">
                Ward / Sector
              </label>
              <select
                value={formData.ward}
                onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-village-border bg-white text-xs font-medium"
              >
                <option value="Ward 1">Ward 1 (Temple / North)</option>
                <option value="Ward 2">Ward 2 (School / East)</option>
                <option value="Ward 3">Ward 3 (Market / Central)</option>
                <option value="Ward 4">Ward 4 (Lake / South)</option>
                <option value="Ward 5">Ward 5 (Farms / West)</option>
              </select>
            </div>
          </div>

          {/* House Number & Street */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-village-text mb-1">
                House # <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.houseNumber}
                onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                placeholder="e.g., 12B"
                className={`w-full px-3 py-2 rounded-xl border ${
                  errors.houseNumber ? 'border-red-500' : 'border-village-border'
                } bg-white text-xs`}
              />
              {errors.houseNumber && <p className="text-red-500 text-[10px] mt-1">{errors.houseNumber}</p>}
            </div>

            <div className="col-span-2">
              <label className="block font-bold text-village-text mb-1">
                Street / Mohalla / Faliya <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="e.g., Mandir Chowk, Kisan Marg"
                className={`w-full px-3 py-2 rounded-xl border ${
                  errors.street ? 'border-red-500' : 'border-village-border'
                } bg-white text-xs`}
              />
              {errors.street && <p className="text-red-500 text-[10px] mt-1">{errors.street}</p>}
            </div>
          </div>

          {/* Landmark */}
          <div>
            <label className="block font-bold text-village-text mb-1">
              Prominent Landmark
            </label>
            <input
              type="text"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              placeholder="e.g., Near Shiva Temple, Behind Dairy"
              className="w-full px-3 py-2 rounded-xl border border-village-border bg-white text-xs"
            />
          </div>

          {/* Ration Card Number */}
          <div>
            <label className="block font-bold text-village-text mb-1">
              Ration / Family Card Number
            </label>
            <input
              type="text"
              value={formData.rationCardNumber}
              onChange={(e) => setFormData({ ...formData, rationCardNumber: e.target.value })}
              placeholder="e.g., RC-GUJ-90412"
              className="w-full px-3 py-2 rounded-xl border border-village-border bg-white text-xs font-mono"
            />
          </div>

          {/* Head of Household Selection */}
          {householdVillagers.length > 0 && (
            <div>
              <label className="block font-bold text-village-text mb-1">
                Head of Household
              </label>
              <select
                value={formData.headOfHouseholdId}
                onChange={(e) => setFormData({ ...formData, headOfHouseholdId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-village-border bg-white text-xs font-medium"
              >
                <option value="">-- None Selected --</option>
                {householdVillagers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.id} - {v.relationship || 'Member'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block font-bold text-village-text mb-1">
              Household Notes
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g., Agricultural joint family"
              className="w-full px-3 py-2 rounded-xl border border-village-border bg-white text-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-village-border flex items-center justify-between">
            <button
              type="button"
              onClick={() => setHouseholdModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-village-border text-village-text text-xs hover:bg-village-card"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs shadow-soft transition-all"
            >
              {editingHousehold ? 'Save Changes' : 'Register Household'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
