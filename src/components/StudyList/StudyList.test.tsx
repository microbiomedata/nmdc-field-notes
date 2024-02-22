import { render, waitFor } from "@testing-library/react";
import StudyList from "./StudyList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
        retry: false,
      },
    },
  });
  const TestWrapper: React.FC<PropsWithChildren> = ({ children }) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
  return TestWrapper;
};

test("StudyList should show study names", async () => {
  const { container } = render(<StudyList />, { wrapper: createWrapper() });
  await waitFor(() => expect(container).toHaveTextContent("TEST 1"));
  expect(container).toHaveTextContent("TEST 2");
});
