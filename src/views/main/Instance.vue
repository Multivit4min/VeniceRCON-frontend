<template>
  <div v-if="instance">
    <router-view />
    <pre v-if="store.state.app.debug">{{JSON.stringify(instance, null, 2)}}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useStore } from "vuex"
import { rootState } from "../../services/store"

export default defineComponent({
  data() {
    return {
      store: useStore<rootState>()
    }
  },
  computed: {
    instance(props) {
      return props.store.getters.selectedInstance
    }
  },
  components: {}
})
</script>
