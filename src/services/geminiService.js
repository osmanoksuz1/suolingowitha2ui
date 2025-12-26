/**
 * Gemini AI Service
 * Handles all AI-related operations for the learning app
 */

import { API_CONFIG, getEmojiForKeyword } from '../utils/constants';
import { generateId, shuffleArray, extractJsonFromText } from '../utils/helpers';

class GeminiService {
  constructor() {
    this.apiKey = API_CONFIG.GEMINI_API_KEY;
    this.model = API_CONFIG.MODEL;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  // Generate 5 learning cards (4 correct, 1 wrong)
  async generateCards(topic, difficulty = 1, previousCards = []) {
    const prompt = this.buildCardPrompt(topic, difficulty, previousCards);
    
    try {
      const response = await this.callGemini(prompt);
      const cards = this.parseCardsResponse(response);
      return cards;
    } catch (error) {
      console.error('Error generating cards:', error);
      // Return mock data if API fails
      return this.getMockCards(topic);
    }
  }

  // Evaluate user's explanation
  async evaluateExplanation(wrongCard, userExplanation, topic) {
    const prompt = `
Bir öğrenme uygulamasında kullanıcı, yanlış eşleştirilmiş bir kartı buldu.

Kart bilgisi:
- Resim açıklaması: "${wrongCard.imageDescription}"
- Cümle: "${wrongCard.sentence}"
- Çeviri: "${wrongCard.translation}"

Kullanıcının gerekçesi: "${userExplanation}"

Bu gerekçeyi değerlendir ve Türkçe kısa bir geri bildirim ver (1-2 cümle).
- Kullanıcı doğru bir şekilde uyumsuzluğu tespit ettiyse, onu kutla.
- Eğer gerekçe eksik veya yanlışsa, nazikçe doğru açıklamayı yap.

Sadece geri bildirim metnini yaz, başka bir şey ekleme.
`;

    try {
      const response = await this.callGemini(prompt);
      return response.trim();
    } catch (error) {
      console.error('Error evaluating explanation:', error);
      return 'Gerekçen değerlendirildi. Öğrenmeye devam! 📚';
    }
  }

  // Generate 5 images for correct selection (1 correct, 4 distractors)
  async generateCorrectImages(wrongCard, topic) {
    const prompt = `
Bir öğrenme uygulaması için resim seçenekleri oluştur.

Yanlış eşleştirilmiş kart:
- Yanlış resim: "${wrongCard.imageDescription}"
- Cümle: "${wrongCard.sentence}" (${wrongCard.translation})

Bu cümle için DOĞRU resim nedir? Ve 4 tane de çeldirici resim üret.

JSON formatında yanıt ver:
[
  {
    "id": "img_1",
    "imageDescription": "Cümleyle UYUŞAN doğru resim açıklaması",
    "label": "Kısa etiket (1-2 kelime)",
    "isCorrect": true
  },
  {
    "id": "img_2",
    "imageDescription": "Çeldirici resim 1",
    "label": "Kısa etiket",
    "isCorrect": false
  },
  {
    "id": "img_3",
    "imageDescription": "Çeldirici resim 2",
    "label": "Kısa etiket",
    "isCorrect": false
  },
  {
    "id": "img_4",
    "imageDescription": "Çeldirici resim 3",
    "label": "Kısa etiket",
    "isCorrect": false
  },
  {
    "id": "img_5",
    "imageDescription": "Çeldirici resim 4",
    "label": "Kısa etiket",
    "isCorrect": false
  }
]

Sadece JSON döndür, başka açıklama ekleme.
`;

    try {
      const response = await this.callGemini(prompt);
      const images = this.parseImagesResponse(response, wrongCard);
      return shuffleArray(images);
    } catch (error) {
      console.error('Error generating images:', error);
      return this.getMockImages(wrongCard);
    }
  }

  // Build prompt for card generation
  buildCardPrompt(topic, difficulty, previousCards) {
    const difficultyDesc = {
      1: 'kolay (basit kelimeler ve cümleler)',
      2: 'orta (günlük kullanım)',
      3: 'zor (karmaşık yapılar)',
    }[Math.floor(difficulty)] || 'kolay';

    const previousTopics = previousCards
      .map(c => c.sentence)
      .slice(-10)
      .join(', ');

    return `
Sen bir dil öğrenme uygulaması için içerik üreten bir AI'sın.

Konu: "${topic}"
Zorluk: ${difficultyDesc}
${previousTopics ? `Daha önce kullanılan cümleler (tekrar etme): ${previousTopics}` : ''}

5 adet öğrenme kartı oluştur:
- 4 kart: Resim ve cümle DOĞRU eşleştirilmiş
- 1 kart: Resim ve cümle YANLIŞ eşleştirilmiş (resim başka bir şeyi gösteriyor)

Her kart için JSON formatında:
[
  {
    "id": "card_1",
    "imageDescription": "Resmin detaylı açıklaması (İngilizce)",
    "sentence": "İngilizce cümle",
    "translation": "Türkçe çeviri",
    "isCorrect": true
  },
  {
    "id": "card_2",
    "imageDescription": "A red car on the street",
    "sentence": "The tree is very tall.",
    "translation": "Ağaç çok uzun.",
    "isCorrect": false
  },
  {
    "id": "card_3",
    "imageDescription": "...",
    "sentence": "...",
    "translation": "...",
    "isCorrect": true
  },
  {
    "id": "card_4",
    "imageDescription": "...",
    "sentence": "...",
    "translation": "...",
    "isCorrect": true
  },
  {
    "id": "card_5",
    "imageDescription": "...",
    "sentence": "...",
    "translation": "...",
    "isCorrect": true
  }
]

Önemli:
- Yanlış kartta resim açıklaması ile cümle TAMAMEN farklı konularda olmalı
- Doğru kartlarda resim ve cümle mantıksal olarak uyumlu olmalı
- Cümleler ${topic} konusuyla ilgili olmalı
- Sadece JSON döndür, başka açıklama ekleme
- Toplam 5 kart olmalı, sadece 1 tanesi isCorrect: false olmalı
`;
  }

  // Parse cards response from AI
  parseCardsResponse(response) {
    const parsed = extractJsonFromText(response);
    
    if (!Array.isArray(parsed) || parsed.length !== 5) {
      throw new Error('Invalid cards response');
    }

    // Validate and enhance cards
    return parsed.map((card, index) => ({
      id: card.id || `card_${index + 1}`,
      imageDescription: card.imageDescription || 'Image',
      imageUrl: null, // Would be filled by image service
      emoji: getEmojiForKeyword(card.imageDescription),
      sentence: card.sentence || '',
      translation: card.translation || '',
      isCorrect: card.isCorrect !== false, // Default to true
    }));
  }

  // Parse images response from AI
  parseImagesResponse(response, wrongCard) {
    const parsed = extractJsonFromText(response);
    
    if (!Array.isArray(parsed) || parsed.length !== 5) {
      throw new Error('Invalid images response');
    }

    return parsed.map((img, index) => ({
      id: img.id || `img_${index + 1}`,
      imageDescription: img.imageDescription || 'Image',
      imageUrl: null,
      emoji: getEmojiForKeyword(img.imageDescription),
      label: img.label || '',
      isCorrect: img.isCorrect === true,
    }));
  }

  // Call Gemini API
  async callGemini(prompt) {
    // If no API key, return empty to trigger mock data
    if (!this.apiKey) {
      console.warn('No API key configured, using mock data');
      throw new Error('No API key');
    }

    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: API_CONFIG.MAX_TOKENS,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API call failed');
    }

    const data = await response.json();
    
    // Extract text from Gemini response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No text in response');
    }
    
