import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import config from "../../config";
import { render, screen, waitFor } from "@testing-library/react";
import QueryErrorBanner from "./QueryErrorBanner";
import userEvent from "@testing-library/user-event";
import { FakeErrorTestClient } from "../../mocks/fixtures";

const client = new FakeErrorTestClient();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

interface Props {
  query: UseQueryResult;
}
const TestComponent: React.FC<Props> = ({ query }) => {
  return (
    <>
      <div data-testid="query-status">{query.status}</div>
      <div data-testid="error-banner">
        <QueryErrorBanner query={query}>Query Failed</QueryErrorBanner>
      </div>
    </>
  );
};

const ErrorTest: React.FC = () => {
  const queryError = useQuery({
    queryKey: ["test-error"],
    queryFn: () => client.getError(),
  });
  return <TestComponent query={queryError} />;
};

const SuccessTest: React.FC = () => {
  const querySuccess = useQuery({
    queryKey: ["test-success"],
    queryFn: () => client.getSuccess(),
  });
  return <TestComponent query={querySuccess} />;
};

test("QueryErrorBanner renders nothing when query is fetching", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ErrorTest />
    </QueryClientProvider>,
  );

  // Before the query settles, the error banner should not be visible
  expect(screen.getByTestId("query-status").textContent).toBe("pending");
  expect(screen.getByTestId("error-banner").textContent).toBe("");
});

test("QueryErrorBanner renders nothing when query is successful", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <SuccessTest />
    </QueryClientProvider>,
  );

  // After a successful query settles, the error banner should not be visible
  await waitFor(() =>
    expect(screen.getByTestId("query-status").textContent).toBe("success"),
  );
  expect(screen.getByTestId("error-banner").textContent).toBe("");
});

test("QueryErrorBanner renders error message when query fails", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ErrorTest />
    </QueryClientProvider>,
  );

  // Once a failing query settles the error banner should be visible with the message determined by
  // the component's children and should *not* be showing technical details (like the status code)
  await waitFor(() =>
    expect(screen.getByTestId("query-status").textContent).toBe("error"),
  );
  const errorBanner = screen.getByTestId("error-banner");
  expect(errorBanner.textContent).toContain("Query Failed");
  expect(errorBanner.textContent).not.toContain("500");

  // Once the user clicks the "Show Details" button the error banner should show the technical
  // details
  const showDetailsButton = screen.getByText("Show Details");
  await userEvent.click(showDetailsButton);
  expect(errorBanner.textContent).toContain("500");
  expect(errorBanner.textContent).toContain("Something bad happened");
  expect(errorBanner.textContent).toContain(config.SUPPORT_EMAIL);
});
