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

// First, set a no-op event listener for react-query's onlineManager. This removes the default event
// listener that listens to `online` and `offline` events on the `window` object. We will manage
// the online state manually below using Capacitor's Network API.
//
// Second, react-query assumes an online state by default, but because the app can be opened in an
// offline state it's safer to assume an offline state by default.
//
// See: https://tanstack.com/query/latest/docs/reference/onlineManager
onlineManager.setEventListener(() => undefined);
onlineManager.setOnline(false);

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
    let isComponentUnmounted = false;
    let listener: PluginListenerHandle | null = null;

    async function addNetworkListener() {
      const initialStatus = await Network.getStatus();
      // If the component is unmounted before the previous await finishes, ignore the result and
      // do not set up a listener.
      if (isComponentUnmounted) {
        return;
      }

      // Set the initial online status
      onlineManager.setOnline(initialStatus.connected);
      setIsOnline(initialStatus.connected);

      // Update the online status when Capacitor's Network API reports a change
      listener = await Network.addListener("networkStatusChange", (status) => {
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
      isComponentUnmounted = true;
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
