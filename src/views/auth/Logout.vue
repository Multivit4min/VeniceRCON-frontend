<template>
  <div>
    You have been logged out!
    <router-link to="/login">Goto Login</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import api from "../../services/api"

export default defineComponent({
  async mounted() {
    await this.logout()
  },
  methods: {
    async logout() {
      await api.logout()
    }
  }
})
</script>
