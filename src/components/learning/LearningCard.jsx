/**
 * LearningCard Component
 * Card with image and text for learning flow
 */

import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, borderRadius, textStyles } from '../../styles';

const LearningCard = ({
  id,
  imageUrl,
  imageDescription,
  emoji,
  sentence,
  translation,
  selected = false,
  disabled = false,
  showAnswer = false,
  isCorrect,
  onSelect,
  style,
}) => {
  const handlePress = () => {
    if (!disabled && onSelect) {
      onSelect(id);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        selected && styles.selected,
        showAnswer && (isCorrect ? styles.correct : styles.incorrect),
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.emoji}>{emoji || '🖼️'}</Text>
            <Text style={styles.placeholderDesc} numberOfLines={2}>
              {imageDescription}
            </Text>
          </View>
        )}
        
        {/* Selection Indicator */}
        {selected && !showAnswer && (
          <View style={styles.selectionBadge}>
            <Text style={styles.selectionIcon}>✓</Text>
          </View>
        )}
        
        {/* Answer Indicator */}
        {showAnswer && (
          <View style={[
            styles.answerBadge,
            isCorrect ? styles.answerCorrect : styles.answerIncorrect,
          ]}>
            <Text style={styles.answerIcon}>
              {isCorrect ? '✓' : '✗'}
            </Text>
          </View>
        )}
      </View>

      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.sentence} numberOfLines={2}>
          {sentence}
        </Text>
        <Text style={styles.translation} numberOfLines={2}>
          {translation}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  selected: {
    borderColor: colors.primary[500],
  },
  correct: {
    borderColor: colors.success[500],
  },
  incorrect: {
    borderColor: colors.error[500],
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: colors.neutral[100],
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[100],
    padding: spacing[4],
  },
  emoji: {
    fontSize: 56,
    marginBottom: spacing[2],
  },
  placeholderDesc: {
    fontSize: textStyles.caption.fontSize,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  selectionBadge: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionIcon: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  answerBadge: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerCorrect: {
    backgroundColor: colors.success[500],
  },
  answerIncorrect: {
    backgroundColor: colors.error[500],
  },
  answerIcon: {
    color: colors.text.inverse,
    fontSize: 24,
    fontWeight: 'bold',
  },
  textContainer: {
    padding: spacing[4],
  },
  sentence: {
    fontSize: textStyles.h5.fontSize,
    fontWeight: textStyles.h5.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  translation: {
    fontSize: textStyles.body.fontSize,
    color: colors.text.secondary,
  },
});

export default LearningCard;
