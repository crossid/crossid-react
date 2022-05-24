## 0.2.4

[All Changes](https://github.com/crossid/crossid-spa-js/compare/v0.2.3...v0.2.4)

### Major Changes

- Support for crossid tenant's region configuration.
- `signupWithRedirect()` method
- upgrade `@crossid/crossid-spa-js` to v0.4.3

## 0.2.3

[All Changes](https://github.com/crossid/crossid-spa-js/compare/v0.2.2...v0.2.3)

### Minor Changes

- support for React 17 and 18.

## 0.2.2

[All Changes](https://github.com/crossid/crossid-spa-js/compare/v0.2.1...v0.2.2)

### Major Changes

- Upgrade crossid-spa-js dependency to 0.4.1.

## 0.2.1

[All Changes](https://github.com/crossid/crossid-spa-js/compare/v0.2.0...v0.2.1)

### Major Changes

- Introspect access token locally.

## 0.2.0

[All Changes](https://github.com/crossid/crossid-spa-js/compare/v0.1.1...v0.2.0)

### Major Changes

- Combines two hooks into a single `useAuth`.

## 0.1.1

[All Changes](https://github.com/crossid/crossid-spa-js/compare/v0.1.0...v0.1.1)

### Minor Changes

- support for the `state_type` option.

## 0.1.0

[All Changes](https://github.com/crossid/crossid-spa-js/compare/v0.0.2...v0.1.0)

### Major Changes

- logout via redirect.

## 0.0.2

[All Changes](https://github.com/crossid/crossid-spa-js/compare/v0.0.1...v0.0.2)

### Major Changes

- `withRequired` high order component to protect components from being rendered if user is not authenticated.

## 0.0.1

[All Changes](https://github.com/crossid/crossid-spa-js/compare/d47e23f...v0.0.1)

### Major Changes

- A React provider as a wrapper around [crossid-spa-client](https://github.com/crossid/crossid-spa-js) and initializes a client automatically.
- Provider maintains a state for the _authenticated user_ and _client_.
- Provider handles redirect callback by invoking client `handleRedirectCallback` automatically.
- Delegate `getAccessToken` from provider.
- Delegate `loginWithRedirect` so app can start the login (e.g., within a protected route if user is not authenticated).
