import React, { useContext, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Surface, FAB } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { mockProfiles } from '../data/mockProfiles';
import ProfileCard from '../components/ProfileCard';
import { theme } from '../styles/theme';
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
          color={theme.colors.primary} 
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
        color={theme.colors.gray[400]} 
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

