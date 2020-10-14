<template>
  <div>
    <h3>Console {{instanceId}}</h3>
    <pre>{{messages}}</pre>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import store from "../store"
import Terminal from "primevue/terminal"

class Props {
  instanceId!: number
}

@Options({
  components: {
    Terminal
  }
})
export default class ConsoleComponent extends Vue.props(Props) {

  get messages(): { type: "receive"|"send", words: string[] }[] {
    const messages = store.state.instances.console
      .find(({ id }) => id === this.instanceId)
    console.log({ messages   })
    return messages ? messages.messages : []
  }

}
</script>
