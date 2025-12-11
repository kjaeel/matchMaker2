import React, { useContext, useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { availableInterests } from '../data/interests';

const { width } = Dimensions.get('window');

export default function ProfileSetupScreen() {
  const { completeProfile, setPhotoUri } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    age: '',
    heightCm: '',
    education: '',
    occupation: '',
    religion: '',
    caste: '',
    city: '',
    state: '',
    country: '',
    interests: [],
  });
  const [photoUri, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setProfile((p) => ({ ...p, [k]: v }));

  const pickImage = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
    const uri = res?.assets?.[0]?.uri;
    if (uri) {
      setPhoto(uri);
      await setPhotoUri(uri);
    }
  };

  const save = async () => {
    setError('');
    
    // Basic validation
    if (!profile.age || !profile.city || !profile.education || !profile.occupation) {
      setError('Please fill in all required fields (Age, City, Education, Occupation)');
      return;
    }
    
    if (Number(profile.age) < 18 || Number(profile.age) > 100) {
      setError('Please enter a valid age between 18 and 100');
      return;
    }
    
    try {
      setSaving(true);
      await completeProfile({
        age: Number(profile.age),
        heightCm: Number(profile.heightCm) || 0,
        education: profile.education,
        occupation: profile.occupation,
        religion: profile.religion || 'Not specified',
        caste: profile.caste || 'Not specified',
        city: profile.city,
        state: profile.state || 'Not specified',
        country: profile.country || 'India',
        interests: profile.interests || [],
      });
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const renderHeader = () => (
    <Surface style={styles.header} elevation={2}>
      <View style={styles.headerContent}>
        <Icon
          name="account-plus"
          size={32}
          color="#8B0000"
        />
        <View style={styles.headerText}>
          <Text variant="headlineMedium" style={styles.title}>
            Complete Your Profile
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Help others discover you with a complete profile
          </Text>
        </View>
      </View>
    </Surface>
  );

  const renderPhotoSection = () => (
    <Surface style={styles.photoSection} elevation={2}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Profile Photo</Text>
      <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Icon name="camera" size={40} color="#6C757D" />
            <Text variant="bodyMedium" style={styles.photoText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>
    </Surface>
  );

  const renderBasicDetails = () => (
    <Surface style={styles.detailsSection} elevation={2}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Basic Details</Text>
      
      <View style={styles.inputRow}>
        <View style={styles.halfWidth}>
          <CustomInput 
            label="Age *" 
            value={profile.age} 
            onChangeText={(v) => set('age', v)} 
            keyboardType="numeric"
            size="small"
          />
        </View>
        <View style={styles.halfWidth}>
          <CustomInput 
            label="Height (cm)" 
            value={profile.heightCm} 
            onChangeText={(v) => set('heightCm', v)} 
            keyboardType="numeric"
            size="small"
          />
        </View>
      </View>

      <CustomInput 
        label="Education *" 
        value={profile.education} 
        onChangeText={(v) => set('education', v)}
        size="small"
      />
      
      <CustomInput 
        label="Occupation *" 
        value={profile.occupation} 
        onChangeText={(v) => set('occupation', v)}
        size="small"
      />
    </Surface>
  );

  const renderPersonalDetails = () => (
    <Surface style={styles.detailsSection} elevation={2}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Personal Details</Text>
      
      <View style={styles.inputRow}>
        <View style={styles.halfWidth}>
          <CustomInput 
            label="Religion" 
            value={profile.religion} 
            onChangeText={(v) => set('religion', v)}
            size="small"
          />
        </View>
        <View style={styles.halfWidth}>
          <CustomInput 
            label="Caste" 
            value={profile.caste} 
            onChangeText={(v) => set('caste', v)}
            size="small"
          />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.halfWidth}>
          <CustomInput 
            label="City *" 
            value={profile.city} 
            onChangeText={(v) => set('city', v)}
            size="small"
          />
        </View>
        <View style={styles.halfWidth}>
          <CustomInput 
            label="State" 
            value={profile.state} 
            onChangeText={(v) => set('state', v)}
            size="small"
          />
        </View>
      </View>

      <CustomInput 
        label="Country" 
        value={profile.country} 
        onChangeText={(v) => set('country', v)}
        size="small"
      />
    </Surface>
  );

  const renderInterestsSection = () => (
    <Surface style={styles.detailsSection} elevation={2}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Interests</Text>
      <Text variant="bodySmall" style={styles.sectionSubtitle}>
        Select your hobbies and interests to help others discover you
      </Text>
      <View style={styles.interestsChips}>
        {availableInterests.map((interest) => {
          const isSelected = profile.interests.includes(interest);
          return (
            <Chip
              key={interest}
              selected={isSelected}
              onPress={() => {
                if (isSelected) {
                  set('interests', profile.interests.filter(i => i !== interest));
                } else {
                  set('interests', [...profile.interests, interest]);
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
      {profile.interests.length > 0 && (
        <Text variant="bodySmall" style={styles.interestsCount}>
          {profile.interests.length} interest{profile.interests.length !== 1 ? 's' : ''} selected
        </Text>
      )}
    </Surface>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderPhotoSection()}
        {renderBasicDetails()}
        {renderPersonalDetails()}
        {renderInterestsSection()}
        
        {error ? (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={20} color="#DC3545" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <CustomButton 
          loading={saving} 
          onPress={save}
          size="large"
          style={styles.saveButton}
        >
          Complete Profile
        </CustomButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E6',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    margin: 24,
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontWeight: '700',
    color: '#8B0000',
    marginBottom: 4,
    fontSize: 24,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#6C757D',
  },
  photoSection: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#8B0000',
    marginBottom: 16,
    fontSize: 18,
  },
  photoContainer: {
    alignItems: 'center',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF9E6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
  },
  photoText: {
    marginTop: 8,
    color: '#6C757D',
  },
  detailsSection: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC3545',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  saveButton: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#8B0000',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionSubtitle: {
    color: '#6C757D',
    marginBottom: 16,
    fontSize: 13,
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

