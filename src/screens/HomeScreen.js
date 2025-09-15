import React, { useContext } from 'react';
import { View, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import ProfileCard from '../components/ProfileCard';
import { mockProfiles } from '../data/mockProfiles';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
  const { likedProfileIds, toggleLike } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineSmall" style={{ marginBottom: 8 }}>Suggested Matches</Text>
      <FlatList
        data={mockProfiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            liked={likedProfileIds.includes(item.id)}
            onLike={() => toggleLike(item.id)}
          />
        )}
      />
    </View>
  );
}

