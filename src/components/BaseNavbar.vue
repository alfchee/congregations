<template>
  <div>
    <!-- Top Nav toolbar -->
    <v-toolbar app absolute color="primary">
      <!-- Dropdown of main navigation -->
      <v-menu bottom right nudge-bottom="42">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" class="white--text">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>

        <v-list class="pt-0">
          <!-- Dashboard -->
          <v-list-tile :to="{ path: '/' }">
            <v-list-tile-avatar>
              <v-icon>home</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>Dashboard</v-list-tile-title>
          </v-list-tile>
          <!-- Congregations -->
          <v-list-tile
            :to="{ name: 'congregations' }"
            v-if="isLogged && (isContributor || isAdmin)"
          >
            <v-list-tile-avatar>
              <v-icon>contacts</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>Congregations</v-list-tile-title>
          </v-list-tile>
        </v-list>

        <v-list>
          <!-- Users -->
          <v-list-tile :to="{ path: '/users' }" v-if="isLogged && isAdmin">
            <v-list-tile-avatar>
              <v-icon>people</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>Users</v-list-tile-title>
          </v-list-tile>
          <!-- Logout -->
          <v-list-tile @click.prevent="singOut" v-if="isLogged">
            <v-list-tile-avatar>
              <v-icon>mobile_off</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>Sign Out</v-list-tile-title>
          </v-list-tile>
          <!-- Logout -->
          <v-list-tile :to="{ name: 'signin' }" v-if="!isLogged">
            <v-list-tile-avatar>
              <v-icon>account_circle</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>Sign In</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <!-- end of menu -->

      <!-- Title of the Navbar -->
      <v-toolbar-title class="headline text-uppercase white--text"
        >Congregations</v-toolbar-title
      >
    </v-toolbar>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      drawer: {
        open: false,
        mini: false,
        clipped: true,
        right: false
      }
    }
  },
  computed: {
    ...mapState({
      isLogged: state => state.user.isLogged,
      isAdmin: state => state.user.isAdmin,
      isContributor: state => state.user.isContributor
    })
  },
  methods: {
    ...mapActions('user', ['singOut'])
  }
}
</script>

<style scoped></style>
