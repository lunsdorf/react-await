export type ResolveCallback<T = any> = (result: T) => void;
export type RejectCallback<E = Error> = (reason: E) => void;

export default class PromiseProxy {
  private promises: Promise<any>[] = [];

  public add<T = any, E = Error>(
    promise: Promise<T>,
    onResolve: ResolveCallback<T>,
    onReject: RejectCallback<E>
  ): void {
    this.promises.push(promise);

    promise.then(
      (result: T) => this.handlePromise<T>(promise, result, onResolve),
      (reason: E) => this.handlePromise<T, E>(promise, reason, onReject)
    );
  }

  public remove<T = any>(promise: Promise<T>): void {
    this.promises = this.promises.filter(current => current !== promise);
  }

  private handlePromise<T>(promise: Promise<T>, result: T, onResolve: ResolveCallback<T>): void;
  private handlePromise<T, E>(promise: Promise<T>, reason: E, onReject: RejectCallback<E>): void;
  private handlePromise<T, E>(promise: Promise<T>, arg: T | E, callback: (arg: T | E) => void): void {
    if (0 > this.promises.indexOf(promise)) {
      return;
    }

    this.remove(promise);

    callback(arg);
  }
}
