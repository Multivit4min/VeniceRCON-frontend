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
import { Options } from "vue-class-component"
import store from "./store"
import { APP } from "./store/modules/app"
import { VueComponent } from "./util/VueComponent"

@Options({
  computed: {
    initialized: () => store.state.app.initialized
  }
})
export default class AppComponent extends VueComponent {
  async mounted() {
    await store.dispatch(APP.INITIALIZE)
  }
}

</script>