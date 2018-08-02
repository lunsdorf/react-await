export type ResolveCallback<T = any> = (result: T) => void;
export type RejectCallback<E = Error> = (reason: E) => void;

type PromiseEdge = [object, Promise<any>];

export default class PromiseProxy {
  private promises: PromiseEdge[] = [];

  public add<T = any, E = Error>(
    owner: object,
    promise: Promise<T>,
    onResolve: ResolveCallback<T>,
    onReject: RejectCallback<E>
  ): void {
    this.promises.push([owner, promise]);

    promise.then(
      (result: T) => this.handlePromise<T>([owner, promise], result, onResolve),
      (reason: E) => this.handlePromise<T, E>([owner, promise], reason, onReject)
    );
  }

  public remove<T = any>(owner: object, promise: Promise<T>): void {
    this.promises = this.promises.filter(edge => !(owner === edge[0] && promise === edge[1]));
  }

  private handlePromise<T>(edge: PromiseEdge, result: T, onResolve: ResolveCallback<T>): void;
  private handlePromise<T, E>(edge: PromiseEdge, reason: E, onReject: RejectCallback<E>): void;
  private handlePromise<T, E>(edge: PromiseEdge, arg: T | E, callback: (arg: T | E) => void): void {
    if (this.promises.find(([owner, promise]) => (owner === edge[0] && promise === edge[1]))) {
      this.remove(edge[0], edge[1]);

      callback(arg);
    }
  }
}
