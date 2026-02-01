import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Surface, Text, Avatar, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/theme';

export default function ChatScreen({ navigation }) {
  // Chat list - list of conversations
  const [chats] = useState([
    { 
      id: '1', 
      name: 'Priya Sharma', 
      lastMessage: 'Hi! Nice to connect.', 
      time: '2m ago',
      unread: 2,
      photo: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    { 
      id: '2', 
      name: 'Rahul Kumar', 
      lastMessage: 'Thank you for your interest!', 
      time: '1h ago',
      unread: 0,
      photo: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    { 
      id: '3', 
      name: 'Anjali Patel', 
      lastMessage: 'Looking forward to connecting!', 
      time: '3h ago',
      unread: 1,
      photo: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
    { 
      id: '4', 
      name: 'Vikram Singh', 
      lastMessage: 'Hello! How are you?', 
      time: '1d ago',
      unread: 0,
      photo: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    
  ]);

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => {
        // Navigate to individual chat - you can create a ChatDetailScreen later
        console.log('Open chat with', item.name);
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
      
      <FlatList
        contentContainerStyle={styles.listContent}
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
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
    borderRadius: 16,
    backgroundColor: colors.surfaceGold,
    borderWidth: 2,
    borderColor: colors.secondary + '60',
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
    borderRadius: 16,
    backgroundColor: colors.surfaceGold,
    borderWidth: 1.5,
    borderColor: colors.secondary + '40',
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
});

