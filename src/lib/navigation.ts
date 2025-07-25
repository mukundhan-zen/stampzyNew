/**
 * This file defines the main navigation links for the application.
 * It is used to generate navigation menus for both desktop and mobile layouts.
 */

/**
 * Represents a single navigation link.
 */
export interface NavLink {
  /**
   * The route path for the link.
   * @type {string}
   */
  path: string;

  /**
   * The text label for the link.
   * @type {string}
   */
  label: string;

  /**
   * The name of the icon to be displayed.
   * This should correspond to an icon in the project's icon set (e.g., lucide-react).
   * @type {string}
   */
  icon: string;

  /**
   * The main section of the application this link belongs to.
   * @type {'Dashboard' | 'Collections' | 'Sales' | 'Settings'}
   */
  section: 'Dashboard' | 'Collections' | 'Sales' | 'Settings';
}

/**
 * An array of the main navigation links for the application.
 */
export const mainNavLinks: NavLink[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    section: 'Dashboard',
  },
  {
    path: '/collections',
    label: 'Collections',
    icon: 'Box',
    section: 'Collections',
  },
  {
    path: '/sales',
    label: 'Sales',
    icon: 'DollarSign',
    section: 'Sales',
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: 'Settings',
    section: 'Settings',
  },
];
