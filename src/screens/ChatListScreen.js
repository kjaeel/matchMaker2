import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  RefreshControl,
} from 'react-native';
import { Searchbar, Avatar, ActivityIndicator } from 'react-native-paper';
import { subscribeToChats, logEvent } from '../services/firebase';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ChatListScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    // Log analytics
    logEvent('chat_list_viewed', { userId: user.id });

    const unsubscribe = subscribeToChats(user.id, (chatList) => {
      setChats(chatList);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    // The subscription will automatically update
  };

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery.trim()) return true;
    const otherParticipant = chat.participants?.find((id) => id !== user.id);
    const chatName = chat.otherUserName || `User ${otherParticipant?.substring(0, 8)}`;
    return chatName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getOtherParticipant = (chat) => {
    // API provides otherUserId directly
    return chat.otherUserId || chat.participants?.find((id) => id !== user.id) || 'unknown';
  };

  const handleChatPress = (chat) => {
    const otherUserId = getOtherParticipant(chat);
    const conversationId = chat.conversationId || chat.id;
    logEvent('chat_opened', { chatId: conversationId, otherUserId });
    navigation.navigate('IndividualChat', {
      chatId: conversationId,
      otherUserId,
      otherUserName: chat.otherUserName || `User ${otherUserId.substring(0, 8)}`,
    });
  };

  const renderChatItem = ({ item: chat }) => {
    const otherUserId = getOtherParticipant(chat);
    const chatName = chat.otherUserName || `User ${otherUserId.substring(0, 8)}`;
    const lastMessage = chat.lastMessage || 'No messages yet';
    const unreadCount = chat.unreadCount || 0;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatPress(chat)}
        activeOpacity={0.7}
      >
        {chat.otherUserPhoto ? (
          <Avatar.Image
            size={56}
            source={{ uri: chat.otherUserPhoto }}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Text
            size={56}
            label={chatName.charAt(0).toUpperCase()}
            style={styles.avatar}
          />
        )}
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>
              {chatName}
            </Text>
            {chat.lastMessageTime && (
              <Text style={styles.chatTime}>{formatTime(chat.lastMessageTime)}</Text>
            )}
          </View>
          <View style={styles.chatFooter}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage}
            </Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>
      <Searchbar
        placeholder="Search chats..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
      />
      {filteredChats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="chat-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No chats yet</Text>
          <Text style={styles.emptySubtext}>Start a conversation with your matches!</Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  searchbar: {
    margin: 8,
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 16,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    marginRight: 12,
    backgroundColor: '#7b2cbf',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#7b2cbf',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});


