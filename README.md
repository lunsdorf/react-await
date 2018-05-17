# react-await – handle promises the react way!

> TODO: write better documentation …

## Usage

```jsx
<Await promise={myPromise}>
  <Resolved>{result => <div>Resolved with {result}!</div>}</Resolved>
  <Rejected>{reason => <div>Rejected with {reason}!</div>}</Rejected>
  <Pending>{() => <div>Pending …</div>}</Pending>
</Await>
```
