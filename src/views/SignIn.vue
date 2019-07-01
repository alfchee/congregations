<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card>
          <v-card-title class="title">Please sign in</v-card-title>
          <v-card-text class="text-xs-center">
            <v-btn
              @click.prevent="signInWithGoogle"
              color="#4285F4"
              class="white--text btn-google"
            >
              <img src="@/assets/g-logo.png" alt="g-logo" /> Sign in with Google
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('user', ['signInWithGoogle'])
  }
}
</script>

<style scoped>
.btn-google {
  padding-left: 41px;
}
.btn-google img {
  border-style: none;
  max-width: 32px;
  position: absolute;
  left: -39px;
}
</style>
