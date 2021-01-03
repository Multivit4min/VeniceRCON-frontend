<template>
  <div class="p-grid p-nogutter">
    <div class="p-col-12 topbar">
      <AppBar />
    </div>
  </div>
  <div class="p-grid topbar-spacer">
    <div class="p-col-fixed sidebar">
      <AppMenu />
    </div>
    <div class="p-col content p-nogutter">
      <router-view />
    </div>
  </div>
  <socket-component />
</template>

<style>
  body {
    margin-top: 0;
  }
</style>

<style scoped>
  .topbar {
    position: fixed;
    background: #0388e5;
    height: 60px;
    z-index: 1000;
    right: 0;
  }
  .topbar-spacer {
    padding-top: 70px;
  }
  .sidebar {
    z-index: 990;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 0 5px 1px rgba(0, 0, 0, 0.3);
    bottom: 0;
    top: 0px;
    position: fixed;
    width: 300px;
    padding: 0em;
    padding-top: 60px;
  }
  .content {
    padding-left: 310px;
  }
</style>>

<script lang="ts">
import { defineComponent } from "vue"
import SocketComponent from "../../services/socket"
import AppMenu from "../../components/app/AppMenu.vue"
import AppBar from "../../components/app/AppBar.vue"

export default defineComponent({
  components: { SocketComponent, AppMenu, AppBar }
})
</script>