import * as React from "react";
import { mount } from "enzyme";
import { Await, Resolved } from "./react-await";

describe("<Await/>", () => {
  // skipped until enzyme supports react 16.3 context
  it.skip("should render <Resolve/> component", async () => {
    const outcome = {};
    const promise = Promise.resolve(outcome);
    const children = jest.fn(() => null);
    const component = mount(
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
