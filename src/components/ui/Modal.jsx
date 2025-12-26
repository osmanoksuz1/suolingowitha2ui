/**
 * A2UI Modal Component
 * Overlay modal with animations
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal as RNModal } from 'react-native';
import { colors, spacing, borderRadius, textStyles, zIndex } from '../../styles';
import Button from './Button';

const Modal = ({
  visible = false,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  footer,
  style,
  ...props
}) => {
  const sizeStyle = getSizeStyle(size);

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...props}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Pressable
          style={styles.backdrop}
          onPress={closeOnBackdrop ? onClose : undefined}
        />
        
        {/* Modal Content */}
        <View style={[styles.modal, sizeStyle, style]}>
          {/* Header */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && (
                <Text style={styles.title}>{title}</Text>
              )}
              {showCloseButton && (
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeIcon}>✕</Text>
                </Pressable>
              )}
            </View>
          )}
          
          {/* Body */}
          <View style={styles.body}>
            {children}
          </View>
          
          {/* Footer */}
          {footer && (
            <View style={styles.footer}>
              {footer}
            </View>
          )}
        </View>
      </View>
    </RNModal>
  );
};

const getSizeStyle = (size) => {
  switch (size) {
    case 'sm':
      return { maxWidth: 320, width: '90%' };
    case 'lg':
      return { maxWidth: 640, width: '95%' };
    case 'xl':
      return { maxWidth: 800, width: '95%' };
    case 'full':
      return { maxWidth: '100%', width: '100%', height: '100%', borderRadius: 0 };
    case 'md':
    default:
      return { maxWidth: 480, width: '92%' };
  }
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  modal: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius['2xl'],
    maxHeight: '90%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontSize: textStyles.h4.fontSize,
    fontWeight: textStyles.h4.fontWeight,
    color: colors.text.primary,
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing[3],
  },
  closeIcon: {
    fontSize: 18,
    color: colors.text.secondary,
  },
  body: {
    padding: spacing[5],
  },
  footer: {
    padding: spacing[5],
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3],
  },
});

// Alert Dialog variant
export const AlertDialog = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Tamam',
  cancelText = 'İptal',
  variant = 'default',
  showCancel = true,
}) => {
  const confirmVariant = {
    default: 'primary',
    success: 'success',
    warning: 'warning',
    error: 'error',
  }[variant];

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={false}
      closeOnBackdrop={false}
      footer={
        <View style={alertStyles.footer}>
          {showCancel && (
            <Button variant="ghost" onPress={onClose}>
              {cancelText}
            </Button>
          )}
          <Button variant={confirmVariant} onPress={onConfirm}>
            {confirmText}
          </Button>
        </View>
      }
    >
      <Text style={alertStyles.message}>{message}</Text>
    </Modal>
  );
};

const alertStyles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  message: {
    fontSize: textStyles.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default Modal;
