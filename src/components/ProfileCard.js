import React from 'react';
import { Card, Avatar, Button, Text } from 'react-native-paper';
import { View } from 'react-native';

export default function ProfileCard({ profile, liked, onLike }) {
  const initials = profile?.name?.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  return (
    <Card style={{ marginVertical: 8 }}>
      <Card.Title
        title={profile.name}
        subtitle={`${profile.age}, ${profile.city}, ${profile.state}`}
        left={(props) =>
          profile.photo
            ? <Avatar.Image {...props} source={{ uri: profile.photo }} />
            : <Avatar.Text {...props} label={initials || 'U'} />
        }
      />
      <Card.Content>
        <Text variant="bodyMedium">{profile.religion} • {profile.caste}</Text>
        <Text variant="bodyMedium">{profile.education} • {profile.occupation}</Text>
        <Text variant="bodySmall">{profile.country}</Text>
      </Card.Content>
      <Card.Actions>
        <View style={{ flex: 1 }} />
        <Button
          icon={liked ? 'heart' : 'heart-outline'}
          onPress={onLike}
          mode="text"
        >
          {liked ? 'Liked' : 'Like'}
        </Button>
      </Card.Actions>
    </Card>
  );
}

