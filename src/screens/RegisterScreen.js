import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { HelperText, Text, Surface, SegmentedButtons } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../styles/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
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
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.overlay} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Surface style={styles.formContainer} elevation={8}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <MaterialCommunityIcons 
                  name="account-plus" 
                  size={48} 
                  color={theme.colors.primary} 
                />
              </View>
              <Text variant="headlineMedium" style={styles.title}>
                Create Account
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                Join us to find your perfect match
              </Text>
            </View>

            <View style={styles.form}>
              <CustomInput 
                label="Full Name" 
                value={form.fullName} 
                onChangeText={(v) => set('fullName', v)}
                left={<CustomInput.Icon icon="account" />}
              />
              
              <CustomInput 
                label="Email" 
                value={form.email} 
                onChangeText={(v) => set('email', v)} 
                autoCapitalize="none"
                left={<CustomInput.Icon icon="email" />}
              />
              
              <CustomInput 
                label="Phone" 
                value={form.phone} 
                onChangeText={(v) => set('phone', v)} 
                keyboardType="phone-pad"
                left={<CustomInput.Icon icon="phone" />}
              />

              <View style={styles.genderContainer}>
                <Text variant="bodyMedium" style={styles.genderLabel}>Gender</Text>
                <SegmentedButtons
                  value={form.gender}
                  onValueChange={(v) => set('gender', v)}
                  buttons={[
                    { value: 'Male', label: 'Male', icon: 'gender-male' },
                    { value: 'Female', label: 'Female', icon: 'gender-female' },
                  ]}
                  style={styles.segmentedButtons}
                />
              </View>
              
              <CustomInput 
                label="Date of Birth (YYYY-MM-DD)" 
                value={form.dob} 
                onChangeText={(v) => set('dob', v)}
                left={<CustomInput.Icon icon="calendar" />}
              />
              
              <CustomInput 
                label="Password" 
                value={form.password} 
                onChangeText={(v) => set('password', v)} 
                secureTextEntry
                left={<CustomInput.Icon icon="lock" />}
              />
              
              <CustomInput 
                label="Confirm Password" 
                value={form.confirmPassword} 
                onChangeText={(v) => set('confirmPassword', v)} 
                secureTextEntry
                left={<CustomInput.Icon icon="lock-check" />}
              />
              
              {error ? (
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons 
                    name="alert-circle" 
                    size={20} 
                    color={theme.colors.error} 
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <CustomButton 
                loading={submitting} 
                onPress={onSubmit}
                size="large"
                style={styles.registerButton}
              >
                Create Account
              </CustomButton>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <CustomButton 
                mode="outlined" 
                onPress={() => navigation.navigate('Login')}
                style={styles.loginButton}
              >
                Already have an account? Sign In
              </CustomButton>
            </View>
          </Surface>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: height,
  },
  backgroundImageStyle: {
    opacity: 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing['2xl'],
  },
  formContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius['2xl'],
    padding: theme.spacing['2xl'],
    ...theme.shadows.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  title: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.lg,
  },
  form: {
    gap: theme.spacing.md,
  },
  genderContainer: {
    marginBottom: theme.spacing.md,
  },
  genderLabel: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  segmentedButtons: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorContainer || '#FFEBEE',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
    flex: 1,
    fontWeight: theme.typography.fontWeight.medium,
  },
  registerButton: {
    marginTop: theme.spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gray[300],
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  loginButton: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
});

