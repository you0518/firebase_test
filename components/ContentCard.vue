<template lang="pug">
  v-card
    v-img(:src="content.downloadUrl" contain height="100")

</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Content } from '../entity/Content'
export default Vue.extend({
  props: {
    content: {
      type: Object as PropType<Content>,
      required: true
    }
  }
})
</script>
