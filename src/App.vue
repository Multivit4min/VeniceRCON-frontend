<template>
  <div v-if="initialized">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "./store"
import { APP } from "./store/modules/app"

export default defineComponent({
  computed: {
    initialized: () => store.state.app.initialized
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
