import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import StoreProvider, { useStore } from "./Store";
import { nmdcServerClient } from "./api";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { server, tokenExchangeError } from "./mocks/server";

const TestStoreConsumer: React.FC = () => {
  const {
    login,
    logout,
    isLoggedIn,
    loggedInUser,
    store,
    getHiddenSlotsForSchemaClass,
    setHiddenSlotsForSchemaClass,
  } = useStore();

  const handleLoginClick = async () => {
    await login("access-token", "refresh-token");
  };

  const handleLogoutClick = async () => {
    await logout();
  };

  const soilHiddenSlots = getHiddenSlotsForSchemaClass("soil");
  const waterHiddenSlots = getHiddenSlotsForSchemaClass("water");

  return (
    <>
      <div data-testid="store-status">
        {store == null ? "waiting for store" : "store created"}
      </div>

      <div data-testid="is-logged-in">{isLoggedIn ? "true" : "false"}</div>
      <div data-testid="logged-in-user">{loggedInUser?.name}</div>
      <button data-testid="login-button" onClick={handleLoginClick}>
        Log in
      </button>
      <button data-testid="logout-button" onClick={handleLogoutClick}>
        Log out
      </button>

      <div data-testid="hidden-slots-soil">
        {soilHiddenSlots === undefined
          ? "undefined"
          : soilHiddenSlots.join(", ")}
      </div>
      <div data-testid="hidden-slots-water">
        {waterHiddenSlots === undefined
          ? "undefined"
          : waterHiddenSlots.join(", ")}
      </div>
      <button
        data-testid="set-hidden-slots-soil"
        onClick={() => setHiddenSlotsForSchemaClass("soil", ["slot1", "slot2"])}
      >
        Set soil slots
      </button>
    </>
  );
};

const renderTestStoreConsumer = () => {
  const setTokensSpy = vi.spyOn(nmdcServerClient, "setTokens");
  const user = userEvent.setup();

  render(
    <StoreProvider>
      <TestStoreConsumer />
    </StoreProvider>,
  );

  return {
    user,
    setTokensSpy,
    elements: {
      storeStatus: screen.getByTestId("store-status"),
      isLoggedIn: screen.getByTestId("is-logged-in"),
      loggedInUser: screen.getByTestId("logged-in-user"),
      loginButton: screen.getByTestId("login-button"),
      logoutButton: screen.getByTestId("logout-button"),
      hiddenSlotsSoil: screen.getByTestId("hidden-slots-soil"),
      hiddenSlotsWater: screen.getByTestId("hidden-slots-water"),
      setHiddenSlotsSoil: screen.getByTestId("set-hidden-slots-soil"),
    },
  };
};

