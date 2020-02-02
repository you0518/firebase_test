<template lang="pug">
  v-container(fluid)
    v-row(v-if="contents")
      v-col(cols="4" v-for="(content, index) in contents" :key="index")
        ContentCard(:content="content")
    div
      ImageUploader(@change="uploadImage")
      div
        button(@click="logout") logout
</template>

<script lang="ts">
import Vue from 'vue'
import ImageUploader from '@/components/ImageUploader.vue'
import ContentCard from '@/components/ContentCard.vue'
import { Content } from '~/entity/Content'

export default Vue.extend({
  components: {
    ImageUploader,
    ContentCard
  },
  async asyncData({ store }) {
    console.log('asyncData')
    await Promise.all([store.dispatch('Content/getList')]).catch((error) =>
      console.error(error)
    )
  },
  data() {
    return {
      image: ''
    }
  },
  computed: {
    user(): firebase.User {
      return this.$store.getters['User/user']
    },
    contents(): Content[] {
      return this.$store.getters['Content/records']
    }
  },

  methods: {
    login() {
      return this.$store.dispatch('User/login')
    },
    createContent(payload: { uid: string; file: File }) {
      return this.$store.dispatch('Content/create', payload)
    },
    async uploadImage(payload: { file: File }) {
      await this.createContent({ uid: this.user.uid, file: payload.file })
      if (!this.$firebase.messaging.isSupported()) {
        setTimeout(() => this.$store.dispatch('Content/getList'), 5000)
      }
    },
    logout() {
      this.$firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace('/login')
        })
    }
  }
})
</script>

<style lang="sass" scoped>
.image
  img
    width: 100px
    height: 100px
</style>
