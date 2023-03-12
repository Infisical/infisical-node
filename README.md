<h1 align="center">
  <img width="300" src="/img/logoname-white.svg#gh-dark-mode-only" alt="infisical">
</h1>
<p align="center">
  <p align="center">Open-source, end-to-end encrypted tool to manage secrets and configs across your team, devices, and infrastructure.</p>
</p>

## Note

This Node SDK is a work in progress and will go live in the next few days!

## Links

- Official SDK docs

## Installation

```
$ npm install infisical-node
```

## Import

```
// ES6 syntax
import infisical from 'infisical-node';
```

```
// ES5 syntax
const infisical = require('infisical-node');
```

## Initialization

If your app only needs to connect to one Infisical project, you should use `infisical.connect`. If you need to connect to multiple Infisical projects, use `infisical.createConnection`.

Both `connect` and `createConnection` take a parameter `serviceToken` and pull in the secrets accessible by that Infisical service token.

```
// using async-await
await infisical.connect({
    token: "your_service_token"
});
```

```
// using promise chaining
infisical.connect({
    token: "your_service_token"
})
.then(() => {
    console.log('Success!)
})
.catch(err => {
    console.error('Error: ', err);
})
```

## Access a Secret Value

```
const dbURL = infisical.getSecretValue('DB_URL');
```

## Example with Express

```
const express = require('express');
const infisical = require('infisical-node');

app.get('/', (req, res) => {
    // access value
    const name = infisical.default.getSecret('NAME');
    res.send(`Hello! My name is: ${name}`);
});

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)
    
    // initialize Infisical client
    await infisical.default.connect({
        token: SERVICE_TOKEN
    });
});
```