// This test directly accesses window.localStorage to verify that certain storage keys are saved to
// persistent storage and re-hydrated on initialization. This is a bit of internal implementation
// knowledge. By default, @ionic/storage uses IndexedDB, but jsdom does not implement it
// (https://github.com/jsdom/jsdom/issues/1748). Without it, @ionic/storage will fall back to
// using localStorage.
describe("Store", () => {
  afterEach(() => {
    // In normal usage there is no need to call this method, but it is necessary here to ensure
    // that each test starts with a clean slate.
    nmdcServerClient.clearExchangeRefreshTokenCache();

    // Clear the storage after each test
    window.localStorage.clear();
  });

  it("should provide a null refreshToken by default", async () => {
    // Set up API client spy and render test component
    const { elements, setTokensSpy } = renderTestStoreConsumer();

    // Verify that the store gets initialized, the API token is not set, and the spy is not called
    await waitFor(() =>
      expect(elements.storeStatus.textContent).toBe("store created"),
    );
    expect(elements.isLoggedIn.textContent).toBe("false");
    expect(elements.loggedInUser.textContent).toBe("");
    expect(setTokensSpy).not.toHaveBeenCalled();
  });

  it("should provide a function to log in and log out", async () => {
    // Set up API client spy and render test component
    const { elements, setTokensSpy, user } = renderTestStoreConsumer();

    // Verify that the store gets initialized
    await waitFor(() =>
      expect(elements.storeStatus.textContent).toBe("store created"),
    );

    // Click the login button
    await user.click(elements.loginButton);

    // Verify that the in-memory store was updated, the API client was updated, and the refresh
    // token was persisted to storage
    expect(elements.isLoggedIn.textContent).toBe("true");
    expect(elements.loggedInUser.textContent).toBe("Test Testerson");
    expect(setTokensSpy).toHaveBeenCalledWith("access-token", "refresh-token");
    expect(
      window.localStorage.getItem("nmdc_field_notes/app_store/refreshToken"),
    ).toBe('"refresh-token"');

    // Click the logout button
    await user.click(elements.logoutButton);

    // Verify that the token was cleared, the spy to update the API client was called, and the token
    // was removed from storage
    expect(elements.isLoggedIn.textContent).toBe("false");
    expect(elements.loggedInUser.textContent).toBe("");
    expect(setTokensSpy).toHaveBeenCalledWith(null, null);
    expect(
      window.localStorage.getItem("nmdc_field_notes/app_store/refreshToken"),
    ).toBeNull();
  });

  it("should hydrate the refresh token from storage", async () => {
    // Pre-populate the storage with a token
    window.localStorage.setItem(
      "nmdc_field_notes/app_store/refreshToken",
      '"from-storage"',
    );

    // Render the test component
    const { elements, setTokensSpy } = renderTestStoreConsumer();

    // Verify that the store gets initialized with the pre-populated token and that it is used to
    // perform a token exchange
    await waitFor(() =>
      expect(elements.storeStatus.textContent).toBe("store created"),
    );
    expect(elements.isLoggedIn.textContent).toBe("true");
    expect(elements.loggedInUser.textContent).toBe("Test Testerson");
    expect(setTokensSpy).toHaveBeenCalledWith(
      "refreshed-access-token",
      "from-storage",
    );
  });

  it("should not hydrate the refresh token from storage if the token exchange fails", async () => {
    // Pre-populate the storage with a token
    window.localStorage.setItem(
      "nmdc_field_notes/app_store/refreshToken",
      '"from-storage"',
    );

    // Set up the mock server to return an error when exchanging the token
    server.use(tokenExchangeError);

    // Set up API client spy and render test component
    const { elements, setTokensSpy } = renderTestStoreConsumer();

    // Verify that the store gets initialized with the pre-populated token and that it is used to
    // perform a token exchange
    await waitFor(() =>
      expect(elements.storeStatus.textContent).toBe("store created"),
    );
    expect(elements.isLoggedIn.textContent).toBe("false");
    expect(elements.loggedInUser.textContent).toBe("");
    expect(setTokensSpy).not.toHaveBeenCalled();
  });

  it("getHiddenSlotsForSchemaClass should return undefined by default", async () => {
    const { elements } = renderTestStoreConsumer();

    await waitFor(() =>
      expect(elements.storeStatus.textContent).toBe("store created"),
    );
    expect(elements.hiddenSlotsWater.textContent).toBe("undefined");
    expect(elements.hiddenSlotsSoil.textContent).toBe("undefined");
  });

  it("getHiddenSlotsForSchemaClass should return values from storage if defined", async () => {
    window.localStorage.setItem(
      "nmdc_field_notes/app_store/hiddenSlots",
      '{"soil":["slotA","slotB"]}',
    );

    const { elements } = renderTestStoreConsumer();

    await waitFor(() =>
      expect(elements.storeStatus.textContent).toBe("store created"),
    );
    expect(elements.hiddenSlotsSoil.textContent).toBe("slotA, slotB");
    expect(elements.hiddenSlotsWater.textContent).toBe("undefined");
  });

  it("setHiddenSlotsForSchemaClass should update the store", async () => {
    const { elements, user } = renderTestStoreConsumer();

    await waitFor(() =>
      expect(elements.storeStatus.textContent).toBe("store created"),
    );
    expect(elements.hiddenSlotsSoil.textContent).toBe("undefined");
    expect(elements.hiddenSlotsWater.textContent).toBe("undefined");

    await user.click(elements.setHiddenSlotsSoil);

    expect(elements.hiddenSlotsSoil.textContent).toBe("slot1, slot2");
    expect(elements.hiddenSlotsWater.textContent).toBe("undefined");
    expect(
      window.localStorage.getItem("nmdc_field_notes/app_store/hiddenSlots"),
    ).toBe('{"soil":["slot1","slot2"]}');
  });
});
