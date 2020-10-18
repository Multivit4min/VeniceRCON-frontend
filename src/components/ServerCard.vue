<template>
<Card class="p-shadow-5">
  <template #header>
    <img :alt="instance.serverinfo.map" :src="`https://eaassets-a.akamaihd.net/bl-cdn/cdnprefix/production-284-20170531/public/base/bf3/map_images/992x164/${instance.serverinfo.map.toLowerCase()}.jpg`">
  </template>
  <template #title>
    {{instance.serverinfo.name}}
  </template>
  <template #subtitle>
    <p>{{instance.serverinfo.address}}</p>
  </template>
  <template #content>
    <p>
      <i class="pi pi-users pi-sm"></i> 
      {{instance.serverinfo.slots}}/{{instance.serverinfo.totalSlots}}
    </p>
    <p>
      <i class="pi pi-map-marker"></i> 
      {{mapName(instance.serverinfo.map)}}
    </p>
    <p>
      <i class="pi pi-star-o"></i> 
      {{mapName(instance.serverinfo.mode)}}
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


<script lang="ts">
import { PropType, defineComponent } from "vue"
import { deleteInstance, start, stop } from "../services/api/instance"
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
      //@ts-ignore
      return this.instance.id
    },
    currentState() {
      return store.getters.getInstanceState(this.instanceId)
    },
    hasPermission() {
      return (scope: string) => store.getters.hasPermission(this.instanceId, scope)
    },
    mapName() {
      return translate
    }
  },
  methods: {
    async stop(confirm: boolean) {
      this.confirmStop = false
      if (confirm) await stop(this.instanceId)
    },
    start() {
      return start(this.instanceId)
    },
    removeInstance(confirm: boolean) {
      this.confirmDelete = false
      if (confirm) deleteInstance(this.instanceId)
    }
  }
})
</script>