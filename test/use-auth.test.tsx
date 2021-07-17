import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { CrossidAuthProvider, useAuth } from '../src'

describe('CrossidAuthProvider', () => {
  it('useAuth should initializes a client', async () => {
    //   // see https://react-hooks-testing-library.com/usage/advanced-hooks#context
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CrossidAuthProvider
        authorization_endpoint="https://myorg.crossid.io/oauth2/default/auth"
        token_endpoint="https://myorg.crossid.io/oauth2/default/token"
        issuer="https://myorg.crossid.io/oauth2/default"
        client_id="client_test1"
      >
        {children}
      </CrossidAuthProvider>
    )

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper,
    })
    expect(result.current).toBeDefined()
    await waitForNextUpdate()
    expect(result.current.client).toBeDefined()
  })
})
