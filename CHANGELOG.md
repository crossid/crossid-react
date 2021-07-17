## 0.0.1

[All Changes](https://github.com/crossid/crossid-spa-js/compare/d47e23f...v0.0.1)

### Major Changes

- A React provider as a wrapper around [crossid-spa-client](https://github.com/crossid/crossid-spa-js) and initializes a client automatically.
- Provider maintains a state for the _authenticated user_ and _client_.
- Provider handles redirect callback by invoking client `handleRedirectCallback` automatically.
- Delegate `getAccessToken` from provider.
- Delegate `loginWithRedirect` so app can start the login (e.g., within a protected route if user is not authenticated).
