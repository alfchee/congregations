<template>
  <v-container fluid grid-list-lg class="pa-0">
    <!-- Toolbar -->
    <v-layout row>
      <v-flex md12 xs12 class="pa-0">
        <!-- <v-toolbar flat color="primary"></v-toolbar> -->
      </v-flex>
    </v-layout>

    <!-- Card for the list of unapproved users -->
    <v-layout row justify-center>
      <v-flex md8 xs12>
        <v-card>
          <v-card-title primary-title>
            <span class="title">Users to be approved</span>
          </v-card-title>

          <v-card-text>
            <v-list two-line>
              <!-- if no users found -->
              <div v-if="unapprovedUsers.length < 1">
                <v-alert color="info" :value="true" icon="info" outline>No users found</v-alert>
              </div>

              <v-list-tile v-for="uUser in unapprovedUsers" :key="uUser.id" avatar>
                <v-list-tile-avatar>
                  <v-icon>perm_identity</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ uUser.displayName }}</v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{
                    uUser.email
                    }}
                  </v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn
                    color="green"
                    class="white--text"
                    v-if="isAdmin"
                    @click="approvedByAdmin(uUser)"
                  >Approve</v-btn>
                  <v-btn
                    color="primary"
                    class="white--text"
                    v-if="uUser.approvers.length < 3"
                    @click.stop="upVote(uUser)"
                  >Vote Yes</v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Card for the list of Users -->
    <v-layout row justify-center>
      <v-flex md8 xs12>
        <!-- Card for the content -->
        <v-card>
          <v-card-title primary-title>
            <span class="title">Users</span>
          </v-card-title>
          <v-card-text>
            <v-list two-line>
              <!-- if no users found -->
              <div v-if="users.length < 1">
                <v-alert color="info" :value="true" icon="info" outline>No users found</v-alert>
              </div>

              <v-list-tile v-for="user in users" :key="user.id" avatar>
                <v-list-tile-avatar>
                  <v-icon>perm_identity</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ user.displayName }}</v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{ user.email }}
                    <v-chip color="primary" text-color="white" v-if="user.isAdmin">
                      Admin
                      <v-icon right>star</v-icon>
                    </v-chip>
                  </v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn
                    color="blue-grey"
                    class="white--text"
                    v-if="isAdmin && !user.isAdmin"
                    @click.stop="updateAdminState(user.id, true)"
                  >Make Admin</v-btn>
                  <v-btn
                    color="blue-grey"
                    class="white--text"
                    v-if="
                      isAdmin &&
                        user.isAdmin &&
                        !(user.email === currentUser.email)
                    "
                    @click.stop="updateAdminState(user.id, false)"
                  >Revoke Admin</v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {}
  },
  created() {
    // getting the lists of users
    this.getUsers()
  },
  computed: {
    ...mapState({
      users: state => state.user.usersList,
      unapprovedUsers: state => state.user.unapprovedUsers,
      isAdmin: state => state.user.isAdmin,
      currentUser: state => state.user.user
    })
  },
  methods: {
    getUsers() {
      // getting the list of users
      this.getLatApprovedUsers()
      // get the unapproved users
      this.getUnapprovedUsers()
    },
    updateAdminState(id, isAdmin) {
      this.updateAdmin({ id, isAdmin })
    },
    upVote(user) {
      // getting the array of approvers
      let approvers = user.approvers || []
      // adding the email of current user as up vote
      approvers.push(this.currentUser.email)

      // storing the change
      this.upVoteUser({
        id: user.id,
        approvers
      }).then(() => {
        // update the lists of users after save on db
        this.getUsers()
      })
    },
    approvedByAdmin(user) {
      // getting the array of approvers
      let approvers = user.approvers || []
      // adding the email of the current admin user
      approvers.push(this.currentUser.email)

      // storing the change
      this.approveByAdmin({
        id: user.id,
        approvers
      }).then(() => {
        // update the lists of users after save
        this.getUsers()
      })
    },
    ...mapActions('user', [
      'getLatApprovedUsers',
      'getUnapprovedUsers',
      'updateAdmin',
      'upVoteUser',
      'approveByAdmin'
    ])
  }
}
</script>

<style scoped>
.v-list__tile__action .v-btn {
  padding: 0 16px;
}
</style>
