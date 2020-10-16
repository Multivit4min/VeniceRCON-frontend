<template>
  <Dialog position="top" :visible="open">
    <template #header>
      Confirm Action
    </template>
    <i class="pi pi-exclamation-triangle"></i> {{message}}
    <template #footer>
      <Button icon="pi pi-times" label="No" @click="close(false)" />
      <Button icon="pi pi-check" label="Yes" @click="close(true)" autofocus/>
    </template>
  </Dialog>
</template>


<script lang="ts">
import { defineComponent, PropType } from "vue"
import Dialog from "primevue/dialog"

export default defineComponent({
  props: {
    open: Boolean,
    message: String,
    // eslint-disable-next-line no-unused-vars
    onClose: Function as PropType<(confirm: boolean) => void>
  },
  components: {
    Dialog
  },
  methods: {
    close(confirm: boolean) {
      if (typeof this.onClose !== "function") return
      this.onClose(confirm)
    }
  }
})
</script>