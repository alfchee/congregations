import CongregationService from '@/services/CongregationService'
import { publishNotification } from '@/utils/storeHelpers.js'

export const namespaced = true

export const state = {
  congregations: []
}

export const mutations = {
  // set a collection of congregations in the state
  SET_CONGREGATIONS(state, congregations) {
    state.congregations = congregations
  },
  // add a congregation in the array of congregations at state
  ADD_CONGREGATION(state, congregation) {
    state.congregations = [...state.congregations, congregation]
  },
  // update one congregation in the state
  UPDATE_CONGREGATION(state, congregation) {
    // creating a new array of objects filtered
    let filtered = state.congregations.filter(el => el.id !== congregation.id)
    filtered.push(congregation)
    state.congregations = filtered
  },
  // delete one congregation from the state
  DELETE_CONGREGATION(state, congregationId) {
    // creating a new array of objects filterd
    let filtered = state.congregations.filter(el => el.id !== congregationId)
    state.congregations = filtered
  }
}

export const actions = {
  /**
   * Fetch last created congregations from database
   * @param {*} Vuex objects
   */
  async fetchCongregations({ commit, dispatch }) {
    const congregations = await CongregationService.getLastCreated().catch(
      err => {
        console.log('ERROR:', err)
        publishNotification(
          'error',
          `Error fetching congregations. ${err.message}`,
          dispatch
        )
      }
    )

    if (congregations) {
      commit('SET_CONGREGATIONS', congregations)
    }
  },
  /**
   * Creates a new Congregation document in database
   * @param {*} Vuex objects
   * @param {*} congregation object to be stored in database
   */
  async createCongregation({ commit, dispatch }, congregation) {
    let created = await CongregationService.create(congregation).catch(err => {
      publishNotification(
        'error',
        `Error creating congregations. ${err.message}`,
        dispatch
      )
    })

    if ('id' in created) {
      commit('ADD_CONGREGATION', created)
      publishNotification(
        'success',
        `The congregation was successfully created.`,
        dispatch
      )
    }
  },
  /**
   * Updates a Congregation document in database and updates the geo information
   * @param {*} Vuex objects
   * @param {*} congregation object to be stored in database
   */
  updateCongregation({ commit, dispatch }, congregation) {
    CongregationService.update(congregation)
      .then(() => {
        commit('UPDATE_CONGREGATION', congregation)
        publishNotification(
          'success',
          'The congregation was successfully updated',
          dispatch
        )
      })
      .catch(err => {
        publishNotification(
          'error',
          `There was an error updating congregation. ${err.message}`,
          dispatch
        )
      })
  },
  /**
   * Deletes a Congregation document from database including the geo information
   * @param {*} Vuex objects
   * @param {*} id ID of the congregation to delete
   */
  deleteCongregation({ commit, dispatch }, id) {
    return CongregationService.delete(id)
      .then(() => {
        commit('DELETE_CONGREGATION', id)
        publishNotification(
          'success',
          `The congregation was deleted.`,
          dispatch
        )
      })
      .catch(err => {
        publishNotification(
          'error',
          `There was an error deleting congregation. ${err.message}`,
          dispatch
        )
      })
  }
}

export const getters = {
  getById: state => id => {
    const congregation = state.congregations.find(el => el.id === id)
    return congregation
  }
}
