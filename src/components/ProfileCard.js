import React from 'react';
import { Card, Avatar, Button, Text, Chip } from 'react-native-paper';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileCard({ profile, liked, onLike, onPress }) {
  const initials = profile?.name?.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card style={styles.card}>
        <ImageBackground
          source={{ uri: profile.photo }}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                {profile.photo ? (
                  <Avatar.Image 
                    size={60} 
                    source={{ uri: profile.photo }} 
                    style={styles.avatar}
                  />
                ) : (
                  <Avatar.Text 
                    size={60} 
                    label={initials || 'U'} 
                    style={[styles.avatar, styles.avatarFallback]}
                    labelStyle={styles.avatarLabel}
                  />
                )}
              </View>
              <TouchableOpacity 
                style={[styles.likeButton, liked && styles.likedButton]}
                onPress={onLike}
              >
            <Icon
              name={liked ? 'heart' : 'heart-outline'}
                         size={24}
                         color={liked ? '#FFFFFF' : '#FF6B6B'}
                       />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        
        <Card.Content style={styles.content}>
          <View style={styles.nameContainer}>
            <Text variant="headlineSmall" style={styles.name}>
              {profile.name}
            </Text>
            <Text variant="bodyLarge" style={styles.age}>
              {profile.age} years
            </Text>
          </View>
          
          <View style={styles.locationContainer}>
            <Icon
              name="map-marker"
                     size={16}
                     color="#6C757D"
                   />
            <Text variant="bodyMedium" style={styles.location}>
              {profile.city}, {profile.state}
            </Text>
          </View>
          
          <View style={styles.chipsContainer}>
            <Chip 
              mode="outlined" 
              style={styles.chip}
              textStyle={styles.chipText}
            >
              {profile.religion}
            </Chip>
            <Chip 
              mode="outlined" 
              style={styles.chip}
              textStyle={styles.chipText}
            >
              {profile.caste}
            </Chip>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
            <Icon
              name="school"
                       size={16}
                       color="#6C757D"
                     />
              <Text variant="bodyMedium" style={styles.detailText}>
                {profile.education}
              </Text>
            </View>
            <View style={styles.detailRow}>
            <Icon
              name="briefcase"
                       size={16}
                       color="#6C757D"
                     />
              <Text variant="bodyMedium" style={styles.detailText}>
                {profile.occupation}
              </Text>
            </View>
            <View style={styles.detailRow}>
            <Icon
              name="human-male-height"
                       size={16}
                       color="#6C757D"
                     />
              <Text variant="bodyMedium" style={styles.detailText}>
                {profile.heightCm} cm
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: '#FFFFFF',
  },
  imageBackground: {
    height: 200,
    width: '100%',
  },
  imageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  avatar: {
    backgroundColor: '#FF6B6B',
  },
  avatarFallback: {
    backgroundColor: '#4ECDC4',
  },
  avatarLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  likeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  likedButton: {
    backgroundColor: '#FF6B6B',
  },
  content: {
    padding: 24,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontWeight: '700',
    color: '#2C3E50',
  },
  age: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    marginLeft: 4,
    color: '#6C757D',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: '#F8F9FA',
  },
  chipText: {
    color: '#FF6B6B',
    fontWeight: '500',
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    color: '#6C757D',
  },
});

