import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {Text, Surface, SegmentedButtons} from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {AuthContext} from '../context/AuthContext';
import {userAPI} from '../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, shadows } from '../styles/theme';


const {height} = Dimensions.get('window');

export default function RegisterScreen({navigation}) {
  const {register} = useContext(AuthContext);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    caste: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({...p, [k]: v}));

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

      // Prepare user data for API
      const userData = {
        fullName: form.fullName,
        email: form.email || null,
        phone: form.phone || null,
        gender: form.gender || null,
        dateOfBirth: form.dob || null,
        caste: form.caste || null,
        password: form.password,
      };

      // Call the API to create user
      const result = await userAPI.createUser(userData);

      if (result.success) {
        // Update local context with the created user
        const createdUser = {
          id: result.data.id || String(Date.now()),
          fullName: result.data.fullName || form.fullName,
          email: result.data.email || form.email,
          phone: result.data.phone || form.phone,
          gender: result.data.gender || form.gender,
          dob: result.data.dateOfBirth || form.dob,
          photoUri: result.data.photoUri || undefined,
          profile: result.data.profile || null,
          isProfileComplete: result.data.isProfileComplete || false,
        };

        // Update the context with the created user
        await register(createdUser);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (e) {
      setError(e?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}>
        <View style={styles.overlay} />
        <View style={styles.decorativeTop} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Surface style={styles.formContainer} elevation={0}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Icon name="account-heart" size={56} color={colors.white} />
              </View>
              <View style={styles.titleContainer}>
                <Text variant="headlineLarge" style={styles.title}>
                  Create Account
                </Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                  Join us to find your perfect life partner
                </Text>
              </View>
            </View>

            <View style={styles.form}>
              <CustomInput
                label="Full Name"
                value={form.fullName}
                onChangeText={v => set('fullName', v)}
                left={<CustomInput.Icon icon="account" />}
              />

              <CustomInput
                label="Email"
                value={form.email}
                onChangeText={v => set('email', v)}
                autoCapitalize="none"
                left={<CustomInput.Icon icon="email" />}
              />

              <CustomInput
                label="Phone"
                value={form.phone}
                onChangeText={v => set('phone', v)}
                keyboardType="phone-pad"
                left={<CustomInput.Icon icon="phone" />}
              />

              <View style={styles.genderContainer}>
                <Text variant="bodyMedium" style={styles.genderLabel}>
                  Gender
                </Text>
                <SegmentedButtons
                  value={form.gender}
                  onValueChange={v => set('gender', v)}
                  buttons={[
                    {value: 'Male', label: 'Male', icon: 'gender-male'},
                    {value: 'Female', label: 'Female', icon: 'gender-female'},
                  ]}
                  style={styles.segmentedButtons}
                />
              </View>

              <CustomInput
                label="Date of Birth (YYYY-MM-DD)"
                value={form.dob}
                onChangeText={v => set('dob', v)}
                left={<CustomInput.Icon icon="calendar" />}
              />

              <CustomInput
                label="Caste"
                value={form.caste}
                onChangeText={v => set('caste', v)}
                left={<CustomInput.Icon icon="account-group" />}
              />

              <CustomInput
                label="Password"
                value={form.password}
                onChangeText={v => set('password', v)}
                secureTextEntry
                left={<CustomInput.Icon icon="lock" />}
              />

              <CustomInput
                label="Confirm Password"
                value={form.confirmPassword}
                onChangeText={v => set('confirmPassword', v)}
                secureTextEntry
                left={<CustomInput.Icon icon="lock-check" />}
              />

              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={20} color={colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <CustomButton
                loading={submitting}
                onPress={onSubmit}
                size="large"
                style={styles.registerButton}>
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
                style={styles.loginButton}>
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
    backgroundColor: colors.primary + '40',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
  },
  formContainer: {
    backgroundColor: colors.surfaceGold,
    borderRadius: 0,
    padding: 32,
    borderWidth: 4,
    borderColor: colors.secondary,
    ...shadows.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: colors.secondary,
    ...shadows.lg,
  },
  titleContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 32,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 1.5 * 16,
    fontSize: 16,
    fontWeight: '500',
  },
  form: {
    gap: 16,
  },
  genderContainer: {
    marginBottom: 16,
  },
  genderLabel: {
    marginBottom: 8,
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  segmentedButtons: {
    backgroundColor: colors.surfaceGold,
    borderWidth: 2,
    borderColor: colors.secondary + '40',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '15',
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  errorText: {
    color: colors.error,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
    fontSize: 14,
  },
  registerButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 16,
    ...shadows.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[200],
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.text.secondary,
    fontWeight: '500',
    fontSize: 14,
  },
  loginButton: {
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 16,
  },
});
