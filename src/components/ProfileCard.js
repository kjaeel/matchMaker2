import React from 'react';
import { Card, Avatar, Button, Text, Chip } from 'react-native-paper';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/theme';

export default function ProfileCard({ profile, liked, onLike, onPress }) {
  const initials = profile?.name?.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardWrapper}>
        {/* Ornate Top Border */}
        <View style={styles.ornateTopBorder}>
          <View style={styles.ornatePattern} />
          <View style={styles.ornatePattern} />
          <View style={styles.ornatePattern} />
        </View>
        
        <Card style={styles.card}>
          {/* Decorative Corner Elements */}
          <View style={[styles.cornerDecoration, styles.topLeft]} />
          <View style={[styles.cornerDecoration, styles.topRight]} />
          <View style={[styles.cornerDecoration, styles.bottomLeft]} />
          <View style={[styles.cornerDecoration, styles.bottomRight]} />
          
          <ImageBackground
            source={{ uri: profile.photo }}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.overlay}>
              <View style={styles.header}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarRing} />
                  {profile.photo ? (
                    <Avatar.Image 
                      size={56} 
                      source={{ uri: profile.photo }} 
                      style={styles.avatar}
                    />
                  ) : (
                    <Avatar.Text 
                      size={56} 
                      label={initials || 'U'} 
                      style={[styles.avatar, styles.avatarFallback]}
                      labelStyle={styles.avatarLabel}
                    />
                  )}
                  <View style={styles.avatarGlow} />
                </View>
                <TouchableOpacity 
                  style={[styles.likeButton, liked && styles.likedButton]}
                  onPress={onLike}
                >
                  <Icon
                    name={liked ? 'heart' : 'heart-outline'}
                    size={22}
                    color={liked ? colors.white : colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
          
          <Card.Content style={styles.content}>
            {/* Decorative Divider */}
            <View style={styles.decorativeDivider}>
              <View style={styles.dividerDot} />
              <View style={styles.dividerLine} />
              <Icon name="flower" size={16} color={colors.secondary} />
              <View style={styles.dividerLine} />
              <View style={styles.dividerDot} />
            </View>
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
        
        {/* Ornate Bottom Border */}
        <View style={styles.ornateBottomBorder}>
          <View style={styles.ornatePattern} />
          <View style={styles.ornatePattern} />
          <View style={styles.ornatePattern} />
        </View>
      </Card>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginVertical: 10,
    marginHorizontal: 12,
  },
  ornateTopBorder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 8,
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 4,
  },
  ornatePattern: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  ornateBottomBorder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 8,
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 0,
    overflow: 'hidden',
    shadowColor: colors.maroon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    backgroundColor: colors.surface,
    borderWidth: 4,
    borderColor: colors.secondary,
    position: 'relative',
  },
  cornerDecoration: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderWidth: 3,
    borderColor: colors.secondary,
    zIndex: 1,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  decorativeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.secondary + '60',
    marginHorizontal: 8,
  },
  imageBackground: {
    height: 180,
    width: '100%',
  },
  imageStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(139, 0, 0, 0.5)',
    justifyContent: 'space-between',
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  avatarRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: colors.secondary,
    top: -4,
    left: -4,
  },
  avatarGlow: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondary,
    opacity: 0.3,
    top: -2,
    left: -2,
  },
  avatar: {
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarFallback: {
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarLabel: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 20,
  },
  likeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 3,
    borderColor: colors.secondary,
  },
  likedButton: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
  content: {
    padding: 18,
    backgroundColor: colors.surfaceGold,
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
    color: colors.primary,
    fontSize: 20,
    letterSpacing: 0.5,
    textShadowColor: colors.secondary + '40',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  age: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: 16,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.secondary + '40',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.primary + '10',
    borderRadius: 10,
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: colors.secondary + '30',
  },
  location: {
    marginLeft: 6,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
    gap: 8,
    justifyContent: 'center',
  },
  chip: {
    marginRight: 6,
    marginBottom: 4,
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
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: colors.secondary + '40',
    borderStyle: 'dashed',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  detailText: {
    flex: 1,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

