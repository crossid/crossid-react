import { AuthorizationOpts, GetAccessTokenOpts, IDToken, LogoutOpts, OAuth2Error } from '@crossid/crossid-spa-js'
import { createContext } from 'react'
import { AppState } from './provider'

// stub func of all provider's methods.
function stub(): any {
  throw new Error('Please wrap your app with <AuthProvider>')
}

/**
 * Provider's state, provided by the `useAuth` hook.
 * consumer can optionally provide T for a custom IDtoken.
 */
export interface AuthState<T extends IDToken = IDToken> {
  loading: boolean
  error?: OAuth2Error
  idToken?: T
}

/**
 * initial state of AuthState.
 */
export const initialAuthState: AuthState = {
  loading: true,
}

/**
 * Provider's state and methods, provided by the `useAuth` hook.
 */
export interface AuthMethods {
  /**
   * Logs user in.
   *
   * ```ts
   * loginWithRedirect({redirectUri: "/home"})
   * ```
   *
   */
  loginWithRedirect: (opts: AuthorizationOpts) => void

  /**
   * Logs user out.
   *
   * ```ts
   * logoutWithRedirect({post_logout_redirect_uri: '/logout'})
   * ```
   */
  logoutWithRedirect: (opts: LogoutOpts) => void

  /**
   * Returns an access token for the authenticated user.
   *
   * ```js
   * const token = await getAccessToken();
   * ```
   */
  getAccessToken: (opts?: GetAccessTokenOpts) => Promise<string>
}

/**
 * initial state of AuthMethods
 */
const initialAuthMetods: AuthMethods = {
  loginWithRedirect: stub,
  logoutWithRedirect: stub,
  getAccessToken: stub,
}

/**
 * AuthContextType combines state and methods, provided by the `useAuth` hook.
 */
export interface AuthContextType<T extends IDToken> extends AuthState<T>, AuthMethods {}

// initialContext is the defaultValue of createContext.
// only used when a component does not have a matching Provider above it in the tree.
const initialContext = {
  ...initialAuthState,
  ...initialAuthMetods,
}

/**
 * Provides a way to pass authentication data and methods through the app's component tree.
 */
export const AuthContext = createContext<AuthContextType<any>>(initialContext)

export default AuthContext
