<template>
  <Menu :model="items" />
</template>

<style scoped>
  .p-menu {
    width: 100%;
    border: none;
  }
</style>

<script>
import { defineComponent } from "vue"

export default defineComponent({
  data() {
    return {
      items: [{
        label: "Options",
        items: [{
          label: "Update",
          icon: "pi pi-refresh",
          command: () => {
          }
        }, {
          label: "Delete",
          icon: "pi pi-times",
          command: () => {
          }
        }
      ]}, {
        label: "Navigate",
        items: [{
          label: "Vue Website",
          icon: "pi pi-external-link",
          url: "https://vuejs.org/"
        }, {
          label: "Router",
          icon: "pi pi-upload",
          to: "/fileupload"
        }]
      }]
    }
  }
})
</script>