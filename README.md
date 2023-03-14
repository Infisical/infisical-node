<h1 align="center">
    <a href="https://github.com/Infisical/infisical">
        <img width="300" src="/img/logoname-white.svg#gh-dark-mode-only" alt="infisical">
    </a>
</h1>
<p align="center">
  <p align="center">Open-source, end-to-end encrypted tool to manage secrets and configs across your team, devices, and infrastructure.</p>
</p>

## Links

- [SDK docs](https://infisical.com/docs/sdk/overview/usage)

## Installation

```
$ npm install infisical-node
```

## Import

```js
// ES6 syntax
import infisical from "infisical-node";
```

```js
// ES5 syntax
const infisical = require("infisical-node");
```

## Initialization

If your app only needs to connect to one Infisical project, you should use `infisical.connect`. If you need to connect to multiple Infisical projects, use `infisical.createConnection`.

Both `connect` and `createConnection` take a parameter `token` and pull in the secrets accessible by that Infisical token.

```js
// using async-await (recommended)
await infisical.connect({
  token: "your_infisical_token",
});
```

```js
// using promise chaining
infisical.connect({
    token: "your_infisical_token"
})
.then(() => {
    console.log('Success!)
})
.catch(err => {
    console.error('Error: ', err);
})
```

### Options

- `siteURL`: Your self-hosted Infisical site URL. Type: `string`. Default: `https://app.infisical.com`.
- `attachToProcessEnv`: Whether or not to attach fetched secrets to `process.env`. Type: `boolean`. Default: `false`.
- `debug`: Turns debug mode on or off. If debug mode is enabled then the SDK will attempt to print out useful debugging information. Type: `boolean`. Default: `false`.

## Access a Secret Value

```js
const dbURL = infisical.get("DB_URL");
```

## Example with Express

```js
const express = require("express");
const port = 3000;
const infisical = require("infisical-node");

const main = async () => {
  await infisical.connect({
    token: "YOUR_INFISICAL_TOKEN",
  });

  app.get("/", (req, res) => {
    // access value
    const name = infisical.get("NAME");
    res.send(`Hello! My name is: ${name}`);
  });

  app.listen(port, async () => {
    // initialize client
    console.log(`App listening on port ${port}`);
  });
};

main();
```
