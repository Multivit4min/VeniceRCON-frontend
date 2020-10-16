<template>
  <div>
    <div id="nav">
      <router-link to="/dashboard">Dashboard</router-link> |
      <router-link v-if="loggedIn" to="/logout">Logout</router-link>
      <router-link v-else to="/login">Login</router-link> |
      Logged in as {{ whoami.token.username }}
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "../../services/store"

export default defineComponent({
  computed: {
    loggedIn: () => store.getters.loggedIn,
    whoami: () => store.state.auth.whoami
  }
})
</script>