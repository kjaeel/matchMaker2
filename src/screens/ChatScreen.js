import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { TextInput, IconButton, List } from 'react-native-paper';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: '1', from: 'them', text: 'Hi! Nice to connect.' },
    { id: '2', from: 'me', text: 'Hi! Likewise.' },
  ]);
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { id: String(Date.now()), from: 'me', text: draft }]);
    setDraft('');
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.text}
            description={item.from === 'me' ? 'You' : 'Match'}
            left={(props) => <List.Icon {...props} icon={item.from === 'me' ? 'account' : 'account-heart'} />}
          />
        )}
      />
      <View style={{ flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#eee' }}>
        <TextInput
          style={{ flex: 1, marginRight: 8 }}
          mode="outlined"
          placeholder="Type a message"
          value={draft}
          onChangeText={setDraft}
        />
        <IconButton mode="contained-tonal" icon="send" onPress={send} />
      </View>
    </View>
  );
}

