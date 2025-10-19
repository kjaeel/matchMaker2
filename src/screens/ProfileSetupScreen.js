import React, { useContext, useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../context/AuthContext';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';

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
        <MaterialIcons
          name="person-add"
          size={32}
          color="#FF6B6B"
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
            <MaterialIcons name="camera-alt" size={40} color="#6C757D" />
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
        
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error" size={20} color="#DC3545" />
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
    backgroundColor: '#FAFBFC',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    margin: 24,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
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
    color: '#2C3E50',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6C757D',
  },
  photoSection: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
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
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  photoText: {
    marginTop: 8,
    color: '#6C757D',
  },
  detailsSection: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 20,
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
  },
});

