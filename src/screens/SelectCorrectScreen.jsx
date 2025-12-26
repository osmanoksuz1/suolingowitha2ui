/**
 * SelectCorrectScreen Component
 * Screen where user selects the correct image for the sentence
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Button, Card, ProgressBar } from '../components/ui';
import { ImageGrid } from '../components/learning';
import { colors, typography, spacing, borderRadius } from '../styles';
import { useAppContext } from '../context';
import { ACTION_TYPES } from '../context/actions';
import { geminiService } from '../services';
import { getEmojiForKeyword } from '../utils/constants';

export const SelectCorrectScreen = () => {
  const { state, dispatch } = useAppContext();
  const { selectedWrongCard, correctImages, score, round, topic } = state;
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(correctImages || []);

  // Load images if not available
  useEffect(() => {
    if (!correctImages || correctImages.length === 0) {
      loadImages();
    }
  }, []);

  const loadImages = async () => {
    if (!selectedWrongCard) return;
    
    setLoading(true);
    try {
      const newImages = await geminiService.generateCorrectImages(
        selectedWrongCard,
        topic
      );
      setImages(newImages);
      dispatch({ type: ACTION_TYPES.SET_CORRECT_IMAGES, payload: newImages });
    } catch (error) {
      console.error('Error loading images:', error);
      // Use mock images
      setImages(getMockImages());
    } finally {
      setLoading(false);
    }
  };

  const getMockImages = () => {
    if (!selectedWrongCard) return [];
    
    return [
      {
        id: 'img_1',
        imageDescription: getCorrectDescription(selectedWrongCard.sentence),
        emoji: getEmojiForKeyword(selectedWrongCard.sentence),
        label: 'Doğru',
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
        imageDescription: selectedWrongCard.imageDescription,
        emoji: selectedWrongCard.emoji || '❓',
        label: 'Yanlış',
        isCorrect: false,
      },
    ];
  };

  const getCorrectDescription = (sentence) => {
    const lower = sentence.toLowerCase();
    if (lower.includes('tree')) return 'A tall green tree';
    if (lower.includes('dog')) return 'A happy dog';
    if (lower.includes('cat')) return 'A cute cat';
    if (lower.includes('sun')) return 'A bright sun';
    if (lower.includes('book')) return 'An open book';
    if (lower.includes('car')) return 'A red car';
    return 'Matching image';
  };

  const handleImageSelect = (image) => {
    if (showFeedback) return;
    
    setSelectedImage(image);
    setIsCorrect(image.isCorrect);
    setShowFeedback(true);

    if (image.isCorrect) {
      // Correct selection - add score
      dispatch({ type: ACTION_TYPES.ADD_SCORE, payload: 10 });
    }
  };

  const handleContinue = async () => {
    setShowFeedback(false);
    setSelectedImage(null);
    setLoading(true);

    try {
      // Generate new cards for next round
      const newCards = await geminiService.generateCards(topic, Math.min(round, 3));
      dispatch({ type: ACTION_TYPES.START_ROUND, payload: newCards });
    } catch (error) {
      console.error('Error generating new cards:', error);
      // Use mock cards
      dispatch({ type: ACTION_TYPES.NEXT_ROUND });
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setShowFeedback(false);
    setSelectedImage(null);
  };

  const displayImages = images.length > 0 ? images : (correctImages || []);

  if (!selectedWrongCard) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Kart bulunamadı</Text>
        <Button 
          title="Ana Ekrana Dön" 
          onPress={() => dispatch({ type: ACTION_TYPES.RESET })}
        />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.roundText}>Tur {round}</Text>
          <Text style={styles.scoreText}>⭐ {score}</Text>
        </View>
        <Text style={styles.title}>Doğru Resmi Seç</Text>
        <Text style={styles.subtitle}>
          Cümleyle eşleşen doğru resmi bul
        </Text>
      </View>

      {/* Sentence Display */}
      <View style={styles.sentenceSection}>
        <Card style={styles.sentenceCard}>
          <Text style={styles.sentenceLabel}>Cümle</Text>
          <Text style={styles.sentence}>{selectedWrongCard.sentence}</Text>
          <Text style={styles.translation}>{selectedWrongCard.translation}</Text>
        </Card>
      </View>

      {/* Image Grid */}
      <View style={styles.imageSection}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingEmoji}>🔄</Text>
            <Text style={styles.loadingText}>Resimler yükleniyor...</Text>
          </View>
        ) : (
          <View style={styles.imageGrid}>
            {displayImages.map((image, index) => (
              <Pressable
                key={image.id || index}
                onPress={() => handleImageSelect(image)}
                disabled={showFeedback}
                style={({ pressed }) => [
                  styles.imageCard,
                  pressed && styles.imageCardPressed,
                  selectedImage?.id === image.id && styles.imageCardSelected,
                  showFeedback && selectedImage?.id === image.id && (
                    isCorrect ? styles.imageCardCorrect : styles.imageCardWrong
                  ),
                ]}
              >
                <Text style={styles.imageEmoji}>
                  {image.emoji || '🖼️'}
                </Text>
                <Text style={styles.imageLabel} numberOfLines={2}>
                  {image.label || image.imageDescription?.slice(0, 20)}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Feedback */}
      {showFeedback && (
        <View style={styles.feedbackSection}>
          <View style={[
            styles.feedbackCard,
            isCorrect ? styles.feedbackSuccess : styles.feedbackError,
          ]}>
            <Text style={styles.feedbackEmoji}>
              {isCorrect ? '🎉' : '😅'}
            </Text>
            <Text style={styles.feedbackTitle}>
              {isCorrect ? 'Harika! Doğru cevap!' : 'Yanlış seçim'}
            </Text>
            <Text style={styles.feedbackText}>
              {isCorrect 
                ? `+10 puan kazandın! Toplam: ${score} puan`
                : 'Tekrar dene veya devam et'}
            </Text>
            
            <View style={styles.feedbackActions}>
              {isCorrect ? (
                <Button
                  title={loading ? 'Yükleniyor...' : 'Sonraki Tur →'}
                  onPress={handleContinue}
                  loading={loading}
                  size="lg"
                />
              ) : (
                <>
                  <Button
                    title="Tekrar Dene"
                    onPress={handleTryAgain}
                    variant="secondary"
                    style={styles.feedbackButton}
                  />
                  <Button
                    title="Devam Et"
                    onPress={handleContinue}
                    loading={loading}
                    style={styles.feedbackButton}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Hint */}
      {!showFeedback && (
        <View style={styles.hintSection}>
          <Text style={styles.hintText}>
            💡 Cümleyi dikkatlice oku ve uygun resmi seç
          </Text>
        </View>
      )}
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
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.surface.primary,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  roundText: {
    ...typography.caption,
    color: colors.primary.main,
    fontWeight: '600',
  },
  scoreText: {
    ...typography.body,
    color: colors.warning.main,
    fontWeight: '600',
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  sentenceSection: {
    padding: spacing.lg,
  },
  sentenceCard: {
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  sentenceLabel: {
    ...typography.caption,
    color: colors.primary.main,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  sentence: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  translation: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  imageSection: {
    padding: spacing.lg,
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
    color: colors.text.secondary,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  imageCard: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  imageCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  imageCardSelected: {
    borderColor: colors.primary.main,
    borderWidth: 3,
  },
  imageCardCorrect: {
    borderColor: colors.success.main,
    backgroundColor: colors.success.light,
  },
  imageCardWrong: {
    borderColor: colors.error.main,
    backgroundColor: colors.error.light,
  },
  imageEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  imageLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  feedbackSection: {
    padding: spacing.lg,
  },
  feedbackCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
  },
  feedbackSuccess: {
    backgroundColor: colors.success.light,
    borderWidth: 2,
    borderColor: colors.success.main,
  },
  feedbackError: {
    backgroundColor: colors.error.light,
    borderWidth: 2,
    borderColor: colors.error.main,
  },
  feedbackEmoji: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  feedbackTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  feedbackText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  feedbackActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  feedbackButton: {
    minWidth: 120,
  },
  hintSection: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  hintText: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.error.main,
    textAlign: 'center',
    padding: spacing.xl,
  },
});

export default SelectCorrectScreen;
