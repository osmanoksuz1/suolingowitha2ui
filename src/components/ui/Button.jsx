/**
 * A2UI Button Component
 * Versatile button with multiple variants and sizes
 */

import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, spacing, borderRadius, textStyles, touchTargets } from '../../styles';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) => {
  const buttonStyles = getButtonStyles(variant, size, disabled, fullWidth);
  const textColor = getTextColor(variant, disabled);

  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        buttonStyles,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'secondary' ? colors.text.inverse : colors.primary[500]} 
        />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[styles.text, { color: textColor }, getSizeTextStyle(size), textStyle]}>
            {children}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </Pressable>
  );
};

const getButtonStyles = (variant, size, disabled, fullWidth) => {
  const baseSize = getSizeStyles(size);
  const variantStyle = getVariantStyles(variant, disabled);
  
  return {
    ...baseSize,
    ...variantStyle,
    ...(fullWidth && { width: '100%' }),
    ...(disabled && { opacity: 0.5 }),
  };
};

const getSizeStyles = (size) => {
  switch (size) {
    case 'sm':
      return {
        height: touchTargets.sm,
        paddingHorizontal: spacing[3],
        borderRadius: borderRadius.md,
      };
    case 'lg':
      return {
        height: touchTargets.lg,
        paddingHorizontal: spacing[8],
        borderRadius: borderRadius.xl,
      };
    case 'xl':
      return {
        height: touchTargets.xl,
        paddingHorizontal: spacing[10],
        borderRadius: borderRadius.xl,
      };
    case 'md':
    default:
      return {
        height: touchTargets.md,
        paddingHorizontal: spacing[6],
        borderRadius: borderRadius.lg,
      };
  }
};

const getSizeTextStyle = (size) => {
  switch (size) {
    case 'sm':
      return textStyles.buttonSmall;
    case 'lg':
    case 'xl':
      return { ...textStyles.button, fontSize: 18 };
    case 'md':
    default:
      return textStyles.button;
  }
};

const getVariantStyles = (variant, disabled) => {
  if (disabled) {
    return {
      backgroundColor: colors.neutral[200],
      borderWidth: 0,
    };
  }

  switch (variant) {
    case 'secondary':
      return {
        backgroundColor: colors.secondary[500],
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary[500],
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        borderWidth: 0,
      };
    case 'success':
      return {
        backgroundColor: colors.success[500],
      };
    case 'error':
      return {
        backgroundColor: colors.error[500],
      };
    case 'primary':
    default:
      return {
        backgroundColor: colors.primary[500],
      };
  }
};

const getTextColor = (variant, disabled) => {
  if (disabled) return colors.text.disabled;
  
  switch (variant) {
    case 'outline':
    case 'ghost':
      return colors.primary[500];
    case 'primary':
    case 'secondary':
    case 'success':
    case 'error':
    default:
      return colors.text.inverse;
  }
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: spacing[2],
  },
  iconRight: {
    marginLeft: spacing[2],
  },
});

export default Button;
