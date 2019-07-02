import Vue from 'vue'
import Vuex from 'vuex'

// importing modules
import * as notification from '@/store/modules/notification.js'
import * as user from '@/store/modules/user.js'
import * as congregation from '@/store/modules/congregation.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    notification,
    congregation
  },
  state: {
    coordinates: {
      lat: null,
      lon: null
    },
    positionAccuracy: 0
  },
  mutations: {
    SET_LOCATION(state, coor) {
      // setting the coordinates of the position
      state.coordinates = { lat: coor.latitude, lon: coor.longitude }
      // setting the accuracy of the position
      state.positionAccuracy = coor.accuracy
    }
  },
  actions: {
    getCurrentLocation({ commit, dispatch }) {
      if (navigator.geolocation) {
        // gettingt the position using the HTML5 API
        navigator.geolocation.getCurrentPosition(position => {
          commit('SET_LOCATION', position.coords)
        })
      } else {
        // display notification of lack of support
        const notification = {
          type: 'warning',
          message: 'Geolocation is not supported by this browser.'
        }
        dispatch('notification/add', notification, { root: true })
      }
    }
  }
})
