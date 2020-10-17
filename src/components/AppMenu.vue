<template>
  <div>
    <MenuBar :model="items">
      <template #start>
          VeniceRcon
      </template>
      <template #end>
        <Button @click="showConsole = !showConsole" label="Console" />
      </template>
    </MenuBar>
    <Console :instanceId="instanceId" v-if="showConsole" :height="40" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import MenuBar from "primevue/menubar"
import store from "../services/store"
import Console from "./Console.vue"
import router from "../services/router"

export default defineComponent({
  data: () => ({
    showConsole: false,
    items: [{
      label: "Dashboard",
      icon: "pi pi-fw pi-home",
      to: "/dashboard"
    }, {
      label: store.state.auth.whoami!.token.username,
      icon: "pi pi-fw pi-cog",
      items: [{
        label: "Logout",
        icon: "pi pi-fw pi-trash",
        to: "/logout"
      }]
    }]
  }),
  computed: {
    instanceId() {
      const id = router.currentRoute.value.params.instanceId
      if (typeof id !== "string") return 0
      return parseInt(id, 10)
    }
  },
  components: {
    MenuBar,
    Console
  }  
})
</script>