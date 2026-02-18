import React, { useContext, useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Button, Divider, List, Text, Surface, Chip, FAB, ActivityIndicator } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/theme';

export default function UserProfileScreen({ route, navigation }) {
  const { user, logout, likedProfileIds, toggleLike } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if we're viewing another user's profile or our own
  const profile = route?.params?.profile;
  const isViewingOtherProfile = !!profile;
  // const isLiked = isViewingOtherProfile ? likedProfileIds.includes(profile?.id) : false;
  const safeLikedIds = Array.isArray(likedProfileIds) ? likedProfileIds : [];
  const isLiked = isViewingOtherProfile
    ? safeLikedIds.includes(profile?.id)
    : false;
  // Safe data transformation function - ensures ALL values are safe for rendering
  const safeTransformProfile = (data) => {
    if (!data) return null;
    
    const safeString = (val) => {
      if (val === null || val === undefined) return null;
      if (typeof val === 'string') {
        const trimmed = val.trim();
        return trimmed.length > 0 ? trimmed : null;
      }
      if (typeof val === 'number') return String(val);
      if (typeof val === 'boolean') return String(val);
      return null;
    };

    const safeNumber = (val) => {
      if (val === null || val === undefined) return null;
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? null : parsed;
      }
      return null;
    };

    return {
      id: data.id || null,
      name: safeString(data.name || data.fullName) || 'Not specified',
      fullName: safeString(data.name || data.fullName) || 'Not specified',
      age: safeNumber(data.age || data.profile?.age) || null,
      gender: safeString(data.gender || data.profile?.gender) || 'Not specified',
      religion: safeString(data.religion || data.profile?.religion) || null,
      caste: safeString(data.caste || data.profile?.caste) || 'Not specified',
      city: safeString(data.city || data.profile?.city) || 'Not specified',
      state: safeString(data.state || data.profile?.state) || null,
      country: safeString(data.country || data.profile?.country) || 'Not specified',
      education: safeString(data.education || data.profile?.education) || 'Not specified',
      occupation: safeString(data.occupation || data.profile?.occupation) || 'Not specified',
      heightCm: safeNumber(data.heightCm || data.profile?.heightCm) || 0,
      email: safeString(data.email) || 'Not specified',
      phone: safeString(data.phone) || null,
      bio: safeString(data.bio || data.profile?.bio || data.about) || 'Not specified',
      salary: safeNumber(data.salary || data.profile?.salary) || null,
      photo: safeString(data.photo || data.photoUri || data.imagePaths?.[0]) || null,
      photoUri: safeString(data.photoUri || data.imagePaths?.[0]) || null,
    };
  };

  // Fetch user details from API if viewing another user's profile
  useEffect(() => {
    if (isViewingOtherProfile && profile?.id) {
      fetchUserDetails(profile.id);
    } else if (user) {
      const safeUser = safeTransformProfile(user);
      setProfileData(safeUser);
    }
  }, [isViewingOtherProfile, profile?.id, user]);

  const fetchUserDetails = async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userAPI.getUserById(userId);
      
      if (result.success) {
        // Map all fields from API response
        const apiData = result.data;
        const transformedProfile = safeTransformProfile({
          ...apiData,
          age: apiData.age || calculateAge(apiData.dateOfBirth),
        });
        console.log('📋 Transformed profile data:', JSON.stringify(transformedProfile, null, 2));
        setProfileData(transformedProfile);
      } else {
        setError(result.error);
        // Fallback to passed profile data - MUST transform it
        if (profile) {
          const transformedProfile = safeTransformProfile(profile);
          setProfileData(transformedProfile);
        } else {
          setProfileData(null);
        }
      }
    } catch (err) {
      setError(err.message);
      // Fallback to passed profile data - MUST transform it
      if (profile) {
        const transformedProfile = safeTransformProfile(profile);
        setProfileData(transformedProfile);
      } else {
        setProfileData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 25; // Default age
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (!profileData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  // Ensure profileData is always properly structured
  if (typeof profileData !== 'object' || profileData === null) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="alert-circle-outline" size={80} color={colors.error} />
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          Invalid Profile Data
        </Text>
        <Text variant="bodyLarge" style={styles.emptySubtitle}>
          Please try again
        </Text>
      </View>
    );
  }

  // Handle error state
  if (error && !profileData) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="alert-circle-outline" size={80} color={colors.error} />
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          Error Loading Profile
        </Text>
        <Text variant="bodyLarge" style={styles.emptySubtitle}>
          {String(error || 'Unknown error')}
        </Text>
      </View>
    );
  }

  const renderProfileHeader = () => (
    <View style={styles.headerWrapper}>
      <View style={styles.ornateTopBorder}>
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
      </View>
      <Surface style={styles.header} elevation={6}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarRing} />
            {profileData.photo ? (
              <Image 
                source={{ uri: profileData.photo }} 
                style={styles.avatar} 
              />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Icon 
                  name="account" 
                  size={50} 
                  color={colors.white} 
                />
              </View>
            )}
            <View style={styles.avatarGlow} />
          </View>
          
          <View style={styles.nameContainer}>
            <View style={styles.titleUnderline} />
            <Text variant="headlineMedium" style={styles.name}>
              {String(profileData.name || profileData.fullName || 'Name not specified')}
            </Text>
            <Text variant="bodyLarge" style={styles.age}>
              {profileData.age && profileData.age !== 'Not specified' && profileData.age !== null
                ? `${String(profileData.age)} years old` 
                : 'Age not specified'}
            </Text>
            <View style={styles.locationContainer}>
              <Icon 
                name="map-marker" 
                size={18} 
                color={colors.primary} 
              />
              <Text variant="bodyMedium" style={styles.location}>
                {(() => {
                  const parts = [profileData.city, profileData.state].filter(v => v && v !== 'Not specified' && v !== null);
                  return parts.length > 0 ? parts.join(', ') : 'Location not specified';
                })()}
              </Text>
            </View>
            <View style={styles.titleUnderline} />
          </View>
        </View>
        
        {isViewingOtherProfile && (
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={() => {
                if (profileData.id) {
                  toggleLike(profileData.id);
                }
              }}
              style={[styles.actionButton, isLiked && styles.likedButton]}
              labelStyle={[styles.actionButtonText, isLiked && styles.likedButtonText]}
              icon={isLiked ? "heart" : "heart-outline"}
            >
              {isLiked ? 'Liked' : 'Like'}
            </Button>
                    <Button
                      mode="contained"
                      onPress={() => {
                        const chatData = {
                          id: profileData.id ? String(profileData.id) : null,
                          name: String(profileData.name || profileData.fullName || 'User'),
                          otherUserId: profileData.id ? String(profileData.id) : null,
                          photo: profileData.photo || profileData.photoUri || null,
                        };
                        navigation.navigate('ChatDetail', { chat: chatData });
                      }}
                      style={styles.actionButton}
                      icon="chat"
                    >
                      Message
                    </Button>
          </View>
        )}
      </Surface>
      <View style={styles.ornateBottomBorder}>
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
      </View>
    </View>
  );

  const renderProfileDetails = () => (
    <View style={styles.detailsWrapper}>
      <View style={styles.ornateTopBorder}>
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
      </View>
      <Surface style={styles.detailsContainer} elevation={4}>
        <View style={styles.decorativeDivider}>
          <View style={styles.dividerDot} />
          <View style={styles.dividerLine} />
          <Icon name="flower" size={16} color={colors.secondary} />
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
        </View>
        <Text variant="titleLarge" style={styles.sectionTitle}>About</Text>
        
        <View style={styles.chipsContainer}>
          {(profileData.religion && profileData.religion !== null && profileData.religion !== 'Not specified') ? (
            <Chip 
              mode="outlined" 
              style={styles.chip}
              textStyle={styles.chipText}
            >
              {String(profileData.religion)}
            </Chip>
          ) : null}
          {(profileData.caste && profileData.caste !== 'Not specified' && profileData.caste !== null) ? (
            <Chip 
              mode="outlined" 
              style={styles.chip}
              textStyle={styles.chipText}
            >
              {String(profileData.caste)}
            </Chip>
          ) : null}
        </View>

        {/* Bio Section */}
        {(profileData.bio && profileData.bio !== 'Not specified') ? (
          <View style={styles.bioSection}>
            <Text variant="bodyMedium" style={styles.bioText}>
              {String(profileData.bio)}
            </Text>
          </View>
        ) : null}

        <View style={styles.detailsList}>
          {/* Personal Information */}
          <View style={styles.detailRow}>
            <View style={styles.iconWrapper}>
              <Icon 
                name="gender-male-female" 
                size={20} 
                color={colors.secondary} 
              />
            </View>
            <View style={styles.detailContent}>
              <Text variant="bodySmall" style={styles.detailLabel}>Gender</Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {String(profileData.gender || 'Not specified')}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconWrapper}>
              <Icon 
                name="cake" 
                size={20} 
                color={colors.secondary} 
              />
            </View>
            <View style={styles.detailContent}>
              <Text variant="bodySmall" style={styles.detailLabel}>Age</Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {profileData.age && profileData.age !== 'Not specified' && profileData.age !== null
                  ? (typeof profileData.age === 'number' ? `${profileData.age} years` : String(profileData.age))
                  : 'Not specified'}
              </Text>
            </View>
          </View>

          {/* Location Information */}
          <View style={styles.detailRow}>
            <View style={styles.iconWrapper}>
              <Icon 
                name="map-marker" 
                size={20} 
                color={colors.secondary} 
              />
            </View>
            <View style={styles.detailContent}>
              <Text variant="bodySmall" style={styles.detailLabel}>City</Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {String(profileData.city || 'Not specified')}
              </Text>
            </View>
          </View>

          {(profileData.state && profileData.state !== 'Not specified' && profileData.state !== null) ? (
            <View style={styles.detailRow}>
              <View style={styles.iconWrapper}>
                <Icon 
                  name="map" 
                  size={20} 
                  color={colors.secondary} 
                />
              </View>
              <View style={styles.detailContent}>
                <Text variant="bodySmall" style={styles.detailLabel}>State</Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {String(profileData.state)}
                </Text>
              </View>
            </View>
          ) : null}

          {(profileData.country && profileData.country !== 'Not specified' && profileData.country !== null) ? (
            <View style={styles.detailRow}>
              <View style={styles.iconWrapper}>
                <Icon 
                  name="flag" 
                  size={20} 
                  color={colors.secondary} 
                />
              </View>
              <View style={styles.detailContent}>
                <Text variant="bodySmall" style={styles.detailLabel}>Country</Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {String(profileData.country)}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Education & Career */}
          {(profileData.education && profileData.education !== 'Not specified') ? (
            <View style={styles.detailRow}>
              <View style={styles.iconWrapper}>
                <Icon 
                  name="school" 
                  size={20} 
                  color={colors.secondary} 
                />
              </View>
              <View style={styles.detailContent}>
                <Text variant="bodySmall" style={styles.detailLabel}>Education</Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {String(profileData.education)}
                </Text>
              </View>
            </View>
          ) : null}

          {(profileData.occupation && profileData.occupation !== 'Not specified') ? (
            <View style={styles.detailRow}>
              <View style={styles.iconWrapper}>
                <Icon 
                  name="briefcase" 
                  size={20} 
                  color={colors.secondary} 
                />
              </View>
              <View style={styles.detailContent}>
                <Text variant="bodySmall" style={styles.detailLabel}>Occupation</Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {String(profileData.occupation)}
                </Text>
              </View>
            </View>
          ) : null}

          {(profileData.salary !== null && profileData.salary !== undefined && profileData.salary !== 'Not specified') ? (
            <View style={styles.detailRow}>
              <View style={styles.iconWrapper}>
                <Icon 
                  name="currency-inr" 
                  size={20} 
                  color={colors.secondary} 
                />
              </View>
              <View style={styles.detailContent}>
                <Text variant="bodySmall" style={styles.detailLabel}>Salary</Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {`₹${String(profileData.salary)}`}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Physical Details */}
          {(typeof profileData.heightCm === 'number' && profileData.heightCm > 0) ? (
            <View style={styles.detailRow}>
              <View style={styles.iconWrapper}>
                <Icon 
                  name="human-male-height" 
                  size={20} 
                  color={colors.secondary} 
                />
              </View>
              <View style={styles.detailContent}>
                <Text variant="bodySmall" style={styles.detailLabel}>Height</Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {`${profileData.heightCm} cm`}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Contact Information */}
          {(profileData.email && profileData.email !== 'Not specified') ? (
            <View style={styles.detailRow}>
              <View style={styles.iconWrapper}>
                <Icon 
                  name="email" 
                  size={20} 
                  color={colors.secondary} 
                />
              </View>
              <View style={styles.detailContent}>
                <Text variant="bodySmall" style={styles.detailLabel}>Email</Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {String(profileData.email)}
                </Text>
              </View>
            </View>
          ) : null}

          {(profileData.phone && profileData.phone !== 'Not specified' && profileData.phone !== null) ? (
            <View style={styles.detailRow}>
              <View style={styles.iconWrapper}>
                <Icon 
                  name="phone" 
                  size={20} 
                  color={colors.secondary} 
                />
              </View>
              <View style={styles.detailContent}>
                <Text variant="bodySmall" style={styles.detailLabel}>Phone</Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {String(profileData.phone)}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </Surface>
      <View style={styles.ornateBottomBorder}>
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderProfileHeader()}
        {renderProfileDetails()}
      </ScrollView>
      
      {!isViewingOtherProfile && (
        <FAB
          icon="logout"
          style={styles.logoutFab}
          onPress={logout}
          label="Logout"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerWrapper: {
    margin: 12,
    marginBottom: 16,
  },
  ornateTopBorder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 8,
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 4,
  },
  ornateBottomBorder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 8,
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 4,
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  header: {
    borderRadius: 0,
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: colors.secondary,
  },
  headerContent: {
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 18,
    position: 'relative',
  },
  avatarRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: colors.secondary,
    top: -5,
    left: -5,
  },
  avatarGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.secondary,
    opacity: 0.2,
    top: -3,
    left: -3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarFallback: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  nameContainer: {
    alignItems: 'center',
    width: '100%',
  },
  titleUnderline: {
    width: 50,
    height: 3,
    backgroundColor: colors.secondary,
    marginVertical: 6,
    borderRadius: 2,
  },
  name: {
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 6,
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 0.5,
    textShadowColor: colors.secondary + '50',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  age: {
    color: colors.secondary,
    fontWeight: '700',
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.secondary + '40',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.primary + '10',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.secondary + '30',
    marginTop: 8,
  },
  location: {
    marginLeft: 6,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 18,
    paddingTop: 0,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderColor: colors.secondary,
    borderWidth: 2,
    borderRadius: 20,
  },
  likedButton: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
    borderWidth: 3,
  },
  actionButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  likedButtonText: {
    color: colors.white,
    fontWeight: '700',
  },
  detailsWrapper: {
    margin: 12,
    marginTop: 0,
  },
  detailsContainer: {
    borderRadius: 0,
    backgroundColor: colors.white,
    padding: 20,
    borderWidth: 4,
    borderColor: colors.secondary,
  },
  decorativeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.secondary + '60',
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 18,
    fontSize: 22,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: colors.secondary + '20',
    borderColor: colors.secondary,
    borderWidth: 2,
    borderRadius: 16,
  },
  chipText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  detailsList: {
    gap: 14,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: colors.secondary + '40',
    borderStyle: 'dashed',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 12,
  },
  detailValue: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  logoutFab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: colors.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  emptyTitle: {
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  bioSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  bioText: {
    color: colors.text.primary,
    lineHeight: 1.6 * 16,
    fontSize: 15,
    fontStyle: 'italic',
  },
});

