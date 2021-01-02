<template>
<Card class="p-shadow-10">
  <template #header>
    <img
      :alt="instance.serverinfo.map"
      :src="mapThumbnail"
    />
  </template>
  <template #title>
    <p class="noWrap">{{instance.name}}</p>
  </template>
  <template #subtitle>
    <p>{{instance.host}}:{{instance.port}}</p>
  </template>
  <template #content>    
    <p v-for="data in info" v-bind:key="data.icon">
      <i :class="data.icon"></i> 
      {{data.content}}
    </p>
  </template>
  <template #footer>
      <router-link :to="{ name: 'Instance', params: { instanceId: instance.id }}" style="text-decoration:none" >
        <Button icon="pi pi-check" label="Select" />
      </router-link>
      <PermissionCheck :instance="instanceId" scopes="INSTANCE#UPDATE">
        <ConfirmAction
          :open="confirmStop"
          message="Are you sure that you want to stop the Instance?"
          :onClose="stop"
        />
        <Button
          v-if="instance.state === 2"
          icon="pi pi-power-off"
          label="Stop"
          class="p-button-danger"
          style="margin-left: .5em"
          @click="confirmStop = true"
        />
      </PermissionCheck>
      <PermissionCheck :instance="instanceId" scopes="INSTANCE#UPDATE">
        <Button
          v-if="instance.state === 4"
          icon="pi pi-play"
          label="Start"
          class="p-button-success"
          style="margin-left: .5em"
          @click="start()"
        />
      </PermissionCheck>
      <PermissionCheck :instance="instanceId" scopes="INSTANCE#UPDATE">
        <Button
          v-if="![2, 4].includes(instance.state)"
          :label="currentState"
          disabled
          class="p-button-warning"
          style="margin-left: .5em"
        />
      </PermissionCheck>
      <PermissionCheck :instance="instanceId" scopes="INSTANCE#DELETE">
        <ConfirmAction
          :open="confirmDelete"
          :message="`Delete '${instance.serverinfo.name}'?`"
          :onClose="removeInstance"
        />
        <Button
          icon="pi pi-trash"
          @click="confirmDelete = true"
          class="p-button-danger"
          style="margin-left: .5em"
        />
      </PermissionCheck>
  </template>
</Card>
</template>

<style scoped>
  #noWrap {
    overflow: hidden;
    white-space: nowrap;
  }
</style>

<script lang="ts">
import { PropType, defineComponent } from "vue"
import api from "../services/api"
import store from "../services/store"
import { Instance } from "../types/Instance"
import { translate } from "../services/battlefield/map"
import ConfirmAction from "../components/ConfirmAction.vue"

export default defineComponent({
  props: {
    instance: {
      type: Object as PropType<Instance>,
      required: true,
      validator: (instance: Instance) => !!instance.id
    }
  },
  data: () => ({
    confirmStop: false,
    confirmDelete: false
  }),
  components: {
    ConfirmAction
  },
  computed: {
    instanceId(): number {
      return this.instance.id
    },
    mapThumbnail(): string {
      if (this.mapId === "") return require("../assets/images/maps/mp_001.jpg")
      try {
        return require(`../assets/images/maps/${this.mapId.toLowerCase()}.jpg`)
      } catch (e) {
        console.warn(e)
        return require("../assets/images/maps/mp_001.jpg")
      }
    },
    currentState() {
      return store.getters.getInstanceState(this.instanceId)
    },
    hasPermission() {
      return (scope: string) => store.getters.hasPermission(this.instanceId, scope)
    },
    mapId(): string {
      return this.instance.serverinfo.map || ""
    },
    mapName() {
      return translate
    },
    info(): {icon: string, content: string}[] {
      const { serverinfo } = this.instance
      return [{
        icon: "pi pi-cloud",
        content: this.instance.version === "BF3" ? "Battlefield 3" : "Venice Unleashed"
      }, {
        icon: "pi pi-users pi-sm",
        content: `${serverinfo.slots}/${serverinfo.totalSlots}`
      }, {
        icon: "pi pi-ticket",
        content: (
          Array.isArray(serverinfo.scores) && serverinfo.scores.length > 0 ?
          serverinfo.scores.join("/") :
          "???/???"
        )
      }, {
        icon: "pi pi-map-marker",
        content: this.mapName(serverinfo.map)
      }, {
        icon: "pi pi-star-o",
        content: this.mapName(serverinfo.mode)
      }]
    }
  },
  methods: {
    async stop(confirm: boolean) {
      this.confirmStop = false
      if (confirm) await api.stopInstance(this.instanceId)
    },
    start() {
      return api.startInstance(this.instanceId)
    },
    removeInstance(confirm: boolean) {
      this.confirmDelete = false
      if (confirm) api.deleteInstance(this.instanceId)
    }
  }
})
</script>