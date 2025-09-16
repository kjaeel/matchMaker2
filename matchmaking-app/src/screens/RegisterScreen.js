import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { HelperText, Text } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async () => {
    setError('');
    if (!form.fullName || (!form.email && !form.phone)) {
      setError('Full name and email or phone are required');
      return;
    }
    if (form.password.length < 4 || form.password !== form.confirmPassword) {
      setError('Passwords must match and be at least 4 chars');
      return;
    }
    try {
      setSubmitting(true);
      await register(form);
    } catch (e) {
      setError(e?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineSmall" style={{ marginBottom: 16 }}>Create your account</Text>
      <CustomInput label="Full Name" value={form.fullName} onChangeText={(v) => set('fullName', v)} />
      <CustomInput label="Email" value={form.email} onChangeText={(v) => set('email', v)} autoCapitalize="none" />
      <CustomInput label="Phone" value={form.phone} onChangeText={(v) => set('phone', v)} keyboardType="phone-pad" />
      <CustomInput label="Gender" value={form.gender} onChangeText={(v) => set('gender', v)} />
      <CustomInput label="Date of Birth (YYYY-MM-DD)" value={form.dob} onChangeText={(v) => set('dob', v)} />
      <CustomInput label="Password" value={form.password} onChangeText={(v) => set('password', v)} secureTextEntry />
      <CustomInput label="Confirm Password" value={form.confirmPassword} onChangeText={(v) => set('confirmPassword', v)} secureTextEntry />
      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}
      <CustomButton loading={submitting} onPress={onSubmit}>Register</CustomButton>
    </View>
  );
}
