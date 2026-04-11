import React, { useContext, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Chip, FAB, ActivityIndicator } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import ProfileCard from '../components/ProfileCard';
import { mockProfiles } from '../data/mockProfiles';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/theme';

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
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  // Search function that uses APIs
  const performSearch = async (searchFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      let searchResults = [];
      
      // If age range is specified, use the age search API
      if (searchFilters.minAge && searchFilters.maxAge) {
        const ageResult = await userAPI.searchByAgeRange(
          parseInt(searchFilters.minAge), 
          parseInt(searchFilters.maxAge)
        );
        
        if (ageResult.success) {
          searchResults = ageResult.data;
        } else {
          throw new Error(ageResult.error);
        }
      }
      
      // If city is specified, use the city search API
      if (searchFilters.city) {
        const cityResult = await userAPI.searchByCity(searchFilters.city);
        
        if (cityResult.success) {
          // If we already have age results, filter by city
          if (searchResults.length > 0) {
            searchResults = searchResults.filter(user => 
              user.city && user.city.toLowerCase().includes(searchFilters.city.toLowerCase())
            );
          } else {
            searchResults = cityResult.data;
          }
        } else {
          throw new Error(cityResult.error);
        }
      }
      
      // If no specific API filters, get all users and filter locally
      if (!searchFilters.minAge && !searchFilters.maxAge && !searchFilters.city) {
        const allUsersResult = await userAPI.getAllUsers();
        if (allUsersResult.success) {
          searchResults = allUsersResult.data;
        } else {
          throw new Error(allUsersResult.error);
        }
      }
      
      // Transform API data to match our expected format
      const transformedResults = searchResults.map(user => ({
        id: user.id,
        name: user.fullName,
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
      
      // Apply additional local filters
      const filteredResults = transformedResults.filter(p => {
        if (searchFilters.caste && !p.caste.toLowerCase().includes(searchFilters.caste.toLowerCase())) return false;
        if (searchFilters.religion && !p.religion.toLowerCase().includes(searchFilters.religion.toLowerCase())) return false;
        if (searchFilters.state && !p.state.toLowerCase().includes(searchFilters.state.toLowerCase())) return false;
        if (searchFilters.country && !p.country.toLowerCase().includes(searchFilters.country.toLowerCase())) return false;
        return true;
      });
      
      setResults(filteredResults);
    } catch (err) {
      setError(err.message);
      // Fallback to mock data filtering
      const f = searchFilters;
      const fallbackResults = mockProfiles.filter(p => {
        if (f.minAge && p.age < Number(f.minAge)) return false;
        if (f.maxAge && p.age > Number(f.maxAge)) return false;
        if (f.caste && !p.caste.toLowerCase().includes(f.caste.toLowerCase())) return false;
        if (f.religion && !p.religion.toLowerCase().includes(f.religion.toLowerCase())) return false;
        if (f.city && !p.city.toLowerCase().includes(f.city.toLowerCase())) return false;
        if (f.state && !p.state.toLowerCase().includes(f.state.toLowerCase())) return false;
        if (f.country && !p.country.toLowerCase().includes(f.country.toLowerCase())) return false;
        return true;
      });
      setResults(fallbackResults);
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
    setResults([]);
    setError(null);
  };

  const renderHeader = () => (
    <Surface style={styles.header} elevation={3}>
      <View style={styles.headerContent}>
        <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '15' }]}>
          <Icon
            name="magnify"
            size={32}
            color={colors.secondary}
          />
        </View>
        <View style={styles.headerText}>
          <Text variant="headlineMedium" style={styles.title}>
            Search & Filter
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {loading ? 'Searching...' : `${results.length} profile${results.length !== 1 ? 's' : ''} found`}
          </Text>
        </View>
      </View>
      
      <View style={styles.filterButtonContainer}>
        <CustomButton 
          mode="outlined" 
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterToggle}
          size="small"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </CustomButton>
      </View>
    </Surface>
  );

  const renderFilters = () => (
    <Surface style={styles.filtersContainer} elevation={2}>
      <View style={styles.filtersHeader}>
        <Icon name="filter-variant" size={20} color={colors.primary} />
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
            onPress={() => {
              setApplied(filters);
              performSearch(filters);
            }}
            style={styles.applyButton}
            icon="check"
            loading={loading}
            disabled={loading}
          >
            Apply Filters
          </CustomButton>
          <CustomButton 
            mode="outlined" 
            onPress={clearFilters}
            style={styles.clearButton}
            icon="close"
            disabled={loading}
          >
            Clear
          </CustomButton>
        </View>
      </ScrollView>
    </Surface>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="bodyLarge" style={styles.emptySubtitle}>
            Searching...
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
            Search Error
          </Text>
          <Text variant="bodyLarge" style={styles.emptySubtitle}>
            {error}
          </Text>
        </>
      ) : (
        <>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.secondary + '15' }]}>
            <Icon
              name="magnify"
              size={64}
              color={colors.secondary}
            />
          </View>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No results found
          </Text>
          <Text variant="bodyLarge" style={styles.emptySubtitle}>
            Try adjusting your search filters
          </Text>
        </>
      )}
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
        ListEmptyComponent={!loading ? renderEmptyState : null}
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
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 100,
  },
  header: {
    margin: 24,
    marginBottom: 16,
    borderRadius: 0,
    backgroundColor: colors.surfaceGold,
    borderWidth: 3,
    borderColor: colors.secondary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
    fontSize: 22,
    letterSpacing: 0.3,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 15,
  },
  filterButtonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  filterToggle: {
    width: '100%',
    maxWidth: 200,
  },
  filtersContainer: {
    marginHorizontal: 24,
    marginTop: 0,
    marginBottom: 16,
    borderRadius: 0,
    backgroundColor: colors.surfaceGold,
    maxHeight: 500,
    borderWidth: 3,
    borderColor: colors.secondary,
  },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  filtersTitle: {
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
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

