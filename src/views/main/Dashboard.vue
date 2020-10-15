<template>
  <div>
    <h3>Dashboard</h3>
    <div class="p-grid">
      <div
        class="p-md-6 p-lg-4"
        v-for="instance in instances"
        v-bind:key="instance.id"
      >
        <Card>
          <template v-slot:header>
            <img :alt="instance.serverinfo.map" src="demo/images/usercard.png">
          </template>
          <template v-slot:title>
            {{instance.serverinfo.name}}
          </template>
          <template v-slot:content>
            <p>{{instance.host}}:{{instance.port}}</p>
          </template>
          <template v-slot:footer>
              <router-link :to="{ name: 'Instance', params: { instanceId: instance.id }}" style="text-decoration:none" >
                <Button icon="pi pi-check" label="Select" />
              </router-link>
              <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" style="margin-left: .5em" />
          </template>
        </Card>
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import store from "../../store/"

@Options({
  computed: {
    instances: () => store.state.instances.instances
  }
})
export default class DashboardComponent extends Vue {

}
</script>
