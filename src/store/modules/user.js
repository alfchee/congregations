import AuthService from '@/services/AuthService'
import { publishNotification } from '@/utils/storeHelpers.js'

export const namespaced = true

export const state = {
  user: JSON.parse(localStorage.getItem('user')) || {},
  token: localStorage.getItem('token') || '',
  isLogged: false,
  isAdmin: false,
  isContributor: false
}

export const mutations = {
  SET_LOG_IN(state, { user, token }) {
    state.isLogged = true
    state.user = user
    state.token = token
    // set in local storage
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', JSON.stringify(token))
  },
  SET_ADMIN_USER(state, isAdmin) {
    state.isAdmin = isAdmin
  },
  LOGOUT(state) {
    state.isLogged = false
    state.user = {}
    state.token = ''
    // remove from local storage
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}

export const actions = {
  /**
   * Set the login using the user and token of an already opened session with Firebase
   * @param {*} Vuex objects
   * @param {*} User Object with the User Info and Access Token from Firebase
   */
  signInWithUserAndToken({ commit, dispatch }, { user, token }) {
    commit('SET_LOG_IN', { user, token })

    // show notification
    publishNotification('success', 'Signed In!', dispatch)
  },
  /**
   * Fetches the information of the User of sign in, if exists in DB, else creates it
   * @param {*} Vuex Objects
   */
  async fetchOrCreateUser({ state, commit }) {
    const user = await AuthService.fetchOrCreateUser(state.user)

    if (user) {
      // commit in the state the stored info in DB
      commit('SET_ADMIN_USER', user.isAdmin)
    }
  },
  /**
   * Starts the Sign In with Google Flow of Firebase
   * @param {*} Vuex Objects
   */
  async signInWithGoogle({ commit, dispatch }) {
    const result = await AuthService.signInWithGoogle().catch(err => {
      // make sure is sign out
      commit('LOGOUT')
      console.error('ERROR:', err)
      publishNotification(
        'error',
        'There was an error creating the user. ' + err.message,
        dispatch
      )
    })

    if (result && 'user' in result) {
      commit('SET_LOG_IN', { user: result.user, token: result.token })
      // show notification
      publishNotification('success', 'User successfuly signed in!', dispatch)
    }
  },
  /**
   * Perform the Sign Out with Firebase
   * @param {*} Vuex objects
   */
  singOut({ commit, dispatch }) {
    AuthService.signOut()
      .then(() => {
        commit('LOGOUT')
      })
      .catch(err => {
        console.error('ERROR:', err)
        publishNotification(
          'error',
          'There was an error when sign out. ' + err.message,
          dispatch
        )
      })
  }
}
