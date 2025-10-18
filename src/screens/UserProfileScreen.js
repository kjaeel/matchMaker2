import React, { useContext, useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Button, Divider, List, Text, Surface, Chip, FAB, ActivityIndicator } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  const renderProfileHeader = () => (
    <Surface style={styles.header} elevation={4}>
      <View style={styles.headerContent}>
        <View style={styles.avatarContainer}>
          {profileData.photo ? (
            <Image 
              source={{ uri: profileData.photo }} 
              style={styles.avatar} 
            />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Icon 
                name="account" 
                size={40} 
                color="#FFFFFF" 
              />
            </View>
          )}
        </View>
        
        <View style={styles.nameContainer}>
          <Text variant="headlineMedium" style={styles.name}>
            {profileData.name || profileData.fullName}
          </Text>
          <Text variant="bodyLarge" style={styles.age}>
            {profileData.age} years old
          </Text>
          <View style={styles.locationContainer}>
            <Icon 
              name="map-marker" 
              size={16} 
              color="#6C757D" 
            />
            <Text variant="bodyMedium" style={styles.location}>
              {profileData.city}, {profileData.state}
            </Text>
          </View>
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
  );

  const renderProfileDetails = () => (
    <Surface style={styles.detailsContainer} elevation={2}>
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
          <Icon 
            name="school" 
            size={20} 
            color="#FF6B6B" 
          />
          <View style={styles.detailContent}>
            <Text variant="bodySmall" style={styles.detailLabel}>Education</Text>
            <Text variant="bodyMedium" style={styles.detailValue}>
              {profileData.education}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Icon 
            name="briefcase" 
            size={20} 
            color="#FF6B6B" 
          />
          <View style={styles.detailContent}>
            <Text variant="bodySmall" style={styles.detailLabel}>Occupation</Text>
            <Text variant="bodyMedium" style={styles.detailValue}>
              {profileData.occupation}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Icon 
            name="human-male-height" 
            size={20} 
            color="#FF6B6B" 
          />
          <View style={styles.detailContent}>
            <Text variant="bodySmall" style={styles.detailLabel}>Height</Text>
            <Text variant="bodyMedium" style={styles.detailValue}>
              {profileData.heightCm} cm
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Icon 
            name="flag" 
            size={20} 
            color="#FF6B6B" 
          />
          <View style={styles.detailContent}>
            <Text variant="bodySmall" style={styles.detailLabel}>Country</Text>
            <Text variant="bodyMedium" style={styles.detailValue}>
              {profileData.country}
            </Text>
          </View>
        </View>
      </View>
    </Surface>
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
    backgroundColor: '#FAFBFC',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarFallback: {
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    alignItems: 'center',
  },
  name: {
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'center',
  },
  age: {
    color: '#FF6B6B',
    fontWeight: '600',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    marginLeft: 4,
    color: '#6C757D',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderColor: '#FF6B6B',
  },
  likedButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    color: '#FF6B6B',
  },
  likedButtonText: {
    color: '#FFFFFF',
  },
  detailsContainer: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  chip: {
    backgroundColor: '#F8F9FA',
  },
  chipText: {
    color: '#FF6B6B',
    fontWeight: '500',
  },
  detailsList: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    color: '#6C757D',
    fontWeight: '500',
    marginBottom: 2,
    alignItems: 'center'
  },
  detailValue: {
    color: '#2C3E50',
    fontWeight: '600',
  },
  logoutFab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#DC3545',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
  },
  loadingText: {
    marginTop: 16,
    color: '#6C757D',
  },
});

