<!-- 画像をドラッグ&ドロップでアップロードできるコンポーネント -->
<template lang="pug">
  .ImageUploader
    .ImageUploader_DragDrop(
      :class="{dragging: isDragging}"
      @click="openImageSelectDialog"
      @drop.prevent="handleDropImage"
      @dragover.prevent="handleDragEvent($event, true)"
      @dragleave.prevent="handleDragEvent($event, false)"
    )
      span {{ description }}
    .ImageUploader_Preview
      .preview
        img(:src="imageUrl")
      .remove(v-if="imageUrl")
        button(@click="removeImage") ✖︎
    .ImageUploader_Hidden
      input(type="file" ref="uploadedImage" @change="handleChangeImage")
</template>

<script lang="ts">
import Vue from 'vue'

interface Data {
  isDragging: boolean
  imageUrl: string
}

interface HTMLElementEvent<T extends HTMLElement> extends Event {
  target: T
}

type ChangeImageEvent = HTMLElementEvent<HTMLInputElement> & {
  dataTransfer?: DataTransfer
}

enum Emit {
  change = 'change'
}

/**
 * $emit(Emit.change, { file })
 */

export default Vue.extend({
  props: {
    description: {
      type: String,
      default: 'PNGまたはJPGファイルをドラッグアンドドロップします。'
    },
    initImageUrl: {
      type: String,
      default: null
    }
  },
  data(): Data {
    return {
      isDragging: false,
      imageUrl: ''
    }
  },
  watch: {
    initImageUrl: {
      handler(imageUrl: string | null) {
        this.imageUrl = imageUrl || ''
      },
      immediate: true
    }
  },
  methods: {
    openImageSelectDialog() {
      const refs = this.$refs.uploadedImage as Vue & {
        click: () => void
      }
      refs.click()
    },
    handleDropImage(event: ChangeImageEvent) {
      this.isDragging = false
      const file = this.extractFile(event)
      if (!file) {
        return
      }
      this.changeImage(file)
      this.$emit(Emit.change, { file })
    },
    handleDragEvent(event: ChangeImageEvent, dragging: boolean) {
      this.isDragging = dragging && event.dataTransfer?.types[0] === 'Files'
    },
    handleChangeImage(event: ChangeImageEvent) {
      const file = this.extractFile(event)
      if (!file) {
        return
      }
      this.changeImage(file)
      this.$emit(Emit.change, { file })
    },
    extractFile(event: ChangeImageEvent) {
      const fileList = event.target?.files || event.dataTransfer?.files
      if (!fileList) {
        return null
      }
      return fileList[0] || null
    },
    changeImage(file: File) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result
        if (typeof result !== 'string') {
          return
        }
        this.imageUrl = result
      }
      reader.readAsDataURL(file)
    },
    removeImage() {
      this.imageUrl = ''
      this.$emit(Emit.change, { file: null })
    }
  }
})
</script>

<style lang="sass" scoped>
$baseColor: #cacccc
$hoverColor: #09e
$draggingColor: #ff3333
$backgroundColor: #f9f9f9
$fontColor: #889999
$removeColor: #da342e

.ImageUploader
  display: flex
  &_DragDrop
    display: flex
    align-items: center
    justify-content: center
    flex-grow: 1
    background-color: $backgroundColor
    border: 1px solid $baseColor
    font-size: 0.8em
    color: $fontColor
    box-sizing: border-box
    cursor: pointer
    border-radius: 6px
    &:hover
      border: 2px dashed $hoverColor
      span
        color: $hoverColor
    &.dragging
      border: 2px dashed $draggingColor
      span
        color: $draggingColor
  &_Preview
    position: relative
    margin-left: 15px
    .preview
      height: 100px
      width: 100px
      border-radius: 100%
      border: 1px solid $baseColor
      background-color: $backgroundColor
      display: flex
      align-items: center
      justify-content: center
      overflow: hidden
      img
        height: 100%
    .remove
      position: absolute
      top: 0px
      right: 0px
      opacity: 0
      transition: opacity 0.3s
      button
        height: 20px
        text-align: center
        border-radius: 100%
        border: none
        color: $backgroundColor
        background-color: $removeColor
    &:hover
      .remove
        opacity: 1

  &_Hidden
      display: none
</style>
