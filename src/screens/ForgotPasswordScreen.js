import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Snackbar, Surface } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ForgotPasswordScreen() {
  const [identifier, setIdentifier] = useState('');
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Surface style={styles.card} elevation={8}>
        <View style={styles.iconContainer}>
          <Icon name="lock-reset" size={64} color="#8B0000" />
        </View>
        <Text variant="headlineMedium" style={styles.title}>
          Forgot Password
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Enter your email or phone to receive a reset link
        </Text>
        <CustomInput 
          label="Email or Phone" 
          value={identifier} 
          onChangeText={setIdentifier}
          left={<CustomInput.Icon icon="email" />}
        />
        <CustomButton 
          onPress={() => setVisible(true)}
          style={styles.button}
        >
          Send Reset Link
        </CustomButton>
      </Surface>
      <Snackbar 
        visible={visible} 
        onDismiss={() => setVisible(false)} 
        duration={2000}
        style={styles.snackbar}
      >
        If this were connected, a reset link would be sent.
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
  },
  card: {
    padding: 32,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
    color: '#8B0000',
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 28,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#6C757D',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#8B0000',
  },
  snackbar: {
    backgroundColor: '#8B0000',
  },
});

