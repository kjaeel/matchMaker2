import React, { useContext } from 'react';
import { View, Image } from 'react-native';
import { Button, Divider, List, Text } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

export default function UserProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  const p = user.profile || {};

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        {user.photoUri
          ? <Image source={{ uri: user.photoUri }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          : null
        }
        <Text variant="titleLarge" style={{ marginTop: 8 }}>{user.fullName}</Text>
        {user.email ? <Text>{user.email}</Text> : null}
        {user.phone ? <Text>{user.phone}</Text> : null}
      </View>

      <Divider style={{ marginBottom: 8 }} />
      {user.isProfileComplete ? (
        <>
          <List.Item title="Age" description={String(p.age)} />
          <List.Item title="Height (cm)" description={String(p.heightCm)} />
          <List.Item title="Education" description={p.education} />
          <List.Item title="Occupation" description={p.occupation} />
          <List.Item title="Religion" description={p.religion} />
          <List.Item title="Caste" description={p.caste} />
          <List.Item title="City" description={p.city} />
          <List.Item title="State" description={p.state} />
          <List.Item title="Country" description={p.country} />
        </>
      ) : (
        <Text>Profile incomplete. Complete it to start matching.</Text>
      )}
      <Divider style={{ marginVertical: 8 }} />
      <Button mode="contained" onPress={logout}>Logout</Button>
    </View>
  );
}
