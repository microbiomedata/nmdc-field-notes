import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Storage } from "@ionic/storage";
import { nmdcServerClient, User } from "./api";
import {
  applyColorPalette,
  ColorPaletteMode,
  isValidColorPaletteMode,
} from "./theme/colorPalette";
import { produce } from "immer";

enum StorageKey {
  REFRESH_TOKEN = "refreshToken",
  COLOR_PALETTE_MODE = "colorPaletteMode",
  HIDDEN_SLOTS = "hiddenSlots",
}

interface StoreContextValue {
  store: Storage | null;

  isLoggedIn: boolean;
  loggedInUser: User | null;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;

  colorPaletteMode: ColorPaletteMode | null;
  setColorPaletteMode: (colorPaletteMode: ColorPaletteMode) => void;

  getHiddenSlotsForSchemaClass: (className?: string) => string[] | undefined;
  setHiddenSlotsForSchemaClass: (
    className: string,
    hiddenSlots: string[],
  ) => void;
}

const StoreContext = createContext<StoreContextValue>({
  store: null,

  isLoggedIn: false,
  loggedInUser: null,
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

  getHiddenSlotsForSchemaClass: () => {
    throw new Error("getHiddenSlotsForSchemaClass called outside of provider");
  },
  setHiddenSlotsForSchemaClass: () => {
    throw new Error("setHiddenSlotsForSchemaClass called outside of provider");
  },
});

const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [store, setStore] = useState<Storage | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [colorPaletteMode, setColorPaletteMode] =
    useState<ColorPaletteMode | null>(null);
  const [hiddenSlots, setHiddenSlots] = useState<Record<string, string[]>>({});

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

      // If browser storage contains hidden slots, load them into the Context.
      const hiddenSlotsFromStorage = await storage.get(StorageKey.HIDDEN_SLOTS);
      if (hiddenSlotsFromStorage) {
        setHiddenSlots(hiddenSlotsFromStorage);
      }

      // This should be done last so that we can block rendering until in-memory state is fully
      // hydrated from the store
      setStore(storage);
    }

    init().then(() => console.debug("Storage is initialized"));
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      nmdcServerClient.getCurrentUser().then((user) => setLoggedInUser(user));
    } else {
      setLoggedInUser(null);
    }
  }, [isLoggedIn]);

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

  /**
   * Returns the hidden slots for the specified schema class.
   */
  function getHiddenSlotsForSchemaClass(className?: string) {
    if (className === undefined) {
      return undefined;
    }
    return hiddenSlots[className];
  }

  /**
   * Updates the hidden slots for the specified schema class in the Context and the store.
   */
  async function setHiddenSlotsForSchemaClass(
    className: string,
    slotNames: string[],
  ) {
    const updatedHiddenSlots = produce(hiddenSlots, (draft) => {
      draft[className] = slotNames;
    });

    setHiddenSlots(updatedHiddenSlots);
    if (store === null) {
      console.warn(
        "setHiddenSlotsForSchemaClass called before storage initialization",
      );
      return;
    } else {
      return store.set(StorageKey.HIDDEN_SLOTS, updatedHiddenSlots);
    }
  }

  return (
    <StoreContext.Provider
      value={{
        store,

        isLoggedIn,
        loggedInUser,
        login,
        logout,

        colorPaletteMode: colorPaletteMode,
        setColorPaletteMode: _setColorPaletteMode,

        getHiddenSlotsForSchemaClass,
        setHiddenSlotsForSchemaClass,
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
