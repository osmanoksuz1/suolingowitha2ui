/**
 * A2UI Skeleton Loading Component
 * Placeholder for loading states
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '../../styles';

const Skeleton = ({
  width = '100%',
  height = 20,
  variant = 'rectangular',
  animation = 'pulse',
  style,
  ...props
}) => {
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (animation === 'pulse') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0.3,
            duration: 750,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [animation, animatedValue]);

  const variantStyle = getVariantStyle(variant, height);

  return (
    <Animated.View
      style={[
        styles.base,
        variantStyle,
        { width, height, opacity: animation === 'pulse' ? animatedValue : 1 },
        style,
      ]}
      {...props}
    />
  );
};

const getVariantStyle = (variant, height) => {
  switch (variant) {
    case 'circular':
      return {
        borderRadius: typeof height === 'number' ? height / 2 : 100,
      };
    case 'rounded':
      return {
        borderRadius: borderRadius.lg,
      };
    case 'text':
      return {
        borderRadius: borderRadius.sm,
      };
    case 'rectangular':
    default:
      return {
        borderRadius: borderRadius.md,
      };
  }
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.neutral[200],
  },
});

// Card skeleton preset
export const CardSkeleton = ({ style }) => (
  <View style={[cardStyles.container, style]}>
    <Skeleton 
      variant="rectangular" 
      height={180} 
      style={cardStyles.image} 
    />
    <View style={cardStyles.content}>
      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton variant="text" width="60%" height={16} style={cardStyles.subtitle} />
    </View>
  </View>
);

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    borderRadius: 0,
  },
  content: {
    padding: spacing[4],
  },
  subtitle: {
    marginTop: spacing[2],
  },
});

// Grid skeleton preset
export const GridSkeleton = ({ count = 4, columns = 2, style }) => (
  <View style={[gridStyles.container, style]}>
    {Array.from({ length: count }, (_, i) => (
      <View key={i} style={[gridStyles.item, { width: `${(100 / columns) - 4}%` }]}>
        <Skeleton variant="rounded" height={120} />
      </View>
    ))}
  </View>
);

const gridStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    marginBottom: spacing[3],
  },
});

export default Skeleton;
