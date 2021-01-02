<template>
  <socket-component />
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import SocketComponent from "../../services/socket"

export default defineComponent({
  components: { SocketComponent }
})
</script>