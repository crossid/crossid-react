import { OAuth2Error } from '@crossid/crossid-spa-js'

/**
 * returns true if the browser is in the correct state to complete the login flow.
 *
 * @param sp
 * @returns
 */
export const shouldCompleteLogin = (loc = window.location, redirect_uri: string): boolean => {
  const { origin, pathname } = loc
  const sp = new URLSearchParams(loc.search)
  return origin + pathname === redirect_uri && sp.has('code') && !sp.has('error')
}

/**
 *
 * @param loc returns true if the browser is in the correct state to complete the logout flow.
 * @param redirect_uri
 * @returns
 */
export const shouldCompleteLogout = (loc = window.location, redirect_uri: string): boolean => {
  const { origin, pathname } = loc
  const sp = new URLSearchParams(loc.search)
  return origin + pathname === redirect_uri && sp.has('state') && !sp.has('error')
}

/**
 *
 * @param loc returns an OAuth2Error if browser query params indicate that an error has occured.
 * @param redirect_uris
 * @returns
 */
export const authPageHasError = (loc = window.location, redirect_uris: string[]): OAuth2Error | undefined => {
  const { origin, pathname } = loc
  if (redirect_uris.some((u) => u === origin + pathname)) {
    const sp = new URLSearchParams(loc.search)
    if (sp.get('error')) {
      return OAuth2Error.create({ error: sp.get('error') || '', error_description: sp.get('error_description') || '' })
    }
  }
}
