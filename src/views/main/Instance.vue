<template>
  <div>
    <h3>Instance</h3>
    <pre>{{JSON.stringify(instance, null, 2)}}</pre>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import store from "../../store"
import router from "../../router"

@Options({
  computed: {
    instance: () => store.state.instances.instances.find(instance => {
      const id = router.currentRoute.value.params.instanceId
      if (typeof id !== "string") return router.push("/dashboard")
      return instance.id === parseInt(id, 10)
    })
  }
})
export default class InstanceComponent extends Vue {

}
</script>
