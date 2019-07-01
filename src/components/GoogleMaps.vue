<template>
  <div class="map"></div>
</template>

<script>
import gmapsInit from '@/utils/gmaps'
import { mapState } from 'vuex'
import { isNumber, isObject } from 'util'

export default {
  name: 'GoogleMaps',
  async mounted() {
    try {
      // init and wait for the Google script is mounted
      this.google = await gmapsInit()

      // if the location is already set, for example
      // when returning back to this view from another one
      if ('lat' in this.myLocation && this.myLocation.lat) {
        this.drawMap()
        // set the current location
        this.addMarker(this.myLocation)
      }
    } catch (err) {
      console.log('ERROR:', err)
    }
  },
  data() {
    return {
      google: null,
      map: null,
      markers: []
    }
  },
  computed: {
    myLocation() {
      // if the coordinates is not set
      if (!('lat' in this.coordinates) && !isNumber(this.coordinates.lat)) {
        return null
      }
      // return the object expected by Google Maps
      return { lat: this.coordinates.lat, lng: this.coordinates.lon }
    },
    ...mapState({
      coordinates: state => state.coordinates
    })
  },
  methods: {
    drawMap() {
      if (this.coordinates.lat && this.coordinates.lon) {
        // creating the map object, displaying it in the $el DOM object
        this.map = new this.google.maps.Map(this.$el, {
          zoom: 18,
          center: this.myLocation
        })
      }
    },
    // Adds a marker to the map and push to the array
    addMarker(location) {
      // the marker positioned at `myLocation`
      const marker = new this.google.maps.Marker({
        position: location,
        map: this.map
      })
      this.markers.push(marker)
    },
    // Sets the map on all markers in the array
    setAllMarkersInMap(map) {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(map)
      }
    },
    // Removes the markers from the map, but keeps them in the array
    clearMarkers() {
      this.setAllMarkersInMap(null)
    },
    // Deletes all markers in the array by removing references to them
    deleteMarkers() {
      this.clearMarkers()
      this.markers = []
    }
  },
  watch: {
    myLocation: function(newVal) {
      console.log(newVal)
      if (isObject(newVal)) {
        if (!this.map && 'lat' in newVal && isNumber(newVal.lat)) {
          this.drawMap()
        }
        // clear the markers
        this.clearMarkers()
        // set the current location
        this.addMarker(newVal)
      }
    }
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 400px;
}
</style>
