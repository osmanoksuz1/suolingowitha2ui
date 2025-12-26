/**
 * Image Service
 * Handles image generation and loading
 */

import { getEmojiForKeyword } from '../utils/constants';

class ImageService {
  constructor() {
    this.cache = new Map();
  }

  // Get image URL for a description
  // In a real app, this would call an image generation API
  async getImageUrl(description) {
    // Check cache
    if (this.cache.has(description)) {
      return this.cache.get(description);
    }

    // For now, we use placeholder images
    // In production, integrate with DALL-E, Stable Diffusion, or stock image API
    const url = this.getPlaceholderUrl(description);
    
    this.cache.set(description, url);
    return url;
  }

  // Generate placeholder URL
  getPlaceholderUrl(description) {
    // Use a placeholder service with the description
    const encodedDesc = encodeURIComponent(description);
    
    // Using Unsplash for random relevant images
    // In production, use proper image search or generation
    const keywords = this.extractKeywords(description);
    
    return `https://source.unsplash.com/400x300/?${keywords}`;
  }

  // Extract keywords from description
  extractKeywords(description) {
    const stopWords = ['a', 'an', 'the', 'is', 'are', 'in', 'on', 'at', 'to', 'for', 'with', 'very'];
    
    return description
      .toLowerCase()
      .split(' ')
      .filter(word => !stopWords.includes(word) && word.length > 2)
      .slice(0, 3)
      .join(',');
  }

  // Preload images for cards
  async preloadImages(items) {
    const promises = items.map(async (item) => {
      if (item.imageUrl) return item;
      
      try {
        const url = await this.getImageUrl(item.imageDescription);
        return { ...item, imageUrl: url };
      } catch {
        return { ...item, imageUrl: null };
      }
    });

    return Promise.all(promises);
  }

  // Get emoji for fallback
  getEmoji(description) {
    return getEmojiForKeyword(description);
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

// Export singleton
export const imageService = new ImageService();
export default imageService;
