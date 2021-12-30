import { AuthorizationOpts } from '@crossid/crossid-spa-js'
import React, { useEffect, useRef } from 'react'
import { useAuth } from './use-auth'

export interface AuthRequiredOpts {
  return_to?: string | (() => string)
  login_opts?: AuthorizationOpts
}

const defaultReturnTo = (): string => `${window.location.pathname}${window.location.search}`

const isExpired = (exp: number): boolean => {
  const nowSecondsTS = Date.now() / 1000
  return nowSecondsTS >= exp
}

/**
 * a high order component that renders children only if user is authenticated.
 * anonymous visitors will be redirected to the login page.
 *
 * wrap your private routes with this high order component.
 * @param WrappedComponent
 * @param opts
 * @returns
 */
export function withAuth<T>(WrappedComponent: React.ComponentType<T>, opts: AuthRequiredOpts = {}) {
  const Comp = (props: T): JSX.Element => {
    let rendered = useRef(false)
    const { loading, loginWithRedirect, idToken } = useAuth()
    const { return_to = defaultReturnTo, login_opts } = opts

    // todo consider authorization restrictions by letting the user pass some claims assertions.
    const authenticated = !!idToken && !isExpired(idToken.exp || 0)

    useEffect(() => {
      rendered.current = true
      if (loading || authenticated) {
        return
      }

      ;(async (): Promise<void> => {
        await loginWithRedirect({
          ...login_opts,
          state: {
            return_to: typeof return_to === 'function' ? return_to() : return_to,
          },
        })
      })()

      return () => {
        rendered.current = false
      }
    }, [authenticated, loading, loginWithRedirect, return_to])

    // todo consider customizing loading state
    return authenticated ? <WrappedComponent {...props} /> : <div>Loading...</div>
  }

  return Comp
}
