import * as React from "react";
import PromiseProxy from "./promise-proxy";

export type PendingProps = {
  children: React.ReactNode | React.ReactNode[] | (() => JSX.Element);
};

export type RejectedProps<E = Error> = {
  children: React.ReactNode | React.ReactNode[] | ((reason: E) => JSX.Element);
};

export type ResolvedProps<T = any> = {
  children: React.ReactNode | React.ReactNode[] | ((result: T) => JSX.Element);
};

export type AwaitProps<T = any> = {
  children?: React.ReactNode | React.ReactNode[];
  promise?: Promise<T>;
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

function isFunction(children: AwaitProps["children"]): children is Function {
  return "function" === typeof children;
}

export function Pending({ children }: PendingProps): JSX.Element {
  return (
    <context.Consumer>
      {({ state }) => PromiseState.Pending === state
        ? isFunction(children) ? children() : children
        : null
      }
    </context.Consumer>
  );
}

export function Resolved({ children }: ResolvedProps): JSX.Element {
  return (
    <context.Consumer>
      {({ state, result }) => PromiseState.Resolved === state
        ? isFunction(children) ? children(result) : children
        : null
      }
    </context.Consumer>
  );
}

export function Rejected({ children }: RejectedProps): JSX.Element {
  return (
    <context.Consumer>
      {({ state, reason }) => PromiseState.Rejected === state
        ? isFunction(children) ? children(reason as Error) : children
        : null
      }
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

    if (promise === prevProps.promise) {
      return;
    }

    if (prevProps.promise) {
      proxy.remove(this, prevProps.promise);
    }

    this.bindPromise(promise);

    this.setState({
      reason: void 0,
      result: void 0,
      state: PromiseState.Pending,
    });
  }

  public componentWillUnmount(): void {
    const { promise } = this.props;

    if (promise) {
      proxy.remove(this, promise);
    }
  }

  public render() {
    return (
      <context.Provider value={this.state}>
        {this.props.children}
      </context.Provider>
    );
  }

  private bindPromise(promise?: Promise<any>) {
    if (!promise) {
      return;
    }

    proxy.add(
      this,
      promise,
      result => this.setState({ state: PromiseState.Resolved, reason: void 0, result }),
      reason => this.setState({ state: PromiseState.Rejected, reason, result: void 0 })
    );
  }
}
