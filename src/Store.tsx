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
import { Network } from "@capacitor/network";
import { TourId } from "./components/CustomTourProvider/CustomTourProvider";

enum StorageKey {
  REFRESH_TOKEN = "refreshToken",
  LOGGED_IN_USER = "loggedInUser",
  COLOR_PALETTE_MODE = "colorPaletteMode",
  HIDDEN_SLOTS = "hiddenSlots",
  PRESENTED_TOUR_IDS = "presentedTourIds",
}

interface StoreContextValue {
  store: Storage | null;

  isLoggedIn: boolean;
  loggedInUser: User | null;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;

  colorPaletteMode: ColorPaletteMode | null;
  setColorPaletteMode: (colorPaletteMode: ColorPaletteMode) => void;

  getHiddenSlotsForSchemaClass: (className: string) => string[] | undefined;
  setHiddenSlotsForSchemaClass: (
    className: string,
    hiddenSlots: string[],
  ) => void;

  checkWhetherTourHasBeenPresented: (tourId: TourId) => boolean;
  rememberTourHasBeenPresented: (tourId: TourId | null) => void;
  forgetTourHasBeenPresented: (tourId: TourId | null) => void;
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

  checkWhetherTourHasBeenPresented: () => {
    throw new Error(
      "checkWhetherTourHasBeenPresented called outside of provider",
    );
  },
  rememberTourHasBeenPresented: () => {
    throw new Error("rememberTourHasBeenPresented called outside of provider");
  },
  forgetTourHasBeenPresented: () => {
    throw new Error("forgetTourHasBeenPresented called outside of provider");
  },
});

