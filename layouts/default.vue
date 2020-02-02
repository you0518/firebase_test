<template lang="pug">
  v-app(dark)
    v-app-bar(fixed app)
      v-toolbar-title HYGE
    v-content
      v-container
        nuxt
    v-bottom-navigation(fixed app)

        v-btn(@click="$router.push('/')")
          span(v-if="$vuetify.breakpoint.smAndUp") HOME
          v-icon mdi-home
        v-btn
          span(v-if="$vuetify.breakpoint.smAndUp") MOVIE
          v-icon mdi-plus
        v-btn(@click="$router.push('/mypage')")
          span(v-if="$vuetify.breakpoint.smAndUp") MY PAGE
          v-icon mdi-account
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
