<template>
  <div>
    <form class="login">
      <label for="username">Username:</label>
      <input type="text" v-model="username" id="username" />
      <label for="password">Password:</label>
      <input type="password" v-model="password" id="password" />
      <input type="submit" v-on:click="login" />
    </form>
    <button v-on:click="logout">Logout</button>
    <pre>{{JSON.stringify(whoami, null, 2)}}</pre>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import store from "../store"
import { AUTH } from "../store/modules/auth"

@Options({
  props: {
    username: String,
    password: String
  },
  computed: {
    whoami: () => store.state.auth.whoami
  }
})
export default class LoginComponent extends Vue {

  username: string = "admin"
  password: string = "OEaEAoXBv/uqyX9piQ59"

  async logout() {
    await store.dispatch(AUTH.LOGOUT)
  }

  async login() {
    try {
      await store.dispatch(AUTH.LOGIN, {
        username: this.username,
        password: this.password
      })
      console.log(store.state.auth.whoami)
    } catch (e) {
      console.log("could not log you in!", e)
    }
  }

}
</script>
