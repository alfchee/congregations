<template>
  <v-container fluid grid-list-lg class="pa-0">
    <v-layout row justify-center>
      <!-- Card for the list of congregations near -->
      <v-flex md10 xs12>
        <v-card>
          <v-card-title class="title"
            >Displaying congregations 100km near you</v-card-title
          >
          <v-card-text>
            <v-list two-line>
              <div v-if="near.length > 0">
                <!-- Render each congregation -->
                <v-list-tile
                  v-for="congregation in near"
                  :key="congregation.id"
                  @click.stop
                >
                  <v-list-tile-avatar>
                    <v-icon class="grey lighten-1 white--text"
                      >store_mall_directory</v-icon
                    >
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title class="subheading">
                      {{ congregation.name }}
                    </v-list-tile-title>
                    <p class="body-1 gray--text text--lighten-2">
                      Distance {{ congregation.distance.toFixed(3) }}Km
                    </p>
                  </v-list-tile-content>
                </v-list-tile>
              </div>

              <!-- Displaying a message of not found -->
              <v-alert color="info" :value="true" icon="info" outline v-else
                >No congregation near found.</v-alert
              >
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex md12 xs12>
        <v-card>
          <GoogleMaps :center="{ ...coordinates }" :marker="nearLocations" />
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import GoogleMaps from '@/components/GoogleMaps'

export default {
  components: {
    GoogleMaps
  },
  mounted() {
    this.$store.dispatch('getCurrentLocation')
  },
  computed: {
    nearLocations() {
      const locations = []

      for (let i = 0; i < this.near.length; i++) {
        locations.push({
          lat: this.near[i].coordinates.lat,
          lng: this.near[i].coordinates.lng
        })
      }

      return locations
    },
    ...mapState({
      near: state => state.congregation.near,
      coordinates: state => state.coordinates
    })
  },
  methods: {
    ...mapActions('congregation', ['fetchCongregationsNear'])
  },
  watch: {
    coordinates(newVal) {
      console.log(`currentLocation`, newVal)
      if (newVal.lat) {
        this.fetchCongregationsNear({ lat: newVal.lat, lng: newVal.lng })
      }
    }
  }
}
</script>
