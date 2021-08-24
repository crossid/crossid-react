import React, { useEffect, useRef, useState } from 'react'
import {
  useCrossidAuth as useAuth,
  useCrossidAuthActions as useAuthActions,
} from './provider'

export interface AuthRequiredOpts {
  returnTo?: string
  scope?: string
}

function didTryLogin(state: string) {
  return state.indexOf('attemptedLogin=true') > -1
}

export function withAuth<T>(
  WrappedComponent: React.ComponentType<T>,
  ErrorComponent: Function,
  opts: AuthRequiredOpts = {}
) {
  const Comp = (props: T): JSX.Element => {
    let rendered = useRef(false)
    const [authenticated, setAuthenticated] = useState(false)
    const [deniedAccess, setDeniedAccess] = useState(false)
    const { loading, client, loginState = '' } = useAuth()
    const { loginWithRedirect } = useAuthActions()
    let { returnTo = defaultReturnTo(), scope = '' } = opts
    scope = `openid ${scope}`.trim()

    useEffect(() => {
      rendered.current = true
      if (loading || authenticated) {
        return
      }

      ;(async () => {
        const at = await client?.getUser()
        if (at && rendered) {
          setAuthenticated(true)
          return
        } else if (didTryLogin(loginState)) {
          setDeniedAccess(true)
        } else {
          await loginWithRedirect(
            { scope, state: `attemptedLogin=true` },
            returnTo
          )
        }
      })()

      return () => {
        rendered.current = false
      }
    }, [authenticated, client, loading, loginWithRedirect, returnTo])

    return authenticated ? (
      !deniedAccess ? (
        <WrappedComponent {...props} />
      ) : (
        ErrorComponent()
      )
    ) : (
      <div>Loading...</div>
    )
  }

  return Comp
}

const defaultReturnTo = (): string =>
  `${window.location.pathname}${window.location.search}`
