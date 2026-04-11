import React from 'react';
import { Card, Avatar, Button, Text, Chip } from 'react-native-paper';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, shadows } from '../styles/theme';

export default function ProfileCard({ profile, liked, onLike, onPress }) {
  const initials = profile?.name?.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
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
                    size={64} 
                    source={{ uri: profile.photo }} 
                    style={styles.avatar}
                  />
                ) : (
                  <Avatar.Text 
                    size={64} 
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
                  color={liked ? colors.white : colors.primary}
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
              color={colors.primary}
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
              selectedColor={colors.primary}
            >
              {profile.religion}
            </Chip>
            <Chip 
              mode="outlined" 
              style={styles.chip}
              textStyle={styles.chipText}
              selectedColor={colors.primary}
            >
              {profile.caste}
            </Chip>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.iconWrapper}>
                <Icon
                  name="school"
                  size={16}
                  color={colors.secondary}
                />
              </View>
              <Text variant="bodyMedium" style={styles.detailText}>
                {profile.education}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.iconWrapper}>
                <Icon
                  name="briefcase"
                  size={16}
                  color={colors.secondary}
                />
              </View>
              <Text variant="bodyMedium" style={styles.detailText}>
                {profile.occupation}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.iconWrapper}>
                <Icon
                  name="human-male-height"
                  size={16}
                  color={colors.secondary}
                />
              </View>
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
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.secondary,
    ...shadows.lg,
  },
  imageBackground: {
    height: 220,
    width: '100%',
  },
  imageStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(139, 0, 0, 0.4)',
    justifyContent: 'space-between',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    ...shadows.md,
  },
  avatar: {
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.md,
  },
  avatarFallback: {
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarLabel: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 24,
  },
  likeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  likedButton: {
    backgroundColor: colors.primary,
  },
  content: {
    padding: 20,
    // backgroundColor: colors.surfaceGold,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  name: {
    fontWeight: '800',
    color: colors.text.primary,
    fontSize: 22,
    letterSpacing: 0.3,
  },
  age: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
    backgroundColor: colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  location: {
    marginLeft: 8,
    color: colors.text.secondary,
    fontWeight: '500',
    fontSize: 14,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  chip: {
    backgroundColor: colors.secondary + '20',
    borderColor: colors.secondary,
    borderWidth: 2,
    borderRadius: 16,
  },
  chipText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  detailsContainer: {
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

