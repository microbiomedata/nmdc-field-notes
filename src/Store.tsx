import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Storage } from "@ionic/storage";
import { nmdcServerClient } from "./api";
import {
  activateColorScheme,
  ColorScheme,
  isValidColorScheme,
} from "./theme/colorScheme";

interface StoreContextValue {
  store: Storage | null;
  apiToken: string | null;
  setApiToken: (token: string | null) => Promise<void>;
  colorScheme: ColorScheme | null;
  setColorScheme: (colorScheme: ColorScheme) => void;
}

const StoreContext = createContext<StoreContextValue>({
  store: null,
  apiToken: null,
  setApiToken: () => {
    throw new Error("setApiToken called outside of provider");
  },
  colorScheme: null,
  setColorScheme: () => {
    throw new Error("setColorScheme called outside of provider");
  },
});

const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [store, setStore] = useState<Storage | null>(null);
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [colorScheme, setColorScheme] = useState<ColorScheme | null>(null);

  // TODO: Define storage keys in an Enum to avoid collisions and facilitate maintenance.

  useEffect(() => {
    async function init() {
      const storage = new Storage({
        name: "nmdc_field_notes",
        storeName: "app_store",
      });
      await storage.create();
      const token = await storage.get("apiToken");
      setApiToken(token || null);
      if (token) {
        nmdcServerClient.setBearerToken(token);
      }

      const colorSchemeFromStorage = await storage.get("colorScheme");
      const sanitizedColorScheme = isValidColorScheme(colorSchemeFromStorage)
        ? colorSchemeFromStorage
        : ColorScheme.Light;
      setColorScheme(sanitizedColorScheme);
      activateColorScheme(sanitizedColorScheme);

      // This should be done last so that we can block rendering until in-memory state is fully
      // hydrated from the store
      setStore(storage);
    }

    init();
  }, []);

  async function _setApiToken(token: string | null) {
    setApiToken(token);
    if (token) {
      nmdcServerClient.setBearerToken(token);
    }
    if (!store) {
      console.warn("setApiToken called before storage initialization");
      return;
    }
    return store.set("apiToken", token);
  }

  async function _setColorScheme(colorScheme: ColorScheme) {
    setColorScheme(colorScheme);
    activateColorScheme(colorScheme);
    if (store === null) {
      console.warn("setColorScheme called before storage initialization");
      return undefined;
    } else {
      return store.set("colorScheme", colorScheme);
    }
  }

  return (
    <StoreContext.Provider
      value={{
        store,
        apiToken,
        setApiToken: _setApiToken,
        colorScheme,
        setColorScheme: _setColorScheme,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;

export const useStore = () => {
  return useContext(StoreContext);
};
