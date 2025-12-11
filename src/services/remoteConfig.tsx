import {
  getRemoteConfig,
  setConfigSettings,
  setDefaults,
  fetchAndActivate,
  getString,
} from '@react-native-firebase/remote-config';
import { Platform } from 'react-native';

export async function initRemoteConfig() {
  const configInstance = getRemoteConfig();

  await setConfigSettings(configInstance, {
    minimumFetchIntervalMillis: 3600000, // 1 hour
  });

  await setDefaults(configInstance, {
    min_supported_android_version: '0.0.0',
    min_supported_ios_version: '0.0.0',
  });

  await fetchAndActivate(configInstance);
}

export function getMinSupportedVersion(): string {
  const configInstance = getRemoteConfig();
  return Platform.OS === 'android'
    ? getString(configInstance, 'min_supported_android_version')
    : getString(configInstance, 'min_supported_ios_version');
}
