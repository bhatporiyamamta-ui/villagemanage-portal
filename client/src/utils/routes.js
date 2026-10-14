/**
 * Clean, readable route definitions and URL mapping helpers
 * for Ichhapore-Bhatha Bhandari Panch application
 */

export const ROUTES = {
  DASHBOARD: '/dashboard',
  VILLAGERS: '/villagers',
  HOUSEHOLDS: '/households',
  ACHIEVEMENTS: '/hall-of-fame',
  ANALYTICS: '/demographics',
  DONORS: '/donors'
};

export const TAB_TO_PATH = {
  dashboard: '/dashboard',
  villagers: '/villagers',
  households: '/households',
  achievements: '/hall-of-fame',
  analytics: '/demographics',
  donors: '/donors'
};

/**
 * Maps any pathname to the corresponding internal tab identifier
 */
export function pathToTab(pathname = '') {
  const clean = pathname.split('?')[0].replace(/\/+$/, '').toLowerCase() || '/';
  
  if (clean === '' || clean === '/' || clean === '/dashboard') {
    return 'dashboard';
  }
  if (clean === '/villagers' || clean === '/citizens' || clean === '/directory') {
    return 'villagers';
  }
  if (clean === '/households' || clean === '/families' || clean === '/homes') {
    return 'households';
  }
  if (clean === '/hall-of-fame' || clean === '/achievements' || clean === '/pride' || clean === '/awards') {
    return 'achievements';
  }
  if (clean === '/demographics' || clean === '/analytics' || clean === '/stats' || clean === '/census') {
    return 'analytics';
  }
  if (clean === '/donors' || clean === '/blood-donors' || clean === '/blood') {
    return 'donors';
  }

  return 'not-found';
}

/**
 * Gets clean URL path from tab identifier
 */
export function tabToPath(tab) {
  return TAB_TO_PATH[tab] || '/dashboard';
}

/**
 * Returns professional document title for the current tab
 */
export function getPageTitle(tab, villageName = 'Ichhapore-Bhatha Bhandari Panch') {
  switch (tab) {
    case 'villagers':
      return `Citizens Directory | ${villageName}`;
    case 'households':
      return `Households Registry | ${villageName}`;
    case 'achievements':
      return `Hall of Fame & Pride | ${villageName}`;
    case 'analytics':
      return `Demographics & Analytics | ${villageName}`;
    case 'donors':
      return `Emergency Blood Donors | ${villageName}`;
    case 'not-found':
      return `404 - Page Not Found | ${villageName}`;
    case 'dashboard':
    default:
      return `Dashboard | ${villageName}`;
  }
}

/**
 * Parse URL search query parameters into a dictionary
 */
export function parseQueryParams(searchStr = '') {
  if (!searchStr) return {};
  const search = searchStr.startsWith('?') ? searchStr.slice(1) : searchStr;
  const params = new URLSearchParams(search);
  const result = {};
  for (const [key, val] of params.entries()) {
    result[key] = val;
  }
  return result;
}

/**
 * Formats a clean path with optional query parameters
 */
export function buildUrl(pathname, queryParams = {}) {
  const url = new URL(pathname, 'http://localhost');
  Object.entries(queryParams).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, v);
    }
  });
  return url.pathname + (url.search ? url.search : '');
}
