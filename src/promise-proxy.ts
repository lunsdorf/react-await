export default class PromiseProxy {
  private promises: Promise<any>[] = [];

  public add<T = any>(promise: Promise<T>, onResolve: (result: T) => void, onReject: (reason: Error) => void): void {
    this.promises.push(promise);

    promise.then(
      (result: T) => this.handlePromise<T>(promise, result, onResolve),
      (reason: Error) => this.handlePromise<T>(promise, reason, onReject)
    );
  }

  public remove<T = any>(promise: Promise<T>): void {
    this.promises = this.promises.filter(current => current !== promise);
  }

  private handlePromise<T = any>(promise: Promise<T>, result: T, onResolve: (result: T) => void): void;
  private handlePromise<T = any>(promise: Promise<T>, reason: Error, onReject: (error: Error) => void): void;
  private handlePromise<T = any>(promise: Promise<T>, arg: T | Error, callback: (arg: T | Error) => void): void {
    if (0 > this.promises.indexOf(promise)) {
      return;
    }

    this.remove(promise);

    callback(arg);
  }
}
