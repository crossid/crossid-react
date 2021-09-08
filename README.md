# @crossid/crossid-react [![npm version](https://img.shields.io/npm/v/@crossid/crossid-react?style=flat)](https://www.npmjs.com/package/@crossid/crossid-react) [![Test](https://github.com/crossid/crossid-react/actions/workflows/test.yml/badge.svg)](https://github.com/crossid/crossid-react/actions/workflows/test.yml) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/crossid/crossid-react/blob/main/LICENSE)

OAuth2 for React.js, using the authorization code flow with PKCE extension.

## Get Started

Install by:

npm:

```sh
npm install @crossid/crossid-react
```

yarn:

```sh
yarn add @crossid/crossid-react
```

Wrap your app in `AuthProvider`:

```jsx
import { AuthProvider} from '@crossid/crossid-react'
<AuthProvider
    tenant_id="<tenant>"
    client_id="<client_id>"
    redirect_uri={`${window.location.origin}/`}
    post_logout_redirect_uri={`${window.location.origin}/`}
>
    <App />
</AuthProvider>,
```

Put a login & logout buttons anywhere in your app:

```js
const { idToken, loginWithRedirect, logoutWithRedirect } = useAuth()

return (
  <div>
    {!idToken && (
      <button
        type="button"
        onClick={() => {
          loginWithRedirect({ state: { return_to: '/home' } })
        }}
      >
        Sign In
      </button>
    )}
    {idToken && (
      <button
        type="button"
        onClick={() => {
          logoutWithRedirect({ state: { return_to: '/goodbye' } })
        }}
      >
        Sign Out
      </button>
    )}
  </div>
)
```

On any component, pass token to access protected endpoint by:

```js
const { getAccessToken } = useAuthActions()

const [data, setData] = useState()
useEffect(() => {
  async function fetchData() {
    const tok = await getAccessToken()
    const resp = await fetch(`/api`, {
      headers: { Authorization: `Bearer ${tok}` },
    }).json()
    setData(resp)
})
```

See [playground/index.html](./playground/index.html)

## Documentation

- [Example Repo](https://github.com/crossid/crossid-react-example)
- [API Reference](https://crossid.github.io/crossid-react/)

## Bugs and feature requests

Have a bug, feature request or feedback? Please first search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/crossid/crossid-react/issues/new).

## Contributing

The main purpose of this repository is to continue evolving _crossid-react_, making it more secure and easier to use. Development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving _crossid-react_.

## Reporting a Vulnerability

The Crossid team takes security issues very seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

To report a security issue, email [security@crossid.io](mailto:security@crossid.io).

We'll endeavor to respond quickly, and will keep you updated throughout the process.

## What is Crossid?

Crossid can:

- Sign users in using various _passwordless_ authentication factors (e.g., _otp_, _fingerprint_, etc...)
- Sign users in via social providers (e,g. _Facebook_) or enterprise providers (e.g., _Azure_)
- Multi factor authentication.
- Issue signed OAuth2 and Openid-Connect access tokens to protect API calls.
- Manage user profiles and access.
- Services authentication.

## License

This project is licensed under the [MIT license](./LICENSE).
