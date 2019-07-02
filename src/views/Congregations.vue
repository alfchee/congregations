<template>
  <v-container fluid grid-list-lg class="pa-0">
    <!-- Toolbar -->
    <v-layout row>
      <v-flex md12 xs12 class="pa-0">
        <v-toolbar flat color="primary">
          <v-toolbar-items>
            <v-btn flat color="white" :to="{ name: 'congregations-create' }"
              >Create Congregation</v-btn
            >
          </v-toolbar-items>
        </v-toolbar>
      </v-flex>
    </v-layout>

    <!-- Card for the list of congregations -->
    <v-layout row justify-center>
      <v-flex md8 xs12>
        <!-- Card for the content -->
        <v-card>
          <v-card-title primary-title>
            <span class="title">Congregations</span>
          </v-card-title>
          <v-card-text>
            <v-list two-line>
              <div v-if="congregations.length > 0">
                <v-list-tile
                  v-for="congregation in congregations"
                  :key="congregation.id"
                  @click.stop
                >
                  <v-list-tile-avatar>
                    <v-icon class="grey lighten-1 white--text"
                      >store_mall_directory</v-icon
                    >
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ congregation.name }}
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </div>

              <v-alert color="info" :value="true" icon="info" outline v-else
                >No congregation found</v-alert
              >
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  created() {
    // if the list of companies is zero we try to fetch from backend
    if (this.congregations.length < 1) {
      this.fetchCongregations()
    }
  },
  computed: {
    ...mapState('congregation', ['congregations'])
  },
  methods: {
    // openEdit(id) {
    //   // redirecting to edit modal view
    //   this.$router.push({ name: 'companies-edit', params: { id } })
    // },
    ...mapActions('congregation', ['fetchCongregations'])
  }
}
</script>

<style scoped></style>
