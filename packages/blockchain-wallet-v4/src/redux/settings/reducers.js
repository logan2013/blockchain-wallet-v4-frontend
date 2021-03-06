import Remote from '../../remote'
import * as AT from './actionTypes'
import { assoc, compose } from 'ramda'
// const INITIAL_STATE = RD.NotAsked({
//   btc_unit: 'BTC',
//   eth_unit: 'ETH',
//   language: 'en',
//   currency: 'USD',
//   country_code: 'US',
//   email: '',
//   email_verified: 0,
//   sms_number: '',
//   sms_verified: 0,
//   auto_logout: 10,
//   logging_level: 0,
//   ip_lock: '',
//   ip_lock_on: 0
// })

const INITIAL_STATE = Remote.NotAsked

const settingsReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    // case AT.SET_SETTINGS: {
    //   const { data } = payload
    //   return data
    // }
    case AT.SET_EMAIL: {
      const { email } = payload
      // return Object.assign({}, state, { email: email, email_verified: 0 })
      return state.map(compose(assoc('email', email), assoc('email_verified', 0)))
    }
    case AT.SET_EMAIL_VERIFIED: {
      return state.map(compose(assoc('email_verified', 1), assoc('email_verified_failed', 0)))
    }
    case AT.SET_EMAIL_VERIFIED_FAILED: {
      return state.map(assoc('email_verified_failed', 1))
    }
    case AT.SET_MOBILE: {
      const { mobile } = payload
      return state.map(compose(assoc('sms_number', mobile), assoc('sms_verified', 0)))
    }
    case AT.SET_MOBILE_VERIFIED: {
      return state.map(assoc('sms_verified', 1))
    }
    case AT.SET_LANGUAGE: {
      const { language } = payload
      return state.map(assoc('language', language))
    }
    case AT.SET_CURRENCY: {
      const { currency } = payload
      return state.map(assoc('currency', currency))
    }
    case AT.SET_BITCOIN_UNIT: {
      const { unit } = payload
      return state.map(assoc('btc_currency', unit))
    }
    case AT.SET_AUTO_LOGOUT: {
      const { autoLogout } = payload
      return state.map(assoc('auto_logout', autoLogout))
    }
    case AT.SET_LOGGING_LEVEL: {
      const { loggingLevel } = payload
      return state.map(assoc('logging_level', loggingLevel))
    }
    case AT.SET_IP_LOCK: {
      const { ipLock } = payload
      if (ipLock === '') {
        return state.map(compose(assoc('ip_lock', ipLock), assoc('ip_lock_on', 0)))
      } else {
        return state.map(assoc('ip_lock', ipLock))
      }
    }
    case AT.SET_IP_LOCK_ON: {
      const { ipLockOn } = payload
      return state.map(assoc('ip_lock_on', ipLockOn))
    }
    case AT.SET_BLOCK_TOR_IPS: {
      const { blockTorIps } = payload
      return state.map(assoc('block_tor_ips', blockTorIps))
    }
    case AT.SET_HINT: {
      const { hint } = payload
      return state.map(assoc('password_hint1', hint))
    }
    case AT.SET_AUTH_TYPE: {
      const { authType } = payload
      return state.map(assoc('auth_type', authType))
    }
    case AT.SET_AUTH_TYPE_NEVER_SAVE: {
      const { authTypeNeverSave } = payload
      return state.map(assoc('never_save_auth_type', authTypeNeverSave))
    }
    case AT.SET_GOOGLE_AUTHENTICATOR: {
      return state.map(assoc('auth_type', 4))
    }
    case AT.SET_YUBIKEY: {
      return state.map(assoc('auth_type', 2))
    }
    case AT.FETCH_SETTINGS_LOADING: {
      return Remote.Loading
    }
    case AT.FETCH_SETTINGS_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_SETTINGS_FAILURE: {
      return Remote.Failure(payload)
    }
    case AT.SET_GOOGLE_AUTHENTICATOR_SECRET_URL: {
      const { url } = payload
      return state.map(assoc('google_authenticator_secret_url', url))
    }
    default:
      return state
  }
}

export default settingsReducer
