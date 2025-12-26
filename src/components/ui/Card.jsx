/**
 * A2UI Card Component
 * Flexible card container with selection state support
 */

import React from 'react';
import { Pressable, View, StyleSheet, Image } from 'react-native';
import { colors, spacing, borderRadius } from '../../styles';

const Card = ({
  children,
  variant = 'elevated',
  selected = false,
  selectable = false,
  onPress,
  disabled = false,
  padding = 'md',
  style,
  contentStyle,
  ...props
}) => {
  const cardStyles = getCardStyles(variant, selected, disabled);
  const paddingStyle = getPaddingStyle(padding);
  
  const Wrapper = selectable || onPress ? Pressable : View;
  
  const wrapperProps = (selectable || onPress) ? {
    onPress: disabled ? undefined : onPress,
    style: ({ pressed }) => [
      styles.base,
      cardStyles,
      pressed && !disabled && styles.pressed,
      style,
    ],
  } : {
    style: [styles.base, cardStyles, style],
  };

  return (
    <Wrapper {...wrapperProps} {...props}>
      <View style={[paddingStyle, contentStyle]}>
        {children}
      </View>
    </Wrapper>
  );
};

const getCardStyles = (variant, selected, disabled) => {
  const baseStyle = {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: selected ? colors.primary[500] : 'transparent',
  };

  if (disabled) {
    return {
      ...baseStyle,
      backgroundColor: colors.neutral[100],
      opacity: 0.6,
    };
  }

  switch (variant) {
    case 'outlined':
      return {
        ...baseStyle,
        backgroundColor: colors.surface.primary,
        borderColor: selected ? colors.primary[500] : colors.border.light,
      };
    case 'filled':
      return {
        ...baseStyle,
        backgroundColor: colors.background.secondary,
      };
    case 'flat':
      return {
        ...baseStyle,
        backgroundColor: colors.surface.primary,
        borderRadius: 0,
      };
    case 'elevated':
    default:
      return {
        ...baseStyle,
        backgroundColor: colors.surface.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      };
  }
};

const getPaddingStyle = (padding) => {
  switch (padding) {
    case 'none':
      return { padding: 0 };
    case 'sm':
      return { padding: spacing[3] };
    case 'lg':
      return { padding: spacing[6] };
    case 'xl':
      return { padding: spacing[8] };
    case 'md':
    default:
      return { padding: spacing[4] };
  }
};

const styles = StyleSheet.create({
  base: {
    // Base styles
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});

// Sub-components
Card.Header = ({ children, style }) => (
  <View style={[cardSubStyles.header, style]}>{children}</View>
);

Card.Body = ({ children, style }) => (
  <View style={[cardSubStyles.body, style]}>{children}</View>
);

Card.Footer = ({ children, style }) => (
  <View style={[cardSubStyles.footer, style]}>{children}</View>
);

Card.Image = ({ source, style, aspectRatio = 16/9 }) => (
  <View style={[cardSubStyles.imageContainer, { aspectRatio }, style]}>
    <Image 
      source={typeof source === 'string' ? { uri: source } : source}
      style={cardSubStyles.image}
      resizeMode="cover"
    />
  </View>
);

const cardSubStyles = StyleSheet.create({
  header: {
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    marginBottom: spacing[3],
  },
  body: {
    flex: 1,
  },
  footer: {
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    marginTop: spacing[3],
  },
  imageContainer: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.neutral[100],
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default Card;
