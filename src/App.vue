<template>
  <div>
    <div v-if="initialized">
      <router-view/>
    </div>
    <div v-else>
      Loading...
    </div>
    <Toast />
    <ConfirmPopup />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "./services/store"
import { APP } from "./services/store/modules/app"
import ConfirmPopup from "primevue/confirmpopup"


export default defineComponent({
  computed: {
    initialized: () => store.state.app.initialized
  },
  components: {
    ConfirmPopup
  },
  async mounted() {
    await store.dispatch(APP.INITIALIZE)
  }
})

</script>