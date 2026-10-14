export function calculateAge(dobString) {
  if (!dobString) return '-';
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return '-';
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return 'V';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function generateVillagerId(villagers = []) {
  const maxNum = villagers.reduce((max, v) => {
    const match = v.id?.match(/VIL-(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      return num > max ? num : max;
    }
    return max;
  }, 0);
  const next = maxNum + 1;
  return `VIL-${String(next).padStart(3, '0')}`;
}

export function generateHouseholdId(households = []) {
  const maxNum = households.reduce((max, h) => {
    const match = h.id?.match(/HH-(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      return num > max ? num : max;
    }
    return max;
  }, 0);
  const next = maxNum + 1;
  return `HH-${String(next).padStart(3, '0')}`;
}

export function downloadJsonFile(data, filename = 'village-data.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportVillagersToCsv(villagers = [], households = []) {
  const householdMap = new Map(households.map(h => [h.id, h]));
  
  const headers = [
    'Villager ID',
    'Name',
    'Date of Birth',
    'Age',
    'Gender',
    'Phone',
    'Blood Group',
    'Education Level',
    'Ongoing Education Enrolled',
    'Institution',
    'Grade / Year',
    'Occupation',
    'Household ID',
    'Household Address',
    'Relationship to Head',
    'Health Conditions',
    'Vaccinations',
    'Disability'
  ];

  const rows = villagers.map(v => {
    const h = householdMap.get(v.householdId);
    const address = h ? `${h.houseNumber}, ${h.street}, ${h.landmark || ''}`.replace(/"/g, '""') : '';
    const age = calculateAge(v.dob);
    const ongoing = v.ongoingEducation || {};
    const health = v.healthData || {};
    const vaccines = (health.vaccinations || []).join('; ');

    return [
      `"${v.id}"`,
      `"${(v.name || '').replace(/"/g, '""')}"`,
      `"${v.dob || ''}"`,
      `"${age}"`,
      `"${v.gender || ''}"`,
      `"${v.phone || ''}"`,
      `"${v.bloodGroup || ''}"`,
      `"${(v.education || '').replace(/"/g, '""')}"`,
      `"${ongoing.isEnrolled ? 'Yes' : 'No'}"`,
      `"${(ongoing.institution || '').replace(/"/g, '""')}"`,
      `"${(ongoing.gradeOrYear || '').replace(/"/g, '""')}"`,
      `"${(v.occupation || '').replace(/"/g, '""')}"`,
      `"${v.householdId || ''}"`,
      `"${address}"`,
      `"${(v.relationship || '').replace(/"/g, '""')}"`,
      `"${(health.conditions || 'None').replace(/"/g, '""')}"`,
      `"${vaccines}"`,
      `"${health.hasDisability ? 'Yes' : 'No'}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `villagers_census_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
