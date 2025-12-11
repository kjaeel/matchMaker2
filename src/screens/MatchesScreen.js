import React, { useContext, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Surface, FAB } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { mockProfiles } from '../data/mockProfiles';
import ProfileCard from '../components/ProfileCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function MatchesScreen({ navigation }) {
  const { likedProfileIds, toggleLike } = useContext(AuthContext);

  const liked = useMemo(
    () => mockProfiles.filter(p => likedProfileIds.includes(p.id)),
    [likedProfileIds]
  );

  const renderHeader = () => (
    <Surface style={styles.header} elevation={2}>
      <View style={styles.headerContent}>
        <Icon 
          name="heart" 
          size={32} 
          color="#8B0000" 
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
      <Icon 
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
    backgroundColor: '#FFF9E6',
  },
  listContent: {
    paddingBottom: 100,
  },
  header: {
    margin: 24,
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
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
    color: '#8B0000',
    marginBottom: 4,
    fontSize: 24,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
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
    backgroundColor: '#8B0000',
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});

