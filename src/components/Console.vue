<template>
  <div class="terminal" :style="`height:${height}vh`">
    <pre class="content"><template v-for="message in terminal">{{`${message.prefix} ${message.words.join(" ")}\n`}}</template></pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "../services/store"

export default defineComponent({
  props: {
    instanceId: Number,
    height: Number
  },
  computed: {
    terminal(): { prefix: string, words: string[] }[] {
      const data = store.state.instances.console
        .find(({ id }) => id === this.instanceId)
      if (!data) return []
      const messages = [...data.messages].reverse()
      return messages.map(({ type, words }) => ({
        prefix: type === "receive" ? "<" : ">", words
      }))
    }
  }
})
</script>

<style scoped>
  .content {
    margin: 5px;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .terminal {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    background-color: black;
    color: white;
    position: relative;
  }
</style>
