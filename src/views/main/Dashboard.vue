<template>
  <div>
    <PermissionCheck scopes="INSTANCE#CREATE" class="p-grid">
      <div class="p-md-12">
        <AddInstance :open="createInstance" :onClose="() => createInstance = false" />
        <Button label="Add" icon="pi pi-plus" @click="createInstance = true" class="p-mr-2" />
      </div>
    </PermissionCheck>
    <div class="p-grid">
      <div
        class="p-md-4 p-lg-3"
        v-for="instance in instances"
        v-bind:key="instance.id"
      >
        <ServerCard v-bind:instance="instance" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "../../services/store/"
import ServerCard from "../../components/ServerCard.vue"
import AddInstance from "../../components/AddInstance.vue"

export default defineComponent({
  data: () => ({
    createInstance: false
  }),
  computed: {
    instances: () => store.state.instances.instances
  },
  components: {
    ServerCard,
    AddInstance
  }
})
</script>
