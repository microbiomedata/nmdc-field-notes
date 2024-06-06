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
  REFRESH_TOKEN = "refreshToken",
  COLOR_PALETTE_MODE = "colorPaletteMode",
}

interface StoreContextValue {
  store: Storage | null;
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  colorPaletteMode: ColorPaletteMode | null;
  setColorPaletteMode: (colorPaletteMode: ColorPaletteMode) => void;
}

const StoreContext = createContext<StoreContextValue>({
  store: null,
  isLoggedIn: false,
  login: () => {
    throw new Error("login called outside of provider");
  },
  logout: () => {
    throw new Error("logout called outside of provider");
  },
  colorPaletteMode: null,
  setColorPaletteMode: () => {
    throw new Error("setColorPaletteMode called outside of provider");
  },
});

const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [store, setStore] = useState<Storage | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [colorPaletteMode, setColorPaletteMode] =
    useState<ColorPaletteMode | null>(null);

  // Initialize the store.
  useEffect(() => {
    async function init() {
      // Setup browser storage.
      const storage = new Storage({
        name: "nmdc_field_notes",
        storeName: "app_store",
      });
      await storage.create();

      // If browser storage contains an API refresh token, exchange it for an access token and
      // set the API client's bearer token.
      const refreshToken = await storage.get(StorageKey.REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const token =
            await nmdcServerClient.exchangeRefreshToken(refreshToken);
          setIsLoggedIn(true);
          nmdcServerClient.setTokens(token.access_token, refreshToken);
        } catch (e) {
          console.debug("Failed to exchange refresh token for access token", e);
          await storage.remove(StorageKey.REFRESH_TOKEN);
        }
      }

      // If browser storage contains a color palette mode, load that into the Context and
      // apply the corresponding color palette to the UI.
      const colorPaletteModeFromStorage = await storage.get(
        StorageKey.COLOR_PALETTE_MODE,
      );
      const sanitizedColorPaletteMode = isValidColorPaletteMode(
        colorPaletteModeFromStorage,
      )
        ? colorPaletteModeFromStorage
        : ColorPaletteMode.System;
      setColorPaletteMode(sanitizedColorPaletteMode);
      applyColorPalette(sanitizedColorPaletteMode);

      // This should be done last so that we can block rendering until in-memory state is fully
      // hydrated from the store
      setStore(storage);
    }

    init().then(() => console.debug("Storage is initialized"));
  }, []);

  /**
   * Update the context to reflect that a user is logged in, pass the provided access and refresh
   * tokens to the API client, and persist the refresh token to storage.
   *
   * @param accessToken
   * @param refreshToken
   */
  async function login(accessToken: string, refreshToken: string) {
    setIsLoggedIn(true);
    nmdcServerClient.setTokens(accessToken, refreshToken);
    if (!store) {
      console.warn("login called before storage initialization");
      return;
    }
    await store.set(StorageKey.REFRESH_TOKEN, refreshToken);
  }

  /**
   * Update the context to reflect that a user is logged out, clear the tokens from the API client,
   * and remove the refresh token from storage.
   */
  async function logout() {
    setIsLoggedIn(false);
    nmdcServerClient.setTokens(null, null);
    if (!store) {
      console.warn("logout called before storage initialization");
      return;
    }
    await store.remove(StorageKey.REFRESH_TOKEN);
  }

  /**
   * Updates the Context and the store so they each contain the specified color palette mode,
   * and applies the corresponding color palette to the UI.
   */
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
        isLoggedIn,
        login,
        logout,
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
