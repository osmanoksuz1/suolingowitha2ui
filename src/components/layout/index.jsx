/**
 * Layout Components
 * Common layout wrappers
 */

import React from 'react';
import { View, StyleSheet, SafeAreaView as RNSafeAreaView } from 'react-native';
import { colors, spacing } from '../../styles';

// Safe Area wrapper
export const SafeArea = ({ children, style }) => (
  <RNSafeAreaView style={[styles.safeArea, style]}>
    {children}
  </RNSafeAreaView>
);

// Main container
export const Container = ({ 
  children, 
  centered = false, 
  padding = true,
  style,
}) => (
  <View style={[
    styles.container,
    centered && styles.centered,
    padding && styles.padding,
    style,
  ]}>
    {children}
  </View>
);

// Screen wrapper
export const Screen = ({ children, style }) => (
  <SafeArea style={style}>
    <Container style={styles.screen}>
      {children}
    </Container>
  </SafeArea>
);

// Header component
export const Header = ({ 
  children, 
  leftAction, 
  rightAction,
  style,
}) => (
  <View style={[styles.header, style]}>
    <View style={styles.headerLeft}>
      {leftAction}
    </View>
    <View style={styles.headerCenter}>
      {children}
    </View>
    <View style={styles.headerRight}>
      {rightAction}
    </View>
  </View>
);

// Footer component (fixed at bottom)
export const Footer = ({ children, style }) => (
  <View style={[styles.footer, style]}>
    {children}
  </View>
);

// Content area (scrollable)
export const Content = ({ children, style }) => (
  <View style={[styles.content, style]}>
    {children}
  </View>
);

// Spacer
export const Spacer = ({ size = 4 }) => (
  <View style={{ height: spacing[size], width: spacing[size] }} />
);

// Divider
export const Divider = ({ vertical = false, style }) => (
  <View style={[
    vertical ? styles.dividerVertical : styles.dividerHorizontal,
    style,
  ]} />
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  padding: {
    padding: spacing[4],
  },
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  footer: {
    padding: spacing[4],
    backgroundColor: colors.surface.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  content: {
    flex: 1,
  },
  dividerHorizontal: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing[3],
  },
  dividerVertical: {
    width: 1,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing[3],
  },
});
