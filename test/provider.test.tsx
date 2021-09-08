import React, { useContext } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { AuthProvider, useAuth } from '../src'
import { AuthContext } from '../src/provider-context'

describe('CrossidAuthProvider', () => {
  it('useAuth should initializes a client', async () => {
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

    const { result, waitForNextUpdate } = renderHook(() => useContext(AuthContext), { wrapper })

    expect(result.current).toBeDefined()
    await waitForNextUpdate()
  })
})
