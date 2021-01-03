<template>
  <Menu :model="items" />
</template>

<style scoped>
  .p-menu {
    width: 100%;
    border: none;
  }

  .p-menuitem-text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>

<script>
import { defineComponent } from "vue"
import router from "../../services/router"
import store from "../../services/store"

export default defineComponent({
  data() {
    return {
      items: [],
      unwatch: undefined
    }
  },
  mounted() {
    this.updateNavbarItems()
    router.afterEach(async () => this.updateNavbarItems())
    this.unwatch = store.watch(
      state => state.instances.instances.length,
      () => this.updateNavbarItems())
  },
  unmounted() {
    if (this.unwatch) this.unwatch()
  },
  methods: {
    menu(props) {
      const route = router.currentRoute.value
      if (route.path.endsWith(props.to)) props.style = "background:rgb(225 232 241)"
      return props
    },
    updateNavbarItems() {
      switch (router.currentRoute.value.name) {
        case "Dashboard":
          return this.displayServers()
        default:
          return this.displayInstanceProperties()
      }
    },    
    displayServers() {
      const servers = store.state.instances.instances.map(instance => ({
        label: `${instance.name}`,
        to: `/${instance.id}`
      })).reduce((acc, curr) => {
        return [...acc, curr, { separator: true }]
      }, [])
      this.items = [{
        label: "Servers",
        style: "font-weight:700"
      }, ...servers]
    },
    displayInstanceProperties() {
      const instance = store.getters.selectedInstance
      const items = [{
        label: instance ? instance.name : "Server",
        items: [this.menu({
          label: "Players",
          to: "players",
          icon: "pi pi-eye"
        }), this.menu({
          label: "Variables",
          to: "variables",
          icon: "pi pi-sliders-h"
        })]
      }]
      this.items = items
    }
  }
})
</script>