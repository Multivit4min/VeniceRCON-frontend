<template>
  <div v-if="initialized">
    <div id="nav">
      <router-link to="/">Dashboard</router-link> |
      <router-link v-if="loggedIn" to="/logout">Logout</router-link>
      <router-link v-else to="/login">Login</router-link>
    </div>
    <router-view/>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "./store"
import { APP } from "./store/modules/app"

export default defineComponent({
  computed: {
    initialized: () => store.state.app.initialized,
    loggedIn: () => store.getters.loggedIn
  },
  async mounted() {
    await store.dispatch(APP.INITIALIZE)
  }
})

</script>

<style>
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
