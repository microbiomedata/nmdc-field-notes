import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Network } from "@capacitor/network";
import { PluginListenerHandle } from "@capacitor/core";

interface NetworkStatusContextValue {
  isOnline: boolean;
}

const NetworkStatusContext = createContext<NetworkStatusContextValue>({
  isOnline: true,
});

const NetworkStatusProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    // Used to prevent setting up the listener from being added from an unmounted component
    let ignore = false;
    let listener: PluginListenerHandle | null = null;

    async function addNetworkListener() {
      const currentStatus = await Network.getStatus();
      // If the component is unmounted before the previous await finishes, ignore the result and
      // no not set up a listener.
      if (ignore) {
        return;
      }
      setIsOnline(currentStatus.connected);

      listener = await Network.addListener("networkStatusChange", (status) => {
        setIsOnline(status.connected);
      });
    }

    void addNetworkListener();

    return () => {
      if (listener) {
        void listener.remove();
      }
      ignore = true;
    };
  }, []);

  if (isOnline === null) {
    return null;
  }

  return (
    <NetworkStatusContext.Provider value={{ isOnline }}>
      {children}
    </NetworkStatusContext.Provider>
  );
};

export default NetworkStatusProvider;

export const useNetworkStatus = () => {
  return useContext(NetworkStatusContext);
};
