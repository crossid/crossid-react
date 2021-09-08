import { OAuth2Error } from '@crossid/crossid-spa-js'

// oauth2Error normalizes javascript Error to AuthError
export const oauth2Error = (e: Error): OAuth2Error => {
  return OAuth2Error.create({ error: e.message, error_description: '' })
}
