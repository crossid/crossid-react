import React from 'react'
import { ClientOpts } from '@crossid/crossid-spa-js'
import { PropsWithChildren } from 'react'
import CrossidAuthProvider from '../src/provider'

export const createApp =
  ({ client_id = 'test', ...opts }: Partial<ClientOpts> = {}) =>
  ({ children }: PropsWithChildren<{}>): JSX.Element =>
    (
      <CrossidAuthProvider
        authorization_endpoint="https://myorg.crossid.io/oauth2/default/auth"
        token_endpoint="https://myorg.crossid.io/oauth2/default/token"
        issuer="https://myorg.crossid.io/oauth2/default"
        client_id={client_id}
        {...opts}
      >
        {children}
      </CrossidAuthProvider>
    )
