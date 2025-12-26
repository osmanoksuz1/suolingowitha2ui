/**
 * ImageGrid Component
 * Grid of selectable images for the correct image selection step
 */

import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, borderRadius, textStyles } from '../../styles';
import { GridSkeleton } from '../ui/Skeleton';

const ImageGrid = ({
  images = [],
  selectedImageId,
  onImageSelect,
  loading = false,
  showAnswers = false,
  disabled = false,
  columns = 2,
  style,
}) => {
  if (loading) {
    return <GridSkeleton count={5} columns={columns} style={style} />;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.grid}>
        {images.map((image, index) => (
          <ImageItem
            key={image.id}
            image={image}
            index={index}
            columns={columns}
            selected={selectedImageId === image.id}
            showAnswer={showAnswers}
            disabled={disabled}
            onSelect={onImageSelect}
          />
        ))}
      </View>
    </View>
  );
};

const ImageItem = ({
  image,
  index,
  columns,
  selected,
  showAnswer,
  disabled,
  onSelect,
}) => {
  const handlePress = () => {
    if (!disabled && onSelect) {
      onSelect(image.id);
    }
  };

  // Calculate width based on columns
  const itemWidth = columns === 2 ? '48%' : columns === 3 ? '31%' : '100%';

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.imageItem,
        { width: itemWidth },
        selected && styles.selected,
        showAnswer && image.isCorrect && styles.correct,
        showAnswer && selected && !image.isCorrect && styles.incorrect,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={styles.imageContainer}>
        {image.imageUrl ? (
          <Image
            source={{ uri: image.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.emoji}>{image.emoji || '🖼️'}</Text>
          </View>
        )}

        {/* Selection Overlay */}
        {selected && !showAnswer && (
          <View style={styles.selectionOverlay}>
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          </View>
        )}

        {/* Answer Overlay */}
        {showAnswer && (selected || image.isCorrect) && (
          <View style={[
            styles.answerOverlay,
            image.isCorrect ? styles.correctOverlay : styles.incorrectOverlay,
          ]}>
            <Text style={styles.answerIcon}>
              {image.isCorrect ? '✓' : '✗'}
            </Text>
          </View>
        )}
      </View>

      {/* Label */}
      {image.label && (
        <Text style={styles.label} numberOfLines={1}>
          {image.label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageItem: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
    marginBottom: spacing[3],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    transform: [{ scale: 0.97 }],
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  selectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.text.inverse,
    fontSize: 28,
    fontWeight: 'bold',
  },
  answerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctOverlay: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
  },
  incorrectOverlay: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  answerIcon: {
    fontSize: 56,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  label: {
    fontSize: textStyles.bodySmall.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    padding: spacing[2],
  },
});

export default ImageGrid;
