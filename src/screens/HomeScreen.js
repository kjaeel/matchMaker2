import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { Text, Surface, FAB, Chip } from 'react-native-paper';
import ProfileCard from '../components/ProfileCard';
import { mockProfiles } from '../data/mockProfiles';
import { AuthContext } from '../context/AuthContext';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';

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
               <MaterialIcons
                 name="favorite"
                 size={24}
                 color="#FF6B6B"
               />
          <Text variant="titleMedium" style={styles.statNumber}>
            {likedProfileIds.length}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Liked
          </Text>
        </Surface>
        
        <Surface style={styles.statCard} elevation={2}>
               <MaterialIcons
                 name="group"
                 size={24}
                 color="#4ECDC4"
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
             <MaterialIcons
               name="favorite-border"
               size={80}
               color="#ADB5BD"
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
            colors={['#FF6B6B']}
            tintColor="#FF6B6B"
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
    backgroundColor: '#FAFBFC',
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6C757D',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  statNumber: {
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 4,
  },
  statLabel: {
    color: '#6C757D',
    marginTop: 4,
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filtersTitle: {
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#F8F9FA',
  },
  selectedChip: {
    backgroundColor: '#FF6B6B',
  },
  chipText: {
    color: '#6C757D',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
    marginTop: 64,
  },
  emptyTitle: {
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 1.6 * 18,
  },
  fab: {
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6B6B',
  },
});

