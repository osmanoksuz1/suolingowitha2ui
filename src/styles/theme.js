/**
 * A2UI Theme Configuration
 * Central theme file combining colors, typography, spacing, and shadows
 */

import colors from './colors';
import typography, { textStyles, fontFamilies } from './typography';
import animations from './animations';

// Spacing scale (based on 4px grid) - also with named keys for easier access
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  // Named shortcuts
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  // Colored shadows
  primary: '0 10px 40px -10px rgba(99, 102, 241, 0.5)',
  success: '0 10px 40px -10px rgba(16, 185, 129, 0.5)',
  error: '0 10px 40px -10px rgba(239, 68, 68, 0.5)',
};

// Z-index scale
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
};

// Breakpoints for responsive design
export const breakpoints = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Touch target sizes (Apple HIG minimum 44x44)
export const touchTargets = {
  sm: 36,
  md: 44,
  lg: 56,
  xl: 64,
};

// Complete theme object
const theme = {
  colors,
  typography,
  textStyles,
  fontFamilies,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  breakpoints,
  touchTargets,
  animations,
};

// Helper function to get spacing
export const getSpacing = (value) => {
  if (typeof value === 'number') {
    return spacing[value] ?? value * 4;
  }
  return value;
};

// Helper function for responsive styles
export const createResponsiveStyle = (styles) => {
  // This would be expanded for actual responsive behavior
  return styles.base || styles;
};

export default theme;
