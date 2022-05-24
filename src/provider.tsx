import React, { useCallback, useEffect, useReducer, useState } from 'react'
import {
  Client,
  ClientCrossidOpts,
  ClientDiscoveryOpts,
  ClientOpts,
  IDToken,
  newCrossidClient,
  newCrossidClientByDiscovery,
  newCrossidClientCustom,
} from '@crossid/crossid-spa-js'
import CrossidClient, { AuthorizationOpts, GetAccessTokenOpts, LogoutOpts } from '@crossid/crossid-spa-js/dist/client'
import AuthContext, { initialAuthState } from './provider-context'
import { AuthProps } from './provider-options'
import { reducer } from './reducer'
import { authPageHasError, shouldCompleteLogin, shouldCompleteLogout } from './helper'
import { oauth2Error as authError } from './error'
import { JWTClaims } from '@crossid/crossid-spa-js/dist/types'

/**
 * instantiates a new client
 *
 * @param props
 * @returns
 */
const initClient = async (props: AuthProps): Promise<CrossidClient> => {
  const opts = props
  let crossOpts = opts as ClientCrossidOpts
  let discoveryOpts = opts as ClientDiscoveryOpts
  let customOpts = opts as ClientOpts
  if (crossOpts.tenant_id) {
    return await newCrossidClient(crossOpts)
  } else if (discoveryOpts.wellknown_endpoint) {
    return await newCrossidClientByDiscovery(discoveryOpts)
  } else if (customOpts.authorization_endpoint && customOpts.token_endpoint && customOpts.issuer) {
    return await newCrossidClientCustom(customOpts)
  } else {
    throw new Error('invalid props')
  }
}

/**
 * A state that can be passed before starting the login process.
 */
export interface AppState {
  return_to?: string
  [key: string]: any
}

const defaultOnRedirectTo = (state?: AppState): void => {
  window.history.replaceState({}, document.title, state?.return_to || window.location.pathname)
}

export const AuthProvider = <T extends IDToken>(props: AuthProps): JSX.Element => {
  const [client, setClient] = useState<Client>()
  const [state, dispatch] = useReducer(reducer, initialAuthState)
  const { onRedirectTo = defaultOnRedirectTo, redirect_uri, post_logout_redirect_uri, children } = props

  /**
   * A constructor to initialize a client.
   */
  useEffect(() => {
    ;(async (): Promise<void> => {
      if (!client) {
        try {
          const c = await initClient(props)
          setClient(c)
        } catch (e) {
          dispatch({ type: 'ERROR', error: authError(e) })
        }
      }
    })()
  }, [client])

  /**
   * handle login & logout
   */
  useEffect(() => {
    ;(async (): Promise<void> => {
      if (client) {
        try {
          // complete the signin
          if (shouldCompleteLogin(window.location, redirect_uri!)) {
            const { state } = await client.handleRedirectCallback()
            const idToken = await client.getUser<T>({ scope: 'openid' })
            dispatch({ type: 'INITIALIZED', idToken })
            onRedirectTo(state)
          } else if (shouldCompleteLogout(window.location, post_logout_redirect_uri!)) {
            const { state } = await client.handleLogoutRedirectCallback()
            dispatch({ type: 'LOGOUT_COMPLETED' })
            onRedirectTo(state)
          } else if (authPageHasError(window.location, [redirect_uri!, post_logout_redirect_uri!])) {
            const error = authPageHasError(window.location, [redirect_uri!, post_logout_redirect_uri!])
            if (error) {
              dispatch({ type: 'ERROR', error })
            }
          } else {
            const idToken = await client.getUser<T>({ scope: 'openid' })
            dispatch({ type: 'INITIALIZED', idToken })
          }
        } catch (e) {
          dispatch({ type: 'ERROR', error: authError(e) })
        }
      }
    })()
  }, [client])

  const loginWithRedirect = useCallback(
    (opts: AuthorizationOpts = {}) => {
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

  const signupWithRedirect = useCallback(
    (opts: AuthorizationOpts = {}) => {
      client?.signupWithRedirect(opts)
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

  const introspectAccessToken = useCallback(
    async (opts: GetAccessTokenOpts = {}): Promise<JWTClaims | undefined> => {
      return await client?.introspectAccessToken(opts)
    },
    [client]
  )

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signupWithRedirect,
        loginWithRedirect,
        logoutWithRedirect,
        getAccessToken,
        introspectAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
