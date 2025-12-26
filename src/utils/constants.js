/**
 * Constants and Configuration
 */

// API Configuration
export const API_CONFIG = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  MODEL: 'gemini-2.0-flash-exp', // Gemini 2.0 Flash
  MAX_TOKENS: 2048,
};

// Learning Topics
export const SAMPLE_TOPICS = [
  'İngilizce kelimeler',
  'Matematik formülleri',
  'Tarih olayları',
  'Coğrafya bilgileri',
  'Bilim kavramları',
  'Müzik terminolojisi',
];

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
};

// Points
export const POINTS = {
  CORRECT_CARD: 10,
  CORRECT_IMAGE: 15,
  STREAK_BONUS: 5,
};

// Stage Labels (Turkish)
export const STAGE_LABELS = {
  welcome: 'Başla',
  findWrong: 'Yanlışı Bul',
  explanation: 'Açıkla',
  selectCorrect: 'Doğruyu Seç',
};

// Emoji mappings for image placeholders
export const EMOJI_MAP = {
  // Animals
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  fish: '🐟',
  horse: '🐴',
  elephant: '🐘',
  lion: '🦁',
  rabbit: '🐰',
  
  // Nature
  tree: '🌳',
  flower: '🌸',
  sun: '☀️',
  moon: '🌙',
  star: '⭐',
  mountain: '⛰️',
  ocean: '🌊',
  cloud: '☁️',
  
  // Objects
  car: '🚗',
  house: '🏠',
  book: '📚',
  phone: '📱',
  computer: '💻',
  clock: '🕐',
  key: '🔑',
  ball: '⚽',
  
  // Food
  apple: '🍎',
  banana: '🍌',
  pizza: '🍕',
  cake: '🎂',
  coffee: '☕',
  water: '💧',
  
  // People & Activities
  person: '👤',
  running: '🏃',
  swimming: '🏊',
  reading: '📖',
  writing: '✍️',
  sleeping: '😴',
  thinking: '🤔',
  
  // School
  pencil: '✏️',
  notebook: '📓',
  ruler: '📏',
  backpack: '🎒',
  
  // Default
  default: '🖼️',
};

// Get emoji for a keyword
export const getEmojiForKeyword = (text) => {
  const lowerText = text.toLowerCase();
  
  for (const [keyword, emoji] of Object.entries(EMOJI_MAP)) {
    if (lowerText.includes(keyword)) {
      return emoji;
    }
  }
  
  return EMOJI_MAP.default;
};

// Feedback messages
export const FEEDBACK_MESSAGES = {
  correctCard: [
    'Harika! Doğru kartı buldun! 🎉',
    'Mükemmel! Yanlış eşleştirmeyi yakaladın! 🌟',
    'Bravo! Çok iyi gözlem! 👏',
  ],
  incorrectCard: [
    'Bu kart doğru eşleştirilmiş. Tekrar dene! 🔍',
    'Hayır, bu doğru bir eşleştirme. Dikkatli bak! 👀',
  ],
  correctImage: [
    'Harika! Doğru resmi buldun! 🎯',
    'Mükemmel! Bu resim cümleyle uyuşuyor! ✨',
    'Bravo! Doğru seçim! 🏆',
  ],
  incorrectImage: [
    'Bu doğru resim değil. Tekrar dene! 🔄',
    'Cümleyi tekrar oku ve doğru resmi bul! 📝',
  ],
};

// Get random feedback message
export const getRandomFeedback = (type) => {
  const messages = FEEDBACK_MESSAGES[type];
  return messages[Math.floor(Math.random() * messages.length)];
};
