/**
 * A2UI Animation Presets
 * Smooth, performant animations for mobile-first experience
 */

// Timing functions (easing)
export const easings = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

// Durations in milliseconds
export const durations = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
};

// Framer Motion variants for common animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const slideInLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const scaleUp = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const popIn = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
  transition: { 
    type: 'spring',
    stiffness: 500,
    damping: 30,
  },
};

// Card selection animation
export const cardSelect = {
  initial: { scale: 1, borderColor: 'transparent' },
  selected: { 
    scale: 1.02, 
    borderColor: '#6366F1',
    boxShadow: '0 10px 40px rgba(99, 102, 241, 0.3)',
  },
  tap: { scale: 0.98 },
};

// Success/Error feedback animations
export const successPulse = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: [0, 1.2, 1], 
    opacity: [0, 1, 1],
  },
  transition: { 
    duration: 0.5,
    times: [0, 0.6, 1],
    ease: 'easeOut',
  },
};

export const errorShake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
  },
  transition: {
    duration: 0.5,
    ease: 'easeInOut',
  },
};

// Stagger children animation
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

// Loading skeleton animation
export const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 1.5,
    ease: 'linear',
    repeat: Infinity,
  },
};

// Page transitions
export const pageTransition = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { 
    duration: 0.3, 
    ease: 'easeInOut',
  },
};

// Modal overlay
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const modalContent = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 50, scale: 0.95 },
  transition: { 
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
};

export default {
  easings,
  durations,
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInScale,
  slideInLeft,
  slideInRight,
  scaleUp,
  popIn,
  cardSelect,
  successPulse,
  errorShake,
  staggerContainer,
  staggerItem,
  shimmer,
  pageTransition,
  modalOverlay,
  modalContent,
};
