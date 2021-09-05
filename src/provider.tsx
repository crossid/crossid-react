import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Client,
  IDToken,
  ClientOpts,
  ClientDiscoveryOpts,
  ClientCrossidOpts,
  AuthorizationOpts,
  LogoutOpts,
  GetAccessTokenOpts,
  newCrossidClient,
  newCrossidClientByDiscovery,
  newCrossidClientCustom,
} from '@crossid/crossid-spa-js'
import CrossidClient from '@crossid/crossid-spa-js/dist/client'
import { useCallback } from 'react'

function stub(): any {
  throw new Error('please wrap your app with CrossidAuthProvider')
}

/**
 * The state which is returned when using the auth hook.
 */
export interface AuthState<User extends IDToken = IDToken> {
  loading: boolean
  error?: Error
  user?: User
  client?: Client
  loginWithRedirect: (opts: AuthorizationOpts, returnTo: string) => void
  logoutWithRedirect: (opts: LogoutOpts) => void
  getAccessToken: (opts?: GetAccessTokenOpts) => Promise<string>
}

export const AuthContext = createContext<AuthState>({
  loading: true,
  loginWithRedirect: stub,
  logoutWithRedirect: stub,
  getAccessToken: stub,
})

class AuthProviderOptsBase {
  children: React.ReactNode
  goTo?: (url: string) => void
  post_logout_redirect_uri?: string
}

interface AuthProviderClientCrossidOpts
  extends ClientCrossidOpts,
    AuthProviderOptsBase {}

interface AuthProviderClientDiscoveryOpts
  extends ClientDiscoveryOpts,
    AuthProviderOptsBase {}

interface AuthProviderClientCustomOpts
  extends ClientOpts,
    AuthProviderOptsBase {}

export const useCrossidAuth = () => useContext(AuthContext)

type AuthProps =
  | AuthProviderClientCrossidOpts
  | AuthProviderClientDiscoveryOpts
  | AuthProviderClientCustomOpts

const initClient = async (props: AuthProps): Promise<CrossidClient> => {
  const opts = props
  let crossOpts = opts as ClientCrossidOpts
  let discoveryOpts = opts as ClientDiscoveryOpts
  let customOpts = opts as ClientOpts
  if (crossOpts.tenant_id) {
    return await newCrossidClient(crossOpts)
  } else if (discoveryOpts.wellknown_endpoint) {
    return await newCrossidClientByDiscovery(discoveryOpts)
  } else if (
    customOpts.authorization_endpoint &&
    customOpts.token_endpoint &&
    customOpts.issuer
  ) {
    return await newCrossidClientCustom(customOpts)
  } else {
    throw new Error('invalid props')
  }
}

const AuthProvider = <U extends IDToken>(props: AuthProps): JSX.Element => {
  const [client, setClient] = useState<Client>()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<U | undefined>()

  const { goTo } = props
  /**
   * initializes the client upon provider initialization
   */
  useEffect(() => {
    ;(async () => {
      if (!client) {
        try {
          const c = await initClient(props)
          setClient(c)
          const u = await c.getUser<U>()
          setUser(u)
        } catch (e) {
          setError(e)
          setLoading(false)
        } finally {
          return
        }
      }

      const { origin, pathname } = window.location
      const sp = new URLSearchParams(window.location.search)
      if (
        client &&
        origin + pathname === props.redirect_uri &&
        sp.has('code') &&
        !sp.has('error')
      ) {
        const resp = await client.handleRedirectCallback()
        const user = await client.getUser<U>()
        setUser(user)
        setLoading(false)
        if (!!resp?.state) {
          if (goTo) {
            goTo(resp.state)
          } else {
            window.history.replaceState({}, document.title, resp.state)
          }
        }
      } else if (
        client &&
        origin + pathname === props.post_logout_redirect_uri &&
        sp.has('state') &&
        !sp.has('error')
      ) {
        const resp = await client.handleLogoutRedirectCallback()
        setUser(undefined)
        setLoading(false)
        if (!!resp?.state) {
          if (goTo) {
            goTo(resp.state)
          } else {
            window.history.replaceState({}, document.title, resp.state)
          }
        }
      } else {
        setLoading(false)
      }
    })()
    // todo: adding client causes errors
  }, [client, goTo, props])

  const loginWithRedirect = useCallback(
    (opts: AuthorizationOpts = {}, returnTo: string) => {
      opts.state = returnTo
      client?.loginWithRedirect(opts)
    },
    [client]
  )

  const logoutWithRedirect = useCallback(
    (opts: LogoutOpts = {}) => {
      if (!opts.post_logout_redirect_uri) {
        opts.post_logout_redirect_uri = props.post_logout_redirect_uri
      }
      client?.logoutWithRedirect(opts)
    },
    [client]
  )

  const getAccessToken = useCallback(
    async (opts: GetAccessTokenOpts = {}): Promise<string> => {
      const act = await client?.getAccessToken(opts)
      return act || ''
    },
    [client]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        loading,
        client,
        loginWithRedirect,
        logoutWithRedirect,
        getAccessToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
