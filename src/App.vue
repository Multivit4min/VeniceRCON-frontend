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
import { Options, Vue } from "vue-class-component"
import store from "./store"
import { APP } from "./store/modules/app"

@Options({
  computed: {
    initialized: () => store.state.app.initialized
  }
})
export default class AppComponent extends Vue {
  async mounted() {
    await store.dispatch(APP.INITIALIZE)
    this.$store
    //@ts-ignore
    this.$toast.add({
      severity: 'info',
      summary: 'Sticky Message',
      detail: 'Message Content'
    })
  }
}

</script>