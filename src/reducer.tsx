import { IDToken, OAuth2Error } from '@crossid/crossid-spa-js'
import { AuthState } from './provider-context'

type Action =
  // indicates that the client has initialized,
  // idToken is set if one exists.
  | { type: 'INITIALIZED'; idToken?: IDToken }
  | { type: 'LOGOUT_COMPLETED' }
  // indicates that an error has occured
  | {
      type: 'ERROR'
      error: OAuth2Error
    }

/**
 * A reducer that handles auth state.
 */
export const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'INITIALIZED':
      return {
        ...state,
        loading: false,
        idToken: action.idToken,
        error: undefined,
      }
    case 'LOGOUT_COMPLETED':
      return {
        ...state,
        loading: false,
        idToken: undefined,
        error: undefined,
      }
    case 'ERROR':
      return {
        ...state,
        loading: false,
        error: action.error,
      }
  }
}
