import React from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export default function CustomInput({ 
  style, 
  size = 'medium',
  ...props 
}) {
  const inputStyle = [
    styles.input,
    size === 'large' && styles.largeInput,
    size === 'small' && styles.smallInput,
    style
  ];

  return (
    <TextInput
      mode="outlined"
      style={inputStyle}
      outlineStyle={styles.outline}
      contentStyle={styles.content}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
  },
  largeInput: {
    marginBottom: theme.spacing.lg,
    fontSize: theme.typography.fontSize.lg,
  },
  smallInput: {
    marginBottom: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
  },
  outline: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
  },
  content: {
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSize.base,
  },
});

