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
import LinearGradient from 'react-native-linear-gradient';

const {height, width} = Dimensions.get('window');

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
      <LinearGradient
        colors={['#8B0000', '#DC143C', '#FF6347', '#FFD700']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1606800053802-afa47e2f990d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
          }}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}>
          <View style={styles.overlay} />
          
          {/* Decorative top pattern */}
          <View style={styles.topPattern}>
            <View style={styles.patternCircle} />
            <View style={[styles.patternCircle, styles.patternCircleRight]} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <Surface style={styles.formContainer} elevation={8}>
              {/* Decorative border */}
              <View style={styles.decorativeBorder}>
                <View style={styles.borderPattern} />
              </View>
              
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={['#FFD700', '#FFA500', '#FF6347']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={styles.logoGradient}>
                    <Icon name="heart" size={52} color="#8B0000" />
                  </LinearGradient>
                  <View style={styles.logoGlow} />
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
                <Text style={styles.buttonText}>Sign In</Text>
              </CustomButton>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerCircle}>
                  <Icon name="flower" size={16} color="#8B0000" />
                </View>
                <View style={styles.dividerLine} />
              </View>

              <CustomButton
                mode="outlined"
                onPress={() => navigation.navigate('Register')}
                style={styles.registerButton}>
                <Text style={styles.outlinedButtonText}>Create Account</Text>
              </CustomButton>

              <CustomButton
                mode="text"
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotButton}>
                <Text style={styles.forgotButtonText}>Forgot Password?</Text>
              </CustomButton>
            </View>
            
            {/* Decorative bottom pattern */}
            <View style={styles.bottomPattern}>
              <Icon name="flower-outline" size={20} color="#FFD700" style={styles.bottomIcon} />
              <Icon name="flower-outline" size={16} color="#FF6347" style={styles.bottomIcon} />
              <Icon name="flower-outline" size={20} color="#FFD700" style={styles.bottomIcon} />
            </View>
          </Surface>
        </ScrollView>
        
        {/* Decorative bottom pattern */}
        <View style={styles.bottomPatternOuter}>
          <View style={styles.patternCircleBottom} />
          <View style={[styles.patternCircleBottom, styles.patternCircleBottomRight]} />
        </View>
      </ImageBackground>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: height,
  },
  backgroundImageStyle: {
    opacity: 0.25,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(139, 0, 0, 0.3)',
  },
  topPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  patternCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 3,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
  },
  patternCircleRight: {
    backgroundColor: 'rgba(255, 99, 71, 0.2)',
    borderColor: '#FF6347',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 100,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    shadowColor: '#8B0000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    position: 'relative',
    overflow: 'visible',
  },
  decorativeBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#FF6347',
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  borderPattern: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#FFD700',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    zIndex: -1,
  },
  title: {
    fontWeight: '700',
    color: '#8B0000',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 32,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#8B0000',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
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
    borderLeftWidth: 4,
    borderLeftColor: '#DC3545',
  },
  errorText: {
    color: '#DC3545',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 24,
    backgroundColor: '#8B0000',
    borderRadius: 16,
    paddingVertical: 4,
    shadowColor: '#8B0000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#FFD700',
    borderRadius: 1,
  },
  dividerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    marginHorizontal: 8,
  },
  registerButton: {
    borderColor: '#DC143C',
    borderWidth: 2.5,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  outlinedButtonText: {
    color: '#DC143C',
    fontWeight: '600',
    fontSize: 15,
  },
  forgotButton: {
    marginTop: 8,
  },
  forgotButtonText: {
    color: '#8B0000',
    fontWeight: '500',
    fontSize: 14,
  },
  bottomPattern: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 16,
  },
  bottomIcon: {
    opacity: 0.6,
  },
  bottomPatternOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  patternCircleBottom: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
  },
  patternCircleBottomRight: {
    backgroundColor: 'rgba(255, 99, 71, 0.15)',
    borderColor: '#FF6347',
  },
});
