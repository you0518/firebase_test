<template lang="pug">
  div
    #firebaseui-auth-container
</template>

<script lang="ts">
import Vue from 'vue'
import * as firebaseui from 'firebaseui'

export default Vue.extend({
  computed: {
    authUi() {
      return (
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(this.$firebase.auth())
      )
    },
    user(): firebase.User {
      return this.$store.getters['User/user']
    }
  },
  mounted() {
    this.authUi.start('#firebaseui-auth-container', {
      signInSuccessUrl: '/',
      signInOptions: [this.$firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    })
  }
})
</script>
