import * as React from "react";

export type PendingProps = {
  children: () => JSX.Element;
};

export type RejectedProps = {
  children: (reason: Error) => JSX.Element;
};

export type ResolvedProps = {
  children: (result: any) => JSX.Element;
};

export type AwaitProps = {
  children?: React.ReactNode |  React.ReactNode[];
  promise: Promise<any>;
};

export type AwaitContext = {
  state: string;
  result?: any;
  reason?: Error;
};

export type AwaitState = AwaitContext & {
  promise?: Promise<any>;
};

enum PromiseState {
  Pending = "Pending",
  Resolved = "Resolved",
  Rejected = "Rejected",
}

const PromiseContext = React.createContext<AwaitContext>({ state: PromiseState.Pending });

export function Pending({ children }: PendingProps): JSX.Element {
  return (
    <PromiseContext.Consumer>
      {({ state }) => PromiseState.Pending === state ? children() : null}
    </PromiseContext.Consumer>
  );
}

export function Resolved({ children }: ResolvedProps): JSX.Element {
  return (
    <PromiseContext.Consumer>
      {({ state, result }) => PromiseState.Resolved === state ? children(result) : null}
    </PromiseContext.Consumer>
  );
}

export function Rejected({ children }: RejectedProps): JSX.Element {
  return (
    <PromiseContext.Consumer>
      {({ state, reason }) => PromiseState.Rejected === state ? children(reason as Error) : null}
    </PromiseContext.Consumer>
  );
}

export class Await extends React.PureComponent<AwaitProps, AwaitState> {
  public static getDerivedStateFromProps(nextProps: AwaitProps, prevState: AwaitState): null | AwaitState {
    return prevState && prevState.promise === nextProps.promise
      ? null
      : {
        promise: nextProps.promise,
        reason: void 0,
        result: void 0,
        state: PromiseState.Pending,
      };
  }

  public componentDidMount(): void {
    this.bindPromise(this.props.promise);
  }

  public componentDidUpdate(prevProps: AwaitProps): void {
    const {promise} = this.state;

    if (promise && promise !== prevProps.promise) {
      this.bindPromise(promise);
    }
  }

  public render() {
    return (
      <PromiseContext.Provider value={this.state}>
        {this.props.children}
      </PromiseContext.Provider>
    );
  }

  private bindPromise(promise: Promise<any>) {
    promise.then(
      result => (promise === this.state.promise)
        ? this.setState({ promise, state: PromiseState.Resolved, reason: void 0, result })
        : void 0,
      reason => (promise === this.state.promise)
        ? this.setState({ promise, state: PromiseState.Rejected, result: void 0, reason })
        : void 0
    );
  }
}
