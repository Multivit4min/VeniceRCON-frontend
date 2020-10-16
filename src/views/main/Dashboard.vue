<template>
  <div>
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

export default defineComponent({
  computed: {
    instances: () => store.state.instances.instances
  },
  components: {
    ServerCard
  }
})
</script>
