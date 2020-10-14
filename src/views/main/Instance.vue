<template>
  <div>
    <h3>Instance</h3>
    <Console :instanceId="instanceId" />
    <pre>{{JSON.stringify(instance, null, 2)}}</pre>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import store from "../../store"
import router from "../../router"
import Console from "../../components/Console.vue"

@Options({
  computed: {
    instance: () => store.state.instances.instances.find(instance => {
      const id = router.currentRoute.value.params.instanceId
      if (typeof id !== "string") return router.push("/dashboard")
      return instance.id === parseInt(id, 10)
    })
  },
  components: {
    Console
  }
})
export default class InstanceComponent extends Vue {

  get instanceId() {
    const id = router.currentRoute.value.params.instanceId
    if (typeof id !== "string") return 0
    return parseInt(id, 10)
  }

}
</script>
