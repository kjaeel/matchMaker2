import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';

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
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fullWidth: {
    width: '100%',
  },
  largeButton: {
    paddingVertical: 16,
    borderRadius: 16,
  },
  smallButton: {
    paddingVertical: 4,
    borderRadius: 8,
  },
  content: {
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  largeLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  smallLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  outlinedLabel: {
    color: '#FF6B6B',
  },
  textLabel: {
    color: '#FF6B6B',
  },
});

