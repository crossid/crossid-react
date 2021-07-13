import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Client,
  IDToken,
  ClientOpts,
  ClientDiscoveryOpts,
  ClientCrossidOpts,
  GetUserOpts,
  AuthorizationOpts,
  GetAccessTokenOpts,
  newCrossidClient,
  newCrossidClientByDiscovery,
  newCrossidClientCustom,
} from '@crossid/crossid-spa-js'
import CrossidClient from '@crossid/crossid-spa-js/dist/client'
import { useCallback } from 'react'

/**
 * The state which is returned when using the auth hook.
 */
export interface AuthState<User extends IDToken = IDToken> {
  loading: boolean
  error?: Error
  user?: User
  client?: Client
}
const AuthContext = createContext<AuthState>({
  loading: true,
})

interface AuthActions {
  loginWithRedirect: (opts: AuthorizationOpts, returnTo: string) => void
  getAccessToken: (opts: GetAccessTokenOpts) => string
  getUser: (opts: GetUserOpts) => void
}
function stub(opts: any): any {
  throw new Error('please wrap your app with CrossidProvider')
}
const AuthActionsContext = createContext<AuthActions>({
  loginWithRedirect: stub,
  getAccessToken: stub,
  getUser: stub,
})

class AuthProviderOptsBase {
  children: React.ReactNode
  goTo?: (url: string) => void
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

declare global {
  interface Window {
    '@crossid': Client
  }
}

export const useCrossidAuth = () => useContext(AuthContext)
export const useCrossidAuthActions = () => useContext(AuthActionsContext)

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

async function getUser({
  client,
  setUser,
  opts,
}: {
  client?: Client
  setUser: Function
  opts?: AuthorizationOpts
}) {
  const user = await client?.getUser(opts)
  setUser(user)
}

const CrossidProvider = <T extends IDToken>(props: AuthProps): JSX.Element => {
  const [client, setClient] = useState<Client>()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<T | undefined>()

  const [accessToken, setAccessToken] = useState<string>('')
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
          window['@crossid'] = c
          await getUser({ client: c, setUser })
        } catch (e) {
          setError(e)
        } finally {
          setLoading(false)
        }
      }
    })()
  }, [client, props])

  useEffect(() => {
    ;(async () => {
      const { origin, pathname } = window.location
      const sp = new URLSearchParams(window.location.search)
      if (origin + pathname === props.redirect_uri && sp.has('code')) {
        const resp = await client?.handleRedirectCallback()
        setLoading(true)
        await getUser({ client, setUser })
        setLoading(false)
        if (!!resp?.state) {
          if (goTo) {
            goTo(resp.state)
          } else {
            window.history.replaceState({}, document.title, resp.state)
          }
        }
      }
    })()
  }, [client, goTo, props.redirect_uri])

  const loginWithRedirect = useCallback(
    (opts: AuthorizationOpts = {}, returnTo: string) => {
      opts.state = returnTo
      client?.loginWithRedirect(opts)
    },
    [client]
  )

  async function _getUser(opts: AuthorizationOpts) {
    getUser({ client, setUser, opts })
  }

  const getAccessToken = useCallback(
    (opts: GetAccessTokenOpts): string => {
      ;(async () => {
        const act = await client?.getAccessToken(opts)
        setAccessToken(act || '')
      })()

      return accessToken
    },
    [accessToken, client]
  )

  return (
    <AuthContext.Provider value={{ user, error, loading, client }}>
      <AuthActionsContext.Provider
        value={{ loginWithRedirect, getUser: _getUser, getAccessToken }}
      >
        {props.children}
      </AuthActionsContext.Provider>
    </AuthContext.Provider>
  )
}

export default CrossidProvider
