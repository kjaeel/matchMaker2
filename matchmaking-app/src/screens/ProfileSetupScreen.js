import React, { useContext, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../context/AuthContext';

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
    setSaving(true);
    await completeProfile({
      age: Number(profile.age) || 0,
      heightCm: Number(profile.heightCm) || 0,
      education: profile.education,
      occupation: profile.occupation,
      religion: profile.religion,
      caste: profile.caste,
      city: profile.city,
      state: profile.state,
      country: profile.country,
    });
    setSaving(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center', marginBottom: 16 }}>
        {photoUri
          ? <Image source={{ uri: photoUri }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          : <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }}>
              <Text>Add Photo</Text>
            </View>
        }
      </TouchableOpacity>

      <Text variant="titleMedium" style={{ marginBottom: 8 }}>Basic Details</Text>
      <CustomInput label="Age" value={profile.age} onChangeText={(v) => set('age', v)} keyboardType="numeric" />
      <CustomInput label="Height (cm)" value={profile.heightCm} onChangeText={(v) => set('heightCm', v)} keyboardType="numeric" />
      <CustomInput label="Education" value={profile.education} onChangeText={(v) => set('education', v)} />
      <CustomInput label="Occupation" value={profile.occupation} onChangeText={(v) => set('occupation', v)} />
      <CustomInput label="Religion" value={profile.religion} onChangeText={(v) => set('religion', v)} />
      <CustomInput label="Caste" value={profile.caste} onChangeText={(v) => set('caste', v)} />
      <CustomInput label="City" value={profile.city} onChangeText={(v) => set('city', v)} />
      <CustomInput label="State" value={profile.state} onChangeText={(v) => set('state', v)} />
      <CustomInput label="Country" value={profile.country} onChangeText={(v) => set('country', v)} />

      <CustomButton loading={saving} onPress={save}>Save & Continue</CustomButton>
    </View>
  );
}
