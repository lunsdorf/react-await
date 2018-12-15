# react-await – handle promises the react way!

A react component for handling promises inside JSX.

## Install

Use your favourite node package manager to install `react-await` together with
it's peer dependency `react`.

```bash
# install via NPM …
$ npm install --save react react-await

# … or yarn
$ yarn add react react-await
```


## Usage

Basic example using fetch:

```jsx
import React from "react";
import {Await, Pending, Rejected, Resolved} from "react-await";

function MyIP() {
  const promise = fetch("https://api.ipify.org?format=json").then(r => r.json());

  return (
    <Await promise={promise}>
      <Resolved>{json => <div>My IP: {json.ip}</div>}</Resolved>
      <Rejected>{error => <div>{error.message}!</div>}</Rejected>
      <Pending><div>Fetching …</div></Pending>
    </Await>
  );
}
```

Each of the three components `Resolved`, `Rejected` and `Pending` support a
render function or regular JSX components as children. When using render
functions, the `Resolved` component will pass the promise's result and the
`Rejected` component the rejection reason as an argument.

Additionally, there is a `Then` component which combines the functionallity of
the three separate components. It only accepts a render callback as child, which
will be invoked with the current promise state (`pending`, `resolved` or
`rejected`), an optional result and an optional rejection reason. You should use
`Then` if your component has inner state and must not be unmounted between
promise state transitions.

The example from above could also be written as the following:

```jsx
import React from "react";
import {Await, Then, PromiseState} from "react-await";

function MyIP() {
  const promise = fetch("https://api.ipify.org?format=json").then(r => r.json());

  return (
    <Await promise={promise}>
      <Then>
        {(state, json, error) => {
          switch (state) {
            case PromiseState.Resolved:
              return <div>My IP: {json.ip}</div>;
            case PromiseState.Rejected:
              return <div>{error.message}!</div>;
            case PromiseState.Pending:
            default:
              return <div>Fetching …</div>;
          }
        }
      </Then>
    </Await>
  );
}
```

As react-await uses the new context introduced with react 16.3 internally,
rendering multiple or nested `Resolved`, `Rejected`, `Pending` and `Then`
components is also supported. Additionaly, the `Await` component will
automatically cleanup callback functions from old promises when passing a new
promise or unmounting.

Try it on [codesandbox.io](https://codesandbox.io/s/zkrz2rkp5l)!

## License
[MIT](https://github.com/lunsdorf/react-await/blob/master/LICENSE.md)
