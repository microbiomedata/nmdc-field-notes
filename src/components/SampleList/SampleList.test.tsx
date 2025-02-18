import React, { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SampleList from "./SampleList";
import userEvent from "@testing-library/user-event";
import { generateSubmission } from "../../mocks/fixtures";
import { vi } from "vitest";
import { produce } from "immer";

interface Props {
  numberOfSamples: number;
  onSampleCreate: () => void;
}
const TestSampleList: React.FC<Props> = ({
  numberOfSamples,
  onSampleCreate,
}) => {
  const [submission, setSubmission] = useState(
    generateSubmission(numberOfSamples),
  );
  const [newSampleNumber, setNewSampleNumber] = useState(1);

  const handleUpdateSubmission = () => {
    setSubmission(
      produce((draft) => {
        draft.metadata_submission.sampleData.soil_data.push({
          samp_name: `New Sample ${newSampleNumber}`,
        });
      }),
    );
    setNewSampleNumber((n) => n + 1);
  };
  return (
    <>
      <button onClick={handleUpdateSubmission}>Update Submission</button>
      <SampleList
        submission={submission}
        onSampleCreate={onSampleCreate}
        tourAllowed={false}
      />
    </>
  );
};

async function renderSampleList(numberOfSamples: number) {
  const user = userEvent.setup();
  const handleSampleCreate = vi.fn();
  render(
    <TestSampleList
      numberOfSamples={numberOfSamples}
      onSampleCreate={handleSampleCreate}
    />,
  );

  const searchInput = await screen.findByLabelText("search text");
  const showSearchButton = screen.getByTitle("show sample search");
  const newSampleButton = screen.getByText("New");
  const updateSubmissionButton = screen.getByText("Update Submission");

  return {
    user,
    handleSampleCreate,
    elements: {
      searchInput,
      showSearchButton,
      newSampleButton,
      updateSubmissionButton,
      // These elements are conditionally rendered, so we use getters to re-query
      // them whenever they are needed
      get showAllButton() {
        return screen.getByText("Show All");
      },
      get showLessButton() {
        return screen.getByText("Show Less");
      },
      get listItems() {
        return screen.getAllByRole("heading");
      },
    },
  };
}

test("SampleList renders sample count", async () => {
  const numSamples = 30;
  await renderSampleList(numSamples);
  expect(screen.getByText(`Samples (${numSamples})`)).toBeInTheDocument();
});

test("SampleList renders samples in reverse order", async () => {
  await renderSampleList(30);
  const listItems = screen.getAllByRole("heading");
  expect(listItems.length).toBeGreaterThan(2);
  expect(listItems[0]).toHaveTextContent("Loam 29");
  expect(listItems[1]).toHaveTextContent("Loam 28");
});

test("SampleList shows a collapsed list by default, can be expanded and collapsed", async () => {
  const numSamples = 18;
  const { user, elements } = await renderSampleList(numSamples);
  expect(elements.listItems).toHaveLength(5);

  await user.click(elements.showAllButton);
  expect(elements.listItems).toHaveLength(numSamples);

  await user.click(elements.showLessButton);
  expect(elements.listItems).toHaveLength(5);
});

test("SampleList can be filtered by search", async () => {
  const { user, elements } = await renderSampleList(30);
  // Ensure we start with the collapsed list
  expect(elements.showAllButton).toBeInTheDocument();

  // Click the search button and wait for the search in put to be present and focused
  await user.click(elements.showSearchButton);
  await waitFor(() => expect(elements.searchInput).toHaveFocus());

  // Type the test search. This search verifies that the search string is tokenized on space, that
  // tokens are combined by AND, that it is case-insensitive and order-independent.
  await user.keyboard("2 silt");

  // This needs to be awaited because the search is debounced
  await waitFor(() => expect(elements.listItems).toHaveLength(3));
  elements.listItems.forEach((item) => {
    expect(item).toHaveTextContent("Silt");
  });

  // When the search is filtered to under the collapse cutoff, the show all button should be hidden
  expect(screen.queryByText("Show All")).not.toBeInTheDocument();
});

test("SampleList search index is updated after submission update", async () => {
  const { user, elements } = await renderSampleList(30);
  // Ensure we start with the collapsed list
  expect(elements.showAllButton).toBeInTheDocument();

  // Click the update submission button twice to trigger a new samples being added to the submission
  await user.click(elements.updateSubmissionButton);
  await user.click(elements.updateSubmissionButton);

  // Click the search button and wait for the search in put to be present and focused
  await user.click(elements.showSearchButton);
  await waitFor(() => expect(elements.searchInput).toHaveFocus());

  // Type the test search to find the newly added sample
  await user.keyboard("new");

  // This needs to be awaited because the search is debounced
  await waitFor(() => expect(elements.listItems).toHaveLength(2));
  elements.listItems.forEach((item) => {
    expect(item).toHaveTextContent("New");
  });
});

test("SampleList shows all samples when search is cancelled", async () => {
  const { user, elements } = await renderSampleList(30);

  // Click the search button and wait for the search in put to be present and focused
  await user.click(elements.showSearchButton);
  await waitFor(() => expect(elements.searchInput).toHaveFocus());

  // Type the test search
  await user.keyboard("clay 20");

  // Wait for search input to debounce and verify the result
  await waitFor(() => expect(elements.listItems).toHaveLength(1));

  // Cancel the search
  await user.click(screen.getByLabelText("Cancel"));

  // Verify that all samples are shown
  expect(elements.listItems).toHaveLength(5);
  expect(elements.showAllButton).toBeInTheDocument();
});

test("SampleList shows a message when no samples match search", async () => {
  const { user, elements } = await renderSampleList(30);

  // Click the search button and wait for the search in put to be present and focused
  await user.click(elements.showSearchButton);
  await waitFor(() => expect(elements.searchInput).toHaveFocus());

  // Type the test search
  await user.keyboard("salami on rye");

  // Wait for search input to debounce and verify the result
  const noResults = await screen.findByText("No samples match search");
  expect(noResults).toBeInTheDocument();
});

test("SampleList shows a message when no samples exist", async () => {
  await renderSampleList(0);
  expect(screen.getByText("No samples yet")).toBeInTheDocument();
  expect(screen.queryByText("Show All")).not.toBeInTheDocument();
});

test("SampleList allows adding a sample", async () => {
  const { user, elements, handleSampleCreate } = await renderSampleList(3);
  expect(handleSampleCreate).not.toHaveBeenCalled();

  // Click the "New" button
  await user.click(elements.newSampleButton);

  // Verify that the handler was called
  expect(handleSampleCreate).toHaveBeenCalled();
});
