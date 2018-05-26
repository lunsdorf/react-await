import * as React from "react";
import PromiseProxy from "./promise-proxy";

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
  children?: React.ReactNode | React.ReactNode[];
  promise: Promise<any>;
};

export type AwaitContext = {
  state: string;
  result?: any;
  reason?: Error;
};

export type AwaitState = AwaitContext;

enum PromiseState {
  Pending = "Pending",
  Resolved = "Resolved",
  Rejected = "Rejected",
}

const promiseProxy = new PromiseProxy();
const promiseContext = React.createContext<AwaitContext>({
  state: PromiseState.Pending,
});

export function Pending({ children }: PendingProps): JSX.Element {
  return (
    <promiseContext.Consumer>
      {({ state }) => PromiseState.Pending === state ? children() : null}
    </promiseContext.Consumer>
  );
}

export function Resolved({ children }: ResolvedProps): JSX.Element {
  return (
    <promiseContext.Consumer>
      {({ state, result }) => PromiseState.Resolved === state ? children(result) : null}
    </promiseContext.Consumer>
  );
}

export function Rejected({ children }: RejectedProps): JSX.Element {
  return (
    <promiseContext.Consumer>
      {({ state, reason }) => PromiseState.Rejected === state ? children(reason as Error) : null}
    </promiseContext.Consumer>
  );
}

export class Await extends React.PureComponent<AwaitProps, AwaitState> {
  public state: AwaitState = {
    state: PromiseState.Pending,
    result: void 0,
    reason: void 0,
  };

  public componentDidMount(): void {
    this.bindPromise(this.props.promise);
  }

  public componentDidUpdate(prevProps: AwaitProps): void {
    const { promise } = this.props;

    if (promise !== prevProps.promise) {
      this.bindPromise(promise, prevProps.promise);

      this.setState({
        reason: void 0,
        result: void 0,
        state: PromiseState.Pending,
      });
    }
  }

  public render() {
    return (
      <promiseContext.Provider value={this.state}>
        {this.props.children}
      </promiseContext.Provider>
    );
  }

  private bindPromise(promise: Promise<any>, prevPromise?: Promise<any>) {
    if (prevPromise) {
      promiseProxy.remove(prevPromise);
    }

    promiseProxy.add(
      promise,
      result => this.setState({ state: PromiseState.Resolved, reason: void 0, result }),
      reason => this.setState({ state: PromiseState.Rejected, result: void 0, reason })
    );
  }
}
