/**
 * CardCarousel Component
 * Horizontal scrollable card list with swipe support
 */

import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { colors, spacing } from '../../styles';
import LearningCard from './LearningCard';
import { CardSkeleton } from '../ui/Skeleton';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = 280;
const CARD_MARGIN = 12;

const CardCarousel = ({
  cards = [],
  selectedCardId,
  onCardSelect,
  loading = false,
  showAnswers = false,
  disabled = false,
  style,
}) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_MARGIN * 2));
    setActiveIndex(index);
  };

  const scrollToCard = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: index * (CARD_WIDTH + CARD_MARGIN * 2),
        animated: true,
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.cardWrapper}>
              <CardSkeleton />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {cards.map((card) => (
          <View key={card.id} style={styles.cardWrapper}>
            <LearningCard
              id={card.id}
              imageUrl={card.imageUrl}
              imageDescription={card.imageDescription}
              emoji={card.emoji}
              sentence={card.sentence}
              translation={card.translation}
              selected={selectedCardId === card.id}
              isCorrect={card.isCorrect}
              showAnswer={showAnswers}
              disabled={disabled}
              onSelect={onCardSelect}
            />
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {cards.map((card, index) => (
          <View
            key={card.id}
            style={[
              styles.dot,
              activeIndex === index && styles.dotActive,
              selectedCardId === card.id && styles.dotSelected,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: (screenWidth - CARD_WIDTH) / 2,
    paddingVertical: spacing[4],
  },
  cardWrapper: {
    marginHorizontal: CARD_MARGIN,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[4],
    gap: spacing[2],
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.neutral[300],
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary[400],
  },
  dotSelected: {
    backgroundColor: colors.primary[500],
  },
});

export default CardCarousel;
