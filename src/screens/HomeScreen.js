import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { Text, Surface, Chip, ActivityIndicator } from 'react-native-paper';
import ProfileCard from '../components/ProfileCard';
import { mockProfiles } from '../data/mockProfiles';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, shadows } from '../styles/theme';

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
        setProfiles(transformedProfiles); 
        // -------------------------------------
        // setProfiles(mockProfiles);

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
      <View style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <View style={styles.titleIconContainer}>
              <Icon name="heart-multiple" size={32} color={colors.white} />
            </View>
            <View style={styles.titleTextContainer}>
              <Text variant="headlineMedium" style={styles.title}>
                Discover Matches
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Find your perfect life partner
              </Text>
            </View>
          </View>
        </View>
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
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
    borderRadius: 0,
  },
  headerGradient: {
    backgroundColor: colors.primary,
    // paddingVertical: 8,
    paddingTop: 30,
    // marginTop: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 4,
    borderBottomColor: colors.secondary,
    ...shadows.lg,
  },
  headerContent: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleIconContainer: {
    width: 64,
    height: 44,
    borderRadius: 32,
    backgroundColor: colors.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: colors.white + '40',
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '800',
    color: colors.white,
    marginBottom: 6,
    fontSize: 28,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.white + 'DD',
    fontSize: 15,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: colors.white,
    ...shadows.md,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontWeight: '700',
    marginTop: 4,
    fontSize: 22,
  },
  statLabel: {
    color: colors.text.secondary,
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  filtersContainer: {
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  filtersTitle: {
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
    fontSize: 16,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    borderRadius: 24,
    ...shadows.sm,
  },
  selectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  chipText: {
    color: colors.text.secondary,
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
});

