<template>
  <Dialog position="top" :visible="open" :closable="false">
    <template #header>
      Add Instance
    </template>
    <Message v-if="error" severity="error">{{error}}</Message>
    <form @submit.prevent>
      <div class="p-fluid">
        <div class="p-field">
          <label for="host">Host</label>
          <InputText id="host" placeholder="example.com" v-model="host" />
        </div>
        <div class="p-field">
          <label for="port">Port</label>
          <InputNumber id="port" placeholder="47200" v-model="port" :min="1024" :max="65535" :format="false" />
        </div>
        <div class="p-field">
          <label for="password">Password</label>
          <InputText id="password" v-model="password" />
        </div>
      </div>
    </form>
    <template #footer>
      <Button icon="pi pi-times" label="Cancel" @click="close()" />
      <Button icon="pi pi-question" label="Test Connection" :disabled="busy" v-if="!tested" @click="test()" />
      <Button icon="pi pi-check" label="Add Server" :disabled="busy" v-if="tested" @click="save()" />
    </template>
  </Dialog>
</template>


<script lang="ts">
import { defineComponent, PropType } from "vue"
import Dialog from "primevue/dialog"
import api from "../services/api"
import Message from "primevue/message"

const initialState = () => ({
    error: null,
    busy: false,
    tested: false,
    host: "",
    port: 47200,
    password: ""
})

export default defineComponent({
  name: "AddInstance",
  props: {
    open: Boolean,
    onClose: Function as PropType<() => void>
  },
  data: initialState,
  components: {
    Dialog,
    Message
  },
  watch: {
    host() { this.tested = false },
    port() { this.tested = false },
    password() { this.tested = false },
  },
  methods: {
    /** gets the connection object */
    getConnectionInfo(test: boolean = false) {
      return { test, host: this.host, port: this.port, password: this.password }
    },
    /** closes the dialog */
    close() {
      if (typeof this.onClose !== "function") return
      Object.assign(this, initialState())
      this.onClose()
    },
    /** saves the connection */
    async save() {
      if (!this.tested) return
      this.busy = true
      try {
        await api.createInstance(this.getConnectionInfo())
      } catch (error) {
        if (error.body && error.body.message) {
          this.error = error.body.message
        } else {
          this.error = error.message
        }
      }
      this.busy = false
      this.close()
    },
    /** tests the connection */
    async test() {
      this.busy = true
      try {
        await api.createInstance(this.getConnectionInfo(true))
        this.tested = true
      } catch (error) {
        if (error.body && error.body.message) {
          this.error = error.body.message
        } else {
          this.error = error.message
        }
      }
      this.busy = false
    }
  }
})
</script>