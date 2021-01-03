<template>
  <Toolbar>
    <template #left>
      <router-link to="/dashboard" tag="div" class="logo">VeniceRCON</router-link>
    </template>

    <template #right>
      <Button type="button" @click="accountClick($event)" :label="token.username" icon="pi pi-user" class="p-button-warning account" />
    </template>
  </Toolbar>
  <ContextMenu :model="accountMenu" ref="accountMenu" />
</template>

<style scoped>
  .logo {
    font-weight: 700;
    font-size: 150%;
    color: white;
    margin-left: 1rem;
    text-decoration: none;
  }

  .account {
    color: white;
    text-decoration: none;
    font-weight: 500;
    margin-right: 1rem;
  }

  .p-toolbar {
    width: 100%;
    height: 100%;
    padding: 0.3rem 0.3rem;
    background-color: #0388e5;
    border: none;
  }
</style>

<script>
import { defineComponent } from "vue"
import store from "../../services/store"
import { APP } from "../../services/store/modules/app"

export default defineComponent({
  data() {
    return {
      timeout: null,
      clickCount: 0,
      accountMenu: [{
        label: "Settings",
        icon: "pi pi-fw pi-cog",
        to: "/settings"
      }, {
        label: "File",
        icon: "pi pi-fw pi-file"
      }, {
        separator:true
      }, {
        label: "Logout",
        to: "/logout"
      }]
    }
  },
  computed: {
    token: () => store.state.auth.whoami.token
  },
  methods: {
    accountClick(event) {
      clearTimeout(this.timeout)
      this.clickCount++
      if (this.clickCount > 10) store.commit(APP.DEBUG, true)
      this.timeout = setTimeout(() => this.clickCount = 0, 500)
      this.$refs.accountMenu.show(event)
    }
  }
})
</script>