    return text;
  }

  // Mock cards for testing without API
  getMockCards(topic) {
    const mockSets = {
      default: [
        {
          id: 'card_1',
          imageDescription: 'A brown dog running in the park',
          emoji: '🐕',
          sentence: 'The dog is running.',
          translation: 'Köpek koşuyor.',
          isCorrect: true,
        },
        {
          id: 'card_2',
          imageDescription: 'A sleeping cat on a sofa',
          emoji: '🐱',
          sentence: 'The cat is sleeping.',
          translation: 'Kedi uyuyor.',
          isCorrect: true,
        },
        {
          id: 'card_3',
          imageDescription: 'A red car on the street',
          emoji: '🚗',
          sentence: 'The tree is very tall.',
          translation: 'Ağaç çok uzun.',
          isCorrect: false, // WRONG - car image with tree sentence
        },
        {
          id: 'card_4',
          imageDescription: 'A bright sun in blue sky',
          emoji: '☀️',
          sentence: 'The sun is shining.',
          translation: 'Güneş parlıyor.',
          isCorrect: true,
        },
        {
          id: 'card_5',
          imageDescription: 'A person reading a book',
          emoji: '📚',
          sentence: 'I am reading a book.',
          translation: 'Bir kitap okuyorum.',
          isCorrect: true,
        },
      ],
    };

    return shuffleArray(mockSets.default);
  }

  // Mock images for testing
  getMockImages(wrongCard) {
    // The correct image should match the sentence, not the wrong image
    const correctDescription = this.getCorrectImageForSentence(wrongCard.sentence);
    
    return shuffleArray([
      {
        id: 'img_1',
        imageDescription: correctDescription,
        emoji: getEmojiForKeyword(correctDescription),
        label: correctDescription.split(' ').slice(0, 2).join(' '),
        isCorrect: true,
      },
      {
        id: 'img_2',
        imageDescription: 'A small house',
        emoji: '🏠',
        label: 'Ev',
        isCorrect: false,
      },
      {
        id: 'img_3',
        imageDescription: 'A flying bird',
        emoji: '🐦',
        label: 'Kuş',
        isCorrect: false,
      },
      {
        id: 'img_4',
        imageDescription: 'A red apple',
        emoji: '🍎',
        label: 'Elma',
        isCorrect: false,
      },
      {
        id: 'img_5',
        imageDescription: wrongCard.imageDescription,
        emoji: wrongCard.emoji,
        label: 'Yanlış',
        isCorrect: false,
      },
    ]);
  }

  // Determine correct image based on sentence
  getCorrectImageForSentence(sentence) {
    const lowerSentence = sentence.toLowerCase();
    
    if (lowerSentence.includes('tree')) return 'A tall green tree';
    if (lowerSentence.includes('dog')) return 'A happy dog';
    if (lowerSentence.includes('cat')) return 'A cute cat';
    if (lowerSentence.includes('sun')) return 'A bright sun';
    if (lowerSentence.includes('book')) return 'An open book';
    if (lowerSentence.includes('car')) return 'A red car';
    
    return 'A matching image';
  }

  // Generate 5 descriptions for an image (1 correct, 4 wrong)
  async generateDescriptions(card, topic) {
    const prompt = `
Bir dil öğrenme uygulaması için açıklama seçenekleri oluştur.

Görsel: "${card.imageDescription}"

Bu görsel için 5 açıklama oluştur:
- 1 tanesi DOĞRU açıklama (görseli doğru tarif eder)
- 4 tanesi YANLIŞ açıklama (çeldirici)

JSON formatında yanıt ver:
[
  {
    "id": "desc_1",
    "text": "Görseli doğru tarif eden cümle (Türkçe)",
    "isCorrect": true
  },
  {
    "id": "desc_2",
    "text": "Yanlış açıklama 1",
    "isCorrect": false
  },
  {
    "id": "desc_3",
    "text": "Yanlış açıklama 2",
    "isCorrect": false
  },
  {
    "id": "desc_4",
    "text": "Yanlış açıklama 3",
    "isCorrect": false
  },
  {
    "id": "desc_5",
    "text": "Yanlış açıklama 4",
    "isCorrect": false
  }
]

Sadece JSON döndür, başka açıklama ekleme.
`;

    try {
      const response = await this.callGemini(prompt);
      const parsed = extractJsonFromText(response);
      
      if (!Array.isArray(parsed) || parsed.length !== 5) {
        throw new Error('Invalid descriptions response');
      }
      
      return shuffleArray(parsed);
    } catch (error) {
      console.error('Error generating descriptions:', error);
      return this.getMockDescriptions(card);
    }
  }

  // Generate 5 words for an object (1 correct, 4 wrong)
  async generateWords(card, topic) {
    const prompt = `
Bir dil öğrenme uygulaması için kelime seçenekleri oluştur.

Görsel: "${card.imageDescription}"

Bu görseldeki ana nesnenin İngilizce kelimesini ve 4 tane çeldirici kelime oluştur.

JSON formatında yanıt ver:
[
  {
    "id": "word_1",
    "text": "Doğru İngilizce kelime",
    "isCorrect": true
  },
  {
    "id": "word_2",
    "text": "Yanlış kelime 1",
    "isCorrect": false
  },
  {
    "id": "word_3",
    "text": "Yanlış kelime 2",
    "isCorrect": false
  },
  {
    "id": "word_4",
    "text": "Yanlış kelime 3",
    "isCorrect": false
  },
  {
    "id": "word_5",
    "text": "Yanlış kelime 4",
    "isCorrect": false
  }
]

Sadece JSON döndür, başka açıklama ekleme.
`;

    try {
      const response = await this.callGemini(prompt);
      const parsed = extractJsonFromText(response);
      
      if (!Array.isArray(parsed) || parsed.length !== 5) {
        throw new Error('Invalid words response');
      }
      
      return shuffleArray(parsed);
    } catch (error) {
      console.error('Error generating words:', error);
      return this.getMockWords(card);
    }
  }

  // Mock descriptions
  getMockDescriptions(card) {
    const desc = card.imageDescription || '';
    
    return shuffleArray([
      { id: 'desc_1', text: `Bu görselde ${desc.toLowerCase()} görünüyor`, isCorrect: true },
      { id: 'desc_2', text: 'Bu görselde bir ev var', isCorrect: false },
      { id: 'desc_3', text: 'Bu görselde bir araba var', isCorrect: false },
      { id: 'desc_4', text: 'Bu görselde bir ağaç var', isCorrect: false },
      { id: 'desc_5', text: 'Bu görselde bir kuş var', isCorrect: false },
    ]);
  }

  // Mock words
  getMockWords(card) {
    const desc = (card.imageDescription || '').toLowerCase();
    let correctWord = 'Object';
    
    if (desc.includes('dog')) correctWord = 'Dog';
    else if (desc.includes('cat')) correctWord = 'Cat';
    else if (desc.includes('car')) correctWord = 'Car';
    else if (desc.includes('tree')) correctWord = 'Tree';
    else if (desc.includes('sun')) correctWord = 'Sun';
    else if (desc.includes('book')) correctWord = 'Book';
    else if (desc.includes('house')) correctWord = 'House';
    else if (desc.includes('bird')) correctWord = 'Bird';
    
    return shuffleArray([
      { id: 'word_1', text: correctWord, isCorrect: true },
      { id: 'word_2', text: 'Apple', isCorrect: false },
      { id: 'word_3', text: 'Water', isCorrect: false },
      { id: 'word_4', text: 'Chair', isCorrect: false },
      { id: 'word_5', text: 'Phone', isCorrect: false },
    ]);
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
export default geminiService;
