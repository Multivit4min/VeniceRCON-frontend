<template>
  <div>
    <div v-if="initialized">
      <router-view/>
    </div>
    <div v-else>
      Loading...
    </div>
    <Toast />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "./services/store"
import { APP } from "./services/store/modules/app"

export default defineComponent({
  computed: {
    initialized: () => store.state.app.initialized
  },
  async mounted() {
    await store.dispatch(APP.INITIALIZE)
  }
})

</script>