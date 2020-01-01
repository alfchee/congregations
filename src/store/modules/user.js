import AuthService from '@/services/AuthService'
import { publishNotification } from '@/utils/storeHelpers.js'
import UserService from '../../services/UserService'

export const namespaced = true

export const state = {
  user: JSON.parse(localStorage.getItem('cc_user')) || {},
  token: localStorage.getItem('cc_token') || '',
  isLogged: false,
  isAdmin: false,
  isContributor: false,
  usersList: [],
  unapprovedUsers: []
}

export const mutations = {
  SET_LOG_IN(state, { user, token }) {
    state.isLogged = true
    state.user = user
    state.token = token
    // set in local storage
    localStorage.setItem('cc_user', JSON.stringify(user))
    localStorage.setItem('cc_token', JSON.stringify(token))
  },
  SET_PERMISSIONS(state, user) {
    state.isAdmin = user.isAdmin
    state.isContributor = user.isContributor
  },
  LOGOUT(state) {
    state.isLogged = false
    state.user = {}
    state.token = ''
    // remove from local storage
    localStorage.removeItem('cc_user')
    localStorage.removeItem('cc_token')
  },
  SET_USERS_LIST(state, users) {
    state.usersList = users
  },
  SET_UNAPPROVED_USERS(state, users) {
    state.unapprovedUsers = users
  },
  UPDATE_USER_INFO(state, values) {
    // getting the user from the store using the ID
    let user = state.usersList.find(u => u.id === values.id)

    if (user) {
      // if user found overwrite with new values
      Object.assign(user, values)
    }
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
      commit('SET_PERMISSIONS', user)
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
  },
  getLatApprovedUsers({ commit, dispatch }) {
    UserService.getLastApprovedUsers()
      .then(users => {
        commit('SET_USERS_LIST', users)
      })
      .catch(err => {
        console.log('ERROR', err)
        publishNotification(
          'error',
          'There was an error fetching users. ' + err.message,
          dispatch
        )
      })
  },
  getUnapprovedUsers({ commit, dispatch }) {
    UserService.getUnapprovedUsers()
      .then(users => {
        commit('SET_UNAPPROVED_USERS', users)
      })
      .catch(err => {
        console.log('ERROR', err)
        publishNotification(
          'error',
          'There was an error fetching users. ' + err.message,
          dispatch
        )
      })
  },
  updateAdmin({ commit, dispatch }, values) {
    UserService.updateAdmin(values)
      .then(() => {
        commit('UPDATE_USER_INFO', values)
        // display notification
        publishNotification(
          'success',
          'The user has been upgraded to Admin.',
          dispatch
        )
      })
      .catch(err => {
        console.log('ERROR', err)
        publishNotification(
          'error',
          'There was an error updating user.' + err.message,
          dispatch
        )
      })
  },
  async upVoteUser({ commit, dispatch }, values) {
    return UserService.upVoteUser(values)
      .then(() => {
        commit('UPDATE_USER_INFO', values)
        // display notification
        publishNotification('success', 'Your vote has been added.', dispatch)
      })
      .catch(err => {
        console.log('ERROR', err)
        publishNotification(
          'error',
          'There was an error updating user.' + err.message,
          dispatch
        )
      })
  },
  async approveByAdmin({ commit, dispatch }, values) {
    return UserService.approveByAdmin(values)
      .then(() => {
        commit('UPDATE_USER_INFO', values)
        // display notification
        publishNotification(
          'success',
          'The user has been approved as Contributor',
          dispatch
        )
      })
      .catch(err => {
        console.log('ERROR', err)
        publishNotification(
          'error',
          'There was an error updating user. ' + err.message,
          dispatch
        )
      })
  }
}
