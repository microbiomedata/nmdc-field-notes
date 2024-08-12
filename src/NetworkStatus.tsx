import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Network } from "@capacitor/network";
import { PluginListenerHandle } from "@capacitor/core";
import { onlineManager } from "@tanstack/react-query";

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
      const initialStatus = await Network.getStatus();
      // If the component is unmounted before the previous await finishes, ignore the result and
      // do not set up a listener.
      if (ignore) {
        return;
      }

      // React Query does **not** get notified of the initial online status. It assumes an active
      // network connection by default. Since the app could be opened in an online state, we need to
      // inform React Query of the initial online status.
      // See: https://tanstack.com/query/latest/docs/reference/onlineManager
      onlineManager.setOnline(initialStatus.connected);
      setIsOnline(initialStatus.connected);

      listener = await Network.addListener("networkStatusChange", (status) => {
        // When the network status changes, React Query **should** be capable of tracking the
        // changes, but there shouldn't be any harm in manually updating the status here, just in
        // case. Then we know that Capacitor and React Query are in sync.
        onlineManager.setOnline(status.connected);
        setIsOnline(status.connected);
      });
    }

    void addNetworkListener();

    return () => {
      // If the component is unmounted after the listener is set up, remove it.
      if (listener) {
        void listener.remove();
      }

      // Always flag the component as unmounted when the cleanup function is called.
      ignore = true;
    };
  }, []);

  // Don't render the children until we know for certain the initial online status
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