const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [store, setStore] = useState<Storage | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [colorPaletteMode, setColorPaletteMode] =
    useState<ColorPaletteMode | null>(null);
  const [hiddenSlots, setHiddenSlots] = useState<Record<string, string[]>>({});
  const [presentedTourIds, setPresentedTourIds] = useState<Set<TourId>>(
    new Set(),
  );

  // Initialize the store.
  useEffect(() => {
    async function init() {
      // Setup browser storage.
      const storage = new Storage({
        name: "nmdc_field_notes",
        storeName: "app_store",
      });
      await storage.create();

      // If persistent storage contains an API refresh token, exchange it for an access token and
      // set the API client's bearer token. If the user is not online, this will be the only
      // indication that the user is logged in since the API client will not be able to fetch the
      // user's information.
      const userFromStorage = await storage.get(StorageKey.LOGGED_IN_USER);
      if (userFromStorage) {
        setLoggedInUser(userFromStorage);
      }

      // If persistent storage contains a refresh token, provide it to the API client.
      const refreshToken = await storage.get(StorageKey.REFRESH_TOKEN);
      if (refreshToken) {
        nmdcServerClient.setRefreshToken(refreshToken);
      }

      // If the user is online, attempt to exchange the refresh token for an access token. If
      // successful, update the context to reflect the currently logged-in user. If the exchange
      // fails, clear the logged-in user from the context and storage.
      // If the user is offline, we don't do anything here. We know the refresh token exchange
      // will fail so there's no need to attempt it. And we don't want to clear the logged-in user
      // from the context if it was loaded from storage. This allows a user to be "presumptively"
      // logged in if the app is opened while offline.
      const networkStatus = await Network.getStatus();
      if (networkStatus.connected) {
        try {
          const token = await nmdcServerClient.exchangeRefreshToken();
          nmdcServerClient.setTokens(token.access_token);
          await _updateLoggedInUser(storage);
        } catch (e) {
          await _clearLoggedInUser(storage);
        }
      }

      // If persistent storage contains a color palette mode, load that into the Context and
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

      // If persistent storage contains hidden slots, load them into the Context.
      const hiddenSlotsFromStorage = await storage.get(StorageKey.HIDDEN_SLOTS);
      if (hiddenSlotsFromStorage) {
        setHiddenSlots(hiddenSlotsFromStorage);
      }

      // If persistent storage contains presented tour IDs, load them into the Context.
      //
      // Note: If we were storing our `Set` into browser storage directly, we'd have to convert it into an array first.
      //       However, this `storage` object seems to be able to store and retrieve a `Set` as-is.
      //       So, we currently do not translate our `Set` into an `Array` and vice versa.
      //
      const presentedTourIdsFromStorage = await storage.get(
        StorageKey.PRESENTED_TOUR_IDS,
      );
      if (presentedTourIdsFromStorage instanceof Set) {
        setPresentedTourIds(presentedTourIdsFromStorage);
      }

      // This should be done last so that we can block rendering until in-memory state is fully
      // hydrated from the store
      setStore(storage);
    }

    init().then(() => console.debug("Storage is initialized"));
  }, []);

  /**
   * Update the context to reflect the currently logged-in user. This is ultimately determined by
   * the access token stored in the NmdcServerClient instance. If storage is provided, persist
   * the user to storage as well.
   *
   * @param storage
   */
  async function _updateLoggedInUser(storage: Storage | null) {
    const user = await nmdcServerClient.getCurrentUser();
    setLoggedInUser(user);
    if (storage) {
      await storage.set(StorageKey.LOGGED_IN_USER, user);
    }
  }

  /**
   * Update the context to reflect that no user is logged in. If storage is provided, remove the
   * logged-in user from storage as well.
   *
   * @param storage
   */
  async function _clearLoggedInUser(storage: Storage | null) {
    setLoggedInUser(null);
    if (storage) {
      await storage.remove(StorageKey.LOGGED_IN_USER);
    }
  }

  useEffect(() => {
    setIsLoggedIn(loggedInUser !== null);
  }, [loggedInUser]);

  /**
   * Update the context to reflect that a user is logged in, pass the provided access and refresh
   * tokens to the API client, and persist the refresh token to storage.
   *
   * @param accessToken
   * @param refreshToken
   */
  async function login(accessToken: string, refreshToken: string) {
    nmdcServerClient.setTokens(accessToken, refreshToken);
    await _updateLoggedInUser(store);
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
    nmdcServerClient.setTokens(null, null);
    await _clearLoggedInUser(store);
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
   * Returns a list of hidden slot names for the specified schema class or undefined if the given
   * class name is not in the hidden slots map yet. The implication is that `undefined` means the
   * user has not made any choice about which slots to hide for this schema class yet. Whereas an
   * empty array means the user has made a choice to hide no slots for this schema class.
   */
  function getHiddenSlotsForSchemaClass(
    className: string,
  ): string[] | undefined {
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

  /**
   * Returns `true` if the specified tour has been presented; otherwise returns `false`.
   *
   * @param tourId ID of the tour.
   */
  function checkWhetherTourHasBeenPresented(tourId: TourId) {
    return presentedTourIds.has(tourId);
  }

  /**
   * Remembers that a tour, or all tours, has been presented; and updates the Context and the store to reflect that.
   *
   * @param tourId ID of the tour you want to remember has been presented, or `null` to remember it for all tours.
   */
  async function rememberTourHasBeenPresented(tourId: TourId | null) {
    const nextPresentedTourIds = new Set(presentedTourIds);
    if (tourId !== null) {
      nextPresentedTourIds.add(tourId);
    } else {
      Object.values(TourId).forEach((tourId_) =>
        nextPresentedTourIds.add(tourId_),
      );
    }
    setPresentedTourIds(nextPresentedTourIds);
    if (store === null) {
      console.warn(
        "rememberTourHasBeenPresented called before storage initialization",
      );
      return;
    } else {
      return store.set(StorageKey.PRESENTED_TOUR_IDS, nextPresentedTourIds);
    }
  }

  /**
   * Forgets that a tour, or all tours, have been presented; and updates the Context and the store to reflect that.
   *
   * @param tourId ID of the tour you want to forget has been presented, or `null` to remember it for all tours.
   */
  async function forgetTourHasBeenPresented(tourId: TourId | null) {
    const nextPresentedTourIds = new Set(presentedTourIds);
    if (tourId !== null) {
      nextPresentedTourIds.delete(tourId);
    } else {
      nextPresentedTourIds.clear();
    }
    setPresentedTourIds(nextPresentedTourIds);
    if (store === null) {
      console.warn(
        "forgetTourHasBeenPresented called before storage initialization",
      );
      return;
    } else {
      return store.set(StorageKey.PRESENTED_TOUR_IDS, nextPresentedTourIds);
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

        checkWhetherTourHasBeenPresented,
        rememberTourHasBeenPresented,
        forgetTourHasBeenPresented,
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
