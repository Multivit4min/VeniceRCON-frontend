<template>
  <div>
    <h3>Dashboard</h3>
    <router-link
      v-for="instance in instances"
      :to="{ name: 'Instance', params: { instanceId: instance.id }}"
      v-bind:key="instance.id"
    >{{instance.serverinfo.name}}</router-link>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import store from "../../store/"

@Options({
  computed: {
    instances: () => store.state.instances.instances
  }
})
export default class DashboardComponent extends Vue {

}
</script>
