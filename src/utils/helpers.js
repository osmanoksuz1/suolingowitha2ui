/**
 * Helper Functions
 */

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Shuffle array (Fisher-Yates algorithm)
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Pick random items from array
export const pickRandom = (array, count = 1) => {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
};

// Delay utility (for animations)
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Clamp number between min and max
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// Format percentage
export const formatPercentage = (value, decimals = 0) => {
  return `${value.toFixed(decimals)}%`;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Parse JSON safely
export const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('JSON parse error:', e);
    return fallback;
  }
};

// Extract JSON from text (useful for AI responses)
export const extractJsonFromText = (text) => {
  // Try to find JSON array or object in text
  const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  if (jsonMatch) {
    return safeJsonParse(jsonMatch[0]);
  }
  return null;
};

// Debounce function
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Throttle function
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Check if running on mobile
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
};

// Check if touch device
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Vibrate (haptic feedback)
export const vibrate = (pattern = 50) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// Success haptic
export const successHaptic = () => vibrate([50, 50, 100]);

// Error haptic
export const errorHaptic = () => vibrate([100, 50, 100, 50, 100]);

// Storage helpers
export const storage = {
  get: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};
