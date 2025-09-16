import React from 'react';
import { TextInput } from 'react-native-paper';

export default function CustomInput(props) {
  return (
    <TextInput
      mode="outlined"
      style={{ marginBottom: 12 }}
      {...props}
    />
  );
}
