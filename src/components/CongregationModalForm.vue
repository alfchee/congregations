<template>
  <v-dialog
    v-model="isOpen"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card tile>
      <!-- Toolbar of the card -->
      <v-toolbar card dark color="primary">
        <v-btn icon dark @click="closeModal">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ modalTitle }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn dark flat @click="save">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-layout row wrap justify-center>
            <v-flex md6 xs12>
              <div class="mb-4">
                <v-text-field
                  hint="Name (required)"
                  persistent-hint
                  required
                  v-model="name"
                ></v-text-field>
                <v-text-field
                  hint="Address (required)"
                  persistent-hint
                  required
                  v-model="address"
                ></v-text-field>
                <v-text-field
                  hint="City (required)"
                  persistent-hint
                  required
                  v-model="city"
                ></v-text-field>
                <v-text-field
                  hint="Country (required)"
                  persistent-hint
                  required
                  v-model="country"
                ></v-text-field>

                <v-layout row wrap>
                  <v-flex md6>
                    <v-text-field
                      hint="Latitude (required)"
                      persistent-hint
                      required
                      type="number"
                      v-model="coordinates.lat"
                    ></v-text-field>
                  </v-flex>
                  <v-flex md6>
                    <v-text-field
                      hint="Longitude (required)"
                      persistent-hint
                      required
                      type="number"
                      v-model="coordinates.lng"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from '@/utils/firebase'

import { setTimeout } from 'timers'
export default {
  props: {
    id: { type: String },
    congregationId: { type: String }
  },
  created() {
    if (this.id) {
      // searching the congregation by ID
      const congregation = this.$store.getters['congregation/getById'](this.id)

      // setting the state variables to display editable values on the form
      if (congregation) {
        this.name = congregation.name || ''
        this.address = congregation.address || ''
        this.city = congregation.city || ''
        this.country = congregation.country || ''
        this.coordinates = congregation.coordinates || { lat: 0, lng: 0 }
        this.congregationEdited = congregation
      }
    }
  },
  data() {
    return {
      isOpen: true,
      name: '',
      address: '',
      city: '',
      country: '',
      coordinates: {
        lat: 0,
        lng: 0
      },
      congregationEdited: null
    }
  },
  computed: {
    modalTitle() {
      return this.id ? 'Edit Congregation' : 'Create Congregation'
    }
  },
  methods: {
    closeModal() {
      this.isOpen = false
      // redirect in 130ms after close the modal
      setTimeout(() => {
        this.$router.push({
          name: 'congregations'
        })
      }, 130)
    },
    save() {
      // collecting all the data that will be stored
      let toStore = {
        name: this.name,
        address: this.address,
        city: this.city,
        country: this.country,
        coordinates: {
          lat: 1 * this.coordinates.lat,
          lng: 1 * this.coordinates.lng
        },
        createdAt: firebase.firestore.Timestamp.fromDate(new Date())
      }

      // we are editin an existent congregation
      if (this.id) {
        // merging the edited and non edited values
        toStore = { ...this.congregationEdited, ...toStore }
        // dispatch the update
        this.$store
          .dispatch('congregation/updateCongregation', toStore)
          .then(() => {
            console.log('Congregation updated')
            this.closeModal()
          })
      } else {
        // we are creating a new congregation
        this.$store
          .dispatch('congregation/createCongregation', toStore)
          .then(() => {
            console.log('Congregation created!')
            this.closeModal()
          })
          .catch(err => {
            console.log('ERROR:', err)
          })
      }
    }
  }
}
</script>

<style></style>
