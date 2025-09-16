import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Snackbar } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function ForgotPasswordScreen() {
  const [identifier, setIdentifier] = useState('');
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineSmall" style={{ marginBottom: 16 }}>Forgot Password</Text>
      <CustomInput label="Email or Phone" value={identifier} onChangeText={setIdentifier} />
      <CustomButton onPress={() => setVisible(true)}>Send Reset Link</CustomButton>
      <Snackbar visible={visible} onDismiss={() => setVisible(false)} duration={2000}>
        If this were connected, a reset link would be sent.
      </Snackbar>
    </View>
  );
}
