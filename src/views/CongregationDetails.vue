<template>
  <v-container fluid grid-list-lg class="pa-0 mt-3">
    <v-layout row justify-center>
      <v-flex md10 xs12>
        <v-card>
          <v-card-title primary-title>
            <span class="title">{{ name }}</span>
          </v-card-title>

          <v-card-text>
            <v-layout row wrap>
              <v-flex md6 xs12>
                <p>
                  <b>Address:</b>
                  {{ address }}
                </p>
                <p>
                  <b>City:</b>
                  {{ city }}
                </p>
                <p>
                  <b>Country:</b>
                  {{ country }}
                </p>
              </v-flex>
              <v-flex md6 xs12>
                <p>Map here</p>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { isArray } from 'util'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      congregation: null
    }
  },
  created() {
    this.congregation = this.$store.getters['congregation/getNearById'](this.id)

    if (!this.congregation) {
      this.$store.dispatch('congregation/fetchNearCongregation', this.id)
    }
  },
  computed: {
    name: {
      get() {
        return this.congregation ? this.congregation.name : ''
      }
    },
    address: {
      get() {
        return this.congregation ? this.congregation.address : ''
      }
    },
    city: {
      get() {
        return this.congregation ? this.congregation.city : ''
      }
    },
    country: {
      get() {
        return this.congregation ? this.congregation.country : ''
      }
    },
    ...mapState({
      near: state => state.congregation.near
    })
  },
  watch: {
    near(newVal) {
      if (isArray(newVal) && newVal.length > 0) {
        this.congregation = newVal.find(el => el.id === this.id)
      }
    }
  }
}
</script>

<style></style>
