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
    const { returnTo = defaultReturnTo(), scope } = opts

    useEffect(() => {
      rendered.current = true
      if (loading || authenticated) {
        return
      }

      ;(async () => {
        const hasUser = await client?.getUser()
        if (!hasUser) {
          await loginWithRedirect(
            { scope, state: `attemptedLogin=true` },
            returnTo
          )
          return
        }

        if (!loginState) {
          return
        }

        const at = await client?.getUser({ scope })
        if (at && rendered) {
          setAuthenticated(true)
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
    }, [
      authenticated,
      client,
      loading,
      loginState,
      loginWithRedirect,
      returnTo,
      scope,
    ])

    if (authenticated) {
      return <WrappedComponent {...props} />
    }
    if (deniedAccess) {
      return ErrorComponent()
    }
    return <div>Loading...</div>
  }

  return Comp
}

const defaultReturnTo = (): string =>
  `${window.location.pathname}${window.location.search}`
