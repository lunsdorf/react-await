import * as React from "react";
import * as TestRenderer from "react-test-renderer";
import { Await, Resolved } from "./react-await";

describe("<Await/>", () => {
  it("should <Resolve/>", async () => {
    const outcome = {};
    const promise = Promise.resolve(outcome);
    const children = jest.fn(() => null);
    const component = TestRenderer.create(
      <Await promise={promise}>
        <Resolved>{children}</Resolved>
      </Await>
    );

    await promise;

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith(outcome);
  });
  
  it("should <Resolve/> unmounting other <Await/> with same promise", async () => {
    const outcome = {};
    const promise = Promise.resolve(outcome);
    const children1 = jest.fn(() => null);
    const children2 = jest.fn(() => null);
    const component1 = TestRenderer.create(
      <Await promise={promise}>
        <Resolved>{children1}</Resolved>
      </Await>
    );
    const component2 = TestRenderer.create(
      <Await promise={promise}>
        <Resolved>{children2}</Resolved>
      </Await>
    );
    
    component2.unmount();

    await promise;

    expect(children1).toHaveBeenCalledTimes(1);
    expect(children1).toHaveBeenCalledWith(outcome);
    expect(children2).not.toHaveBeenCalled();
  });
  
  it("should <Resolve/> indiviually when updating other <Await/>", async () => {
    const outcome1 = {};
    const outcome2 = {};
    const promise1 = Promise.resolve(outcome1);
    const promise2 = Promise.resolve(outcome2);
    const children1 = jest.fn(() => null);
    const children2 = jest.fn(() => null);
    const component1 = TestRenderer.create(
      <Await promise={promise1}>
        <Resolved>{children1}</Resolved>
      </Await>
    );
    const component2 = TestRenderer.create(
      <Await promise={promise1}>
        <Resolved>{children2}</Resolved>
      </Await>
    );
    
    component2.update(
      <Await promise={promise2}>
        <Resolved>{children2}</Resolved>
      </Await>
    );

    await promise1;
    await promise2;

    expect(children1).toHaveBeenCalledTimes(1);
    expect(children1).toHaveBeenCalledWith(outcome1);
    expect(children2).toHaveBeenCalledTimes(1);
    expect(children2).toHaveBeenCalledWith(outcome2);
  });
});
