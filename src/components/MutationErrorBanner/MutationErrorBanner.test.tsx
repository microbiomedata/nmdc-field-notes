import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import config from "../../config";
import { render, screen, waitFor } from "@testing-library/react";
import MutationErrorBanner from "./MutationErrorBanner";
import userEvent from "@testing-library/user-event";
import { FakeErrorTestClient } from "../../mocks/fixtures";

const client = new FakeErrorTestClient();
const queryClient = new QueryClient();

interface Props {
  mutation: UseMutationResult<Response, Error, void, unknown>;
}
const TestComponent: React.FC<Props> = ({ mutation }) => {
  return (
    <>
      <button onClick={() => mutation.mutate()}>Trigger Mutation</button>
      <div data-testid="mutation-status">{mutation.status}</div>
      <div data-testid="error-banner">
        <MutationErrorBanner mutation={mutation}>
          Mutation Failed
        </MutationErrorBanner>
      </div>
    </>
  );
};

const ErrorTest: React.FC = () => {
  const mutation = useMutation({
    mutationFn: () => client.postError(),
  });
  return <TestComponent mutation={mutation} />;
};

const SuccessTest: React.FC = () => {
  const mutation = useMutation({
    mutationFn: () => client.postSuccess(),
  });
  return <TestComponent mutation={mutation} />;
};

test("MutationErrorBanner renders nothing when mutation idle", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ErrorTest />
    </QueryClientProvider>,
  );

  // Before the mutation is triggered, the error banner should not be visible
  expect(screen.getByTestId("mutation-status").textContent).toBe("idle");
  expect(screen.getByTestId("error-banner").textContent).toBe("");
});

test("MutationErrorBanner renders nothing while the mutation is pending", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ErrorTest />
    </QueryClientProvider>,
  );

  // When a mutation has been triggered but hasn't yet settled, the error banner should not be
  // visible
  await userEvent.click(screen.getByText("Trigger Mutation"));
  expect(screen.getByTestId("mutation-status").textContent).toBe("pending");
  expect(screen.getByTestId("error-banner").textContent).toBe("");
});

test("MutationErrorBanner renders nothing when the mutation succeeds", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <SuccessTest />
    </QueryClientProvider>,
  );

  await userEvent.click(screen.getByText("Trigger Mutation"));

  // Once a successful mutation settles, the error banner should not be visible
  await waitFor(() =>
    expect(screen.getByTestId("mutation-status").textContent).toBe("success"),
  );
  expect(screen.getByTestId("error-banner").textContent).toBe("");
});

test("MutationErrorBanner renders error message when mutation fails", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ErrorTest />
    </QueryClientProvider>,
  );

  await userEvent.click(screen.getByText("Trigger Mutation"));

  // Once a failing mutation settles the error banner should be visible with the message determined
  // by the component's children and should *not* be showing technical details (like the status
  // code)
  await waitFor(() =>
    expect(screen.getByTestId("mutation-status").textContent).toBe("error"),
  );
  const errorBanner = screen.getByTestId("error-banner");
  expect(errorBanner.textContent).toContain("Mutation Failed");
  expect(errorBanner.textContent).not.toContain("500");

  // Once the user clicks the "Show Details" button the error banner should show the technical
  // details
  const showDetailsButton = screen.getByText("Show Details");
  await userEvent.click(showDetailsButton);
  expect(errorBanner.textContent).toContain("500");
  expect(errorBanner.textContent).toContain("Something bad happened");
  expect(errorBanner.textContent).toContain(config.SUPPORT_EMAIL);
});
