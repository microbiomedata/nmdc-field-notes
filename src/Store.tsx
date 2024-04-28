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
  applyColorPalette,
  ColorPaletteMode,
  isValidColorPaletteMode,
} from "./theme/colorPalette";

enum StorageKey {
  API_TOKEN = "apiToken",
  COLOR_PALETTE_MODE = "colorPaletteMode",
}

interface StoreContextValue {
  store: Storage | null;
  apiToken: string | null;
  setApiToken: (token: string | null) => Promise<void>;
  colorPaletteMode: ColorPaletteMode | null;
  setColorPaletteMode: (colorPaletteMode: ColorPaletteMode) => void;
}

const StoreContext = createContext<StoreContextValue>({
  store: null,
  apiToken: null,
  setApiToken: () => {
    throw new Error("setApiToken called outside of provider");
  },
  colorPaletteMode: null,
  setColorPaletteMode: () => {
    throw new Error("setColorPaletteMode called outside of provider");
  },
});

const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [store, setStore] = useState<Storage | null>(null);
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [colorPaletteMode, setColorPaletteMode] =
    useState<ColorPaletteMode | null>(null);

  // TODO: Define storage keys in an Enum to avoid collisions and facilitate maintenance.

  useEffect(() => {
    async function init() {
      const storage = new Storage({
        name: "nmdc_field_notes",
        storeName: "app_store",
      });
      await storage.create();
      const token = await storage.get(StorageKey.API_TOKEN);
      setApiToken(token || null);
      if (token) {
        nmdcServerClient.setBearerToken(token);
      }

      const colorPaletteModeFromStorage = await storage.get(
        StorageKey.COLOR_PALETTE_MODE,
      );
      const sanitizedColorPaletteMode = isValidColorPaletteMode(
        colorPaletteModeFromStorage,
      )
        ? colorPaletteModeFromStorage
        : ColorPaletteMode.Light;
      setColorPaletteMode(sanitizedColorPaletteMode);
      applyColorPalette(sanitizedColorPaletteMode);

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
    return store.set(StorageKey.API_TOKEN, token);
  }

  async function _setColorPaletteMode(colorPaletteMode: ColorPaletteMode) {
    setColorPaletteMode(colorPaletteMode);
    applyColorPalette(colorPaletteMode);
    if (store === null) {
      console.warn("setColorPaletteMode called before storage initialization");
      return;
    } else {
      return store.set(StorageKey.COLOR_PALETTE_MODE, colorPaletteMode);
    }
  }

  return (
    <StoreContext.Provider
      value={{
        store,
        apiToken,
        setApiToken: _setApiToken,
        colorPaletteMode: colorPaletteMode,
        setColorPaletteMode: _setColorPaletteMode,
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
