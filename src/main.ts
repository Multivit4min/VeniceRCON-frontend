import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIOExt from "vue-socket.io-extended"
import "./socket"

createApp(App)
  .use(store)
  .use(router)
  .mount("#app")
