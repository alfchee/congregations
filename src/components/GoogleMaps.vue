<template>
  <div class="map"></div>
</template>

<script>
import gmapsInit from '@/utils/gmaps'
import bluedot from '@/assets/bluedot.png'
import { isNumber, isArray } from 'util'

export default {
  name: 'GoogleMaps',
  props: {
    center: {
      type: Object,
      required: true
    },
    marker: { type: Array }
  },
  async mounted() {
    try {
      // init and wait for the Google script is mounted
      this.google = await gmapsInit()

      // if the location is already set, for example
      // when returning back to this view from another one
      if ('lat' in this.myLocation && this.myLocation.lat) {
        this.drawMap()
        // set the current location
        this.setUserMarker(this.myLocation)
      }
    } catch (err) {
      console.log('ERROR:', err)
    }
  },
  data() {
    return {
      google: null,
      map: null,
      markers: [],
      userMarker: null
    }
  },
  computed: {
    myLocation() {
      // if the coordinates is not set
      if (!('lat' in this.center) && !isNumber(this.center.lat)) {
        return null
      }
      // return the object expected by Google Maps
      return { lat: this.center.lat, lng: this.center.lng }
    }
  },
  methods: {
    drawMap() {
      if (this.myLocation.lat && this.myLocation.lng) {
        // creating the map object, displaying it in the $el DOM object
        this.map = new this.google.maps.Map(this.$el, {
          zoom: 12,
          center: this.myLocation
        })

        this.map.setCenter(this.myLocation)
      }
    },
    // add a marker with a blue dot to indicate the user location
    setUserMarker(location) {
      this.userMarker = new this.google.maps.Marker({
        position: location,
        map: this.map,
        icon: bluedot
      })
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
    marker: function(newVal) {
      if (isArray(newVal)) {
        // clear the markers
        this.clearMarkers()

        for (let i = 0; i < newVal.length; i++) {
          let position = newVal[i]
          if (
            'lat' in position &&
            isNumber(position.lat) &&
            isNumber(position.lng)
          ) {
            // set the current location
            this.addMarker(position)
          }
        }
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
