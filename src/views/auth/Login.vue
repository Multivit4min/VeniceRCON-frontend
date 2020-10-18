<template>
  <div class="p-grid p-jc-center">
    <div class="p-sm-12 p-md-6 p-lg-4">
      <Card>
        <template #content>
          <form @submit.prevent>
            <div class="p-fluid">
              <div class="p-field">
                <label for="selectedEndpoint">Endpoint</label>
                <div class="p-inputgroup">
                  <Dropdown
                    placeholder="Select Endpoint"
                    :options="endpoints"
                    v-model="selectedEndpoint"
                    id="selectedEndpoint"
                  />
                  <Dialog position="top" :visible="createEndpoint">
                    <template #header>
                      Add Endpoint
                    </template>
                    <div class="p-fluid">
                      <div class="p-field">
                        <label for="newEndpoint">URL to Endpoint</label>
                        <div class="p-inputgroup">
                          <InputText id="newEndpoint" v-model="newEndpoint" />
                        </div>
                      </div>
                    </div>
                    <template #footer>
                      <Button icon="pi pi-times" label="Cancel" @click="createEndpoint = false" />
                      <Button icon="pi pi-check" label="Add" @click="addEndpoint()" autofocus/>
                    </template>
                  </Dialog>
                  <Button icon="pi pi-plus" @click="createEndpoint = true" class="p-button-info"/>
                </div>
              </div>
              <div class="p-field">
                <label for="username">Username</label>
                <InputText id="username" v-model="username" />
              </div>
              <div class="p-field">
                <label for="password">Password</label>
                <InputText type="password" id="password" v-model="password" />
              </div>
            </div>
          </form>
        </template>
        <template #footer>
          <Button label="Login" @click="login()" autofocus/>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "../../services/store"
import { AUTH } from "../../services/store/modules/auth"
import { APP } from "../../services/store/modules/app"

export default defineComponent({
  data() {
    return {
      newEndpoint: "",
      createEndpoint: false,
      username: "admin",
      password: ""
    }
  },
  computed: {
    endpoints: () => store.state.app.endpoints,
    selectedEndpoint: {
      get() {
        console.log({
          endpoint: store.state.app.endpoint,
          endpoints: store.state.app.endpoints,
          value: store.state.app.endpoints[store.state.app.endpoint]
        })
        return store.state.app.endpoints[store.state.app.endpoint]
      },
      set(name) {
        console.log("selectedEndpoint", { name })
        store.commit(APP.SELECT_ENDPOINT, { name })
      }
    },
  },
  methods: {
    /** checks if the endpoint provided is a valid endpoint */
    async testEndpoint() {
      const res = await fetch(this.getApiLocation(this.newEndpoint))
      const data = await res.json()
      if (typeof data !== "object" || data.name !== "VeniceRCON-api")
        throw new Error("invalid response received from endpoint")
    },
    /** parses the url string and tries to fetch the correct api endpoint url */
    getApiLocation(endpoint: string) {
      if (endpoint.endsWith("/")) endpoint = endpoint.slice(0, -1)
      if (endpoint.endsWith("/api")) return endpoint
      return `${endpoint}/api`
    },
    async addEndpoint() {
      await this.testEndpoint()
      store.dispatch(APP.ADD_LOCATION, { url: this.newEndpoint })
      this.newEndpoint = ""
      this.createEndpoint = false
    },
    async login() {
      try {
        await store.dispatch(AUTH.LOGIN, {
          username: this.username,
          password: this.password
        })
        await this.$router.push("/dashboard")
      } catch (e) {
        //@ts-ignore
        this.$toast.add({
          severity: "error",
          detail: "check username and password",
          summary: "login failed",
          life: 4000
        })
      }
    }
  }
})
</script>
