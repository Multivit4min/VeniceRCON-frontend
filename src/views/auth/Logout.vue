<template>
  <div>
    You have been logged out!
    <router-link to="/login">Goto Login</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "../../services/store"
import { AUTH } from "../../services/store/modules/auth"

export default defineComponent({
  async mounted() {
    await this.logout()
  },
  methods: {
    async logout() {
      await store.dispatch(AUTH.LOGOUT)
    }
  }
})
</script>
