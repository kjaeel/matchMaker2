import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';

export default function ForcedUpdateScreen() {
  const openStore = () => {
    const url = Platform.OS === 'android'
      ? 'market://details?id=com.yourapp'
      : 'itms-apps://apps.apple.com/app/idYOUR_APP_ID';

    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Required</Text>
      <Text style={styles.message}>
        A new version of this app is required to continue.
      </Text>

      <TouchableOpacity onPress={openStore} style={styles.button}>
        <Text style={styles.buttonText}>Update Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    color: '#444',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
});
