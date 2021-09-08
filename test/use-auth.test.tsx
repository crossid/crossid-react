import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { AuthProvider, useAuth } from '../src'

describe('CrossidAuthProvider', () => {
  it('useAuth should initializes a client', async () => {
    //   // see https://react-hooks-testing-library.com/usage/advanced-hooks#context
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider
        authorization_endpoint="https://myorg.crossid.io/oauth2/default/auth"
        token_endpoint="https://myorg.crossid.io/oauth2/default/token"
        logout_endpoint="https://myorg.crossid.io/oauth2/default/logout"
        issuer="https://myorg.crossid.io/oauth2/default"
        client_id="client_test1"
      >
        {children}
      </AuthProvider>
    )

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper,
    })
    expect(result.current).toBeDefined()
    await waitForNextUpdate()
    expect(result.current).toBeDefined()
  })
})
