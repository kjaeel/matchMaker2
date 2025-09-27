import React, { useContext, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Surface, FAB } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { mockProfiles } from '../data/mockProfiles';
import ProfileCard from '../components/ProfileCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function MatchesScreen({ navigation }) {
  const { likedProfileIds, toggleLike } = useContext(AuthContext);

  const liked = useMemo(
    () => mockProfiles.filter(p => likedProfileIds.includes(p.id)),
    [likedProfileIds]
  );

  const renderHeader = () => (
    <Surface style={styles.header} elevation={2}>
      <View style={styles.headerContent}>
        <MaterialCommunityIcons 
          name="heart" 
          size={32} 
          color="#FF6B6B" 
        />
        <View style={styles.headerText}>
          <Text variant="headlineMedium" style={styles.title}>
            Your Matches
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {liked.length} profile{liked.length !== 1 ? 's' : ''} liked
          </Text>
        </View>
      </View>
    </Surface>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons 
        name="heart-outline" 
        size={80} 
        color="#ADB5BD" 
      />
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No matches yet
      </Text>
      <Text variant="bodyLarge" style={styles.emptySubtitle}>
        Start swiping to find profiles you like!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={liked}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            liked={true}
            onLike={() => toggleLike(item.id)}
            onPress={() => navigation.navigate('UserProfile', { profile: item })}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
      
      <FAB
        icon="heart-plus"
        style={styles.fab}
        onPress={() => navigation.navigate('Home')}
        label="Find More"
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

