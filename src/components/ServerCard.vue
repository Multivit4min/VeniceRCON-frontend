<template>
<Card class="p-shadow-5">
  <template #header>
    <img :alt="instance.serverinfo.map" src="@/assets/images/battlefield3.png">
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
        :disabled="hasPermission('INSTANCE#MODIFY')"
        @click="confirmStop = true"
      />
      <Button
        v-if="instance.state === 4"
        icon="pi pi-play"
        label="Start"
        class="p-button-success"
        style="margin-left: .5em"
        :disabled="hasPermission('INSTANCE#MODIFY')"
        @click="start()"
      />
      <Button
        v-if="![2, 4].includes(instance.state)"
        :label="currentState"
        disabled
        class="p-button-warning"
        style="margin-left: .5em"
      />
  </template>
</Card>
</template>


<script lang="ts">
import { PropType, defineComponent } from "vue"
import { start, stop } from "../services/api/instance"
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
    confirmStop: false
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
    }
  }
})
</script>