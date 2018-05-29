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

It uses the new context introduced with react 16.3 internally, which allows
rendering the `Resolved`, `Rejected` and `Pending` components in nested JSX
structures or multiple times. The `Await` component will automatically cleanup
callback functions when passing a new promise as property or unmounting.

## License
[MIT](https://github.com/lunsdorf/react-await/blob/master/LICENSE.md)
