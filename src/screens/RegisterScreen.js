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
import { colors } from '../styles/theme';


const {height} = Dimensions.get('window');

export default function RegisterScreen({navigation}) {
  const {register} = useContext(AuthContext);
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
          <Surface style={styles.formContainer} elevation={8}>
            {/* Ornate Corner Decorations */}
            <View style={[styles.cornerOrnament, styles.topLeftCorner]} />
            <View style={[styles.cornerOrnament, styles.topRightCorner]} />
            <View style={[styles.cornerOrnament, styles.bottomLeftCorner]} />
            <View style={[styles.cornerOrnament, styles.bottomRightCorner]} />
            
            {/* Decorative Top Border */}
            <View style={styles.decorativeTopBorder}>
              <View style={styles.borderPattern} />
              <View style={styles.borderPattern} />
              <View style={styles.borderPattern} />
              <View style={styles.borderPattern} />
            </View>
            
            <View style={styles.decorativeBorder} />
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoOuterRing} />
                <View style={styles.logoMiddleRing} />
                <View style={styles.logoInner}>
                  <Icon name="account-heart" size={44} color={colors.white} />
                </View>
                <View style={styles.logoGlow} />
              </View>
              <View style={styles.titleContainer}>
                <View style={styles.titleUnderline} />
                <Text variant="headlineMedium" style={styles.title}>
                  Create Account
                </Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                  Join us to find your perfect life partner
                </Text>
                <View style={styles.titleUnderline} />
              </View>
            </View>
            
            {/* Decorative Bottom Border */}
            <View style={styles.decorativeBottomBorder}>
              <View style={styles.borderPattern} />
              <View style={styles.borderPattern} />
              <View style={styles.borderPattern} />
              <View style={styles.borderPattern} />
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
    backgroundColor: colors.primary + '90',
  },
  decorativeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: colors.secondary + '30',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
  },
  formContainer: {
    backgroundColor: colors.surfaceGold,
    borderRadius: 0,
    padding: 36,
    shadowColor: colors.maroon,
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 20,
    borderWidth: 6,
    borderColor: colors.secondary,
    position: 'relative',
    overflow: 'visible',
  },
  decorativeBorder: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    borderRadius: 0,
    borderWidth: 4,
    borderColor: colors.primary,
    borderStyle: 'solid',
  },
  decorativeTopBorder: {
    position: 'absolute',
    top: -6,
    left: 20,
    right: 20,
    height: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.primary,
    zIndex: 1,
  },
  decorativeBottomBorder: {
    position: 'absolute',
    bottom: -6,
    left: 20,
    right: 20,
    height: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.primary,
    zIndex: 1,
  },
  borderPattern: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.secondary,
  },
  cornerOrnament: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderWidth: 4,
    borderColor: colors.secondary,
    zIndex: 2,
  },
  topLeftCorner: {
    top: -6,
    left: -6,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRightCorner: {
    top: -6,
    right: -6,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeftCorner: {
    bottom: -6,
    left: -6,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRightCorner: {
    bottom: -6,
    right: -6,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    position: 'relative',
  },
  logoOuterRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: colors.secondary,
  },
  logoMiddleRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  logoInner: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: colors.secondary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    opacity: 0.25,
  },
  titleContainer: {
    alignItems: 'center',
    width: '100%',
  },
  titleUnderline: {
    width: 80,
    height: 4,
    backgroundColor: colors.secondary,
    marginVertical: 6,
    borderRadius: 2,
  },
  title: {
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 28,
    letterSpacing: 1,
    textShadowColor: colors.secondary + '50',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 1.6 * 16,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
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
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.gray[300],
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.text.secondary,
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    borderColor: colors.secondary,
    borderWidth: 3,
    borderRadius: 25,
  },
});
