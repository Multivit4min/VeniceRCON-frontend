<template>
  <div>
    <h3>Instance</h3>
    <Console :instanceId="instanceId" :height="40" />
    <pre>{{JSON.stringify(instance, null, 2)}}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "../../services/store"
import router from "../../services/router"
import Console from "../../components/Console.vue"

export default defineComponent({
  computed: {
    instanceId() {
      const id = router.currentRoute.value.params.instanceId
      if (typeof id !== "string") return 0
      return parseInt(id, 10)
    },
    instance() {
      return store.state.instances.instances
        //@ts-ignore
        .find(instance => instance.id === this.instanceId)
    }
  },
  components: {
    Console
  }
})
</script>
