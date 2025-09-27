import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { Text, Surface, FAB, Chip } from 'react-native-paper';
import ProfileCard from '../components/ProfileCard';
import { mockProfiles } from '../data/mockProfiles';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../styles/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { likedProfileIds, toggleLike } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredProfiles = mockProfiles.filter(profile => {
    if (filter === 'all') return true;
    if (filter === 'liked') return likedProfileIds.includes(profile.id);
    if (filter === 'nearby') return profile.city === 'Bengaluru'; // Example filter
    return true;
  });

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text variant="headlineMedium" style={styles.title}>
          Discover
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Find your perfect match
        </Text>
      </View>
      
      <View style={styles.statsContainer}>
        <Surface style={styles.statCard} elevation={2}>
          <MaterialCommunityIcons 
            name="heart" 
            size={24} 
            color={theme.colors.primary} 
          />
          <Text variant="titleMedium" style={styles.statNumber}>
            {likedProfileIds.length}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Liked
          </Text>
        </Surface>
        
        <Surface style={styles.statCard} elevation={2}>
          <MaterialCommunityIcons 
            name="account-group" 
            size={24} 
            color={theme.colors.secondary} 
          />
          <Text variant="titleMedium" style={styles.statNumber}>
            {mockProfiles.length}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Profiles
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
          >
            All
          </Chip>
          <Chip
            selected={filter === 'liked'}
            onPress={() => setFilter('liked')}
            style={[styles.filterChip, filter === 'liked' && styles.selectedChip]}
            textStyle={[styles.chipText, filter === 'liked' && styles.selectedChipText]}
          >
            Liked
          </Chip>
          <Chip
            selected={filter === 'nearby'}
            onPress={() => setFilter('nearby')}
            style={[styles.filterChip, filter === 'nearby' && styles.selectedChip]}
            textStyle={[styles.chipText, filter === 'nearby' && styles.selectedChipText]}
          >
            Nearby
          </Chip>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons 
        name="heart-outline" 
        size={80} 
        color={theme.colors.gray[400]} 
      />
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No profiles found
      </Text>
      <Text variant="bodyLarge" style={styles.emptySubtitle}>
        Try adjusting your filters or check back later for new profiles
      </Text>
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
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: theme.borderRadius['2xl'],
    borderBottomRightRadius: theme.borderRadius['2xl'],
    ...theme.shadows.md,
  },
  headerContent: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  statNumber: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  filtersContainer: {
    marginBottom: theme.spacing.sm,
  },
  filtersTitle: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  filterChip: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.text.secondary,
  },
  selectedChipText: {
    color: theme.colors.white,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing['2xl'],
    marginTop: theme.spacing['3xl'],
  },
  emptyTitle: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.lg,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

