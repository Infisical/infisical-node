<h1 align="center">
    <a href="https://github.com/Infisical/infisical">
        <img width="300" src="/img/logoname-white.svg#gh-dark-mode-only" alt="infisical">
    </a>
</h1>
<p align="center">
  <p align="center">Open-source, end-to-end encrypted tool to manage secrets and configs across your team and infrastructure.</p>
</p>

## Links

- [SDK docs](https://infisical.com/docs/sdks/languages/node)

## Basic Usage

```js
import InfisicalClient from "infisical-node";
import express from "express";
const app = express();
const PORT = 3000;

const client = new InfisicalClient({
  token: "YOUR_INFISICAL_TOKEN"
});

app.get("/", async (req, res) => {
  // access value
  const name = await client.getSecret("NAME");
  res.send(`Hello! My name is: ${name.secretValue}`);
});

app.listen(PORT, async () => {
  // initialize client
  console.log(`App listening on port ${port}`);
});
```

This example demonstrates how to use the Infisical SDK with an Express application. The application retrieves a secret named "NAME" and responds to requests with a greeting that includes the secret value.

## Installation

```
$ npm install infisical-node
```

## Configuration

Import the SDK and create a client instance with your Infisical token.

```js
import InfisicalClient from "infisical-node";
    
const client = new InfisicalClient({
  token: "your_infisical_token"
});

// your app logic
```

### Options

| Parameter | Type     | Description |
| --------- | -------- | ----------- |
| `token`   | `string` | An Infisical Token scoped to a project and environment. |
| `siteURL` | `string` | Your self-hosted Infisical site URL. Default: `https://app.infisical.com`. |
| `cacheTTL`| `number` | Time-to-live (in seconds) for refreshing cached secrets. Default: `300`.|
| `debug`   | `boolean` | Turns debug mode on or off. Default: `false`.      |

### Caching

The SDK caches every secret and updates it periodically based on the provided `cacheTTL`. For example, if `cacheTTL` of `300` is provided, then a secret will be refetched 5 minutes after the first fetch; if the fetch fails, the cached secret is returned.

## Working with Secrets
### Get Secrets

```js
const secrets = await client.getAllSecrets();
```

### Get Secret

Retrieve a secret from Infisical:

```js
const secret = await client.getSecret("API_KEY");
const value = secret.secretValue; // get its value
```

By default, `getSecret()` returns a personal secret. If not found, it returns a shared secret, or tries to retrieve the value from `process.env`.

To explicitly retrieve a shared secret:

```js
const secret = await client.getSecret("API_KEY", { type: "shared" });
const value = secret.secretValue; // get its value
```

### Parameters

- `secretName` (string): The key of the secret to retrieve.
- `options` (object, optional): An options object to specify the type of secret.
  - `type` (string, optional): "personal" (default) or "shared".

### Create Secret

Create a new secret in Infisical:

```js
const newApiKey = await client.createSecret("API_KEY", "FOO");
```

### Parameters

- `secretName` (string): The key of the secret to create.
- `secretValue` (string): The value of the secret.
- `options` (object, optional): An options object to specify the type of secret.
  - `type` (string, optional): "shared" (default) or "personal". A personal secret can only be created if a shared secret with the same name exists.


### Update Secret

Update an existing secret in Infisical:

```js
const updatedApiKey = await client.updateSecret("API_KEY", "BAR");
```

### Parameters

- `secretName` (string): The key of the secret to update.
- `secretValue` (string): The new value of the secret.
- `options` (object, optional): An options object to specify the type of secret.
  - `type` (string, optional): "shared" (default) or "personal".

### Delete Secret

Delete a secret in Infisical:

```js
const deletedSecret = await client.deleteSecret("API_KEY");
```

### Parameters

- `secretName` (string): The key of the secret to delete.
- `options` (object, optional): An options object to specify the type of secret to delete.
  - `type` (string, optional): "shared" (default) or "personal". Note that deleting a shared secret also deletes all associated personal secrets.


## Contributing

Bug fixes, docs, and library improvements are always welcome. Please refer to our [Contributing Guide](https://infisical.com/docs/contributing/overview) for detailed information on how you can contribute.

### Getting Started

If you want to familiarize yourself with the SDK, you can start by [forking the repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and [cloning it in your local development environment](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository). The project requires [Node.js](https://nodejs.org/en) to be installed on your machine.

After cloning the repository, install the depenencies by running the following command in the directory of your cloned repository:

```bash
npm install
```

You can run the existing tests to see if everything is okay by executing:

To run existing tests, you need to make a `.env` at the root of this project containing a `INFISICAL_TOKEN` and `SITE_URL`. This will execute the tests against a project and environment scoped to the `INFISICAL_TOKEN` on a running instance of Infisical at the `SITE_URL` (this could be [Infisical Cloud](https://app.infisical.com)).

```bash
npm test
```

## License

`infisical-node` is distributed under the terms of the [MIT](https://spdx.org/licenses/MIT.html) license.