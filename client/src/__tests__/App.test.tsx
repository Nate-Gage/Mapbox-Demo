import React from "react";
import Inputs from "../App";
import renderer from "react-test-renderer";

const sum = (a: number, b: number) => {
  return a + b;
};

describe("Testing main App component", () => {
  test("renders", async () => {
    const component = renderer.create(<Inputs />);

    expect(component).toMatchSnapshot();
  });

  test("adds two inputs together", () => {
    expect(3 + 4).toBe(7);
  });
});

export {};
