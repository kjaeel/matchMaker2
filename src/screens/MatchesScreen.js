import React, { useContext, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Surface, FAB } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { mockProfiles } from '../data/mockProfiles';
import ProfileCard from '../components/ProfileCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/theme';

export default function MatchesScreen({ navigation }) {
  const { likedProfileIds, toggleLike } = useContext(AuthContext);

  const liked = useMemo(
    () => mockProfiles.filter(p => likedProfileIds.includes(p.id)),
    [likedProfileIds]
  );

  const renderHeader = () => (
    <Surface style={styles.header} elevation={3}>
      <View style={styles.headerContent}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
          <Icon 
            name="heart" 
            size={32} 
            color={colors.primary} 
          />
        </View>
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
      <View style={[styles.emptyIconContainer, { backgroundColor: colors.primary + '15' }]}>
        <Icon 
          name="heart-outline" 
          size={64} 
          color={colors.primary} 
        />
      </View>
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
    paddingBottom: 100,
  },
  header: {
    margin: 24,
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gray[100],
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
    borderRadius: 28,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

