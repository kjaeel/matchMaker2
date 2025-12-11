import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {Text, Surface, SegmentedButtons, Chip} from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {AuthContext} from '../context/AuthContext';
import {userAPI} from '../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {availableInterests} from '../data/interests';
import { 
  CFPaymentGatewayService, 
  CFDropCheckoutPayment, 
  CFSession, 
  CFEnvironment, 
  CFTheme 
} from 'react-native-cashfree-pg-sdk';

const {height, width} = Dimensions.get('window');

export default function RegisterScreen({navigation}) {
  const {register} = useContext(AuthContext);
  // Temporary placeholder for Cashfree order response (paste real response later)
  const TEMP_CASHFREE_ORDER = {
    orderId: 'TEST_ORDER_ID',
    orderToken: 'TEST_ORDER_TOKEN',
    environment: 'SANDBOX', // or 'PROD'
  };
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    password: '',
    confirmPassword: '',
    interests: [],
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

      // 1) Payment step: mock or SDK
      if (true /* UAT mock: skip SDK */) {
        await new Promise(res => setTimeout(res, 500)); // simulate success
      } else {
        // Use temporary Cashfree order data (replace with backend response later)
        const { orderId, orderToken, environment } = TEMP_CASHFREE_ORDER || {};
        if (!orderId || !orderToken || !environment) {
          throw new Error('Payment not initialized. Please provide Cashfree order details.');
        }

        // Start Cashfree Drop Checkout
        const envNormalized = String(environment).trim().toUpperCase();
        // Defensive shim: some setups can have CFEnvironment undefined until native link completes
        const resolveEnvironment = () => {
          const isProd = envNormalized.includes('PROD');
          if (CFEnvironment && (CFEnvironment.PRODUCTION || CFEnvironment.SANDBOX)) {
            return isProd ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;
          }
          // Fallback to strings; SDK accepts these in newer versions
          return isProd ? 'PRODUCTION' : 'SANDBOX';
        };
        const cfSession = new CFSession(orderToken, orderId, resolveEnvironment());
        const cfTheme = new CFTheme({
          navigationBarBackgroundColor: '#8B0000',
          navigationBarTextColor: '#FFFFFF',
          buttonBackgroundColor: '#8B0000',
          buttonTextColor: '#FFFFFF',
          primaryTextColor: '#8B0000',
          secondaryTextColor: '#6C757D',
          backgroundColor: '#FFFFFF',
        });
        const dropPayment = new CFDropCheckoutPayment(cfSession, cfTheme);

        const paymentResult = await CFPaymentGatewayService.doPayment(dropPayment);
        const status = paymentResult?.status || paymentResult?.orderStatus || '';
        if (String(status).toUpperCase() !== 'SUCCESS') {
          throw new Error('Payment not completed');
        }
      }

      // 3) Proceed with normal register flow on success
      const userData = {
        fullName: form.fullName,
        email: form.email || null,
        phone: form.phone || null,
        gender: form.gender || null,
        dateOfBirth: form.dob || null,
        password: form.password,
        interests: form.interests || [],
      };

      const result = await userAPI.createUser(userData);

      if (result.success) {
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
        await register(createdUser);
      } else {
        console.log(result.error);
        setError(result.error || 'Registration failed');
      }
    } catch (e) {
       console.log(e);
      setError(e?.message || 'Registration failed');
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
                    <Icon name="account-heart" size={52} color="#8B0000" />
                  </LinearGradient>
                  <View style={styles.logoGlow} />
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

              <View style={styles.interestsContainer}>
                <Text variant="bodyMedium" style={styles.interestsLabel}>
                  Interests (Select your hobbies and interests)
                </Text>
                <View style={styles.interestsChips}>
                  {availableInterests.map((interest) => {
                    const isSelected = form.interests.includes(interest);
                    return (
                      <Chip
                        key={interest}
                        selected={isSelected}
                        onPress={() => {
                          if (isSelected) {
                            set('interests', form.interests.filter(i => i !== interest));
                          } else {
                            set('interests', [...form.interests, interest]);
                          }
                        }}
                        style={[
                          styles.interestChip,
                          isSelected && styles.selectedInterestChip,
                        ]}
                        textStyle={[
                          styles.interestChipText,
                          isSelected && styles.selectedInterestChipText,
                        ]}
                      >
                        {interest}
                      </Chip>
                    );
                  })}
                </View>
                {form.interests.length > 0 && (
                  <Text variant="bodySmall" style={styles.interestsCount}>
                    {form.interests.length} interest{form.interests.length !== 1 ? 's' : ''} selected
                  </Text>
                )}
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={20} color="#DC3545" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <CustomButton
                loading={submitting}
                onPress={onSubmit}
                size="large"
                style={styles.registerButton}>
                <Text style={styles.buttonText}>Create Account</Text>
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
                onPress={() => navigation.navigate('Login')}
                style={styles.loginButton}>
                <Text style={styles.outlinedButtonText}>Already have an account?</Text>
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
    padding: 24,
    paddingTop: 100,
    paddingBottom: 40,
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
  genderContainer: {
    marginBottom: 16,
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  genderLabel: {
    marginBottom: 8,
    color: '#8B0000',
    fontWeight: '600',
    fontSize: 15,
  },
  segmentedButtons: {
    backgroundColor: '#FFFFFF',
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
  registerButton: {
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
  loginButton: {
    borderColor: '#DC143C',
    borderWidth: 2.5,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  outlinedButtonText: {
    color: '#DC143C',
    fontWeight: '600',
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
  interestsContainer: {
    marginBottom: 16,
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  interestsLabel: {
    marginBottom: 12,
    color: '#8B0000',
    fontWeight: '600',
    fontSize: 15,
  },
  interestsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: '#FFFFFF',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedInterestChip: {
    backgroundColor: '#8B0000',
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  interestChipText: {
    color: '#6C757D',
    fontSize: 12,
  },
  selectedInterestChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  interestsCount: {
    marginTop: 12,
    color: '#8B0000',
    fontWeight: '500',
    textAlign: 'center',
  },
});
