import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {Text, Surface} from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {AuthContext} from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {height} = Dimensions.get('window');

export default function LoginScreen({navigation}) {
  const {login} = useContext(AuthContext);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter both email/phone and password');
      return;
    }

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
        source={{
          uri: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}>
        <View style={styles.overlay} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Surface style={styles.formContainer} elevation={8}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Icon name="heart" size={48} color="#FF6B6B" />
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
                  <Icon name="alert-circle" size={20} color="#DC3545" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <CustomButton
                onPress={onSubmit}
                loading={submitting}
                size="large"
                style={styles.loginButton}>
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
                style={styles.registerButton}>
                Create New Account
              </CustomButton>

              <CustomButton
                mode="text"
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotButton}>
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
    padding: 24,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 48,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF8E8E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 1.6 * 18,
  },
  form: {
    gap: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  errorText: {
    color: '#DC3545',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#CED4DA',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  registerButton: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  forgotButton: {
    marginTop: 8,
  },
});
