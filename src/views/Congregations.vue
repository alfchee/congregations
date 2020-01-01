<template>
  <v-container fluid grid-list-lg class="pa-0">
    <!-- Toolbar -->
    <v-layout row>
      <v-flex md12 xs12 class="pa-0">
        <v-toolbar flat color="primary">
          <v-toolbar-items>
            <v-btn
              flat
              color="white"
              :to="{ name: 'congregations-create' }"
              v-if="isContributor || isAdmin"
            >Create Congregation</v-btn>
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
                  @click.stop="openEdit(congregation.id)"
                >
                  <v-list-tile-avatar>
                    <v-icon class="grey lighten-1 white--text">store_mall_directory</v-icon>
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>{{ congregation.name }}</v-list-tile-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-btn
                      color="primary"
                      class="white--text"
                      v-if="isContributor && !congregation.inCommunion"
                      @click.stop="upVote(congregation)"
                    >Approve</v-btn>
                    <v-btn
                      color="primary"
                      class="white--text"
                      v-if="isAdmin && !congregation.inCommunion"
                      @click.stop="approvedByAdmin(congregation)"
                    >Admin Approve</v-btn>
                    <v-btn icon ripple @click.stop="deleteCongregation(congregation.id)">
                      <v-icon color="grey lighten-1">delete</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </div>

              <v-alert color="info" :value="true" icon="info" outline v-else>No congregation found</v-alert>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Router for the modal view of create and edit -->
        <router-view></router-view>
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
    ...mapState({
      isLogged: state => state.user.isLogged,
      isAdmin: state => state.user.isAdmin,
      isContributor: state => state.user.isContributor,
      currentUser: state => state.user.user
    }),
    ...mapState('congregation', ['congregations'])
  },
  methods: {
    openEdit(id) {
      // redirecting to edit modal view
      this.$router.push({ name: 'congregations-edit', params: { id } })
    },
    upVote(congregation) {
      // getting the array of approvers
      let approvers = congregation.approvers || []
      // adding the email of the current user
      approvers.push(this.currentUser.email)

      // saving changes
      this.upVoteCongregation({
        id: congregation.id,
        approvers
      })
    },
    approvedByAdmin(congregation) {
      // getting the array of approvers
      let approvers = congregation.approvers || []
      // adding the email fo the curren admin user
      approvers.push(this.currentUser.email)

      // storing the change
      this.approveByAdmin({
        id: congregation.id,
        approvers
      })
    },
    ...mapActions('congregation', [
      'fetchCongregations',
      'deleteCongregation',
      'upVoteCongregation',
      'approveByAdmin'
    ])
  }
}
</script>

<style scoped>
.v-list__tile__action .v-btn {
  padding: 0 16px;
}
.v-list__tile__action--stack {
  flex-direction: row !important;
  width: 280px !important;
}
</style>
