import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { TextInput, IconButton, Surface, Text, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/theme';
import { AuthContext } from '../context/AuthContext';
import { conversationAPI, messageAPI } from '../services/api';

function ChatDetailScreen({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const chat = route?.params?.chat;

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Initialize conversation and load messages
  useEffect(() => {
    initializeConversation();
  }, []);

  const initializeConversation = async () => {
    console.log('=== INITIALIZING CONVERSATION ===');
    console.log('user:', user);
    console.log('user.id:', user?.id);
    console.log('chat:', chat);
    console.log('chat.otherUserId:', chat?.otherUserId);
    
    if (!user?.id || !chat?.otherUserId) {
      console.log('❌ Missing user information');
      console.log('  - user?.id:', user?.id);
      console.log('  - chat?.otherUserId:', chat?.otherUserId);
      setError('Missing user information');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create or get conversation - use String IDs
      const userAId = String(user.id);
      const userBId = String(chat.otherUserId);
      
      console.log('📡 Creating/getting conversation with:');
      console.log('  - userA:', userAId);
      console.log('  - userB:', userBId);
      
      const convResult = await conversationAPI.createOrGetConversation(
        userAId,
        userBId
      );

      console.log('📥 Conversation API Response:', JSON.stringify(convResult, null, 2));

      if (!convResult.success) {
        console.log('❌ Failed to create conversation:', convResult.error);
        throw new Error(convResult.error || 'Failed to create conversation');
      }

      const conversation = convResult.data;
      console.log('📋 Conversation data:', JSON.stringify(conversation, null, 2));
      console.log('📋 Conversation data type:', typeof conversation);
      
      // Handle both cases: API returns string ID directly OR object with id field
      let convId;
      if (typeof conversation === 'string') {
        // API returns the conversation ID as a string directly
        convId = conversation;
        console.log('✅ Conversation ID (string):', convId);
      } else if (conversation && typeof conversation === 'object') {
        // API returns an object with id or conversationId field
        convId = conversation.id || conversation.conversationId;
        console.log('✅ Conversation ID (object):', convId);
      } else {
        console.log('❌ Conversation ID is undefined!');
        throw new Error('Conversation ID not found in response');
      }
      
      if (!convId) {
        console.log('❌ Conversation ID is undefined!');
        throw new Error('Conversation ID not found in response');
      }
      
      console.log('✅ Final Conversation ID:', convId);
      setConversationId(convId);

      // Load message history
      console.log('📥 Loading messages for conversation:', convId);
      await loadMessages(convId);
    } catch (err) {
      console.error('❌ Error initializing conversation:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (convId) => {
    try {
      const result = await messageAPI.getMessages(convId);
      
      if (result.success && result.data) {
        // Transform API messages to our format
        // Compare senderId with current user's id (ensure both are strings)
        const currentUserId = String(user.id);
        const transformedMessages = result.data.map((msg) => ({
          id: String(msg.id || Date.now()),
          from: String(msg.senderId) === currentUserId ? 'me' : 'them',
          text: msg.text || '',
          timestamp: msg.timestamp || msg.createdAt,
        }));
        setMessages(transformedMessages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setMessages([]);
    }
  };

  const send = async () => {
    console.log('=== SEND BUTTON CLICKED ===');
    console.log('draft:', draft);
    console.log('conversationId:', conversationId);
    console.log('user.id:', user?.id);
    console.log('sending:', sending);
    
    if (!draft.trim()) {
      console.log('❌ Draft is empty');
      return;
    }
    
    if (!conversationId) {
      console.log('❌ conversationId is undefined!');
      setError('Conversation not initialized. Please wait...');
      return;
    }
    
    if (!user?.id) {
      console.log('❌ user.id is undefined!');
      setError('User not logged in');
      return;
    }
    
    if (sending) {
      console.log('❌ Already sending...');
      return;
    }

    const messageText = draft.trim();
    setDraft('');
    setSending(true);

    try {
      console.log('📤 Sending message...');
      console.log('  - conversationId:', conversationId);
      console.log('  - senderId:', user.id);
      console.log('  - text:', messageText);
      
      // Optimistically add message to UI
      const tempMessage = {
        id: String(Date.now()),
        from: 'me',
        text: messageText,
      };
      setMessages((prev) => [tempMessage, ...prev]);

      // Send to API - use user.id as senderId (current logged-in user)
      const senderId = String(user.id);
      console.log('📡 Calling messageAPI.sendMessage with:', {
        conversationId,
        senderId,
        messageText
      });
      
      const result = await messageAPI.sendMessage(
        conversationId,
        senderId,
        messageText
      );

      console.log('📥 API Response:', JSON.stringify(result, null, 2));

      if (!result.success) {
        console.log('❌ API returned error:', result.error);
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
        setDraft(messageText); // Restore draft
        throw new Error(result.error || 'Failed to send message');
      }

      console.log('✅ Message sent successfully! Reloading messages...');
      // Reload messages to get the actual message from server
      await loadMessages(conversationId);
    } catch (err) {
      console.error('❌ Error sending message:', err);
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.from === 'me';
    return (
      <View
        style={[
          styles.messageRow,
          isMe ? styles.messageRowMe : styles.messageRowThem,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.messageBubbleMe : styles.messageBubbleThem,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMe ? styles.messageTextMe : styles.messageTextThem,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <Icon name="account-heart" size={22} color={colors.white} />
          </View>
          <View style={styles.headerText}>
            <Text variant="titleMedium" style={styles.headerTitle}>
              {chat?.name || 'Chat'}
            </Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>
              Traditional match conversation
            </Text>
          </View>
        </View>
      </Surface>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Loading messages...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={48} color={colors.error} />
          <Text variant="bodyLarge" style={styles.errorText}>
            {error}
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted
        />
      )}

      <Surface style={styles.inputBar} elevation={4}>
        <TextInput
          style={styles.input}
          mode="outlined"
          placeholder="Type a message"
          value={draft}
          onChangeText={setDraft}
          outlineColor={colors.secondary}
          activeOutlineColor={colors.primary}
        />
        <IconButton
          icon="send"
          size={24}
          iconColor={colors.white}
          style={styles.sendButton}
          onPress={send}
          disabled={sending || !draft.trim()}
        />
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 0,
    backgroundColor: colors.surfaceGold,
    borderWidth: 3,
    borderColor: colors.secondary,
    padding: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: '700',
    color: colors.primary,
    fontSize: 16,
  },
  headerSubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageRow: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowThem: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  messageBubbleMe: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
    borderWidth: 2,
  },
  messageBubbleThem: {
    backgroundColor: colors.surfaceGold,
    borderColor: colors.secondary,
    borderWidth: 2,
  },
  messageText: {
    fontSize: 14,
  },
  messageTextMe: {
    color: colors.white,
  },
  messageTextThem: {
    color: colors.text.primary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: colors.surface,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  errorText: {
    marginTop: 16,
    color: colors.error,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ChatDetailScreen;
