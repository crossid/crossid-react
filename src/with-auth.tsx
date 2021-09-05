import React, { useEffect, useRef, useState } from 'react'
import { useCrossidAuth as useAuth } from './provider'

export interface AuthRequiredOpts {
  returnTo?: string
}

export function withAuth<T>(
  WrappedComponent: React.ComponentType<T>,
  opts: AuthRequiredOpts = {}
) {
  const Comp = (props: T): JSX.Element => {
    let rendered = useRef(false)
    const [authenticated, setAuthenticated] = useState(false)
    const { loading, client, loginWithRedirect } = useAuth()
    const { returnTo = defaultReturnTo() } = opts

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
        }
        await loginWithRedirect({}, returnTo)
      })()

      return () => {
        rendered.current = false
      }
    }, [authenticated, client, loading, loginWithRedirect, returnTo])

    return authenticated ? (
      <WrappedComponent {...props} />
    ) : (
      <div>Loading...</div>
    )
  }

  return Comp
}

const defaultReturnTo = (): string =>
  `${window.location.pathname}${window.location.search}`
