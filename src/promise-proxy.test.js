import PromiseProxy from "./promise-proxy";

describe("PromiseProxy", () => {
  it("should be a class constructor", async () => {
    expect(() => new PromiseProxy()).not.toThrowError();
    expect(new PromiseProxy()).toBeInstanceOf(PromiseProxy);
  });

  it("should invoke resolve callback", async () => {
    const proxy = new PromiseProxy();
    const outcome = {};
    const promise = Promise.resolve(outcome);
    const resolvedFn = jest.fn();
    const rejectedFn = jest.fn();

    proxy.add(promise, resolvedFn, rejectedFn);

    await promise;

    expect(resolvedFn).toHaveBeenCalledTimes(1);
    expect(resolvedFn).toHaveBeenCalledWith(outcome);
    expect(rejectedFn).not.toHaveBeenCalled();
    expect(proxy.promises.length).toBe(0);
  });

  it("should support multiple promises", async () => {
    const proxy = new PromiseProxy();
    const outcome = {};
    const promise1 = Promise.resolve(outcome);
    const promise2 = Promise.resolve(outcome);
    const resolved1Fn = jest.fn();
    const resolved2Fn = jest.fn();
    const rejectedFn = jest.fn();

    proxy.add(promise1, resolved1Fn, rejectedFn);
    proxy.add(promise2, resolved2Fn, rejectedFn);

    expect(proxy.promises.length).toBe(2);

    await Promise.all([promise1, promise2]);

    expect(resolved1Fn).toHaveBeenCalledTimes(1);
    expect(resolved1Fn).toHaveBeenCalledWith(outcome);
    expect(resolved2Fn).toHaveBeenCalledTimes(1);
    expect(resolved2Fn).toHaveBeenCalledWith(outcome);
    expect(rejectedFn).not.toHaveBeenCalled();
    expect(proxy.promises.length).toBe(0);
  });

  it("should invoke reject callback", async () => {
    const proxy = new PromiseProxy();
    const outcome = new Error("error");
    const promise = Promise.reject(outcome);
    const resolvedFn = jest.fn();
    const rejectedFn = jest.fn();

    proxy.add(promise, resolvedFn, rejectedFn);

    promise.catch(() => {
      expect(rejectedFn).toHaveBeenCalledTimes(1);
      expect(rejectedFn).toHaveBeenCalledWith(outcome);
      expect(resolvedFn).not.toHaveBeenCalled();
      expect(proxy.promises.length).toBe(0);
    });
  });

  it("should not invoke resolve callback after promise was removed", async () => {
    const proxy = new PromiseProxy();
    const promise = Promise.resolve({});
    const resolvedFn = jest.fn();
    const rejectedFn = jest.fn();

    proxy.add(promise, resolvedFn, rejectedFn);
    proxy.remove(promise);

    await promise;

    expect(resolvedFn).not.toHaveBeenCalled();
    expect(rejectedFn).not.toHaveBeenCalled();
    expect(proxy.promises.length).toBe(0);
  });

  it("should not invoke reject callback after promise was removed", async () => {
    const proxy = new PromiseProxy();
    const outcome = new Error("error");
    const promise = Promise.reject(outcome);
    const resolvedFn = jest.fn();
    const rejectedFn = jest.fn();

    proxy.add(promise, resolvedFn, rejectedFn);
    proxy.remove(promise);

    promise.catch(() => {
      expect(resolvedFn).not.toHaveBeenCalled();
      expect(rejectedFn).not.toHaveBeenCalled();
      expect(proxy.promises.length).toBe(0);
    });
  });

  it("should remove correct promise", async () => {
    const proxy = new PromiseProxy();
    const promise1 = Promise.resolve();
    const promise2 = Promise.resolve();
    const resolved1Fn = jest.fn();
    const resolved2Fn = jest.fn();
    const rejectedFn = jest.fn();

    proxy.add(promise1, resolved1Fn, rejectedFn);
    proxy.remove(promise1);
    proxy.add(promise2, resolved2Fn, rejectedFn);

    expect(proxy.promises.length).toBe(1);
    expect(proxy.promises).not.toContain(promise1);
    expect(proxy.promises).toContainEqual(promise2);

    await Promise.all([promise1, promise2]);

    expect(resolved1Fn).not.toHaveBeenCalled();
    expect(resolved2Fn).toHaveBeenCalled();
    expect(rejectedFn).not.toHaveBeenCalled();
    expect(proxy.promises.length).toBe(0);
  });
});
