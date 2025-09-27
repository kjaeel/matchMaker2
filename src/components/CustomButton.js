import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export default function CustomButton({ 
  style, 
  mode = 'contained', 
  size = 'medium',
  fullWidth = true,
  ...props 
}) {
  const buttonStyle = [
    styles.button,
    fullWidth && styles.fullWidth,
    size === 'large' && styles.largeButton,
    size === 'small' && styles.smallButton,
    style
  ];

  return (
    <Button 
      mode={mode}
      style={buttonStyle}
      labelStyle={[
        styles.label,
        size === 'large' && styles.largeLabel,
        size === 'small' && styles.smallLabel,
        mode === 'outlined' && styles.outlinedLabel,
        mode === 'text' && styles.textLabel,
      ]}
      contentStyle={styles.content}
      {...props} 
    />
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  fullWidth: {
    width: '100%',
  },
  largeButton: {
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
  },
  smallButton: {
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  content: {
    paddingVertical: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: 0.5,
  },
  largeLabel: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  smallLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  outlinedLabel: {
    color: theme.colors.primary,
  },
  textLabel: {
    color: theme.colors.primary,
  },
});

