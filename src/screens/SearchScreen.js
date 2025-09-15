import React, { useContext, useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import ProfileCard from '../components/ProfileCard';
import { mockProfiles } from '../data/mockProfiles';
import { AuthContext } from '../context/AuthContext';

export default function SearchScreen() {
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

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>Filters</Text>
      <CustomInput label="Min Age" value={filters.minAge} onChangeText={(v) => set('minAge', v)} keyboardType="numeric" />
      <CustomInput label="Max Age" value={filters.maxAge} onChangeText={(v) => set('maxAge', v)} keyboardType="numeric" />
      <CustomInput label="Caste" value={filters.caste} onChangeText={(v) => set('caste', v)} />
      <CustomInput label="Religion" value={filters.religion} onChangeText={(v) => set('religion', v)} />
      <CustomInput label="City" value={filters.city} onChangeText={(v) => set('city', v)} />
      <CustomInput label="State" value={filters.state} onChangeText={(v) => set('state', v)} />
      <CustomInput label="Country" value={filters.country} onChangeText={(v) => set('country', v)} />
      <CustomButton onPress={() => setApplied(filters)}>Apply Filters</CustomButton>

      <Text variant="titleMedium" style={{ marginVertical: 8 }}>Results</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            liked={likedProfileIds.includes(item.id)}
            onLike={() => toggleLike(item.id)}
          />
        )}
      />
    </View>
  );
}

