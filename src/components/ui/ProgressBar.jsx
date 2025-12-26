/**
 * A2UI ProgressBar Component
 * Visual progress indicator with labels
 */

import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius, textStyles } from '../../styles';

const ProgressBar = ({
  progress = 0,
  total = 100,
  showLabel = true,
  labelPosition = 'right',
  variant = 'default',
  size = 'md',
  color,
  style,
  ...props
}) => {
  const percentage = Math.min(Math.max((progress / total) * 100, 0), 100);
  const barColor = color || getVariantColor(variant);
  const sizeStyles = getSizeStyles(size);

  return (
    <View style={[styles.container, style]} {...props}>
      {showLabel && labelPosition === 'top' && (
        <View style={styles.labelTop}>
          <Text style={styles.labelText}>{progress} / {total}</Text>
          <Text style={styles.percentText}>{Math.round(percentage)}%</Text>
        </View>
      )}
      
      <View style={styles.row}>
        <View style={[styles.track, sizeStyles.track]}>
          <View
            style={[
              styles.fill,
              sizeStyles.track,
              { 
                backgroundColor: barColor,
                width: `${percentage}%`,
              },
            ]}
          />
        </View>
        
        {showLabel && labelPosition === 'right' && (
          <Text style={[styles.labelRight, sizeStyles.label]}>
            {progress}/{total}
          </Text>
        )}
      </View>
      
      {showLabel && labelPosition === 'bottom' && (
        <View style={styles.labelBottom}>
          <Text style={styles.labelText}>İlerleme</Text>
          <Text style={styles.percentText}>{Math.round(percentage)}%</Text>
        </View>
      )}
    </View>
  );
};

const getVariantColor = (variant) => {
  switch (variant) {
    case 'success':
      return colors.success[500];
    case 'warning':
      return colors.warning[500];
    case 'error':
      return colors.error[500];
    case 'secondary':
      return colors.secondary[500];
    case 'default':
    default:
      return colors.primary[500];
  }
};

const getSizeStyles = (size) => {
  switch (size) {
    case 'xs':
      return {
        track: { height: 4, borderRadius: 2 },
        label: { fontSize: textStyles.caption.fontSize, marginLeft: spacing[2] },
      };
    case 'sm':
      return {
        track: { height: 6, borderRadius: 3 },
        label: { fontSize: textStyles.caption.fontSize, marginLeft: spacing[2] },
      };
    case 'lg':
      return {
        track: { height: 12, borderRadius: 6 },
        label: { fontSize: textStyles.body.fontSize, marginLeft: spacing[3] },
      };
    case 'xl':
      return {
        track: { height: 16, borderRadius: 8 },
        label: { fontSize: textStyles.bodyLarge.fontSize, marginLeft: spacing[4] },
      };
    case 'md':
    default:
      return {
        track: { height: 8, borderRadius: 4 },
        label: { fontSize: textStyles.bodySmall.fontSize, marginLeft: spacing[3] },
      };
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    backgroundColor: colors.neutral[200],
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  labelTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  labelBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing[2],
  },
  labelRight: {
    color: colors.text.secondary,
  },
  labelText: {
    fontSize: textStyles.bodySmall.fontSize,
    color: colors.text.secondary,
  },
  percentText: {
    fontSize: textStyles.bodySmall.fontSize,
    color: colors.text.primary,
    fontWeight: '600',
  },
});

// Stepper variant for stage progress
export const StepProgress = ({ 
  currentStep = 1, 
  totalSteps = 4, 
  labels = [],
  style,
}) => {
  return (
    <View style={[stepStyles.container, style]}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <React.Fragment key={index}>
            <View style={stepStyles.stepWrapper}>
              <View
                style={[
                  stepStyles.step,
                  isCompleted && stepStyles.stepCompleted,
                  isCurrent && stepStyles.stepCurrent,
                ]}
              >
                <Text style={[
                  stepStyles.stepText,
                  (isCompleted || isCurrent) && stepStyles.stepTextActive,
                ]}>
                  {isCompleted ? '✓' : stepNumber}
                </Text>
              </View>
              {labels[index] && (
                <Text style={[
                  stepStyles.label,
                  isCurrent && stepStyles.labelActive,
                ]}>
                  {labels[index]}
                </Text>
              )}
            </View>
            
            {index < totalSteps - 1 && (
              <View style={[
                stepStyles.connector,
                isCompleted && stepStyles.connectorCompleted,
              ]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const stepStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  stepWrapper: {
    alignItems: 'center',
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[300],
  },
  stepCompleted: {
    backgroundColor: colors.success[500],
  },
  stepCurrent: {
    backgroundColor: colors.primary[500],
  },
  stepText: {
    fontSize: textStyles.buttonSmall.fontSize,
    fontWeight: textStyles.buttonSmall.fontWeight,
    color: colors.text.secondary,
  },
  stepTextActive: {
    color: colors.text.inverse,
  },
  label: {
    fontSize: textStyles.caption.fontSize,
    color: colors.text.tertiary,
    marginTop: spacing[1],
    textAlign: 'center',
    maxWidth: 80,
  },
  labelActive: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  connector: {
    height: 2,
    width: 40,
    backgroundColor: colors.neutral[300],
    marginTop: 15,
    marginHorizontal: spacing[1],
  },
  connectorCompleted: {
    backgroundColor: colors.success[500],
  },
});

export default ProgressBar;
