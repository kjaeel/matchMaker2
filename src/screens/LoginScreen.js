import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../styles/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { height } = Dimensions.get('window');

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
                  name="heart" 
                  size={48} 
                  color={theme.colors.primary} 
                />
              </View>
              <Text variant="headlineMedium" style={styles.title}>
                Welcome Back
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                Sign in to find your perfect match
              </Text>
            </View>

            <View style={styles.form}>
              <CustomInput 
                label="Email or Phone" 
                value={identifier} 
                onChangeText={setIdentifier} 
                autoCapitalize="none"
                left={<CustomInput.Icon icon="email" />}
              />
              <CustomInput 
                label="Password" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry
                left={<CustomInput.Icon icon="lock" />}
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
                onPress={onSubmit} 
                loading={submitting}
                size="large"
                style={styles.loginButton}
              >
                Sign In
              </CustomButton>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <CustomButton 
                mode="outlined" 
                onPress={() => navigation.navigate('Register')}
                style={styles.registerButton}
              >
                Create New Account
              </CustomButton>

              <CustomButton 
                mode="text" 
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotButton}
              >
                Forgot Password?
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
    justifyContent: 'center',
    padding: theme.spacing.lg,
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
  loginButton: {
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
  registerButton: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  forgotButton: {
    marginTop: theme.spacing.sm,
  },
});

