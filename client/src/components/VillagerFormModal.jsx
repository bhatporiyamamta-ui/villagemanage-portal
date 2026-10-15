import React, { useState, useEffect } from 'react';
import { useVillage } from '../context/VillageContext';
import { 
  X, 
  User, 
  Calendar, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Home, 
  ShieldCheck, 
  PlusCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  Trophy,
  Medal,
  Trash2
} from 'lucide-react';
import { 
  OCCUPATIONS, 
  EDUCATION_LEVELS, 
  BLOOD_GROUPS, 
  GENDERS, 
  RELATIONSHIPS, 
  ACHIEVEMENT_CATEGORIES,
  ACHIEVEMENT_LEVELS
} from '../data/constants';
import { calculateAge, generateVillagerId } from '../utils/helpers';

export default function VillagerFormModal() {
  const { 
    villagerModalOpen, 
    setVillagerModalOpen, 
    editingVillager, 
    prefilledHouseholdId,
    households, 
    villagers,
    addVillager, 
    updateVillager,
    openAddHouseholdModal
  } = useVillage();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    dob: '',
    gender: 'Male',
    phone: '',
    bloodGroup: 'O+',
    education: 'Secondary (High School / 10th)',
    ongoingEducation: {
      isEnrolled: false,
      institution: '',
      gradeOrYear: '',
      status: 'Currently Studying'
    },
    occupation: 'Farmer / Agriculture',
    customOccupation: '',
    householdId: '',
    relationship: 'Member',
    healthData: {
      conditions: 'None',
      vaccinations: ['Covid-19 (Dose 1 & 2)'],
      hasDisability: false,
      emergencyContact: ''
    },
    achievements: []
  });

  const [step, setStep] = useState(1); // 1: Personal, 2: Household, 3: Education & Job
  const [errors, setErrors] = useState({});

  const [showAddAchievement, setShowAddAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    category: 'Academic & Class Topper',
    level: 'School / Village Level',
    year: new Date().getFullYear().toString()
  });

  useEffect(() => {
    if (editingVillager) {
      setFormData({
        ...editingVillager,
        achievements: editingVillager.achievements || [],
        ongoingEducation: editingVillager.ongoingEducation || {
          isEnrolled: false,
          institution: '',
          gradeOrYear: '',
          status: 'Currently Studying'
        },
        healthData: editingVillager.healthData || {
          conditions: 'None',
          vaccinations: ['Covid-19 (Dose 1 & 2)'],
          hasDisability: false,
          emergencyContact: ''
        }
      });
    } else {
      setFormData({
        id: generateVillagerId(villagers),
        name: '',
        dob: '1995-01-01',
        gender: 'Male',
        phone: '',
        bloodGroup: 'O+',
        education: 'Secondary (High School / 10th)',
        achievements: [],
        ongoingEducation: {
          isEnrolled: false,
          institution: '',
          gradeOrYear: '',
          status: 'Currently Studying'
        },
        occupation: 'Farmer / Agriculture',
        customOccupation: '',
        householdId: prefilledHouseholdId || (households[0]?.id || ''),
        relationship: 'Member',
        healthData: {
          conditions: 'None',
          vaccinations: ['Covid-19 (Dose 1 & 2)'],
          hasDisability: false,
          emergencyContact: ''
        }
      });
    }
    setErrors({});
    setStep(1);
    setShowAddAchievement(false);
  }, [editingVillager, prefilledHouseholdId, villagerModalOpen]);

  const handleAddAchievement = () => {
    if (!newAchievement.title.trim()) return;
    const item = {
      id: `ach-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: newAchievement.title.trim(),
      category: newAchievement.category,
      level: newAchievement.level,
      year: newAchievement.year.trim() || new Date().getFullYear().toString(),
      description: ''
    };
    setFormData((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), item]
    }));
    setNewAchievement({
      title: '',
      category: 'Academic & Class Topper',
      level: 'School / Village Level',
      year: new Date().getFullYear().toString()
    });
    setShowAddAchievement(false);
  };

  const handleRemoveAchievement = (achId) => {
    setFormData((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).filter((a) => a.id !== achId)
    }));
  };

  if (!villagerModalOpen) return null;

  const currentAge = calculateAge(formData.dob);

  const validateStep = (currentStep) => {
    const errs = {};
    if (currentStep === 1) {
      if (!formData.name.trim()) errs.name = 'Full name is required';
      if (!formData.dob) errs.dob = 'Date of birth is required';
      if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\s+/g, ''))) {
        errs.phone = 'Please enter a valid 10-digit number';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(1)) {
      setStep(1);
      return;
    }

    const payload = {
      ...formData,
      occupation: formData.occupation === 'Other / Self-Employed' && formData.customOccupation
        ? formData.customOccupation
        : formData.occupation,
      achievements: formData.achievements || []
    };

    if (editingVillager) {
      updateVillager(editingVillager.id, payload);
    } else {
      addVillager(payload);
    }
    setVillagerModalOpen(false);
  };

  const stepLabels = [
    { num: 1, label: 'Personal', icon: User },
    { num: 2, label: 'Household', icon: Home },
    { num: 3, label: 'Education & Job', icon: GraduationCap }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-village-text/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col border border-village-border shadow-elevated animate-in zoom-in-95 duration-150 overflow-hidden">
        
        {/* Header with Title & Close */}
        <div className="p-5 border-b border-village-border bg-village-card/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-village-primary text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-village-text">
                {editingVillager ? `Edit Citizen (${editingVillager.id})` : 'New Villager Registration'}
              </h2>
              <p className="text-xs text-village-muted">
                Step {step} of 3 • {stepLabels[step - 1].label}
              </p>
            </div>
          </div>
          <button
            onClick={() => setVillagerModalOpen(false)}
            className="p-2 rounded-xl text-village-muted hover:text-village-text hover:bg-village-border/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean Step Progress Indicator */}
        <div className="px-5 pt-3 pb-2 border-b border-village-border bg-white flex items-center justify-between">
          {stepLabels.map((s, idx) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => {
                    if (s.num < step || validateStep(step)) {
                      setStep(s.num);
                    }
                  }}
                  className="flex items-center space-x-1.5 focus:outline-none group text-left"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-village-primary text-white shadow-xs'
                        : isCompleted
                        ? 'bg-village-secondary-light text-village-primary-darker font-black'
                        : 'bg-village-card text-village-muted border border-village-border'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:inline ${
                      isCurrent ? 'text-village-text font-bold' : 'text-village-muted'
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
                {idx < stepLabels.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded-full ${
                      step > s.num ? 'bg-village-primary' : 'bg-village-border'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Full Name */}
              <div>
                <label className="block font-bold text-village-text mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Rameshbhai Patel"
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    errors.name ? 'border-red-500' : 'border-village-border'
                  } bg-village-card/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-village-primary text-sm`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* DOB & Age Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-village-text mb-1.5">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      errors.dob ? 'border-red-500' : 'border-village-border'
                    } bg-village-card/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-village-primary text-sm`}
                  />
                  {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                </div>

                <div>
                  <label className="block font-bold text-village-text mb-1.5">
                    Current Age
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-village-card border border-village-border font-bold text-village-text text-sm flex items-center justify-between">
                    <span>{currentAge !== '-' ? `${currentAge} years old` : 'Enter DOB'}</span>
                    {typeof currentAge === 'number' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-village-secondary-light text-village-primary-dark font-semibold">
                        {currentAge < 18 ? 'Child' : currentAge < 60 ? 'Adult' : 'Senior'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Gender Radio Pills */}
              <div>
                <label className="block font-bold text-village-text mb-1.5">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition-all ${
                        formData.gender === g
                          ? 'bg-village-primary text-white border-village-primary shadow-xs'
                          : 'bg-village-card text-village-text border-village-border hover:bg-village-secondary-light'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blood Group Quick Select Buttons */}
              <div>
                <label className="block font-bold text-village-text mb-1.5">
                  Blood Group
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                      className={`py-1.5 rounded-xl font-black text-xs transition-all ${
                        formData.bloodGroup === bg
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-village-card text-village-text border border-village-border hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block font-bold text-village-text mb-1.5">
                  Mobile / Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-village-muted" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                      errors.phone ? 'border-red-500' : 'border-village-border'
                    } bg-village-card/30 focus:bg-white text-sm font-mono`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          )}

          {/* STEP 2: Household & Family */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-village-secondary-light/40 border border-village-secondary text-xs text-village-primary-darker">
                Assign this villager to their household to group family members together.
              </div>

              {/* Household Select */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-village-text">
                    Select Household Entity
                  </label>
                  <button
                    type="button"
                    onClick={() => openAddHouseholdModal()}
                    className="text-xs font-bold text-village-primary-dark hover:underline flex items-center space-x-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Create New</span>
                  </button>
                </div>

                <select
                  value={formData.householdId}
                  onChange={(e) => setFormData({ ...formData, householdId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-village-border bg-white text-sm font-medium"
                >
                  <option value="">-- Unassigned (No Household) --</option>
                  {households.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.id} — #{h.houseNumber}, {h.street} ({h.ward || 'General'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Relationship to Head */}
              {formData.householdId && (
                <div>
                  <label className="block font-bold text-village-text mb-1.5">
                    Family Role / Relationship
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-village-border bg-white text-sm font-medium"
                  >
                    {RELATIONSHIPS.map((rel) => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                  <p className="text-xs text-village-muted mt-1">
                    "Head of Household" designates this person as the primary family head.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Education & Occupation */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Highest Education */}
              <div>
                <label className="block font-bold text-village-text mb-1.5">
                  Highest Education Level
                </label>
                <select
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-village-border bg-white text-sm font-medium"
                >
                  {EDUCATION_LEVELS.map((edu) => (
                    <option key={edu} value={edu}>{edu}</option>
                  ))}
                </select>
              </div>

              {/* Ongoing Education Toggle */}
              <div className="p-4 rounded-2xl border border-village-border bg-village-card/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-village-text text-sm">Currently Studying?</span>
                    <p className="text-xs text-village-muted">Track school or college attendance</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.ongoingEducation?.isEnrolled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ongoingEducation: {
                          ...formData.ongoingEducation,
                          isEnrolled: e.target.checked
                        }
                      })
                    }
                    className="h-5 w-5 rounded text-village-primary focus:ring-village-primary"
                  />
                </div>

                {formData.ongoingEducation?.isEnrolled && (
                  <div className="pt-2 border-t border-village-border space-y-3">
                    <div>
                      <label className="block font-semibold text-xs text-village-text mb-1">
                        School / College Name
                      </label>
                      <input
                        type="text"
                        value={formData.ongoingEducation.institution || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ongoingEducation: {
                              ...formData.ongoingEducation,
                              institution: e.target.value
                            }
                          })
                        }
                        placeholder="e.g., Ichhapore-Bhatha High School"
                        className="w-full px-3 py-2 rounded-xl border border-village-border bg-white text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-xs text-village-text mb-1">
                          Grade / Course
                        </label>
                        <input
                          type="text"
                          value={formData.ongoingEducation.gradeOrYear || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              ongoingEducation: {
                                ...formData.ongoingEducation,
                                gradeOrYear: e.target.value
                              }
                            })
                          }
                          placeholder="e.g., Class 10, B.Sc. 2nd Year"
                          className="w-full px-3 py-2 rounded-xl border border-village-border bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-xs text-village-text mb-1">
                          Status
                        </label>
                        <select
                          value={formData.ongoingEducation.status || 'Currently Studying'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              ongoingEducation: {
                                ...formData.ongoingEducation,
                                status: e.target.value
                              }
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-village-border bg-white text-xs"
                        >
                          <option value="Currently Studying">Currently Studying</option>
                          <option value="Completed">Completed</option>
                          <option value="Dropped Out">Dropped Out</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Occupation */}
              <div>
                <label className="block font-bold text-village-text mb-1.5">
                  Primary Occupation
                </label>
                <select
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-village-border bg-white text-sm font-medium"
                >
                  {OCCUPATIONS.map((occ) => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>

              {formData.occupation === 'Other / Self-Employed' && (
                <div>
                  <label className="block font-bold text-village-text mb-1.5">
                    Specify Custom Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.customOccupation}
                    onChange={(e) => setFormData({ ...formData, customOccupation: e.target.value })}
                    placeholder="e.g., Electrician, Tailor"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-village-border bg-white text-sm"
                  />
                </div>
              )}

              {/* Honors & Achievements Section */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-village-text">
                        Honors & Achievements ({formData.achievements?.length || 0})
                      </h4>
                      <p className="text-[11px] text-village-muted">
                        Class toppers, sports medals, organic farming awards & recognitions
                      </p>
                    </div>
                  </div>

                  {!showAddAchievement && (
                    <button
                      type="button"
                      onClick={() => setShowAddAchievement(true)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 flex items-center space-x-1 shadow-2xs cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Honor</span>
                    </button>
                  )}
                </div>

                {/* List of current achievements */}
                {formData.achievements && formData.achievements.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {formData.achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200/80 shadow-2xs text-xs"
                      >
                        <div className="flex items-start space-x-2.5 min-w-0 pr-2">
                          <Medal className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <div className="font-bold text-village-text truncate">{ach.title}</div>
                            <div className="text-[11px] text-village-muted flex items-center gap-1.5 flex-wrap">
                              <span className="text-amber-700 font-semibold">{ach.category}</span>
                              <span>•</span>
                              <span>{ach.level}</span>
                              {ach.year && (
                                <>
                                  <span>•</span>
                                  <span>{ach.year}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAchievement(ach.id)}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 shrink-0 cursor-pointer"
                          title="Remove honor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline form to add honor */}
                {showAddAchievement && (
                  <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2.5 text-xs animate-in fade-in duration-150">
                    <div className="font-bold text-village-text flex items-center justify-between">
                      <span>New Honor / Accolade</span>
                      <button
                        type="button"
                        onClick={() => setShowAddAchievement(false)}
                        className="text-village-muted hover:text-village-text"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-village-muted mb-0.5">
                        Title / Accomplishment <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Class 10 Board Topper (98.4%) or District Kabaddi Gold"
                        value={newAchievement.title}
                        onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-village-border text-xs focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-village-muted mb-0.5">Category</label>
                        <select
                          value={newAchievement.category}
                          onChange={(e) => setNewAchievement({ ...newAchievement, category: e.target.value })}
                          className="w-full px-2 py-1.5 rounded-lg border border-village-border text-xs bg-white"
                        >
                          {ACHIEVEMENT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-village-muted mb-0.5">Level</label>
                        <select
                          value={newAchievement.level}
                          onChange={(e) => setNewAchievement({ ...newAchievement, level: e.target.value })}
                          className="w-full px-2 py-1.5 rounded-lg border border-village-border text-xs bg-white"
                        >
                          {ACHIEVEMENT_LEVELS.map((l) => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <div className="w-24">
                        <label className="block text-[11px] font-semibold text-village-muted mb-0.5">Year</label>
                        <input
                          type="text"
                          value={newAchievement.year}
                          onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                          placeholder="2025"
                          className="w-full px-2 py-1.5 rounded-lg border border-village-border text-xs bg-white"
                        />
                      </div>
                      <div className="flex-1 flex justify-end space-x-2 items-end pt-3">
                        <button
                          type="button"
                          onClick={() => setShowAddAchievement(false)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-village-muted hover:bg-village-card"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddAchievement}
                          disabled={!newAchievement.title.trim()}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
                        >
                          Add to Profile
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 border-t border-village-border flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-village-border hover:bg-village-card text-village-text text-xs font-bold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setVillagerModalOpen(false)}
                className="px-4 py-2 rounded-xl text-village-muted hover:text-village-text text-xs font-semibold"
              >
                Cancel
              </button>
            )}

            <div className="flex items-center space-x-2">
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-village-primary hover:bg-village-primary-dark text-white font-bold text-xs sm:text-sm shadow-soft transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingVillager ? 'Save Changes' : 'Save & Register'}</span>
              </button>

              {step < 3 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-village-secondary-light hover:bg-village-secondary text-village-primary-darker font-bold text-xs sm:text-sm border border-village-secondary transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
