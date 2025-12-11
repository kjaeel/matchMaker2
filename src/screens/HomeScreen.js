import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Text, Surface, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { mockProfiles } from '../data/mockProfiles';
import SwipeableCard from '../components/SwipeableCard';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
// Calculate card height dynamically to fit screen with header and buttons
const HEADER_HEIGHT = 120;
const BUTTONS_HEIGHT = 100;
const PROGRESS_HEIGHT = 40;
const CARD_HEIGHT = height - HEADER_HEIGHT - BUTTONS_HEIGHT - PROGRESS_HEIGHT - 40; // 40 for padding

export default function HomeScreen() {
  const { likedProfileIds, toggleLike } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await userAPI.getAllUsers();
      if (result.success) {
        const transformed = result.data.map((user) => ({
          id: user.id,
          name: user.fullName,
          age: user.age || 25,
          gender: user.gender,
          religion: user.religion || 'Not specified',
          caste: user.caste || 'Not specified',
          city: user.city || 'Unknown',
          state: user.state || '',
          education: user.education || '',
          occupation: user.occupation || '',
          photo:
            user.photoUri || 'https://randomuser.me/api/portraits/men/1.jpg',
        }));
        // setProfiles(transformed);
          setProfiles(mockProfiles);
      } else {
        setProfiles(mockProfiles);
      }
    } catch (e) {
      setError(e.message);
      setProfiles(mockProfiles);
    } finally {
      setLoading(false);
      setCurrentIndex(0);
    }
  };

  // Move to next card safely (no duplicates)
  const moveToNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev + 1 < profiles.length ? prev + 1 : profiles.length
    );
  }, [profiles.length]);

  // Swipe actions
  const handleSwipeRight = useCallback((profileId) => {
    moveToNext(); // instantly move UI
    userAPI.swipeRight(profileId).catch(console.error); // async background
  }, []);
  
  const handleSwipeLeft = useCallback((profileId) => {
    moveToNext(); // instantly move UI
    userAPI.swipeLeft(profileId).catch(console.error); // async background
  }, []);

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={{ marginTop: 12 }}>Loading profiles...</Text>
      </View>
    );
  }

  if (!currentProfile) {
    return (
      <View style={styles.centered}>
        <Icon name="heart-outline" size={100} color="#ADB5BD" />
        <Text variant="headlineMedium" style={{ marginTop: 16 }}>
          No more profiles
        </Text>
        <Button
          mode="contained"
          onPress={fetchProfiles}
          style={styles.refreshButton}
        >
          Refresh
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FFF9E6', '#FFFFFF', '#FFF9E6']}
        style={styles.gradientBackground}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="headlineMedium" style={styles.title}>
              Discover
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Swipe right to like, left to pass
            </Text>
          </View>
          <View style={styles.statsContainer}>
            <Surface style={styles.statCard} elevation={2}>
              <Icon name="heart" size={20} color="#8B0000" />
              <Text style={styles.statNumber}>{likedProfileIds.length}</Text>
            </Surface>
            <Surface style={styles.statCard} elevation={2}>
              <Icon name="account-group" size={20} color="#FFD700" />
              <Text style={styles.statNumber}>
                {profiles.length - currentIndex}
              </Text>
            </Surface>
          </View>
        </View>

        {/* Card Stack */}
        <View style={styles.cardStack}>
          {nextProfile && (
            <View style={[styles.cardContainer, styles.nextCard]}>
              <SwipeableCard
                profile={nextProfile}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
                disabled={true}
                cardHeight={CARD_HEIGHT}
              />
            </View>
          )}
          {currentProfile && (
            <View style={styles.cardContainer}>
              <SwipeableCard
                profile={currentProfile}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
                disabled={swiping}
                cardHeight={CARD_HEIGHT}
              />
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <IconButton
            icon="close"
            iconColor="#FFFFFF"
            size={40}
            style={[styles.actionButton, styles.passButton]}
            onPress={() => handleSwipeLeft(currentProfile.id)}
            disabled={swiping}
          />
          <IconButton
            icon="heart"
            iconColor="#FFFFFF"
            size={40}
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => handleSwipeRight(currentProfile.id)}
            disabled={swiping}
          />
        </View>

        {/* Progress */}
        <Text style={styles.progressText}>
          {currentIndex + 1} / {profiles.length}
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: '700',
    color: '#8B0000',
  },
  subtitle: {
    color: '#6C757D',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 8,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  statNumber: {
    color: '#8B0000',
    fontWeight: '700',
  },
  cardStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: CARD_HEIGHT,
    maxHeight: CARD_HEIGHT,
  },
  cardContainer: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  nextCard: {
    transform: [{ scale: 0.95 }, { translateY: 18 }],
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingVertical: 8,
    marginTop: 4,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 6,
  },
  passButton: {
    backgroundColor: '#DC3545',
  },
  likeButton: {
    backgroundColor: '#8B0000',
  },
  progressText: {
    textAlign: 'center',
    color: '#6C757D',
    marginTop: 4,
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 20,
  },
  refreshButton: {
    marginTop: 20,
    backgroundColor: '#8B0000',
    borderRadius: 12,
  },
});
