<template>
  <span v-if="hasPermission()">
    <slot></slot>
  </span>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import store from "../services/store"

export default defineComponent({
  props: {
    instance: Number,
    //array of strings or string
    scopes: {
      validator(value) {
        return (
          (Array.isArray(value) && value.every(v => typeof v === "string")) ||
          typeof value === "string"
        )
      }
    }
  },
  computed: {
    hasPermission() {
      return () => {
        const { hasPermission } = store.getters
        const scopes = (Array.isArray(this.scopes) ? this.scopes : [this.scopes]) as string[]
        return scopes.some(scope => hasPermission(this.instance || 0, scope))
      }
    }
  }
})
</script>