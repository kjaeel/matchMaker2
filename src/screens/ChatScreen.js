import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Surface, Text, Avatar, Chip, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/theme';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../services/api';

export default function ChatScreen({ navigation }) {
  const { user, likedProfileIds } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch conversations from liked profiles
  const fetchConversations = async () => {
    if (!user?.id || likedProfileIds.length === 0) {
      setChats([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const conversations = [];
      
      // For each liked profile, we'll need to get their details
      // For now, we'll create conversation objects from liked profiles
      // In a real app, you'd have a conversations endpoint that returns all conversations
      for (const profileId of likedProfileIds) {
        try {
          const userResult = await userAPI.getUserById(profileId);
          if (userResult.success && userResult.data) {
            const otherUser = userResult.data;
            conversations.push({
              id: profileId,
              conversationId: null, // Will be set when conversation is created
              name: otherUser.name || otherUser.fullName || 'Unknown',
              lastMessage: 'Start a conversation...',
              time: '',
              unread: 0,
              photo: otherUser.photoUri || otherUser.imagePaths?.[0] || null,
              otherUserId: otherUser.id,
            });
          }
        } catch (err) {
          console.log('Error fetching user:', err);
        }
      }
      
      setChats(conversations);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user?.id, likedProfileIds]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => {
        // Navigate to individual chat detail screen with selected chat
        navigation.navigate('ChatDetail', { chat: item });
      }}
      activeOpacity={0.8}
    >
      <Surface style={styles.chatCard} elevation={2}>
        <View style={styles.chatContent}>
          <View style={styles.avatarContainer}>
            {item.photo ? (
              <Avatar.Image 
                size={56} 
                source={{ uri: item.photo }} 
                style={styles.avatar}
              />
            ) : (
              <Avatar.Text 
                size={56} 
                label={item.name.split(' ').map(n => n[0]).join('')} 
                style={[styles.avatar, styles.avatarFallback]}
                labelStyle={styles.avatarLabel}
              />
            )}
          </View>
          
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text variant="titleMedium" style={styles.chatName}>
                {item.name}
              </Text>
              <Text variant="bodySmall" style={styles.chatTime}>
                {item.time}
              </Text>
            </View>
            <View style={styles.chatFooter}>
              <Text variant="bodyMedium" style={styles.chatMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
              {item.unread > 0 && (
                <Chip 
                  style={styles.unreadBadge}
                  textStyle={styles.unreadText}
                >
                  {item.unread}
                </Chip>
              )}
            </View>
          </View>
        </View>
      </Surface>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIconContainer, { backgroundColor: colors.primary + '15' }]}>
        <Icon
          name="chat-outline"
          size={64}
          color={colors.primary}
        />
      </View>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No conversations yet
      </Text>
      <Text variant="bodyLarge" style={styles.emptySubtitle}>
        Start chatting with your matches!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={3}>
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <Icon name="chat" size={24} color={colors.white} />
          </View>
          <View style={styles.headerText}>
            <Text variant="headlineSmall" style={styles.headerTitle}>Messages</Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>Chat with your matches</Text>
          </View>
        </View>
      </Surface>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Loading conversations...
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    margin: 16,
    marginBottom: 12,
    borderRadius: 0,
    backgroundColor: colors.surfaceGold,
    borderWidth: 3,
    borderColor: colors.secondary,
    padding: 18,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.white,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: '700',
    color: colors.primary,
    fontSize: 20,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  chatCard: {
    marginBottom: 10,
    marginHorizontal: 16,
    borderRadius: 0,
    backgroundColor: colors.surfaceGold,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  chatContent: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  avatarFallback: {
    backgroundColor: colors.primary,
  },
  avatarLabel: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 20,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chatName: {
    fontWeight: '600',
    color: colors.primary,
    fontSize: 16,
    letterSpacing: 0.2,
    flex: 1,
  },
  chatTime: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatMessage: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    height: 24,
    minWidth: 24,
    borderRadius: 12,
  },
  unreadText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  loadingText: {
    marginTop: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
});

