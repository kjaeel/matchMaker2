import { useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import { initRemoteConfig, getMinSupportedVersion } from '../services/remoteConfig';
import { isVersionLower } from '../services/versionComapre';


export function useForcedUpdate() {
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        await initRemoteConfig();

        const localVersion = DeviceInfo.getVersion();
        const minVersion = getMinSupportedVersion();

        console.log('localVersion', localVersion);
        console.log('minVersion', minVersion);
        
        const updateNeeded = isVersionLower(localVersion, minVersion);

        setForceUpdate(updateNeeded);
      } catch (e) {
        console.warn("Remote config error:", e);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, []);

  return { forceUpdate, loading };
}
