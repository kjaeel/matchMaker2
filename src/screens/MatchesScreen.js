import React, { useContext, useMemo } from 'react';
import { View, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { mockProfiles } from '../data/mockProfiles';
import ProfileCard from '../components/ProfileCard';

export default function MatchesScreen() {
  const { likedProfileIds, toggleLike } = useContext(AuthContext);

  const liked = useMemo(
    () => mockProfiles.filter(p => likedProfileIds.includes(p.id)),
    [likedProfileIds]
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineSmall" style={{ marginBottom: 8 }}>Liked Profiles</Text>
      <FlatList
        data={liked}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No liked profiles yet.</Text>}
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            liked={true}
            onLike={() => toggleLike(item.id)}
          />
        )}
      />
    </View>
  );
}

