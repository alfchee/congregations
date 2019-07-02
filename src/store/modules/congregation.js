import CongregationService from '@/services/CongregationService'
import { publishNotification } from '@/utils/storeHelpers.js'

export const namespaced = true

export const state = {
  congregations: []
}

export const mutations = {
  SET_CONGREGATIONS(state, congregations) {
    state.congregations = congregations
  },
  ADD_CONGREGATION(state, congregation) {
    state.congregations = [...state.congregations, congregation]
  },
  UPDATE_CONGREGATION(state, congregation) {
    // creating a new array of objects filtered
    let filtered = state.congregations.filter(el => el.id !== congregation.id)
    state.congregations = filtered.push(congregation)
  },
  DELETE_CONGREGATION(state, congregationId) {
    // creating a new array of objects filterd
    let filtered = state.congregations.filter(el => el.id !== congregationId)
    state.congregations = filtered
  }
}

export const actions = {
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
