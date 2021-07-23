import React, { useContext } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { CrossidAuthProvider, useAuth } from '../src'
import { AuthContext } from '../src/provider'

describe('CrossidAuthProvider', () => {
  it('useAuth should initializes a client', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CrossidAuthProvider
        authorization_endpoint="https://myorg.crossid.io/oauth2/default/auth"
        token_endpoint="https://myorg.crossid.io/oauth2/default/token"
        logout_endpoint="https://myorg.crossid.io/oauth2/default/logout"
        issuer="https://myorg.crossid.io/oauth2/default"
        client_id="client_test1"
      >
        {children}
      </CrossidAuthProvider>
    )

    const { result, waitForNextUpdate } = renderHook(
      () => useContext(AuthContext),
      { wrapper }
    )

    expect(result.current).toBeDefined()
    await waitForNextUpdate()
  })
})
