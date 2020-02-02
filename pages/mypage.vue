<template lang="pug">
  .MyPage
    Profile
    v-container(fluid)
      v-row(v-if="myContents")
        v-col(cols="4" v-for="(content, index) in myContents" :key="index")
          ContentCard(:content="content")
</template>

<script lang="ts">
import Vue from 'vue'
import Profile from '@/components/Profile.vue'
import ContentCard from '@/components/ContentCard.vue'
import { Content } from '~/entity/Content'

export default Vue.extend({
  components: {
    Profile,
    ContentCard
  },
  async asyncData({ store }) {
    await Promise.all([store.dispatch('Content/getList')])
  },
  computed: {
    user(): firebase.User {
      return this.$store.getters['User/user']
    },
    myContents(): Content[] {
      return this.$store.getters['Content/filter'](this.user.uid)
    }
  }
})
</script>
