import { IDToken } from '@crossid/crossid-spa-js'
import { useContext } from 'react'
import AuthContext, { AuthContextType } from './provider-context'

/**
 * useAuth is a hook to handle authentication.
 *
 * T can optionally be set to your custom `IDToken` type.
 *
 * ```ts
 * const {
 *   // true if hook is currently loading, can be used to defer loading page with a spinner.
 *   loading: boolean
 *   // An error that has occured during authentication phases.
 *   error?: Error
 *   // The ID token if the authenticated user.
 *   idToken?: T
 *   // a method to start login by redirecting browser to crossid authorization provider.
 *   loginWithRedirect,
 *   // a method to start logout by redirecting browser to crossid authorization provider.
 *   logoutWithRedirect,
 *   // returns a promise which eventually returns the access token of the authenticated user.
 *   getAccessToken
 * } = useAuth()
 * ```
 *
 * @returns
 */
export const useAuth = <T extends IDToken = IDToken>(): AuthContextType<T> =>
  useContext<AuthContextType<T>>(AuthContext)
