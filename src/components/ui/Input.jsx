/**
 * A2UI Input Component
 * Text input with various states and styles
 */

import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, textStyles, touchTargets } from '../../styles';

const Input = ({
  value,
  onChangeText,
  placeholder,
  label,
  helperText,
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'outlined',
  style,
  inputStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const containerStyles = getContainerStyles(variant, isFocused, error, disabled);
  const sizeStyles = getSizeStyles(size, multiline, numberOfLines);

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label}
        </Text>
      )}
      
      <View style={[styles.container, containerStyles, sizeStyles.container]}>
        {leftIcon && (
          <View style={styles.iconLeft}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            sizeStyles.input,
            multiline && styles.multilineInput,
            disabled && styles.disabledInput,
            inputStyle,
          ]}
          {...props}
        />
        
        {rightIcon && (
          <View style={styles.iconRight}>
            {rightIcon}
          </View>
        )}
        
        {maxLength && (
          <Text style={styles.charCount}>
            {value?.length || 0}/{maxLength}
          </Text>
        )}
      </View>
      
      {(helperText || error) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const getContainerStyles = (variant, isFocused, error, disabled) => {
  const baseStyle = {
    borderRadius: borderRadius.lg,
    backgroundColor: disabled ? colors.neutral[100] : colors.surface.primary,
  };

  if (disabled) {
    return {
      ...baseStyle,
      borderColor: colors.border.light,
      opacity: 0.6,
    };
  }

  const borderColor = error 
    ? colors.error[500] 
    : isFocused 
      ? colors.primary[500] 
      : colors.border.light;

  switch (variant) {
    case 'filled':
      return {
        ...baseStyle,
        backgroundColor: colors.background.secondary,
        borderWidth: 0,
        borderBottomWidth: 2,
        borderColor,
        borderRadius: 0,
        borderTopLeftRadius: borderRadius.md,
        borderTopRightRadius: borderRadius.md,
      };
    case 'underline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderBottomWidth: 2,
        borderColor,
        borderRadius: 0,
      };
    case 'outlined':
    default:
      return {
        ...baseStyle,
        borderWidth: 2,
        borderColor,
      };
  }
};

const getSizeStyles = (size, multiline, numberOfLines) => {
  const baseHeight = multiline ? numberOfLines * 24 + 32 : touchTargets.md;
  
  switch (size) {
    case 'sm':
      return {
        container: {
          minHeight: multiline ? numberOfLines * 20 + 24 : touchTargets.sm,
        },
        input: {
          fontSize: textStyles.bodySmall.fontSize,
          padding: spacing[2],
        },
      };
    case 'lg':
      return {
        container: {
          minHeight: multiline ? numberOfLines * 28 + 40 : touchTargets.lg,
        },
        input: {
          fontSize: textStyles.bodyLarge.fontSize,
          padding: spacing[5],
        },
      };
    case 'md':
    default:
      return {
        container: {
          minHeight: baseHeight,
        },
        input: {
          fontSize: textStyles.input.fontSize,
          padding: spacing[4],
        },
      };
  }
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: textStyles.label.fontSize,
    fontWeight: textStyles.label.fontWeight,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  labelError: {
    color: colors.error[500],
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    color: colors.text.primary,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  disabledInput: {
    color: colors.text.disabled,
  },
  iconLeft: {
    paddingLeft: spacing[3],
    paddingRight: spacing[1],
  },
  iconRight: {
    paddingRight: spacing[3],
    paddingLeft: spacing[1],
  },
  charCount: {
    fontSize: textStyles.caption.fontSize,
    color: colors.text.tertiary,
    paddingRight: spacing[3],
  },
  helperText: {
    fontSize: textStyles.caption.fontSize,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  errorText: {
    color: colors.error[500],
  },
});

export default Input;
