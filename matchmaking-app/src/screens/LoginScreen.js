import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setError('');
    try {
      setSubmitting(true);
      await login(identifier.trim(), password);
    } catch (e) {
      setError(e?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text variant="headlineSmall" style={{ marginBottom: 16 }}>Welcome back</Text>
      <CustomInput label="Email or Phone" value={identifier} onChangeText={setIdentifier} autoCapitalize="none" />
      <CustomInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
      <CustomButton onPress={onSubmit} loading={submitting}>Login</CustomButton>
      <CustomButton mode="outlined" onPress={() => navigation.navigate('Register')}>Create an account</CustomButton>
      <CustomButton mode="text" onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password?</CustomButton>
    </View>
  );
}
