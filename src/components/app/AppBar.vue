<template>
  <Toolbar>
    <template #left>
      <router-link to="/dashboard" tag="div" class="logo">VeniceRCON</router-link>
    </template>

    <template #right>
      <Button icon="pi pi-search" class="p-mr-2" />
      <Button icon="pi pi-calendar" class="p-button-success p-mr-2" />
      <Button icon="pi pi-times" class="p-button-danger" />
    </template>
  </Toolbar>
</template>

<style scoped>
  .logo {
    font-weight: 700;
    font-size: 150%;
    color: white;
    margin-left: 1rem;
    text-decoration: none;
  }

  .p-toolbar {
    width: 100%;
    height: 100%;
    padding: 0.3rem 0.3rem;
    background-color: #0388e5;
    border: none;
  }
</style>

<script>
import { defineComponent } from "vue"

export default defineComponent({
})
</script>