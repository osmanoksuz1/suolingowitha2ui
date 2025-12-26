# 🎓 AI-Powered Interactive Learning App

## 📋 Proje Özeti

Claude AI destekli, mobil öncelikli interaktif öğrenme uygulaması. Kullanıcı tek seferlik metin girişi yapar, sonrasında tamamen tıklama tabanlı etkileşimle öğrenme deneyimi yaşar.

## 🚀 Teknoloji Stack

| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| **React** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Utility-First Styling |
| **Framer Motion** | Animasyonlar |
| **Anthropic Claude API** | AI Kart Üretimi |
| **React Context** | State Management |

## 📁 Proje Mimarisi

```
a2ui/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ui/                    # A2UI Bileşenleri
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── Skeleton.jsx
│   │   ├── LearningCard.jsx       # Öğrenme kartı bileşeni
│   │   ├── ImageGrid.jsx          # Resim seçim grid'i
│   │   ├── FeedbackModal.jsx      # Geri bildirim modalı
│   │   └── NavigationButtons.jsx  # Navigasyon butonları
│   ├── screens/
│   │   ├── WelcomeScreen.jsx      # ADIM 0: Giriş ekranı
│   │   ├── FindWrongScreen.jsx    # ADIM 1: Yanlışı bulma
│   │   ├── ExplanationScreen.jsx  # ADIM 2: Gerekçe açıklama
│   │   └── SelectCorrectScreen.jsx # ADIM 3: Doğruyu seçme
│   ├── context/
│   │   └── AppContext.jsx         # Global state yönetimi
│   ├── services/
│   │   └── aiService.js           # Claude API entegrasyonu
│   ├── hooks/
│   │   ├── useHapticFeedback.js   # Titreşim hook'u
│   │   └── useCards.js            # Kart yönetim hook'u
│   ├── utils/
│   │   └── helpers.js             # Yardımcı fonksiyonlar
│   ├── App.jsx                    # Ana uygulama bileşeni
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global stiller
├── .env.example                   # Ortam değişkenleri örneği
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🔄 Uygulama Akışı

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADIM 0                                   │
│                    Giriş Ekranı                                  │
│            "Ne öğrenmek istiyorsun?"                            │
│         [___________________] [Başla]                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ADIM 1                                   │
│                 Yanlışı Bulma Aşaması                           │
│                                                                  │
│    ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐                      │
│    │ 🐕 │  │ 🐈 │  │ 🚗 │  │ ☀️ │  │ 📖 │   ← 5 Kart           │
│    │    │  │    │  │ ❌ │  │    │  │    │   (1 Yanlış)         │
│    └────┘  └────┘  └────┘  └────┘  └────┘                      │
│                                                                  │
│              [Seçilen kartı tıkla]                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ADIM 2                                   │
│                 Gerekçe Açıklama Ekranı                         │
│                                                                  │
│         ┌──────────────────────┐                                │
│         │   Seçilen Kart 🚗    │                                │
│         │   "The tree is..."   │                                │
│         └──────────────────────┘                                │
│                                                                  │
│    "Bu kartın neden yanlış olduğunu düşünüyorsun?"             │
│         [_________________________]                             │
│                  [Gönder]                                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ADIM 3                                   │
│                 Doğruyu Seçme Aşaması                           │
│                                                                  │
│         "The tree is green" için doğru resmi seç:              │
│                                                                  │
│         ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐                 │
│         │ 🌳 │  │ 🏠 │  │ 🐕 │  │ 🍎 │  │ 🚗 │                 │
│         │ ✅ │  │    │  │    │  │    │  │    │                 │
│         └────┘  └────┘  └────┘  └────┘  └────┘                 │
│                                                                  │
│                    [Devam Et]                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
                    ┌─────────┐
                    │ DÖNGÜ   │ → ADIM 1'e geri dön
                    └─────────┘
```

## 🎯 Temel Özellikler

### 1. Tek Seferlik Giriş
- Kullanıcı sadece başlangıçta ne öğrenmek istediğini yazar
- Sonraki tüm etkileşimler tıklama tabanlı

### 2. AI Destekli Kart Üretimi
- Claude API dinamik olarak öğrenme kartları oluşturur
- Her kart: resim açıklaması + İngilizce cümle + Türkçe çeviri

### 3. Akıllı Yanlış Eşleştirme
- 5 karttan 1'i kasıtlı olarak yanlış eşleştirilir
- Kullanıcı yanlışı bulmaya çalışır

### 4. Görsel Öğrenme
- Emoji tabanlı görsel ipuçları
- Placeholder resimler (gerçek projede AI görsel üretimi eklenebilir)

### 5. Mobil Optimizasyon
- Touch-friendly (min 44x44px dokunma alanı)
- Swipe/kaydırma destekli kartlar
- Haptic feedback (destekleyen cihazlarda)

## 🛠️ Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
```

## ⚙️ Ortam Değişkenleri

`.env` dosyası oluşturun:

```env
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

## 📱 Responsive Tasarım

| Ekran | Özellik |
|-------|---------|
| Mobile (< 640px) | Tek sütun, tam genişlik kartlar |
| Tablet (640-1024px) | 2 sütun grid |
| Desktop (> 1024px) | 3+ sütun grid, geniş kartlar |

## 🎨 Renk Paleti

```css
--primary: #6366f1    /* Indigo - Ana renk */
--success: #22c55e    /* Yeşil - Doğru cevap */
--error: #ef4444      /* Kırmızı - Yanlış cevap */
--warning: #f59e0b    /* Turuncu - Uyarı */
--background: #f8fafc /* Açık gri - Arka plan */
--surface: #ffffff    /* Beyaz - Kart yüzeyi */
--text: #1e293b       /* Koyu gri - Metin */
```

## 📦 State Yapısı

```javascript
{
  // Kullanıcı girişi
  userTopic: "İngilizce öğret",
  
  // Mevcut aşama (0-3)
  currentStage: 1,
  
  // Döngü sayısı
  currentRound: 1,
  
  // ADIM 1 kartları
  cards: [
    {
      id: 1,
      emoji: "🐕",
      imagePrompt: "A dog running in the park",
      sentence: "The dog is running.",
      translation: "Köpek koşuyor.",
      isCorrect: true
    },
    // ... 4 kart daha
  ],
  
  // Seçilen yanlış kart
  selectedCard: null,
  
  // ADIM 2 gerekçe
  userExplanation: "",
  
  // ADIM 3 resimler
  imageOptions: [],
  
  // Skor
  score: 0,
  
  // Yükleme durumu
  isLoading: false
}
```

## 🔐 Güvenlik Notları

⚠️ **Önemli**: Gerçek projede API anahtarı backend'de tutulmalıdır. Bu demo için client-side kullanım gösterilmiştir.

## 📄 Lisans

MIT License

## 👨‍💻 Geliştirici

Bu proje AI-destekli öğrenme deneyimlerini keşfetmek için oluşturulmuştur.
