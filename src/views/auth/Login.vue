<template>
  <div>
    <form class="login">
      <div>
        <label for="createEndpoint">create api endpoint?</label>
        <input type="checkbox" v-model="createEndpoint" id="createEndpoint">
      </div>
      <span v-if="createEndpoint">
        <div>
          <label for="newEndpointName">Name:</label>
          <input type="text" v-model="newEndpointName" id="newEndpointName">
        </div>
        <div>
          <label for="newEndpointLocation">Endpoint:</label>
          <input type="text" v-model="newEndpointLocation" id="newEndpointLocation">
        </div>
        <div>
          <input type="button" value="Add Endpoint" @click="addEndpoint" />
        </div>
      </span>
      <div>
        <label for="selectedEndpoint">Endpoint:</label>
        <select :value="selectedEndpoint" id="selectedEndpoint" @input="updateEndpoint">
          <option
            v-for="(value, name) in endpoints"
            v-bind:value="name"
            v-bind:key="name"
          >
            {{`${name} - ${value}`}}
          </option>
        </select>
      </div>
      <div>
        <label for="username">Username:</label>
        <input type="text" v-model="username" id="username">
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password">
      </div>
      <input type="submit" @click="login" value="Send">
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import store from "../../store"
import { AUTH } from "../../store/modules/auth"
import { APP } from "../../store/modules/app"
import router from "../../router"


@Options({
  props: {
    username: String,
    password: String
  },
  computed: {
    endpoints: () => store.state.app.endpoints,
    selectedEndpoint: () => store.state.app.endpoint
  }
})
export default class LoginComponent extends Vue {

  newEndpointLocation: string = ""
  newEndpointName: string = ""
  createEndpoint: boolean = false
  username: string = "admin"
  password: string = ""

  /** checks if the endpoint provided is a valid endpoint */
  async testEndpoint() {
    const res = await fetch(this.getApiLocation(this.newEndpointLocation))
    const data = await res.json()
    if (typeof data !== "object" || data.name !== "VeniceRCON-api")
      throw new Error("invalid response received from endpoint")
  }

  /** parses the url string and tries to fetch the correct api endpoint url */
  private getApiLocation(endpoint: string) {
    if (endpoint.endsWith("/")) endpoint = endpoint.slice(0, -1)
    if (endpoint.endsWith("/api")) return endpoint
    return `${endpoint}/api`
  }

  updateEndpoint(event: InputEvent) {
    if (!event.target) return
    //@ts-ignore
    store.commit(APP.SELECT_ENDPOINT, { name: event.target.value })
  }

  async addEndpoint() {
    await this.testEndpoint()
    store.dispatch(APP.ADD_LOCATION, {
      name: this.newEndpointName,
      location: this.newEndpointLocation
    })
    this.newEndpointLocation = ""
    this.newEndpointName = ""
    this.createEndpoint = false
  }

  async login() {
    try {
      await store.dispatch(AUTH.LOGIN, {
        username: this.username,
        password: this.password
      })
      await router.push("/dashboard")
    } catch (e) {
      console.log("could not log you in!", e)
    }
  }

}
</script>
