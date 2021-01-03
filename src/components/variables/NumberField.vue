<template>
  <div class="p-field">
      <label :for="name">{{label}}</label>
      <div class="p-inputgroup">
        <InputNumber class="p-inputtext-sm" placeholder="Server Name" :id="name" :aria-describedby="`${name}-help`" v-model="value" />
        <Button v-if="originalValue !== value" icon="pi pi-times" class="p-button-danger" @click="value = originalValue" />
        <Button v-if="originalValue !== value" icon="pi pi-check" class="p-button-success" @click="this.update()" />
    </div>
    <small v-if="description" :id="`${name}-help`">{{description}}</small>
  </div>
</template>

<script>
import { defineComponent } from "vue"
import api from "../../services/api"

export default defineComponent({
  props: {
    label: String,
    description: String,
    name: String,
    source: Object
  },
  mounted() {
    this.value = this.originalValue
  },
  data() {
    return {
      value: 0
    }
  },
  computed: {
    parsedName(props) {
      return props.name.replace(/_/g, ".")
    },
    originalValue(props) {
      return parseInt(props.source.vars[props.name], 10)
    }
  },
  methods: {
    async update() {
      await api.updateInstanceVariables(this.source.id, { [this.parsedName]: this.value })
    }
  }
})
</script>