/**
 * Main Application Component
 * Single page scrollable learning app
 */

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { colors, typography, spacing, borderRadius } from './styles';
import { geminiService } from './services';
import { getEmojiForKeyword } from './utils/constants';

// Main App Component
const App = () => {
  const scrollViewRef = useRef(null);
  const [prompt, setPrompt] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [score, setScore] = useState(0);

  // Yeni round başlat
  const startNewRound = async () => {
    setLoading(true);
    
    try {
      const cards = await geminiService.generateCards(topic || prompt, 1, []);
      const wrongCard = cards.find(c => !c.isCorrect);
      
      const newRound = {
        id: Date.now(),
        cards: cards,
        wrongCard: wrongCard,
        selectedWrongCard: null,
        wrongCardFound: false,
        showWrongFeedback: false,
        descriptions: [],
        selectedDescription: null,
        descriptionFound: false,
        showDescriptionFeedback: false,
        words: [],
        selectedWord: null,
        wordFound: false,
        showWordFeedback: false,
        completed: false
      };
      
      setRounds(prev => [...prev, newRound]);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Error starting round:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prompt gönder
  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) return;
    
    setTopic(prompt.trim());
    setLoading(true);
    
    try {
      const cards = await geminiService.generateCards(prompt.trim(), 1, []);
      const wrongCard = cards.find(c => !c.isCorrect);
      
      const newRound = {
        id: Date.now(),
        cards: cards,
        wrongCard: wrongCard,
        selectedWrongCard: null,
        wrongCardFound: false,
        showWrongFeedback: false,
        descriptions: [],
        selectedDescription: null,
        descriptionFound: false,
        showDescriptionFeedback: false,
        words: [],
        selectedWord: null,
        wordFound: false,
        showWordFeedback: false,
        completed: false
      };
      
      setRounds([newRound]);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Error starting:', error);
    } finally {
      setLoading(false);
    }
  };

  // Yanlış kart seçildi
  const handleCardSelect = async (roundIndex, card) => {
    const round = rounds[roundIndex];
    if (round.wrongCardFound) return;
    
    const isWrongCard = !card.isCorrect;
    
    setRounds(prev => {
      const updated = [...prev];
      updated[roundIndex] = {
        ...updated[roundIndex],
        selectedWrongCard: card,
        showWrongFeedback: true
      };
      return updated;
    });
    
    if (isWrongCard) {
      setScore(prev => prev + 10);
      
      setTimeout(async () => {
        setLoading(true);
        try {
          const descriptions = await geminiService.generateDescriptions(card, topic);
          
          setRounds(prev => {
            const updated = [...prev];
            updated[roundIndex] = {
              ...updated[roundIndex],
              wrongCardFound: true,
              descriptions: descriptions
            };
            return updated;
          });
          
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
          
        } catch (error) {
          console.error('Error loading descriptions:', error);
        } finally {
          setLoading(false);
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setRounds(prev => {
          const updated = [...prev];
          updated[roundIndex] = {
            ...updated[roundIndex],
            selectedWrongCard: null,
            showWrongFeedback: false
          };
          return updated;
        });
      }, 1500);
    }
  };

  // Açıklama seçildi
  const handleDescriptionSelect = async (roundIndex, description) => {
    const round = rounds[roundIndex];
    if (round.descriptionFound) return;
    
    setRounds(prev => {
      const updated = [...prev];
      updated[roundIndex] = {
        ...updated[roundIndex],
        selectedDescription: description,
        showDescriptionFeedback: true
      };
      return updated;
    });
    
    if (description.isCorrect) {
      setScore(prev => prev + 15);
      
      setTimeout(async () => {
        setLoading(true);
        try {
          const words = await geminiService.generateWords(round.selectedWrongCard, topic);
          
          setRounds(prev => {
            const updated = [...prev];
            updated[roundIndex] = {
              ...updated[roundIndex],
              descriptionFound: true,
              words: words
            };
            return updated;
          });
          
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
          
        } catch (error) {
          console.error('Error loading words:', error);
        } finally {
          setLoading(false);
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setRounds(prev => {
          const updated = [...prev];
          updated[roundIndex] = {
            ...updated[roundIndex],
            selectedDescription: null,
            showDescriptionFeedback: false
          };
          return updated;
        });
      }, 1500);
    }
  };

  // Kelime seçildi
  const handleWordSelect = async (roundIndex, word) => {
    const round = rounds[roundIndex];
    if (round.wordFound) return;
    
    setRounds(prev => {
      const updated = [...prev];
      updated[roundIndex] = {
        ...updated[roundIndex],
        selectedWord: word,
        showWordFeedback: true
      };
      return updated;
    });
    
    if (word.isCorrect) {
      setScore(prev => prev + 20);
      
      setTimeout(() => {
        setRounds(prev => {
          const updated = [...prev];
          updated[roundIndex] = {
            ...updated[roundIndex],
            wordFound: true,
            completed: true
          };
          return updated;
        });
        
        startNewRound();
      }, 1500);
    } else {
      setTimeout(() => {
        setRounds(prev => {
          const updated = [...prev];
          updated[roundIndex] = {
            ...updated[roundIndex],
            selectedWord: null,
            showWordFeedback: false
          };
          return updated;
        });
      }, 1500);
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🎓</Text>
        <Text style={styles.title}>AI Dil Öğrenme</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>⭐ {score}</Text>
        </View>
      </View>

      {/* Prompt Input - Sadece başlangıçta */}
      {!topic && (
        <View style={styles.promptSection}>
          <Text style={styles.promptTitle}>Ne Öğrenmek İstiyorsun?</Text>
          <Text style={styles.promptSubtitle}>
            Bir konu gir ve interaktif kartlarla öğrenmeye başla!
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Örn: İngilizce öğret, Hayvanlar, Renkler..."
              placeholderTextColor={colors.text.muted}
              value={prompt}
              onChangeText={setPrompt}
              onSubmitEditing={handleSubmitPrompt}
            />
            <Pressable
              style={[styles.submitButton, !prompt.trim() && styles.submitButtonDisabled]}
              onPress={handleSubmitPrompt}
              disabled={!prompt.trim() || loading}
            >
              <Text style={styles.submitButtonText}>Başla →</Text>
            </Pressable>
          </View>
          
          <View style={styles.sampleTopics}>
            <Text style={styles.sampleLabel}>Popüler Konular:</Text>
            <View style={styles.topicChips}>
              {['İngilizce öğret', 'Hayvanlar', 'Yemekler', 'Renkler', 'Sayılar'].map((t, i) => (
                <Pressable
                  key={i}
                  style={styles.topicChip}
                  onPress={() => setPrompt(t)}
                >
                  <Text style={styles.topicChipText}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Topic Display */}
      {topic && (
        <View style={styles.topicDisplay}>
          <Text style={styles.topicLabel}>Konu:</Text>
          <Text style={styles.topicText}>{topic}</Text>
        </View>
      )}

      {/* Rounds */}
      {rounds.map((round, roundIndex) => (
        <View key={round.id} style={styles.roundContainer}>
          <View style={styles.roundHeader}>
            <Text style={styles.roundTitle}>Tur {roundIndex + 1}</Text>
            {round.completed && <Text style={styles.roundComplete}>✓ Tamamlandı</Text>}
          </View>

          {/* Step 1: Find Wrong Card */}
          <View style={styles.stepSection}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepTitle}>Yanlış Kartı Bul</Text>
            </View>
            <Text style={styles.stepDescription}>
              5 karttan resim-cümle uyumsuz olanı seç
            </Text>
            
            <View style={styles.cardsGrid}>
              {round.cards.map((card) => {
                const isSelected = round.selectedWrongCard?.id === card.id;
                const showFeedback = round.showWrongFeedback && isSelected;
                const isCorrectSelection = showFeedback && !card.isCorrect;
                const isWrongSelection = showFeedback && card.isCorrect;
                
                return (
                  <Pressable
                    key={card.id}
                    style={[
                      styles.card,
                      isSelected && styles.cardSelected,
                      isCorrectSelection && styles.cardCorrect,
                      isWrongSelection && styles.cardWrong,
                      round.wrongCardFound && !card.isCorrect && styles.cardHighlight
                    ]}
                    onPress={() => !round.wrongCardFound && handleCardSelect(roundIndex, card)}
                    disabled={round.wrongCardFound}
                  >
                    <View style={styles.cardImageContainer}>
                      <Text style={styles.cardEmoji}>{card.emoji || getEmojiForKeyword(card.imageDescription)}</Text>
                    </View>
                    <Text style={styles.cardSentence} numberOfLines={2}>{card.sentence}</Text>
                    <Text style={styles.cardTranslation} numberOfLines={1}>{card.translation}</Text>
                    
                    {showFeedback && (
                      <View style={[styles.feedbackBadge, isCorrectSelection ? styles.feedbackSuccess : styles.feedbackError]}>
                        <Text style={styles.feedbackText}>
                          {isCorrectSelection ? '✓ Doğru!' : '✗ Tekrar dene'}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Step 2: Select Correct Description */}
          {round.wrongCardFound && round.descriptions.length > 0 && (
            <View style={styles.stepSection}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepTitle}>Doğru Açıklamayı Seç</Text>
              </View>
              <Text style={styles.stepDescription}>
                Bu görsel için doğru açıklamayı bul
              </Text>
              
              <View style={styles.selectedCardDisplay}>
                <Text style={styles.selectedCardEmoji}>
                  {round.selectedWrongCard?.emoji || '🖼️'}
                </Text>
                <Text style={styles.selectedCardLabel}>
                  {round.selectedWrongCard?.imageDescription}
                </Text>
              </View>
              
              <View style={styles.optionsGrid}>
                {round.descriptions.map((desc) => {
                  const isSelected = round.selectedDescription?.id === desc.id;
                  const showFeedback = round.showDescriptionFeedback && isSelected;
                  const isCorrectSelection = showFeedback && desc.isCorrect;
                  const isWrongSelection = showFeedback && !desc.isCorrect;
                  
                  return (
                    <Pressable
                      key={desc.id}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionSelected,
                        isCorrectSelection && styles.optionCorrect,
                        isWrongSelection && styles.optionWrong,
                        round.descriptionFound && desc.isCorrect && styles.optionHighlight
                      ]}
                      onPress={() => !round.descriptionFound && handleDescriptionSelect(roundIndex, desc)}
                      disabled={round.descriptionFound}
                    >
                      <Text style={styles.optionText}>{desc.text}</Text>
                      
                      {showFeedback && (
                        <View style={[styles.optionFeedback, isCorrectSelection ? styles.feedbackSuccess : styles.feedbackError]}>
                          <Text style={styles.feedbackText}>
                            {isCorrectSelection ? '✓' : '✗'}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Step 3: Select Correct Word */}
          {round.descriptionFound && round.words.length > 0 && (
            <View style={styles.stepSection}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepTitle}>Doğru Kelimeyi Seç</Text>
              </View>
              <Text style={styles.stepDescription}>
                Bu nesnenin doğru kelimesini seç
              </Text>
              
              <View style={styles.selectedCardDisplay}>
                <Text style={styles.selectedCardEmoji}>
                  {round.selectedWrongCard?.emoji || '🖼️'}
                </Text>
              </View>
              
              <View style={styles.wordsGrid}>
                {round.words.map((word) => {
                  const isSelected = round.selectedWord?.id === word.id;
                  const showFeedback = round.showWordFeedback && isSelected;
                  const isCorrectSelection = showFeedback && word.isCorrect;
                  const isWrongSelection = showFeedback && !word.isCorrect;
                  
                  return (
                    <Pressable
                      key={word.id}
                      style={[
                        styles.wordCard,
                        isSelected && styles.wordSelected,
                        isCorrectSelection && styles.wordCorrect,
                        isWrongSelection && styles.wordWrong,
                        round.wordFound && word.isCorrect && styles.wordHighlight
                      ]}
                      onPress={() => !round.wordFound && handleWordSelect(roundIndex, word)}
                      disabled={round.wordFound}
                    >
                      <Text style={styles.wordText}>{word.text}</Text>
                      
                      {showFeedback && (
                        <View style={[styles.wordFeedback, isCorrectSelection ? styles.feedbackSuccess : styles.feedbackError]}>
                          <Text style={styles.feedbackText}>
                            {isCorrectSelection ? '✓' : '✗'}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {round.completed && (
            <View style={styles.roundDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Tur Tamamlandı! 🎉</Text>
              <View style={styles.dividerLine} />
            </View>
          )}
        </View>
      ))}

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>⏳</Text>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.primary.main,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  logo: {
    fontSize: 32,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: 'white',
    flex: 1,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  scoreText: {
    ...typography.body,
    color: 'white',
    fontWeight: '600',
  },
  promptSection: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  promptTitle: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  promptSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...typography.body,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  submitButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    ...typography.body,
    color: 'white',
    fontWeight: '600',
  },
  sampleTopics: {
    marginTop: spacing.md,
  },
  sampleLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  topicChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  topicChip: {
    backgroundColor: colors.surface.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  topicChipText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  topicDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
  },
  topicLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginRight: spacing.xs,
  },
  topicText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  roundContainer: {
    padding: spacing.lg,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  roundTitle: {
    ...typography.h3,
    color: colors.primary.main,
  },
  roundComplete: {
    ...typography.caption,
    color: colors.success.main,
    fontWeight: '600',
  },
  stepSection: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  stepNumber: {
    width: 28,
    height: 28,
    backgroundColor: colors.primary.main,
    color: 'white',
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '700',
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  stepTitle: {
    ...typography.h4,
    color: colors.text.primary,
  },
  stepDescription: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.md,
    marginLeft: 36,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  card: {
    width: '45%',
    backgroundColor: colors.surface.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cardSelected: {
    borderColor: colors.primary.main,
  },
  cardCorrect: {
    borderColor: colors.success.main,
    backgroundColor: colors.success.light,
  },
  cardWrong: {
    borderColor: colors.error.main,
    backgroundColor: colors.error.light,
  },
  cardHighlight: {
    borderColor: colors.warning.main,
    backgroundColor: colors.warning.light,
  },
  cardImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardEmoji: {
    fontSize: 32,
  },
  cardSentence: {
    ...typography.caption,
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  cardTranslation: {
    ...typography.small,
    color: colors.text.muted,
    textAlign: 'center',
  },
  feedbackBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  feedbackSuccess: {
    backgroundColor: colors.success.main,
  },
  feedbackError: {
    backgroundColor: colors.error.main,
  },
  feedbackText: {
    ...typography.small,
    color: 'white',
    fontWeight: '600',
  },
  selectedCardDisplay: {
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
  },
  selectedCardEmoji: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  selectedCardLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  optionsGrid: {
    gap: spacing.sm,
  },
  optionCard: {
    backgroundColor: colors.surface.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    borderColor: colors.primary.main,
  },
  optionCorrect: {
    borderColor: colors.success.main,
    backgroundColor: colors.success.light,
  },
  optionWrong: {
    borderColor: colors.error.main,
    backgroundColor: colors.error.light,
  },
  optionHighlight: {
    borderColor: colors.success.main,
    backgroundColor: colors.success.light,
  },
  optionText: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  optionFeedback: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  wordCard: {
    backgroundColor: colors.surface.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: '40%',
    alignItems: 'center',
    position: 'relative',
  },
  wordSelected: {
    borderColor: colors.primary.main,
  },
  wordCorrect: {
    borderColor: colors.success.main,
    backgroundColor: colors.success.light,
  },
  wordWrong: {
    borderColor: colors.error.main,
    backgroundColor: colors.error.light,
  },
  wordHighlight: {
    borderColor: colors.success.main,
    backgroundColor: colors.success.light,
  },
  wordText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  wordFeedback: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerText: {
    ...typography.caption,
    color: colors.success.main,
    marginHorizontal: spacing.md,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.muted,
  },
  bottomPadding: {
    height: 100,
  },
});

export default App;
