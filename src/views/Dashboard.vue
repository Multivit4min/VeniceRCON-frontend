<template>
  <div>
    <h3>Dashboard</h3>
    <pre>{{JSON.stringify(messages, null, 2)}}</pre>
    <pre>{{JSON.stringify(instances, null, 2)}}</pre>
    <pre>{{JSON.stringify(whoami, null, 2)}}</pre>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import store from "../store"

@Options({
  props: {},
  computed: {
    whoami: () => store.state.auth.whoami,
    instances: () => store.state.instances.instances,
    messages: () => store.state.instances.messages
  }
})
export default class DashboardComponent extends Vue {

}
</script>
