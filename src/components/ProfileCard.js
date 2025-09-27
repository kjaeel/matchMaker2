import React from 'react';
import { Card, Avatar, Button, Text, Chip } from 'react-native-paper';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
                <MaterialCommunityIcons 
                  name={liked ? 'heart' : 'heart-outline'} 
                  size={24} 
                  color={liked ? theme.colors.white : theme.colors.primary}
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
            <MaterialCommunityIcons 
              name="map-marker" 
              size={16} 
              color={theme.colors.gray[500]} 
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
              <MaterialCommunityIcons 
                name="school" 
                size={16} 
                color={theme.colors.gray[500]} 
              />
              <Text variant="bodyMedium" style={styles.detailText}>
                {profile.education}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="briefcase" 
                size={16} 
                color={theme.colors.gray[500]} 
              />
              <Text variant="bodyMedium" style={styles.detailText}>
                {profile.occupation}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="human-male-height" 
                size={16} 
                color={theme.colors.gray[500]} 
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
    marginVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.lg,
    backgroundColor: theme.colors.surface,
  },
  imageBackground: {
    height: 200,
    width: '100%',
  },
  imageStyle: {
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    ...theme.shadows.md,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  avatarFallback: {
    backgroundColor: theme.colors.secondary,
  },
  avatarLabel: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
  },
  likeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  likedButton: {
    backgroundColor: theme.colors.primary,
  },
  content: {
    padding: theme.spacing.lg,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  name: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  age: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  location: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.gray[600],
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  chip: {
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceVariant,
  },
  chipText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  detailsContainer: {
    gap: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.gray[600],
  },
});

