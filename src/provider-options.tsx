import { ClientCrossidOpts, ClientDiscoveryOpts, ClientOpts } from '@crossid/crossid-spa-js'

class AuthProviderOptsBase {
  children: React.ReactNode
  onRedirectTo?: (url: string) => void
  post_logout_redirect_uri?: string
}

interface AuthProviderClientCrossidOpts extends ClientCrossidOpts, AuthProviderOptsBase {}

interface AuthProviderClientDiscoveryOpts extends ClientDiscoveryOpts, AuthProviderOptsBase {}

interface AuthProviderClientCustomOpts extends ClientOpts, AuthProviderOptsBase {}

export type AuthProps = AuthProviderClientCrossidOpts | AuthProviderClientDiscoveryOpts | AuthProviderClientCustomOpts
