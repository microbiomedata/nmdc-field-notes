import React from "react";
import { KeepAwake } from "@capacitor-community/keep-awake";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import KeepAwakeSwitch from "./KeepAwakeSwitch";
import StoreProvider from "../../Store";

beforeEach(async () => {
  // KeepAwake needs to be mocked because otherwise isSupported will be false in the test
  // environment. We also want to spy on the keepAwake and allowSleep methods.
  vi.mock("@capacitor-community/keep-awake", () => ({
    KeepAwake: {
      isSupported: vi.fn().mockResolvedValue({ isSupported: true }),
      isKeptAwake: vi.fn(),
      keepAwake: vi.fn(),
      allowSleep: vi.fn(),
    },
  }));
});

afterEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

test("it should render the switch and labels", async () => {
  render(<KeepAwakeSwitch />);
  expect(screen.getByText("Keep Screen On")).toBeInTheDocument();
  // This needs to be awaited because the KeepAwake.isSupported() is async
  expect(
    await screen.findByText("May significantly increase battery usage"),
  ).toBeInTheDocument();
  expect(await screen.findByRole("switch")).toBeInTheDocument();
});

test("it should read the initial state from the store", async () => {
  window.localStorage.setItem(
    "nmdc_field_notes/app_store/isKeepAwakeOn",
    "true",
  );

  render(
    <StoreProvider>
      <KeepAwakeSwitch />
    </StoreProvider>,
  );

  await waitFor(() =>
    expect(screen.getByRole("switch").getAttribute("checked")).toBe("true"),
  );
});

test("it should persist the state to the store when toggled", async () => {
  render(
    <StoreProvider>
      <KeepAwakeSwitch />
    </StoreProvider>,
  );

  // Initially, the switch should not be checked
  const toggle = await screen.findByRole("switch");
  expect(toggle.getAttribute("checked")).toBe("false");

  // Toggle the switch
  await userEvent.click(toggle);
  expect(toggle.getAttribute("checked")).toBe("true");

  // Check to see that the KeepAwake plugin's keepAwake method was called
  expect(KeepAwake.keepAwake).toHaveBeenCalled();

  // Check if the state is persisted in localStorage
  expect(
    window.localStorage.getItem("nmdc_field_notes/app_store/isKeepAwakeOn"),
  ).toBe("true");

  // Toggle the switch back
  await userEvent.click(toggle);
  expect(toggle.getAttribute("checked")).toBe("false");

  // Check to see that the KeepAwake plugin's allowSleep method was called
  expect(KeepAwake.allowSleep).toHaveBeenCalled();

  // Check if the state is persisted in localStorage
  expect(
    window.localStorage.getItem("nmdc_field_notes/app_store/isKeepAwakeOn"),
  ).toBe("false");
});

test("it should disable the switch if KeepAwake is not supported", async () => {
  // Mock the KeepAwake.isSupported method to return false
  vi.mocked(KeepAwake.isSupported).mockResolvedValue({ isSupported: false });

  render(
    <StoreProvider>
      <KeepAwakeSwitch />
    </StoreProvider>,
  );

  const toggle = await screen.findByRole("switch");
  expect(toggle.getAttribute("disabled")).toBe("true");
  expect(
    screen.getByText("Setting not supported on this device"),
  ).toBeInTheDocument();
});
