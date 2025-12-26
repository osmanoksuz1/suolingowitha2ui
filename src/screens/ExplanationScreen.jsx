/**
 * ExplanationScreen Component
 * Screen where user explains why the card is wrong
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Button, Card } from '../components/ui';
import { LearningCard } from '../components/learning';
import { colors, typography, spacing, borderRadius } from '../styles';
import { useAppContext } from '../context';
import { ACTION_TYPES } from '../context/actions';
import { geminiService } from '../services';

export const ExplanationScreen = () => {
  const { state, dispatch } = useAppContext();
  const { selectedWrongCard, score, round } = state;
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = async () => {
    if (!explanation.trim() || !selectedWrongCard) return;

    setLoading(true);

    try {
      // Evaluate the explanation
      const aiFeedback = await geminiService.evaluateExplanation(
        selectedWrongCard,
        explanation.trim(),
        state.topic
      );

      setFeedback(aiFeedback);
      setShowFeedback(true);

      // Save explanation
      dispatch({ 
        type: ACTION_TYPES.SUBMIT_EXPLANATION, 
        payload: explanation.trim() 
      });

      // Generate correct images after delay
      setTimeout(async () => {
        try {
          const images = await geminiService.generateCorrectImages(
            selectedWrongCard,
            state.topic
          );
          dispatch({ type: ACTION_TYPES.SET_CORRECT_IMAGES, payload: images });
          dispatch({ type: ACTION_TYPES.SET_STAGE, payload: 'selectCorrect' });
        } catch (error) {
          console.error('Error generating images:', error);
          // Use mock images if API fails
          dispatch({ type: ACTION_TYPES.SET_STAGE, payload: 'selectCorrect' });
        }
      }, 2000);

    } catch (error) {
      console.error('Error submitting explanation:', error);
      setFeedback('Açıklaman kaydedildi! Devam edelim.');
      setShowFeedback(true);
      
      setTimeout(() => {
        dispatch({ type: ACTION_TYPES.SET_STAGE, payload: 'selectCorrect' });
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    dispatch({ type: ACTION_TYPES.SET_STAGE, payload: 'selectCorrect' });
  };

  if (!selectedWrongCard) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Kart bulunamadı</Text>
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
        <Text style={styles.title}>Neden Yanlış?</Text>
        <Text style={styles.subtitle}>
          Bu kartın neden yanlış eşleştirildiğini açıkla
        </Text>
      </View>

      {/* Wrong Card Display */}
      <View style={styles.cardSection}>
        <Text style={styles.cardLabel}>🚫 Yanlış Eşleştirme</Text>
        <View style={styles.cardWrapper}>
          <LearningCard card={selectedWrongCard} showWrong />
        </View>
      </View>

      {/* Explanation Input */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Açıklaman</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Örn: Resimde araba var ama cümlede ağaç anlatılıyor..."
          placeholderTextColor={colors.text.muted}
          value={explanation}
          onChangeText={setExplanation}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          editable={!loading && !showFeedback}
        />
        
        {/* Character count */}
        <Text style={styles.charCount}>
          {explanation.length} karakter
        </Text>
      </View>

      {/* Feedback */}
      {showFeedback && (
        <View style={styles.feedbackSection}>
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackEmoji}>💬</Text>
            <Text style={styles.feedbackTitle}>AI Geri Bildirimi</Text>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {!showFeedback ? (
          <>
            <Button
              title={loading ? 'Değerlendiriliyor...' : 'Gönder ✓'}
              onPress={handleSubmit}
              disabled={loading || !explanation.trim()}
              loading={loading}
              fullWidth
              size="lg"
            />
            <Button
              title="Geç →"
              variant="secondary"
              onPress={handleSkip}
              disabled={loading}
              style={styles.skipButton}
            />
          </>
        ) : (
          <View style={styles.loadingNext}>
            <Text style={styles.loadingText}>
              Doğru resmi seçme ekranına geçiliyor...
            </Text>
          </View>
        )}
      </View>

      {/* Hint */}
      <View style={styles.hintSection}>
        <Text style={styles.hintText}>
          💡 Detaylı açıklama yapmak öğrenmeni pekiştirir!
        </Text>
      </View>
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
  cardSection: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  cardLabel: {
    ...typography.caption,
    color: colors.error.main,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 300,
    borderWidth: 2,
    borderColor: colors.error.main,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  inputSection: {
    padding: spacing.lg,
  },
  inputLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    minHeight: 120,
    ...typography.body,
    color: colors.text.primary,
  },
  charCount: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  feedbackSection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  feedbackCard: {
    backgroundColor: colors.primary.light,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  feedbackEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  feedbackTitle: {
    ...typography.h3,
    color: colors.primary.dark,
    marginBottom: spacing.sm,
  },
  feedbackText: {
    ...typography.body,
    color: colors.text.primary,
    textAlign: 'center',
  },
  actions: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  skipButton: {
    marginTop: spacing.md,
  },
  loadingNext: {
    alignItems: 'center',
    padding: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
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

export default ExplanationScreen;
