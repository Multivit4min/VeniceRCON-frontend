<template>
  <div>
    You have been logged out!
    <router-link to="/login">Goto Login</router-link>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component"
import store from "../../store"
import { AUTH } from "../../store/modules/auth"


export default class LoginComponent extends Vue {

  async mounted() {
    await this.logout()
  }

  async logout() {
    await store.dispatch(AUTH.LOGOUT)
  }

}
</script>
