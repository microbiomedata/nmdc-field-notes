import React from "react";
import { render, waitFor } from "@testing-library/react";
import SampleList from "./SampleList";
import userEvent from "@testing-library/user-event";
import { generateSubmission } from "../../mocks/fixtures";

test("SampleList renders sample count", () => {
  const numSamples = 30;
  const { getByText } = render(
    <SampleList submission={generateSubmission(numSamples)} />,
  );
  expect(getByText(`Samples (${numSamples})`)).toBeInTheDocument();
});

test("SampleList renders samples in reverse order", () => {
  const { getAllByRole } = render(
    <SampleList submission={generateSubmission(30)} />,
  );
  const listItems = getAllByRole("heading");
  expect(listItems.length).toBeGreaterThan(2);
  expect(listItems[0]).toHaveTextContent("Loam 29");
  expect(listItems[1]).toHaveTextContent("Loam 28");
});

test("SampleList shows a collapsed list by default, can be expanded and collapsed", async () => {
  const numSamples = 18;
  const { getAllByRole, getByText } = render(
    <SampleList submission={generateSubmission(numSamples)} />,
  );
  let listItems = getAllByRole("heading");
  expect(listItems).toHaveLength(5);

  await userEvent.click(getByText("Show All"));

  listItems = getAllByRole("heading");
  expect(listItems).toHaveLength(numSamples);

  await userEvent.click(getByText("Show Less"));

  listItems = getAllByRole("heading");
  expect(listItems).toHaveLength(5);
});

test("SampleList can be filtered by search", async () => {
  const user = userEvent.setup();
  const { getAllByRole, getByTitle, queryByText } = render(
    <SampleList submission={generateSubmission(30)} />,
  );
  // Ensure we start with the collapsed list
  expect(queryByText("Show All")).toBeInTheDocument();

  // Click the search button and wait for the search in put to be present and focused
  await user.click(getByTitle("show sample search"));
  await waitFor(() =>
    expect(getByTitle("sample search").querySelector("input")).toHaveFocus(),
  );

  // Type the test search. This search verifies that the search string is tokenized on space, that
  // tokens are combined by AND, that it is case-insensitive and order-independent.
  await user.keyboard("2 silt");

  let listItems: HTMLElement[] = [];
  // This needs to be awaited because the search is debounced
  await waitFor(() => {
    listItems = getAllByRole("heading");
    expect(listItems).toHaveLength(3);
  });
  listItems.forEach((item) => {
    expect(item).toHaveTextContent("Silt");
  });

  // When the search is filtered to under the collapse cutoff, the show all button should be hidden
  expect(queryByText("Show All")).not.toBeInTheDocument();
});

test("SampleList shows all samples when search is cancelled", async () => {
  const user = userEvent.setup();
  const { getAllByRole, getByTitle, getByLabelText, queryByText } = render(
    <SampleList submission={generateSubmission(30)} />,
  );

  // Click the search button and wait for the search in put to be present and focused
  await user.click(getByTitle("show sample search"));
  await waitFor(() =>
    expect(getByTitle("sample search").querySelector("input")).toHaveFocus(),
  );

  // Type the test search
  await user.keyboard("clay 20");

  // Wait for search input to debounce and verify the result
  await waitFor(() => {
    expect(getAllByRole("heading")).toHaveLength(1);
  });

  // Cancel the search
  await user.click(getByLabelText("Cancel"));

  // Verify that all samples are shown
  expect(getAllByRole("heading")).toHaveLength(5);
  expect(queryByText("Show All")).toBeInTheDocument();
});

test("SampleList shows a message when no samples match search", async () => {
  const user = userEvent.setup();
  const { getByTitle, getByText } = render(
    <SampleList submission={generateSubmission(30)} />,
  );

  // Click the search button and wait for the search in put to be present and focused
  await user.click(getByTitle("show sample search"));
  await waitFor(() =>
    expect(getByTitle("sample search").querySelector("input")).toHaveFocus(),
  );

  // Type the test search
  await user.keyboard("salami on rye");

  // Wait for search input to debounce and verify the result
  await waitFor(() =>
    expect(getByText("No samples match search")).toBeInTheDocument(),
  );
});

test("SampleList shows a message when no samples exist", () => {
  const { getByText, queryByText } = render(
    <SampleList submission={generateSubmission(0)} />,
  );
  expect(getByText("No samples yet")).toBeInTheDocument();
  expect(queryByText("Show All")).not.toBeInTheDocument();
});
