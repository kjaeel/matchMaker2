import React from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

// Icon component for CustomInput
const CustomInputIcon = ({ icon, ...props }) => (
  <TextInput.Icon icon={icon} {...props} />
);

export default function CustomInput({ 
  style, 
  size = 'medium',
  left,
  right,
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
      left={left}
      right={right}
      {...props}
    />
  );
}

// Attach Icon component to CustomInput
CustomInput.Icon = CustomInputIcon;

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  largeInput: {
    marginBottom: 24,
    fontSize: 18,
  },
  smallInput: {
    marginBottom: 8,
    fontSize: 14,
  },
  outline: {
    borderRadius: 12,
    borderWidth: 1.5,
  },
  content: {
    paddingVertical: 8,
    fontSize: 16,
  },
});

