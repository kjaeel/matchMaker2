import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, IconButton, Surface, Text, ActivityIndicator } from 'react-native-paper';
import { firebaseChatService } from '../services/firebaseChat';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ChatScreen({ route }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);
  const listenerIdRef = useRef(null);

  // Get chat partner from route params (if navigating from profile)
  const chatPartner = route?.params?.user || route?.params?.profile;
  const chatPartnerId = chatPartner?.id || 'default_user';

  useEffect(() => {
    if (!user?.id) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    // Subscribe to messages
    const subscribe = async () => {
      try {
        const listenerId = firebaseChatService.subscribeToMessages(
          user.id,
          chatPartnerId,
          (newMessages) => {
            setMessages(newMessages);
            setLoading(false);
            setError(null);
            
            // Scroll to bottom when new messages arrive
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }
        );
        
        listenerIdRef.current = listenerId;

        // Mark messages as read
        const chatRoomId = firebaseChatService.getChatRoomId(user.id, chatPartnerId);
        await firebaseChatService.markAsRead(chatRoomId, user.id);
      } catch (err) {
        console.error('Error subscribing to messages:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    subscribe();

    // Cleanup on unmount
    return () => {
      if (listenerIdRef.current) {
        firebaseChatService.unsubscribe(listenerIdRef.current);
      }
    };
  }, [user?.id, chatPartnerId]);

  const sendMessage = async () => {
    if (!draft.trim() || sending) return;

    const messageText = draft.trim();
    setDraft('');
    setSending(true);

    try {
      const result = await firebaseChatService.sendMessage(
        user.id,
        chatPartnerId,
        messageText
      );

      if (!result.success) {
        setError(result.error || 'Failed to send message');
        setDraft(messageText); // Restore draft on error
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
      setDraft(messageText); // Restore draft on error
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === user?.id;
    const timestamp = item.timestamp 
      ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

    return (
      <View
        style={[
          styles.messageWrapper,
          isMyMessage ? styles.myMessageWrapper : styles.theirMessageWrapper,
        ]}
      >
        <Surface
          style={[
            styles.messageContainer,
            isMyMessage ? styles.myMessage : styles.theirMessage,
          ]}
          elevation={2}
        >
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.theirMessageText,
          ]}>
            {item.text}
          </Text>
          {timestamp && (
            <Text style={[
              styles.messageTime,
              isMyMessage ? styles.myMessageTime : styles.theirMessageTime,
            ]}>
              {timestamp}
            </Text>
          )}
          {isMyMessage && item.read && (
            <Icon name="check-all" size={12} color="#8B0000" style={styles.readIcon} />
          )}
        </Surface>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#8B0000" />
          <Text variant="bodyLarge" style={styles.emptyText}>
            Loading messages...
          </Text>
        </View>
      );
    }

    if (error && messages.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="alert-circle-outline" size={60} color="#DC3545" />
          <Text variant="bodyLarge" style={styles.emptyText}>
            {error}
          </Text>
          <Text variant="bodySmall" style={styles.emptySubtext}>
            Make sure Firebase is configured correctly
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Icon name="chat-outline" size={60} color="#ADB5BD" />
        <Text variant="bodyLarge" style={styles.emptyText}>
          No messages yet
        </Text>
        <Text variant="bodySmall" style={styles.emptySubtext}>
          Start the conversation!
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id || `msg_${item.timestamp}_${Math.random()}`}
          renderItem={renderMessage}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.listContent,
            messages.length === 0 && styles.emptyListContent,
          ]}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {error && messages.length > 0 && (
        <View style={styles.errorBanner}>
          <Icon name="alert-circle" size={16} color="#FFFFFF" />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      <Surface style={styles.inputContainer} elevation={4}>
        <TextInput
          style={styles.input}
          mode="outlined"
          placeholder="Type a message..."
          value={draft}
          onChangeText={setDraft}
          outlineColor="#FFD700"
          activeOutlineColor="#8B0000"
          disabled={sending}
          multiline
          maxLength={500}
        />
        <IconButton
          icon="send"
          iconColor="#FFFFFF"
          size={24}
          onPress={sendMessage}
          disabled={!draft.trim() || sending}
          style={[
            styles.sendButton,
            (!draft.trim() || sending) && styles.sendButtonDisabled,
          ]}
        />
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E6',
  },
  messagesContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  messageWrapper: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  myMessageWrapper: {
    justifyContent: 'flex-end',
  },
  theirMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  myMessage: {
    backgroundColor: '#8B0000',
    borderColor: '#FFD700',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFD700',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  theirMessage: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFD700',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#2C3E50',
  },
  messageTime: {
    fontSize: 10,
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
  myMessageTime: {
    color: '#FFFFFF',
  },
  theirMessageTime: {
    color: '#6C757D',
  },
  readIcon: {
    position: 'absolute',
    bottom: 4,
    right: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 2,
    borderTopColor: '#FFD700',
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#8B0000',
    margin: 0,
  },
  sendButtonDisabled: {
    backgroundColor: '#ADB5BD',
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    marginTop: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    color: '#ADB5BD',
    textAlign: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC3545',
    padding: 12,
    paddingHorizontal: 16,
  },
  errorBannerText: {
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
    fontSize: 13,
  },
});
