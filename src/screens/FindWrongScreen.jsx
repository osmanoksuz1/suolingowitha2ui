/**
 * FindWrongScreen Component
 * Screen where user swipes through 5 cards and finds the wrong one
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Button, Card, ProgressBar } from '../components/ui';
import { LearningCard, CardCarousel } from '../components/learning';
import { colors, typography, spacing, borderRadius } from '../styles';
import { useAppContext } from '../context';
import { ACTION_TYPES } from '../context/actions';

export const FindWrongScreen = () => {
  const { state, dispatch } = useAppContext();
  const { cards, currentCardIndex, score, round } = state;
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectSelection, setIsCorrectSelection] = useState(false);

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  const handleCardSelect = (index) => {
    if (showFeedback) return;
    
    setSelectedCardIndex(index);
    const selectedCard = cards[index];
    const isWrongCard = selectedCard && !selectedCard.isCorrect;
    
    setIsCorrectSelection(isWrongCard);
    setShowFeedback(true);

    if (isWrongCard) {
      // Found the wrong card!
      dispatch({ type: ACTION_TYPES.SELECT_WRONG_CARD, payload: selectedCard });
      
      // Wait and move to explanation screen
      setTimeout(() => {
        dispatch({ type: ACTION_TYPES.SET_STAGE, payload: 'explanation' });
      }, 1500);
    } else {
      // Wrong selection, try again
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedCardIndex(null);
      }, 1500);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      dispatch({ type: ACTION_TYPES.NEXT_CARD });
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      dispatch({ type: ACTION_TYPES.PREV_CARD });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.roundText}>Tur {round}</Text>
          <Text style={styles.scoreText}>⭐ {score}</Text>
        </View>
        <Text style={styles.title}>Yanlış Kartı Bul</Text>
        <Text style={styles.subtitle}>
          5 karttan resim-cümle uyumsuz olanı seç
        </Text>
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} />
          <Text style={styles.progressText}>
            {currentCardIndex + 1} / {cards.length}
          </Text>
        </View>
      </View>

      {/* Card Display */}
      <View style={styles.cardSection}>
        {currentCard && (
          <Pressable
            onPress={() => handleCardSelect(currentCardIndex)}
            style={({ pressed }) => [
              styles.cardWrapper,
              pressed && styles.cardPressed,
              selectedCardIndex === currentCardIndex && styles.cardSelected,
              showFeedback && selectedCardIndex === currentCardIndex && (
                isCorrectSelection ? styles.cardCorrect : styles.cardWrong
              ),
            ]}
          >
            <LearningCard card={currentCard} />
          </Pressable>
        )}

        {/* Feedback Overlay */}
        {showFeedback && (
          <View style={styles.feedbackOverlay}>
            <View style={[
              styles.feedbackBadge,
              isCorrectSelection ? styles.feedbackSuccess : styles.feedbackError,
            ]}>
              <Text style={styles.feedbackEmoji}>
                {isCorrectSelection ? '🎉' : '❌'}
              </Text>
              <Text style={styles.feedbackText}>
                {isCorrectSelection 
                  ? 'Doğru! Bu yanlış kart!' 
                  : 'Bu kart doğru eşleştirilmiş'}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <Button
          title="◀ Önceki"
          variant="secondary"
          onPress={handlePrevCard}
          disabled={currentCardIndex === 0}
          style={styles.navButton}
        />
        
        <View style={styles.cardIndicators}>
          {cards.map((card, index) => (
            <Pressable
              key={card.id}
              onPress={() => dispatch({ 
                type: ACTION_TYPES.SET_CARD_INDEX, 
                payload: index 
              })}
              style={[
                styles.indicator,
                index === currentCardIndex && styles.indicatorActive,
              ]}
            />
          ))}
        </View>

        <Button
          title="Sonraki ▶"
          variant="secondary"
          onPress={handleNextCard}
          disabled={currentCardIndex === cards.length - 1}
          style={styles.navButton}
        />
      </View>

      {/* Hint */}
      <View style={styles.hintSection}>
        <Text style={styles.hintText}>
          💡 Resim ile cümlenin uyumunu kontrol et
        </Text>
        <Text style={styles.hintSubtext}>
          Karta tıklayarak yanlış olduğunu düşündüğünü seç
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
  progressContainer: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressText: {
    ...typography.caption,
    color: colors.text.muted,
    minWidth: 50,
    textAlign: 'right',
  },
  cardSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 350,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardSelected: {
    borderWidth: 3,
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
  feedbackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  feedbackBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  feedbackSuccess: {
    backgroundColor: colors.success.main,
  },
  feedbackError: {
    backgroundColor: colors.error.main,
  },
  feedbackEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  feedbackText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  navButton: {
    minWidth: 100,
  },
  cardIndicators: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border.medium,
  },
  indicatorActive: {
    backgroundColor: colors.primary.main,
    width: 24,
  },
  hintSection: {
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.surface.secondary,
  },
  hintText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  hintSubtext: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default FindWrongScreen;
