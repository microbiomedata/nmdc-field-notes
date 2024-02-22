import { render } from "@testing-library/react";
import React from "react";
import Pluralize from "./Pluralize";

test("renders singular when count is 1", () => {
  const { container } = render(<Pluralize count={1} singular="cat" />);
  expect(container).toHaveTextContent("cat");
});

test("renders plural when count is 0", () => {
  const { container } = render(<Pluralize count={0} singular="cat" />);
  expect(container).toHaveTextContent("cats");
});

test("renders plural when count is 2", () => {
  const { container } = render(<Pluralize count={2} singular="cat" />);
  expect(container).toHaveTextContent("cats");
});

test("renders count when showCount is true", () => {
  const { container } = render(
    <Pluralize count={2} singular="cat" showCount={true} />,
  );
  expect(container).toHaveTextContent("2 cats");
});

test("renders specified plural when provided", () => {
  const { container } = render(
    <Pluralize count={2} singular="cat" plural="kitties" />,
  );
  expect(container).toHaveTextContent("kitties");
});
