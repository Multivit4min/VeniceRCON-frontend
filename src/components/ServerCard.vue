<template>
<Card class="p-shadow-10">
  <template #header>
    <img
      :alt="instance.serverinfo.map"
      :src="mapThumbnail"
    />
  </template>
  <template #title>
    <label class="noWrap">{{instance.name}}</label>
  </template>
  <template #subtitle>
    {{instance.host}}:{{instance.port}} ({{instance.id}})
  </template>
  <template #content>    
    <div v-for="data in info" v-bind:key="data.icon" class="text-label">
      <i :class="data.icon"></i> {{data.content}}
    </div>
    <pre v-if="store.state.app.debug">{{JSON.stringify(instance, null, 2)}}</pre>
  </template>
  <template #footer>
      <router-link :to="{ name: 'Instance', params: { instanceId: instance.id }}" style="text-decoration:none" >
        <Button icon="pi pi-check" label="Select" />
      </router-link>
      <PermissionCheck :instance="instanceId" scopes="INSTANCE#UPDATE">
        <Button
          @click="confirmStop($event)"
          v-if="instance.state === 2"
          icon="pi pi-power-off"
          class="p-button-danger"
          style="margin-left: .5em"
          label="Stop"
        />
      </PermissionCheck>
      <PermissionCheck :instance="instanceId" scopes="INSTANCE#UPDATE">
        <Button
          v-if="[4, 6].includes(instance.state)"
          icon="pi pi-play"
          label="Start"
          class="p-button-success"
          style="margin-left: .5em"
          @click="start()"
        />
      </PermissionCheck>
      <PermissionCheck :instance="instanceId" scopes="INSTANCE#UPDATE">
        <Button
          v-if="![2, 4, 6].includes(instance.state)"
          :label="currentState"
          disabled
          class="p-button-warning"
          style="margin-left: .5em"
        />
      </PermissionCheck>
      <PermissionCheck :instance="instanceId" scopes="INSTANCE#DELETE">
        <Button
          @click="confirmRemove($event)"
          icon="pi pi-trash"
          class="p-button-danger"
          style="margin-left: .5em"
        />
      </PermissionCheck>
  </template>
</Card>
</template>

<style scoped>
  .noWrap {
    overflow: hidden;
    white-space: nowrap;
  }
  .text-label {
    padding:2px
  }
</style>

<script>
import { defineComponent } from "vue"
import api from "../services/api"
import { translate } from "../services/battlefield/map"
import { useConfirm } from "primevue/useConfirm"
import { useStore } from "vuex"

export default defineComponent({
  props: {
    instance: {
      type: Object,
      required: true,
      validator: instance => !!instance.id
    }
  },
  data: () => ({
    confirm: useConfirm(),
    store: useStore()
  }),
  computed: {
    instanceId() {
      return this.instance.id
    },
    mapThumbnail() {
      if (this.mapId === "") return require("../assets/images/maps/mp_001.jpg")
      try {
        return require(`../assets/images/maps/${this.mapId.toLowerCase()}.jpg`)
      } catch (e) {
        console.warn(e)
        return require("../assets/images/maps/mp_001.jpg")
      }
    },
    currentState() {
      return this.store.getters.getInstanceState(this.instanceId)
    },
    hasPermission() {
      return scope => this.store.getters.hasPermission(this.instanceId, scope)
    },
    mapId() {
      return this.instance.serverinfo.map || ""
    },
    mapName() {
      return translate
    },
    info() {
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
        content: this.mapName(serverinfo.map) || "?"
      }, {
        icon: "pi pi-star-o",
        content: this.mapName(serverinfo.mode) || "?"
      }]
    }
  },
  methods: {
    start() {
      return api.startInstance(this.instanceId)
    },
    confirmRemove(event) {
      this.confirm.require({
        target: event.currentTarget,
        message: `Confirm Delete`,
        icon: "pi pi-exclamation-triangle",
        accept: () => api.stopInstance(this.instanceId),
        reject: () => null,
        rejectLabel: "Cancel",
        acceptLabel: "Delete"
      })
    },
    confirmStop(event) {
      this.confirm.require({
        target: event.currentTarget,
        message: `Confirm Stop`,
        icon: "pi pi-exclamation-triangle",
        accept: () => api.stopInstance(this.instanceId),
        reject: () => null,
        rejectLabel: "Cancel",
        acceptLabel: "Stop"
      })
    }
  }
})
</script>