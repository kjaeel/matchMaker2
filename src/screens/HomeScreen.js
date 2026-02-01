import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { Text, Surface, FAB, Chip, ActivityIndicator } from 'react-native-paper';
import ProfileCard from '../components/ProfileCard';
import { mockProfiles } from '../data/mockProfiles';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { likedProfileIds, toggleLike } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profiles from API
  const fetchProfiles = async () => {
    try {
      setError(null);
      const result = await userAPI.getAllUsers();
      
      if (result.success) {
        // Transform API data to match our expected format
        const transformedProfiles = result.data.map(user => ({
          id: user.id,
          name: user.name,
          age: user.age || calculateAge(user.dateOfBirth),
          gender: user.gender,
          religion: user.religion || 'Not specified',
          caste: user.caste || 'Not specified',
          city: user.city || 'Not specified',
          state: user.state || 'Not specified',
          country: user.country || 'Not specified',
          education: user.education || 'Not specified',
          occupation: user.occupation || 'Not specified',
          heightCm: user.heightCm || 0,
          photo: user.photoUri || 'https://randomuser.me/api/portraits/men/1.jpg',
        }));
        // setProfiles(transformedProfiles); 
        // -------------------------------------
        setProfiles(mockProfiles);

        console.log("transformedProfiles",transformedProfiles)
      } else {
        setError("------",result);
        // Fallback to mock data if API fails
        setProfiles(mockProfiles);
      }
    } catch (err) {
      setError("------",err);
      // Fallback to mock data if API fails
      setProfiles(mockProfiles);
    } finally {
      setLoading(false);
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 25; // Default age
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Load profiles on component mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfiles();
    setRefreshing(false);
  };

  const filteredProfiles = profiles.filter(profile => {
    if (filter === 'all') return true;
    if (filter === 'liked') return likedProfileIds.includes(profile.id);
    if (filter === 'nearby') return profile.city === 'Bengaluru'; // Example filter
    return true;
  });

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Ornate Top Pattern */}
      <View style={styles.ornateTopPattern}>
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
      </View>
      
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          <View style={styles.titleIconContainer}>
            <View style={styles.iconOuterRing} />
            <View style={styles.iconMiddleRing} />
            <View style={styles.iconInner}>
              <Icon name="heart-multiple" size={28} color={colors.white} />
            </View>
            <View style={styles.iconGlow} />
          </View>
          <View style={styles.titleTextContainer}>
            <View style={styles.titleUnderline} />
            <Text variant="headlineMedium" style={styles.title}>
              Discover Matches
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Find your perfect life partner
            </Text>
            <View style={styles.titleUnderline} />
          </View>
        </View>
      </View>
      
      {/* Decorative Bottom Pattern */}
      <View style={styles.ornateBottomPattern}>
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
        <View style={styles.patternDot} />
      </View>
      
      <View style={styles.statsContainer}>
        <Surface style={styles.statCard} elevation={3}>
          <View style={[styles.statIconContainer, { backgroundColor: colors.primary + '15' }]}>
            <Icon
              name="heart"
              size={22}
              color={colors.primary}
            />
          </View>
          <Text variant="titleLarge" style={[styles.statNumber, { color: colors.primary }]}>
            {likedProfileIds.length}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Liked Profiles
          </Text>
        </Surface>
        
        <Surface style={styles.statCard} elevation={3}>
          <View style={[styles.statIconContainer, { backgroundColor: colors.secondary + '15' }]}>
            <Icon
              name="account-group"
              size={22}
              color={colors.secondary}
            />
          </View>
          <Text variant="titleLarge" style={[styles.statNumber, { color: colors.secondary }]}>
            {profiles.length}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Total Profiles
          </Text>
        </Surface>
      </View>

      <View style={styles.filtersContainer}>
        <Text variant="bodyLarge" style={styles.filtersTitle}>Filter by:</Text>
        <View style={styles.chipsRow}>
          <Chip
            selected={filter === 'all'}
            onPress={() => setFilter('all')}
            style={[styles.filterChip, filter === 'all' && styles.selectedChip]}
            textStyle={[styles.chipText, filter === 'all' && styles.selectedChipText]}
            selectedColor={colors.white}
          >
            All
          </Chip>
          <Chip
            selected={filter === 'liked'}
            onPress={() => setFilter('liked')}
            style={[styles.filterChip, filter === 'liked' && styles.selectedChip]}
            textStyle={[styles.chipText, filter === 'liked' && styles.selectedChipText]}
            selectedColor={colors.white}
          >
            Liked
          </Chip>
          <Chip
            selected={filter === 'nearby'}
            onPress={() => setFilter('nearby')}
            style={[styles.filterChip, filter === 'nearby' && styles.selectedChip]}
            textStyle={[styles.chipText, filter === 'nearby' && styles.selectedChipText]}
            selectedColor={colors.white}
          >
            Nearby
          </Chip>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="bodyLarge" style={styles.emptySubtitle}>
            Loading profiles...
          </Text>
        </>
      ) : error ? (
        <>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.error + '15' }]}>
            <Icon
              name="alert-circle-outline"
              size={64}
              color={colors.error}
            />
          </View>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            Error loading profiles
          </Text>
          <Text variant="bodyLarge" style={styles.emptySubtitle}>
            {error}
          </Text>
        </>
      ) : (
        <>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.primary + '15' }]}>
            <Icon
              name="heart-outline"
              size={64}
              color={colors.primary}
            />
          </View>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No profiles found
          </Text>
          <Text variant="bodyLarge" style={styles.emptySubtitle}>
            Try adjusting your filters or check back later for new profiles
          </Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProfiles}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            liked={likedProfileIds.includes(item.id)}
            onLike={() => toggleLike(item.id)}
            onPress={() => navigation.navigate('UserProfile', { profile: item })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
      
      <FAB
        icon="magnify"
        style={styles.fab}
        onPress={() => navigation.navigate('Search')}
        label="Search"
        color={colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
  },
  header: {
    padding: 16,
    backgroundColor: colors.surfaceGold,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: colors.maroon,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    borderBottomWidth: 4,
    borderBottomColor: colors.secondary,
    borderTopWidth: 4,
    borderTopColor: colors.secondary,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRightWidth: 3,
    borderRightColor: colors.primary,
    position: 'relative',
    overflow: 'visible',
  },
  ornateTopPattern: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 8,
    backgroundColor: colors.primary,
    marginHorizontal: -3,
    marginTop: -4,
    paddingHorizontal: 6,
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  ornateBottomPattern: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 8,
    backgroundColor: colors.primary,
    marginHorizontal: -3,
    marginBottom: -4,
    paddingHorizontal: 6,
  },
  headerContent: {
    marginBottom: 14,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  iconOuterRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: colors.secondary,
  },
  iconMiddleRing: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  iconInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  iconGlow: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    opacity: 0.2,
    top: 0,
    left: 0,
  },
  titleTextContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  titleUnderline: {
    width: 40,
    height: 2,
    backgroundColor: colors.secondary,
    marginVertical: 2,
    borderRadius: 1,
  },
  title: {
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
    letterSpacing: 0.8,
    fontSize: 20,
    textShadowColor: colors.secondary + '50',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: colors.surfaceGold,
    borderWidth: 2,
    borderColor: colors.secondary,
    shadowColor: colors.maroon,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    position: 'relative',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontWeight: '700',
    marginTop: 2,
    fontSize: 18,
  },
  statLabel: {
    color: colors.text.secondary,
    marginTop: 2,
    fontSize: 10,
  },
  filtersContainer: {
    marginBottom: 6,
  },
  filtersTitle: {
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    fontSize: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    backgroundColor: colors.surfaceGold,
    borderWidth: 2,
    borderColor: colors.secondary + '60',
    borderRadius: 20,
  },
  selectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
    borderWidth: 3,
  },
  chipText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  selectedChipText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
    marginTop: 64,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 20,
  },
  emptySubtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 1.6 * 16,
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 32,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 3,
    borderColor: colors.secondary,
  },
});

