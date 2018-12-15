import * as React from "react";
import * as TestRenderer from "react-test-renderer";
import { Await, Resolved, Rejected, Then, PromiseState } from "./react-await";

describe("<Await/>", () => {
  it("should be <Resolved/>", async () => {
    const outcome = {};
    const promise = Promise.resolve(outcome);
    const childrenResolved = jest.fn(() => null);
    const childrenRejected = jest.fn(() => null);
    const component = TestRenderer.create(
      <Await promise={promise}>
        <Resolved>{childrenResolved}</Resolved>
        <Rejected>{childrenRejected}</Rejected>
      </Await>
    );

    await promise;

    expect(childrenRejected).toHaveBeenCalledTimes(0);
    expect(childrenResolved).toHaveBeenCalledTimes(1);
    expect(childrenResolved).toHaveBeenCalledWith(outcome);
  });

  it("should be <Resolved/> unmounting other <Await/> with same promise", async () => {
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

  it("should be <Resolved/> indiviually when updating other <Await/>", async () => {
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

  it("should be <Rejected/>", async () => {
    try {
      const promise = Promise.reject(new Error("error"));
      const childrenResolved = jest.fn(() => null);
      const childrenRejected = jest.fn(() => null);
      const component = TestRenderer.create(
        <Await promise={promise}>
          <Resolved>{childrenResolved}</Resolved>
          <Rejected>{childrenRejected}</Rejected>
        </Await>
      );

      await promise;
    } catch (error) {
      expect(childrenResolved).toHaveBeenCalledTimes(0);
      expect(childrenRejected).toHaveBeenCalledTimes(1);
      expect(childrenRejected).toHaveBeenCalledWith(error);
    }
  });

  it("should resolve <Then/>", async () => {
    const outcome = {};
    const promise = Promise.resolve(outcome);
    const children = jest.fn(() => null);
    const component = TestRenderer.create(
      <Await promise={promise}>
        <Then>{children}</Then>
      </Await>
    );

    await promise;

    expect(children).toHaveBeenCalledTimes(2);
    expect(children).toHaveBeenNthCalledWith(1, PromiseState.Pending, undefined, undefined);
    expect(children).toHaveBeenNthCalledWith(2, PromiseState.Resolved, outcome, undefined);
  });

  it("should reject <Then/>", async () => {
    try {
      const promise = Promise.reject(new Error("error"));
      const children = jest.fn(() => null);
      const component = TestRenderer.create(
        <Await promise={promise}>
          <Then>{children}</Then>
        </Await>
      );

      await promise;
    } catch (error) {
      expect(children).toHaveBeenCalledTimes(2);
      expect(children).toHaveBeenNthCalledWith(1, PromiseState.Pending, undefined, undefined);
      expect(children).toHaveBeenNthCalledWith(2, PromiseState.Rejected, undefined, error);
    }
  });
});
