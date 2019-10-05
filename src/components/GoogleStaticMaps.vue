<template>
  <img :src="urlMap" alt="static-map" />
</template>

<script>
import { API_KEY } from '@/utils/gmaps'

export default {
  name: 'GoogleStaticMaps',
  props: {
    center: {
      type: Object,
      required: true
    },
    zoom: {
      type: Number,
      required: true
    },
    width: {
      default: 600,
      required: false
    },
    height: {
      default: 400,
      required: false
    },
    markers: {
      type: Array,
      required: false
    }
  },

  data() {
    return {
      urlMap: 'https://maps.googleapis.com/maps/api/staticmap?'
    }
  },

  mounted() {
    this.urlMap =
      this.urlMap +
      this.centerStr +
      this.zoomStr +
      this.sizeStr +
      this.markersStr +
      this.keyStr
  },

  computed: {
    centerStr() {
      return `center=${this.center.lat},${this.center.lng}`
    },
    zoomStr() {
      const str = typeof this.zoom === 'number' ? this.zoom : 18

      return `&zoom=${str}`
    },
    keyStr() {
      return `&key=${API_KEY}`
    },
    sizeStr() {
      return `&size=${this.width}x${this.height}`
    },
    markersStr() {
      let result = '&markers='

      this.markers.forEach(marker => {
        if ('label' in marker) {
          result = result + '|label:' + marker.label
        }
        if ('color' in marker) {
          result = result + '|color:' + marker.color
        }
        if ('size' in marker) {
          result = result + '|size:' + marker.size
        }

        marker.locations.forEach(location => {
          result = `${result}|${location.lat},${location.lng}`
        })
      })

      return result
    }
  }
}
</script>

<style scoped>
img {
  width: 100%;
}
</style>
