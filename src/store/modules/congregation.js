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
  }
}
