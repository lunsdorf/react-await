import * as React from "react";
import * as TestRenderer from "react-test-renderer";
import { Await, Resolved } from "./react-await";

describe("<Await/>", () => {
  it("should render <Resolve/> component", async () => {
    const outcome = {};
    const promise = Promise.resolve(outcome);
    const children = jest.fn(() => null);
    const component = TestRenderer.create(
      <Await promise={promise}>
        <Resolved>{children}</Resolved>
      </Await>
    );

    await promise;

    // Interacton demo
    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith(outcome);
  });
});
