import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import StoreProvider, { useStore } from "./Store";
import { nmdcServerClient } from "./api";
import { vi } from "vitest";

const TestStoreConsumer: React.FC = () => {
  const { apiToken, setApiToken, store } = useStore();
  const [callbackComplete, setCallbackComplete] = React.useState(false);

  const handleClick = async () => {
    await setApiToken("test");
    setCallbackComplete(true);
  };

  return (
    <>
      <div data-testid="store-status">
        {store == null ? "waiting for store" : "store created"}
      </div>
      <div data-testid="api-token">{apiToken}</div>
      <button data-testid="set-api-token" onClick={handleClick}>
        Set Token
      </button>
      <div data-testid="callback-status">
        {callbackComplete ? "callback complete" : "waiting for callback"}
      </div>
    </>
  );
};

const renderTestStoreConsumer = () => {
  return render(
    <StoreProvider>
      <TestStoreConsumer />
    </StoreProvider>,
  );
};

// This test directly accesses window.localStorage to verify that certain storage keys are saved to
// persistent storage and re-hydrated on initialization. This is a bit of internal implementation
// knowledge. By default, @ionic/storage uses IndexedDB, but jsdom does not implement it
// (https://github.com/jsdom/jsdom/issues/1748). Without it, @ionic/storage will fall back to
// using localStorage.
describe("Store", () => {
  it("should provide a null apiToken by default", async () => {
    // Set up API client spy and render test component
    const spy = vi.spyOn(nmdcServerClient, "setBearerToken");
    const { getByTestId } = renderTestStoreConsumer();

    // Verify that the store gets initialized, the API token is not set, and the spy is not called
    await waitFor(() =>
      expect(getByTestId("store-status").textContent).toBe("store created"),
    );
    expect(getByTestId("api-token").textContent).toBe("");
    expect(spy).not.toHaveBeenCalled();
  });

  it("should provide a function to update the apiToken", async () => {
    // Set up API client spy and render test component
    const spy = vi.spyOn(nmdcServerClient, "setBearerToken");
    const { getByTestId } = renderTestStoreConsumer();

    // Verify that the store gets initialized
    await waitFor(() =>
      expect(getByTestId("store-status").textContent).toBe("store created"),
    );

    // Click the button which sets the token
    fireEvent.click(getByTestId("set-api-token"));
    await waitFor(() =>
      expect(getByTestId("callback-status").textContent).toBe(
        "callback complete",
      ),
    );

    // Verify that the token was set, the spy to update the API client was called, and the token
    // was saved to storage
    expect(getByTestId("api-token").textContent).toBe("test");
    expect(spy).toHaveBeenCalledWith("test");
    expect(
      window.localStorage.getItem("nmdc_field_notes/app_store/apiToken"),
    ).toBe('"test"');
  });

  it("should hydrate the apiToken from storage", async () => {
    // Pre-populate the storage with a token
    window.localStorage.setItem(
      "nmdc_field_notes/app_store/apiToken",
      '"from-storage"',
    );

    // Render the test component
    const { getByTestId } = renderTestStoreConsumer();

    // Verify that the store gets initialized with the pre-populated token
    await waitFor(() =>
      expect(getByTestId("store-status").textContent).toBe("store created"),
    );
    expect(getByTestId("api-token").textContent).toBe("from-storage");
  });
});