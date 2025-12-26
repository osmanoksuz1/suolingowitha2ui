/**
 * FeedbackOverlay Component
 * Animated feedback for correct/incorrect answers
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Animated } from 'react-native';
import { colors, spacing, textStyles, zIndex } from '../../styles';

const FeedbackOverlay = ({
  visible = false,
  type = 'success', // success, error, info
  message,
  duration = 2000,
  onComplete,
}) => {
  useEffect(() => {
    if (visible && onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onComplete]);

  const config = getFeedbackConfig(type);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={[styles.overlay, { backgroundColor: config.overlayColor }]}>
        <View style={styles.content}>
          {/* Icon Circle */}
          <View style={[styles.iconCircle, { backgroundColor: config.backgroundColor }]}>
            <Text style={styles.icon}>{config.icon}</Text>
          </View>

          {/* Message */}
          {message && (
            <Text style={[styles.message, { color: config.textColor }]}>
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const getFeedbackConfig = (type) => {
  switch (type) {
    case 'error':
      return {
        icon: '✗',
        backgroundColor: colors.error[500],
        overlayColor: 'rgba(239, 68, 68, 0.15)',
        textColor: colors.error[700],
      };
    case 'info':
      return {
        icon: 'ℹ',
        backgroundColor: colors.primary[500],
        overlayColor: 'rgba(99, 102, 241, 0.15)',
        textColor: colors.primary[700],
      };
    case 'success':
    default:
      return {
        icon: '✓',
        backgroundColor: colors.success[500],
        overlayColor: 'rgba(16, 185, 129, 0.15)',
        textColor: colors.success[700],
      };
  }
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: {
    fontSize: 64,
    color: colors.text.inverse,
    fontWeight: 'bold',
  },
  message: {
    fontSize: textStyles.h3.fontSize,
    fontWeight: textStyles.h3.fontWeight,
    marginTop: spacing[6],
    textAlign: 'center',
    paddingHorizontal: spacing[6],
  },
});

// Toast notification variant
export const Toast = ({
  visible,
  type = 'info',
  message,
  duration = 3000,
  onClose,
  position = 'bottom',
}) => {
  useEffect(() => {
    if (visible && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const config = getFeedbackConfig(type);

  if (!visible) return null;

  return (
    <View style={[
      toastStyles.container,
      position === 'top' ? toastStyles.top : toastStyles.bottom,
    ]}>
      <View style={[toastStyles.toast, { borderLeftColor: config.backgroundColor }]}>
        <Text style={toastStyles.icon}>{config.icon}</Text>
        <Text style={toastStyles.message}>{message}</Text>
      </View>
    </View>
  );
};

const toastStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing[4],
    right: spacing[4],
    alignItems: 'center',
    zIndex: zIndex.toast,
  },
  top: {
    top: spacing[8],
  },
  bottom: {
    bottom: spacing[8],
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.primary,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    maxWidth: 400,
  },
  icon: {
    fontSize: 20,
    marginRight: spacing[3],
  },
  message: {
    fontSize: textStyles.body.fontSize,
    color: colors.text.primary,
    flex: 1,
  },
});

export default FeedbackOverlay;
