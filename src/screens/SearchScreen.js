import React, { useContext, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Chip, FAB } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import ProfileCard from '../components/ProfileCard';
import { mockProfiles } from '../data/mockProfiles';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../styles/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SearchScreen({ navigation }) {
  const { likedProfileIds, toggleLike } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    minAge: '',
    maxAge: '',
    caste: '',
    religion: '',
    city: '',
    state: '',
    country: '',
  });
  const [applied, setApplied] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const set = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  const results = useMemo(() => {
    const f = applied || {};
    return mockProfiles.filter(p => {
      if (f.minAge && p.age < Number(f.minAge)) return false;
      if (f.maxAge && p.age > Number(f.maxAge)) return false;
      if (f.caste && !p.caste.toLowerCase().includes(f.caste.toLowerCase())) return false;
      if (f.religion && !p.religion.toLowerCase().includes(f.religion.toLowerCase())) return false;
      if (f.city && !p.city.toLowerCase().includes(f.city.toLowerCase())) return false;
      if (f.state && !p.state.toLowerCase().includes(f.state.toLowerCase())) return false;
      if (f.country && !p.country.toLowerCase().includes(f.country.toLowerCase())) return false;
      return true;
    });
  }, [applied]);

  const clearFilters = () => {
    setFilters({
      minAge: '',
      maxAge: '',
      caste: '',
      religion: '',
      city: '',
      state: '',
      country: '',
    });
    setApplied(null);
  };

  const renderHeader = () => (
    <Surface style={styles.header} elevation={2}>
      <View style={styles.headerContent}>
        <MaterialCommunityIcons 
          name="magnify" 
          size={32} 
          color={theme.colors.primary} 
        />
        <View style={styles.headerText}>
          <Text variant="headlineMedium" style={styles.title}>
            Search & Filter
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {results.length} profile{results.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      </View>
      
      <CustomButton 
        mode="outlined" 
        onPress={() => setShowFilters(!showFilters)}
        style={styles.filterToggle}
        size="small"
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </CustomButton>
    </Surface>
  );

  const renderFilters = () => (
    <Surface style={styles.filtersContainer} elevation={1}>
      <Text variant="titleMedium" style={styles.filtersTitle}>Search Filters</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomInput 
          label="Min Age" 
          value={filters.minAge} 
          onChangeText={(v) => set('minAge', v)} 
          keyboardType="numeric"
          size="small"
        />
        <CustomInput 
          label="Max Age" 
          value={filters.maxAge} 
          onChangeText={(v) => set('maxAge', v)} 
          keyboardType="numeric"
          size="small"
        />
        <CustomInput 
          label="Caste" 
          value={filters.caste} 
          onChangeText={(v) => set('caste', v)}
          size="small"
        />
        <CustomInput 
          label="Religion" 
          value={filters.religion} 
          onChangeText={(v) => set('religion', v)}
          size="small"
        />
        <CustomInput 
          label="City" 
          value={filters.city} 
          onChangeText={(v) => set('city', v)}
          size="small"
        />
        <CustomInput 
          label="State" 
          value={filters.state} 
          onChangeText={(v) => set('state', v)}
          size="small"
        />
        <CustomInput 
          label="Country" 
          value={filters.country} 
          onChangeText={(v) => set('country', v)}
          size="small"
        />
        
        <View style={styles.filterActions}>
          <CustomButton 
            onPress={() => setApplied(filters)}
            style={styles.applyButton}
          >
            Apply Filters
          </CustomButton>
          <CustomButton 
            mode="outlined" 
            onPress={clearFilters}
            style={styles.clearButton}
          >
            Clear
          </CustomButton>
        </View>
      </ScrollView>
    </Surface>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons 
        name="magnify" 
        size={80} 
        color={theme.colors.gray[400]} 
      />
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No results found
      </Text>
      <Text variant="bodyLarge" style={styles.emptySubtitle}>
        Try adjusting your search filters
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            {renderHeader()}
            {showFilters && renderFilters()}
          </View>
        }
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            liked={likedProfileIds.includes(item.id)}
            onLike={() => toggleLike(item.id)}
            onPress={() => navigation.navigate('UserProfile', { profile: item })}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
    paddingBottom: 100,
  },
  header: {
    margin: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.surface,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  headerText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  title: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.text.secondary,
  },
  filterToggle: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  filtersContainer: {
    margin: theme.spacing.lg,
    marginTop: 0,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.surface,
    maxHeight: 400,
  },
  filtersTitle: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  filterActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  applyButton: {
    flex: 1,
  },
  clearButton: {
    flex: 1,
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
});

