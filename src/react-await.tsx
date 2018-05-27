import * as React from "react";
import PromiseProxy from "./promise-proxy";

export type PendingProps = {
  children: () => JSX.Element;
};

export type RejectedProps<E = Error> = {
  children: (reason: E) => JSX.Element;
};

export type ResolvedProps<T = any> = {
  children: (result: T) => JSX.Element;
};

export type AwaitProps<T = any> = {
  children?: React.ReactNode | React.ReactNode[];
  promise: Promise<T>;
};

export type AwaitContext<T = any, E = Error> = {
  state: string;
  result?: T;
  reason?: E;
};

export type AwaitState = AwaitContext;

enum PromiseState {
  Pending = "Pending",
  Resolved = "Resolved",
  Rejected = "Rejected",
}

const proxy = new PromiseProxy();
const context = React.createContext<AwaitContext>({
  state: PromiseState.Pending,
});

export function Pending({ children }: PendingProps): JSX.Element {
  return (
    <context.Consumer>
      {({ state }) => PromiseState.Pending === state ? children() : null}
    </context.Consumer>
  );
}

export function Resolved({ children }: ResolvedProps): JSX.Element {
  return (
    <context.Consumer>
      {({ state, result }) => PromiseState.Resolved === state ? children(result) : null}
    </context.Consumer>
  );
}

export function Rejected({ children }: RejectedProps): JSX.Element {
  return (
    <context.Consumer>
      {({ state, reason }) => PromiseState.Rejected === state ? children(reason as Error) : null}
    </context.Consumer>
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
      proxy.remove(prevProps.promise);

      this.bindPromise(promise);

      this.setState({
        reason: void 0,
        result: void 0,
        state: PromiseState.Pending,
      });
    }
  }

  public componentWillUnmount(): void {
    proxy.remove(this.props.promise);
  }

  public render() {
    return (
      <context.Provider value={this.state}>
        {this.props.children}
      </context.Provider>
    );
  }

  private bindPromise(promise: Promise<any>, prevPromise?: Promise<any>) {
    proxy.add(
      promise,
      result => this.setState({ state: PromiseState.Resolved, reason: void 0, result }),
      reason => this.setState({ state: PromiseState.Rejected, reason, result: void 0 })
    );
  }
}
