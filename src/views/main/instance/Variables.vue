<template>
  <div class="p-grid">
    <div class="p-col-12 p-md-2">
      <text-field label="Name" name="vars_serverName" :source="instance" ></text-field>
    </div>
    <div class="p-col-5">
      <text-field label="Server Description" name="vars_serverDescription" :source="instance" ></text-field>
    </div>
    <div class="p-col-12 p-md-5">
      <text-field label="Server Message" name="vars_serverMessage" :source="instance" ></text-field>
    </div>
  </div>
  <div class="p-grid">
    <div class="p-col-12 p-md-2">
      <number-field label="Max Players" name="vars_maxPlayers" :source="instance" ></number-field>
    </div>
  </div>
  <pre v-if="store.state.app.debug">{{JSON.stringify(instance.vars, null, 2)}}</pre>
</template>

<script>
import { defineComponent } from "vue"
import { useStore } from "vuex"
import TextField from "../../../components/variables/TextField.vue"
import NumberField from "../../../components/variables/NumberField.vue"

export default defineComponent({
  data() {
    return {
      store: useStore()
    }
  },
  components: { TextField, NumberField },
  computed: {
    instance(props) {
      return props.store.getters.selectedInstance
    }
  }
})
</script>