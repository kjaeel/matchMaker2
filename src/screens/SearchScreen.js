import React, { useContext, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Chip, FAB } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import ProfileCard from '../components/ProfileCard';
import { mockProfiles } from '../data/mockProfiles';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
        <Icon 
          name="magnify" 
          size={32} 
          color="#FF6B6B" 
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
      <View style={styles.filtersHeader}>
        <Icon name="filter" size={20} color="#FF6B6B" />
        <Text variant="titleMedium" style={styles.filtersTitle}>Search Filters</Text>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      >
        <View style={styles.inputRow}>
          <View style={styles.halfWidth}>
            <CustomInput 
              label="Min Age" 
              value={filters.minAge} 
              onChangeText={(v) => set('minAge', v)} 
              keyboardType="numeric"
              size="small"
            />
          </View>
          <View style={styles.halfWidth}>
            <CustomInput 
              label="Max Age" 
              value={filters.maxAge} 
              onChangeText={(v) => set('maxAge', v)} 
              keyboardType="numeric"
              size="small"
            />
          </View>
        </View>
        
        <CustomInput 
          label="Religion" 
          value={filters.religion} 
          onChangeText={(v) => set('religion', v)}
          size="small"
        />
        
        <CustomInput 
          label="Caste" 
          value={filters.caste} 
          onChangeText={(v) => set('caste', v)}
          size="small"
        />
        
        <View style={styles.inputRow}>
          <View style={styles.halfWidth}>
            <CustomInput 
              label="City" 
              value={filters.city} 
              onChangeText={(v) => set('city', v)}
              size="small"
            />
          </View>
          <View style={styles.halfWidth}>
            <CustomInput 
              label="State" 
              value={filters.state} 
              onChangeText={(v) => set('state', v)}
              size="small"
            />
          </View>
        </View>
        
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
            icon="check"
          >
            Apply Filters
          </CustomButton>
          <CustomButton 
            mode="outlined" 
            onPress={clearFilters}
            style={styles.clearButton}
            icon="close"
          >
            Clear
          </CustomButton>
        </View>
      </ScrollView>
    </Surface>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon 
        name="magnify" 
        size={80} 
        color="#ADB5BD" 
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
    backgroundColor: '#FAFBFC',
  },
  listContent: {
    paddingBottom: 100,
  },
  header: {
    margin: 24,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6C757D',
  },
  filterToggle: {
    margin: 24,
    marginTop: 0,
  },
  filtersContainer: {
    margin: 24,
    marginTop: 0,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    maxHeight: 500,
  },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  filtersTitle: {
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
    flex: 1,
  },
  filtersContent: {
    padding: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
});

