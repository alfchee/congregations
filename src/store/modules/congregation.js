import CongregationService from '@/services/CongregationService'
import { publishNotification } from '@/utils/storeHelpers.js'

export const namespaced = true

export const state = {
  congregations: [],
  near: []
}

export const mutations = {
  // set a collection of congregations in the state
  SET_CONGREGATIONS(state, congregations) {
    state.congregations = congregations
  },
  // set a collection of congregations near the user
  SET_CONGREGATIONS_NEAR(state, congregations) {
    state.near = congregations
  },
  // add a congregation in the array of near congregations
  ADD_CONGREGATION_NEAR(state, congregation) {
    state.near.push(congregation)
  },
  // add a congregation in the array of congregations at state
  ADD_CONGREGATION(state, congregation) {
    state.congregations = [...state.congregations, congregation]
  },
  // update one congregation in the state
  UPDATE_CONGREGATION(state, congregation) {
    // getting the congregation from the store using the ID
    let cong = state.congregations.find(c => c.id == congregation.id)

    if (cong) {
      // if congregation found overwrite with new values
      Object.assign(cong, congregation)
    }

    // creating a new array of objects filtered
    let filtered = state.congregations.filter(el => el.id !== congregation.id)
    filtered.push(cong)
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
  async fetchNearCongregation({ commit, dispatch }, id) {
    const congregation = await CongregationService.getCongregationById(
      id
    ).catch(err => {
      console.log('ERROR:', err)
      publishNotification(
        'error',
        `Error fetching congregation. ${err.message}`,
        dispatch
      )
    })

    if (congregation) {
      commit('ADD_CONGREGATION_NEAR', congregation)
    }
  },
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
        `The congregation was successfully created. It will not be displayed until three Contributors review it or one Admin.`,
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
  },
  async fetchCongregationsNear({ commit }, coordinates) {
    const congregations = await CongregationService.getCongregationsNear(
      coordinates
    )

    if (congregations) {
      commit('SET_CONGREGATIONS_NEAR', congregations)
    }
  },
  async upVoteCongregation({ commit, dispatch }, values) {
    return CongregationService.upVote(values)
      .then(() => {
        commit('UPDATE_CONGREGATION', values)
        // display notification
        publishNotification('success', 'Your vote has been added.', dispatch)
      })
      .catch(err => {
        console.log('ERROR', err)
        publishNotification(
          'error',
          'There was an error updating congregation. ' + err.message,
          dispatch
        )
      })
  },
  async approveByAdmin({ commit, dispatch }, values) {
    return CongregationService.approveByAdmin(values)
      .then(() => {
        commit('UPDATE_CONGREGATION', { ...values, inCommunion: true })
        // display notification
        publishNotification(
          'success',
          'The congregation has been approved.',
          dispatch
        )
      })
      .catch(err => {
        console.log('ERROR', err)
        publishNotification(
          'error',
          'There was an error updating the congregation. ' + err.message,
          dispatch
        )
      })
  }
}

export const getters = {
  getById: state => id => {
    const congregation = state.congregations.find(el => el.id === id)
    return congregation
  },
  getNearById: state => id => {
    const congregation = state.near.find(el => el.id === id)
    return congregation
  }
}
