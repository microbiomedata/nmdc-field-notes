import React from "react";
import { render } from "@testing-library/react";
import NoneOr from "./NoneOr";

test("NoneOr renders children when truthy", () => {
  const { container } = render(<NoneOr>Hello, world!</NoneOr>);
  expect(container).toHaveTextContent("Hello, world!");
  expect(container).not.toHaveTextContent("None");
});

test("NoneOr renders placeholder when falsy", () => {
  const { container } = render(<NoneOr />);
  expect(container).toHaveTextContent("None");
});

test("NoneOr renders placeholder when showPlaceholder is true", () => {
  const { container } = render(
    <NoneOr showPlaceholder={true}>Hello World</NoneOr>,
  );
  expect(container).toHaveTextContent("None");
  expect(container).not.toHaveTextContent("Hello World");
});

test("NoneOr renders custom placeholder when provided", () => {
  const { container } = render(<NoneOr placeholder="Nothing to see here" />);
  expect(container).toHaveTextContent("Nothing to see here");
  expect(container).not.toHaveTextContent("None");
});

test("NoneOr renders custom placeholder when showPlaceholder is true", () => {
  const { container } = render(
    <NoneOr showPlaceholder={true} placeholder="Nothing to see here">
      Hello World
    </NoneOr>,
  );
  expect(container).toHaveTextContent("Nothing to see here");
  expect(container).not.toHaveTextContent("Hello World");
});
