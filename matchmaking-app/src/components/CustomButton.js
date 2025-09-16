import React from 'react';
import { Button } from 'react-native-paper';

export default function CustomButton({ style, ...props }) {
  return (
    <Button mode="contained" style={[{ marginVertical: 8, borderRadius: 8 }, style]} {...props} />
  );
}
