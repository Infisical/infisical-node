# Changelog

All notable changes will be documented in this file.

## [1.4.0] - 2023-07-29

This version adds support for the Service Token V3 (Beta) authentication method for Infisical which is a JSON; note that it continues to support Service Token V2 (the default authentication method at this time). With this update, it's possible to initialize the InfisicalClient with a Service Token V3 JSON via the `tokenJSON` parameter to perform CRUD secret operations.

Example:

```
const client = new InfisicalClient({
    tokenJson: process.env.INFISICAL_TOKEN_JSON!,
    siteURL: process.env.SITE_URL!,
    debug: true
});
```

## [1.3.2] - 2023-07-13

This version adds support for attaching fetched secrets to `process.env` object by setting the `attachToProcessEnv` option on `getAllSecrets`.

## [1.3.1] - 2023-07-13

This version patched a small bug in the implementation of path-based `deleteSecret` as well as incorrect caching in `getSecret`.

## [1.3.0] - 2023-07-13

This version adds support for folders or path-based secret storage for all secret CRUD operations.

For example, you can now read/write secrets from/to any secret path.

## [1.2.0] - 2023-05-05

This version adds support for generating a symmetric encryption key, symmetric encryption, and decryption; algorithm used is `aes-256-gcm` with 96-bit `iv`.

- `createSymmetricKey()`: Method to create a base64-encoded, 256-bit symmetric key.
- `encryptSymmetric()`: Method to symmetrically encrypt plaintext using the symmetric key.
- `decryptSymmetric()`: Method to symmetrically decrypt ciphertext using the symmetric key.

To simplify things for developers, we stick to `base64` encoding and convert to and from bytes inside the methods.

## [1.1.4] - 2023-04-27

### Minor changes

Removed dependecy on `node-cache` in favor of a plain object.

## [1.1.2] - 2023-04-26

### Minor changes

Patched compatibility with importing the client in `CommonJS`.

## [1.1.0] - 2023-04-26

This version adds support for querying and mutating secrets by name with the introduction of blind-indexing. It also adds support for caching by passing in `cacheTTL`.

- `getAllSecrets()`: Method to get all secrets from a project and environment
- `createSecret()`: Method to create a secret
- `getSecret()`: Method to get a secret by name
- `updateSecret()`: Method to update a secret by name
- `deleteSecret()`: Method to delete a secret by name

The format of any fetched secrets from the SDK is now a `SecretBundle` that has useful properties like `secretName`, `secretValue`, and `version`.

This version also deprecates the `connect()` and `createConnection()` methods in favor of initializing the SDK with `new InfisicalClient(options)`

It also includes some tests that can be run by passing in a `INFISICAL_TOKEN` and `SITE_URL` as environment variables to point the test client to an instance of Infisical.

## [1.0.38] - 2023-04-14

### Major changes

- `getAll()`: Method to return all secrets fetched at the time of connecting as an object.

## [1.0.37] - 2023-03-15

### Major changes

This is the initial public version of the Infisical Node SDK with foundational features:

- `connect()`: Method to connect the global Infisical client instance to Infisical.

- `createConnection()`: Method to connect a local Infisical client instance to Infisical.

- `get()`: Method to return a secret value by indexing into the secrets fetched back at the time of connecting.

Beyond the major changes, we also provide some nice features:

- Ability to point the Infisical client to a self-hosted instance of Infisical at another URL.
- Ability to load fetched back secrets into `process.env`.
- Turning debug mode on/off.

Note: In this initial version, the Infisical SDK fetches back secrets via the `secrets v2` endpoints which has E2EE limitations. Because of this, the client is set up is to fetch back all secrets asynchronously in 1 call upon application start and then index into them locally thereon.
