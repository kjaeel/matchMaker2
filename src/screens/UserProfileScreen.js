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
  const isLiked = isViewingOtherProfile ? likedProfileIds.includes(profile?.id) : false;

  // Fetch user details from API if viewing another user's profile
  useEffect(() => {
    if (isViewingOtherProfile && profile?.id) {
      fetchUserDetails(profile.id);
    } else {
      setProfileData(user);
    }
  }, [isViewingOtherProfile, profile?.id, user]);

  const fetchUserDetails = async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userAPI.getUserById(userId);
      
      if (result.success) {
        // Transform API data to match our expected format
        const transformedProfile = {
          id: result.data.id,
          name: result.data.fullName,
          age: result.data.age || calculateAge(result.data.dateOfBirth),
          gender: result.data.gender,
          religion: result.data.religion || 'Not specified',
          caste: result.data.caste || 'Not specified',
          city: result.data.city || 'Not specified',
          state: result.data.state || 'Not specified',
          country: result.data.country || 'Not specified',
          education: result.data.education || 'Not specified',
          occupation: result.data.occupation || 'Not specified',
          heightCm: result.data.heightCm || 0,
          photo: result.data.photoUri || 'https://randomuser.me/api/portraits/men/1.jpg',
        };
        setProfileData(transformedProfile);
      } else {
        setError(result.error);
        // Fallback to passed profile data
        setProfileData(profile);
      }
    } catch (err) {
      setError(err.message);
      // Fallback to passed profile data
      setProfileData(profile);
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

  // Handle error state
  if (error && !profileData) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="alert-circle-outline" size={80} color={colors.error} />
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          Error Loading Profile
        </Text>
        <Text variant="bodyLarge" style={styles.emptySubtitle}>
          {error}
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
              {profileData.name || profileData.fullName}
            </Text>
            <Text variant="bodyLarge" style={styles.age}>
              {profileData.age} years old
            </Text>
            <View style={styles.locationContainer}>
              <Icon 
                name="map-marker" 
                size={18} 
                color={colors.primary} 
              />
              <Text variant="bodyMedium" style={styles.location}>
                {profileData.city}, {profileData.state}
              </Text>
            </View>
            <View style={styles.titleUnderline} />
          </View>
        </View>
        
        {isViewingOtherProfile && (
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={() => toggleLike(profileData.id)}
              style={[styles.actionButton, isLiked && styles.likedButton]}
              labelStyle={[styles.actionButtonText, isLiked && styles.likedButtonText]}
              icon={isLiked ? "heart" : "heart-outline"}
            >
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Chat')}
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
          <Chip 
            mode="outlined" 
            style={styles.chip}
            textStyle={styles.chipText}
          >
            {profileData.religion}
          </Chip>
          <Chip 
            mode="outlined" 
            style={styles.chip}
            textStyle={styles.chipText}
          >
            {profileData.caste}
          </Chip>
        </View>

        <View style={styles.detailsList}>
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
                {profileData.education}
              </Text>
            </View>
          </View>

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
                {profileData.occupation}
              </Text>
            </View>
          </View>

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
                {profileData.heightCm} cm
              </Text>
            </View>
          </View>

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
                {profileData.country}
              </Text>
            </View>
          </View>
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
    backgroundColor: colors.surfaceGold,
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
    backgroundColor: colors.surfaceGold,
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
    lineHeight: 1.6 * 18,
  },
});

