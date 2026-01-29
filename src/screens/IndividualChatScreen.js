import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { TextInput, IconButton, Avatar, ActivityIndicator } from 'react-native-paper';
import { subscribeToMessages, sendMessage, markMessagesAsRead, logEvent } from '../services/firebase';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function IndividualChatScreen({ route, navigation }) {
  const { chatId, otherUserId, otherUserName } = route.params;
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    // Log analytics
    logEvent('chat_screen_opened', { chatId, otherUserId });

    const unsubscribe = subscribeToMessages(chatId, (messageList) => {
      setMessages(messageList);
      setLoading(false);
      
      // Scroll to bottom when new messages arrive
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    // Mark messages as read when screen is opened
    if (user?.id) {
      markMessagesAsRead(chatId, user.id);
    }

    return () => unsubscribe();
  }, [chatId, user?.id, otherUserId]);

  useEffect(() => {
    // Set header title
    navigation.setOptions({
      title: otherUserName || 'Chat',
      headerStyle: {
        backgroundColor: '#7b2cbf',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, otherUserName]);

  const handleSend = async () => {
    if (!inputText.trim() || sending || !user?.id) return;

    const messageText = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      await sendMessage(chatId, user.id, messageText);
      // Log analytics
      await logEvent('message_sent', { chatId, messageLength: messageText.length });
    } catch (error) {
      console.error('Error sending message:', error);
      setInputText(messageText); // Restore text on error
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const renderMessage = ({ item: message }) => {
    const isMyMessage = message.senderId === user?.id;
    const messageTime = formatTime(message.timestamp);

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {message.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTime,
                isMyMessage ? styles.myMessageTime : styles.otherMessageTime,
              ]}
            >
              {messageTime}
            </Text>
            {isMyMessage && (
              <Icon
                name={message.read ? 'check-all' : 'check'}
                size={14}
                color={message.read ? '#4CAF50' : '#999'}
                style={styles.readIcon}
              />
            )}
          </View>
        </View>
      </View>
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="chat-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>
        }
      />
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            mode="outlined"
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            style={styles.textInput}
            contentStyle={styles.textInputContent}
            multiline
            maxLength={1000}
            onSubmitEditing={handleSend}
            editable={!sending}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
            style={[
              styles.sendButton,
              (!inputText.trim() || sending) && styles.sendButtonDisabled,
            ]}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon name="send" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5ddd5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  myMessageBubble: {
    backgroundColor: '#dcf8c6',
    borderTopRightRadius: 0,
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#000',
  },
  otherMessageText: {
    color: '#000',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'flex-end',
  },
  messageTime: {
    fontSize: 11,
    marginRight: 4,
  },
  myMessageTime: {
    color: '#666',
  },
  otherMessageTime: {
    color: '#999',
  },
  readIcon: {
    marginLeft: 2,
  },
  inputContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    marginRight: 8,
    maxHeight: 100,
    backgroundColor: '#fff',
  },
  textInputContent: {
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: '#7b2cbf',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
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
  },
});




